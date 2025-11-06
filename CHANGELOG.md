# Changelog

All notable changes to Study Buddy Pro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.0] - 2025-11-06

### 🎵 Major Update - Music Player & State Persistence

#### Added
- **🎵 Integrated Music Player**:
  - YouTube embed support with IFrame API
  - Spotify Web Player integration
  - Custom playlist management (save favorite playlists)
  - Pre-configured focus music playlists (Lofi, Classical, Piano, Ambient)
  - Interactive player controls (play, pause, skip)
  - Volume control slider
  - Music continues playing across module navigation
  - Playlist persistence (saved to localStorage)
  
- **🔄 Comprehensive State Persistence**:
  - AppState.js - Global state manager with localStorage
  - All module states automatically saved
  - Timer continues running in background
  - Music player state preserved across app restarts
  - Auto-save for all text inputs (1-second debounce)
  - Never lose your work again!

- **📊 Activity Tracking System**:
  - All AI responses logged with timestamps
  - User navigation patterns tracked
  - Pomodoro session analytics
  - Music playback history
  - Error logging with stack traces
  - Complete usage analytics in JSON

- **🚀 Performance Optimizations**:
  - Module caching - No reloading when switching pages
  - Singleton patterns for MusicPlayer and AppState
  - Efficient state serialization
  - Background timer with non-blocking UI
  - Optimized DOM manipulation

#### Changed
- **Pomodoro Timer**:
  - Removed floating timer popup (runs in background)
  - Removed persistent music container
  - Integrated music player directly into Pomodoro page
  - Volume slider now controls YouTube player volume
  - Timer state persists across navigation
  - Music keeps playing when switching modules

- **Module System**:
  - Modules no longer destroyed on navigation
  - DOM elements cached in memory
  - Instant module switching
  - State preserved for all modules

- **Electron Main Process**:
  - Added `webSecurity: false` for YouTube embeds
  - Added `allowRunningInsecureContent: true`
  - New IPC handlers: `log-activity`, `log-error`
  - Enhanced module state save/load

#### Improved
- **Summarizer**: Auto-saves input text, multiple output tabs persist
- **Problems**: Generated problems saved across sessions
- **Quiz**: Quiz content and inputs preserved
- **Optimizer**: Generated schedules persist
- **MusicPlayer**: 
  - setVolume() method with YouTube IFrame API
  - restorePlayerState() on app startup
  - savePlayerState() for persistence
  - Better error handling and logging

#### Fixed
- YouTube player Error 153 (removed problematic origin parameter)
- Volume slider not controlling music player
- State loss when closing/reopening app
- Music stopping when navigating away from Pomodoro
- Timer resetting when switching modules
- Custom playlists not being saved
- iframe controls not clickable (CSS pointer-events fix)

#### Technical Changes
- Added `AppState.js` with localStorage integration
- Enhanced `JsonDataStore.js` with activity logging
- Updated `MusicPlayer.js` with volume control
- Modified all modules to support state persistence
- Added comprehensive IPC logging system
- Implemented module lifecycle methods (cleanup, onShow)

---

## [2.0.0] - 2025-11-06

### 🎉 Complete Rewrite - C# to Electron.js

#### Added
- **Cross-Platform Support**: Now runs on Windows, macOS, and Linux
- **JSON-Based Storage**: Single-file database for all app data with timestamps
- **Pomodoro Timer Module**: 
  - ADHD-friendly focus timer
  - Custom timer with beautiful popup UI
  - Session tracking and statistics
  - Auto-start next session option
- **Enhanced Study Optimizer**:
  - Subject + Topics input fields
  - Direct schedule transfer to Pomodoro timer
  - Improved markdown rendering
- **Streak Tracking**: Automatic calculation of consecutive study days
- **Activity Logging**: All actions timestamped and cached
- **AI Response Caching**: Reduces API calls and costs
- **Module State Persistence**: Each module remembers its state
- **Dark/Light Theme Toggle**: System-wide theme switching
- **Export Capabilities**: PDF and image export for flashcards

#### Changed
- **Architecture**: Migrated from C# WinForms to Electron.js
- **Database**: Replaced SQL Server with JSON file storage
- **AI Model**: Upgraded to Google Gemini 2.0-flash-exp
- **UI Framework**: Complete redesign with modern web technologies
- **Settings Storage**: Using electron-store with encryption

#### Improved
- **Performance**: Faster startup and module loading
- **Security**: Encrypted API key storage
- **User Experience**: Smoother animations and transitions
- **Error Handling**: Better error messages and recovery
- **Offline Capability**: Works without internet after initial setup

#### Technical Details
- Electron v28.1.3
- Node.js v24.11.0
- Modern JavaScript (ES6+)
- Modular architecture for easy maintenance

---

## [1.0.0] - 2024

### Initial Release (C# WinForms)
- AI-powered text summarization
- Practice problem generator
- Flashcard creation system
- Reverse quiz functionality
- Study schedule optimizer
- Basic dashboard
- Windows-only desktop application

---

## Future Plans

### [2.6.0] - Planned
- Analytics dashboard for tracked activities
- Export usage data to CSV
- Backup/restore functionality
- Playlist sharing
- Keyboard shortcuts
- More theme options

### [3.0.0] - Future
- Cloud sync option (optional)
- Mobile companion app
- Voice notes integration
- Collaborative study groups
- Offline AI models
- Calendar integration
- Gamification features

---

For more details, see the [README.md](README.md) file.
