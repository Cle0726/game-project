#!/usr/bin/env bash
set -euo pipefail

APP_USER="gameapp"
WEB_DIR="/var/www/suming-game"
APP_DIR="/opt/suming-game"
SERVER_DIR="$APP_DIR/server"
PY_BIN="python3.11"
PIP_BIN="pip3.11"

echo "[1/7] Install packages"
if command -v dnf >/dev/null 2>&1; then
  dnf install -y nginx python3.11 python3.11-pip tar gzip firewalld || dnf install -y nginx python3.11 python3.11-pip tar gzip
elif command -v yum >/dev/null 2>&1; then
  yum install -y nginx python3.11 python3.11-pip tar gzip firewalld || yum install -y nginx python3.11 python3.11-pip tar gzip
else
  echo "Unsupported package manager" >&2
  exit 1
fi

echo "[2/7] Create app user/dirs"
id -u "$APP_USER" >/dev/null 2>&1 || useradd --system --create-home --shell /sbin/nologin "$APP_USER"
mkdir -p "$WEB_DIR" "$SERVER_DIR" "$APP_DIR/data"

echo "[3/7] Deploy web files"
rm -rf "$WEB_DIR"/*
tar -xzf /tmp/game-web.tar.gz -C "$WEB_DIR"
chown -R nginx:nginx "$WEB_DIR" || chown -R root:root "$WEB_DIR"

echo "[4/7] Deploy backend files"
rm -rf "$SERVER_DIR"/*
tar -xzf /tmp/game-server.tar.gz -C "$SERVER_DIR"
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

if [ ! -f "$SERVER_DIR/.env" ]; then
  SECRET="$(python3 - <<'PY'
import secrets
print(secrets.token_urlsafe(48))
PY
)"
  cat > "$SERVER_DIR/.env" <<EOF
ENVIRONMENT=production
DATABASE_URL=sqlite:///$APP_DIR/data/game_data.db
JWT_SECRET_KEY=$SECRET
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=72
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
EOF
  chown "$APP_USER:$APP_USER" "$SERVER_DIR/.env"
  chmod 600 "$SERVER_DIR/.env"
fi

echo "[5/7] Python venv and dependencies"
cd "$SERVER_DIR"
$PY_BIN -m venv .venv
. .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
chown -R "$APP_USER:$APP_USER" "$SERVER_DIR/.venv" "$APP_DIR/data"

echo "[6/7] Configure systemd and nginx"
cat > /etc/systemd/system/suming-game-api.service <<EOF
[Unit]
Description=Suming Game FastAPI backend
After=network.target

[Service]
Type=simple
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$SERVER_DIR
EnvironmentFile=$SERVER_DIR/.env
ExecStart=$SERVER_DIR/.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/nginx/conf.d/suming-game.conf <<'EOF'
server {
    listen 80 default_server;
    server_name _;

    root /var/www/suming-game;
    index index.html;

    client_max_body_size 20m;

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(?:js|css|png|jpg|jpeg|gif|svg|webp|mp3|wav|ogg|mp4|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}
EOF

# Disable conflicting default server when present.
if [ -f /etc/nginx/conf.d/default.conf ]; then
  mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak.$(date +%Y%m%d%H%M%S)
fi

nginx -t
systemctl daemon-reload
systemctl enable --now suming-game-api.service
systemctl enable --now nginx
systemctl restart suming-game-api.service
systemctl restart nginx

if systemctl list-unit-files | grep -q '^firewalld'; then
  systemctl enable --now firewalld || true
  firewall-cmd --permanent --add-service=http || true
  firewall-cmd --permanent --add-service=https || true
  firewall-cmd --permanent --add-service=ssh || true
  firewall-cmd --reload || true
fi

echo "[7/7] Verify"
systemctl --no-pager --full status suming-game-api.service | head -n 20 || true
systemctl --no-pager --full status nginx | head -n 20 || true
curl -I http://127.0.0.1/ || true
curl -s http://127.0.0.1/api/auth 2>/dev/null || true

echo "DONE: open http://120.76.196.227/"
