# Detective Sigma - ComfyUI Tunnel Starter
# This script starts a Cloudflare quick tunnel and optionally updates Vercel

param(
    [switch]$AutoUpdateVercel,
    [string]$VercelToken = $env:VERCEL_TOKEN,
    [string]$VercelProjectId = "prj_detective-sigma"  # Update with your project ID
)

$ErrorActionPreference = "Stop"
$cloudflaredPath = "E:\GitHub\Detective_Sigma\app\cloudflared.exe"
$comfyuiUrl = "http://localhost:8188"
$logFile = "$PSScriptRoot\tunnel.log"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Detective Sigma - ComfyUI Tunnel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if ComfyUI is running
Write-Host "Checking if ComfyUI is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $comfyuiUrl -TimeoutSec 5 -UseBasicParsing
    Write-Host "ComfyUI is running!" -ForegroundColor Green
} catch {
    Write-Host "WARNING: ComfyUI doesn't seem to be running at $comfyuiUrl" -ForegroundColor Red
    Write-Host "Start ComfyUI first, then run this script." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") { exit 1 }
}

# Kill any existing tunnel processes
Write-Host "Stopping any existing tunnels..." -ForegroundColor Yellow
Get-Process -Name "cloudflared" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start the tunnel and capture output
Write-Host "Starting Cloudflare tunnel..." -ForegroundColor Yellow
Write-Host ""

$tunnelUrl = $null
$process = Start-Process -FilePath $cloudflaredPath `
    -ArgumentList "tunnel", "--url", $comfyuiUrl `
    -RedirectStandardError $logFile `
    -PassThru `
    -NoNewWindow

# Wait for tunnel URL to appear in log
Write-Host "Waiting for tunnel URL..." -ForegroundColor Yellow
$maxWait = 30
$waited = 0

while ($waited -lt $maxWait) {
    Start-Sleep -Seconds 1
    $waited++

    if (Test-Path $logFile) {
        $content = Get-Content $logFile -Raw
        if ($content -match "(https://[a-z0-9\-]+\.trycloudflare\.com)") {
            $tunnelUrl = $matches[1]
            break
        }
    }

    Write-Host "." -NoNewline -ForegroundColor Gray
}

Write-Host ""

if (-not $tunnelUrl) {
    Write-Host "ERROR: Could not get tunnel URL after $maxWait seconds" -ForegroundColor Red
    Write-Host "Check log file: $logFile" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " TUNNEL ACTIVE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Tunnel URL: " -NoNewline -ForegroundColor White
Write-Host $tunnelUrl -ForegroundColor Cyan
Write-Host ""

# Copy to clipboard
$tunnelUrl | Set-Clipboard
Write-Host "(URL copied to clipboard)" -ForegroundColor Gray
Write-Host ""

# Save URL to file for reference
$tunnelUrl | Out-File -FilePath "$PSScriptRoot\current-tunnel-url.txt" -Encoding utf8

# Auto-update Vercel if requested
if ($AutoUpdateVercel -and $VercelToken) {
    Write-Host "Updating Vercel environment variable..." -ForegroundColor Yellow

    try {
        # Use Vercel CLI to update the env var
        $env:VERCEL_TOKEN = $VercelToken
        vercel env rm COMFYUI_REMOTE_URL production --yes 2>$null
        $tunnelUrl | vercel env add COMFYUI_REMOTE_URL production

        Write-Host "Vercel COMFYUI_REMOTE_URL updated!" -ForegroundColor Green
        Write-Host "Note: You may need to redeploy for changes to take effect." -ForegroundColor Yellow
    } catch {
        Write-Host "Failed to update Vercel: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Manual update required:" -ForegroundColor Yellow
        Write-Host "1. Go to: https://vercel.com/titangsss-projects/detective-sigma/settings/environment-variables" -ForegroundColor White
        Write-Host "2. Update COMFYUI_REMOTE_URL to: $tunnelUrl" -ForegroundColor White
    }
} else {
    Write-Host "To use images on Vercel, update the environment variable:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Go to Vercel Dashboard > Settings > Environment Variables" -ForegroundColor White
    Write-Host "2. Set COMFYUI_REMOTE_URL = $tunnelUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or run with auto-update:" -ForegroundColor Gray
    Write-Host "  .\start-comfyui-tunnel.ps1 -AutoUpdateVercel -VercelToken 'your-token'" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Tunnel is running. Press Ctrl+C to stop" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Keep script running
try {
    Wait-Process -Id $process.Id
} catch {
    Write-Host "Tunnel stopped." -ForegroundColor Yellow
}
