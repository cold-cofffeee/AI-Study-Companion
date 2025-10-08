# Study Buddy - Prerequisites Checker
# Verifies that all required tools are installed

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Study Buddy - Prerequisites Checker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check .NET SDK
Write-Host "Checking .NET SDK..." -NoNewline
try {
    $dotnetVersion = & dotnet --version 2>$null
    if ($dotnetVersion -match '^8\.') {
        Write-Host " ? Found v$dotnetVersion" -ForegroundColor Green
    } else {
        Write-Host " ? Found v$dotnetVersion (Need 8.0+)" -ForegroundColor Yellow
        $allGood = $false
    }
} catch {
    Write-Host " ? Not installed" -ForegroundColor Red
    Write-Host "   Download from: https://dotnet.microsoft.com/download/dotnet/8.0" -ForegroundColor Yellow
    $allGood = $false
}

# Check WiX (optional)
Write-Host "Checking WiX Toolset (optional)..." -NoNewline
$wixPath = "${env:ProgramFiles(x86)}\WiX Toolset v3.11\bin"
if (Test-Path $wixPath) {
    Write-Host " ? Installed" -ForegroundColor Green
    Write-Host "   Can create MSI installers" -ForegroundColor Gray
} else {
    Write-Host " ? Not installed (optional)" -ForegroundColor Gray
    Write-Host "   Download from: https://wixtoolset.org/releases/" -ForegroundColor Gray
}

# Check Inno Setup (optional)
Write-Host "Checking Inno Setup (optional)..." -NoNewline
$innoPath = "${env:ProgramFiles(x86)}\Inno Setup 6"
if (Test-Path $innoPath) {
    Write-Host " ? Installed" -ForegroundColor Green
    Write-Host "   Can create graphical installers" -ForegroundColor Gray
} else {
    Write-Host " ? Not installed (optional)" -ForegroundColor Gray
    Write-Host "   Download from: https://jrsoftware.org/isinfo.php" -ForegroundColor Gray
}

# Check project files
Write-Host ""
Write-Host "Checking project files..." -NoNewline
if (Test-Path "StudyBuddy\StudyBuddy.csproj") {
    Write-Host " ? Found" -ForegroundColor Green
} else {
    Write-Host " ? Not found" -ForegroundColor Red
    Write-Host "   Make sure you're in the project root directory" -ForegroundColor Yellow
    $allGood = $false
}

# Check build scripts
Write-Host "Checking build scripts..." -NoNewline
$scripts = @("QUICK-BUILD.bat", "build-installer.bat", "build-installer.ps1")
$foundScripts = $scripts | Where-Object { Test-Path $_ }
if ($foundScripts.Count -eq $scripts.Count) {
    Write-Host " ? All present" -ForegroundColor Green
} else {
    Write-Host " ? Some missing" -ForegroundColor Yellow
}

# System info
Write-Host ""
Write-Host "System Information:" -ForegroundColor Cyan
Write-Host "  OS: $([System.Environment]::OSVersion.VersionString)"
Write-Host "  Architecture: $([System.Environment]::Is64BitOperatingSystem ? 'x64' : 'x86')"
Write-Host "  PowerShell: $($PSVersionTable.PSVersion)"

# Available disk space
$drive = Get-PSDrive -Name C
$freeSpace = [math]::Round($drive.Free / 1GB, 2)
Write-Host "  Free Space: $freeSpace GB"

if ($freeSpace -lt 5) {
    Write-Host "  ? Warning: Low disk space (need ~2GB for build)" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "? All required tools are installed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now build using:" -ForegroundColor White
    Write-Host "  • QUICK-BUILD.bat        (Fastest)" -ForegroundColor Yellow
    Write-Host "  • build-installer.bat    (Complete package)" -ForegroundColor Yellow
    if (Test-Path $wixPath) {
        Write-Host "  • build-msi-installer.ps1 (MSI installer)" -ForegroundColor Yellow
    }
    if (Test-Path $innoPath) {
        Write-Host "  • StudyBuddy-InnoSetup.iss (Inno Setup)" -ForegroundColor Yellow
    }
} else {
    Write-Host "? Some required tools are missing" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Install the missing tools and run this check again." -ForegroundColor White
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
