// Settings Handler
const Store = require('electron-store');

class SettingsHandler {
    constructor() {
        this.store = new Store({
            name: 'settings',
            defaults: {
                apiKey: '',
                preferredLanguage: 'en',
                theme: 'light',
                rememberWindowPosition: true,
                windowWidth: 1400,
                windowHeight: 900,
                startMaximized: true,
                lastSelectedModule: 'dashboard',
                enableNotifications: true,
                defaultStudySessionMinutes: 25,
                defaultBreakMinutes: 5
            }
        });
    }

    getSettings() {
        return this.store.store;
    }

    getSetting(key) {
        return this.store.get(key);
    }

    saveSettings(settings) {
        Object.keys(settings).forEach(key => {
            this.store.set(key, settings[key]);
        });
    }

    updateSetting(key, value) {
        this.store.set(key, value);
    }

    resetSettings() {
        this.store.clear();
    }

    exportSettings() {
        return JSON.stringify(this.store.store, null, 2);
    }

    importSettings(jsonString) {
        try {
            const settings = JSON.parse(jsonString);
            this.saveSettings(settings);
            return true;
        } catch (error) {
            console.error('Error importing settings:', error);
            return false;
        }
    }
}

module.exports = SettingsHandler;
