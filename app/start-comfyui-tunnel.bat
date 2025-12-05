@echo off
echo ========================================
echo   ComfyUI Cloudflare Tunnel Starter
echo   Detective Sigma - Image Generation
echo ========================================
echo.
echo Starting Cloudflare Tunnel to expose ComfyUI...
echo Make sure ComfyUI is running on localhost:8188
echo.
echo The tunnel URL will appear below - copy it to your Vercel environment variables:
echo   Variable name: COMFYUI_REMOTE_URL
echo.
echo Press Ctrl+C to stop the tunnel when done.
echo ========================================
echo.

"%~dp0cloudflared.exe" tunnel --url http://localhost:8188
