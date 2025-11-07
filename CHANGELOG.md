# Changelog

All notable changes to Study Buddy Pro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.7.0] - 2025-11-07

### 🎯 Major UX Improvements - Export & Persistence

#### Added
- **📋 Copy to Clipboard Feature**:
  - All AI-generated content can now be copied with one click
  - Added "Copy" button to all modules: Summarizer, Problems, Quiz, Optimizer, Pomodoro
  - Toast notifications confirm successful copy
  - Plain text formatting for easy pasting

- **📄 PDF Export Feature**:
  - Professional PDF export for all AI-generated content
  - "Save as PDF" button in all modules
  - Beautifully formatted PDFs with:
    - Professional header and footer
    - Metadata (generation date, subject, difficulty, etc.)
    - Color-coded difficulty levels (Easy=Green, Medium=Orange, Hard=Red)
    - Structured problem cards with hints and solutions
    - Task breakdowns with subtopics and key points
    - Optimized for A4 printing
  - Uses browser's native print dialog for saving

- **💾 Enhanced State Persistence**:
  - All AI-generated content now persists in `study-buddy-data.json`
  - Content survives app restarts
  - Modules restore exactly as you left them:
    - Summarizer: All generated summaries, quizzes, and mnemonics
    - Problems: Generated problems with individual timer states
    - Quiz: Current quiz questions and user answers
    - Optimizer: Study schedules with all metadata
    - Pomodoro: Generated task schedules with details
  - Individual problem timers persist across sessions

- **🛠️ Export Utilities (`ExportUtils.js`)**:
  - Centralized export functionality
  - `copyToClipboard()` - Copy with custom success messages
  - `exportToPDF()` - Generate professional PDFs
  - `htmlToPlainText()` - Convert HTML to plain text
  - Consistent styling across all modules

#### Enhanced
- **🍅 Pomodoro Timer Durations**:
  - Updated task durations based on difficulty:
    - Easy: 25 minutes (was 15)
    - Medium: 35 minutes (was 25)
    - Hard: 45 minutes (was 35)
  - More realistic time allocation for deep study
  - AI prompt aligned with duration settings
  - Post-processing ensures correct durations

- **🧮 Problem Generator**:
  - Added Copy and PDF export buttons
  - Smart problem parsing for PDF export
  - Individual timers for each problem
  - Timer states saved and restored
  - Problems display hidden until generation

- **📝 Summarizer Output**:
  - Enhanced PDF export with input/output statistics
  - Multiple output tabs preserved
  - All outputs saved to JSON

- **⏰ Study Optimizer**:
  - Added Copy and PDF export buttons
  - Schedule content now persists correctly
  - PDF includes complete schedule breakdown

- **❓ Reverse Quiz**:
  - Added Copy and PDF export buttons
  - Quiz content persists across sessions
  - PDF includes subject and question count

#### Fixed
- State persistence now working correctly for all modules
- Generated content saves immediately after creation
- Module state restoration on app startup
- Export buttons consistently styled across all modules

#### Technical
- Added `ExportUtils.js` helper module
- Integrated into `index.html` script loading order
- All modules updated to use centralized export functions
- Pomodoro module now stores `scheduleData` for export
- Problems module saves `problemTimers` object
- Consistent metadata tracking across all exports

## [2.6.0] - 2025-11-07

### 🎓 Bangladesh HSC Student Feature

#### Added
- **🇧🇩 HSC Bangladesh Context**:
  - Checkbox in all AI modules to enable HSC-specific responses
  - Comprehensive HSC syllabus database (500+ chapters)
  - All major subjects: Physics, Higher Math, Chemistry, Biology, ICT, Statistics, IBA
  - AI responses aligned with Bangladesh HSC curriculum
  - Bilingual support (Bengali + English terminology)
  - HSC board exam question patterns
  - Subject-specific chapter organization

- **HSC Syllabus Data (`HSCSyllabusData.js`)**:
  - Physics (1st & 2nd Paper) - Complete chapter mapping
  - Higher Math (1st & 2nd Paper) - All topics included
  - Chemistry (1st & 2nd Paper) - Lab to Economic Chemistry
  - ICT - Programming, Networking, Database, HTML, Web Design
  - Biology - Botany and Zoology chapters
  - Statistics - পরিসংখ্যান 1st & 2nd Paper
  - General Knowledge - Bangladesh & International affairs
  - Mental Ability - Test patterns
  - IBA Admission - DU, JU, BUP formats
  - English & Bangla - গদ্য, পদ্য, ব্যাকরণ

- **Enhanced Pomodoro Study Plan Generator**:
  - Detailed topic breakdown with subtopics
  - Difficulty levels for each topic (Easy/Medium/Hard)
  - Duration estimation per topic
  - Key focus points for each topic
  - HSC syllabus-aligned task generation
  - Visual difficulty indicators (color-coded)
  - Structured JSON output with metadata

- **Interactive Problem Generator**:
  - Progressive disclosure: Question → Hints → Solution
  - Three-stage problem solving workflow
  - "Show Hints" button reveals helpful tips first
  - "Show Solution" appears after viewing hints
  - Color-coded sections (yellow hints, green solution)
  - Structured problem format with clear sections
  - Final answer highlighted in solution box

- **Module Integration**:
  - Summarizer: HSC curriculum-aligned summaries
  - Problem Generator: HSC board question patterns with hints
  - Study Optimizer: HSC exam preparation schedules
  - Pomodoro Timer: Detailed HSC-based study plans
  - Quiz Generator: MCQ format similar to board exams
  - Memory Tricks: Bengali cultural references

- **Documentation**:
  - HSC-FEATURE.md - Complete feature guide
  - Usage examples and comparisons
  - Technical implementation details

#### Changed
- **GeminiApiClient.js**:
  - Converted from axios to native fetch API
  - Browser and Node.js compatible
  - Enhanced error handling with detailed messages

- **Problem Display**:
  - Interactive three-stage revelation (Question → Hints → Solution)
  - Better visual hierarchy with color coding
  - Improved readability with proper spacing

- **Pomodoro Schedule Display**:
  - Rich task cards with subtopics
  - Difficulty and duration indicators
  - Key points highlighted
  - Better organization and visual appeal

#### Fixed
- Settings page null reference error
- GeminiApiClient not loading in browser context
- Missing HSC checkbox in Pomodoro module

#### Benefits for HSC Students
- ✅ Content matches exact HSC syllabus
- ✅ Familiar textbook terminology
- ✅ Board exam-style questions
- ✅ Both Bengali and English support
- ✅ No irrelevant content
- ✅ Exam-focused preparation
- ✅ Step-by-step learning with hints
- ✅ Detailed study breakdowns

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
