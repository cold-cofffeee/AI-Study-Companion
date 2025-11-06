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

            // Initialize state
            this.musicPlayer = null;
            this.pomodoroTimer = {
                timeRemaining: 0,
                totalTime: 0,
                isRunning: false,
                isPaused: false,
                currentMode: 'focus',
                interval: null,
                sessionStartTime: null,
                completedSessions: 0
            };

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