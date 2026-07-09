@echo off
chcp 65001 >nul
echo =========================================
echo  《宿命回响：残响之途》 开发服务器启动
echo =========================================
echo.
echo 正在启动前端和后端...
echo.

:: 切换到脚本所在目录
cd /d "%~dp0"

:: 使用 npm run dev 启动前后端
call npm run dev

pause
