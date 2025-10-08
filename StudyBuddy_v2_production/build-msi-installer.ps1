# Study Buddy - Advanced Installer Setup
# Creates an MSI installer using WiX Toolset
# Prerequisites: Install WiX Toolset v3.11.2 or later

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Study Buddy - MSI Installer Builder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if WiX is installed
$wixPath = "${env:ProgramFiles(x86)}\WiX Toolset v3.11\bin"
if (-not (Test-Path $wixPath)) {
    Write-Host "ERROR: WiX Toolset not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install WiX Toolset from:" -ForegroundColor Yellow
    Write-Host "https://wixtoolset.org/releases/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or use the simpler build-installer.bat script" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Add WiX to PATH
$env:PATH = "$wixPath;$env:PATH"

# Step 1: Build the application
Write-Host "[1/3] Building application..." -ForegroundColor Yellow
& "$PSScriptRoot\build-installer.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Compile WiX source
Write-Host "[2/3] Compiling WiX installer..." -ForegroundColor Yellow
$wixFile = "StudyBuddy-Installer.wxs"
if (-not (Test-Path $wixFile)) {
    Write-Host "ERROR: WiX source file not found: $wixFile" -ForegroundColor Red
    Write-Host "Please create the WiX configuration file first." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

& candle.exe $wixFile -out "StudyBuddy-Installer.wixobj"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: WiX compilation failed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 3: Link and create MSI
Write-Host "[3/3] Creating MSI package..." -ForegroundColor Yellow
& light.exe "StudyBuddy-Installer.wixobj" -out "StudyBuddy-Setup.msi"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: MSI creation failed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Cleanup
Remove-Item "StudyBuddy-Installer.wixobj" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MSI Installer Created Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Installer file: " -NoNewline
Write-Host "StudyBuddy-Setup.msi" -ForegroundColor Yellow
Write-Host ""

Read-Host "Press Enter to exit"
