using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using StudyBuddy.Models;

namespace StudyBuddy.Data
{
    /// <summary>
    /// Database helper class for SQLite operations
    /// Handles all database interactions for the Study Buddy application
    /// </summary>
    public class DatabaseHelper
    {
        private readonly string _connectionString;
        private readonly string _databasePath;

        public DatabaseHelper()
        {
            // Store database in application data folder
            var appDataPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "StudyBuddy");
            Directory.CreateDirectory(appDataPath);
            
            _databasePath = Path.Combine(appDataPath, "studybuddy.db");
            _connectionString = $"Data Source={_databasePath}";
        }

        /// <summary>
        /// Initialize the database and create tables if they don't exist
        /// </summary>
        public async Task InitializeDatabaseAsync()
        {
            try
            {
                using var connection = new SqliteConnection(_connectionString);
                await connection.OpenAsync();

                // Create tables
                await CreateTablesAsync(connection);
                await SeedInitialDataAsync(connection);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to initialize database: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Create all required tables
        /// </summary>
        private async Task CreateTablesAsync(SqliteConnection connection)
        {
            var createTablesScript = @"
                -- User Settings Table
                CREATE TABLE IF NOT EXISTS UserSettings (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ApiKey TEXT,
                    PreferredLanguage TEXT DEFAULT 'en',
                    Theme INTEGER DEFAULT 0,
                    RememberWindowPosition INTEGER DEFAULT 1,
                    WindowWidth INTEGER DEFAULT 1400,
                    WindowHeight INTEGER DEFAULT 900,
                    StartMaximized INTEGER DEFAULT 1,
                    LastSelectedModule TEXT DEFAULT 'Dashboard',
                    EnableNotifications INTEGER DEFAULT 1,
                    DefaultStudySessionMinutes INTEGER DEFAULT 25,
                    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                );

                -- Study Sessions Table
                CREATE TABLE IF NOT EXISTS StudySessions (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    StartTime DATETIME NOT NULL,
                    EndTime DATETIME,
                    Topic TEXT NOT NULL,
                    ModuleUsed TEXT NOT NULL,
                    DurationMinutes INTEGER DEFAULT 0,
                    BreaksCount INTEGER DEFAULT 0,
                    Notes TEXT,
                    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                );

                -- Flashcards Table
                CREATE TABLE IF NOT EXISTS Flashcards (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Question TEXT NOT NULL,
                    Answer TEXT NOT NULL,
                    Category TEXT,
                    DifficultyLevel INTEGER DEFAULT 1,
                    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    NextReviewDate DATETIME DEFAULT CURRENT_TIMESTAMP,
                    ReviewCount INTEGER DEFAULT 0,
                    CorrectCount INTEGER DEFAULT 0,
                    EaseFactor REAL DEFAULT 2.5,
                    Interval INTEGER DEFAULT 1,
                    ImagePath TEXT
                );

                -- Study Problems Table
                CREATE TABLE IF NOT EXISTS StudyProblems (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Subject TEXT NOT NULL,
                    Difficulty TEXT NOT NULL,
                    Question TEXT NOT NULL,
                    Solution TEXT NOT NULL,
                    Steps TEXT,
                    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    SolveTimeSeconds INTEGER DEFAULT 0,
                    IsCompleted INTEGER DEFAULT 0
                );

                -- Schedule Items Table
                CREATE TABLE IF NOT EXISTS ScheduleItems (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Topic TEXT NOT NULL,
                    StartTime DATETIME NOT NULL,
                    DurationMinutes INTEGER NOT NULL,
                    Type TEXT NOT NULL,
                    Description TEXT,
                    IsCompleted INTEGER DEFAULT 0,
                    Notes TEXT,
                    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                );

                -- Study Outputs Table
                CREATE TABLE IF NOT EXISTS StudyOutputs (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Title TEXT NOT NULL,
                    Content TEXT NOT NULL,
                    Type INTEGER NOT NULL,
                    Language TEXT DEFAULT 'en',
                    SourceText TEXT,
                    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                );

                -- Daily Challenges Table
                CREATE TABLE IF NOT EXISTS DailyChallenges (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Date DATE NOT NULL,
                    Title TEXT NOT NULL,
                    Description TEXT NOT NULL,
                    Category TEXT,
                    Points INTEGER DEFAULT 10,
                    IsCompleted INTEGER DEFAULT 0,
                    CompletedAt DATETIME,
                    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                );

                -- Create indexes for better performance
                CREATE INDEX IF NOT EXISTS idx_flashcards_nextreview ON Flashcards(NextReviewDate);
                CREATE INDEX IF NOT EXISTS idx_sessions_date ON StudySessions(StartTime);
                CREATE INDEX IF NOT EXISTS idx_outputs_type ON StudyOutputs(Type);
                CREATE INDEX IF NOT EXISTS idx_challenges_date ON DailyChallenges(Date);
            ";

            using var command = new SqliteCommand(createTablesScript, connection);
            await command.ExecuteNonQueryAsync();
        }

        /// <summary>
        /// Seed initial data if database is empty
        /// </summary>
        private async Task SeedInitialDataAsync(SqliteConnection connection)
        {
            // Check if we need to seed data
            var countCommand = new SqliteCommand("SELECT COUNT(*) FROM UserSettings", connection);
            var count = Convert.ToInt32(await countCommand.ExecuteScalarAsync());

            if (count == 0)
            {
                // Insert default settings
                var insertSettings = @"
                    INSERT INTO UserSettings (ApiKey, PreferredLanguage, Theme, StartMaximized, LastSelectedModule)
                    VALUES ('', 'en', 0, 1, 'Dashboard')
                ";
                using var command = new SqliteCommand(insertSettings, connection);
                await command.ExecuteNonQueryAsync();

                // Insert sample daily challenge
                var today = DateTime.Today.ToString("yyyy-MM-dd");
                var insertChallenge = @"
                    INSERT INTO DailyChallenges (Date, Title, Description, Category, Points)
                    VALUES (@date, 'Welcome to Study Buddy!', 'Complete your first study session using any module', 'Getting Started', 25)
                ";
                using var challengeCommand = new SqliteCommand(insertChallenge, connection);
                challengeCommand.Parameters.AddWithValue("@date", today);
                await challengeCommand.ExecuteNonQueryAsync();
            }
        }

        #region User Settings Operations

        /// <summary>
        /// Get user settings from database
        /// </summary>
        public async Task<UserSettings> GetUserSettingsAsync()
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            var query = "SELECT * FROM UserSettings ORDER BY Id DESC LIMIT 1";
            using var command = new SqliteCommand(query, connection);
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new UserSettings
                {
                    ApiKey = reader["ApiKey"]?.ToString() ?? "",
                    PreferredLanguage = reader["PreferredLanguage"]?.ToString() ?? "en",
                    Theme = (Theme)Convert.ToInt32(reader["Theme"]),
                    RememberWindowPosition = Convert.ToBoolean(reader["RememberWindowPosition"]),
                    WindowWidth = Convert.ToInt32(reader["WindowWidth"]),
                    WindowHeight = Convert.ToInt32(reader["WindowHeight"]),
                    StartMaximized = Convert.ToBoolean(reader["StartMaximized"]),
                    LastSelectedModule = reader["LastSelectedModule"]?.ToString() ?? "Dashboard",
                    EnableNotifications = Convert.ToBoolean(reader["EnableNotifications"]),
                    DefaultStudySessionMinutes = Convert.ToInt32(reader["DefaultStudySessionMinutes"])
                };
            }

            return new UserSettings(); // Return default if no settings found
        }

        /// <summary>
        /// Save user settings to database
        /// </summary>
        public async Task SaveUserSettingsAsync(UserSettings settings)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            var query = @"
                INSERT OR REPLACE INTO UserSettings 
                (Id, ApiKey, PreferredLanguage, Theme, RememberWindowPosition, WindowWidth, WindowHeight, 
                 StartMaximized, LastSelectedModule, EnableNotifications, DefaultStudySessionMinutes, UpdatedAt)
                VALUES 
                ((SELECT Id FROM UserSettings ORDER BY Id DESC LIMIT 1), @apiKey, @language, @theme, @rememberPos, 
                 @width, @height, @maximized, @module, @notifications, @sessionMinutes, CURRENT_TIMESTAMP)
            ";

            using var command = new SqliteCommand(query, connection);
            command.Parameters.AddWithValue("@apiKey", settings.ApiKey);
            command.Parameters.AddWithValue("@language", settings.PreferredLanguage);
            command.Parameters.AddWithValue("@theme", (int)settings.Theme);
            command.Parameters.AddWithValue("@rememberPos", settings.RememberWindowPosition);
            command.Parameters.AddWithValue("@width", settings.WindowWidth);
            command.Parameters.AddWithValue("@height", settings.WindowHeight);
            command.Parameters.AddWithValue("@maximized", settings.StartMaximized);
            command.Parameters.AddWithValue("@module", settings.LastSelectedModule);
            command.Parameters.AddWithValue("@notifications", settings.EnableNotifications);
            command.Parameters.AddWithValue("@sessionMinutes", settings.DefaultStudySessionMinutes);

            await command.ExecuteNonQueryAsync();
        }

        #endregion

        #region Flashcard Operations

        /// <summary>
        /// Get flashcards due for review
        /// </summary>
        public async Task<List<Flashcard>> GetDueFlashcardsAsync()
        {
            var flashcards = new List<Flashcard>();
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            var query = @"
                SELECT * FROM Flashcards 
                WHERE NextReviewDate <= @today 
                ORDER BY NextReviewDate ASC
            ";

            using var command = new SqliteCommand(query, connection);
            command.Parameters.AddWithValue("@today", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                flashcards.Add(MapFlashcardFromReader(reader));
            }

            return flashcards;
        }

        /// <summary>
        /// Add new flashcard
        /// </summary>
        public async Task<int> AddFlashcardAsync(Flashcard flashcard)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            var query = @"
                INSERT INTO Flashcards (Question, Answer, Category, DifficultyLevel, NextReviewDate, ImagePath)
                VALUES (@question, @answer, @category, @difficulty, @nextReview, @imagePath);
                SELECT last_insert_rowid();
            ";

            using var command = new SqliteCommand(query, connection);
            command.Parameters.AddWithValue("@question", flashcard.Question);
            command.Parameters.AddWithValue("@answer", flashcard.Answer);
            command.Parameters.AddWithValue("@category", flashcard.Category);
            command.Parameters.AddWithValue("@difficulty", flashcard.DifficultyLevel);
            command.Parameters.AddWithValue("@nextReview", flashcard.NextReviewDate.ToString("yyyy-MM-dd HH:mm:ss"));
            command.Parameters.AddWithValue("@imagePath", flashcard.ImagePath);

            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        /// <summary>
        /// Update flashcard after review (SM-2 algorithm)
        /// </summary>
        public async Task UpdateFlashcardAfterReviewAsync(Flashcard flashcard, bool wasCorrect)
        {
            // Update review statistics
            flashcard.ReviewCount++;
            if (wasCorrect) flashcard.CorrectCount++;

            // SM-2 Algorithm implementation
            if (wasCorrect)
            {
                if (flashcard.ReviewCount == 1)
                {
                    flashcard.Interval = 1;
                }
                else if (flashcard.ReviewCount == 2)
                {
                    flashcard.Interval = 6;
                }
                else
                {
                    flashcard.Interval = (int)(flashcard.Interval * flashcard.EaseFactor);
                }

                flashcard.EaseFactor = Math.Max(1.3, flashcard.EaseFactor + (0.1 - (5 - 4) * (0.08 + (5 - 4) * 0.02)));
            }
            else
            {
                flashcard.Interval = 1;
                flashcard.EaseFactor = Math.Max(1.3, flashcard.EaseFactor - 0.2);
            }

            flashcard.NextReviewDate = DateTime.Now.AddDays(flashcard.Interval);

            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            var query = @"
                UPDATE Flashcards 
                SET ReviewCount = @reviewCount, CorrectCount = @correctCount, 
                    EaseFactor = @easeFactor, Interval = @interval, NextReviewDate = @nextReview
                WHERE Id = @id
            ";

            using var command = new SqliteCommand(query, connection);
            command.Parameters.AddWithValue("@reviewCount", flashcard.ReviewCount);
            command.Parameters.AddWithValue("@correctCount", flashcard.CorrectCount);
            command.Parameters.AddWithValue("@easeFactor", flashcard.EaseFactor);
            command.Parameters.AddWithValue("@interval", flashcard.Interval);
            command.Parameters.AddWithValue("@nextReview", flashcard.NextReviewDate.ToString("yyyy-MM-dd HH:mm:ss"));
            command.Parameters.AddWithValue("@id", flashcard.Id);

            await command.ExecuteNonQueryAsync();
        }

        #endregion

        #region Study Session Operations

        /// <summary>
        /// Start a new study session
        /// </summary>
        public async Task<int> StartStudySessionAsync(string topic, string moduleUsed)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            var query = @"
                INSERT INTO StudySessions (StartTime, Topic, ModuleUsed)
                VALUES (@startTime, @topic, @module);
                SELECT last_insert_rowid();
            ";

            using var command = new SqliteCommand(query, connection);
            command.Parameters.AddWithValue("@startTime", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            command.Parameters.AddWithValue("@topic", topic);
            command.Parameters.AddWithValue("@module", moduleUsed);

            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        /// <summary>
        /// End a study session
        /// </summary>
        public async Task EndStudySessionAsync(int sessionId, string notes = "")
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            var query = @"
                UPDATE StudySessions 
                SET EndTime = @endTime, Notes = @notes,
                    DurationMinutes = CAST((julianday(@endTime) - julianday(StartTime)) * 24 * 60 AS INTEGER)
                WHERE Id = @id
            ";

            using var command = new SqliteCommand(query, connection);
            command.Parameters.AddWithValue("@endTime", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            command.Parameters.AddWithValue("@notes", notes);
            command.Parameters.AddWithValue("@id", sessionId);

            await command.ExecuteNonQueryAsync();
        }

        /// <summary>
        /// Get recent study sessions for dashboard
        /// </summary>
        public async Task<List<StudySession>> GetRecentStudySessionsAsync(int limit = 10)
        {
            var sessions = new List<StudySession>();
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            var query = @"
                SELECT * FROM StudySessions 
                WHERE EndTime IS NOT NULL
                ORDER BY StartTime DESC 
                LIMIT @limit
            ";

            using var command = new SqliteCommand(query, connection);
            command.Parameters.AddWithValue("@limit", limit);
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                sessions.Add(MapStudySessionFromReader(reader));
            }

            return sessions;
        }

        #endregion

        #region Helper Methods

        /// <summary>
        /// Map database reader to Flashcard object
        /// </summary>
        private Flashcard MapFlashcardFromReader(SqliteDataReader reader)
        {
            return new Flashcard
            {
                Id = Convert.ToInt32(reader["Id"]),
                Question = reader["Question"]?.ToString() ?? "",
                Answer = reader["Answer"]?.ToString() ?? "",
                Category = reader["Category"]?.ToString() ?? "",
                DifficultyLevel = Convert.ToInt32(reader["DifficultyLevel"]),
                CreatedAt = DateTime.Parse(reader["CreatedAt"]?.ToString() ?? DateTime.Now.ToString()),
                NextReviewDate = DateTime.Parse(reader["NextReviewDate"]?.ToString() ?? DateTime.Now.ToString()),
                ReviewCount = Convert.ToInt32(reader["ReviewCount"]),
                CorrectCount = Convert.ToInt32(reader["CorrectCount"]),
                EaseFactor = Convert.ToDouble(reader["EaseFactor"]),
                Interval = Convert.ToInt32(reader["Interval"]),
                ImagePath = reader["ImagePath"]?.ToString() ?? ""
            };
        }

        /// <summary>
        /// Map database reader to StudySession object
        /// </summary>
        private StudySession MapStudySessionFromReader(SqliteDataReader reader)
        {
            return new StudySession
            {
                Id = Convert.ToInt32(reader["Id"]),
                StartTime = DateTime.Parse(reader["StartTime"]?.ToString() ?? DateTime.Now.ToString()),
                EndTime = reader["EndTime"] != DBNull.Value ? DateTime.Parse(reader["EndTime"]?.ToString() ?? "") : null,
                Topic = reader["Topic"]?.ToString() ?? "",
                ModuleUsed = reader["ModuleUsed"]?.ToString() ?? "",
                DurationMinutes = Convert.ToInt32(reader["DurationMinutes"]),
                BreaksCount = Convert.ToInt32(reader["BreaksCount"]),
                Notes = reader["Notes"]?.ToString() ?? ""
            };
        }

        #endregion

        /// <summary>
        /// Get database file path for backup purposes
        /// </summary>
        public string GetDatabasePath() => _databasePath;

        /// <summary>
        /// Test database connection
        /// </summary>
        public async Task<bool> TestConnectionAsync()
        {
            try
            {
                using var connection = new SqliteConnection(_connectionString);
                await connection.OpenAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}