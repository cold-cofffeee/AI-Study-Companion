// Summarizer Module
// ipcRenderer is available globally via window.ipcRenderer from app.js

const Summarizer = {
    data: {
        outputs: [],
        currentTab: 0
    },

    async render() {
        const languages = [
            { code: 'en', name: 'English' },
            { code: 'es', name: 'Spanish' },
            { code: 'fr', name: 'French' },
            { code: 'de', name: 'German' },
            { code: 'it', name: 'Italian' },
            { code: 'pt', name: 'Portuguese' },
            { code: 'ru', name: 'Russian' },
            { code: 'ja', name: 'Japanese' },
            { code: 'ko', name: 'Korean' },
            { code: 'zh', name: 'Chinese' }
        ];

        const languageOptions = languages.map(lang => 
            `<option value="${lang.code}">${lang.name}</option>`
        ).join('');

        return `
            <div class="module-header">
                <h1 class="module-title">📝 AI Study Summarizer</h1>
                <p class="module-description">Transform your study materials with AI-powered summaries, quizzes, and memory tricks</p>
            </div>

            <!-- API Status -->
            <div class="card">
                <div class="flex-between">
                    <div>
                        <span class="api-status" id="api-status">
                            <span class="api-status-dot"></span>
                            <span id="api-status-text">Checking API...</span>
                        </span>
                    </div>
                    <button class="btn btn-outline" onclick="Summarizer.configureApi()">
                        ⚙️ Configure API Key
                    </button>
                </div>
            </div>

            <!-- Input Section -->
            <div class="card">
                <h2 class="card-title">📄 Input Text</h2>
                <div class="input-group">
                    <label class="input-label">Paste your study material here:</label>
                    <textarea 
                        id="input-text" 
                        class="textarea-field" 
                        placeholder="Paste your notes, textbook content, or any study material here..."
                        style="min-height: 200px;"
                        oninput="Summarizer.updateCharCount()"
                    ></textarea>
                    <div class="char-counter" id="char-counter">0 characters</div>
                </div>

                <div class="input-group">
                    <label class="input-label">Language:</label>
                    <select id="language-select" class="select-field">
                        ${languageOptions}
                    </select>
                </div>
            </div>

            <!-- Processing Options -->
            <div class="card">
                <h2 class="card-title">🤖 AI Processing</h2>
                <div class="flex gap-10" style="flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="Summarizer.generateSummary()">
                        📋 Generate Summary
                    </button>
                    <button class="btn btn-success" onclick="Summarizer.createQuiz()">
                        ❓ Create Quiz
                    </button>
                    <button class="btn btn-warning" onclick="Summarizer.generateMnemonics()">
                        🧠 Memory Tricks
                    </button>
                    <button class="btn btn-outline" onclick="Summarizer.clearInput()">
                        🗑️ Clear
                    </button>
                </div>
            </div>

            <!-- Output Section -->
            <div class="card">
                <h2 class="card-title">📊 Results</h2>
                <div class="output-tabs">
                    <div class="tabs" id="output-tabs"></div>
                    <div id="output-container">
                        <p style="color: var(--text-secondary);">
                            No output yet. Use the processing buttons above to generate content.
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        await this.checkApiStatus();
        this.updateCharCount();
        await this.restoreState();
    },

    async restoreState() {
        try {
            const savedState = await window.ipcRenderer.invoke('get-module-state', 'summarizer');
            if (savedState) {
                // Restore input text
                if (savedState.inputText) {
                    const textarea = document.getElementById('input-text');
                    if (textarea) {
                        textarea.value = savedState.inputText;
                        this.updateCharCount();
                    }
                }
                // Restore outputs
                if (savedState.outputs && savedState.outputs.length > 0) {
                    this.data.outputs = savedState.outputs;
                    this.displayAllOutputs();
                }
            }
        } catch (error) {
            console.error('Error restoring summarizer state:', error);
        }
    },

    saveState() {
        try {
            const textarea = document.getElementById('input-text');
            const state = {
                inputText: textarea?.value || '',
                outputs: this.data.outputs
            };
            window.ipcRenderer.invoke('save-module-state', 'summarizer', state);
        } catch (error) {
            console.error('Error saving summarizer state:', error);
        }
    },

    async checkApiStatus() {
        const settings = await window.ipcRenderer.invoke('get-settings');
        const statusEl = document.getElementById('api-status');
        const statusTextEl = document.getElementById('api-status-text');

        if (settings.apiKey) {
            statusEl.classList.add('connected');
            statusEl.classList.remove('disconnected');
            statusTextEl.textContent = 'API Connected ✓';
        } else {
            statusEl.classList.add('disconnected');
            statusEl.classList.remove('connected');
            statusTextEl.textContent = 'API Not Configured';
        }
    },

    updateCharCount() {
        const textarea = document.getElementById('input-text');
        const counter = document.getElementById('char-counter');
        if (textarea && counter) {
            counter.textContent = `${textarea.value.length} characters`;
        }
    },

    async configureApi() {
        // Use a simple HTML input dialog instead of prompt()
        const dialog = document.createElement('div');
        dialog.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';
        dialog.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%;">
                <h3 style="margin-top: 0;">Configure API Key</h3>
                <p>Enter your Google Gemini API Key:</p>
                <input type="text" id="api-key-input" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 15px;" placeholder="Enter API key...">
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="cancel-api-key-btn" style="padding: 10px 20px; background: #ddd; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
                    <button id="save-api-key-btn" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Save</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
        
        // Cancel button handler
        document.getElementById('cancel-api-key-btn').onclick = () => {
            document.body.removeChild(dialog);
        };
        
        // Save button handler
        document.getElementById('save-api-key-btn').onclick = async () => {
            const apiKey = document.getElementById('api-key-input').value.trim();
            if (apiKey) {
                await window.ipcRenderer.invoke('update-setting', 'apiKey', apiKey);
                showToast('API Key saved successfully!', 'success');
                await this.checkApiStatus();
            }
            document.body.removeChild(dialog);
        };
    },

    clearInput() {
        const textarea = document.getElementById('input-text');
        if (textarea) {
            textarea.value = '';
            this.updateCharCount();
        }
    },

    async generateSummary() {
        const text = document.getElementById('input-text')?.value;
        const language = document.getElementById('language-select')?.value || 'en';

        if (!text || text.trim().length < 50) {
            showToast('Please enter at least 50 characters', 'warning');
            return;
        }

        showLoading('Generating summary...');

        try {
            const settings = await window.ipcRenderer.invoke('get-settings');
            if (!settings.apiKey) {
                throw new Error('API key not configured');
            }

            const client = new GeminiApiClient(settings.apiKey);
            const result = await client.generateSummary(text, language);
            
            this.addOutput('Summary', result, 'summary');
            this.saveState(); // Save state after generating
            showToast('Summary generated successfully!', 'success');
        } catch (error) {
            console.error('Error generating summary:', error);
            showToast('Failed to generate summary: ' + error.message, 'error');
        } finally {
            hideLoading();
        }
    },

    async createQuiz() {
        const text = document.getElementById('input-text')?.value;
        const language = document.getElementById('language-select')?.value || 'en';

        if (!text || text.trim().length < 50) {
            showToast('Please enter at least 50 characters', 'warning');
            return;
        }

        showLoading('Creating quiz...');

        try {
            const settings = await window.ipcRenderer.invoke('get-settings');
            if (!settings.apiKey) {
                throw new Error('API key not configured');
            }

            const client = new GeminiApiClient(settings.apiKey);
            const result = await client.generateQuiz(text, language);
            
            this.addOutput('Quiz Questions', result, 'quiz');
            showToast('Quiz created successfully!', 'success');
        } catch (error) {
            console.error('Error creating quiz:', error);
            showToast('Failed to create quiz: ' + error.message, 'error');
        } finally {
            hideLoading();
        }
    },

    async generateMnemonics() {
        const text = document.getElementById('input-text')?.value;
        const language = document.getElementById('language-select')?.value || 'en';

        if (!text || text.trim().length < 50) {
            showToast('Please enter at least 50 characters', 'warning');
            return;
        }

        showLoading('Generating memory tricks...');

        try {
            const settings = await window.ipcRenderer.invoke('get-settings');
            if (!settings.apiKey) {
                throw new Error('API key not configured');
            }

            const client = new GeminiApiClient(settings.apiKey);
            const result = await client.generateMnemonics(text, language);
            
            this.addOutput('Memory Tricks', result, 'mnemonics');
            showToast('Memory tricks generated!', 'success');
        } catch (error) {
            console.error('Error generating mnemonics:', error);
            showToast('Failed to generate memory tricks: ' + error.message, 'error');
        } finally {
            hideLoading();
        }
    },

    addOutput(title, content, type) {
        this.data.outputs.push({ title, content, type, timestamp: Date.now() });
        this.renderOutputs();
    },

    renderOutputs() {
        const tabsContainer = document.getElementById('output-tabs');
        const contentContainer = document.getElementById('output-container');

        if (this.data.outputs.length === 0) {
            tabsContainer.innerHTML = '';
            contentContainer.innerHTML = '<p style="color: var(--text-secondary);">No output yet.</p>';
            return;
        }

        // Render tabs
        const tabsHtml = this.data.outputs.map((output, index) => `
            <button class="tab-btn ${index === this.data.currentTab ? 'active' : ''}" 
                    onclick="Summarizer.switchTab(${index})">
                ${output.title}
            </button>
        `).join('');
        tabsContainer.innerHTML = tabsHtml;

        // Render current tab content
        const currentOutput = this.data.outputs[this.data.currentTab];
        contentContainer.innerHTML = `
            <div class="output-content">
                <pre style="white-space: pre-wrap; font-family: 'Segoe UI', sans-serif;">${currentOutput.content}</pre>
            </div>
            <div class="output-actions">
                <button class="btn btn-primary" onclick="Summarizer.copyOutput(${this.data.currentTab})">
                    📋 Copy
                </button>
                <button class="btn btn-secondary" onclick="Summarizer.exportPDF(${this.data.currentTab})">
                    📄 Export PDF
                </button>
                <button class="btn btn-outline" onclick="Summarizer.shareOutput(${this.data.currentTab})">
                    🔗 Share
                </button>
            </div>
        `;
    },

    switchTab(index) {
        this.data.currentTab = index;
        this.renderOutputs();
    },

    copyOutput(index) {
        const output = this.data.outputs[index];
        copyToClipboard(output.content);
    },

    async exportPDF(index) {
        const output = this.data.outputs[index];
        showLoading('Exporting to PDF...');
        
        try {
            await window.ipcRenderer.invoke('export-pdf', {
                title: output.title,
                content: output.content
            });
            showToast('Exported to PDF successfully!', 'success');
        } catch (error) {
            showToast('Failed to export PDF: ' + error.message, 'error');
        } finally {
            hideLoading();
        }
    },

    shareOutput(index) {
        const output = this.data.outputs[index];
        copyToClipboard(output.content);
        showToast('Content copied! You can now share it anywhere.', 'success');
    }
};

window.Summarizer = Summarizer;
