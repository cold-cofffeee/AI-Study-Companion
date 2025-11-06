# Changelog

All notable changes to Study Buddy Pro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

### [2.1.0] - Planned
- Cloud sync option
- Mobile companion app
- Voice notes integration
- Collaborative study groups
- Advanced analytics dashboard

### [3.0.0] - Future
- Offline AI models
- Browser extension
- Calendar integration
- Gamification features
- Multi-language support

---

For more details, see the [README.md](README.md) file.
