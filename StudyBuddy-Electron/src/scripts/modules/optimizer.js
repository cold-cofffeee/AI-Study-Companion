// Study Optimizer Module
// ipcRenderer is available globally via window.ipcRenderer from app.js
const GeminiApiClient = require('../../helpers/GeminiApiClient');

const StudyOptimizer = {
    data: {
        schedule: null,
        timerInterval: null,
        elapsedMinutes: 0,
        isBreak: false,
        sessionMinutes: 25
    },

    async render() {
        return `
            <div class="module-header">
                <h1 class="module-title">⏰ Study Time Optimizer</h1>
                <p class="module-description">Create optimized study schedules with Pomodoro technique</p>
            </div>

            <div class="card">
                <h2 class="card-title">📋 Schedule Settings</h2>
                <div class="input-group">
                    <label class="input-label">Study Topic:</label>
                    <input type="text" id="study-topic" class="input-field" 
                           placeholder="e.g., Calculus, World History, Python Programming">
                </div>
                <div class="flex gap-20" style="flex-wrap: wrap;">
                    <div class="input-group" style="flex: 1; min-width: 200px;">
                        <label class="input-label">Total Study Time (minutes):</label>
                        <input type="number" id="study-duration" class="input-field" value="120" min="25" max="480">
                    </div>
                    <div class="input-group" style="flex: 1; min-width: 200px;">
                        <label class="input-label">Difficulty Level:</label>
                        <select id="study-difficulty" class="select-field">
                            <option value="Easy">Easy</option>
                            <option value="Medium" selected>Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>
                <button class="btn btn-primary mt-20" onclick="StudyOptimizer.generateSchedule()">
                    📅 Generate Schedule
                </button>
            </div>

            <div class="card" id="schedule-display" style="display: none;">
                <h2 class="card-title">📊 Your Study Schedule</h2>
                <div id="schedule-content"></div>
                <div class="flex gap-10 mt-20">
                    <button class="btn btn-success" onclick="StudyOptimizer.startSession()">
                        ▶️ Start Session
                    </button>
                    <button class="btn btn-secondary" onclick="StudyOptimizer.exportSchedule()">
                        📄 Export Schedule
                    </button>
                </div>
            </div>

            <div class="card" id="timer-display" style="display: none;">
                <h2 class="card-title">⏱️ Focus Timer</h2>
                <div class="flex-center" style="flex-direction: column; padding: 40px;">
                    <div style="font-size: 64px; font-weight: bold; color: var(--primary-color);" id="focus-timer">
                        25:00
                    </div>
                    <div style="font-size: 18px; margin-top: 20px; color: var(--text-secondary);" id="session-status">
                        Focus Session
                    </div>
                    <div class="flex gap-10 mt-20">
                        <button class="btn btn-primary" onclick="StudyOptimizer.toggleFocusTimer()" id="focus-btn">
                            Start Focus
                        </button>
                        <button class="btn btn-outline" onclick="StudyOptimizer.resetFocusTimer()">
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        const settings = await window.ipcRenderer.invoke('get-settings');
        this.data.sessionMinutes = settings.defaultStudySessionMinutes || 25;
    },

    async generateSchedule() {
        const topic = document.getElementById('study-topic')?.value;
        const duration = parseInt(document.getElementById('study-duration')?.value) || 120;
        const difficulty = document.getElementById('study-difficulty')?.value;

        if (!topic || topic.trim() === '') {
            showToast('Please enter a study topic', 'warning');
            return;
        }

        showLoading('Generating optimized schedule...');

        try {
            const settings = await window.ipcRenderer.invoke('get-settings');
            if (!settings.apiKey) {
                throw new Error('API key not configured');
            }

            const client = new GeminiApiClient(settings.apiKey);
            const result = await client.generateStudySchedule(topic, duration, difficulty, settings.preferredLanguage || 'en');
            
            this.displaySchedule(result);
            showToast('Schedule generated successfully!', 'success');
        } catch (error) {
            console.error('Error generating schedule:', error);
            showToast('Failed to generate schedule: ' + error.message, 'error');
        } finally {
            hideLoading();
        }
    },

    displaySchedule(content) {
        document.getElementById('schedule-display').style.display = 'block';
        const container = document.getElementById('schedule-content');
        container.innerHTML = `<pre style="white-space: pre-wrap; font-family: 'Segoe UI', sans-serif;">${content}</pre>`;
        this.data.schedule = content;
    },

    startSession() {
        document.getElementById('timer-display').style.display = 'block';
        showToast('Study session started! Stay focused! 💪', 'success');
        
        // Save session to database
        const topic = document.getElementById('study-topic')?.value || 'Study Session';
        window.ipcRenderer.invoke('db-save-session', {
            startTime: new Date().toISOString(),
            topic: topic,
            moduleUsed: 'optimizer',
            durationMinutes: 0,
            breaksCount: 0,
            notes: ''
        });
    },

    toggleFocusTimer() {
        const btn = document.getElementById('focus-btn');
        if (this.data.timerInterval) {
            clearInterval(this.data.timerInterval);
            this.data.timerInterval = null;
            btn.textContent = 'Resume';
        } else {
            btn.textContent = 'Pause';
            const totalSeconds = this.data.sessionMinutes * 60;
            let remainingSeconds = totalSeconds - (this.data.elapsedMinutes * 60);
            
            this.data.timerInterval = setInterval(() => {
                remainingSeconds--;
                const mins = Math.floor(remainingSeconds / 60);
                const secs = remainingSeconds % 60;
                document.getElementById('focus-timer').textContent = 
                    `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                
                if (remainingSeconds <= 0) {
                    clearInterval(this.data.timerInterval);
                    this.data.timerInterval = null;
                    this.data.isBreak = !this.data.isBreak;
                    
                    if (this.data.isBreak) {
                        showToast('Time for a break! 🎉', 'success');
                        window.ipcRenderer.invoke('show-notification', 'Study Break', 'Time to take a 5-minute break!');
                    } else {
                        showToast('Break over! Back to studying! 📚', 'success');
                    }
                }
            }, 1000);
        }
    },

    resetFocusTimer() {
        clearInterval(this.data.timerInterval);
        this.data.timerInterval = null;
        this.data.elapsedMinutes = 0;
        this.data.isBreak = false;
        document.getElementById('focus-timer').textContent = `${this.data.sessionMinutes}:00`;
        document.getElementById('focus-btn').textContent = 'Start Focus';
        document.getElementById('session-status').textContent = 'Focus Session';
    },

    async exportSchedule() {
        if (!this.data.schedule) {
            showToast('No schedule to export', 'warning');
            return;
        }

        try {
            await window.ipcRenderer.invoke('export-pdf', {
                title: 'Study Schedule',
                content: this.data.schedule
            });
            showToast('Schedule exported successfully!', 'success');
        } catch (error) {
            showToast('Failed to export: ' + error.message, 'error');
        }
    }
};

window.StudyOptimizer = StudyOptimizer;
