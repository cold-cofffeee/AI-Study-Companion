// Pomodoro Timer Module
// ipcRenderer is available globally via window.ipcRenderer from app.js

const PomodoroModule = {
    data: {
        timeRemaining: 0,
        totalTime: 0,
        isRunning: false,
        isPaused: false,
        currentMode: 'focus',
        interval: null,
        isADHDMode: false,
        completedSessions: 0,
        autoStart: true,
        sessionStartTime: null,
        
        // Audio elements for sounds
        sounds: {
            sessionComplete: null,
            breakComplete: null,
            tick: null,
            ambient: null
        },
        soundEnabled: true,
        ambientMusicEnabled: false,
        
        // Free CDN links for sounds
        soundUrls: {
            sessionComplete: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3', // Success bell
            breakComplete: 'https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3', // Gentle notification
            tick: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Soft click
            ambient: 'https://assets.mixkit.co/active_storage/sfx/2456/2456-preview.mp3' // Calm ambient
        },
        
        modes: {
            focus: { 
                name: 'Focus Session', 
                duration: 25, 
                adhdDuration: 10,
                icon: 'fas fa-brain',
                color: '#007bff'
            },
            'short-break': { 
                name: 'Short Break', 
                duration: 5, 
                adhdDuration: 2,
                icon: 'fas fa-coffee',
                color: '#28a745'
            },
            'long-break': { 
                name: 'Long Break', 
                duration: 15, 
                adhdDuration: 5,
                icon: 'fas fa-couch',
                color: '#6c757d'
            }
        },

        motivationalQuotes: [
            "Great job! You're building focus like a muscle. 💪",
            "Amazing focus session! Your brain is getting stronger. 🧠",
            "You did it! Small steps lead to big achievements. 🌟",
            "Fantastic work! You're training your concentration. 🎯",
            "Well done! Every session counts towards your goals. 🚀",
            "Excellent! You're developing a powerful focus habit. ⚡"
        ]
    },

    async render() {
        return `
            <div class="pomodoro-container">
                <!-- Quick Schedule Generator -->
                <div class="card">
                    <div class="card-header">
                        <h3><i class="fas fa-magic"></i> Quick Study Plan Generator</h3>
                        <p class="text-muted">Generate a study schedule for your Pomodoro sessions</p>
                    </div>
                    <div class="input-group">
                        <label class="input-label">Main Subject:</label>
                        <input type="text" id="pomodoro-subject" class="input-field" 
                               placeholder="e.g., Mathematics, Physics, Programming">
                    </div>
                    <div class="input-group">
                        <label class="input-label">Topics (comma-separated):</label>
                        <textarea id="pomodoro-topics" class="input-field" rows="2"
                               placeholder="e.g., Algebra, Geometry, Calculus"></textarea>
                    </div>
                    <div class="flex gap-10">
                        <button class="btn btn-primary" onclick="PomodoroModule.generateSchedule()">
                            <i class="fas fa-sparkles"></i> Generate Schedule
                        </button>
                        <button class="btn btn-outline" onclick="PomodoroModule.loadScheduleFromOptimizer()" id="load-schedule-btn" style="display: none;">
                            <i class="fas fa-download"></i> Load Saved Schedule
                        </button>
                    </div>
                </div>

                <!-- Schedule/Task List -->
                <div class="card" id="pomodoro-schedule-card" style="display: none;">
                    <div class="card-header">
                        <h3><i class="fas fa-list-check"></i> Study Tasks</h3>
                    </div>
                    <div id="pomodoro-task-list" class="task-list">
                        <!-- Tasks will be populated here -->
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2><i class="fas fa-clock"></i> Pomodoro Focus Timer</h2>
                        <p class="text-muted">ADHD-Friendly Productivity Tool</p>
                    </div>

                    <div class="timer-section">
                        <!-- Timer Status -->
                        <div class="timer-status">
                            <div class="status-indicator">
                                <div class="pulse-dot" id="status-dot"></div>
                                <span id="timer-status-text">Ready to Focus</span>
                            </div>
                            <div class="session-counter">
                                <i class="fas fa-calendar-check"></i>
                                <span id="sessions-completed">0 sessions today</span>
                            </div>
                        </div>

                        <!-- Timer Circle -->
                        <div class="timer-circle-container">
                            <svg class="timer-circle" viewBox="0 0 200 200">
                                <circle cx="100" cy="100" r="90" class="timer-circle-bg"/>
                                <circle id="timer-progress-circle" cx="100" cy="100" r="90" 
                                        class="timer-circle-progress" 
                                        stroke-dasharray="565.48" 
                                        stroke-dashoffset="565.48"/>
                            </svg>
                            <div class="timer-display-center">
                                <div id="pomodoro-timer-display" class="timer-time">25:00</div>
                                <div id="pomodoro-timer-mode" class="timer-mode-name">Focus Session</div>
                            </div>
                        </div>

                        <!-- Timer Controls -->
                        <div class="timer-controls">
                            <button id="pomodoro-start-btn" class="btn btn-primary btn-large">
                                <i class="fas fa-play"></i> Start Focus
                            </button>
                            <button id="pomodoro-pause-btn" class="btn btn-secondary btn-large" style="display: none;">
                                <i class="fas fa-pause"></i> Pause
                            </button>
                            <button id="pomodoro-stop-btn" class="btn btn-outline">
                                <i class="fas fa-stop"></i> Stop
                            </button>
                        </div>

                        <!-- Mode Selector -->
                        <div class="mode-selector">
                            <button class="mode-btn active" data-mode="focus">
                                <i class="fas fa-brain"></i>
                                <span>Focus <small>(25m)</small></span>
                            </button>
                            <button class="mode-btn" data-mode="short-break">
                                <i class="fas fa-coffee"></i>
                                <span>Short Break <small>(5m)</small></span>
                            </button>
                            <button class="mode-btn" data-mode="long-break">
                                <i class="fas fa-couch"></i>
                                <span>Long Break <small>(15m)</small></span>
                            </button>
                            <button class="mode-btn mode-btn-custom" data-mode="custom">
                                <i class="fas fa-sliders-h"></i>
                                <span>Custom <small id="custom-duration-label">(30m)</small></span>
                            </button>
                        </div>

                        <!-- Custom Timer Settings (Cute Popup) -->
                        <div class="custom-timer-box" id="custom-timer-box" style="display: none;">
                            <div class="custom-timer-content">
                                <div class="custom-timer-header">
                                    <i class="fas fa-magic"></i>
                                    <h4>Custom Timer</h4>
                                </div>
                                <div class="custom-timer-body">
                                    <div class="time-input-group">
                                        <label>Minutes:</label>
                                        <div class="time-stepper">
                                            <button class="stepper-btn" onclick="PomodoroModule.adjustCustomTime(-5)">
                                                <span class="stepper-icon">−</span>
                                            </button>
                                            <input type="number" id="custom-timer-input" class="custom-time-input" 
                                                   value="30" min="1" max="180">
                                            <button class="stepper-btn" onclick="PomodoroModule.adjustCustomTime(5)">
                                                <span class="stepper-icon">+</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="custom-timer-presets">
                                        <span class="text-muted small">Quick set:</span>
                                        <div class="preset-buttons">
                                            <button class="preset-btn" onclick="PomodoroModule.setCustomTime(15)">15m</button>
                                            <button class="preset-btn" onclick="PomodoroModule.setCustomTime(30)">30m</button>
                                            <button class="preset-btn" onclick="PomodoroModule.setCustomTime(45)">45m</button>
                                            <button class="preset-btn" onclick="PomodoroModule.setCustomTime(60)">60m</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="custom-timer-footer">
                                    <button class="btn btn-outline btn-sm" onclick="PomodoroModule.closeCustomTimer()">Cancel</button>
                                    <button class="btn btn-primary btn-sm" onclick="PomodoroModule.applyCustomTimer()">Apply</button>
                                </div>
                            </div>
                        </div>

                        <!-- ADHD Mode Toggle -->
                        <div class="adhd-mode-container">
                            <div class="adhd-mode-box">
                                <i class="fas fa-bolt"></i>
                                <span>ADHD Mode (Shorter Sessions)</span>
                                <label class="switch">
                                    <input type="checkbox" id="adhd-mode-toggle">
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <p class="text-muted small">Enables shorter focus sessions: 10min focus, 2min short break, 5min long break</p>
                        </div>

                        <!-- Auto-start Toggle -->
                        <div class="setting-row">
                            <label>
                                <input type="checkbox" id="auto-start-toggle" checked>
                                Auto-start next session
                            </label>
                        </div>

                        <!-- Sound Settings -->
                        <div class="settings-group">
                            <h4><i class="fas fa-volume-up"></i> Sound Settings</h4>
                            <div class="setting-row">
                                <label>
                                    <input type="checkbox" id="sound-enabled-toggle" checked>
                                    Enable notification sounds
                                </label>
                            </div>
                            <div class="setting-row">
                                <label>
                                    <input type="checkbox" id="ambient-music-toggle">
                                    Play ambient music during focus
                                </label>
                            </div>
                            <div class="setting-row">
                                <label style="display: flex; align-items: center; gap: 10px;">
                                    <span>Volume:</span>
                                    <input type="range" id="volume-slider" min="0" max="100" value="50" style="flex: 1;">
                                    <span id="volume-value">50%</span>
                                </label>
                            </div>
                        </div>

                        <!-- Music Player Integration -->
                        <div class="settings-group music-player-section">
                            <h4><i class="fas fa-music"></i> Focus Music Player</h4>
                            <p class="text-muted small">Play music from YouTube or Spotify during focus sessions (No login required!)</p>
                            
                            <!-- Music Service Tabs -->
                            <div class="music-tabs">
                                <button class="music-tab active" data-service="youtube" onclick="PomodoroModule.switchMusicService('youtube')">
                                    <i class="fab fa-youtube"></i> YouTube
                                </button>
                                <button class="music-tab" data-service="spotify" onclick="PomodoroModule.switchMusicService('spotify')">
                                    <i class="fab fa-spotify"></i> Spotify
                                </button>
                                <button class="music-tab" data-service="custom" onclick="PomodoroModule.switchMusicService('custom')">
                                    <i class="fas fa-link"></i> Custom URL
                                </button>
                            </div>

                            <!-- YouTube Playlists -->
                            <div id="youtube-music-section" class="music-service-section">
                                <label class="input-label">Select YouTube Playlist:</label>
                                <select id="youtube-playlist-select" class="input-field">
                                    <option value="">-- Choose a focus playlist --</option>
                                </select>
                            </div>

                            <!-- Spotify Playlists -->
                            <div id="spotify-music-section" class="music-service-section" style="display: none;">
                                <label class="input-label">Select Spotify Playlist:</label>
                                <select id="spotify-playlist-select" class="input-field">
                                    <option value="">-- Choose a focus playlist --</option>
                                </select>
                            </div>

                            <!-- Custom URL -->
                            <div id="custom-music-section" class="music-service-section" style="display: none;">
                                <label class="input-label">Enter Music URL:</label>
                                <input type="text" id="custom-music-url" class="input-field" 
                                       placeholder="YouTube, Spotify, or SoundCloud URL">
                                <button class="btn btn-outline btn-sm" onclick="PomodoroModule.addCustomPlaylist()">
                                    <i class="fas fa-plus"></i> Save to Library
                                </button>
                            </div>

                            <!-- Music Controls -->
                            <div class="music-controls-section">
                                <div class="setting-row">
                                    <label>
                                        <input type="checkbox" id="music-auto-play-toggle">
                                        Auto-play music during focus sessions
                                    </label>
                                </div>
                                <div class="setting-row">
                                    <label>
                                        <input type="checkbox" id="music-stop-on-break-toggle" checked>
                                        Stop music during breaks
                                    </label>
                                </div>

                                <div class="music-player-buttons">
                                    <button class="btn btn-primary" onclick="PomodoroModule.playMusic()">
                                        <i class="fas fa-play"></i> Play Selected
                                    </button>
                                    <button class="btn btn-outline" onclick="PomodoroModule.stopMusic()">
                                        <i class="fas fa-stop"></i> Stop Music
                                    </button>
                                </div>
                            </div>

                            <!-- Embedded Music Player Container -->
                            <div id="music-player-container" class="music-player-container">
                                <!-- Player will be embedded here -->
                            </div>
                        </div>

                        <!-- Session History -->
                        <div class="session-history">
                            <h3><i class="fas fa-history"></i> Today's Sessions</h3>
                            <div id="session-history-list" class="history-list">
                                <p class="text-muted">No sessions completed yet. Start your first focus session!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .pomodoro-container {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .timer-section {
                    padding: 20px;
                }

                .timer-status {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding: 15px;
                    background: var(--card-bg);
                    border-radius: 10px;
                }

                .status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .pulse-dot {
                    width: 12px;
                    height: 12px;
                    background: #28a745;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .session-counter {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--text-muted);
                }

                .timer-circle-container {
                    position: relative;
                    width: 280px;
                    height: 280px;
                    margin: 40px auto;
                }

                .timer-circle {
                    width: 100%;
                    height: 100%;
                    transform: rotate(-90deg);
                }

                .timer-circle-bg {
                    fill: none;
                    stroke: var(--border-color);
                    stroke-width: 8;
                }

                .timer-circle-progress {
                    fill: none;
                    stroke: #007bff;
                    stroke-width: 8;
                    stroke-linecap: round;
                    transition: stroke-dashoffset 1s linear, stroke 0.3s;
                }

                .timer-display-center {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                }

                .timer-time {
                    font-size: 48px;
                    font-weight: bold;
                    font-family: 'Courier New', monospace;
                    margin-bottom: 10px;
                }

                .timer-mode-name {
                    font-size: 18px;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .timer-controls {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin: 30px 0;
                }

                .btn-large {
                    padding: 15px 40px;
                    font-size: 16px;
                    font-weight: 600;
                }

                .mode-selector {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    margin: 30px 0;
                }

                .mode-btn {
                    flex: 1;
                    max-width: 200px;
                    padding: 15px;
                    border: 2px solid var(--border-color);
                    background: var(--card-bg);
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }

                .mode-btn:hover {
                    border-color: var(--primary-color);
                    transform: translateY(-2px);
                }

                .mode-btn.active {
                    border-color: var(--primary-color);
                    background: var(--primary-light);
                    color: var(--primary-color);
                }

                .mode-btn i {
                    font-size: 24px;
                }

                .mode-btn small {
                    opacity: 0.7;
                }

                .mode-btn-custom {
                    border-color: #6c757d;
                    position: relative;
                }

                .mode-btn-custom:hover {
                    border-color: #6c757d;
                    background: rgba(108, 117, 125, 0.1);
                }

                .mode-btn-custom.active {
                    border-color: #6c757d;
                    background: rgba(108, 117, 125, 0.2);
                    color: #6c757d;
                }

                .custom-timer-box {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 1000;
                    animation: popIn 0.3s ease-out;
                }

                @keyframes popIn {
                    0% {
                        transform: translate(-50%, -50%) scale(0.8);
                        opacity: 0;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                }

                .custom-timer-content {
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    padding: 25px;
                    min-width: 320px;
                    border: 3px solid var(--primary-color);
                }

                body.dark .custom-timer-content {
                    background: var(--card-bg);
                }

                .custom-timer-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                    color: var(--primary-color);
                }

                .custom-timer-header i {
                    font-size: 24px;
                }

                .custom-timer-header h4 {
                    margin: 0;
                    font-size: 20px;
                }

                .custom-timer-body {
                    margin-bottom: 20px;
                }

                .time-input-group {
                    margin-bottom: 15px;
                }

                .time-input-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: var(--text-primary);
                }

                .time-stepper {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    justify-content: center;
                }

                .stepper-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    border: 2px solid var(--primary-color);
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    font-size: 16px;
                    font-weight: bold;
                    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
                }

                body.dark .stepper-btn {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.5);
                }

                .stepper-btn:hover {
                    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                    transform: scale(1.15);
                    box-shadow: 0 6px 12px rgba(102, 126, 234, 0.5);
                }

                .stepper-btn:active {
                    transform: scale(0.95);
                }

                .stepper-icon {
                    font-size: 24px;
                    font-weight: 700;
                    line-height: 1;
                    user-select: none;
                }

                .custom-time-input {
                    width: 80px;
                    height: 50px;
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    border: 2px solid var(--border-color);
                    border-radius: 10px;
                    background: var(--bg-secondary);
                }

                .custom-timer-presets {
                    text-align: center;
                }

                .preset-buttons {
                    display: flex;
                    gap: 8px;
                    margin-top: 8px;
                    justify-content: center;
                }

                .preset-btn {
                    padding: 8px 16px;
                    border: 2px solid var(--border-color);
                    background: var(--bg-secondary);
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: 500;
                }

                .preset-btn:hover {
                    border-color: var(--primary-color);
                    background: var(--primary-light);
                    color: var(--primary-color);
                    transform: translateY(-2px);
                }

                .custom-timer-footer {
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                }

                .adhd-mode-container {
                    margin: 30px 0;
                    padding: 20px;
                    background: #fff3cd;
                    border: 2px solid #ffc107;
                    border-radius: 10px;
                }

                .adhd-mode-box {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 10px;
                }

                .adhd-mode-box i {
                    color: #ffc107;
                    font-size: 20px;
                }

                .switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 26px;
                    margin-left: auto;
                }

                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: 0.4s;
                    border-radius: 26px;
                }

                .slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: 0.4s;
                    border-radius: 50%;
                }

                input:checked + .slider {
                    background-color: #ffc107;
                }

                input:checked + .slider:before {
                    transform: translateX(24px);
                }

                .setting-row {
                    padding: 15px;
                    margin: 20px 0;
                    background: var(--card-bg);
                    border-radius: 10px;
                }

                .settings-group {
                    margin: 30px 0;
                    padding: 20px;
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                    border-radius: 15px;
                    border: 2px solid rgba(102, 126, 234, 0.2);
                }

                .settings-group h4 {
                    margin-bottom: 15px;
                    color: var(--primary-color);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                #volume-slider {
                    height: 6px;
                    border-radius: 3px;
                    background: var(--border-color);
                    outline: none;
                    -webkit-appearance: none;
                }

                #volume-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                #volume-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                }

                #volume-value {
                    min-width: 45px;
                    text-align: right;
                    font-weight: bold;
                    color: var(--primary-color);
                }

                .session-history {
                    margin-top: 40px;
                    padding-top: 30px;
                    border-top: 2px solid var(--border-color);
                }

                .session-history h3 {
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .history-list {
                    max-height: 300px;
                    overflow-y: auto;
                }

                .history-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px;
                    margin-bottom: 8px;
                    background: var(--card-bg);
                    border-radius: 8px;
                    border-left: 4px solid #007bff;
                }

                .history-item.break {
                    border-left-color: #28a745;
                }

                .history-item-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .history-item-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--primary-light);
                    color: var(--primary-color);
                }

                .history-item-time {
                    font-size: 12px;
                    color: var(--text-muted);
                }

                .task-list {
                    padding: 15px;
                }

                .task-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    margin-bottom: 10px;
                    background: var(--bg-secondary);
                    border-radius: 8px;
                    border-left: 4px solid var(--primary-color);
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .task-item:hover {
                    transform: translateX(5px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .task-item.completed {
                    opacity: 0.6;
                    border-left-color: #28a745;
                    text-decoration: line-through;
                }

                .task-checkbox {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                }

                .task-text {
                    flex: 1;
                }

                body.dark .adhd-mode-container {
                    background: rgba(255, 193, 7, 0.15);
                }

                /* Music Player Styles */
                .music-player-section {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 15px;
                    padding: 20px;
                    margin-top: 20px;
                }

                .music-player-section h4 {
                    color: white;
                    margin-bottom: 8px;
                }

                .music-player-section .text-muted {
                    color: rgba(255, 255, 255, 0.8) !important;
                    margin-bottom: 15px;
                }

                .music-tabs {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                }

                .music-tab {
                    flex: 1;
                    padding: 12px;
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid transparent;
                    border-radius: 10px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: 500;
                }

                .music-tab:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                .music-tab.active {
                    background: rgba(255, 255, 255, 0.95);
                    color: #667eea;
                    border-color: white;
                }

                body.dark .music-tab.active {
                    background: rgba(30, 30, 30, 0.95);
                    color: #667eea;
                }

                .music-service-section {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 10px;
                    padding: 15px;
                    margin-bottom: 15px;
                }

                body.dark .music-service-section {
                    background: rgba(30, 30, 30, 0.95);
                }

                .music-controls-section {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 10px;
                    padding: 15px;
                    margin-bottom: 15px;
                }

                body.dark .music-controls-section {
                    background: rgba(30, 30, 30, 0.95);
                }

                .music-player-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }

                .music-player-buttons .btn {
                    flex: 1;
                }

                .music-player-container {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                    padding: 15px;
                    min-height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 1;
                    transition: opacity 0.15s ease-in-out;
                }

                .music-player-container:empty::before {
                    content: 'No music playing';
                    color: rgba(255, 255, 255, 0.6);
                    font-style: italic;
                }

                .music-player-container iframe {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    border-radius: 10px;
                    pointer-events: auto !important;
                    user-select: auto;
                    -webkit-user-select: auto;
                }
            </style>
        `;
    },

    async init() {
        try {
            // Get global app state
            const appState = window.AppState;
            let savedState = null;
            
            // Check if we have a running timer to restore
            if (appState && typeof appState.getPomodoroState === 'function') {
                savedState = appState.getPomodoroState();
                if (savedState && (savedState.isRunning || savedState.isPaused)) {
                    // Restore timer state
                    this.restoreTimerState(savedState);
                }
            }
            
            // Small delay to ensure DOM is fully rendered
            await new Promise(resolve => setTimeout(resolve, 100));
            
            this.initializeSounds();
            await this.loadSettings();
            this.setupEventListeners();
            this.updateDisplay();
            this.updateSessionCount();
            await this.checkForSavedSchedule();
            
            // Initialize Music Player and restore if playing
            this.initializeMusicPlayer();
            
            // If timer was running, restart the interval
            if (savedState && savedState.isRunning) {
                this.resumeTimer();
            }
        } catch (error) {
            console.error('Error initializing Pomodoro:', error);
            // Continue even if there's an error
            try {
                this.setupEventListeners();
                this.updateDisplay();
            } catch (e) {
                console.error('Failed to setup event listeners:', e);
            }
        }
    },

    // Initialize audio elements
    initializeSounds() {
        try {
            this.data.sounds.sessionComplete = new Audio(this.data.soundUrls.sessionComplete);
            this.data.sounds.breakComplete = new Audio(this.data.soundUrls.breakComplete);
            this.data.sounds.tick = new Audio(this.data.soundUrls.tick);
            this.data.sounds.ambient = new Audio(this.data.soundUrls.ambient);
            
            // Set volumes
            Object.values(this.data.sounds).forEach(sound => {
                if (sound) {
                    sound.volume = 0.5;
                }
            });
            
            // Make ambient music loop
            if (this.data.sounds.ambient) {
                this.data.sounds.ambient.loop = true;
            }
            
            console.log('🔊 Sounds initialized successfully');
        } catch (error) {
            console.error('Error initializing sounds:', error);
        }
    },

    // Play sound effect
    playSound(soundType) {
        if (!this.data.soundEnabled) return;
        
        try {
            const sound = this.data.sounds[soundType];
            if (sound) {
                sound.currentTime = 0;
                sound.play().catch(err => console.log('Sound play prevented:', err));
            }
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    },

    // Toggle ambient music
    toggleAmbientMusic(enable) {
        try {
            if (enable && this.data.ambientMusicEnabled) {
                this.data.sounds.ambient?.play().catch(err => console.log('Ambient play prevented:', err));
            } else {
                this.data.sounds.ambient?.pause();
                if (this.data.sounds.ambient) {
                    this.data.sounds.ambient.currentTime = 0;
                }
            }
        } catch (error) {
            console.error('Error toggling ambient music:', error);
        }
    },

    // Update volume for all sounds AND music player
    updateVolume(volume) {
        const volumeLevel = volume / 100;
        
        // Update ambient sounds
        Object.values(this.data.sounds).forEach(sound => {
            if (sound) {
                sound.volume = volumeLevel;
            }
        });
        
        // Update music player volume
        if (this.musicPlayer && this.musicPlayer.setVolume) {
            this.musicPlayer.setVolume(volume);
        }
    },

    async checkForSavedSchedule() {
        try {
            const settings = await window.ipcRenderer.invoke('get-settings');
            if (settings.pomodoroSchedule) {
                document.getElementById('load-schedule-btn').style.display = 'inline-flex';
            }
        } catch (error) {
            console.error('Error checking for saved schedule:', error);
        }
    },

    async generateSchedule() {
        const subject = document.getElementById('pomodoro-subject')?.value;
        const topicsText = document.getElementById('pomodoro-topics')?.value;

        if (!subject || subject.trim() === '') {
            showToast('Please enter a main subject', 'warning');
            return;
        }

        if (!topicsText || topicsText.trim() === '') {
            showToast('Please enter at least one topic', 'warning');
            return;
        }

        const topics = topicsText.split(',').map(t => t.trim()).filter(t => t);
        const studyPlan = `${subject}: ${topics.join(', ')}`;

        showLoading('Generating study plan...');

        try {
            const settings = await window.ipcRenderer.invoke('get-settings');
            if (!settings.apiKey) {
                throw new Error('API key not configured. Please configure it in Settings.');
            }

            const duration = 120; // Default 2 hours
            const result = await window.ipcRenderer.invoke('gemini-generate-schedule', studyPlan, duration, settings.apiKey);
            
            const scheduleData = {
                subject: subject,
                topics: topics,
                duration: duration,
                content: result
            };
            
            await window.ipcRenderer.invoke('update-setting', 'pomodoroSchedule', scheduleData);
            this.displayScheduleTasks(scheduleData);
            showToast('Study plan generated! 📚', 'success');
        } catch (error) {
            console.error('Error generating schedule:', error);
            showToast('Failed to generate schedule: ' + error.message, 'error');
        } finally {
            hideLoading();
        }
    },

    async loadScheduleFromOptimizer() {
        try {
            const settings = await window.ipcRenderer.invoke('get-settings');
            if (settings.pomodoroSchedule) {
                this.displayScheduleTasks(settings.pomodoroSchedule);
                showToast('Schedule loaded! 🍅', 'success');
            }
        } catch (error) {
            console.error('Error loading schedule:', error);
            showToast('Failed to load schedule', 'error');
        }
    },

    displayScheduleTasks(scheduleData) {
        document.getElementById('pomodoro-schedule-card').style.display = 'block';
        const taskList = document.getElementById('pomodoro-task-list');
        
        // Extract tasks from the content
        const tasks = scheduleData.topics || [];
        
        taskList.innerHTML = `
            <div style="margin-bottom: 15px;">
                <h4 style="color: var(--primary-color); margin-bottom: 10px;">
                    <i class="fas fa-book"></i> ${scheduleData.subject}
                </h4>
                <p style="color: var(--text-muted); font-size: 14px;">
                    Total Duration: ${scheduleData.duration} minutes
                </p>
            </div>
            ${tasks.map((task, index) => `
                <div class="task-item" data-task-index="${index}">
                    <input type="checkbox" class="task-checkbox" id="task-${index}" 
                           onchange="PomodoroModule.toggleTask(${index})">
                    <label for="task-${index}" class="task-text">${task}</label>
                </div>
            `).join('')}
        `;
    },

    toggleTask(index) {
        const taskItem = document.querySelector(`[data-task-index="${index}"]`);
        const checkbox = document.getElementById(`task-${index}`);
        
        if (checkbox.checked) {
            taskItem.classList.add('completed');
        } else {
            taskItem.classList.remove('completed');
        }
    },

    async loadSettings() {
        try {
            const settings = await window.ipcRenderer.invoke('get-settings');
            this.data.isADHDMode = settings.pomodoroADHDMode || false;
            this.data.autoStart = settings.pomodoroAutoStart !== false;
            this.data.completedSessions = settings.pomodoroSessionsToday || 0;
            this.data.soundEnabled = settings.pomodoroSoundEnabled !== false;
            this.data.ambientMusicEnabled = settings.pomodoroAmbientMusic || false;
            const volume = settings.pomodoroVolume || 50;
            
            // Check if elements exist before accessing them
            const adhdToggle = document.getElementById('adhd-mode-toggle');
            const autoStartToggle = document.getElementById('auto-start-toggle');
            const soundToggle = document.getElementById('sound-enabled-toggle');
            const ambientToggle = document.getElementById('ambient-music-toggle');
            const volumeSlider = document.getElementById('volume-slider');
            const volumeValue = document.getElementById('volume-value');
            
            if (adhdToggle) adhdToggle.checked = this.data.isADHDMode;
            if (autoStartToggle) autoStartToggle.checked = this.data.autoStart;
            if (soundToggle) soundToggle.checked = this.data.soundEnabled;
            if (ambientToggle) ambientToggle.checked = this.data.ambientMusicEnabled;
            if (volumeSlider) {
                volumeSlider.value = volume;
                this.updateVolume(volume);
            }
            if (volumeValue) volumeValue.textContent = `${volume}%`;
            
            this.setMode(this.data.currentMode);
        } catch (error) {
            console.error('Error loading pomodoro settings:', error);
            // Set defaults if settings fail to load
            this.data.isADHDMode = false;
            this.data.autoStart = true;
            this.data.completedSessions = 0;
            this.data.soundEnabled = true;
            this.data.ambientMusicEnabled = false;
        }
    },

    setupEventListeners() {
        const startBtn = document.getElementById('pomodoro-start-btn');
        const pauseBtn = document.getElementById('pomodoro-pause-btn');
        const stopBtn = document.getElementById('pomodoro-stop-btn');
        const adhdToggle = document.getElementById('adhd-mode-toggle');
        const autoStartToggle = document.getElementById('auto-start-toggle');
        
        if (startBtn) startBtn.onclick = () => this.start();
        if (pauseBtn) pauseBtn.onclick = () => this.pause();
        if (stopBtn) stopBtn.onclick = () => this.stop();
        
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.onclick = () => {
                const mode = btn.dataset.mode;
                if (mode === 'custom') {
                    this.openCustomTimer();
                } else {
                    this.setMode(mode);
                }
            };
        });
        
        if (adhdToggle) {
            adhdToggle.onchange = (e) => {
                this.data.isADHDMode = e.target.checked;
                window.ipcRenderer.invoke('update-setting', 'pomodoroADHDMode', this.data.isADHDMode);
                this.setMode(this.data.currentMode);
                showToast(this.data.isADHDMode ? 'ADHD Mode enabled' : 'Normal mode enabled', 'success');
            };
        }
        
        if (autoStartToggle) {
            autoStartToggle.onchange = (e) => {
                this.data.autoStart = e.target.checked;
                window.ipcRenderer.invoke('update-setting', 'pomodoroAutoStart', this.data.autoStart);
            };
        }

        // Sound control event listeners
        const soundToggle = document.getElementById('sound-enabled-toggle');
        const ambientToggle = document.getElementById('ambient-music-toggle');
        const volumeSlider = document.getElementById('volume-slider');
        const volumeValue = document.getElementById('volume-value');

        if (soundToggle) {
            soundToggle.onchange = (e) => {
                this.data.soundEnabled = e.target.checked;
                window.ipcRenderer.invoke('update-setting', 'pomodoroSoundEnabled', this.data.soundEnabled);
                showToast(this.data.soundEnabled ? '🔊 Sounds enabled' : '🔇 Sounds muted', 'info');
            };
        }

        if (ambientToggle) {
            ambientToggle.onchange = (e) => {
                this.data.ambientMusicEnabled = e.target.checked;
                window.ipcRenderer.invoke('update-setting', 'pomodoroAmbientMusic', this.data.ambientMusicEnabled);
                if (this.data.isRunning && this.data.currentMode === 'focus') {
                    this.toggleAmbientMusic(e.target.checked);
                }
                showToast(this.data.ambientMusicEnabled ? '🎵 Ambient music enabled' : '🎵 Ambient music disabled', 'info');
            };
        }

        if (volumeSlider && volumeValue) {
            volumeSlider.oninput = (e) => {
                const volume = e.target.value;
                volumeValue.textContent = `${volume}%`;
                this.updateVolume(volume);
                window.ipcRenderer.invoke('update-setting', 'pomodoroVolume', volume);
            };
        }
    },

    openCustomTimer() {
        document.getElementById('custom-timer-box').style.display = 'block';
        const currentMinutes = Math.floor(this.data.totalTime / 60);
        document.getElementById('custom-timer-input').value = currentMinutes || 30;
    },

    closeCustomTimer() {
        document.getElementById('custom-timer-box').style.display = 'none';
    },

    adjustCustomTime(amount) {
        const input = document.getElementById('custom-timer-input');
        let value = parseInt(input.value) || 30;
        value = Math.max(1, Math.min(180, value + amount));
        input.value = value;
    },

    setCustomTime(minutes) {
        document.getElementById('custom-timer-input').value = minutes;
    },

    applyCustomTimer() {
        const minutes = parseInt(document.getElementById('custom-timer-input').value) || 30;
        
        // Add custom mode to modes
        this.data.modes.custom = {
            name: 'Custom Timer',
            duration: minutes,
            adhdDuration: minutes,
            icon: 'fas fa-sliders-h',
            color: '#6c757d'
        };
        
        this.setMode('custom');
        document.getElementById('custom-duration-label').textContent = `(${minutes}m)`;
        this.closeCustomTimer();
        showToast(`Custom timer set to ${minutes} minutes! ⏱️`, 'success');
    },

    setMode(mode) {
        this.data.currentMode = mode;
        const modeConfig = this.data.modes[mode];
        const duration = this.data.isADHDMode ? modeConfig.adhdDuration : modeConfig.duration;
        
        this.data.totalTime = duration * 60;
        this.data.timeRemaining = this.data.totalTime;
        
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        document.getElementById('pomodoro-timer-mode').textContent = modeConfig.name;
        document.getElementById('timer-progress-circle').style.stroke = modeConfig.color;
        
        this.updateDisplay();
    },

    start() {
        if (this.data.isPaused) {
            this.data.isPaused = false;
        } else {
            this.data.sessionStartTime = new Date();
        }
        
        this.data.isRunning = true;
        document.getElementById('pomodoro-start-btn').style.display = 'none';
        document.getElementById('pomodoro-pause-btn').style.display = 'inline-flex';
        document.getElementById('timer-status-text').textContent = 'Focusing...';
        document.getElementById('status-dot').style.background = '#007bff';
        
        // Log activity
        window.ipcRenderer.invoke('log-activity', 'pomodoro', 'start-timer', { 
            mode: this.data.currentMode, 
            duration: this.data.totalTime,
            isADHDMode: this.data.isADHDMode
        });
        
        // Play ambient music if enabled and in focus mode
        if (this.data.currentMode === 'focus' && this.data.ambientMusicEnabled) {
            this.toggleAmbientMusic(true);
        }
        
        // Handle music player during session
        this.handleMusicDuringSession();
        
        const appState = window.AppState;
        this.data.interval = setInterval(() => {
            if (this.data.timeRemaining > 0) {
                this.data.timeRemaining--;
                this.updateDisplay();
            } else {
                this.complete();
            }
        }, 1000);
        
        if (appState && typeof appState.setPomodoroInterval === 'function') {
            appState.setPomodoroInterval(this.data.interval);
        }
        this.saveTimerState();
    },

    pause() {
        this.data.isRunning = false;
        this.data.isPaused = true;
        clearInterval(this.data.interval);
        
        // Pause ambient music
        this.toggleAmbientMusic(false);
        
        // Stop music player
        if (this.musicPlayer) {
            this.stopMusic();
        }
        
        document.getElementById('pomodoro-start-btn').style.display = 'inline-flex';
        document.getElementById('pomodoro-start-btn').innerHTML = '<i class="fas fa-play"></i> Resume';
        document.getElementById('pomodoro-pause-btn').style.display = 'none';
        document.getElementById('timer-status-text').textContent = 'Paused';
        document.getElementById('status-dot').style.background = '#ffc107';
        
        this.saveTimerState();
    },

    stop() {
        this.data.isRunning = false;
        this.data.isPaused = false;
        clearInterval(this.data.interval);
        
        // Stop ambient music
        this.toggleAmbientMusic(false);
        
        // Stop music player
        if (this.musicPlayer) {
            this.stopMusic();
        }
        
        this.setMode(this.data.currentMode);
        
        document.getElementById('pomodoro-start-btn').style.display = 'inline-flex';
        document.getElementById('pomodoro-start-btn').innerHTML = '<i class="fas fa-play"></i> Start Focus';
        document.getElementById('pomodoro-pause-btn').style.display = 'none';
        document.getElementById('timer-status-text').textContent = 'Ready to Focus';
        document.getElementById('status-dot').style.background = '#28a745';
        
        this.saveTimerState();
    },

    async complete() {
        this.data.isRunning = false;
        clearInterval(this.data.interval);
        
        // Stop ambient music
        this.toggleAmbientMusic(false);
        
        const wasBreak = this.data.currentMode !== 'focus';
        
        // Log completion
        window.ipcRenderer.invoke('log-activity', 'pomodoro', wasBreak ? 'break-complete' : 'session-complete', {
            mode: this.data.currentMode,
            duration: this.data.totalTime,
            completedSessions: this.data.completedSessions + (wasBreak ? 0 : 1)
        });
        
        if (!wasBreak) {
            // Play session complete sound
            this.playSound('sessionComplete');
            
            this.data.completedSessions++;
            await window.ipcRenderer.invoke('update-setting', 'pomodoroSessionsToday', this.data.completedSessions);
            this.updateSessionCount();
            
            // Save to history
            await this.saveSession();
            
            // Show motivational quote
            const quote = this.data.motivationalQuotes[Math.floor(Math.random() * this.data.motivationalQuotes.length)];
            showToast(quote, 'success');
            
            // Notification
            window.ipcRenderer.invoke('show-notification', 'Focus Session Complete!', 'Great work! Time for a break 🎉');
        } else {
            // Play break complete sound
            this.playSound('breakComplete');
            
            // Notification for break end
            window.ipcRenderer.invoke('show-notification', 'Break Complete!', 'Ready to focus again? 💪');
        }
        
        // Auto-start next session
        if (this.data.autoStart) {
            setTimeout(() => {
                if (!wasBreak) {
                    const nextMode = this.data.completedSessions % 4 === 0 ? 'long-break' : 'short-break';
                    this.setMode(nextMode);
                } else {
                    this.setMode('focus');
                }
                this.start();
            }, 2000);
        } else {
            this.stop();
        }
    },

    async saveSession() {
        const session = {
            type: this.data.currentMode,
            duration: Math.floor(this.data.totalTime / 60),
            completed: new Date().toISOString(),
            date: new Date().toLocaleDateString()
        };
        
        await window.ipcRenderer.invoke('db-save-session', session);
        this.loadSessionHistory();
    },

    async loadSessionHistory() {
        try {
            const today = new Date().toLocaleDateString();
            const sessions = await window.ipcRenderer.invoke('db-get-sessions', 20);
            const todaySessions = sessions.filter(s => new Date(s.createdAt).toLocaleDateString() === today);
            
            const historyList = document.getElementById('session-history-list');
            if (todaySessions.length === 0) {
                historyList.innerHTML = '<p class="text-muted">No sessions completed yet. Start your first focus session!</p>';
                return;
            }
            
            historyList.innerHTML = todaySessions.map(session => {
                const time = new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const icon = session.type === 'focus' ? 'fa-brain' : 'fa-coffee';
                const isBreak = session.type !== 'focus';
                
                return `
                    <div class="history-item ${isBreak ? 'break' : ''}">
                        <div class="history-item-info">
                            <div class="history-item-icon">
                                <i class="fas ${icon}"></i>
                            </div>
                            <div>
                                <div><strong>${session.topic || session.type}</strong></div>
                                <div class="history-item-time">${time} • ${session.durationMinutes || session.duration}min</div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Error loading session history:', error);
        }
    },

    updateDisplay() {
        const minutes = Math.floor(this.data.timeRemaining / 60);
        const seconds = this.data.timeRemaining % 60;
        const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Update main timer display
        const mainDisplay = document.getElementById('pomodoro-timer-display');
        if (mainDisplay) {
            mainDisplay.textContent = timeStr;
        }
        
        // Update progress circle
        const progressCircle = document.getElementById('timer-progress-circle');
        if (progressCircle && this.data.totalTime > 0) {
            const progress = ((this.data.totalTime - this.data.timeRemaining) / this.data.totalTime) * 565.48;
            progressCircle.style.strokeDashoffset = 565.48 - progress;
        }
    },

    updateSessionCount() {
        document.getElementById('sessions-completed').textContent = 
            `${this.data.completedSessions} session${this.data.completedSessions !== 1 ? 's' : ''} today`;
        this.loadSessionHistory();
    },

    // ==================== Music Player Integration Methods ====================

    initializeMusicPlayer() {
        try {
            // Get or create singleton instance
            if (typeof window.MusicPlayer !== 'undefined') {
                this.musicPlayer = window.MusicPlayer;
                console.log('MusicPlayer found on window:', this.musicPlayer);
            } else if (typeof MusicPlayer !== 'undefined') {
                this.musicPlayer = MusicPlayer.getInstance();
                console.log('MusicPlayer created from class');
            } else {
                console.warn('MusicPlayer not found, will be available after script load');
                return;
            }

            this.currentMusicService = 'youtube';
            
            // Verify musicPlayer has required methods
            if (this.musicPlayer && typeof this.musicPlayer.getAllPlaylists === 'function') {
                // Populate playlist dropdowns
                this.populateMusicPlaylists();
            } else {
                console.error('MusicPlayer does not have getAllPlaylists method');
            }
            
            // Restore player if it was playing (it should already be in the container)
            if (this.musicPlayer && typeof this.musicPlayer.isCurrentlyPlaying === 'function' && this.musicPlayer.isCurrentlyPlaying()) {
                // Just make sure it's in the right container
                this.musicPlayer.restorePlayer('music-player-container');
                console.log('Music player restored to Pomodoro container');
            } else if (this.musicPlayer && typeof this.musicPlayer.restorePlayerState === 'function') {
                // Try to restore from saved state (on app restart)
                this.musicPlayer.restorePlayerState('music-player-container');
                console.log('Attempting to restore music player from saved state');
            }
        } catch (error) {
            console.error('Error initializing music player:', error);
        }
    },

    populateMusicPlaylists() {
        if (!this.musicPlayer) {
            console.warn('Music player not initialized');
            return;
        }

        try {
            const allPlaylists = this.musicPlayer.getAllPlaylists();
            console.log('All playlists:', allPlaylists);
            
            // Populate YouTube playlists
            const youtubeSelect = document.getElementById('youtube-playlist-select');
            if (youtubeSelect && allPlaylists.youtube) {
                youtubeSelect.innerHTML = '<option value="">-- Choose a focus playlist --</option>';
                allPlaylists.youtube.forEach(playlist => {
                    const option = document.createElement('option');
                    option.value = playlist.url;
                    option.textContent = playlist.name;
                    youtubeSelect.appendChild(option);
                });
                console.log(`Populated ${allPlaylists.youtube.length} YouTube playlists`);
            }

            // Populate Spotify playlists
            const spotifySelect = document.getElementById('spotify-playlist-select');
            if (spotifySelect && allPlaylists.spotify) {
                spotifySelect.innerHTML = '<option value="">-- Choose a focus playlist --</option>';
                allPlaylists.spotify.forEach(playlist => {
                    const option = document.createElement('option');
                    option.value = playlist.url;
                    option.textContent = playlist.name;
                    spotifySelect.appendChild(option);
                });
                console.log(`Populated ${allPlaylists.spotify.length} Spotify playlists`);
            }
        } catch (error) {
            console.error('Error populating music playlists:', error);
        }
    },

    switchMusicService(service) {
        this.currentMusicService = service;
        
        // Update tab UI
        document.querySelectorAll('.music-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.service === service);
        });

        // Show/hide appropriate sections
        document.getElementById('youtube-music-section').style.display = service === 'youtube' ? 'block' : 'none';
        document.getElementById('spotify-music-section').style.display = service === 'spotify' ? 'block' : 'none';
        document.getElementById('custom-music-section').style.display = service === 'custom' ? 'block' : 'none';
    },

    playMusic() {
        if (!this.musicPlayer) {
            showToast('Music player not initialized', 'error');
            console.error('Music player not initialized');
            return;
        }

        let url = '';
        let service = this.currentMusicService;

        // Get URL based on selected service
        if (service === 'youtube') {
            const select = document.getElementById('youtube-playlist-select');
            url = select ? select.value : '';
        } else if (service === 'spotify') {
            const select = document.getElementById('spotify-playlist-select');
            url = select ? select.value : '';
        } else if (service === 'custom') {
            const input = document.getElementById('custom-music-url');
            url = input ? input.value.trim() : '';
            if (url) {
                service = this.musicPlayer.detectService(url);
            }
        }

        if (!url) {
            showToast('Please select or enter a music URL', 'warning');
            return;
        }

        try {
            console.log(`Playing ${service} music:`, url);
            // Load music into the embedded container within the pomodoro module
            this.musicPlayer.loadPlayer(url, service, 'music-player-container');
            
            // Log music activity
            window.ipcRenderer.invoke('log-activity', 'music-player', 'play-music', {
                service: service,
                url: url.substring(0, 100)
            });
            
            showToast(`🎵 ${service === 'youtube' ? 'YouTube' : service === 'spotify' ? 'Spotify' : 'Music'} player started!`, 'success');
        } catch (error) {
            console.error('Error playing music:', error);
            window.ipcRenderer.invoke('log-error', 'music-player', { message: error.message }, { action: 'play-music', service });
            showToast('Failed to play music', 'error');
        }
    },

    stopMusic() {
        if (!this.musicPlayer) {
            console.warn('Music player not initialized');
            return;
        }
        
        console.log('Stopping music...');
        this.musicPlayer.stop();
        showToast('Music stopped', 'info');
    },

    addCustomPlaylist() {
        if (!this.musicPlayer) {
            showToast('Music player not initialized', 'error');
            return;
        }

        const urlInput = document.getElementById('custom-music-url');
        const url = urlInput ? urlInput.value.trim() : '';
        
        if (!url) {
            showToast('Please enter a URL', 'warning');
            return;
        }

        const service = this.musicPlayer.detectService(url);
        console.log('Detected service:', service, 'for URL:', url);
        
        const name = prompt(`Enter a name for this ${service === 'youtube' ? 'YouTube' : service === 'spotify' ? 'Spotify' : ''} playlist:`);
        
        if (name && name.trim()) {
            try {
                this.musicPlayer.addCustomPlaylist(name.trim(), url, service);
                console.log('Custom playlist added:', name, url, service);
                
                // Refresh the playlist dropdowns
                this.populateMusicPlaylists();
                
                // Clear the input
                if (urlInput) {
                    urlInput.value = '';
                }
                
                // Switch to the appropriate tab to show the new playlist
                this.switchMusicService(service);
                
                showToast(`✅ "${name}" added to ${service === 'youtube' ? 'YouTube' : service === 'spotify' ? 'Spotify' : 'custom'} library!`, 'success');
            } catch (error) {
                console.error('Error adding custom playlist:', error);
                showToast('Failed to add playlist', 'error');
            }
        } else if (name === '') {
            showToast('Playlist name cannot be empty', 'warning');
        }
    },

    handleMusicDuringSession() {
        const autoPlay = document.getElementById('music-auto-play-toggle')?.checked;
        const stopOnBreak = document.getElementById('music-stop-on-break-toggle')?.checked;
        
        if (!this.musicPlayer || !autoPlay) {
            return;
        }

        const isFocusSession = this.data.currentMode === 'focus';
        
        if (isFocusSession && !this.musicPlayer.isCurrentlyPlaying()) {
            // Auto-play music during focus if enabled
            this.playMusic();
        } else if (!isFocusSession && stopOnBreak && this.musicPlayer.isCurrentlyPlaying()) {
            // Stop music during breaks if enabled
            this.stopMusic();
        }
    },

    // ==================== State Persistence Methods ====================

    saveTimerState() {
        const appState = window.AppState;
        if (appState && typeof appState.savePomodoroState === 'function') {
            appState.savePomodoroState({
                timeRemaining: this.data.timeRemaining,
                totalTime: this.data.totalTime,
                isRunning: this.data.isRunning,
                isPaused: this.data.isPaused,
                currentMode: this.data.currentMode,
                sessionStartTime: this.data.sessionStartTime,
                completedSessions: this.data.completedSessions,
                isADHDMode: this.data.isADHDMode,
                autoStart: this.data.autoStart
            });
        }
    },

    restoreTimerState(savedState) {
        this.data.timeRemaining = savedState.timeRemaining || 0;
        this.data.totalTime = savedState.totalTime || 0;
        this.data.isRunning = savedState.isRunning || false;
        this.data.isPaused = savedState.isPaused || false;
        this.data.currentMode = savedState.currentMode || 'focus';
        this.data.sessionStartTime = savedState.sessionStartTime;
        this.data.completedSessions = savedState.completedSessions || 0;
        this.data.isADHDMode = savedState.isADHDMode || false;
        this.data.autoStart = savedState.autoStart !== undefined ? savedState.autoStart : true;
        
        // Restore the interval reference from AppState
        const appState = window.AppState;
        if (appState && appState.pomodoroTimer && appState.pomodoroTimer.interval) {
            this.data.interval = appState.pomodoroTimer.interval;
        }
    },

    resumeTimer() {
        // Update UI to show running state
        document.getElementById('pomodoro-start-btn').style.display = 'none';
        document.getElementById('pomodoro-pause-btn').style.display = 'inline-flex';
        
        if (this.data.isPaused) {
            document.getElementById('timer-status-text').textContent = 'Paused';
            document.getElementById('status-dot').style.background = '#ffc107';
            document.getElementById('pomodoro-start-btn').style.display = 'inline-flex';
            document.getElementById('pomodoro-start-btn').innerHTML = '<i class="fas fa-play"></i> Resume';
            document.getElementById('pomodoro-pause-btn').style.display = 'none';
        } else {
            document.getElementById('timer-status-text').textContent = 'Focusing...';
            document.getElementById('status-dot').style.background = '#007bff';
            
            // Restart the interval
            const appState = window.AppState;
            this.data.interval = setInterval(() => {
                if (this.data.timeRemaining > 0) {
                    this.data.timeRemaining--;
                    this.updateDisplay();
                    this.saveTimerState(); // Save state periodically
                } else {
                    this.complete();
                }
            }, 1000);
            
            if (appState && typeof appState.setPomodoroInterval === 'function') {
                appState.setPomodoroInterval(this.data.interval);
            }
        }
        
        // Update mode display
        const modeConfig = this.data.modes[this.data.currentMode];
        if (modeConfig) {
            document.getElementById('pomodoro-timer-mode').textContent = modeConfig.name;
            document.getElementById('timer-progress-circle').style.stroke = modeConfig.color;
        }
        
        // Update mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === this.data.currentMode);
        });
    },

    // Cleanup on navigation (save state but keep timer running)
    cleanup() {
        // Save current state - timer and music will continue running
        this.saveTimerState();
        
        // Note: We DON'T clear the interval or stop music
        // The module stays alive in the background with timer and music running
    },
    
    // Called when module is shown again (optional refresh)
    onShow() {
        // Refresh the display in case time has passed
        if (this.data.isRunning || this.data.isPaused) {
            this.updateDisplay();
            this.updateSessionCount();
        }
    }
};

window.PomodoroModule = PomodoroModule;
