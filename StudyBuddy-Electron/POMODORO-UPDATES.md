# Pomodoro Feature Updates

## Summary of Changes
Three major improvements have been implemented for the Pomodoro feature:

### 1. ✅ Persistent Music & Timer Playback
**Problem:** Music and timer would stop when navigating to other pages or minimizing the app.

**Solution:**
- Created a persistent music container outside the main navigation area
- Modified `MusicPlayer.js` to use the new `music-player-wrapper` container that persists across navigation
- Updated music playback methods to maintain player state during page transitions
- Timer interval is now stored in global `AppState` and continues running in background

**Files Modified:**
- `src/views/index.html` - Added persistent music container
- `src/helpers/MusicPlayer.js` - Updated container handling and visibility controls
- `src/scripts/modules/pomodoro.js` - Modified to use persistent container
- `src/styles/main.css` - Added styling for persistent music player

**How it works:**
- Music player iframe is loaded into `#music-player-wrapper` inside `#persistent-music-container`
- Container remains in DOM during navigation and is shown/hidden as needed
- Timer continues running via interval stored in AppState, updating floating timer display

---

### 2. ✅ Draggable & Repositionable Sidebar
**Problem:** Users couldn't change the sidebar position to their preference.

**Solution:**
- Added drag handle to sidebar (visible as `⋮⋮` icon on the edge)
- Implemented position switching between left and right sides
- Saves user preference to localStorage for persistence across sessions
- Smooth animations and visual feedback during repositioning

**Files Modified:**
- `src/styles/main.css` - Added sidebar positioning classes and drag handle styles
- `src/scripts/app.js` - Added `initializeSidebarPositioning()` function

**How it works:**
1. Click and drag the edge handle of the sidebar (⋮⋮ icon)
2. A position menu appears with "Left Side" and "Right Side" options
3. Click desired position to move sidebar
4. Position is saved to localStorage and persists on app restart

**Features:**
- Visual drag handle with hover effect
- Position menu with animated buttons
- CSS flexbox ordering for smooth transitions
- localStorage persistence

---

### 3. ✅ Floating Timer on Navigation/Minimize
**Problem:** Users couldn't see timer progress when on other pages or when app was minimized.

**Solution:**
- Enhanced floating timer to show whenever timer is running (not just when away from Pomodoro page)
- Added window state tracking to show floating timer when app is minimized
- Improved visibility logic to handle both navigation and minimization cases

**Files Modified:**
- `src/scripts/modules/pomodoro.js` - Updated `updateFloatingTimer()` logic
- `main.js` - Added window minimize/restore event tracking
- `src/scripts/app.js` - Added IPC listener for window state changes
- `src/styles/components.css` - Already had floating timer styles

**How it works:**
- Floating timer appears when:
  - Timer is running/paused AND user navigates to another page
  - Timer is running/paused AND window is minimized
- Floating timer hides when:
  - User returns to Pomodoro page (not minimized)
  - Timer is stopped/completed
- Click floating timer to navigate back to Pomodoro page

**Features:**
- Shows current time remaining
- Displays session type (Focus/Short Break/Long Break)
- Animated pulse effect
- Click to return to Pomodoro page
- Works even when app is minimized

---

## Testing Instructions

### Test 1: Persistent Music
1. Start the app and navigate to Pomodoro
2. Select a YouTube or Spotify playlist and play music
3. Navigate to Dashboard or another page
4. ✅ Music should continue playing (visible in bottom center)
5. Navigate back to Pomodoro
6. ✅ Music player should still be there

### Test 2: Persistent Timer
1. Start a Pomodoro timer (25 minutes or custom)
2. Navigate to Flashcards or any other page
3. ✅ Floating timer appears in bottom right
4. Wait for timer to count down
5. ✅ Timer continues counting even on different pages
6. Click floating timer
7. ✅ Should navigate back to Pomodoro page

### Test 3: Draggable Sidebar
1. Look for the `⋮⋮` icon on the right edge of sidebar
2. Click and drag it slightly
3. ✅ Position menu should appear
4. Click "Right Side"
5. ✅ Sidebar should smoothly move to the right
6. Restart the app
7. ✅ Sidebar should remain on the right side

### Test 4: Minimize with Timer
1. Start a Pomodoro timer
2. Minimize the application window
3. ✅ Floating timer should still be visible (if system allows)
4. Restore the window while on Pomodoro page
5. ✅ Floating timer should hide
6. Navigate to another page while restored
7. ✅ Floating timer should show again

---

## Technical Details

### Music Player Architecture
```
┌─────────────────────────────────────┐
│  App Container                      │
│  ┌──────────┐  ┌──────────────────┐│
│  │ Sidebar  │  │  Main Content    ││
│  │          │  │  (Navigation     ││
│  │          │  │   changes here)  ││
│  └──────────┘  └──────────────────┘│
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Persistent Music Container         │
│  (Outside navigation, always alive) │
│  🎵 [Music Player Iframe]           │
└─────────────────────────────────────┘
```

### Timer State Management
```javascript
// AppState stores timer interval and state
AppState: {
  pomodoroTimer: {
    interval: setInterval(...), // Keeps running
    timeRemaining: 1234,
    isRunning: true,
    currentMode: 'focus'
  }
}

// Updated every second, persists across navigation
PomodoroModule.updateDisplay() 
  → Updates main display
  → Updates floating timer
  → Saves to AppState
```

### Sidebar Positioning
```javascript
// Saved to localStorage
localStorage.sidebarPosition = 'left' | 'right'

// Applied via CSS classes and flexbox order
.sidebar.position-left { order: 0; }
.sidebar.position-right { order: 2; }
.main-content { order: 1; }
```

---

## Configuration Options

### Customizing Floating Timer Position
Edit `src/styles/components.css`:
```css
.floating-timer {
  bottom: 30px;  /* Change this */
  right: 30px;   /* Change this */
}
```

### Customizing Music Player Position
Edit `src/styles/main.css`:
```css
.persistent-music-player {
  bottom: 20px;      /* Change vertical position */
  left: 50%;         /* Keep centered or change */
  max-width: 400px;  /* Adjust player width */
}
```

### Adding More Sidebar Positions
To add top/bottom positioning:
1. Add CSS classes in `main.css`
2. Add buttons in `initializeSidebarPositioning()` function
3. Update `applySidebarPosition()` to handle new positions

---

## Known Limitations

1. **Music Player**: Requires internet connection for YouTube/Spotify streaming
2. **Floating Timer**: May not be visible when window is fully minimized on some systems
3. **Sidebar**: Currently supports left/right only (top/bottom would require layout changes)

---

## Future Enhancements

- [ ] Add minimize-to-tray option with floating timer overlay
- [ ] Support top/bottom sidebar positions
- [ ] Add mini music controls to persistent player
- [ ] Add keyboard shortcuts for timer control
- [ ] Add timer progress in taskbar (Windows)

---

## Changelog

**November 6, 2025**
- ✅ Implemented persistent music player container
- ✅ Added timer continuation across page navigation
- ✅ Implemented draggable sidebar with position memory
- ✅ Enhanced floating timer visibility logic
- ✅ Added window state tracking for minimize/restore
- ✅ Updated MusicPlayer to support persistent playback

---

## Support

If you encounter any issues:
1. Check browser console for errors (F12)
2. Clear localStorage: `localStorage.clear()` in console
3. Restart the application
4. Check that timer is actually running before testing floating timer

---

**Enjoy your enhanced Pomodoro experience! 🍅✨**
