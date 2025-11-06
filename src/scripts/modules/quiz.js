// Reverse Quiz Generator Module
// ipcRenderer is available globally via window.ipcRenderer from app.js

const ReverseQuiz = {
    data: {
        currentQuiz: null,
        userAnswers: []
    },

    async render() {
        return `
            <div class="module-header">
                <h1 class="module-title">❓ Reverse Quiz Generator</h1>
                <p class="module-description">Generate quizzes from answers and definitions</p>
            </div>

            <div class="card">
                <h2 class="card-title">📝 Input Answers/Definitions</h2>
                <div class="input-group">
                    <label class="input-label">Paste answers, definitions, or key concepts (one per line):</label>
                    <textarea id="quiz-answers" class="textarea-field" 
                              style="min-height: 200px;"
                              placeholder="Example:&#10;Photosynthesis&#10;Mitochondria&#10;Cell Membrane&#10;DNA"></textarea>
                </div>
                <div class="input-group">
                    <label class="input-label">Quiz Type:</label>
                    <select id="quiz-type" class="select-field">
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                        <option value="fill-blank">Fill in the Blank</option>
                    </select>
                </div>
                <button class="btn btn-primary mt-20" onclick="ReverseQuiz.generate()">
                    🎲 Generate Quiz
                </button>
            </div>

            <div class="card" id="quiz-display" style="display: none;">
                <h2 class="card-title">📋 Generated Quiz</h2>
                <div id="quiz-content"></div>
                <div class="flex gap-10 mt-20">
                    <button class="btn btn-success" onclick="ReverseQuiz.submitQuiz()">
                        ✓ Submit Answers
                    </button>
                    <button class="btn btn-secondary" onclick="ReverseQuiz.exportQuiz()">
                        📄 Export Quiz
                    </button>
                </div>
            </div>

            <div class="card" id="quiz-results" style="display: none;">
                <h2 class="card-title">🎯 Quiz Results</h2>
                <div id="results-content"></div>
                <button class="btn btn-primary mt-20" onclick="ReverseQuiz.resetQuiz()">
                    🔄 Create New Quiz
                </button>
            </div>
        `;
    },

    async init() {
        await this.restoreState();
    },

    async restoreState() {
        try {
            const savedState = await window.ipcRenderer.invoke('get-module-state', 'quiz');
            if (savedState) {
                // Restore input answers
                const answersTextarea = document.getElementById('quiz-answers');
                const quizTypeSelect = document.getElementById('quiz-type');
                
                if (savedState.answers && answersTextarea) answersTextarea.value = savedState.answers;
                if (savedState.quizType && quizTypeSelect) quizTypeSelect.value = savedState.quizType;
                
                // Restore generated quiz
                if (savedState.currentQuiz) {
                    this.data.currentQuiz = savedState.currentQuiz;
                    this.data.userAnswers = savedState.userAnswers || [];
                    this.displayQuiz(savedState.currentQuiz, savedState.quizType);
                }
            }
        } catch (error) {
            console.error('Error restoring quiz state:', error);
        }
    },

    saveState() {
        try {
            const answersTextarea = document.getElementById('quiz-answers');
            const quizTypeSelect = document.getElementById('quiz-type');
            
            const state = {
                answers: answersTextarea?.value,
                quizType: quizTypeSelect?.value,
                currentQuiz: this.data.currentQuiz,
                userAnswers: this.data.userAnswers
            };
            window.ipcRenderer.invoke('save-module-state', 'quiz', state);
        } catch (error) {
            console.error('Error saving quiz state:', error);
        }
    },

    async generate() {
        const answers = document.getElementById('quiz-answers')?.value;
        const quizType = document.getElementById('quiz-type')?.value;

        if (!answers || answers.trim() === '') {
            showToast('Please enter some answers or definitions', 'warning');
            return;
        }

        showLoading('Generating quiz...');

        try {
            const settings = await window.ipcRenderer.invoke('get-settings');
            if (!settings.apiKey) {
                throw new Error('API key not configured');
            }

            const client = new GeminiApiClient(settings.apiKey);
            const prompt = `
                Generate a ${quizType} quiz based on these answers/concepts:
                ${answers}
                
                Create interesting and educational questions where these items are the correct answers.
                Format each question clearly with options (if applicable).
                Number each question.
            `;
            
            const result = await client.generateContent(prompt);
            this.displayQuiz(result, quizType);
            showToast('Quiz generated successfully!', 'success');
        } catch (error) {
            console.error('Error generating quiz:', error);
            showToast('Failed to generate quiz: ' + error.message, 'error');
        } finally {
            hideLoading();
        }
    },

    displayQuiz(content, type) {
        document.getElementById('quiz-display').style.display = 'block';
        document.getElementById('quiz-results').style.display = 'none';
        const container = document.getElementById('quiz-content');
        
        this.data.currentQuiz = content;
        this.data.userAnswers = [];
        
        container.innerHTML = `
            <div style="background: var(--background-color); padding: 20px; border-radius: 8px;">
                <pre style="white-space: pre-wrap; font-family: 'Segoe UI', sans-serif;">${content}</pre>
            </div>
            <div class="mt-20">
                <p style="color: var(--text-secondary); font-size: 14px;">
                    📝 Review the quiz above and prepare your answers.
                </p>
            </div>
        `;
        
        this.saveState();
    },

    submitQuiz() {
        showToast('Quiz submitted! 🎉', 'success');
        document.getElementById('quiz-display').style.display = 'none';
        document.getElementById('quiz-results').style.display = 'block';
        
        const resultsContainer = document.getElementById('results-content');
        resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div style="font-size: 48px;">🎉</div>
                <h3 style="margin: 20px 0;">Great Job!</h3>
                <p style="color: var(--text-secondary);">
                    You've completed the quiz. Review your answers and check them against the generated questions.
                </p>
            </div>
        `;
    },

    async exportQuiz() {
        if (!this.data.currentQuiz) {
            showToast('No quiz to export', 'warning');
            return;
        }

        try {
            await window.ipcRenderer.invoke('export-pdf', {
                title: 'Reverse Quiz',
                content: this.data.currentQuiz
            });
            showToast('Quiz exported successfully!', 'success');
        } catch (error) {
            showToast('Failed to export: ' + error.message, 'error');
        }
    },

    resetQuiz() {
        document.getElementById('quiz-display').style.display = 'none';
        document.getElementById('quiz-results').style.display = 'none';
        document.getElementById('quiz-answers').value = '';
        this.data.currentQuiz = null;
        this.data.userAnswers = [];
    }
};

window.ReverseQuiz = ReverseQuiz;
