// Settings Module
// ipcRenderer is available globally via window.ipcRenderer from app.js

const Settings = {
    data: {
        settings: {}
    },

    async render() {
        return `
            <div class="module-header">
                <h1 class="module-title">⚙️ Settings & Preferences</h1>
                <p class="module-description">Configure your Study Buddy experience</p>
            </div>

            <!-- API Configuration -->
            <div class="card">
                <div class="settings-section">
                    <h3 class="settings-section-title">🔑 API Configuration</h3>
                    <div class="input-group">
                        <label class="input-label">Google Gemini API Key:</label>
                        <input type="password" id="setting-api-key" class="input-field" 
                               placeholder="Enter your API key...">
                        <p class="settings-description">
                            Get your free API key from 
                            <a href="https://aistudio.google.com/app/apikey" 
                               style="color: var(--primary-color);">Google AI Studio</a>
                        </p>
                    </div>
                    <div class="flex gap-10">
                        <button class="btn btn-primary" onclick="Settings.testApiKey()">
                            🧪 Test Connection
                        </button>
                        <button class="btn btn-success" onclick="Settings.saveApiKey()">
                            💾 Save API Key
                        </button>
                    </div>
                    <div id="api-test-result" class="mt-10"></div>
                </div>
            </div>

            <!-- Appearance -->
            <div class="card">
                <div class="settings-section">
                    <h3 class="settings-section-title">🎨 Appearance</h3>
                    <div class="settings-row">
                        <div>
                            <div class="settings-label">Theme</div>
                            <div class="settings-description">Choose your preferred color theme</div>
                        </div>
                        <select id="setting-theme" class="select-field" style="width: 150px;" onchange="Settings.changeTheme()">
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="auto">Auto</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Language -->
            <div class="card">
                <div class="settings-section">
                    <h3 class="settings-section-title">🌍 Language</h3>
                    <div class="settings-row">
                        <div>
                            <div class="settings-label">Preferred Language</div>
                            <div class="settings-description">Default language for AI responses</div>
                        </div>
                        <select id="setting-language" class="select-field" style="width: 150px;">
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="it">Italian</option>
                            <option value="pt">Portuguese</option>
                            <option value="ru">Russian</option>
                            <option value="ja">Japanese</option>
                            <option value="ko">Korean</option>
                            <option value="zh">Chinese</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Study Settings -->
            <div class="card">
                <div class="settings-section">
                    <h3 class="settings-section-title">📚 Study Settings</h3>
                    <div class="settings-row">
                        <div>
                            <div class="settings-label">Default Study Session (minutes)</div>
                            <div class="settings-description">Pomodoro session length</div>
                        </div>
                        <input type="number" id="setting-session-minutes" class="input-field" 
                               style="width: 100px;" min="15" max="60" value="25">
                    </div>
                    <div class="settings-row">
                        <div>
                            <div class="settings-label">Default Break (minutes)</div>
                            <div class="settings-description">Break time between sessions</div>
                        </div>
                        <input type="number" id="setting-break-minutes" class="input-field" 
                               style="width: 100px;" min="3" max="15" value="5">
                    </div>
                    <div class="settings-row">
                        <div>
                            <div class="settings-label">Enable Notifications</div>
                            <div class="settings-description">Get reminders for breaks and sessions</div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="setting-notifications" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Application Settings -->
            <div class="card">
                <div class="settings-section">
                    <h3 class="settings-section-title">🖥️ Application</h3>
                    <div class="settings-row">
                        <div>
                            <div class="settings-label">Remember Window Position</div>
                            <div class="settings-description">Save window size and position</div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="setting-remember-position" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="settings-row">
                        <div>
                            <div class="settings-label">Start Maximized</div>
                            <div class="settings-description">Launch app in maximized window</div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="setting-start-maximized" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="card">
                <div class="flex gap-10">
                    <button class="btn btn-primary" onclick="Settings.saveAll()">
                        💾 Save All Settings
                    </button>
                    <button class="btn btn-outline" onclick="Settings.resetToDefaults()">
                        🔄 Reset to Defaults
                    </button>
                </div>
            </div>
        `;
    },

    async init() {
        await this.loadSettings();
    },

    async loadSettings() {
        try {
            this.data.settings = await window.ipcRenderer.invoke('get-settings');
            
            // Populate fields
            document.getElementById('setting-api-key').value = this.data.settings.apiKey || '';
            document.getElementById('setting-theme').value = this.data.settings.theme || 'light';
            document.getElementById('setting-language').value = this.data.settings.preferredLanguage || 'en';
            document.getElementById('setting-session-minutes').value = this.data.settings.defaultStudySessionMinutes || 25;
            document.getElementById('setting-break-minutes').value = this.data.settings.defaultBreakMinutes || 5;
            document.getElementById('setting-notifications').checked = this.data.settings.enableNotifications !== false;
            document.getElementById('setting-remember-position').checked = this.data.settings.rememberWindowPosition !== false;
            document.getElementById('setting-start-maximized').checked = this.data.settings.startMaximized !== false;
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    },

    async saveApiKey() {
        const apiKey = document.getElementById('setting-api-key')?.value;
        
        if (!apiKey || apiKey.trim() === '') {
            showToast('Please enter an API key', 'warning');
            return;
        }

        try {
            await window.ipcRenderer.invoke('update-setting', 'apiKey', apiKey);
            showToast('API Key saved successfully! ✓', 'success');
        } catch (error) {
            showToast('Failed to save API key', 'error');
        }
    },

    async testApiKey() {
        const apiKey = document.getElementById('setting-api-key')?.value;
        const resultDiv = document.getElementById('api-test-result');
        
        if (!apiKey || apiKey.trim() === '') {
            showToast('Please enter an API key first', 'warning');
            return;
        }

        showLoading('Testing API connection...');
        
        try {
            const GeminiApiClient = require('../../helpers/GeminiApiClient');
            const client = new GeminiApiClient(apiKey);
            const isConnected = await client.testConnection();
            
            if (isConnected) {
                resultDiv.innerHTML = '<div style="color: var(--success-color); padding: 10px; background: rgba(76, 175, 80, 0.1); border-radius: 6px;">✓ API connection successful!</div>';
                showToast('API connection successful! ✓', 'success');
            } else {
                resultDiv.innerHTML = '<div style="color: var(--error-color); padding: 10px; background: rgba(244, 67, 54, 0.1); border-radius: 6px;">✗ API connection failed</div>';
                showToast('API connection failed', 'error');
            }
        } catch (error) {
            resultDiv.innerHTML = `<div style="color: var(--error-color); padding: 10px; background: rgba(244, 67, 54, 0.1); border-radius: 6px;">✗ Error: ${error.message}</div>`;
            showToast('API test failed: ' + error.message, 'error');
        } finally {
            hideLoading();
        }
    },

    changeTheme() {
        const theme = document.getElementById('setting-theme')?.value;
        if (theme) {
            document.body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
            document.body.classList.add(`theme-${theme}`);
        }
    },

    async saveAll() {
        try {
            const settings = {
                apiKey: document.getElementById('setting-api-key')?.value || '',
                theme: document.getElementById('setting-theme')?.value || 'light',
                preferredLanguage: document.getElementById('setting-language')?.value || 'en',
                defaultStudySessionMinutes: parseInt(document.getElementById('setting-session-minutes')?.value) || 25,
                defaultBreakMinutes: parseInt(document.getElementById('setting-break-minutes')?.value) || 5,
                enableNotifications: document.getElementById('setting-notifications')?.checked !== false,
                rememberWindowPosition: document.getElementById('setting-remember-position')?.checked !== false,
                startMaximized: document.getElementById('setting-start-maximized')?.checked !== false
            };

            await window.ipcRenderer.invoke('save-settings', settings);
            showToast('All settings saved successfully! ✓', 'success');
            
            // Apply theme
            this.changeTheme();
        } catch (error) {
            console.error('Error saving settings:', error);
            showToast('Failed to save settings', 'error');
        }
    },

    async resetToDefaults() {
        if (confirm('Are you sure you want to reset all settings to defaults? This will not delete your API key.')) {
            try {
                const apiKey = this.data.settings.apiKey; // Preserve API key
                
                const defaults = {
                    apiKey: apiKey,
                    theme: 'light',
                    preferredLanguage: 'en',
                    defaultStudySessionMinutes: 25,
                    defaultBreakMinutes: 5,
                    enableNotifications: true,
                    rememberWindowPosition: true,
                    startMaximized: true
                };

                await window.ipcRenderer.invoke('save-settings', defaults);
                await this.loadSettings();
                this.changeTheme();
                
                showToast('Settings reset to defaults', 'success');
            } catch (error) {
                showToast('Failed to reset settings', 'error');
            }
        }
    }
};

window.Settings = Settings;
