// JSON Data Store - Single file storage for all app data
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class JsonDataStore {
    constructor() {
        this.dataPath = path.join(app.getPath('userData'), 'study-buddy-data.json');
        this.data = {
            sessions: [],
            flashcards: [],
            aiResponses: [],
            schedules: [],
            activities: [],
            errors: [],
            settings: {},
            moduleStates: {}
        };
        this.initialize();
    }

    initialize() {
        try {
            if (fs.existsSync(this.dataPath)) {
                const fileData = fs.readFileSync(this.dataPath, 'utf8');
                this.data = JSON.parse(fileData);
                console.log('Data loaded from:', this.dataPath);
            } else {
                this.save();
                console.log('New data file created:', this.dataPath);
            }
        } catch (error) {
            console.error('Error initializing data store:', error);
            this.save();
        }
    }

    save() {
        try {
            fs.writeFileSync(this.dataPath, JSON.stringify(this.data, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    // Activity logging
    logActivity(moduleName, action, details = {}) {
        this.data.activities.push({
            timestamp: new Date().toISOString(),
            module: moduleName,
            action: action,
            details: details
        });
        this.save();
    }

    // Error logging
    logError(moduleName, error, context = {}) {
        this.data.errors.push({
            timestamp: new Date().toISOString(),
            module: moduleName,
            error: error.message || error,
            stack: error.stack,
            context: context
        });
        this.save();
    }

    // AI Response caching
    saveAIResponse(module, prompt, response, metadata = {}) {
        this.data.aiResponses.push({
            timestamp: new Date().toISOString(),
            module: module,
            prompt: prompt,
            response: response,
            metadata: metadata
        });
        this.save();
        return this.data.aiResponses[this.data.aiResponses.length - 1];
    }

    getAIResponses(module = null, limit = 50) {
        let responses = this.data.aiResponses;
        if (module) {
            responses = responses.filter(r => r.module === module);
        }
        return responses.slice(-limit);
    }

    // Session management
    saveSession(sessionData) {
        const session = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...sessionData
        };
        this.data.sessions.push(session);
        this.save();
        return session;
    }

    getSessions(limit = 20) {
        return this.data.sessions.slice(-limit);
    }

    // Flashcard management
    saveFlashcard(cardData) {
        const card = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...cardData
        };
        this.data.flashcards.push(card);
        this.save();
        return card;
    }

    getFlashcards() {
        return this.data.flashcards;
    }

    updateFlashcard(id, updates) {
        const index = this.data.flashcards.findIndex(c => c.id == id);
        if (index !== -1) {
            this.data.flashcards[index] = {
                ...this.data.flashcards[index],
                ...updates,
                lastModified: new Date().toISOString()
            };
            this.save();
            return this.data.flashcards[index];
        }
        return null;
    }

    deleteFlashcard(id) {
        const index = this.data.flashcards.findIndex(c => c.id == id);
        if (index !== -1) {
            this.data.flashcards.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }

    // Schedule management
    saveSchedule(scheduleData) {
        const schedule = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...scheduleData
        };
        this.data.schedules.push(schedule);
        this.save();
        return schedule;
    }

    getSchedules(limit = 10) {
        return this.data.schedules.slice(-limit);
    }

    getLatestSchedule() {
        return this.data.schedules[this.data.schedules.length - 1] || null;
    }

    // Module state persistence (to keep data when switching pages)
    saveModuleState(moduleName, state) {
        this.data.moduleStates[moduleName] = {
            timestamp: new Date().toISOString(),
            state: state
        };
        this.save();
    }

    getModuleState(moduleName) {
        return this.data.moduleStates[moduleName]?.state || null;
    }

    // Settings
    saveSetting(key, value) {
        this.data.settings[key] = value;
        this.save();
    }

    getSettings() {
        return this.data.settings;
    }

    getSetting(key) {
        return this.data.settings[key];
    }

    // Get all data
    getAllData() {
        return this.data;
    }

    // Export data
    exportData() {
        return JSON.stringify(this.data, null, 2);
    }

    // Clear specific data
    clearSessions() {
        this.data.sessions = [];
        this.save();
    }

    clearFlashcards() {
        this.data.flashcards = [];
        this.save();
    }

    clearAIResponses() {
        this.data.aiResponses = [];
        this.save();
    }

    // Get statistics
    getStats() {
        return {
            totalSessions: this.data.sessions.length,
            totalFlashcards: this.data.flashcards.length,
            totalAIResponses: this.data.aiResponses.length,
            totalSchedules: this.data.schedules.length,
            totalActivities: this.data.activities.length,
            totalErrors: this.data.errors.length,
            lastActivity: this.data.activities[this.data.activities.length - 1]?.timestamp || null,
            dataFileSize: this.getFileSize()
        };
    }

    getFileSize() {
        try {
            const stats = fs.statSync(this.dataPath);
            return `${(stats.size / 1024).toFixed(2)} KB`;
        } catch (error) {
            return 'Unknown';
        }
    }
}

module.exports = JsonDataStore;
