// Problem Generator Module
// ipcRenderer is available globally via window.ipcRenderer from app.js
const GeminiApiClient = require('../../helpers/GeminiApiClient');

const ProblemGenerator = {
    data: {
        currentProblem: null,
        timerInterval: null,
        elapsedSeconds: 0
    },

    async render() {
        return `
            <div class="module-header">
                <h1 class="module-title">🧮 Random Problem Generator</h1>
                <p class="module-description">Generate practice problems with solutions</p>
            </div>

            <div class="card">
                <h2 class="card-title">⚙️ Problem Settings</h2>
                <div class="flex gap-20" style="flex-wrap: wrap;">
                    <div class="input-group" style="flex: 1; min-width: 200px;">
                        <label class="input-label">Subject:</label>
                        <select id="problem-subject" class="select-field">
                            <option value="Math">Mathematics</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Biology">Biology</option>
                            <option value="Computer Science">Computer Science</option>
                        </select>
                    </div>
                    <div class="input-group" style="flex: 1; min-width: 200px;">
                        <label class="input-label">Difficulty:</label>
                        <select id="problem-difficulty" class="select-field">
                            <option value="Easy">Easy</option>
                            <option value="Medium" selected>Medium</option>
                            <option value="Hard">Hard</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>
                    <div class="input-group" style="flex: 1; min-width: 200px;">
                        <label class="input-label">Number of Problems:</label>
                        <input type="number" id="problem-count" class="input-field" value="3" min="1" max="10">
                    </div>
                </div>
                <button class="btn btn-primary mt-20" onclick="ProblemGenerator.generate()">
                    🎲 Generate Problems
                </button>
            </div>

            <div class="card" id="problem-display" style="display: none;">
                <div class="flex-between mb-20">
                    <h2 class="card-title">📝 Generated Problems</h2>
                    <div class="problem-timer" id="problem-timer">
                        ⏱️ <span id="timer-display">00:00</span>
                    </div>
                </div>
                <div id="problems-container"></div>
                <div class="flex gap-10 mt-20">
                    <button class="btn btn-primary" onclick="ProblemGenerator.toggleTimer()">
                        <span id="timer-btn-text">Start Timer</span>
                    </button>
                    <button class="btn btn-secondary" onclick="ProblemGenerator.resetTimer()">
                        Reset Timer
                    </button>
                    <button class="btn btn-outline" onclick="ProblemGenerator.exportProblems()">
                        📄 Export
                    </button>
                </div>
            </div>
        `;
    },

    async init() {
        // Module initialized
    },

    async generate() {
        const subject = document.getElementById('problem-subject')?.value;
        const difficulty = document.getElementById('problem-difficulty')?.value;
        const count = parseInt(document.getElementById('problem-count')?.value) || 3;

        showLoading('Generating problems...');

        try {
            const settings = await window.ipcRenderer.invoke('get-settings');
            if (!settings.apiKey) {
                throw new Error('API key not configured. Please configure it in Settings.');
            }

            const client = new GeminiApiClient(settings.apiKey);
            const result = await client.generateProblems(subject, difficulty, count, settings.preferredLanguage || 'en');
            
            this.displayProblems(result);
            showToast('Problems generated successfully!', 'success');
        } catch (error) {
            console.error('Error generating problems:', error);
            showToast('Failed to generate problems: ' + error.message, 'error');
        } finally {
            hideLoading();
        }
    },

    displayProblems(content) {
        document.getElementById('problem-display').style.display = 'block';
        const container = document.getElementById('problems-container');
        container.innerHTML = `
            <div class="problem-card">
                <pre style="white-space: pre-wrap; font-family: 'Segoe UI', sans-serif;">${content}</pre>
            </div>
        `;
        this.data.currentProblem = content;
    },

    toggleTimer() {
        const btnText = document.getElementById('timer-btn-text');
        if (this.data.timerInterval) {
            clearInterval(this.data.timerInterval);
            this.data.timerInterval = null;
            btnText.textContent = 'Resume Timer';
        } else {
            btnText.textContent = 'Pause Timer';
            this.data.timerInterval = setInterval(() => {
                this.data.elapsedSeconds++;
                this.updateTimerDisplay();
            }, 1000);
        }
    },

    resetTimer() {
        clearInterval(this.data.timerInterval);
        this.data.timerInterval = null;
        this.data.elapsedSeconds = 0;
        this.updateTimerDisplay();
        document.getElementById('timer-btn-text').textContent = 'Start Timer';
    },

    updateTimerDisplay() {
        const display = document.getElementById('timer-display');
        if (display) {
            display.textContent = formatTime(this.data.elapsedSeconds);
        }
    },

    async exportProblems() {
        if (!this.data.currentProblem) {
            showToast('No problems to export', 'warning');
            return;
        }

        try {
            await window.ipcRenderer.invoke('export-pdf', {
                title: 'Practice Problems',
                content: this.data.currentProblem
            });
            showToast('Problems exported successfully!', 'success');
        } catch (error) {
            showToast('Failed to export: ' + error.message, 'error');
        }
    }
};

window.ProblemGenerator = ProblemGenerator;
