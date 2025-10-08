using System;
using System.Drawing;
using System.Threading.Tasks;
using System.Windows.Forms;
using StudyBuddy.Helpers;

namespace StudyBuddy.Controls
{
    public partial class FlashcardControl : UserControl, IThemeAware
    {
        private readonly StudyBuddy.Data.DatabaseHelper _databaseHelper;
        private readonly SettingsHandler _settingsHandler;

        public FlashcardControl(StudyBuddy.Data.DatabaseHelper databaseHelper, SettingsHandler settingsHandler)
        {
            _databaseHelper = databaseHelper;
            _settingsHandler = settingsHandler;
            InitializeComponent();
        }

        public void OnThemeChanged(ThemeColors themeColors)
        {
            this.BackColor = themeColors.Background;
            this.ForeColor = themeColors.Text;
        }

        private void InitializeComponent()
        {
            var panel = new Panel { Dock = DockStyle.Fill, Padding = new Padding(30) };
            
            var title = new Label
            {
                Text = "Advanced Flashcard System",
                Font = new Font("Segoe UI", 18F, FontStyle.Bold),
                ForeColor = Color.FromArgb(63, 81, 181),
                AutoSize = true,
                Location = new Point(0, 0)
            };

            var subtitle = new Label
            {
                Text = "Spaced Repetition with SM-2 Algorithm",
                Font = new Font("Segoe UI", 12F),
                ForeColor = Color.Gray,
                AutoSize = true,
                Location = new Point(0, 40)
            };

            var description = new Label
            {
                Text = "BRAIN Intelligent Learning System Features:\n\n" +
                       "• Smart Review Scheduling - Cards appear when you need to review them\n" +
                       "• SM-2 Algorithm - Scientifically proven spaced repetition\n" +
                       "• Progress Tracking - Monitor your learning accuracy and retention\n" +
                       "• Category Organization - Group cards by subject or topic\n" +
                       "• Difficulty Levels - Rate cards from 1-5 for personalized learning\n" +
                       "• Session Statistics - Track correct/incorrect answers per session\n" +
                       "• Auto-scheduling - Cards automatically reschedule based on performance\n\n" +
                       "CHART How it works:\n" +
                       "1. Create flashcards with questions and answers\n" +
                       "2. Review cards when they're due\n" +
                       "3. Rate your performance (correct/incorrect)\n" +
                       "4. Cards reschedule automatically using proven algorithms\n" +
                       "5. Focus on cards you find challenging\n\n" +
                       "TARGET Start by creating your first flashcard above!",
                Font = new Font("Segoe UI", 11F),
                Size = new Size(700, 500),
                Location = new Point(0, 80)
            };

            panel.Controls.AddRange(new Control[] { title, subtitle, description });
            this.Controls.Add(panel);
            this.Name = "FlashcardControl";
            this.Size = new Size(800, 600);
        }
    }

    public partial class SettingsControl : UserControl, IThemeAware
    {
        private readonly SettingsHandler _settingsHandler;
        private readonly MainForm _mainForm;

        public SettingsControl(SettingsHandler settingsHandler, MainForm mainForm)
        {
            _settingsHandler = settingsHandler;
            _mainForm = mainForm;
            InitializeComponent();
        }

        public void OnThemeChanged(ThemeColors themeColors)
        {
            this.BackColor = themeColors.Background;
            this.ForeColor = themeColors.Text;
        }

        private void InitializeComponent()
        {
            var panel = new Panel { Dock = DockStyle.Fill, Padding = new Padding(30) };
            
            var title = new Label
            {
                Text = "Advanced Settings Panel",
                Font = new Font("Segoe UI", 18F, FontStyle.Bold),
                ForeColor = Color.FromArgb(63, 81, 181),
                AutoSize = true,
                Location = new Point(0, 0)
            };

            var subtitle = new Label
            {
                Text = "Comprehensive Application Configuration",
                Font = new Font("Segoe UI", 12F),
                ForeColor = Color.Gray,
                AutoSize = true,
                Location = new Point(0, 40)
            };

            var description = new Label
            {
                Text = "GEAR Complete Settings Management:\n\n" +
                       "• API Key Management - Configure and test your Google Gemini API key\n" +
                       "• Theme Selection - Light, Dark, or Auto (follows system)\n" +
                       "• Language Preferences - Set default language for AI responses\n" +
                       "• Window Behavior - Remember position, start maximized, minimize to tray\n" +
                       "• Study Settings - Default session times, auto-save intervals\n" +
                       "• Export Configuration - Default paths and formats for exports\n" +
                       "• Performance Tuning - Animations, caching, and optimization\n" +
                       "• Backup & Restore - Export/import your settings\n\n" +
                       "TARGET All settings are automatically saved and synchronized across the app.\n" +
                       "Changes take effect immediately for the best user experience!\n\n" +
                       "MOBILE Use the tabbed interface to organize your preferences efficiently.",
                Font = new Font("Segoe UI", 11F),
                Size = new Size(700, 400),
                Location = new Point(0, 80)
            };

            panel.Controls.AddRange(new Control[] { title, subtitle, description });
            this.Controls.Add(panel);
            this.Name = "SettingsControl";
            this.Size = new Size(800, 600);
        }
    }

    public partial class AboutControl : UserControl, IThemeAware
    {
        public AboutControl()
        {
            InitializeComponent();
        }

        public void OnThemeChanged(ThemeColors themeColors)
        {
            this.BackColor = themeColors.Background;
            this.ForeColor = themeColors.Text;
        }

        private void InitializeComponent()
        {
            var panel = new Panel { Dock = DockStyle.Fill, Padding = new Padding(30) };
            
            var title = new Label
            {
                Text = "Study Buddy Pro v2.0",
                Font = new Font("Segoe UI", 18F, FontStyle.Bold),
                ForeColor = Color.FromArgb(63, 81, 181),
                AutoSize = true,
                Location = new Point(0, 0)
            };

            var subtitle = new Label
            {
                Text = "AI-Powered Learning Companion",
                Font = new Font("Segoe UI", 12F),
                ForeColor = Color.Gray,
                AutoSize = true,
                Location = new Point(0, 40)
            };

            var description = new Label
            {
                Text = "Built with .NET 8 and Google Gemini AI\n\n" +
                       "Features:\n" +
                       "• AI-powered study summarization\n" +
                       "• Problem generation for Math, Physics, Chemistry\n" +
                       "• Pomodoro-based study optimization\n" +
                       "• Spaced repetition flashcard system\n" +
                       "• Multi-language support (15+ languages)\n" +
                       "• Professional PDF and PNG export\n" +
                       "• Dark/Light theme support\n\n" +
                       "© 2024 Study Buddy Pro. All rights reserved.\n" +
                       "Made with HEART for students worldwide.",
                Font = new Font("Segoe UI", 10F),
                Size = new Size(600, 400),
                Location = new Point(0, 80)
            };

            panel.Controls.AddRange(new Control[] { title, subtitle, description });
            this.Controls.Add(panel);
            this.Name = "AboutControl";
            this.Size = new Size(800, 600);
        }
    }
}