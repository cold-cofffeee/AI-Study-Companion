# Spotify Integration Guide

## Overview
The Pomodoro Timer now includes beautiful Spotify integration, allowing you to play music during your focus sessions automatically!

## Features
✨ **OAuth2 Authentication** - Secure connection to your Spotify account  
🎵 **Playlist Selection** - Choose from all your Spotify playlists  
🎛️ **Playback Controls** - Play, pause, next, and previous track  
⚙️ **Auto-Play Options** - Automatically play music during focus sessions  
📱 **Device Selection** - Choose which device to play music on  
🎨 **Beautiful UI** - Seamless integration with Spotify's brand colors

## Setup Instructions

### 1. Prerequisites
- You need a **Spotify Premium account** (required for playback control via API)
- Make sure Spotify is installed on your computer or phone

### 2. First Time Setup

1. **Navigate to Pomodoro Module**
   - Open Study Buddy Pro
   - Click on the 🍅 Pomodoro tab

2. **Connect Your Spotify Account**
   - Scroll down to the "Spotify Music" section
   - Click the **"Connect Spotify"** button
   - A browser window will open asking you to authorize Study Buddy
   - Log in to Spotify and click **"Agree"**
   - The window will close automatically once connected

3. **Select a Playlist**
   - After connecting, your playlists will load automatically
   - Choose a focus playlist from the dropdown
   - Click "Refresh" if you don't see all your playlists

4. **Choose a Device**
   - Select which device you want to play music on
   - This can be your computer, phone, or any Spotify Connect device
   - Make sure the Spotify app is open on that device

## Usage

### Basic Controls

**Manual Playback:**
- Click the ▶️ play button to start music
- Click ⏸️ pause button to pause
- Use ⏭️ and ⏮️ to skip tracks

**Automatic Playback:**
1. Check ✅ "Auto-play music during focus sessions"
2. When you start a focus session, music will play automatically
3. Check ✅ "Pause music during breaks" to auto-pause during break time

### Tips for Best Experience

**🎧 Focus Playlists:**
- Create playlists specifically for studying
- Instrumental or lo-fi music works great
- Avoid music with lyrics if it distracts you

**📱 Device Management:**
- Keep Spotify open on your selected device
- If you can't play music, click "Refresh" on devices
- You can switch devices anytime

**⚡ ADHD Mode:**
- Works perfectly with Spotify
- Shorter sessions with automatic music control

## Troubleshooting

### "Failed to start playback"
**Solution:** Make sure:
- You have Spotify Premium
- Spotify is open on the selected device
- A device is selected in the dropdown
- Click "Refresh" on devices

### "Failed to load playlists"
**Solution:**
- Check your internet connection
- Click "Disconnect" and reconnect
- Make sure you have at least one playlist

### Music doesn't auto-play
**Solution:**
- Ensure "Auto-play music during focus sessions" is checked
- Make sure a playlist is selected
- A device must be selected and active

### Token expired
**Solution:**
- Tokens refresh automatically
- If you see errors, disconnect and reconnect

## Privacy & Security

- Your Spotify credentials are stored securely using Electron Store
- Only necessary permissions are requested
- You can disconnect anytime by clicking "Disconnect"
- No music listening data is collected or stored

## Technical Details

**API Credentials:**
- Client ID: `04896942676a4dc3be41fc5a534ab7b6`
- Client Secret: (stored securely in code)
- Redirect URI: `http://localhost:3000/callback`

**Permissions Requested:**
- Read your private playlists
- Control playback on your devices
- Read current playback state

**Token Management:**
- Access tokens expire after 1 hour
- Refresh tokens are stored locally
- Automatic token refresh when needed

## Support

If you encounter any issues:
1. Try disconnecting and reconnecting
2. Make sure you have Spotify Premium
3. Check that Spotify is open on your selected device
4. Restart Study Buddy Pro

Enjoy your productive study sessions with great music! 🎵📚
