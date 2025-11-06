// Dashboard Module
const { ipcRenderer } = require('electron');

const Dashboard = {
    data: {
        sessions: [],
        flashcards: [],
        stats: {}
    },

    async render() {
        return `
            <div class="module-header">
                <h1 class="module-title">📊 Dashboard</h1>
                <p class="module-description">Welcome back! Here's your study overview</p>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">📚</div>
                    <div class="stat-value" id="stat-sessions">0</div>
                    <div class="stat-label">Study Sessions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🎴</div>
                    <div class="stat-value" id="stat-flashcards">0</div>
                    <div class="stat-label">Cards Due</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-value" id="stat-time">0h</div>
                    <div class="stat-label">Study Time</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-value" id="stat-streak">0</div>
                    <div class="stat-label">Day Streak</div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="card">
                <h2 class="card-title">⚡ Quick Actions</h2>
                <div class="quick-actions">
                    <button class="quick-action-btn" onclick="loadModule('summarizer')">
                        <div class="quick-action-icon">📝</div>
                        <div class="quick-action-label">Summarize</div>
                    </button>
                    <button class="quick-action-btn" onclick="loadModule('problems')">
                        <div class="quick-action-icon">🧮</div>
                        <div class="quick-action-label">Practice Problems</div>
                    </button>
                    <button class="quick-action-btn" onclick="loadModule('optimizer')">
                        <div class="quick-action-icon">⏰</div>
                        <div class="quick-action-label">Study Plan</div>
                    </button>
                    <button class="quick-action-btn" onclick="loadModule('flashcards')">
                        <div class="quick-action-icon">🎴</div>
                        <div class="quick-action-label">Flashcards</div>
                    </button>
                </div>
            </div>

            <!-- Daily Challenge -->
            <div class="card">
                <h2 class="card-title">🎯 Daily Challenge</h2>
                <div id="daily-challenge">
                    <p><strong>Today's Challenge:</strong> Study for 25 minutes without breaks</p>
                    <p style="color: var(--text-secondary); margin-top: 10px;">
                        Complete this challenge to maintain your streak!
                    </p>
                    <button class="btn btn-primary mt-20" onclick="Dashboard.startChallenge()">
                        Start Challenge
                    </button>
                </div>
            </div>

            <!-- Recent Sessions -->
            <div class="card">
                <h2 class="card-title">📖 Recent Study Sessions</h2>
                <div id="recent-sessions">
                    <p style="color: var(--text-secondary);">Loading sessions...</p>
                </div>
            </div>
        `;
    },

    async init() {
        await this.loadData();
        this.updateStats();
        this.renderRecentSessions();
    },

    async loadData() {
        try {
            this.data.sessions = await ipcRenderer.invoke('db-get-sessions', 5);
            this.data.flashcards = await ipcRenderer.invoke('db-get-flashcards');
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    },

    updateStats() {
        // Update stat cards
        document.getElementById('stat-sessions').textContent = this.data.sessions.length;
        document.getElementById('stat-flashcards').textContent = this.data.flashcards.length;
        
        // Calculate total study time
        const totalMinutes = this.data.sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
        const hours = Math.floor(totalMinutes / 60);
        document.getElementById('stat-time').textContent = `${hours}h`;
        
        // Streak calculation (simplified)
        document.getElementById('stat-streak').textContent = '0';
    },

    renderRecentSessions() {
        const container = document.getElementById('recent-sessions');
        
        if (this.data.sessions.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary);">No recent sessions</p>';
            return;
        }
        
        const html = this.data.sessions.map(session => `
            <div class="schedule-item">
                <div class="schedule-time">${formatDate(session.startTime)}</div>
                <div class="schedule-activity">${session.topic || 'Study Session'}</div>
                <div class="schedule-duration">${session.durationMinutes || 0} min</div>
            </div>
        `).join('');
        
        container.innerHTML = html;
    },

    startChallenge() {
        showToast('Challenge started! Good luck! 🎯', 'success');
        loadModule('optimizer');
    }
};

window.Dashboard = Dashboard;
