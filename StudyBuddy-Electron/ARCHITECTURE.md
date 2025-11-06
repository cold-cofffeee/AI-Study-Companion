# Study Buddy Pro - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR COMPUTER                        │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │         Study Buddy Pro (Electron App)            │ │
│  │                                                   │ │
│  │  ┌─────────────┐      ┌──────────────┐          │ │
│  │  │   UI Layer  │      │  JavaScript  │          │ │
│  │  │ (HTML/CSS)  │◄────►│    Logic     │          │ │
│  │  └─────────────┘      └──────────────┘          │ │
│  │                              │                    │ │
│  │         ┌────────────────────┼─────────────┐     │ │
│  │         │                    │             │     │ │
│  │         ▼                    ▼             ▼     │ │
│  │  ┌─────────────┐    ┌──────────────┐  ┌─────┐  │ │
│  │  │  SQLite DB  │    │   Settings   │  │ .env│  │ │
│  │  │ (local file)│    │(electron-store)│ │file │  │ │
│  │  └─────────────┘    └──────────────┘  └─────┘  │ │
│  │    studybuddy.db      (encrypted)     API Key   │ │
│  └───────────────────────────────────────────────────┘ │
│                            │                            │
└────────────────────────────┼────────────────────────────┘
                             │
                             │ HTTPS
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Google Gemini AI   │
                  │  (Cloud API Service) │
                  └──────────────────────┘
```

## 📦 What's Included (On Your Computer)

```
Study Buddy Pro
├── Application Files
│   ├── main.js (Electron main process)
│   ├── HTML/CSS/JS (User interface)
│   └── Helper modules (Database, API, Settings)
│
├── Local Database (SQLite)
│   └── studybuddy.db
│       ├── Study sessions
│       ├── Flashcards
│       ├── User outputs
│       └── Daily challenges
│
└── Configuration
    ├── .env (Your API key)
    └── Settings (Electron Store)
```

## 🚫 What's NOT Included (You Don't Need)

```
❌ MySQL Server
❌ phpMyAdmin
❌ Apache/XAMPP
❌ Web hosting
❌ Database server
❌ Internet (except for AI features)
```

## 🔄 Data Flow

### When You Use AI Features:
```
1. You type text → Study Buddy App
2. App reads API key from .env or Settings
3. App sends request → Google Gemini API (Internet)
4. Google sends back AI response
5. App saves to local SQLite database
6. You see the result
```

### When You Use Other Features (Flashcards, Timer):
```
1. You interact → Study Buddy App
2. App reads/writes → Local SQLite database
3. All stays on your computer
```

## 📁 File Structure

```
StudyBuddy-Electron/
│
├── .env                    ← YOUR API KEY GOES HERE
├── .env.example            ← Template (don't edit)
├── package.json            ← Dependencies
├── main.js                 ← App entry point
│
├── src/
│   ├── views/
│   │   └── index.html      ← Main UI
│   │
│   ├── scripts/
│   │   ├── app.js          ← Core logic
│   │   └── modules/        ← All features
│   │
│   ├── styles/             ← CSS themes
│   │
│   └── helpers/
│       ├── GeminiApiClient.js   ← Connects to AI
│       ├── DatabaseHelper.js    ← SQLite operations
│       ├── SettingsHandler.js   ← App settings
│       └── ExportHelper.js      ← PDF export
│
└── node_modules/           ← Installed packages
```

## 🎯 Key Points

### Database Type
```
We Use:     SQLite (simple file)
NOT:        MySQL (complex server)
Why:        Desktop apps don't need database servers!
```

### API Configuration
```
Method 1:   .env file (GEMINI_API_KEY=xxx)
Method 2:   Settings page in app
Storage:    Encrypted locally
```

### Data Storage
```
Location:   Your computer only
Backup:     Copy studybuddy.db file
Privacy:    Nothing sent anywhere (except AI API calls)
```

## 🔐 Security Model

```
┌─────────────────────────────────────────┐
│     YOUR PRIVATE DATA (Local)           │
│                                         │
│  • Study notes                          │
│  • Flashcards                           │
│  • Study history                        │
│  • Settings                             │
│                                         │
│  Stored in: AppData/StudyBuddy/        │
└─────────────────────────────────────────┘
         │
         │ Only when you use AI features
         ▼
┌─────────────────────────────────────────┐
│     WHAT'S SENT TO GOOGLE               │
│                                         │
│  • Your input text (for AI processing)  │
│  • API key (for authentication)         │
│                                         │
│  NOT sent: Personal info, history,      │
│  flashcards, or anything else!          │
└─────────────────────────────────────────┘
```

## 💡 Simple Analogy

Think of Study Buddy Pro like **Microsoft Word**:
- Runs on your computer ✅
- Saves files locally ✅
- No server needed ✅
- Can use cloud features (AI) optionally ✅

NOT like a website:
- Doesn't need hosting ❌
- Doesn't need database server ❌
- Doesn't need web server ❌

---

## 🎓 Summary

**Study Buddy Pro is a DESKTOP application that:**
1. Runs entirely on your computer
2. Uses SQLite (file-based database, not MySQL)
3. Only needs internet for AI features
4. Stores everything locally
5. Simple .env file for API key

**No web servers. No MySQL. No phpMyAdmin. Just install and run!** 🚀
