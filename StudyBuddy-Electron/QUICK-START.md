# Quick Start Guide

## Study Buddy Pro - Electron Edition

### Installation Steps

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/
   - Version 16 or higher required

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Get Google Gemini API Key**
   - Visit: https://aistudio.google.com/app/apikey
   - Sign in with Google account
   - Create a new API key
   - Copy the key (starts with `AIzaSy...`)

4. **Run the Application**
   ```bash
   npm start
   ```

5. **Configure API Key**
   - Open Settings (⚙️) in the sidebar
   - Paste your API key
   - Click "Test Connection"
   - Click "Save All Settings"

### First Time Setup

1. Launch Study Buddy Pro
2. You'll see the Dashboard with your study overview
3. Go to Settings and configure your API key
4. Choose your preferred theme (Light/Dark/Auto)
5. Set your default study session duration
6. Start using the AI features!

### Features Overview

- **📊 Dashboard**: View stats and daily challenges
- **📝 Summarizer**: AI-powered summaries, quizzes, and memory tricks
- **🧮 Problems**: Generate practice problems with solutions
- **⏰ Optimizer**: Create Pomodoro-based study schedules
- **🎴 Flashcards**: Spaced repetition learning system
- **❓ Quiz**: Generate quizzes from answers/concepts
- **⚙️ Settings**: Configure app preferences
- **ℹ️ About**: Help and information

### Troubleshooting

**App won't start:**
- Ensure Node.js is installed
- Run `npm install` again
- Check for error messages in console

**API not working:**
- Verify API key is correct
- Test connection in Settings
- Check internet connection
- Make sure API key has no spaces

**Database errors:**
- App will create database automatically
- Data stored in: `%APPDATA%/StudyBuddy/`

### Building Executables

To create distributable applications:

**Windows:**
```bash
npm run build:win
```

**macOS:**
```bash
npm run build:mac
```

**Linux:**
```bash
npm run build:linux
```

Built files will be in the `dist/` folder.

### Need Help?

Check the About section in the app for more information or visit the README.md file.

---

**Happy Studying! 📚✨**
