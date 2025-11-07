# Study Buddy Pro - AI-Powered Learning Companion

![Study Buddy Pro](https://img.shields.io/badge/Platform-Electron-blue)
![Version](https://img.shields.io/badge/Version-2.8.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📚 Overview

Study Buddy Pro is a comprehensive AI-powered learning companion built with Electron.js. It combines intelligent study tools with a built-in Pomodoro timer and integrated music player to create the ultimate productivity environment for students.

**Key Highlights:**
- 💾 **Complete Data Caching** - All user inputs, AI responses, and errors cached in JSON
- 🔄 **Automatic State Persistence** - Never lose your work! Resume exactly where you left off
- 📋 **Copy to Clipboard** - One-click copy for all AI-generated content
- 📄 **Professional PDF Export** - Beautifully formatted documents with watermarks
- 🇧🇩 **HSC Bangladesh Support** - Curriculum-aligned content for HSC students
- 🎵 **Integrated Music Player** - YouTube & Spotify support with custom playlists
- 🍅 **Advanced Pomodoro Timer** - ADHD mode, auto-start, ambient sounds, detailed schedules
- 🤖 **AI-Powered Tools** - Summaries, quizzes, problems, and study schedules
- 📊 **Comprehensive Activity Tracking** - Complete usage history and analytics
- 🐛 **Error Tracking** - All errors logged with context for debugging
- 🌐 **Cross-Platform** - Runs on Windows, macOS, and Linux

## ✨ Features

### Core Modules

1. **📊 Dashboard** - Overview & Daily Challenges
   - Real-time study session statistics
   - Daily learning challenges with streaks
   - Progress tracking and analytics
   - Quick access to all modules

2. **📝 AI Study Summarizer** - Smart Content Analysis
   - Generate bullet-point summaries from any text
   - Auto-create quiz questions
   - Memory tricks and mnemonics generation
   - **Multi-tab output system** - Keep all AI responses
   - Support for 10+ languages
   - **📋 Copy to clipboard** - Instant content sharing
   - **📄 Export to PDF** - Professional formatted documents
   - **💾 Complete caching** - All inputs, outputs, and errors saved
   - **📈 Generation history** - Last 30 generations tracked
   - **🔄 Auto-restore** - Resume with all previous outputs
   - HSC Bangladesh context support

3. **🧮 Random Problem Generator** - Practice Made Easy
   - Generate problems for Math, Physics, Chemistry, Biology, CS
   - 4 difficulty levels: Easy, Medium, Hard, Expert
   - **Progressive disclosure** - Question → Hints → Solution workflow
   - **Individual timers per problem** - Track solving time
   - Step-by-step solutions with final answer highlighting
   - **📋 Copy individual/all problems** - Share with classmates
   - **📄 PDF export per problem** - Formatted problem cards with metadata
   - **💾 Complete persistence** - Problems and timers saved
   - **📈 Generation history** - Last 30 problem sets tracked
   - **Complete state persistence** - All problems and timer states saved
   - HSC Bangladesh syllabus-aligned problems

4. **🍅 Enhanced Pomodoro Timer** - Ultimate Focus Tool
   - **Persistent timer** - Continues running across module navigation
   - **AI-powered detailed schedules** - Topic breakdowns with subtopics
   - **Difficulty-based durations** - Easy (25min), Medium (35min), Hard (45min)
   - **📋 Copy schedule** - Share study plans
   - **📄 PDF export** - Formatted task lists with metadata
   - **💾 Schedule caching** - All generated plans saved
   - **📈 Generation history** - Last 20 schedules tracked
   - **🔄 Auto-restore** - Resume with saved schedules
   - **Integrated music player** - YouTube & Spotify embeds
   - **ADHD Mode** - Shorter sessions (10-2-5 minutes)
   - **Custom playlists** - Add your favorite study music
   - **Ambient sounds** - Focus-enhancing background audio
   - **Volume control** - Unified volume slider for all audio
   - Auto-start next session
   - Session history tracking
   - Daily session counter
   - Motivational quotes
   - Desktop notifications
   - HSC Bangladesh curriculum-based plans

5. **🎵 Music Player** - Built-in Study Music
   - **YouTube embed support** - Play any YouTube video/playlist
   - **Spotify integration** - Play Spotify playlists
   - **Custom playlists** - Save your favorite study music
   - Pre-configured focus playlists (Lofi, Classical, Ambient)
   - Interactive player controls
   - Volume control with slider
   - Playlist management (add/remove)

6. **⏰ Study Optimizer** - AI Schedule Generator
   - Pomodoro-based study schedules
   - AI-generated topic breakdowns
   - Adaptive time blocks by difficulty
   - Send schedules to Pomodoro timer
   - **📋 Copy schedule** - Share with study groups
   - **📄 PDF export** - Professional study plans
   - **💾 Complete caching** - Schedules, inputs, errors saved
   - **📈 Generation history** - Last 20 schedules tracked
   - **🔄 Auto-restore** - Resume with all inputs and schedules
   - HSC Bangladesh context support

7. **🎴 Flashcard System** - Spaced Repetition Learning
   - SM-2 algorithm for optimal review scheduling
   - Create custom flashcards with categories
   - Difficulty ratings (Easy, Medium, Hard)
   - **💾 Input caching** - Never lose incomplete cards
   - **📈 Creation history** - Last 50 cards tracked
   - **🔄 Auto-restore** - Resume card creation
   - **🐛 Error tracking** - Failed saves logged
   - Track review progress
   - **Database storage** - Permanent flashcard library

8. **❓ Reverse Quiz Generator** - Learn from Answers
   - Generate questions from answers/definitions
   - Multiple quiz types (Multiple Choice, True/False, Fill in the Blank)
   - **📋 Copy quiz** - Share with classmates
   - **📄 PDF export** - Formatted quiz documents
   - **💾 Complete caching** - Inputs, quizzes, answers saved
   - **📈 Generation history** - Last 20 quizzes tracked
   - **🔄 Auto-restore** - Resume with saved quizzes
   - **🐛 Error tracking** - Generation failures logged
   - HSC Bangladesh context support

9. **⚙️ Settings & Preferences** - Full Customization
   - Secure API key management with testing
   - Theme selection (Light/Dark/Auto)
   - Pomodoro customization (ADHD mode, auto-start, sounds)
   - Volume control
   - Language preferences
   - **All settings auto-saved**

## 🎯 What's New in v2.8.0

### 🗄️ Comprehensive Data Caching System
- **Complete State Persistence**: All user inputs, AI responses, and errors cached in JSON
- **Generation History**: Track last 20-50 generations per module with timestamps
- **Error Tracking**: All errors logged with context (timestamp, action, inputs)
- **Auto-Restore**: Resume exactly where you left off across app restarts
- **Smart Cleanup**: History auto-trims to prevent unlimited growth

### Module-Specific Caching
- **Flashcards**: Input fields, created cards (last 50), error logs
- **Quiz Generator**: Answers, quiz types, generated content (last 20), errors
- **Study Optimizer**: Subject, topics, schedules (last 20), HSC context, errors
- **Summarizer**: Text, language, all outputs (last 30), generation type, errors
- **Pomodoro**: Subjects, topics, schedules (last 20), HSC context, errors
- **Problems**: Settings, generated problems (last 30), timers, errors

### Technical Improvements
- IPC-based secure state management
- Atomic save operations
- Error resilience (failures don't crash app)
- Timestamp-based versioning
- Configurable history limits per module

## 🎯 What's New in v2.7.0

### 📋 Copy to Clipboard Feature
- **One-click copying** for all AI-generated content
- Available in all modules: Summarizer, Problems, Quiz, Optimizer, Pomodoro
- Toast notifications confirm successful copy
- Plain text formatting for easy pasting anywhere
- Share content instantly with classmates or study groups

### 📄 Professional PDF Export
- **Export all AI content as beautifully formatted PDFs**
- Available in all AI modules
- Professional styling with:
  - Header with title and module information
  - Metadata (generation date, subject, difficulty level, etc.)
  - Color-coded difficulty indicators (Easy=Green, Medium=Orange, Hard=Red)
  - Structured problem cards with hints and solutions
  - Task breakdowns with subtopics and key points
  - Footer with generation info
  - Optimized for A4 printing
- Uses browser's native print dialog
- Perfect for offline studying or printing handouts

### 💾 Enhanced State Persistence
- **All AI-generated content now persists permanently**
- Close and reopen the app - everything stays exactly as you left it:
  - **Summarizer**: All generated summaries, quizzes, and mnemonics
  - **Problems**: Generated problems with individual timer states
  - **Quiz**: Current quiz questions and user answers
  - **Optimizer**: Complete study schedules with metadata
  - **Pomodoro**: Generated task schedules with detailed breakdowns
- Individual problem timers saved per problem
- Never lose your work again!

### 🍅 Improved Pomodoro Timer
- **Realistic difficulty-based durations**:
  - Easy topics: 25 minutes (sufficient for basic concepts)
  - Medium topics: 35 minutes (ideal for practice problems)
  - Hard topics: 45 minutes (deep focus for complex topics)
- AI-generated detailed study plans with:
  - Topic and subtopic breakdowns
  - Difficulty classification per task
  - Key focus points for each session
  - Color-coded difficulty indicators
- Export schedules as formatted PDFs
- Copy schedules to clipboard

### 🧮 Problem Generator Enhancements
- **Progressive disclosure system**:
  - First see the question only
  - Click "Show Hints" to reveal helpful tips
  - Click "Show Solution" to see complete answer
- **Individual timers per problem**:
  - Track how long each problem takes
  - Start/pause/resume per problem
  - Timer states persist across sessions
- Better PDF formatting with problem cards
- Copy all problems at once

### 🇧🇩 HSC Bangladesh Support
- **Checkbox in all AI modules** to enable HSC-specific content
- Comprehensive HSC syllabus database (500+ chapters)
- Curriculum-aligned responses for:
  - Physics (1st & 2nd Paper)
  - Higher Math (1st & 2nd Paper)
  - Chemistry (1st & 2nd Paper)
  - Biology (Botany & Zoology)
  - ICT (Programming, Networking, Web Design)
  - Statistics, IBA, General Knowledge
  - English & Bangla (গদ্য, পদ্য, ব্যাকরণ)
- Bengali terminology alongside English
- HSC board exam question patterns
- Chapter-specific problem generation

## 🔄 Previous Features (v2.5.0 & v2.6.0)

### Persistent State Management
- **Never lose your work!** All data automatically saved to JSON
- Module states persist across app restarts
- **Auto-save** - Your inputs saved as you type (1-second debounce)
- Timer continues running even when switching modules
- Music player stays active across navigation

### 🎵 Integrated Music Player
- **YouTube & Spotify embeds** - No external apps needed
- **Custom playlist support** - Add any public YouTube/Spotify playlist
- **Pre-configured playlists** - Lofi, Classical, Piano, Ambient
- **Volume control** - Unified slider controls music volume
- **Interactive controls** - Play, pause, skip within embedded player
- **Persistent playback** - Music continues across module switches

### 📊 Comprehensive Activity Tracking
Everything is logged to JSON for analytics:
- All AI-generated responses (summaries, quizzes, problems)
- User navigation patterns
- Pomodoro session completions
- Music playback history
- Error logs with stack traces
- Settings changes
- Database operations

### 🚀 Performance Improvements
- **Module caching** - Instant navigation (no reloading)
- **Background timer** - Pomodoro runs without blocking UI
- **Optimized state saves** - Efficient JSON writing
- **Memory management** - Singleton patterns for shared resources

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key (free)

### Setup Instructions

1. **Clone or Download**
   ```bash
   cd StudyBuddy-Electron
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Get Google Gemini API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key (free tier available)
   - Copy the API key

4. **Run the Application**
   ```bash
   npm start
   ```

5. **Configure API Key**
   - Launch Study Buddy Pro
   - Go to Settings (⚙️)
   - Enter your API key
   - Click "Test Connection" to verify
   - Click "Save All Settings"

6. **Start Studying! 🎓**
   - All your data is automatically saved
   - Timer and music continue across navigation
   - Close and reopen anytime - your work is preserved!

## 📦 Building for Distribution

### Windows
```bash
npm run build:win
```

### macOS
```bash
npm run build:mac
```

### Linux
```bash
npm run build:linux
```

Built applications will be in the `dist` folder.

## 🛠️ Technology Stack

- **Electron.js** - Cross-platform desktop framework
- **Node.js** - JavaScript runtime
- **JSON File Storage** - All data stored in study-buddy-data.json
- **axios** - HTTP client for API calls
- **electron-store** - Settings persistence
- **pdfkit** - PDF generation
- **blob-stream** - PDF generation helper
- **Google Gemini AI** - AI-powered features
- **YouTube IFrame API** - Embedded music player
- **Spotify Web Embed** - Integrated playlists

### Architecture Highlights
- **Singleton Pattern** - MusicPlayer, AppState for global state
- **Module Caching** - DOM elements preserved across navigation
- **JSON Data Store** - Comprehensive activity & response logging
- **localStorage + IPC** - Dual-layer state persistence
- **No Database Server** - Everything in JSON files for simplicity

## 📖 Usage Guide

### Getting Started

1. **First Launch**
   - Configure your Gemini API key in Settings
   - Customize Pomodoro timer (optional)
   - Add your favorite study music playlists (optional)

2. **Basic Workflow**
   - **Summarizer**: Paste notes → Generate summary/quiz/mnemonics → Auto-saved!
   - **Problems**: Select subject & difficulty → Generate → Solve with timer
   - **Optimizer**: Enter topics → Generate AI schedule → Send to Pomodoro
   - **Pomodoro**: Start timer → Play music → Focus! (Timer runs in background)
   - **Flashcards**: Create cards → Review → Track progress
   - **Quiz**: Input definitions → Generate quiz → Practice

### Pomodoro Timer Features

- **Start a Session**: Click Focus, Short Break, or Long Break
- **Add Music**: Select YouTube/Spotify playlist or add custom URL
- **Volume Control**: Use slider in Sound Settings
- **Navigate Freely**: Timer continues running in background
- **ADHD Mode**: Enable for shorter sessions (10-2-5 min)
- **Custom Playlists**: Add any public YouTube/Spotify playlist URL

### Music Player Guide

**Pre-configured Playlists:**
- Lofi Hip Hop - Beats to Study
- Deep Focus Music
- Piano Music for Studying
- Classical Music Mix
- Ambient Study Music

**Add Custom Playlists:**
1. Go to Pomodoro → Music → Custom tab
2. Paste YouTube or Spotify playlist URL
3. Enter a name for the playlist
4. Click "Add Playlist"
5. Your playlist is saved permanently!

**Supported URLs:**
- `https://www.youtube.com/watch?v=...`
- `https://youtu.be/...`
- `https://www.youtube.com/embed/...`
- `https://open.spotify.com/playlist/...`
- `https://open.spotify.com/embed/playlist/...`

### Tips & Tricks

- ✨ **Auto-save is always active** - Just close the app anytime!
- 🎵 **Music continues playing** even when you switch modules
- 🍅 **Timer keeps running** in background - check dashboard for status
- 📝 **All AI responses saved** - Review past summaries in Summarizer
- 📊 **Activity tracking** - Your usage data stored in JSON for insights
- ⚡ **Fast navigation** - Modules are cached (no reloading)
- 🎨 **Customize everything** - Themes, sounds, timer durations
- 📱 **Desktop notifications** - Get alerts when sessions complete
- 💾 **Export to PDF** - Save important content for offline access

### Troubleshooting

**Music player not loading?**
- Check your internet connection
- Try a different playlist
- Restart the app

**Timer not visible?**
- It's running in background! Check the Pomodoro page
- Session count updates when complete

**API errors?**
- Verify your API key in Settings → Test Connection
- Check API quota at Google AI Studio
- Ensure internet connectivity

**Lost data?**
- Check: `C:\Users\[YourName]\AppData\Roaming\study-buddy-pro\`
- Files: `study-buddy-data.json` and `config.json`
- Contact support if data appears corrupted

## 🎨 Themes

Study Buddy Pro supports three theme modes:

- **Light** - Bright, clean interface for daytime study
- **Dark** - Easy on the eyes for night study sessions
- **Auto** - Follows your system preference

Change themes in Settings → Appearance.

## 🌍 Supported Languages

AI responses can be generated in:
- English
- Spanish
- French
- German
- Italian
- Portuguese
- Russian
- Japanese
- Korean
- Chinese

## � Data Storage

### JSON Data Store (`study-buddy-data.json`)
Comprehensive logging and caching system:
- **AI Responses**: Every summary, quiz, problem, and schedule generated
- **Activities**: Complete user interaction history (navigation, timer actions, music playback)
- **Module States**: All inputs and outputs from every module
- **Sessions**: Pomodoro session history with timestamps
- **Flashcards**: All flashcards with difficulty ratings and review schedules
- **Errors**: Detailed error logs with stack traces for debugging
- **Settings**: All preferences and configurations

**Storage Location**:
- Windows: `C:\Users\[YourName]\AppData\Roaming\study-buddy-pro\`
- macOS: `~/Library/Application Support/study-buddy-pro/`
- Linux: `~/.config/study-buddy-pro/`

**Note**: Everything is stored in a single JSON file for simplicity - no database server required!

### What Gets Saved Automatically:
✅ All AI-generated content (summaries, quizzes, problems, schedules)  
✅ Flashcards with difficulty ratings and category organization  
✅ User inputs in all modules (auto-saved as you type)  
✅ Pomodoro timer state (time, mode, sessions completed)  
✅ Music player state (current song, volume, playlists)  
✅ Custom playlists (YouTube & Spotify URLs)  
✅ All settings and preferences  
✅ Every user action timestamped for analytics  

## 🔒 Privacy & Security

- **100% Local Storage** - All data stored on your device
- **No Telemetry** - No tracking or analytics sent to servers
- **API Key Security** - Stored in encrypted Electron store
- **Data Control** - Full ownership of your study data
- **No Cloud Sync** - Everything stays on your machine
- **Open Source** - Code is transparent and auditable

**API Calls**: Only Google Gemini AI receives your study content for processing. No other third-party services have access to your data.

## 📈 Activity Analytics

Your usage data is tracked locally for insights:
- Total study sessions completed
- AI features usage (which tools you use most)
- Pomodoro productivity patterns
- Music listening habits
- Navigation patterns
- Error frequency and types

**Access your data**: Check `study-buddy-data.json` in the app data folder.

## 🔧 Advanced Configuration

### Custom Data Location
Edit `main.js` to change data storage path:
```javascript
this.dataPath = path.join(app.getPath('userData'), 'study-buddy-data.json');
```

### Module Caching
All modules are cached in memory for instant navigation. Clear cache by restarting the app.

### YouTube Player Configuration
Modify `MusicPlayer.js` to customize embed parameters:
```javascript
embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`;
```

## 🐛 Troubleshooting

### API Key Issues
- Make sure your API key is valid and active
- Test connection in Settings → "Test Connection"
- Check internet connectivity
- Verify API key has no extra spaces or line breaks
- Check API quota at [Google AI Studio](https://aistudio.google.com/)

### Music Player Issues
- **YouTube Error 153**: Restart the app (configuration issue)
- **Player not loading**: Check internet connection
- **No sound**: Check volume slider in Sound Settings
- **Spotify controls not working**: Use built-in Spotify player controls (volume API limitation)

### State Not Saving
- Check if app has write permissions to AppData folder
- Verify `study-buddy-data.json` exists and is not corrupted
- Check console for save errors (F12 → Developer Tools)
- Try clearing localStorage: Settings → Clear Cache (if implemented)

### Performance Issues
- Clear old AI responses: Manually edit `study-buddy-data.json`
- Limit activity log size (edit JsonDataStore.js)
- Restart app to clear module cache
- Close unused browser dev tools

### Data Issues
- Check if `study-buddy-data.json` is accessible in AppData folder
- Ensure write permissions in user data folder
- Backup and delete JSON file to reset: `study-buddy-data.json` (will lose all data!)
- Check Developer Tools console (F12) for JSON parsing errors

## 📝 License

MIT License - See LICENSE file for details

## 🙏 Credits

- **AI Provider**: Google Gemini AI
- **Framework**: Electron.js
- **Music Integration**: YouTube IFrame API, Spotify Web Embed
- **Data Storage**: JSON file-based system (electron-store, custom JsonDataStore)
- **UI Design**: Custom CSS with modern aesthetics
- **Icon & Branding**: Study Buddy Pro original design

## 🚀 Future Roadmap

Planned features:
- 📱 Mobile companion app
- ☁️ Optional cloud sync
- 🎨 More themes and customization
- 📊 Advanced analytics dashboard
- 🤝 Study groups and collaboration
- 🎯 Goal setting and achievement tracking
- 🔔 Smart notifications based on study patterns
- 🌐 More AI model integrations

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Development Guidelines**:
- Follow existing code style
- Test all features before submitting
- Update documentation for new features
- Add activity logging for user actions
- Implement state persistence for new modules

## 📧 Support

For support, questions, or feedback:
- 🐛 Report bugs via GitHub Issues
- 💡 Suggest features in Discussions
- 📖 Check the built-in About section
- 📚 Review documentation files

---

**Made with ❤️ for students everywhere**

*Study smarter, not harder.* 📚✨

**Version 2.5.0** - Now with persistent state, integrated music player, and comprehensive activity tracking!
