# Study Buddy - Build Installer Script (PowerShell)
# ================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Study Buddy - Build Installer Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean previous builds
Write-Host "[1/5] Cleaning previous builds..." -ForegroundColor Yellow
dotnet clean StudyBuddy\StudyBuddy.csproj -c Release
if (Test-Path "StudyBuddy\bin\Release") { Remove-Item -Recurse -Force "StudyBuddy\bin\Release" }
if (Test-Path "StudyBuddy\obj\Release") { Remove-Item -Recurse -Force "StudyBuddy\obj\Release" }
if (Test-Path "Installer") { Remove-Item -Recurse -Force "Installer" }
Write-Host "Done." -ForegroundColor Green
Write-Host ""

# Step 2: Restore NuGet packages
Write-Host "[2/5] Restoring NuGet packages..." -ForegroundColor Yellow
dotnet restore StudyBuddy\StudyBuddy.csproj
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to restore packages." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Done." -ForegroundColor Green
Write-Host ""

# Step 3: Build in Release mode
Write-Host "[3/5] Building project in Release mode..." -ForegroundColor Yellow
dotnet build StudyBuddy\StudyBuddy.csproj -c Release
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Done." -ForegroundColor Green
Write-Host ""

# Step 4: Publish self-contained executable
Write-Host "[4/5] Publishing self-contained executable..." -ForegroundColor Yellow
dotnet publish StudyBuddy\StudyBuddy.csproj -c Release -r win-x64 --self-contained true `
    -p:PublishSingleFile=true `
    -p:IncludeNativeLibrariesForSelfExtract=true `
    -p:PublishReadyToRun=true `
    -p:PublishTrimmed=false `
    -o Installer\StudyBuddy

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Publish failed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Done." -ForegroundColor Green
Write-Host ""

# Step 5: Create installer package
Write-Host "[5/5] Creating installer package..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "Installer\StudyBuddy\Data" | Out-Null
New-Item -ItemType Directory -Force -Path "Installer\StudyBuddy\Logs" | Out-Null

# Create README
$readmeContent = @"
Study Buddy - AI-Powered Study Assistant
========================================

Installation Instructions:
1. Run StudyBuddy.exe
2. On first launch, you'll be prompted for a Google Gemini API key
3. Get your free API key from: https://makersuite.google.com/app/apikey

Features:
- AI Study Summarizer
- Random Problem Generator
- Study Time Optimizer
- Flashcard System
- Reverse Quiz Generator
- Dashboard with Daily Challenges

System Requirements:
- Windows 10 or later
- .NET 8.0 Runtime (included)
- 200 MB free disk space

Version: 1.0.0
License: MIT

For support, visit: https://github.com/yourusername/studybuddy
"@

Set-Content -Path "Installer\StudyBuddy\README.txt" -Value $readmeContent

# Create LICENSE
$licenseContent = @"
MIT License

Copyright (c) 2024 Study Buddy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"@

Set-Content -Path "Installer\StudyBuddy\LICENSE.txt" -Value $licenseContent

Write-Host "Done." -ForegroundColor Green
Write-Host ""

# Create ZIP archive
Write-Host "Creating ZIP archive..." -ForegroundColor Yellow
if (Test-Path "StudyBuddy-Setup.zip") { Remove-Item "StudyBuddy-Setup.zip" }
Compress-Archive -Path "Installer\StudyBuddy\*" -DestinationPath "StudyBuddy-Setup.zip"
Write-Host "ZIP archive created: StudyBuddy-Setup.zip" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Build Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Output location: " -NoNewline
Write-Host "Installer\StudyBuddy\" -ForegroundColor Yellow
Write-Host "Executable: " -NoNewline
Write-Host "StudyBuddy.exe" -ForegroundColor Yellow
Write-Host "Package: " -NoNewline
Write-Host "StudyBuddy-Setup.zip" -ForegroundColor Yellow
Write-Host ""
Write-Host "The application is ready to distribute!" -ForegroundColor Green
Write-Host ""

# Calculate folder size
$folderSize = (Get-ChildItem "Installer\StudyBuddy" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host ("Package size: {0:N2} MB" -f $folderSize) -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
