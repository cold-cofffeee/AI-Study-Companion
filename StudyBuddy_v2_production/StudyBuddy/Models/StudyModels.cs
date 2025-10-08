using System;
using System.Collections.Generic;

namespace StudyBuddy.Models
{
    /// <summary>
    /// Represents different types of study content outputs
    /// </summary>
    public enum OutputType
    {
        Summary,
        Quiz,
        Mnemonics,
        Problems,
        Schedule,
        Flashcard
    }

    /// <summary>
    /// Model for study output content with metadata
    /// </summary>
    public class StudyOutput
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public OutputType Type { get; set; }
        public string Language { get; set; } = "en";
        public string SourceText { get; set; } = string.Empty;
    }

    /// <summary>
    /// Language option for AI responses
    /// </summary>
    public class LanguageOption
    {
        public string Code { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string NativeName { get; set; } = string.Empty;

        public override string ToString()
        {
            return $"{DisplayName} ({NativeName})";
        }
    }

    /// <summary>
    /// Application theme settings
    /// </summary>
    public enum Theme
    {
        Light,
        Dark,
        Auto
    }

    /// <summary>
    /// Export format options
    /// </summary>
    public enum ExportFormat
    {
        PDF,
        PNG,
        Text,
        Word
    }

    /// <summary>
    /// User preferences and settings
    /// </summary>
    public class UserSettings
    {
        // API Settings
        public string ApiKey { get; set; } = string.Empty;
        
        // Language Settings
        public string PreferredLanguage { get; set; } = "en";
        public string DefaultLanguage { get; set; } = "en";
        
        // Theme Settings
        public Theme Theme { get; set; } = Theme.Light;
        
        // Window Settings
        public bool RememberWindowPosition { get; set; } = true;
        public int WindowWidth { get; set; } = 1400;
        public int WindowHeight { get; set; } = 900;
        public bool StartMaximized { get; set; } = true;
        public bool MinimizeToTray { get; set; } = false;
        
        // Application Settings
        public string LastSelectedModule { get; set; } = "Dashboard";
        public bool EnableNotifications { get; set; } = true;
        
        // Study Settings
        public int DefaultStudySessionMinutes { get; set; } = 25;
        public int DefaultBreakMinutes { get; set; } = 5;
        public bool AutoSaveEnabled { get; set; } = true;
        public int AutoSaveIntervalMinutes { get; set; } = 5;
        
        // Export Settings
        public string DefaultExportPath { get; set; } = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
        public ExportFormat DefaultExportFormat { get; set; } = ExportFormat.PDF;
        
        // Performance Settings
        public bool EnableAnimations { get; set; } = true;
        public bool PreloadContent { get; set; } = true;
        public int CacheSizeMB { get; set; } = 50;
    }

    /// <summary>
    /// Study session tracking
    /// </summary>
    public class StudySession
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string Topic { get; set; } = string.Empty;
        public string ModuleUsed { get; set; } = string.Empty;
        public int DurationMinutes { get; set; }
        public int BreaksCount { get; set; }
        public string Notes { get; set; } = string.Empty;
    }

    /// <summary>
    /// Flashcard for spaced repetition system
    /// </summary>
    public class Flashcard
    {
        public int Id { get; set; }
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int DifficultyLevel { get; set; } = 1; // 1-5
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime NextReviewDate { get; set; } = DateTime.Now;
        public int ReviewCount { get; set; } = 0;
        public int CorrectCount { get; set; } = 0;
        public double EaseFactor { get; set; } = 2.5; // SM-2 algorithm
        public int Interval { get; set; } = 1; // Days until next review
        public string ImagePath { get; set; } = string.Empty;
    }

    /// <summary>
    /// Problem for random generation
    /// </summary>
    public class StudyProblem
    {
        public int Id { get; set; }
        public string Subject { get; set; } = string.Empty; // Math, Physics, Chemistry
        public string Difficulty { get; set; } = string.Empty; // Easy, Medium, Hard
        public string Question { get; set; } = string.Empty;
        public string Solution { get; set; } = string.Empty;
        public string Steps { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int SolveTimeSeconds { get; set; } = 0;
        public bool IsCompleted { get; set; } = false;
    }

    /// <summary>
    /// Study schedule item for time optimizer
    /// </summary>
    public class ScheduleItem
    {
        public int Id { get; set; }
        public string Topic { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public int DurationMinutes { get; set; }
        public string Type { get; set; } = string.Empty; // Study, Break, Quiz
        public string Description { get; set; } = string.Empty;
        public bool IsCompleted { get; set; } = false;
        public string Notes { get; set; } = string.Empty;
    }

    /// <summary>
    /// Navigation module information
    /// </summary>
    public class NavigationModule
    {
        public string Name { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsEnabled { get; set; } = true;
        public int Order { get; set; } = 0;
    }

    /// <summary>
    /// Daily challenge for dashboard
    /// </summary>
    public class DailyChallenge
    {
        public int Id { get; set; }
        public DateTime Date { get; set; } = DateTime.Today;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int Points { get; set; } = 10;
        public bool IsCompleted { get; set; } = false;
        public DateTime? CompletedAt { get; set; }
    }

    /// <summary>
    /// Navigation item for sidebar
    /// </summary>
    public class NavigationItem
    {
        public string Name { get; set; } = string.Empty;
        public System.Windows.Forms.UserControl Control { get; set; }
    }
}