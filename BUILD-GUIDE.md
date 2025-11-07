# 📦 Building Study Buddy Pro Installer

This guide will help you create a Windows installer (.exe) for distributing Study Buddy Pro to users.

## Prerequisites

Before building, ensure you have:
- ✅ Node.js installed (v16 or higher)
- ✅ All dependencies installed (`npm install`)
- ✅ Valid Google Gemini API key

## Build Options

### Option 1: NSIS Installer (Recommended for Distribution)
Creates a traditional Windows installer with setup wizard:

```powershell
npm run build:win
```

**Output:** `dist/Study Buddy Pro Setup 2.5.0.exe`

**Features:**
- Installation wizard with directory selection
- Desktop and Start Menu shortcuts
- Clean uninstaller
- Auto-update support ready
- ~150-200 MB file size

### Option 2: Portable Executable (Recommended for Testing)
Creates a single portable .exe that runs without installation:

```powershell
npm run build:win
```

**Output:** `dist/StudyBuddyPro-2.5.0-portable.exe`

**Features:**
- No installation required
- Run directly from USB drive
- Perfect for quick testing
- ~150-200 MB file size

## Build Process

### Step 1: Install Dependencies (if not done)
```powershell
npm install
```

### Step 2: Run Build Command
```powershell
npm run build:win
```

### Step 3: Wait for Build
The build process will:
1. Bundle all source files
2. Package Electron runtime
3. Create installer/portable executable
4. Output to `dist/` folder

**Expected time:** 2-5 minutes depending on your system

## What Gets Built?

After running `npm run build:win`, you'll find in the `dist/` folder:

1. **Study Buddy Pro Setup 2.5.0.exe** - Full installer
2. **StudyBuddyPro-2.5.0-portable.exe** - Portable version
3. **win-unpacked/** - Unpacked application files (for debugging)

## Distribution Checklist

Before sharing with testers:

- [ ] Test the installer on a clean Windows machine
- [ ] Verify API key is NOT hardcoded in the build
- [ ] Include setup instructions (API key requirement)
- [ ] Test both installer and portable versions
- [ ] Create a README for users with:
  - System requirements (Windows 10/11)
  - Installation steps
  - How to get/add Gemini API key
  - Known limitations

## First-Run Instructions for Users

**Important:** Users will need to add their own Google Gemini API key:

1. Run Study Buddy Pro
2. Navigate to Settings (⚙️)
3. Enter their Google Gemini API key
4. Click Save Settings

Without an API key, AI features (summarizer, quiz, optimizer, problems) won't work.

## File Sizes & System Requirements

**Installer Size:** ~150-200 MB (includes Chromium runtime)

**System Requirements:**
- Windows 10/11 (64-bit)
- 4 GB RAM minimum
- 500 MB free disk space
- Internet connection (for AI features, YouTube, Spotify)

## Troubleshooting Build Issues

### Build fails with "electron-builder not found"
```powershell
npm install electron-builder --save-dev
```

### Icon errors during build
The default icon is a placeholder. For production:
1. Create a 512x512 PNG icon
2. Replace `assets/icon.png`
3. Rebuild

### "EACCES" or permission errors
Run PowerShell as Administrator

### Build succeeds but app won't run
- Check Windows Defender/antivirus
- Try portable version instead
- Run from `dist/win-unpacked/Study Buddy Pro.exe` to see console errors

## Advanced: Code Signing (Optional)

For trusted installations without Windows SmartScreen warnings:

1. Get a code signing certificate (Sectigo, DigiCert, etc.)
2. Add to `package.json`:
```json
"win": {
  "certificateFile": "path/to/certificate.pfx",
  "certificatePassword": "your-password"
}
```

**Note:** Code signing certificates cost $100-400/year but remove scary warnings.

## Testing the Build

### Quick Test Checklist:
1. ✅ Installer runs without errors
2. ✅ App launches successfully
3. ✅ All modules load (Dashboard, Pomodoro, Summarizer, etc.)
4. ✅ Music player works (YouTube/Spotify)
5. ✅ Settings persist after restart
6. ✅ AI features work with valid API key
7. ✅ Pomodoro timer counts correctly
8. ✅ Data saves to AppData folder
9. ✅ Uninstaller removes app cleanly

### Test on Multiple Machines:
- Development machine (where you built it)
- Clean Windows 10 VM
- Clean Windows 11 VM
- Friend's/colleague's computer

## Build Customization

Edit `package.json` → `build` section to customize:

```json
"nsis": {
  "oneClick": false,              // Allow custom install location
  "allowToChangeInstallationDirectory": true,
  "createDesktopShortcut": true,   // Add desktop icon
  "createStartMenuShortcut": true, // Add start menu entry
  "runAfterFinish": true           // Launch after install
}
```

## Next Steps After Building

1. **Test thoroughly** on multiple machines
2. **Gather feedback** from beta testers
3. **Document issues** in GitHub Issues
4. **Create release notes** for version 2.5.0
5. **Consider hosting** on GitHub Releases or own website
6. **Set up analytics** (optional) to track usage

## Support & Resources

- **Electron Builder Docs:** https://www.electron.build/
- **NSIS Options:** https://www.electron.build/configuration/nsis
- **Code Signing Guide:** https://www.electron.build/code-signing
- **Issue Tracker:** GitHub Issues in this repository

---

**Ready to build?** Run `npm run build:win` and share Study Buddy Pro with the world! 🚀
