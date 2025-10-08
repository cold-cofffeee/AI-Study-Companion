# Study Buddy Pro - AI-Powered Learning Companion

## ?? Overview

Study Buddy Pro is a comprehensive Windows desktop application designed to enhance your learning experience through AI-powered tools. Built with .NET 8 and WinForms, it provides a modern, modular interface with advanced study features powered by Google Gemini AI.

![Study Buddy Pro](https://img.shields.io/badge/Platform-.NET%208%20Windows-blue)
![Version](https://img.shields.io/badge/Version-2.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ?? Features

### Core Modules

1. **?? Dashboard** - Overview & Daily Challenges
   - Study session statistics
   - Daily learning challenges
   - Progress tracking
   - Quick access to recent activities

2. **?? Study Summarizer** - AI-Powered Content Analysis
   - Generate bullet-point summaries
   - Create quiz questions automatically
   - Memory tricks and mnemonics generation
   - Support for 15+ languages
   - Markdown formatting
   - Export to PDF and PNG

3. **?? Random Problem Generator**
   - Generate practice problems for Math, Physics, Chemistry
   - Adjustable difficulty levels (Easy, Medium, Hard)
   - Step-by-step solutions
   - Built-in timer for solving challenges

4. **?? Study Time Optimizer**
   - Pomodoro-based study schedules
   - Adaptive time blocks based on content difficulty
   - Break reminders and micro-quizzes
   - Focus session tracking

5. **??? Instant Memory Trigger** - Flashcard System
   - Spaced repetition using SM-2 algorithm
   - Image-based flashcards support
   - Progress tracking with Leitner system
   - Automatic review scheduling

6. **? Reverse Quiz Generator**
   - Generate questions from answers/definitions
   - Multiple-choice question creation
   - Automatic distractor generation
   - Export capabilities

7. **?? Settings & Preferences**
   - API key management with testing
   - Theme selection (Light/Dark/Auto)
   - Language preferences
   - Window position memory

8. **?? About & Help**
   - User guide and documentation
   - Feature explanations
   - Troubleshooting guides

## ??? Installation & Setup

### Prerequisites

- Windows 10/11 (x64)
- .NET 8 Runtime
- Internet connection (for AI features)
- Google Gemini API key (free)

### Quick Start

1. **Download & Install**
   ```bash
   # Clone the repository
   git clone https://github.com/your-repo/study-buddy-pro.git
   cd study-buddy-pro
   
   # Restore dependencies
   dotnet restore
   
   # Build the application
   dotnet build --configuration Release
   ```

2. **Get Google Gemini API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key (free tier available)
   - Copy the API key (starts with `AIzaSy...`)

3. **Configure API Key**
   - Launch Study Buddy Pro
   - Click "?? Configure API" button
   - Paste your API key
   - Click "Test Key" to verify
   - Click "OK" to save

4. **Start Studying!**
   - Navigate to "?? Summarizer" module
   - Paste your study material
   - Choose your preferred language
   - Click any AI processing button

## ??? Project Structure

```
StudyBuddy/
??? Controls/                  # User interface modules
?   ??? DashboardControl.cs    # Main dashboard
?   ??? SummarizerControl.cs   # AI summarizer (main feature)
?   ??? BasicControls.cs       # Other module placeholders
?   ??? ...
??? Data/                      # Database operations
?   ??? DatabaseHelper.cs      # SQLite database management
??? Helpers/                   # Utility classes
?   ??? GeminiApiClient.cs     # Google Gemini AI integration
?   ??? ExportHelper.cs        # PDF/PNG export utilities
?   ??? SettingsHandler.cs     # User preferences management
??? Models/                    # Data models
?   ??? StudyModels.cs         # Application data structures
??? Localization/              # Multi-language support
?   ??? Resources.en.resx      # English resources
?   ??? Resources.bn.resx      # Bengali resources
??? MainForm.cs                # Main application window
??? ApiKeyDialog.cs            # API key configuration
??? ShareDialog.cs             # Content sharing utilities
??? Program.cs                 # Application entry point
```

## ?? Technical Details

### Architecture

- **Framework**: .NET 8 Windows Forms
- **Database**: SQLite with Entity Framework-style helpers
- **AI Integration**: Google Gemini API via REST
- **Export**: PdfSharp for PDF generation
- **Patterns**: MVVM-inspired with UserControl modules

### Key Technologies

- **Microsoft.Data.Sqlite** - Local database storage
- **Newtonsoft.Json** - JSON processing for API calls
- **PdfSharp** - PDF document generation
- **System.Drawing** - Image processing and export

### Database Schema

```sql
-- User preferences and settings
UserSettings (Id, ApiKey, Theme, Language, WindowSettings, ...)

-- Study session tracking
StudySessions (Id, Topic, StartTime, EndTime, Duration, Notes, ...)

-- Spaced repetition flashcards
Flashcards (Id, Question, Answer, EaseFactor, Interval, NextReview, ...)

-- Generated study problems
StudyProblems (Id, Subject, Difficulty, Question, Solution, Steps, ...)

-- Study schedules and time blocks
ScheduleItems (Id, Topic, StartTime, Duration, Type, Description, ...)

-- Study outputs and content
StudyOutputs (Id, Title, Content, Type, Language, SourceText, ...)

-- Daily challenges and achievements
DailyChallenges (Id, Date, Title, Description, Points, IsCompleted, ...)
```

## ?? UI/UX Features

### Modern Design
- Clean, flat interface with subtle shadows
- Responsive layout with proper anchoring
- Professional color scheme (cyan/blue accent)
- Segoe UI font throughout
- Tooltips and placeholders for guidance

### Dark/Light Theme Support
- Automatic system theme detection
- Manual theme selection
- Consistent theming across all modules
- High contrast support

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High DPI awareness
- Customizable font sizes

## ?? Multi-Language Support

### Supported Languages for AI Responses
- English, Spanish, French, German, Italian
- Portuguese, Russian, Japanese, Korean
- Chinese, Bengali, Hindi, Arabic, Turkish, Dutch

### Localization Framework
- Resource-based localization (.resx files)
- Runtime language switching
- Culture-specific formatting
- Extensible translation system

## ?? AI Features & API Integration

### Google Gemini Integration
```csharp
// Example API usage
var client = new GeminiApiClient(apiKey);
var summary = await client.GenerateStudySummaryAsync(text, language);
var problems = await client.GenerateStudyProblemsAsync("Math", "Medium", 5);
var schedule = await client.GenerateStudyScheduleAsync(topic, 120, "Hard");
```

### Fallback Mechanisms
- Offline summary generation when API unavailable
- Graceful error handling with user-friendly messages
- Automatic retry logic with exponential backoff
- Local content processing as backup

### Content Processing
- Automatic cleanup of AI response artifacts
- Markdown formatting for better readability
- Smart text parsing and structure detection
- Export-ready content formatting

## ?? Export & Sharing

### PDF Export
- Professional document formatting
- Markdown-style rendering
- Custom headers and footers
- Automatic page breaks

### PNG Export (Study Cards)
- Social media ready format
- Custom branding and watermarks
- High-resolution output
- Daily summary cards

### Share Options
- Copy to clipboard (markdown format)
- Export to various file formats
- Social sharing capabilities
- Print-friendly layouts

## ?? Privacy & Security

### Data Storage
- All data stored locally (SQLite database)
- No cloud synchronization by default
- API key stored securely with encryption option
- User control over data retention

### API Usage
- Direct communication with Google Gemini
- No intermediary servers
- User's API key usage only
- Transparent API call logging

## ?? Development Roadmap

### Version 2.1 (Planned)
- [ ] Advanced flashcard features (image support, audio)
- [ ] Study group collaboration features
- [ ] Advanced statistics and analytics
- [ ] More export formats (Word, PowerPoint)

### Version 2.2 (Planned)
- [ ] Plugin system for custom modules
- [ ] Cloud synchronization (optional)
- [ ] Mobile companion app
- [ ] Advanced AI models integration

### Version 3.0 (Future)
- [ ] Complete module system overhaul
- [ ] Advanced learning analytics
- [ ] Integrated note-taking
- [ ] Study plan automation

## ?? Contributing

### Development Setup
1. Install Visual Studio 2022 or VS Code with C# extension
2. Install .NET 8 SDK
3. Clone the repository
4. Open `StudyBuddy.sln`
5. Build and run

### Contribution Guidelines
- Follow C# coding conventions
- Add XML documentation for public methods
- Include unit tests for new features
- Update README for significant changes

### Bug Reports & Feature Requests
- Use GitHub Issues with appropriate labels
- Provide detailed reproduction steps
- Include system information and logs
- Suggest implementation approaches for features

## ?? License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ?? Acknowledgments

- Google Gemini AI for powerful language processing
- PdfSharp team for PDF generation capabilities
- Microsoft for .NET and Windows Forms
- Community contributors and testers

## ?? Support

### Documentation
- [User Guide](docs/user-guide.md)
- [Developer API Reference](docs/api-reference.md)
- [Troubleshooting Guide](docs/troubleshooting.md)

### Community
- [Discord Server](https://discord.gg/studybuddy)
- [GitHub Discussions](https://github.com/your-repo/study-buddy-pro/discussions)
- [Bug Reports](https://github.com/your-repo/study-buddy-pro/issues)

### Contact
- Email: support@studybuddy.app
- Website: https://studybuddy.app
- Twitter: [@StudyBuddyApp](https://twitter.com/studybuddyapp)

---

**Study Buddy Pro** - Transforming the way you learn with AI-powered tools.

*Made with ?? for students, researchers, and lifelong learners everywhere.*