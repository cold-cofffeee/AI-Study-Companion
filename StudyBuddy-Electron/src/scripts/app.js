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
    
    // Initialize sidebar repositioning
    initializeSidebarPositioning();
    
    // Listen for window minimize/restore events for floating timer
    ipcRenderer.on('window-minimized', (event, isMinimized) => {
        const floatingTimer = document.getElementById('floating-timer');
        if (floatingTimer && typeof PomodoroModule !== 'undefined') {
            // Show floating timer if timer is running and window is minimized
            if (isMinimized && (PomodoroModule.data.isRunning || PomodoroModule.data.isPaused)) {
                floatingTimer.classList.remove('hidden');
            } else if (!isMinimized && AppState.currentModule === 'pomodoro') {
                // Hide when restored and on pomodoro page
                floatingTimer.classList.add('hidden');
            }
        }
    });
});

// Sidebar Repositioning Feature
function initializeSidebarPositioning() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    
    // Load saved position
    const savedPosition = localStorage.getItem('sidebarPosition') || 'left';
    applySidebarPosition(savedPosition);
    
    // Create position menu
    const menu = document.createElement('div');
    menu.className = 'sidebar-position-menu';
    menu.id = 'sidebar-position-menu';
    menu.innerHTML = `
        <button class="sidebar-position-btn" data-position="left">
            <i class="fas fa-arrow-left"></i> Left Side
        </button>
        <button class="sidebar-position-btn" data-position="right">
            <i class="fas fa-arrow-right"></i> Right Side
        </button>
    `;
    document.body.appendChild(menu);
    
    // Add click handlers for position buttons
    menu.querySelectorAll('.sidebar-position-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const position = e.currentTarget.dataset.position;
            applySidebarPosition(position);
            localStorage.setItem('sidebarPosition', position);
            menu.classList.remove('active');
            showToast(`Sidebar moved to ${position} side! 📍`, 'success');
        });
    });
    
    // Handle drag to show menu
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    
    sidebar.addEventListener('mousedown', (e) => {
        // Check if click is near the right edge (drag handle area)
        const rect = sidebar.getBoundingClientRect();
        const isNearEdge = sidebar.classList.contains('position-right') 
            ? (e.clientX - rect.left) < 30 
            : (rect.right - e.clientX) < 30;
        
        if (isNearEdge) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            e.preventDefault();
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = Math.abs(e.clientX - startX);
            const deltaY = Math.abs(e.clientY - startY);
            
            // Show menu if dragged enough
            if (deltaX > 20 || deltaY > 20) {
                menu.classList.add('active');
                menu.style.left = e.clientX + 'px';
                menu.style.top = e.clientY + 'px';
            }
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            // Hide menu after a delay
            setTimeout(() => {
                if (!menu.matches(':hover')) {
                    menu.classList.remove('active');
                }
            }, 3000);
        }
    });
    
    // Hide menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !sidebar.contains(e.target)) {
            menu.classList.remove('active');
        }
    });
}

function applySidebarPosition(position) {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (!sidebar || !mainContent) return;
    
    // Remove all position classes
    sidebar.classList.remove('position-left', 'position-right');
    
    // Apply new position
    sidebar.classList.add(`position-${position}`);
    
    // Reorder in flex layout
    if (position === 'left') {
        sidebar.style.order = '0';
        mainContent.style.order = '1';
    } else if (position === 'right') {
        sidebar.style.order = '2';
        mainContent.style.order = '1';
    }
}

// Export for use in other modules
window.AppState = AppState;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showToast = showToast;
window.loadModule = loadModule;
window.copyToClipboard = copyToClipboard;
window.formatDate = formatDate;
window.formatTime = formatTime;
