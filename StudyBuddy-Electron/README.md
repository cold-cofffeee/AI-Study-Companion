# Study Buddy Pro - Electron Edition

![Study Buddy Pro](https://img.shields.io/badge/Platform-Electron-blue)
![Version](https://img.shields.io/badge/Version-2.0.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📚 Overview

Study Buddy Pro is a comprehensive AI-powered learning companion built with Electron.js. It helps students enhance their learning experience through intelligent summaries, practice problems, optimized study schedules, and spaced repetition flashcards.

**Converted from:** C# WinForms Desktop Application  
**Now runs on:** Windows, macOS, and Linux

## ✨ Features

### Core Modules

1. **📊 Dashboard** - Overview & Daily Challenges
   - Study session statistics
   - Daily learning challenges
   - Progress tracking
   - Quick access to all features

2. **📝 Study Summarizer** - AI-Powered Content Analysis
   - Generate bullet-point summaries
   - Create quiz questions automatically
   - Memory tricks and mnemonics generation
   - Support for 10+ languages
   - Export to PDF

3. **🧮 Random Problem Generator**
   - Generate practice problems for Math, Physics, Chemistry, Biology, Computer Science
   - Adjustable difficulty levels (Easy, Medium, Hard, Expert)
   - Step-by-step solutions
   - Built-in timer for solving challenges

4. **⏰ Study Time Optimizer**
   - Pomodoro-based study schedules
   - Adaptive time blocks based on content difficulty
   - Break reminders and notifications
   - Focus session tracking

5. **🎴 Flashcard System** - Spaced Repetition Learning
   - SM-2 algorithm for optimal review scheduling
   - Create custom flashcards
   - Track review progress
   - Category organization

6. **❓ Reverse Quiz Generator**
   - Generate questions from answers/definitions
   - Multiple quiz types (Multiple Choice, True/False, Fill in the Blank)
   - Automatic quiz creation
   - Export capabilities

7. **⚙️ Settings & Preferences**
   - API key management with testing
   - Theme selection (Light/Dark/Auto)
   - Language preferences
   - Study session customization

8. **ℹ️ About & Help**
   - User guide and documentation
   - Feature explanations
   - Getting started guide

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
- **better-sqlite3** - Fast SQLite database
- **axios** - HTTP client for API calls
- **electron-store** - Settings persistence
- **pdfkit** - PDF generation
- **Google Gemini AI** - AI-powered features

## 📖 Usage Guide

### Basic Workflow

1. **Summarizer**: Paste study material → Select language → Generate summary/quiz/mnemonics
2. **Problems**: Choose subject & difficulty → Generate problems → Solve with timer
3. **Optimizer**: Enter topic & duration → Generate schedule → Start focus session
4. **Flashcards**: Create cards → Review with spaced repetition → Track progress
5. **Quiz**: Input answers/concepts → Generate quiz → Practice and review

### Tips

- Use the dashboard to track your progress
- Enable notifications for study reminders
- Customize Pomodoro timers in Settings
- Export important content to PDF for offline access
- Try different difficulty levels to challenge yourself

## 🎨 Themes

Study Buddy Pro supports three theme modes:

- **Light** - Bright, clean interface
- **Dark** - Easy on the eyes for night study
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

## 📊 Database

All data is stored locally using SQLite:
- Study sessions history
- Flashcards with review schedules
- User preferences and settings
- Daily challenges

**Location**: `%APPDATA%/StudyBuddy/studybuddy.db` (Windows) or equivalent on other platforms

## 🔒 Privacy

- All data is stored locally on your device
- API key is stored securely in encrypted settings
- No user data is collected or transmitted (except API calls to Google Gemini)
- You have full control over your study data

## 🐛 Troubleshooting

### API Key Issues
- Make sure your API key is valid
- Test connection in Settings
- Check if you have internet connectivity
- Verify API key has no extra spaces

### Application Won't Start
- Ensure Node.js is installed
- Run `npm install` again
- Check console for error messages
- Try deleting `node_modules` and reinstalling

### Database Errors
- Check if database file is accessible
- Ensure write permissions in user data folder
- Try resetting settings to defaults

## 📝 License

MIT License - See LICENSE file for details

## 🙏 Credits

- **Original C# Version**: Study Buddy (WinForms)
- **Powered by**: Google Gemini AI
- **Built with**: Electron.js
- **Icon & Design**: Custom design for Study Buddy Pro

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📧 Support

For support, questions, or feedback:
- Open an issue on GitHub
- Check the About section in the app
- Review the documentation

---

**Made with ❤️ for students everywhere**

Happy studying! 📚✨
