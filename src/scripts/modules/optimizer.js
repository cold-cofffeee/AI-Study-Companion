// Study Optimizer Module
// ipcRenderer is available globally via window.ipcRenderer from app.js

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
                    <label class="input-label">Main Subject:</label>
                    <input type="text" id="study-subject" class="input-field" 
                           placeholder="e.g., Mathematics, Computer Science, Biology">
                </div>
                <div class="input-group">
                    <label class="input-label">Topics (comma-separated):</label>
                    <textarea id="study-topics" class="input-field" rows="3"
                           placeholder="e.g., Calculus, Linear Algebra, Statistics OR Python Basics, OOP, Data Structures"></textarea>
                    <small class="text-muted">Enter multiple topics separated by commas</small>
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
                <div class="flex" style="justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 class="card-title">📊 Your Study Schedule</h2>
                    <button class="btn btn-primary" onclick="StudyOptimizer.sendToPomodoroTimer()">
                        🍅 Send to Pomodoro Timer
                    </button>
                </div>
                <div id="schedule-content" class="schedule-content"></div>
                <div class="flex gap-10 mt-20">
                    <button class="btn btn-secondary" onclick="StudyOptimizer.exportSchedule()">
                        📄 Export Schedule
                    </button>
                </div>
            </div>

            <style>
                .schedule-content {
                    background: var(--card-bg);
                    border-radius: 10px;
                    padding: 20px;
                }
                .schedule-content h1, .schedule-content h2, .schedule-content h3 {
                    color: var(--primary-color);
                    margin-top: 20px;
                    margin-bottom: 10px;
                }
                .schedule-content h1 { font-size: 24px; border-bottom: 2px solid var(--primary-color); padding-bottom: 8px; }
                .schedule-content h2 { font-size: 20px; }
                .schedule-content h3 { font-size: 18px; }
                .schedule-content ul, .schedule-content ol {
                    margin: 10px 0 10px 25px;
                    line-height: 1.8;
                }
                .schedule-content li {
                    margin: 8px 0;
                    padding: 8px;
                    background: var(--bg-secondary);
                    border-radius: 5px;
                    border-left: 3px solid var(--primary-color);
                }
                .schedule-content p {
                    margin: 10px 0;
                    line-height: 1.6;
                }
                .schedule-content strong {
                    color: var(--primary-color);
                    font-weight: 600;
                }
                .schedule-content code {
                    background: var(--bg-secondary);
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                }
                .schedule-content blockquote {
                    border-left: 4px solid var(--primary-color);
                    padding-left: 15px;
                    margin: 15px 0;
                    color: var(--text-muted);
                    font-style: italic;
                }
            </style>
        `;
    },

    async init() {
        const settings = await window.ipcRenderer.invoke('get-settings');
        this.data.sessionMinutes = settings.defaultStudySessionMinutes || 25;
        await this.restoreState();
    },

    async restoreState() {
        try {
            const savedState = await window.ipcRenderer.invoke('get-module-state', 'optimizer');
            if (savedState) {
                // Restore input fields
                const subjectInput = document.getElementById('study-subject');
                const topicsTextarea = document.getElementById('study-topics');
                const durationInput = document.getElementById('study-duration');
                const difficultySelect = document.getElementById('study-difficulty');
                
                if (savedState.subject && subjectInput) subjectInput.value = savedState.subject;
                if (savedState.topics && topicsTextarea) topicsTextarea.value = savedState.topics;
                if (savedState.duration && durationInput) durationInput.value = savedState.duration;
                if (savedState.difficulty && difficultySelect) difficultySelect.value = savedState.difficulty;
                
                // Restore generated schedule
                if (savedState.schedule) {
                    this.data.schedule = savedState.schedule;
                    this.displaySchedule(savedState.schedule.content);
                }
            }
        } catch (error) {
            console.error('Error restoring optimizer state:', error);
        }
    },

    saveState() {
        try {
            const subjectInput = document.getElementById('study-subject');
            const topicsTextarea = document.getElementById('study-topics');
            const durationInput = document.getElementById('study-duration');
            const difficultySelect = document.getElementById('study-difficulty');
            
            const state = {
                subject: subjectInput?.value,
                topics: topicsTextarea?.value,
                duration: durationInput?.value,
                difficulty: difficultySelect?.value,
                schedule: this.data.schedule
            };
            window.ipcRenderer.invoke('save-module-state', 'optimizer', state);
        } catch (error) {
            console.error('Error saving optimizer state:', error);
        }
    },

    async generateSchedule() {
        const subject = document.getElementById('study-subject')?.value;
        const topicsText = document.getElementById('study-topics')?.value;
        const duration = parseInt(document.getElementById('study-duration')?.value) || 120;
        const difficulty = document.getElementById('study-difficulty')?.value;

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

        showLoading('Generating optimized schedule...');

        try {
            const settings = await window.ipcRenderer.invoke('get-settings');
            if (!settings.apiKey) {
                throw new Error('API key not configured');
            }

            const result = await window.ipcRenderer.invoke('gemini-generate-schedule', studyPlan, duration, settings.apiKey);
            
            // Store the schedule data
            this.data.schedule = {
                subject: subject,
                topics: topics,
                duration: duration,
                difficulty: difficulty,
                content: result
            };
            
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
        
        // Better markdown parsing
        let htmlContent = content;
        
        // Process line by line for better control
        const lines = htmlContent.split('\n');
        let processedLines = [];
        let inList = false;
        let listItems = [];
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            
            // Skip empty lines
            if (!line) {
                if (inList) {
                    processedLines.push('<ul>' + listItems.join('') + '</ul>');
                    listItems = [];
                    inList = false;
                }
                processedLines.push('<br>');
                continue;
            }
            
            // Headers
            if (line.startsWith('### ')) {
                if (inList) {
                    processedLines.push('<ul>' + listItems.join('') + '</ul>');
                    listItems = [];
                    inList = false;
                }
                processedLines.push('<h3>' + line.substring(4) + '</h3>');
            } else if (line.startsWith('## ')) {
                if (inList) {
                    processedLines.push('<ul>' + listItems.join('') + '</ul>');
                    listItems = [];
                    inList = false;
                }
                processedLines.push('<h2>' + line.substring(3) + '</h2>');
            } else if (line.startsWith('# ')) {
                if (inList) {
                    processedLines.push('<ul>' + listItems.join('') + '</ul>');
                    listItems = [];
                    inList = false;
                }
                processedLines.push('<h1>' + line.substring(2) + '</h1>');
            }
            // List items
            else if (line.match(/^[\*\-]\s+/) || line.match(/^\d+\.\s+/)) {
                inList = true;
                let itemText = line.replace(/^[\*\-]\s+/, '').replace(/^\d+\.\s+/, '');
                // Handle bold text
                itemText = itemText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                listItems.push('<li>' + itemText + '</li>');
            }
            // Regular paragraphs
            else {
                if (inList) {
                    processedLines.push('<ul>' + listItems.join('') + '</ul>');
                    listItems = [];
                    inList = false;
                }
                // Handle bold text in paragraphs
                line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                processedLines.push('<p>' + line + '</p>');
            }
        }
        
        // Close any remaining list
        if (inList) {
            processedLines.push('<ul>' + listItems.join('') + '</ul>');
        }
        
        container.innerHTML = processedLines.join('');
        this.saveState();
    },

    async sendToPomodoroTimer() {
        if (!this.data.schedule) {
            showToast('No schedule to send', 'warning');
            return;
        }

        try {
            // Save schedule data to settings for Pomodoro to access
            await window.ipcRenderer.invoke('update-setting', 'pomodoroSchedule', this.data.schedule);
            showToast('Schedule sent to Pomodoro Timer! 🍅', 'success');
            
            // Navigate to pomodoro after a short delay
            setTimeout(() => {
                loadModule('pomodoro');
            }, 1000);
        } catch (error) {
            console.error('Error sending to Pomodoro:', error);
            showToast('Failed to send schedule', 'error');
        }
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
