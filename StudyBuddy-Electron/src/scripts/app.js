// Main Application Logic
const { ipcRenderer } = require('electron');

// Export ipcRenderer globally for modules to use
window.ipcRenderer = ipcRenderer;

// Global app state
const AppState = {
    currentModule: 'dashboard',
    settings: {},
    apiKey: '',
    theme: 'light'
};

// Initialize app
async function initializeApp() {
    try {
        showLoading('Initializing...');
        
        // Load settings
        AppState.settings = await ipcRenderer.invoke('get-settings');
        AppState.apiKey = AppState.settings.apiKey || '';
        AppState.theme = AppState.settings.theme || 'light';
        
        // Apply theme
        applyTheme(AppState.theme);
        
        // Load last module or default to dashboard
        const lastModule = AppState.settings.lastSelectedModule || 'dashboard';
        await loadModule(lastModule);
        
        hideLoading();
    } catch (error) {
        console.error('Initialization error:', error);
        showToast('Failed to initialize application', 'error');
        hideLoading();
    }
}

// Theme management
function applyTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
    document.body.classList.add(`theme-${theme}`);
}

// Loading overlay
function showLoading(text = 'Loading...') {
    const overlay = document.getElementById('loading-overlay');
    const loadingText = overlay.querySelector('.loading-text');
    if (loadingText) loadingText.textContent = text;
    overlay.classList.remove('hidden');
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    overlay.classList.add('hidden');
}

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Module loader
async function loadModule(moduleName) {
    const container = document.getElementById('module-container');
    
    try {
        showLoading(`Loading ${moduleName}...`);
        
        // Call cleanup on current module before switching (save state)
        if (AppState.currentModule === 'pomodoro' && typeof PomodoroModule !== 'undefined' && PomodoroModule.cleanup) {
            PomodoroModule.cleanup();
        }
        
        // Update active navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.module === moduleName) {
                btn.classList.add('active');
            }
        });
        
        // Check if module exists before trying to render
        let content = '';
        switch (moduleName) {
            case 'dashboard':
                if (typeof Dashboard !== 'undefined') {
                    content = await Dashboard.render();
                } else {
                    content = '<div class="card"><h2>Loading Dashboard...</h2><p>Please wait...</p></div>';
                }
                break;
            case 'summarizer':
                if (typeof Summarizer !== 'undefined') {
                    content = await Summarizer.render();
                } else {
                    content = '<div class="card"><h2>Loading Summarizer...</h2><p>Please wait...</p></div>';
                }
                break;
            case 'problems':
                if (typeof ProblemGenerator !== 'undefined') {
                    content = await ProblemGenerator.render();
                } else {
                    content = '<div class="card"><h2>Loading Problem Generator...</h2><p>Please wait...</p></div>';
                }
                break;
            case 'pomodoro':
                if (typeof PomodoroModule !== 'undefined') {
                    content = await PomodoroModule.render();
                } else {
                    content = '<div class="card"><h2>Loading Pomodoro...</h2><p>Please wait...</p></div>';
                }
                break;
            case 'optimizer':
                if (typeof StudyOptimizer !== 'undefined') {
                    content = await StudyOptimizer.render();
                } else {
                    content = '<div class="card"><h2>Loading Optimizer...</h2><p>Please wait...</p></div>';
                }
                break;
            case 'flashcards':
                if (typeof Flashcards !== 'undefined') {
                    content = await Flashcards.render();
                } else {
                    content = '<div class="card"><h2>Loading Flashcards...</h2><p>Please wait...</p></div>';
                }
                break;
            case 'quiz':
                if (typeof ReverseQuiz !== 'undefined') {
                    content = await ReverseQuiz.render();
                } else {
                    content = '<div class="card"><h2>Loading Quiz...</h2><p>Please wait...</p></div>';
                }
                break;
            case 'settings':
                if (typeof Settings !== 'undefined') {
                    content = await Settings.render();
                } else {
                    content = '<div class="card"><h2>Loading Settings...</h2><p>Please wait...</p></div>';
                }
                break;
            case 'about':
                if (typeof About !== 'undefined') {
                    content = await About.render();
                } else {
                    content = '<div class="card"><h2>Loading About...</h2><p>Please wait...</p></div>';
                }
                break;
            default:
                content = '<h1>Module not found</h1>';
        }
        
        container.innerHTML = content;
        
        // Initialize module-specific functionality only if module exists
        switch (moduleName) {
            case 'dashboard':
                if (typeof Dashboard !== 'undefined' && Dashboard.init) {
                    await Dashboard.init();
                }
                break;
            case 'summarizer':
                if (typeof Summarizer !== 'undefined' && Summarizer.init) {
                    await Summarizer.init();
                }
                break;
            case 'problems':
                if (typeof ProblemGenerator !== 'undefined' && ProblemGenerator.init) {
                    await ProblemGenerator.init();
                }
                break;
            case 'pomodoro':
                if (typeof PomodoroModule !== 'undefined' && PomodoroModule.init) {
                    await PomodoroModule.init();
                }
                break;
            case 'optimizer':
                if (typeof StudyOptimizer !== 'undefined' && StudyOptimizer.init) {
                    await StudyOptimizer.init();
                }
                break;
            case 'flashcards':
                if (typeof Flashcards !== 'undefined' && Flashcards.init) {
                    await Flashcards.init();
                }
                break;
            case 'quiz':
                if (typeof ReverseQuiz !== 'undefined' && ReverseQuiz.init) {
                    await ReverseQuiz.init();
                }
                break;
            case 'settings':
                if (typeof Settings !== 'undefined' && Settings.init) {
                    await Settings.init();
                }
                break;
            case 'about':
                if (typeof About !== 'undefined' && About.init) {
                    await About.init();
                }
                break;
        }
        
        AppState.currentModule = moduleName;
        
        // Save last module
        await ipcRenderer.invoke('update-setting', 'lastSelectedModule', moduleName);
        
        hideLoading();
    } catch (error) {
        console.error('Error loading module:', error);
        container.innerHTML = `
            <div class="card">
                <h2>Error Loading Module</h2>
                <p>${error.message}</p>
            </div>
        `;
        hideLoading();
    }
}

// Utility functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy to clipboard', 'error');
    });
}

// Navigate to Pomodoro (for floating timer click)
window.navigateToPomodoro = async function() {
    await loadModule('pomodoro');
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    
    // Setup navigation button handlers
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const module = button.dataset.module;
            await loadModule(module);
        });
    });
});

// Export for use in other modules
window.AppState = AppState;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showToast = showToast;
window.loadModule = loadModule;
window.copyToClipboard = copyToClipboard;
window.formatDate = formatDate;
window.formatTime = formatTime;
