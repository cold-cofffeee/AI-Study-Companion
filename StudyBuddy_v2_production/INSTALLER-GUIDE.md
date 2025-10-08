# Study Buddy - Installer Creation Guide

This guide will help you create an executable setup file for Study Buddy.

## Quick Start (Recommended)

### Option 1: Simple ZIP Package (No dependencies required)

1. **Run the batch script:**
   ```
   build-installer.bat
   ```
   OR
   ```
   powershell -ExecutionPolicy Bypass -File build-installer.ps1
   ```

2. **Output:**
   - `Installer\StudyBuddy\StudyBuddy.exe` - Standalone executable
   - `StudyBuddy-Setup.zip` - Distributable package

3. **Distribution:**
   - Share the `StudyBuddy-Setup.zip` file
   - Users extract and run `StudyBuddy.exe`

### Option 2: Professional MSI Installer (Requires WiX Toolset)

1. **Install WiX Toolset:**
   - Download from: https://wixtoolset.org/releases/
   - Install WiX Toolset v3.11.2 or later

2. **Create License RTF file** (required for MSI):
   - Open WordPad
   - Copy the LICENSE.txt content
   - Save as `License.rtf` in the project root

3. **Run the MSI builder:**
   ```
   powershell -ExecutionPolicy Bypass -File build-msi-installer.ps1
   ```

4. **Output:**
   - `StudyBuddy-Setup.msi` - Professional Windows installer

## Build Options Explained

### Self-Contained Single File
The build scripts create a self-contained executable that includes:
- .NET 8.0 Runtime (no installation required)
- All dependencies (SQLite, iTextSharp, etc.)
- Single executable file for easy distribution

### Build Configuration
```
Configuration: Release
Platform: Windows x64
Runtime: win-x64, self-contained
Single File: Yes
Ready to Run: Yes (optimized startup)
```

## Manual Build Commands

If you prefer to build manually:

### Clean Build
```bash
dotnet clean StudyBuddy\StudyBuddy.csproj -c Release
```

### Restore Packages
```bash
dotnet restore StudyBuddy\StudyBuddy.csproj
```

### Build Release
```bash
dotnet build StudyBuddy\StudyBuddy.csproj -c Release
```

### Publish Standalone Executable
```bash
dotnet publish StudyBuddy\StudyBuddy.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -p:PublishReadyToRun=true -o Output
```

## Project Configuration

The project is already configured for optimal publishing:
- Target Framework: .NET 8.0 Windows
- Output Type: Windows Application (WinExe)
- Dependencies included in the .csproj file

## Distribution

### For End Users:
1. Extract the ZIP package
2. Run `StudyBuddy.exe`
3. On first launch, enter Google Gemini API key
4. No additional installation required

### System Requirements:
- Windows 10 or later (x64)
- 200 MB free disk space
- Internet connection (for AI features)

## Troubleshooting

### Build Errors
- Ensure .NET 8.0 SDK is installed
- Run `dotnet --version` to verify
- Download from: https://dotnet.microsoft.com/download/dotnet/8.0

### Publish Errors
- Check available disk space
- Close any running instances of the app
- Run as administrator if needed

### MSI Creation Errors
- Verify WiX Toolset installation
- Ensure License.rtf exists
- Check the StudyBuddy-Installer.wxs file

## Advanced: Creating an Installer with Inno Setup

Alternative to WiX, using Inno Setup (free, simpler):

1. **Install Inno Setup:**
   - Download from: https://jrsoftware.org/isinfo.php

2. **Create installer script** (see StudyBuddy-InnoSetup.iss)

3. **Compile:**
   - Open the .iss file in Inno Setup
   - Click "Compile"

## File Structure After Build

```
Installer/
??? StudyBuddy/
    ??? StudyBuddy.exe          (Main executable)
    ??? README.txt              (User guide)
    ??? LICENSE.txt             (License)
    ??? Data/                   (Database folder)
    ??? Logs/                   (Log files folder)
```

## Notes

- The executable is digitally unsigned. For production, consider code signing.
- File size: Approximately 70-100 MB (includes .NET runtime)
- First launch may be slower due to extraction
- Settings and data are stored in user's AppData folder

## Support

For issues or questions:
- Check the README.txt in the installer package
- Visit: https://github.com/yourusername/studybuddy
- Create an issue on GitHub

---
Last updated: 2024
Study Buddy v1.0.0
