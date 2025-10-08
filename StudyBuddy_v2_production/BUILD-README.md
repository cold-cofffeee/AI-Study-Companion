# ?? Study Buddy - Executable Setup Creation

## ?? FASTEST WAY TO CREATE .EXE (Recommended)

Simply double-click:
```
QUICK-BUILD.bat
```

That's it! Your `StudyBuddy.exe` will be created in the `Output` folder.

---

## ?? Available Build Options

### Option 1: Quick Build (Easiest)
- **File:** `QUICK-BUILD.bat`
- **Time:** ~2 minutes
- **Output:** Single .exe file
- **Requirements:** .NET 8.0 SDK only

### Option 2: Full Installer Package (Professional)
- **File:** `build-installer.bat` or `build-installer.ps1`
- **Time:** ~3 minutes
- **Output:** Complete installer with documentation
- **Includes:** README, LICENSE, folder structure

### Option 3: MSI Installer (Windows Native)
- **File:** `build-msi-installer.ps1`
- **Requirements:** WiX Toolset
- **Output:** Professional Windows .msi installer
- **Best for:** Distribution through official channels

### Option 4: Inno Setup Installer (User-Friendly)
- **File:** `StudyBuddy-InnoSetup.iss`
- **Requirements:** Inno Setup (free)
- **Output:** Beautiful graphical installer
- **Best for:** Easy user installation

---

## ?? Prerequisites

### Required:
- **Windows 10/11** (64-bit)
- **.NET 8.0 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)

### Optional (for advanced installers):
- **WiX Toolset v3.11+** - [Download here](https://wixtoolset.org/releases/)
- **Inno Setup** - [Download here](https://jrsoftware.org/isinfo.php)

### Check if .NET SDK is installed:
```bash
dotnet --version
```
Should show: 8.0.x or higher

---

## ?? Quick Start Guide

### For Developers:

1. **Clone or download this project**
2. **Open terminal in project folder**
3. **Run:**
   ```bash
   QUICK-BUILD.bat
   ```
4. **Find your .exe in:** `Output\StudyBuddy.exe`

### For Advanced Users:

1. **Choose your installer type** (see options above)
2. **Run the appropriate script**
3. **Distribute the generated installer**

---

## ?? What Gets Created?

### Quick Build:
```
Output/
??? StudyBuddy.exe    (~70-100 MB standalone file)
```

### Full Installer:
```
Installer/
??? StudyBuddy/
    ??? StudyBuddy.exe
    ??? README.txt
    ??? LICENSE.txt
    ??? Data/
    ??? Logs/
StudyBuddy-Setup.zip  (ready to distribute)
```

### MSI/Inno Setup:
```
StudyBuddy-Setup.msi  or  StudyBuddy-Setup.exe
```

---

## ?? Troubleshooting

### "dotnet is not recognized"
- Install .NET 8.0 SDK
- Restart your terminal
- Verify: `dotnet --version`

### Build fails with errors
1. Close all running instances of StudyBuddy
2. Delete `bin` and `obj` folders
3. Run `dotnet clean`
4. Try again

### File is too large
- This is normal! The .exe includes:
  - .NET Runtime (~60 MB)
  - All libraries and dependencies
  - Your application code
- Users don't need to install anything!

### Can't run on other computers
The .exe is Windows x64 specific. Create separate builds for:
- **win-x86**: 32-bit Windows
- **win-arm64**: ARM Windows

---

## ?? Customization

### Add Application Icon:
1. Create or download an .ico file
2. Save as `StudyBuddy/app.ico`
3. Already configured in .csproj!

### Change Version Number:
Edit `StudyBuddy/StudyBuddy.csproj`:
```xml
<Version>1.0.0</Version>
```

### Change Display Name:
Edit `StudyBuddy/StudyBuddy.csproj`:
```xml
<Product>Your App Name</Product>
```

---

## ?? Distribution

### Sharing Your App:

1. **Simple:** Share the .exe directly
   - Users just run it
   - No installation needed

2. **Professional:** Share the .zip package
   - Includes documentation
   - Looks more complete

3. **Enterprise:** Use MSI or Inno Setup
   - Silent installation support
   - Add/Remove Programs integration
   - Professional appearance

### File Sizes:
- **Single .exe:** ~70-100 MB
- **ZIP package:** ~50-70 MB (compressed)
- **Installer:** ~50-80 MB

---

## ?? Code Signing (Optional)

For production/commercial apps, consider code signing:

1. Get a code signing certificate
2. Sign your .exe:
   ```bash
   signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com StudyBuddy.exe
   ```

This removes "Unknown Publisher" warnings.

---

## ?? Need Help?

### Read the detailed guide:
```
INSTALLER-GUIDE.md
```

### Common Issues:
- **Build errors:** Check .NET SDK version
- **Missing files:** Run from project root
- **Permission errors:** Run as administrator

### Still stuck?
- Check the error messages carefully
- Search the error online
- Create an issue on GitHub

---

## ? Checklist Before Distribution

- [ ] Application runs without errors
- [ ] API key dialog works
- [ ] All features are functional
- [ ] README.txt is included
- [ ] LICENSE.txt is included
- [ ] Version number is correct
- [ ] Tested on clean Windows machine
- [ ] File size is reasonable

---

## ?? Build Comparison

| Method | Time | Size | Ease | Professional |
|--------|------|------|------|--------------|
| Quick Build | ? Fast | ?? Large | ? Easy | ?? |
| ZIP Package | ? Fast | ?? Medium | ? Easy | ??? |
| MSI | ?? Medium | ?? Medium | ?? Complex | ???? |
| Inno Setup | ?? Medium | ?? Small | ? Easy | ????? |

**Recommendation:** Start with Quick Build for testing, use Inno Setup for distribution.

---

## ?? Success!

Once built, your application:
- ? Runs standalone (no .NET installation needed)
- ? Works on any Windows 10/11 x64 PC
- ? Includes all dependencies
- ? Is ready to share

---

## ?? Notes

- First run may be slower (extracting embedded files)
- App creates Data and Logs folders automatically
- Settings are saved in user's AppData folder
- Internet required for AI features

---

**Version:** 1.0.0
**Last Updated:** 2024
**License:** MIT

Happy coding! ??
