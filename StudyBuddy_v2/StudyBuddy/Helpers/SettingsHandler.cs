using System;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;
using StudyBuddy.Models;

namespace StudyBuddy.Helpers
{
    /// <summary>
    /// Enhanced settings handler with database integration
    /// Handles user preferences, API keys, and application settings
    /// </summary>
    public class SettingsHandler
    {
        private readonly string _settingsPath;
        private UserSettings _currentSettings;

        public SettingsHandler()
        {
            var appDataPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "StudyBuddy");
            Directory.CreateDirectory(appDataPath);
            _settingsPath = Path.Combine(appDataPath, "settings.json");
            _currentSettings = new UserSettings();
        }

        /// <summary>
        /// Load settings from file and database
        /// </summary>
        /// <returns>User settings object</returns>
        public async Task<UserSettings> LoadSettingsAsync()
        {
            try
            {
                // Try to load from database first (preferred method)
                var dbHelper = new StudyBuddy.Data.DatabaseHelper();
                await dbHelper.InitializeDatabaseAsync();
                
                var dbSettings = await dbHelper.GetUserSettingsAsync();
                if (!string.IsNullOrEmpty(dbSettings.ApiKey) || dbSettings.PreferredLanguage != "en")
                {
                    _currentSettings = dbSettings;
                    return _currentSettings;
                }

                // Fallback to JSON file if database is empty
                if (File.Exists(_settingsPath))
                {
                    var json = await File.ReadAllTextAsync(_settingsPath);
                    var fileSettings = JsonConvert.DeserializeObject<UserSettings>(json);
                    if (fileSettings != null)
                    {
                        _currentSettings = fileSettings;
                        
                        // Migrate to database
                        await dbHelper.SaveUserSettingsAsync(_currentSettings);
                    }
                }
            }
            catch (Exception ex)
            {
                // Log error but continue with default settings
                System.Diagnostics.Debug.WriteLine($"Error loading settings: {ex.Message}");
            }

            return _currentSettings;
        }

        /// <summary>
        /// Save settings to both database and file
        /// </summary>
        /// <param name="settings">Settings to save</param>
        public async Task SaveSettingsAsync(UserSettings settings)
        {
            try
            {
                _currentSettings = settings;

                // Save to database (primary storage)
                var dbHelper = new StudyBuddy.Data.DatabaseHelper();
                await dbHelper.SaveUserSettingsAsync(settings);

                // Also save to JSON file as backup
                var json = JsonConvert.SerializeObject(settings, Formatting.Indented);
                await File.WriteAllTextAsync(_settingsPath, json);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to save settings: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get current settings without reloading
        /// </summary>
        /// <returns>Current settings</returns>
        public UserSettings GetCurrentSettings()
        {
            return _currentSettings ?? new UserSettings();
        }

        /// <summary>
        /// Update specific setting
        /// </summary>
        /// <param name="action">Action to modify settings</param>
        public async Task UpdateSettingAsync(Action<UserSettings> action)
        {
            action(_currentSettings);
            await SaveSettingsAsync(_currentSettings);
        }

        /// <summary>
        /// Test API key validity
        /// </summary>
        /// <param name="apiKey">API key to test</param>
        /// <returns>True if valid</returns>
        public async Task<bool> TestApiKeyAsync(string apiKey)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(apiKey))
                    return false;

                using var apiClient = new GeminiApiClient(apiKey);
                return await apiClient.TestApiKeyAsync();
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Get available languages for the application
        /// </summary>
        /// <returns>List of language options</returns>
        public LanguageOption[] GetAvailableLanguages()
        {
            return new[]
            {
                new LanguageOption { Code = "en", DisplayName = "English", NativeName = "English" },
                new LanguageOption { Code = "es", DisplayName = "Spanish", NativeName = "Español" },
                new LanguageOption { Code = "fr", DisplayName = "French", NativeName = "Français" },
                new LanguageOption { Code = "de", DisplayName = "German", NativeName = "Deutsch" },
                new LanguageOption { Code = "it", DisplayName = "Italian", NativeName = "Italiano" },
                new LanguageOption { Code = "pt", DisplayName = "Portuguese", NativeName = "Português" },
                new LanguageOption { Code = "ru", DisplayName = "Russian", NativeName = "???????" },
                new LanguageOption { Code = "ja", DisplayName = "Japanese", NativeName = "???" },
                new LanguageOption { Code = "ko", DisplayName = "Korean", NativeName = "???" },
                new LanguageOption { Code = "zh", DisplayName = "Chinese", NativeName = "??" },
                new LanguageOption { Code = "bn", DisplayName = "Bengali", NativeName = "?????" },
                new LanguageOption { Code = "hi", DisplayName = "Hindi", NativeName = "??????" },
                new LanguageOption { Code = "ar", DisplayName = "Arabic", NativeName = "???????" },
                new LanguageOption { Code = "tr", DisplayName = "Turkish", NativeName = "Türkçe" },
                new LanguageOption { Code = "nl", DisplayName = "Dutch", NativeName = "Nederlands" }
            };
        }

        /// <summary>
        /// Get theme colors based on current theme
        /// </summary>
        /// <returns>Theme colors</returns>
        public ThemeColors GetThemeColors()
        {
            var isDark = _currentSettings.Theme == Theme.Dark || 
                        (_currentSettings.Theme == Theme.Auto && IsSystemDarkMode());

            return isDark ? ThemeColors.Dark : ThemeColors.Light;
        }

        /// <summary>
        /// Check if system is in dark mode
        /// </summary>
        /// <returns>True if system is in dark mode</returns>
        private bool IsSystemDarkMode()
        {
            try
            {
                using var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize");
                var value = key?.GetValue("AppsUseLightTheme");
                return value is int i && i == 0;
            }
            catch
            {
                return false; // Default to light mode if unable to detect
            }
        }

        /// <summary>
        /// Get settings file path for backup purposes
        /// </summary>
        /// <returns>Settings file path</returns>
        public string GetSettingsPath() => _settingsPath;

        /// <summary>
        /// Reset settings to default values
        /// </summary>
        public async Task ResetSettingsAsync()
        {
            _currentSettings = new UserSettings();
            await SaveSettingsAsync(_currentSettings);
        }

        /// <summary>
        /// Export settings to file
        /// </summary>
        /// <param name="filePath">Export file path</param>
        public async Task ExportSettingsAsync(string filePath)
        {
            var exportData = new
            {
                Settings = _currentSettings,
                ExportDate = DateTime.Now,
                Version = "1.0",
                Application = "Study Buddy"
            };

            var json = JsonConvert.SerializeObject(exportData, Formatting.Indented);
            await File.WriteAllTextAsync(filePath, json);
        }

        /// <summary>
        /// Import settings from file
        /// </summary>
        /// <param name="filePath">Import file path</param>
        public async Task ImportSettingsAsync(string filePath)
        {
            if (!File.Exists(filePath))
                throw new FileNotFoundException("Settings file not found.");

            var json = await File.ReadAllTextAsync(filePath);
            var importData = JsonConvert.DeserializeObject<dynamic>(json);
            
            if (importData?.Settings != null)
            {
                var settings = JsonConvert.DeserializeObject<UserSettings>(importData.Settings.ToString());
                if (settings != null)
                {
                    // Clear sensitive data for security
                    settings.ApiKey = "";
                    
                    await SaveSettingsAsync(settings);
                }
            }
        }
    }

    /// <summary>
    /// Theme color definitions
    /// </summary>
    public class ThemeColors
    {
        public System.Drawing.Color Background { get; set; }
        public System.Drawing.Color Surface { get; set; }
        public System.Drawing.Color Primary { get; set; }
        public System.Drawing.Color Secondary { get; set; }
        public System.Drawing.Color Text { get; set; }
        public System.Drawing.Color TextSecondary { get; set; }
        public System.Drawing.Color Border { get; set; }
        public System.Drawing.Color Accent { get; set; }

        public static ThemeColors Light => new()
        {
            Background = System.Drawing.Color.White,
            Surface = System.Drawing.Color.FromArgb(248, 249, 250),
            Primary = System.Drawing.Color.FromArgb(63, 81, 181),
            Secondary = System.Drawing.Color.FromArgb(33, 150, 243),
            Text = System.Drawing.Color.FromArgb(33, 33, 33),
            TextSecondary = System.Drawing.Color.FromArgb(117, 117, 117),
            Border = System.Drawing.Color.FromArgb(224, 224, 224),
            Accent = System.Drawing.Color.FromArgb(0, 188, 212)
        };

        public static ThemeColors Dark => new()
        {
            Background = System.Drawing.Color.FromArgb(18, 18, 18),
            Surface = System.Drawing.Color.FromArgb(32, 32, 32),
            Primary = System.Drawing.Color.FromArgb(63, 81, 181),
            Secondary = System.Drawing.Color.FromArgb(33, 150, 243),
            Text = System.Drawing.Color.FromArgb(255, 255, 255),
            TextSecondary = System.Drawing.Color.FromArgb(158, 158, 158),
            Border = System.Drawing.Color.FromArgb(64, 64, 64),
            Accent = System.Drawing.Color.FromArgb(0, 188, 212)
        };
    }
}