# 📘 Study Buddy Pro - User Installation Guide

## Welcome Tester! 👋

Thank you for helping test Study Buddy Pro v2.8.0. This guide will help you get started.

## System Requirements

- **Operating System:** Windows 10 or Windows 11 (64-bit)
- **RAM:** 4 GB minimum (8 GB recommended)
- **Disk Space:** 500 MB free
- **Internet:** Required for AI features, music streaming

## Installation Options

You'll receive one of these files:

### Option A: Full Installer (Recommended)
**File:** `Study Buddy Pro Setup 2.8.0.exe`

1. Double-click the installer
2. If Windows SmartScreen appears, click "More info" → "Run anyway"
3. Choose installation folder (or use default)
4. Wait for installation to complete
5. Launch Study Buddy Pro from Desktop or Start Menu

### Option B: Portable Version
**File:** `StudyBuddyPro-2.8.0-portable.exe`

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
  - [ ] Copy to clipboard button works
  - [ ] Save as PDF exports correctly
  - [ ] Multiple outputs saved and restored
  - [ ] **NEW: Resume with all outputs after app restart**
  - [ ] **NEW: Language and HSC context restored**
  - [ ] **NEW: Generation history tracked**
- [ ] **Quiz Generator** - Generate questions from content
  - [ ] Copy quiz button works
  - [ ] PDF export includes all questions
  - [ ] **NEW: Input answers persist after restart**
  - [ ] **NEW: Generated quiz restored on reload**
  - [ ] **NEW: Error tracking (try invalid API key)**
- [ ] **Study Optimizer** - Get personalized study schedules
  - [ ] Copy schedule button works
  - [ ] PDF shows formatted schedule
  - [ ] **NEW: Inputs (subject, topics, etc.) restored**
  - [ ] **NEW: Generated schedules persist**
  - [ ] **NEW: HSC context checkbox state saved**
- [ ] **Problem Generator** - Solve math/science problems
  - [ ] Progressive disclosure (Question → Hints → Solution)
  - [ ] Individual timers per problem
  - [ ] Copy individual problem works
  - [ ] Copy all problems works
  - [ ] PDF export per problem works
  - [ ] PDF export formats problems correctly
  - [ ] **NEW: Problems persist after app restart**
  - [ ] **NEW: Timer states saved per problem**
  - [ ] **NEW: Settings (subject, difficulty) restored**
- [ ] **HSC Bangladesh Context** - Enable HSC checkbox
  - [ ] HSC syllabus-aligned responses
  - [ ] Bengali terminology appears
  - [ ] **NEW: HSC checkbox state persists**

### 2. Study Tools
- [ ] **Pomodoro Timer** - Focus sessions
  - [ ] Generate detailed study plan
  - [ ] Task durations: Easy=25min, Medium=35min, Hard=45min
  - [ ] Copy schedule to clipboard
  - [ ] PDF export with task breakdown
  - [ ] HSC context checkbox works
  - [ ] **NEW: Schedule inputs (subject, topics) persist**
  - [ ] **NEW: Generated schedules restored on reload**
  - [ ] **NEW: HSC context state saved**
- [ ] **Flashcards** - Create and review flashcards
  - [ ] **NEW: Incomplete card inputs saved (resume creation)**
  - [ ] **NEW: Last 50 created cards tracked**
  - [ ] **NEW: Error tracking for failed saves**
- [ ] **Dashboard** - Overview of study stats

### 3. Music Player
- [ ] **YouTube Player** - Play study music from YouTube
- [ ] **Spotify Playlists** - Browse curated study playlists
- [ ] **Volume Control** - Adjust music volume (YouTube only)
- [ ] **Custom Playlists** - Add your own YouTube videos

### 4. Export & Persistence (ENHANCED! Very Important!)
- [ ] **Copy to Clipboard** - All modules have Copy button
  - [ ] Content copies successfully
  - [ ] Toast notification appears
- [ ] **PDF Export** - All modules have Save as PDF button
  - [ ] Print dialog opens
  - [ ] PDF includes metadata (date, subject, etc.)
  - [ ] Difficulty colors appear correctly
  - [ ] Problems formatted as cards
  - [ ] Watermark "STUDY BUDDY PRO" visible
- [ ] **Complete Data Caching (NEW!)**
  - [ ] Close and reopen app - ALL inputs restored
  - [ ] Generated summaries still visible with tabs
  - [ ] Generated problems with timer states saved
  - [ ] Quiz questions and inputs persist
  - [ ] Study schedules remain with all metadata
  - [ ] Pomodoro task lists and inputs restored
  - [ ] Flashcard incomplete entries saved
  - [ ] Settings saved automatically
  - [ ] **Test: Generate content, close app, reopen → Everything restored**
  - [ ] **Test: Enter text, close before generating → Text restored**
- [ ] **Error Tracking (NEW!)**
  - [ ] Try with invalid API key → Error captured
  - [ ] Generate without input → Error handled gracefully
  - [ ] **Check: `%AppData%/study-buddy-pro/study-buddy-data.json` contains error logs**

### 5. Data Persistence Testing (CRITICAL!)
Test the comprehensive caching system:

1. **Summarizer Cache Test**:
   - [ ] Paste text, select language, check HSC box
   - [ ] Generate summary
   - [ ] Close app WITHOUT clearing
   - [ ] Reopen app, navigate to Summarizer
   - [ ] **Expected**: Text, language, HSC checkbox, and output ALL restored

2. **Problem Generator Cache Test**:
   - [ ] Select Math, Medium, 3 problems
   - [ ] Generate problems, start timer on Problem 1
   - [ ] Wait 10 seconds, reveal hints
   - [ ] Close app
   - [ ] Reopen app, navigate to Problems
   - [ ] **Expected**: Subject, difficulty, count, problems, AND 10-second timer restored

3. **Quiz Cache Test**:
   - [ ] Enter answers: "DNA, RNA, Protein"
   - [ ] Select quiz type
   - [ ] Generate quiz
   - [ ] Close app
   - [ ] Reopen app, navigate to Quiz
   - [ ] **Expected**: Answers, quiz type, and generated quiz ALL restored

4. **Optimizer Cache Test**:
   - [ ] Enter subject "Physics", topics "Mechanics, Waves"
   - [ ] Select duration 120 min, difficulty Hard
   - [ ] Check HSC box
   - [ ] Generate schedule
   - [ ] Close app
   - [ ] Reopen app, navigate to Optimizer
   - [ ] **Expected**: All inputs AND generated schedule restored

5. **Pomodoro Cache Test**:
   - [ ] Enter subject "Chemistry", topics "Organic, Inorganic"
   - [ ] Check HSC box
   - [ ] Generate schedule
   - [ ] Close app
   - [ ] Reopen app, navigate to Pomodoro
   - [ ] **Expected**: Subject, topics, HSC checkbox, schedule restored

6. **Flashcard Cache Test**:
   - [ ] Enter question "What is ATP?"
   - [ ] Enter partial answer "Adenosine..."
   - [ ] DON'T submit (leave incomplete)
   - [ ] Close app
   - [ ] Reopen app, navigate to Flashcards
   - [ ] **Expected**: Question and partial answer restored

## 📋 New Features in v2.8.0

### Complete Data Caching System
**Every module now caches everything:**
- **User Inputs**: All form fields, selections, checkboxes
- **AI Responses**: Generated content with timestamps
- **Errors**: Failed operations with context
- **Generation History**: Last 20-50 generations tracked
- **Auto-Restore**: Resume exactly where you left off

**What gets cached:**
- Summarizer: Text, language, HSC context, all outputs (last 30)
- Problems: Subject, difficulty, count, problems, timers (last 30)
- Quiz: Answers, type, generated quizzes (last 20)
- Optimizer: Subject, topics, schedules (last 20)
- Pomodoro: Subject, topics, schedules (last 20)
- Flashcards: Inputs, created cards (last 50)

**Where it's stored:**
- Windows: `%AppData%/study-buddy-pro/study-buddy-data.json`
- You can inspect this file to see cached data

## 📋 New Features in v2.7.0

### Copy & PDF Export
Every AI-generated content now has:
- **📋 Copy Button** - Instantly copy to clipboard
- **📄 Save as PDF** - Export professional PDFs with:
  - Header with title and module type
  - Watermark "STUDY BUDDY PRO"
  - Metadata (date, subject, difficulty, etc.)
  - Formatted content with color coding
  - Footer with generation info

### Enhanced Pomodoro
- Difficulty-based durations: Easy (25min), Medium (35min), Hard (45min)
- Detailed task breakdowns with subtopics
- Export schedules as formatted PDFs
- HSC Bangladesh curriculum support

### Problem Generator Improvements
- Progressive hints system (show hints before solution)
- Individual timers for each problem
- Better PDF formatting with problem cards
- Timer states persist across sessions

### Complete State Persistence
All your work is saved automatically:
- Generated AI content never lost
- Close app anytime - everything restores
- Individual problem timer tracking
- Settings persist automatically

## 📝 Reporting Issues

When reporting bugs, please include:

1. **What you were doing** (e.g., "Exporting problems to PDF")
2. **What happened** (e.g., "PDF didn't include hints section")
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
