# 📌 Quick Reference - Environment & Database

## 🔑 Where to Put Your API Key

### Option 1: .env File (Recommended)
```bash
# File: .env (in project root)
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX
```

### Option 2: App Settings
1. Run `npm start`
2. Click Settings ⚙️
3. Paste API key
4. Save

---

## 💾 Database Type: SQLite (NOT MySQL!)

| What We Use | What We DON'T Use |
|-------------|-------------------|
| ✅ **SQLite** | ❌ MySQL |
| ✅ Local file | ❌ phpMyAdmin |
| ✅ No server | ❌ Database server |
| ✅ Auto-setup | ❌ XAMPP/WAMP |

### Database Location
```
Windows: C:\Users\YourName\AppData\Roaming\StudyBuddy\studybuddy.db
macOS:   ~/Library/Application Support/StudyBuddy/studybuddy.db
Linux:   ~/.config/StudyBuddy/studybuddy.db
```

---

## 🚀 Quick Start

```bash
# 1. Install packages
npm install

# 2. Add your API key to .env file
# Edit .env and add: GEMINI_API_KEY=your_key_here

# 3. Run the app
npm start
```

---

## 📝 .env File Template

```env
# Get your key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=

# Optional settings (defaults work fine)
DEFAULT_THEME=light
DEFAULT_LANGUAGE=en
DEFAULT_STUDY_SESSION=25
```

---

## ❓ Common Questions

**Q: Do I need MySQL?**
A: NO! We use SQLite (simpler, no server needed)

**Q: Do I need phpMyAdmin?**
A: NO! SQLite is file-based, no web interface needed

**Q: Where's my database?**
A: In your AppData folder, created automatically

**Q: How do I backup my data?**
A: Just copy the `studybuddy.db` file

**Q: Is my API key safe?**
A: YES! Stored locally, encrypted by Electron

---

## 🎯 That's It!

No complicated database setup. No servers. No MySQL. Just:
1. Get API key
2. Put it in .env
3. Run the app

Simple! 🎉
