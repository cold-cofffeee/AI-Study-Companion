# 🎵 Music Player Feature - Documentation

## Overview
The Pomodoro timer now includes an **embedded music player** that supports YouTube, Spotify, and SoundCloud - **without requiring any API keys or user authentication!**

## ✨ Key Features

### 1. **No Authentication Required**
- No API keys needed
- No login required
- No OAuth flow
- Completely safe for GitHub repositories

### 2. **Multiple Music Services**
- **YouTube**: Stream music videos and live streams
- **Spotify**: Access public Spotify playlists (Web Player embeds)
- **SoundCloud**: Play tracks and playlists
- **Custom URLs**: Add any supported URL

### 3. **Pre-configured Focus Playlists**

#### YouTube Playlists:
- Lofi Hip Hop - Beats to Study
- Deep Focus Music
- Piano Music for Studying
- Classical Music Mix
- Ambient Study Music

#### Spotify Playlists:
- Deep Focus
- Peaceful Piano
- Lofi Beats
- Brain Food
- Instrumental Study

### 4. **Custom Playlist Library**
- Add your own favorite playlists
- Automatically detects service from URL
- Saves to local storage (persists across sessions)

## 🎮 How to Use

### Playing Music

1. **Go to Pomodoro Timer** section
2. **Scroll to "Focus Music Player"** section
3. **Choose a service** (YouTube/Spotify/Custom URL)
4. **Select a playlist** from the dropdown
5. **Click "Play Selected"** button

### Adding Custom Playlists

1. Click on **"Custom URL"** tab
2. Paste any **YouTube, Spotify, or SoundCloud** URL
3. Click **"Save to Library"**
4. Give it a name
5. It will appear in the appropriate dropdown

### Auto-play During Focus

1. Check **"Auto-play music during focus sessions"**
2. Check **"Stop music during breaks"** (optional)
3. Music will automatically start when you begin a focus session
4. Music stops automatically during breaks (if enabled)

## 🔗 Supported URL Formats

### YouTube
```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/embed/VIDEO_ID
```

### Spotify
```
https://open.spotify.com/playlist/PLAYLIST_ID
https://open.spotify.com/album/ALBUM_ID
https://open.spotify.com/track/TRACK_ID
```

### SoundCloud
```
https://soundcloud.com/artist/track-name
```

## 💡 Tips

1. **YouTube livestreams** work great for continuous focus music
2. **Spotify embeds** work best for curated playlists
3. Use **instrumental music** for better concentration
4. **Lo-fi beats** are popular for studying
5. **Classical music** helps with memory retention

## 🛠️ Technical Details

### Files Modified
- `src/helpers/MusicPlayer.js` - New embedded player helper
- `src/scripts/modules/pomodoro.js` - Updated with music controls
- `src/views/index.html` - Added MusicPlayer script

### How It Works
- Uses **iframe embeds** (no API calls needed)
- Stores custom playlists in **localStorage**
- Auto-detects service from URL format
- Integrates with Pomodoro timer lifecycle

### Security Benefits
✅ No API keys in code
✅ No OAuth tokens
✅ No sensitive data
✅ Safe to publish on GitHub
✅ No backend required
✅ Works offline for saved playlists

## 🎨 User Interface

The music player features:
- **Beautiful gradient background** (purple theme)
- **Tab-based navigation** (YouTube/Spotify/Custom)
- **Embedded player** displays directly in the app
- **Auto-play controls** for convenience
- **Responsive design** adapts to window size

## 📱 Browser Compatibility

The embedded players work in Electron (Chromium-based), supporting:
- ✅ YouTube embeds
- ✅ Spotify Web Player embeds
- ✅ SoundCloud embeds
- ✅ Autoplay (when user-initiated)

## 🚀 Future Enhancements (Optional)

Potential additions:
- Volume controls for embedded player
- Playlist queue management
- Favorite playlists quick access
- Recently played history
- Music recommendations based on study time

---

**Enjoy your focused study sessions with great music! 🎵📚**
