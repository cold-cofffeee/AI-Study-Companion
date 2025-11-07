// Problem Generator Module
// ipcRenderer is available globally via window.ipcRenderer from app.js

const ProblemGenerator = {
    data: {
        currentProblem: null,
        problemTimers: {}, // Track individual problem timers
        timerIntervals: {}, // Track interval IDs for each problem
        lastError: null,
        generationHistory: [] // Track all generated problems
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
                </div>
                <div id="problems-container"></div>
                <div class="flex gap-10 mt-20">
                    <button class="btn btn-primary" onclick="ProblemGenerator.copyProblems()">
                        📋 Copy All
                    </button>
                    <button class="btn btn-secondary" onclick="ProblemGenerator.exportProblems()">
                        📄 Save as PDF
                    </button>
                </div>
            </div>
        `;
    },

    async init() {
        await this.restoreState();
        // Hide problem display initially if no saved state
        if (!this.data.currentProblem) {
            const displayEl = document.getElementById('problem-display');
            if (displayEl) displayEl.style.display = 'none';
        }
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
                    
                    // Restore timers
                    if (savedState.problemTimers) {
                        this.data.problemTimers = savedState.problemTimers;
                    }
                    
                    // Restore generation history
                    if (savedState.generationHistory) {
                        this.data.generationHistory = savedState.generationHistory;
                    }
                    
                    // Restore last error
                    if (savedState.lastError) {
                        this.data.lastError = savedState.lastError;
                    }
                    
                    this.displayProblems(savedState.currentProblem);
                }
            }
        } catch (error) {
            console.error('Error restoring problems state:', error);
            this.data.lastError = { timestamp: new Date().toISOString(), error: error.message, action: 'restore-state' };
        }
    },

    saveState() {
        try {
            const subjectSelect = document.getElementById('problem-subject');
            const difficultySelect = document.getElementById('problem-difficulty');
            const countInput = document.getElementById('problem-count');
            const hscCheckbox = document.getElementById('hsc-context-checkbox-problems');
            
            const state = {
                subject: subjectSelect?.value,
                difficulty: difficultySelect?.value,
                count: countInput?.value,
                hscContext: hscCheckbox?.checked,
                currentProblem: this.data.currentProblem,
                problemTimers: this.data.problemTimers,
                generationHistory: this.data.generationHistory,
                lastError: this.data.lastError,
                timestamp: new Date().toISOString()
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
            
            // Cache the generation
            this.data.generationHistory.push({
                timestamp: new Date().toISOString(),
                inputs: { subject, difficulty, count, hscContext },
                result: result
            });
            
            // Keep only last 30 generations
            if (this.data.generationHistory.length > 30) {
                this.data.generationHistory = this.data.generationHistory.slice(-30);
            }
            
            this.displayProblems(result);
            this.saveState();
            showToast('Problems generated successfully!', 'success');
        } catch (error) {
            console.error('Error generating problems:', error);
            this.data.lastError = {
                timestamp: new Date().toISOString(),
                error: error.message,
                action: 'generate-problems',
                inputs: { subject, difficulty, count, hscContext }
            };
            this.saveState();
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
            
            // Initialize timer for this problem
            if (!this.data.problemTimers[i]) {
                this.data.problemTimers[i] = 0;
            }
            
            problemsHTML += `
                <div class="problem-card" style="margin-bottom: 30px; padding: 25px; background: var(--surface-color); border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <div class="problem-header-section" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
                        <div>
                            <h3 style="color: var(--primary-color); margin: 0 0 5px 0; font-size: 18px;">
                                📝 Problem ${i}
                            </h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 13px;">${title}</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                            <span style="background: var(--primary-color); color: white; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; white-space: nowrap;">
                                ⏱️ <span id="timer-display-${i}">00:00</span>
                            </span>
                            <button class="btn btn-sm btn-outline" id="timer-toggle-${i}" onclick="ProblemGenerator.toggleProblemTimer(${i})" style="padding: 6px 14px; font-size: 13px; white-space: nowrap;">
                                ▶️ Start
                            </button>
                        </div>
                    </div>
                    
                    <div class="problem-question" style="background: var(--bg-secondary); padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid var(--primary-color);">
                        <h4 style="color: var(--text-color); margin: 0 0 12px 0; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                            <span>❓</span> Question:
                        </h4>
                        <div style="white-space: pre-wrap; line-height: 1.8; color: var(--text-color); font-size: 14px;">${question}</div>
                    </div>
                    
                    <div class="problem-hints" id="hints-${i}" style="display: none; background: #fff8e1; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #ffa726;">
                        <h4 style="color: #f57c00; margin: 0 0 12px 0; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                            <span>💡</span> Hints:
                        </h4>
                        <div style="white-space: pre-wrap; line-height: 1.8; color: #5d4037; font-size: 14px;">${hints}</div>
                    </div>
                    
                    <div class="problem-solution" id="solution-${i}" style="display: none; background: #e8f5e9; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #66bb6a;">
                        <h4 style="color: #2e7d32; margin: 0 0 12px 0; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                            <span>📖</span> Step-by-Step Solution:
                        </h4>
                        <div style="white-space: pre-wrap; line-height: 1.8; color: #1b5e20; font-size: 14px;">${solution}</div>
                        ${answer ? `
                            <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 8px; border: 2px solid #4caf50; box-shadow: 0 2px 4px rgba(76, 175, 80, 0.1);">
                                <strong style="color: #2e7d32; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                                    <span>✅</span> Final Answer:
                                </strong>
                                <div style="margin-top: 8px; color: #1b5e20; font-weight: 600; font-size: 15px;">${answer}</div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="problem-actions" style="display: flex; gap: 10px; flex-wrap: wrap; border-top: 1px solid var(--border-color); padding-top: 15px; margin-top: 15px;">
                        <button class="btn btn-warning" id="hint-btn-${i}" onclick="ProblemGenerator.showHints(${i})" style="font-size: 14px; flex: 1; min-width: 140px;">
                            💡 Show Hints
                        </button>
                        <button class="btn btn-success" id="solution-btn-${i}" onclick="ProblemGenerator.showSolution(${i})" style="display: none; font-size: 14px; flex: 1; min-width: 140px;">
                            📖 Show Solution
                        </button>
                        <button class="btn btn-outline" onclick="ProblemGenerator.copyProblem(${i})" style="font-size: 14px; padding: 10px 20px;">
                            📋 Copy
                        </button>
                        <button class="btn btn-outline" onclick="ProblemGenerator.exportSingleProblem(${i})" style="font-size: 14px; padding: 10px 20px;">
                            📄 PDF
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
            
            // Update timer displays after rendering
            Object.keys(this.data.problemTimers).forEach(problemNum => {
                this.updateProblemTimerDisplay(parseInt(problemNum));
            });
        }
        
        this.data.currentProblem = content;
        this.saveState();
    },

    toggleProblemTimer(problemNumber) {
        const toggleBtn = document.getElementById(`timer-toggle-${problemNumber}`);
        
        if (this.data.timerIntervals[problemNumber]) {
            // Pause timer
            clearInterval(this.data.timerIntervals[problemNumber]);
            delete this.data.timerIntervals[problemNumber];
            toggleBtn.innerHTML = '▶️ Resume';
        } else {
            // Start timer
            toggleBtn.innerHTML = '⏸️ Pause';
            this.data.timerIntervals[problemNumber] = setInterval(() => {
                this.data.problemTimers[problemNumber] = (this.data.problemTimers[problemNumber] || 0) + 1;
                this.updateProblemTimerDisplay(problemNumber);
                this.saveState();
            }, 1000);
        }
    },

    updateProblemTimerDisplay(problemNumber) {
        const seconds = this.data.problemTimers[problemNumber] || 0;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const displayEl = document.getElementById(`timer-display-${problemNumber}`);
        if (displayEl) {
            displayEl.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
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

    copyProblems() {
        if (!this.data.currentProblem) {
            showToast('No problems to copy', 'warning');
            return;
        }
        
        ExportUtils.copyToClipboard(
            this.data.currentProblem,
            'Problems copied to clipboard!'
        );
    },

    async exportProblems() {
        if (!this.data.currentProblem) {
            showToast('No problems to export', 'warning');
            return;
        }

        const subject = document.getElementById('problem-subject')?.value || 'Unknown';
        const difficulty = document.getElementById('problem-difficulty')?.value || 'Medium';
        
        // Parse problems for better PDF formatting
        const problemsHtml = this.data.currentProblem
            .split(/\*\*Problem \d+:\*\*/)
            .filter(p => p.trim())
            .map((problem, index) => {
                const parts = problem.split(/\*\*Hints?:\*\*/i);
                const questionPart = parts[0] || '';
                const hintAndSolution = parts[1] || '';
                const solutionParts = hintAndSolution.split(/\*\*Solution:\*\*/i);
                const hints = solutionParts[0] || '';
                const solution = solutionParts[1] || '';
                
                return `
                    <div class="problem-card">
                        <div class="problem-header">Problem ${index + 1}</div>
                        <div>${questionPart.trim()}</div>
                        ${hints.trim() ? `<div class="hints"><strong>Hints:</strong><br>${hints.trim()}</div>` : ''}
                        ${solution.trim() ? `<div class="solution"><strong>Solution:</strong><br>${solution.trim()}</div>` : ''}
                    </div>
                `;
            }).join('');

        await ExportUtils.exportToPDF(
            problemsHtml,
            `Practice Problems - ${subject}`,
            {
                moduleType: 'Problem Generator',
                metadata: {
                    'Subject': subject,
                    'Difficulty': difficulty,
                    'Total Problems': this.data.currentProblem.split(/\*\*Problem \d+:\*\*/).length - 1
                }
            }
        );
    },

    copyProblem(problemNumber) {
        const problemSections = this.data.currentProblem.split(/\*\*Problem \d+:\*\*/);
        if (problemNumber >= problemSections.length) {
            showToast('Problem not found', 'error');
            return;
        }
        
        const section = problemSections[problemNumber];
        const questionMatch = section.match(/\*\*Question:\*\*\s*([\s\S]*?)\s*\*\*Hints:/);
        const hintsMatch = section.match(/\*\*Hints:\*\*\s*([\s\S]*?)\s*\*\*Solution:/);
        const solutionMatch = section.match(/\*\*Solution:\*\*\s*([\s\S]*?)\s*\*\*Answer:/);
        const answerMatch = section.match(/\*\*Answer:\*\*\s*([\s\S]*?)(?=---|$)/);
        
        let problemText = `Problem ${problemNumber}\n\n`;
        problemText += `Question:\n${questionMatch ? questionMatch[1].trim() : 'N/A'}\n\n`;
        
        if (hintsMatch && hintsMatch[1].trim()) {
            problemText += `Hints:\n${hintsMatch[1].trim()}\n\n`;
        }
        
        if (solutionMatch && solutionMatch[1].trim()) {
            problemText += `Solution:\n${solutionMatch[1].trim()}\n\n`;
        }
        
        if (answerMatch && answerMatch[1].trim()) {
            problemText += `Answer:\n${answerMatch[1].trim()}`;
        }
        
        ExportUtils.copyToClipboard(problemText, `Problem ${problemNumber} copied to clipboard!`);
    },

    async exportSingleProblem(problemNumber) {
        const problemSections = this.data.currentProblem.split(/\*\*Problem \d+:\*\*/);
        if (problemNumber >= problemSections.length) {
            showToast('Problem not found', 'error');
            return;
        }
        
        const section = problemSections[problemNumber];
        const titleMatch = section.match(/^([^\*]+)\*\*/);
        const questionMatch = section.match(/\*\*Question:\*\*\s*([\s\S]*?)\s*\*\*Hints:/);
        const hintsMatch = section.match(/\*\*Hints:\*\*\s*([\s\S]*?)\s*\*\*Solution:/);
        const solutionMatch = section.match(/\*\*Solution:\*\*\s*([\s\S]*?)\s*\*\*Answer:/);
        const answerMatch = section.match(/\*\*Answer:\*\*\s*([\s\S]*?)(?=---|$)/);
        
        const title = titleMatch ? titleMatch[1].trim() : `Problem ${problemNumber}`;
        const question = questionMatch ? questionMatch[1].trim() : 'Question not found';
        const hints = hintsMatch ? hintsMatch[1].trim() : '';
        const solution = solutionMatch ? solutionMatch[1].trim() : '';
        const answer = answerMatch ? answerMatch[1].trim() : '';
        
        const subject = document.getElementById('problem-subject')?.value || 'Unknown';
        const difficulty = document.getElementById('problem-difficulty')?.value || 'Medium';
        
        const problemHtml = `
            <div class="problem-card">
                <div class="problem-header">Problem ${problemNumber}: ${title}</div>
                <div style="margin: 15px 0;">
                    <h4 style="color: #667eea; margin-bottom: 10px;">❓ Question:</h4>
                    <div style="white-space: pre-wrap; line-height: 1.8;">${question}</div>
                </div>
                ${hints ? `
                    <div class="hints">
                        <strong>💡 Hints:</strong><br>
                        <div style="margin-top: 8px; white-space: pre-wrap;">${hints}</div>
                    </div>
                ` : ''}
                ${solution ? `
                    <div class="solution">
                        <strong>📖 Solution:</strong><br>
                        <div style="margin-top: 8px; white-space: pre-wrap;">${solution}</div>
                        ${answer ? `
                            <div style="margin-top: 15px; padding: 12px; background: white; border-radius: 6px; border: 2px solid #28a745;">
                                <strong style="color: #155724;">✅ Final Answer:</strong>
                                <div style="margin-top: 5px; font-weight: 600; color: #1b5e20;">${answer}</div>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;
        
        const timeSpent = this.data.problemTimers[problemNumber] || 0;
        const timeFormatted = formatTime(timeSpent);
        
        await ExportUtils.exportToPDF(
            problemHtml,
            `Problem ${problemNumber} - ${subject}`,
            {
                moduleType: 'Problem Generator',
                metadata: {
                    'Subject': subject,
                    'Difficulty': difficulty,
                    'Problem Number': problemNumber,
                    'Time Spent': timeFormatted
                }
            }
        );
    }
};

window.ProblemGenerator = ProblemGenerator;
