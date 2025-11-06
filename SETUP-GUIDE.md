# 🔧 Environment Setup Guide - Study Buddy Pro

## 📋 Overview

Study Buddy Pro is a **LOCAL desktop application** that uses:
- **SQLite Database** (file-based, NO server needed!)
- **Google Gemini AI** (for AI features)
- **Local Storage** (all data on your computer)

❌ **You DON'T need:**
- MySQL database
- phpMyAdmin
- Any database server
- Web hosting
- Apache/XAMPP

✅ **You ONLY need:**
- Node.js installed
- Google Gemini API key (free)

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Install Dependencies

```bash
cd StudyBuddy-Electron
npm install
```

### Step 2: Get Your FREE Google Gemini API Key

1. Visit: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIzaSy...`)

### Step 3: Configure Your API Key

**Option A - Using .env file (Recommended):**

Open the `.env` file and add your key:
```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Option B - Using the App Settings:**

1. Run the app: `npm start`
2. Click Settings (⚙️) in sidebar
3. Paste your API key
4. Click "Test Connection"
5. Click "Save"

---

## 📁 Files Explained

### `.env` - Your Configuration File
```env
# Add your Google Gemini API key here
GEMINI_API_KEY=your_key_here

# Database settings (auto-configured, don't change)
DB_PATH=studybuddy.db

# App preferences (optional)
DEFAULT_THEME=light
DEFAULT_LANGUAGE=en
DEFAULT_STUDY_SESSION=25
```

### `.env.example` - Template File
- This is a template showing what variables are available
- Copy this to `.env` and add your values
- Never contains actual credentials

---

## 💾 Database Information

### What Database Are We Using?

**SQLite** - A lightweight, file-based database

### Why SQLite (Not MySQL)?

| SQLite | MySQL/phpMyAdmin |
|--------|------------------|
| ✅ File-based (simple) | ❌ Requires server |
| ✅ No setup needed | ❌ Complex setup |
| ✅ Built into app | ❌ External software |
| ✅ Automatic backups | ❌ Manual backups |
| ✅ Perfect for desktop apps | ⚠️ For web apps |

### Where Is My Database?

Your data is stored locally at:
- **Windows**: `C:\Users\YourName\AppData\Roaming\StudyBuddy\studybuddy.db`
- **macOS**: `~/Library/Application Support/StudyBuddy/studybuddy.db`
- **Linux**: `~/.config/StudyBuddy/studybuddy.db`

### Can I Access The Database?

Yes! Use any SQLite browser like:
- **DB Browser for SQLite** (https://sqlitebrowser.org/)
- **SQLite Viewer** (VS Code extension)

---

## 🔐 Security & Privacy

### Is My Data Safe?

✅ **YES** - Everything is stored locally on your computer:
- API key stored securely with electron-store (encrypted)
- Database file is on your local disk
- No data sent to any server (except AI API calls to Google)

### What About The API Key?

- Stored in `.env` file (local, gitignored)
- Also saved in app settings (encrypted by Electron)
- Only used to call Google Gemini API
- Never shared or transmitted elsewhere

---

## 🎯 Configuration Options

### Environment Variables

| Variable | Description | Default | Required? |
|----------|-------------|---------|-----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | none | ✅ Yes |
| `DB_PATH` | Database filename | studybuddy.db | No |
| `DEFAULT_THEME` | App theme (light/dark/auto) | light | No |
| `DEFAULT_LANGUAGE` | Default language | en | No |
| `DEFAULT_STUDY_SESSION` | Study minutes | 25 | No |
| `DEFAULT_BREAK_DURATION` | Break minutes | 5 | No |

### Supported Languages

- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `ko` - Korean
- `zh` - Chinese

---

## 🔧 Troubleshooting

### "API Key Not Configured"

**Solution:**
1. Make sure you added your key to `.env` file
2. OR configure it in Settings page
3. Restart the app

### "Database Error"

**Solution:**
1. Check if you have write permissions
2. App will auto-create the database
3. Try deleting the database file and restart

### "Module Not Found"

**Solution:**
```bash
npm install
```

### Environment Variables Not Loading

**Solution:**
1. Make sure `.env` file is in the root folder (StudyBuddy-Electron/)
2. Restart the application
3. Check for typos in variable names

---

## 📝 Complete Setup Checklist

- [ ] Node.js installed (v16 or higher)
- [ ] Cloned/downloaded the project
- [ ] Ran `npm install`
- [ ] Created `.env` file (or copied from `.env.example`)
- [ ] Added Google Gemini API key to `.env`
- [ ] Tested the app with `npm start`
- [ ] Configured API key in Settings (if not using .env)
- [ ] Tested AI features (summarizer, problems, etc.)

---

## 🎉 Ready to Use!

Once you've completed the setup:

```bash
npm start
```

Your Study Buddy Pro app will:
1. ✅ Load environment variables from `.env`
2. ✅ Create local SQLite database automatically
3. ✅ Use your Gemini API key for AI features
4. ✅ Store all data locally on your computer

---

## 💡 Tips

1. **Backup Your Database**: Just copy the `studybuddy.db` file
2. **Share Your Key**: Never commit `.env` to GitHub (it's gitignored)
3. **Multiple Devices**: Copy `.env` and database file to sync
4. **API Limits**: Free tier = 60 requests/minute (plenty for study use!)

---

## 🆘 Need Help?

1. Check the README.md file
2. Review QUICK-START.md
3. Look at .env.example for configuration options
4. Test API connection in Settings page

---

**Remember: This is a LOCAL desktop app. No web servers, no MySQL, no phpMyAdmin needed! Everything runs on your computer! 🚀**
