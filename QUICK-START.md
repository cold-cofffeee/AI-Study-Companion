# Quick Start Guide

## Study Buddy Pro v2.5.0 - AI Learning Companion

### 🚀 5-Minute Setup

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/
   - Version 16 or higher required

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Get Google Gemini API Key** (FREE!)
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
   - Click "Test Connection" ✅
   - Click "Save All Settings"

6. **You're Ready! 🎉**
   - Everything auto-saves - just close anytime!
   - Timer and music run in background
   - All your work is preserved

### 🎓 First Study Session

1. **Launch Study Buddy Pro**
2. **Dashboard**: See your study overview
3. **Pomodoro Timer**:
   - Click "Focus Session" (25 min) or enable ADHD mode (10 min)
   - Add study music (YouTube or Spotify)
   - Click "Start Timer" 
   - Navigate freely - timer keeps running! ⏰

4. **Start Creating**:
   - **Summarizer**: Paste notes → Generate summary
   - **Problems**: Select subject → Generate practice
   - **Optimizer**: Plan study schedule → Send to timer

### ✨ Key Features

#### 🍅 Pomodoro Timer
- **Background timer** - Runs while you work in other modules
- **Integrated music** - YouTube & Spotify playlists
- **ADHD Mode** - Shorter sessions (10-2-5 min)
- **Auto-save** - Timer state preserved
- **Notifications** - Desktop alerts when done

#### 🎵 Music Player
- **Pre-loaded playlists**: Lofi, Classical, Piano, Ambient
- **Add custom playlists**: Any YouTube/Spotify URL
- **Volume control**: Unified slider
- **Persistent playback**: Music continues everywhere

#### 💾 Auto-Save Everything
- ✅ AI responses (summaries, quizzes, problems)
- ✅ All text inputs (auto-saved as you type)
- ✅ Timer state and sessions
- ✅ Music playlists and volume
- ✅ Settings and preferences
- **Close anytime - nothing is lost!**

### 📚 Module Guide

**📊 Dashboard**
- Study statistics and streaks
- Daily challenges
- Quick module access

**📝 Summarizer**
- Paste study material
- Generate: Summary, Quiz, Mnemonics
- All outputs saved in tabs
- Export to PDF

**🧮 Problem Generator**
- Select subject & difficulty
- AI generates practice problems
- Built-in timer for solving
- Solutions included

**⏰ Study Optimizer**
- Enter topic and duration
- AI creates Pomodoro schedule
- Send directly to timer
- Schedule auto-saved

**🎴 Flashcards**
- Create custom cards
- Spaced repetition (SM-2)
- Category organization
- Saved to database

**❓ Quiz Generator**
- Input definitions/answers
- AI creates quiz questions
- Multiple quiz types
- Quiz content saved

### 🎵 Music Player Guide

**Pre-configured Playlists:**
- Lofi Hip Hop - Beats to Study
- Deep Focus Music  
- Piano Music for Studying
- Classical Music Mix
- Ambient Study Music

**Add Custom Playlist:**
1. Go to Pomodoro → Music → Custom
2. Paste URL:
   - `https://www.youtube.com/watch?v=...`
   - `https://open.spotify.com/playlist/...`
3. Enter playlist name
4. Click "Add Playlist"
5. Saved forever! 🎶

**Controls:**
- Use player's built-in controls
- Volume slider in Sound Settings
- YouTube: Full volume control
- Spotify: Use player controls (API limitation)

### 🎨 Customization

**Settings →**
- **Theme**: Light / Dark / Auto
- **Pomodoro**: ADHD mode, auto-start, durations
- **Sounds**: Enable/disable, volume control
- **API**: Test and update key

### 💡 Pro Tips

1. **Multi-tasking**: Timer runs in background - work in any module!
2. **Music anywhere**: Start music in Pomodoro, listen everywhere
3. **Auto-save**: Just type - everything saves automatically
4. **Past work**: All AI responses kept - review anytime
5. **Export**: Save important content to PDF
6. **Notifications**: Enable for session reminders
7. **Data location**: `C:\Users\[You]\AppData\Roaming\study-buddy-pro\`

### 🐛 Troubleshooting

**App won't start:**
- Ensure Node.js installed (v16+)
- Run `npm install` again
- Delete `node_modules`, reinstall
- Check console for errors

**API not working:**
- Verify API key (no spaces)
- Test connection in Settings
- Check internet connection
- Check quota at Google AI Studio

**Music player issues:**
- **YouTube Error 153**: Restart app
- **No sound**: Check volume slider
- **Not loading**: Check internet
- **Spotify volume**: Use player controls

**Timer disappeared:**
- It's running in background!
- Go to Pomodoro page to see
- Check Dashboard for status

**Lost data:**
- Check: `%APPDATA%\study-buddy-pro\`
- Files: `study-buddy-data.json`, `config.json`
- Everything auto-saved - should be there!

**Database errors:**
- App creates database automatically
- Location: `%APPDATA%/study-buddy-pro/`
- Delete `.db` file to reset (loses flashcards)

### 📦 Building Executables

Create distributable applications:

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

Built files → `dist/` folder

### 📊 Usage Analytics

Your activity is tracked locally in `study-buddy-data.json`:
- AI responses with timestamps
- Navigation patterns
- Timer sessions completed
- Music playback history
- Error logs

**Access**: AppData folder (see above)

### 🔒 Privacy Note

- 100% local storage
- No cloud, no tracking
- Only API calls: Google Gemini
- You own all data
- Open source code

### 🎯 Workflow Example

**Perfect Study Session:**
1. Open app → Pomodoro
2. Select "Focus Session" (25 min)
3. Add Lofi playlist → Play
4. Click "Start Timer"
5. Go to Summarizer → Paste notes
6. Generate summary while timer runs
7. Review summary, take breaks
8. Timer alerts when done! 🎉
9. Close app - everything saved!

### 📱 Keyboard Shortcuts

*Coming soon in v2.6.0*

### 🆘 Need Help?

- **In-app**: Check About section
- **Docs**: README.md, ARCHITECTURE.md
- **Issues**: GitHub Issues page
- **Data**: All saved in AppData folder

---

**Happy Studying! 📚✨**

*Study smarter with AI, music, and the perfect timer.*

**v2.5.0** - Now with auto-save, music player, and persistent state!
