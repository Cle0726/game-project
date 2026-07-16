import argparse
import getpass
import os
import posixpath
import shutil
import subprocess
import sys
import tarfile
from pathlib import Path

import paramiko

ROOT = Path(__file__).resolve().parents[1]
TMP = ROOT / 'tmp' / 'aliyun_deploy_paramiko'
WEB_STAGE = TMP / 'web'
SERVER_STAGE = TMP / 'server'
WEB_TAR = TMP / 'game-web.tar.gz'
SERVER_TAR = TMP / 'game-server.tar.gz'
INIT_SCRIPT = ROOT / 'scripts' / 'server_init_aliyun.sh'

ROOT_FILES = [
    'vfx.js','vfx_advanced.js','vfx_teabreak.js','vfx_transition.js','vfx_ultimate.js','vfx_dysregulation.js',
    'audio_manager.js','vfx_boss.js','assets_data.js','ui_settings_data.js','runtime_config_data.js',
    'avatar_style_data.js','musicart_data.js','musicart_detail_data.js','relationship_data.js','tea_break_scene_data.js',
    'ai_teabreak_data.js','gacha_data.js','event_pool_data.js','game.js','ui_interaction_patch.js','gacha_overhaul.js',
    'style.css','responsive-overrides.css','gacha_overhaul.css','ui-remaster.css',
]


def run_local(cmd):
    print('+', ' '.join(cmd), flush=True)
    subprocess.run(cmd, cwd=ROOT, check=True)


def copy_path(src: Path, dst_dir: Path):
    if not src.exists():
        return
    dst = dst_dir / src.name
    if src.is_dir():
        shutil.copytree(src, dst, dirs_exist_ok=True)
    else:
        shutil.copy2(src, dst)


def make_tar(src_dir: Path, tar_path: Path):
    if tar_path.exists():
        tar_path.unlink()
    with tarfile.open(tar_path, 'w:gz') as tf:
        for p in src_dir.rglob('*'):
            if p.is_dir():
                continue
            tf.add(p, arcname=p.relative_to(src_dir).as_posix(), recursive=False)


def stage():
    print('[1/5] Build frontend')
    run_local(['npm.cmd' if os.name == 'nt' else 'npm', 'run', 'portrait:build'])

    print('[2/5] Stage files')
    if TMP.exists():
        shutil.rmtree(TMP)
    WEB_STAGE.mkdir(parents=True)
    SERVER_STAGE.mkdir(parents=True)

    dist = ROOT / 'dist'
    for p in dist.iterdir():
        copy_path(p, WEB_STAGE)
    for name in ROOT_FILES:
        copy_path(ROOT / name, WEB_STAGE)
    copy_path(ROOT / 'assets', WEB_STAGE)
    (WEB_STAGE / 'src').mkdir(exist_ok=True)
    copy_path(ROOT / 'src' / 'styles', WEB_STAGE / 'src')

    server = ROOT / 'server'
    skip = {'.venv', '__pycache__', '.env'}
    for p in server.iterdir():
        if p.name in skip:
            continue
        copy_path(p, SERVER_STAGE)

    print('[3/5] Create archives')
    make_tar(WEB_STAGE, WEB_TAR)
    make_tar(SERVER_STAGE, SERVER_TAR)
    print('  web:', WEB_TAR, WEB_TAR.stat().st_size, 'bytes')
    print('  server:', SERVER_TAR, SERVER_TAR.stat().st_size, 'bytes')


def ssh_connect(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=host, username=user, password=password, port=22, timeout=20, look_for_keys=False, allow_agent=False)
    return client


def upload(sftp, local: Path, remote: str):
    print(f'  upload {local.name} -> {remote}', flush=True)
    sftp.put(str(local), remote)


def run_remote(client, cmd):
    print('+ remote:', cmd, flush=True)
    stdin, stdout, stderr = client.exec_command(cmd, get_pty=True)
    code = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out:
        print(out, end='')
    if err:
        print(err, end='', file=sys.stderr)
    if code != 0:
        raise RuntimeError(f'remote command failed with exit code {code}')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', default='120.76.196.227')
    parser.add_argument('--user', default='root')
    args = parser.parse_args()

    stage()
    password = getpass.getpass(f'请输入 {args.user}@{args.host} 的服务器密码（输入时不显示）：')

    print('[4/5] Connect and upload')
    client = ssh_connect(args.host, args.user, password)
    try:
        sftp = client.open_sftp()
        upload(sftp, WEB_TAR, '/tmp/game-web.tar.gz')
        upload(sftp, SERVER_TAR, '/tmp/game-server.tar.gz')
        upload(sftp, INIT_SCRIPT, '/tmp/server_init_aliyun.sh')
        sftp.close()

        print('[5/5] Initialize server')
        run_remote(client, 'bash /tmp/server_init_aliyun.sh')
    finally:
        client.close()

    print(f'部署完成： http://{args.host}/')


if __name__ == '__main__':
    main()
