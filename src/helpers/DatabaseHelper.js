// Database Helper using sql.js (no native dependencies)
const initSqlJs = require('sql.js');
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

class DatabaseHelper {
    constructor() {
        this.db = null;
        const userDataPath = app.getPath('userData');
        this.dbPath = path.join(userDataPath, 'studybuddy.db');
        
        // Ensure directory exists
        if (!fs.existsSync(userDataPath)) {
            fs.mkdirSync(userDataPath, { recursive: true });
        }
    }

    async initialize() {
        const SQL = await initSqlJs();
        
        // Try to load existing database
        if (fs.existsSync(this.dbPath)) {
            const buffer = fs.readFileSync(this.dbPath);
            this.db = new SQL.Database(buffer);
        } else {
            this.db = new SQL.Database();
        }
        
        this.createTables();
        this.seedInitialData();
        this.saveDatabase();
    }

    saveDatabase() {
        if (this.db) {
            const data = this.db.export();
            const buffer = Buffer.from(data);
            fs.writeFileSync(this.dbPath, buffer);
        }
    }

    createTables() {
        // User Settings Table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS user_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                api_key TEXT,
                preferred_language TEXT DEFAULT 'en',
                theme TEXT DEFAULT 'light',
                remember_window_position INTEGER DEFAULT 1,
                window_width INTEGER DEFAULT 1400,
                window_height INTEGER DEFAULT 900,
                start_maximized INTEGER DEFAULT 1,
                last_selected_module TEXT DEFAULT 'dashboard',
                enable_notifications INTEGER DEFAULT 1,
                default_study_session_minutes INTEGER DEFAULT 25,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Study Sessions Table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS study_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                start_time DATETIME NOT NULL,
                end_time DATETIME,
                topic TEXT NOT NULL,
                module_used TEXT NOT NULL,
                duration_minutes INTEGER DEFAULT 0,
                breaks_count INTEGER DEFAULT 0,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Flashcards Table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS flashcards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                category TEXT,
                difficulty_level INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                next_review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                review_count INTEGER DEFAULT 0,
                correct_count INTEGER DEFAULT 0,
                ease_factor REAL DEFAULT 2.5,
                interval INTEGER DEFAULT 1,
                image_path TEXT
            )
        `);

        // Study Outputs Table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS study_outputs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                output_type TEXT NOT NULL,
                language TEXT DEFAULT 'en',
                source_text TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Daily Challenges Table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS daily_challenges (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date DATE NOT NULL,
                challenge_text TEXT NOT NULL,
                completed INTEGER DEFAULT 0,
                completion_time DATETIME
            )
        `);
        
        this.saveDatabase();
    }

    seedInitialData() {
        const result = this.db.exec('SELECT COUNT(*) as count FROM user_settings');
        const count = result[0]?.values[0]?.[0] || 0;
        
        if (count === 0) {
            this.db.run(`
                INSERT INTO user_settings (api_key, theme, last_selected_module)
                VALUES (?, ?, ?)
            `, ['', 'light', 'dashboard']);
            this.saveDatabase();
        }
    }

    // Settings Operations
    getSettings() {
        const result = this.db.exec('SELECT * FROM user_settings WHERE id = 1');
        if (result.length > 0 && result[0].values.length > 0) {
            const columns = result[0].columns;
            const values = result[0].values[0];
            const settings = {};
            columns.forEach((col, idx) => {
                settings[col] = values[idx];
            });
            return settings;
        }
        return {};
    }

    updateSetting(key, value) {
        this.db.run(`UPDATE user_settings SET ${key} = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1`, [value]);
        this.saveDatabase();
    }

    // Study Sessions
    saveStudySession(session) {
        this.db.run(`
            INSERT INTO study_sessions (start_time, end_time, topic, module_used, duration_minutes, breaks_count, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            session.startTime,
            session.endTime,
            session.topic,
            session.moduleUsed,
            session.durationMinutes,
            session.breaksCount,
            session.notes
        ]);
        this.saveDatabase();
        return { success: true };
    }

    getRecentSessions(limit = 10) {
        const result = this.db.exec(`
            SELECT * FROM study_sessions 
            ORDER BY start_time DESC 
            LIMIT ${limit}
        `);
        return this.resultToArray(result);
    }

    // Flashcards Operations
    saveFlashcard(flashcard) {
        this.db.run(`
            INSERT INTO flashcards (question, answer, category, difficulty_level, image_path)
            VALUES (?, ?, ?, ?, ?)
        `, [
            flashcard.question,
            flashcard.answer,
            flashcard.category || '',
            flashcard.difficultyLevel || 1,
            flashcard.imagePath || null
        ]);
        this.saveDatabase();
        return { success: true };
    }

    getDueFlashcards() {
        const result = this.db.exec(`
            SELECT * FROM flashcards 
            WHERE next_review_date <= datetime('now')
            ORDER BY next_review_date ASC
        `);
        return this.resultToArray(result);
    }

    getAllFlashcards() {
        const result = this.db.exec('SELECT * FROM flashcards ORDER BY created_at DESC');
        return this.resultToArray(result);
    }

    updateFlashcard(id, data) {
        this.db.run(`
            UPDATE flashcards 
            SET review_count = ?, correct_count = ?, ease_factor = ?, 
                interval = ?, next_review_date = ?
            WHERE id = ?
        `, [
            data.reviewCount,
            data.correctCount,
            data.easeFactor,
            data.interval,
            data.nextReviewDate,
            id
        ]);
        this.saveDatabase();
        return { success: true };
    }

    deleteFlashcard(id) {
        this.db.run('DELETE FROM flashcards WHERE id = ?', [id]);
        this.saveDatabase();
        return { success: true };
    }

    // Study Outputs
    saveOutput(output) {
        this.db.run(`
            INSERT INTO study_outputs (title, content, output_type, language, source_text)
            VALUES (?, ?, ?, ?, ?)
        `, [
            output.title,
            output.content,
            output.type,
            output.language || 'en',
            output.sourceText || ''
        ]);
        this.saveDatabase();
        return { success: true };
    }

    getRecentOutputs(limit = 20) {
        const result = this.db.exec(`
            SELECT * FROM study_outputs 
            ORDER BY created_at DESC 
            LIMIT ${limit}
        `);
        return this.resultToArray(result);
    }

    // Daily Challenges
    getTodayChallenge() {
        const today = new Date().toISOString().split('T')[0];
        const result = this.db.exec(`
            SELECT * FROM daily_challenges 
            WHERE date = '${today}'
        `);
        return this.resultToArray(result)[0] || null;
    }

    createDailyChallenge(challengeText) {
        const today = new Date().toISOString().split('T')[0];
        this.db.run(`
            INSERT INTO daily_challenges (date, challenge_text, completed)
            VALUES (?, ?, 0)
        `, [today, challengeText]);
        this.saveDatabase();
        return { success: true };
    }

    completeChallenge(id) {
        this.db.run(`
            UPDATE daily_challenges 
            SET completed = 1, completion_time = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [id]);
        this.saveDatabase();
        return { success: true };
    }

    // Generic query
    query(sql, params = []) {
        try {
            if (sql.trim().toUpperCase().startsWith('SELECT')) {
                const result = this.db.exec(sql);
                return this.resultToArray(result);
            } else {
                this.db.run(sql, params);
                this.saveDatabase();
                return { success: true };
            }
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }

    // Helper to convert sql.js result to array of objects
    resultToArray(result) {
        if (!result || result.length === 0) return [];
        
        const columns = result[0].columns;
        const rows = result[0].values;
        
        return rows.map(row => {
            const obj = {};
            columns.forEach((col, idx) => {
                obj[col] = row[idx];
            });
            return obj;
        });
    }

    close() {
        if (this.db) {
            this.saveDatabase();
            this.db.close();
        }
    }
}

module.exports = DatabaseHelper;
