// AppState.js - Global state manager that persists across navigation

// Check if AppState already exists globally
if (typeof window.AppState === 'undefined') {
    class AppState {
        constructor() {
            // Singleton pattern - ensure only one instance exists
            if (AppState.instance) {
                return AppState.instance;
            }
            AppState.instance = this;

            // Load persisted state from localStorage
            this.loadPersistedState();

            this.initialized = false;
        }

        // Get singleton instance
        static getInstance() {
            if (!AppState.instance) {
                AppState.instance = new AppState();
            }
            return AppState.instance;
        }

        // Music Player methods
        setMusicPlayer(player) {
            this.musicPlayer = player;
        }

        getMusicPlayer() {
            return this.musicPlayer;
        }

        // Pomodoro Timer methods
        savePomodoroState(state) {
            this.pomodoroTimer = {
                ...this.pomodoroTimer,
                ...state
            };
            this.saveToLocalStorage();
        }

        getPomodoroState() {
            return { ...this.pomodoroTimer };
        }

        isPomodoroRunning() {
            return this.pomodoroTimer.isRunning;
        }

        // Clear interval when stopping
        clearPomodoroInterval() {
            if (this.pomodoroTimer.interval) {
                clearInterval(this.pomodoroTimer.interval);
                this.pomodoroTimer.interval = null;
            }
        }

        // Set interval reference
        setPomodoroInterval(interval) {
            this.pomodoroTimer.interval = interval;
        }

        // Mark as initialized
        setInitialized(value) {
            this.initialized = value;
        }

        isInitialized() {
            return this.initialized;
        }

        // ==================== Persistence Methods ====================
        
        // Load state from localStorage
        loadPersistedState() {
            try {
                const savedState = localStorage.getItem('appState');
                if (savedState) {
                    const parsed = JSON.parse(savedState);
                    console.log('Loading persisted app state:', parsed);
                    
                    // Restore pomodoro timer state
                    this.pomodoroTimer = {
                        timeRemaining: parsed.pomodoroTimer?.timeRemaining || 0,
                        totalTime: parsed.pomodoroTimer?.totalTime || 0,
                        isRunning: false, // Don't auto-restart timer
                        isPaused: parsed.pomodoroTimer?.isPaused || false,
                        currentMode: parsed.pomodoroTimer?.currentMode || 'focus',
                        interval: null, // Will be recreated if needed
                        sessionStartTime: parsed.pomodoroTimer?.sessionStartTime,
                        completedSessions: parsed.pomodoroTimer?.completedSessions || 0,
                        isADHDMode: parsed.pomodoroTimer?.isADHDMode || false,
                        autoStart: parsed.pomodoroTimer?.autoStart !== undefined ? parsed.pomodoroTimer.autoStart : true
                    };
                    
                    // Restore music player state
                    this.musicPlayerState = {
                        currentUrl: parsed.musicPlayerState?.currentUrl || null,
                        currentService: parsed.musicPlayerState?.currentService || null,
                        isPlaying: parsed.musicPlayerState?.isPlaying || false,
                        currentVolume: parsed.musicPlayerState?.currentVolume || 50,
                        soundEnabled: parsed.musicPlayerState?.soundEnabled !== undefined ? parsed.musicPlayerState.soundEnabled : true,
                        ambientMusicEnabled: parsed.musicPlayerState?.ambientMusicEnabled || false
                    };
                    
                    this.musicPlayer = null; // Will be set by MusicPlayer instance
                } else {
                    console.log('No persisted state found, using defaults');
                    this.initializeDefaultState();
                }
            } catch (error) {
                console.error('Error loading persisted state:', error);
                this.initializeDefaultState();
            }
        }

        // Initialize default state
        initializeDefaultState() {
            this.musicPlayer = null;
            this.pomodoroTimer = {
                timeRemaining: 0,
                totalTime: 0,
                isRunning: false,
                isPaused: false,
                currentMode: 'focus',
                interval: null,
                sessionStartTime: null,
                completedSessions: 0,
                isADHDMode: false,
                autoStart: true
            };
            this.musicPlayerState = {
                currentUrl: null,
                currentService: null,
                isPlaying: false,
                currentVolume: 50,
                soundEnabled: true,
                ambientMusicEnabled: false
            };
        }

        // Save state to localStorage
        saveToLocalStorage() {
            try {
                const stateToSave = {
                    pomodoroTimer: {
                        timeRemaining: this.pomodoroTimer.timeRemaining,
                        totalTime: this.pomodoroTimer.totalTime,
                        isPaused: this.pomodoroTimer.isPaused,
                        currentMode: this.pomodoroTimer.currentMode,
                        sessionStartTime: this.pomodoroTimer.sessionStartTime,
                        completedSessions: this.pomodoroTimer.completedSessions,
                        isADHDMode: this.pomodoroTimer.isADHDMode,
                        autoStart: this.pomodoroTimer.autoStart
                    },
                    musicPlayerState: this.musicPlayerState || {}
                };
                
                localStorage.setItem('appState', JSON.stringify(stateToSave));
                console.log('App state saved to localStorage');
            } catch (error) {
                console.error('Error saving state to localStorage:', error);
            }
        }

        // Save music player state
        saveMusicPlayerState(state) {
            this.musicPlayerState = {
                ...this.musicPlayerState,
                ...state
            };
            this.saveToLocalStorage();
        }

        // Get music player state
        getMusicPlayerState() {
            return { ...this.musicPlayerState };
        }
    }

    // Create and export singleton instance
    const appStateInstance = AppState.getInstance();

    // Make it available globally
    if (typeof window !== 'undefined') {
        window.AppState = appStateInstance;
        // Also make the class available for getInstance calls
        window.AppStateClass = AppState;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = AppState;
    }
}