@echo off
echo ========================================
echo Study Buddy - Build Installer Script
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Warning: Not running as administrator. Some operations may fail.
    echo.
)

REM Step 1: Clean previous builds
echo [1/5] Cleaning previous builds...
dotnet clean StudyBuddy\StudyBuddy.csproj -c Release
if exist "StudyBuddy\bin\Release" rmdir /s /q "StudyBuddy\bin\Release"
if exist "StudyBuddy\obj\Release" rmdir /s /q "StudyBuddy\obj\Release"
if exist "Installer" rmdir /s /q "Installer"
echo Done.
echo.

REM Step 2: Restore NuGet packages
echo [2/5] Restoring NuGet packages...
dotnet restore StudyBuddy\StudyBuddy.csproj
if %errorLevel% neq 0 (
    echo ERROR: Failed to restore packages.
    pause
    exit /b 1
)
echo Done.
echo.

REM Step 3: Build in Release mode
echo [3/5] Building project in Release mode...
dotnet build StudyBuddy\StudyBuddy.csproj -c Release
if %errorLevel% neq 0 (
    echo ERROR: Build failed.
    pause
    exit /b 1
)
echo Done.
echo.

REM Step 4: Publish self-contained executable
echo [4/5] Publishing self-contained executable...
dotnet publish StudyBuddy\StudyBuddy.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -p:PublishReadyToRun=true -p:PublishTrimmed=false -o Installer\StudyBuddy
if %errorLevel% neq 0 (
    echo ERROR: Publish failed.
    pause
    exit /b 1
)
echo Done.
echo.

REM Step 5: Create installer package folder
echo [5/5] Creating installer package...
mkdir "Installer\StudyBuddy\Data" 2>nul
mkdir "Installer\StudyBuddy\Logs" 2>nul

REM Copy additional files
echo Creating README...
(
echo Study Buddy - AI-Powered Study Assistant
echo ========================================
echo.
echo Installation Instructions:
echo 1. Run StudyBuddy.exe
echo 2. On first launch, you'll be prompted for a Google Gemini API key
echo 3. Get your free API key from: https://makersuite.google.com/app/apikey
echo.
echo Features:
echo - AI Study Summarizer
echo - Random Problem Generator
echo - Study Time Optimizer
echo - Flashcard System
echo - Reverse Quiz Generator
echo - Dashboard with Daily Challenges
echo.
echo System Requirements:
echo - Windows 10 or later
echo - .NET 8.0 Runtime (included)
echo - 200 MB free disk space
echo.
echo Version: 1.0.0
echo License: MIT
echo.
echo For support, visit: https://github.com/yourusername/studybuddy
) > "Installer\StudyBuddy\README.txt"

echo Creating LICENSE...
(
echo MIT License
echo.
echo Copyright ^(c^) 2024 Study Buddy
echo.
echo Permission is hereby granted, free of charge, to any person obtaining a copy
echo of this software and associated documentation files ^(the "Software"^), to deal
echo in the Software without restriction, including without limitation the rights
echo to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
echo copies of the Software, and to permit persons to whom the Software is
echo furnished to do so, subject to the following conditions:
echo.
echo The above copyright notice and this permission notice shall be included in all
echo copies or substantial portions of the Software.
echo.
echo THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
echo IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
echo FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
echo AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
echo LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
echo OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
echo SOFTWARE.
) > "Installer\StudyBuddy\LICENSE.txt"

echo Done.
echo.

REM Create ZIP archive
echo Creating ZIP archive...
if exist "StudyBuddy-Setup.zip" del "StudyBuddy-Setup.zip"
powershell -command "Compress-Archive -Path 'Installer\StudyBuddy\*' -DestinationPath 'StudyBuddy-Setup.zip'"
if %errorLevel% equ 0 (
    echo ZIP archive created: StudyBuddy-Setup.zip
) else (
    echo Warning: Could not create ZIP archive.
)
echo.

echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Output location: Installer\StudyBuddy\
echo Executable: StudyBuddy.exe
echo Package: StudyBuddy-Setup.zip
echo.
echo The application is ready to distribute!
echo.
pause
