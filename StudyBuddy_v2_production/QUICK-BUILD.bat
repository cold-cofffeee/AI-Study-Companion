@echo off
title Study Buddy - Quick Build
color 0A

echo.
echo ============================================
echo   STUDY BUDDY - QUICK EXE BUILDER
echo ============================================
echo.
echo This will create a standalone .exe file
echo that you can distribute to others.
echo.
echo Press any key to start the build...
pause > nul

cls
echo.
echo [*] Starting build process...
echo.

REM Clean and build
echo [1/4] Cleaning previous builds...
dotnet clean StudyBuddy\StudyBuddy.csproj -c Release >nul 2>&1

echo [2/4] Restoring packages...
dotnet restore StudyBuddy\StudyBuddy.csproj

echo [3/4] Building application...
dotnet build StudyBuddy\StudyBuddy.csproj -c Release

echo [4/4] Creating standalone executable...
dotnet publish StudyBuddy\StudyBuddy.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o Output

if %errorLevel% equ 0 (
    cls
    echo.
    echo ============================================
    echo   SUCCESS! 
    echo ============================================
    echo.
    echo Your executable is ready:
    echo.
    echo    Location: Output\StudyBuddy.exe
    echo    Size: ~70-100 MB
    echo.
    echo You can now:
    echo  1. Run the executable directly
    echo  2. Share it with others
    echo  3. No installation required!
    echo.
    echo Opening output folder...
    explorer Output
    echo.
) else (
    echo.
    echo ============================================
    echo   BUILD FAILED
    echo ============================================
    echo.
    echo Please check:
    echo  - .NET 8.0 SDK is installed
    echo  - All files are present
    echo  - No other instances are running
    echo.
)

echo.
pause
