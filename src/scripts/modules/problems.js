// Problem Generator Module
// ipcRenderer is available globally via window.ipcRenderer from app.js

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
                <div class="input-group mt-10">
                    <label class="checkbox-container">
                        <input type="checkbox" id="hsc-context-checkbox-problems">
                        <span>🎓 HSC Bangladesh Student (Generate HSC syllabus-aligned problems)</span>
                    </label>
                    <small style="color: var(--text-secondary); margin-left: 24px; display: block; margin-top: 4px;">
                        Enable for HSC Bangladesh curriculum-specific problem patterns
                    </small>
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
        await this.restoreState();
    },

    async restoreState() {
        try {
            const savedState = await window.ipcRenderer.invoke('get-module-state', 'problems');
            if (savedState) {
                // Restore subject, difficulty, count
                const subjectSelect = document.getElementById('problem-subject');
                const difficultySelect = document.getElementById('problem-difficulty');
                const countInput = document.getElementById('problem-count');
                
                if (savedState.subject && subjectSelect) subjectSelect.value = savedState.subject;
                if (savedState.difficulty && difficultySelect) difficultySelect.value = savedState.difficulty;
                if (savedState.count && countInput) countInput.value = savedState.count;
                
                // Restore generated problems
                if (savedState.currentProblem) {
                    this.data.currentProblem = savedState.currentProblem;
                    this.displayProblems(savedState.currentProblem);
                }
                
                // Restore timer state
                if (savedState.elapsedSeconds) {
                    this.data.elapsedSeconds = savedState.elapsedSeconds;
                    this.updateTimerDisplay();
                }
            }
        } catch (error) {
            console.error('Error restoring problems state:', error);
        }
    },

    saveState() {
        try {
            const subjectSelect = document.getElementById('problem-subject');
            const difficultySelect = document.getElementById('problem-difficulty');
            const countInput = document.getElementById('problem-count');
            
            const state = {
                subject: subjectSelect?.value,
                difficulty: difficultySelect?.value,
                count: countInput?.value,
                currentProblem: this.data.currentProblem,
                elapsedSeconds: this.data.elapsedSeconds
            };
            window.ipcRenderer.invoke('save-module-state', 'problems', state);
        } catch (error) {
            console.error('Error saving problems state:', error);
        }
    },

    async generate() {
        const subject = document.getElementById('problem-subject')?.value;
        const difficulty = document.getElementById('problem-difficulty')?.value;
        const count = parseInt(document.getElementById('problem-count')?.value) || 3;
        const hscContext = document.getElementById('hsc-context-checkbox-problems')?.checked || false;

        showLoading('Generating problems...');

        try {
            const settings = await window.ipcRenderer.invoke('get-settings');
            if (!settings.apiKey) {
                throw new Error('API key not configured. Please configure it in Settings.');
            }

            // Enhanced prompt for structured problems
            let prompt = `Generate ${count} ${difficulty} difficulty ${subject} problems.

For each problem, provide in this EXACT format:

**Problem [Number]: [Title]**

**Question:**
[Problem statement here]

**Hints:**
1. [Hint 1]
2. [Hint 2]
3. [Hint 3]

**Solution:**
[Step-by-step solution]

**Answer:**
[Final answer]

---

Make sure each problem follows this format exactly.`;

            if (hscContext) {
                prompt += `\n\n[HSC BANGLADESH CONTEXT]: Generate problems following HSC Bangladesh syllabus and board exam patterns for ${subject}. Use HSC textbook notation and include Bengali terms where appropriate.`;
            }

            const client = new GeminiApiClient(settings.apiKey);
            const result = await client.generateContent(prompt);
            
            this.data.currentProblem = result;
            this.displayProblems(result);
            this.saveState();
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
        
        // Parse the content into problems
        const problemSections = content.split(/\*\*Problem \d+:/);
        
        let problemsHTML = '';
        
        for (let i = 1; i < problemSections.length; i++) {
            const section = problemSections[i];
            
            // Extract components using regex
            const titleMatch = section.match(/^([^\*]+)\*\*/);
            const questionMatch = section.match(/\*\*Question:\*\*\s*([\s\S]*?)\s*\*\*Hints:/);
            const hintsMatch = section.match(/\*\*Hints:\*\*\s*([\s\S]*?)\s*\*\*Solution:/);
            const solutionMatch = section.match(/\*\*Solution:\*\*\s*([\s\S]*?)\s*\*\*Answer:/);
            const answerMatch = section.match(/\*\*Answer:\*\*\s*([\s\S]*?)(?=---|$)/);
            
            const title = titleMatch ? titleMatch[1].trim() : `Problem ${i}`;
            const question = questionMatch ? questionMatch[1].trim() : 'Question not found';
            const hints = hintsMatch ? hintsMatch[1].trim() : '';
            const solution = solutionMatch ? solutionMatch[1].trim() : '';
            const answer = answerMatch ? answerMatch[1].trim() : '';
            
            problemsHTML += `
                <div class="problem-card" style="margin-bottom: 25px; padding: 20px; background: var(--surface-color); border-radius: 12px; border-left: 4px solid var(--primary-color);">
                    <h3 style="color: var(--primary-color); margin-bottom: 15px;">
                        📝 Problem ${i}: ${title}
                    </h3>
                    
                    <div class="problem-question" style="background: var(--card-bg); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <h4 style="color: var(--text-color); margin-bottom: 10px; font-size: 14px; font-weight: 600;">Question:</h4>
                        <div style="white-space: pre-wrap; line-height: 1.6; color: var(--text-color);">${question}</div>
                    </div>
                    
                    <div class="problem-hints" id="hints-${i}" style="display: none; background: #fff8e1; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 3px solid #ffc107;">
                        <h4 style="color: #f57c00; margin-bottom: 10px; font-size: 14px; font-weight: 600;">💡 Hints:</h4>
                        <div style="white-space: pre-wrap; line-height: 1.6; color: #5d4037;">${hints}</div>
                    </div>
                    
                    <div class="problem-solution" id="solution-${i}" style="display: none; background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 3px solid #4caf50;">
                        <h4 style="color: #2e7d32; margin-bottom: 10px; font-size: 14px; font-weight: 600;">📖 Step-by-Step Solution:</h4>
                        <div style="white-space: pre-wrap; line-height: 1.6; color: #1b5e20;">${solution}</div>
                        ${answer ? `
                            <div style="margin-top: 15px; padding: 10px; background: white; border-radius: 6px; border: 2px solid #4caf50;">
                                <strong style="color: #2e7d32;">✅ Final Answer:</strong>
                                <div style="margin-top: 5px; color: #1b5e20; font-weight: 600;">${answer}</div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="problem-actions" style="display: flex; gap: 10px;">
                        <button class="btn btn-warning" id="hint-btn-${i}" onclick="ProblemGenerator.showHints(${i})" style="font-size: 14px;">
                            💡 Show Hints
                        </button>
                        <button class="btn btn-success" id="solution-btn-${i}" onclick="ProblemGenerator.showSolution(${i})" style="display: none; font-size: 14px;">
                            📖 Show Solution
                        </button>
                    </div>
                </div>
            `;
        }
        
        if (problemsHTML === '') {
            // Fallback if parsing fails
            container.innerHTML = `
                <div class="problem-card">
                    <pre style="white-space: pre-wrap; font-family: 'Segoe UI', sans-serif; line-height: 1.6;">${content}</pre>
                </div>
            `;
        } else {
            container.innerHTML = problemsHTML;
        }
        
        this.data.currentProblem = content;
        this.saveState();
    },

    showHints(problemNumber) {
        const hintsDiv = document.getElementById(`hints-${problemNumber}`);
        const hintBtn = document.getElementById(`hint-btn-${problemNumber}`);
        const solutionBtn = document.getElementById(`solution-btn-${problemNumber}`);
        
        hintsDiv.style.display = 'block';
        hintBtn.style.display = 'none';
        solutionBtn.style.display = 'inline-block';
    },

    showSolution(problemNumber) {
        const solutionDiv = document.getElementById(`solution-${problemNumber}`);
        const solutionBtn = document.getElementById(`solution-btn-${problemNumber}`);
        
        solutionDiv.style.display = 'block';
        solutionBtn.style.display = 'none';
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
                this.saveState();
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
