# 📘 Study Buddy Pro - User Installation Guide

## Welcome Tester! 👋

Thank you for helping test Study Buddy Pro v2.5.0. This guide will help you get started.

## System Requirements

- **Operating System:** Windows 10 or Windows 11 (64-bit)
- **RAM:** 4 GB minimum (8 GB recommended)
- **Disk Space:** 500 MB free
- **Internet:** Required for AI features, music streaming

## Installation Options

You'll receive one of these files:

### Option A: Full Installer (Recommended)
**File:** `Study Buddy Pro Setup 2.5.0.exe`

1. Double-click the installer
2. If Windows SmartScreen appears, click "More info" → "Run anyway"
3. Choose installation folder (or use default)
4. Wait for installation to complete
5. Launch Study Buddy Pro from Desktop or Start Menu

### Option B: Portable Version
**File:** `StudyBuddyPro-2.5.0-portable.exe`

1. Save to any folder (Desktop, Documents, USB drive)
2. Double-click to run
3. No installation required!
4. Can run from USB drive

## 🔑 IMPORTANT: API Key Setup (Required!)

Study Buddy Pro uses Google's Gemini AI. You need a free API key:

### Step 1: Get Your Free API Key

1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (starts with "AIza...")

### Step 2: Add API Key to Study Buddy Pro

1. Launch Study Buddy Pro
2. Click the **Settings (⚙️)** icon at the bottom
3. Paste your API key in the **"Gemini API Key"** field
4. Click **"Save Settings"**

**That's it!** Now all AI features will work.

## 🎯 What to Test

Please test these features and report any issues:

### 1. AI Features (Requires API Key)
- [ ] **Summarizer** - Paste text, get AI summary
- [ ] **Quiz Generator** - Generate questions from content
- [ ] **Study Optimizer** - Get personalized study schedules
- [ ] **Problem Solver** - Solve math/science problems

### 2. Study Tools
- [ ] **Pomodoro Timer** - 25-minute focus sessions
- [ ] **Flashcards** - Create and review flashcards
- [ ] **Dashboard** - Overview of study stats

### 3. Music Player
- [ ] **YouTube Player** - Play study music from YouTube
- [ ] **Spotify Playlists** - Browse curated study playlists
- [ ] **Volume Control** - Adjust music volume (YouTube only)
- [ ] **Custom Playlists** - Add your own YouTube videos

### 4. Persistence (Very Important!)
- [ ] Close and reopen app - settings should be saved
- [ ] Timer state persists across sessions
- [ ] Music player remembers last played
- [ ] AI responses are cached (offline viewing)
- [ ] Flashcards are saved automatically

## 📝 Reporting Issues

When reporting bugs, please include:

1. **What you were doing** (e.g., "Generating a quiz")
2. **What happened** (e.g., "Error message appeared")
3. **Error message** (if any - take a screenshot)
4. **Steps to reproduce** (so I can fix it)
5. **Your Windows version** (Win 10 or 11)

**Where to report:**
- Email: [your-email@example.com]
- GitHub Issues: [repository-link]
- Discord/Slack: [if applicable]

## 🐛 Known Issues

Current limitations (not bugs):

1. **Spotify Volume Control** - Spotify doesn't allow volume control via embedded player
2. **Large Files** - PDFs over 50 MB may be slow
3. **Internet Required** - AI features need active internet connection
4. **API Rate Limits** - Free Gemini API has daily limits

## 💾 Where Your Data is Stored

All your data is saved locally:

**Location:** `C:\Users\[YourName]\AppData\Roaming\study-buddy-pro\`

**What's saved:**
- ✅ Settings (API key, theme, preferences)
- ✅ Flashcards and categories
- ✅ AI responses (cached)
- ✅ Study session history
- ✅ Activity logs

**Privacy:** Your data never leaves your computer (except API calls to Google).

## 🔧 Troubleshooting

### App won't start
- Check Windows Defender - it may block the app
- Try running as Administrator (right-click → "Run as administrator")
- Check `C:\Users\[You]\AppData\Roaming\study-buddy-pro\error.log`

### AI features not working
- Verify API key is correct in Settings
- Check internet connection
- Try a different module (Summarizer vs Quiz)
- Check Developer Tools (Ctrl+Shift+I) for errors

### Music player not loading
- Check internet connection
- Try switching between YouTube and Spotify tabs
- Close and reopen the Pomodoro module

### Settings not saving
- Check folder permissions
- Try running app as Administrator
- Delete `study-buddy-data.json` and restart (will lose data)

### Slow performance
- Clear cached AI responses in Settings
- Close Developer Tools (F12) if open
- Restart the app
- Check RAM usage in Task Manager

## 🎓 Quick Start Guide

**First Time Setup:**
1. Install app
2. Add API key (Settings)
3. Try Summarizer with sample text
4. Start a Pomodoro timer
5. Play some study music

**Daily Use:**
1. Launch Study Buddy Pro
2. Navigate to your module (Summarizer, Quiz, etc.)
3. Enter content or start timer
4. Get AI-powered results
5. Everything saves automatically!

## 🌟 Tips for Best Experience

- **Use Pomodoro Timer** - 25 minutes focus, 5 minute breaks
- **Create Flashcards** - Great for memorization
- **Cache AI Responses** - Work offline with saved content
- **Try Study Optimizer** - Get personalized schedules
- **Background Music** - Use YouTube player for focus

## ⚠️ Limitations of Free Version

This is version 2.5.0 - some features are planned:

- [ ] Cloud sync (coming soon)
- [ ] Mobile companion app
- [ ] Advanced analytics
- [ ] Collaboration features
- [ ] Custom AI model training

## 📞 Contact & Support

**Developer:** [Your Name]  
**Email:** [your-email]  
**GitHub:** [repository]  
**Version:** 2.5.0  
**Build Date:** November 7, 2025

---

## Thank You for Testing! 🙏

Your feedback is invaluable for making Study Buddy Pro better. Please test thoroughly and report any issues you find.

**What to focus on:**
- ✅ Stability (does it crash?)
- ✅ Performance (is it fast/slow?)
- ✅ Usability (is it confusing?)
- ✅ Features (do they work as expected?)
- ✅ Persistence (does data save properly?)

Happy studying! 📚✨
