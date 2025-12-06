@echo off
title Detective Sigma - ComfyUI Tunnel
color 0B

echo.
echo ========================================
echo  Detective Sigma - ComfyUI Tunnel
echo ========================================
echo.
echo This script will:
echo  1. Start a Cloudflare tunnel to ComfyUI
echo  2. Copy the tunnel URL to your clipboard
echo  3. Save the URL to scripts\current-tunnel-url.txt
echo.
echo Make sure ComfyUI is running first!
echo.

REM Run the PowerShell script
powershell -ExecutionPolicy Bypass -File "%~dp0scripts\start-comfyui-tunnel.ps1"

pause
