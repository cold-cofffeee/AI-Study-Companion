// Main Application Logic
const { ipcRenderer } = require('electron');

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
        
        // Update active navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.module === moduleName) {
                btn.classList.add('active');
            }
        });
        
        // Load module content
        let content = '';
        switch (moduleName) {
            case 'dashboard':
                content = await Dashboard.render();
                break;
            case 'summarizer':
                content = await Summarizer.render();
                break;
            case 'problems':
                content = await ProblemGenerator.render();
                break;
            case 'optimizer':
                content = await StudyOptimizer.render();
                break;
            case 'flashcards':
                content = await Flashcards.render();
                break;
            case 'quiz':
                content = await ReverseQuiz.render();
                break;
            case 'settings':
                content = await Settings.render();
                break;
            case 'about':
                content = await About.render();
                break;
            default:
                content = '<h1>Module not found</h1>';
        }
        
        container.innerHTML = content;
        
        // Initialize module-specific functionality
        switch (moduleName) {
            case 'dashboard':
                await Dashboard.init();
                break;
            case 'summarizer':
                await Summarizer.init();
                break;
            case 'problems':
                await ProblemGenerator.init();
                break;
            case 'optimizer':
                await StudyOptimizer.init();
                break;
            case 'flashcards':
                await Flashcards.init();
                break;
            case 'quiz':
                await ReverseQuiz.init();
                break;
            case 'settings':
                await Settings.init();
                break;
            case 'about':
                await About.init();
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
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
