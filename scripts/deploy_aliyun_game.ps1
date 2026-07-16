param(
  [string]$HostIp = "120.76.196.227",
  [string]$User = "root"
)
$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Tmp = Join-Path $Root "tmp\aliyun_deploy"
$WebStage = Join-Path $Tmp "web"
$ServerStage = Join-Path $Tmp "server"
$WebTar = Join-Path $Tmp "game-web.tar.gz"
$ServerTar = Join-Path $Tmp "game-server.tar.gz"

function Copy-IfExists($src, $dstDir) {
  $p = Join-Path $Root $src
  if (Test-Path $p) { Copy-Item -LiteralPath $p -Destination $dstDir -Recurse -Force }
}

Write-Host "[1/6] Build frontend"
Push-Location $Root
npm run portrait:build
Pop-Location

Write-Host "[2/6] Stage web files"
Remove-Item -LiteralPath $Tmp -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $WebStage,$ServerStage | Out-Null
Copy-Item -LiteralPath (Join-Path $Root "dist\*") -Destination $WebStage -Recurse -Force

$rootFiles = @(
  "vfx.js","vfx_advanced.js","vfx_teabreak.js","vfx_transition.js","vfx_ultimate.js","vfx_dysregulation.js",
  "audio_manager.js","vfx_boss.js","assets_data.js","ui_settings_data.js","runtime_config_data.js",
  "avatar_style_data.js","musicart_data.js","musicart_detail_data.js","relationship_data.js","tea_break_scene_data.js",
  "ai_teabreak_data.js","gacha_data.js","event_pool_data.js","game.js","ui_interaction_patch.js","gacha_overhaul.js",
  "style.css","responsive-overrides.css","gacha_overhaul.css","ui-remaster.css"
)
foreach($f in $rootFiles){ Copy-IfExists $f $WebStage }
Copy-IfExists "assets" $WebStage
New-Item -ItemType Directory -Force -Path (Join-Path $WebStage "src") | Out-Null
Copy-IfExists "src\styles" (Join-Path $WebStage "src")

Write-Host "[3/6] Stage backend files"
Get-ChildItem -LiteralPath (Join-Path $Root "server") -Force | Where-Object {
  $_.Name -notin @(".venv","__pycache__",".env")
} | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination $ServerStage -Recurse -Force
}

Write-Host "[4/6] Create tar.gz packages"
Remove-Item $WebTar,$ServerTar -Force -ErrorAction SilentlyContinue
tar -czf $WebTar -C $WebStage .
tar -czf $ServerTar -C $ServerStage .
Get-Item $WebTar,$ServerTar | Select-Object FullName,Length

Write-Host "[5/6] Upload packages to server. 输入你自己设置的服务器密码；密码不会显示。"
scp $WebTar "$User@$HostIp`:/tmp/game-web.tar.gz"
scp $ServerTar "$User@$HostIp`:/tmp/game-server.tar.gz"
scp (Join-Path $Root "scripts\server_init_aliyun.sh") "$User@$HostIp`:/tmp/server_init_aliyun.sh"

Write-Host "[6/6] Run server init"
ssh "$User@$HostIp" "bash /tmp/server_init_aliyun.sh"
Write-Host "部署完成： http://$HostIp/"
