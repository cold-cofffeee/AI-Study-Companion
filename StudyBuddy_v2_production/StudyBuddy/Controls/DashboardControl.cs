using System;
using System.Drawing;
using System.Threading.Tasks;
using System.Windows.Forms;
using StudyBuddy.Data;
using StudyBuddy.Helpers;
using StudyBuddy.Models;

namespace StudyBuddy.Controls
{
    /// <summary>
    /// Dashboard control showing overview, stats, and daily challenges
    /// </summary>
    public partial class DashboardControl : UserControl, IAsyncInitializable, IThemeAware, IRefreshable
    {
        private readonly DatabaseHelper _databaseHelper;
        private readonly SettingsHandler _settingsHandler;
        private ThemeColors _themeColors;

        public DashboardControl(DatabaseHelper databaseHelper, SettingsHandler settingsHandler)
        {
            _databaseHelper = databaseHelper;
            _settingsHandler = settingsHandler;
            InitializeComponent();
        }

        public async Task InitializeAsync()
        {
            await LoadDashboardDataAsync();
        }

        public void OnThemeChanged(ThemeColors themeColors)
        {
            _themeColors = themeColors;
            ApplyTheme();
        }

        public async Task RefreshAsync()
        {
            await LoadDashboardDataAsync();
        }

        private async Task LoadDashboardDataAsync()
        {
            try
            {
                lblWelcome.Text = $"Welcome back! Today is {DateTime.Now:dddd, MMMM dd, yyyy}";
                
                // Load recent sessions
                var recentSessions = await _databaseHelper.GetRecentStudySessionsAsync(5);
                lblSessionCount.Text = $"BOOKS {recentSessions.Count} recent sessions";
                
                // Load due flashcards
                var dueCards = await _databaseHelper.GetDueFlashcardsAsync();
                lblFlashcardCount.Text = $"CARDS {dueCards.Count} cards due for review";
            }
            catch (Exception ex)
            {
                lblWelcome.Text = $"Error loading dashboard: {ex.Message}";
            }
        }

        private void ApplyTheme()
        {
            if (_themeColors != null)
            {
                this.BackColor = _themeColors.Background;
                this.ForeColor = _themeColors.Text;
            }
        }

        private void InitializeComponent()
        {
            this.panelMain = new Panel();
            this.lblWelcome = new Label();
            this.panelStats = new Panel();
            this.lblSessionCount = new Label();
            this.lblFlashcardCount = new Label();
            this.lblQuickStats = new Label();
            this.panelQuickActions = new Panel();
            this.btnQuickSummary = new Button();
            this.btnQuickProblems = new Button();
            this.btnQuickOptimizer = new Button();
            this.panelDailyChallenge = new Panel();
            this.lblChallengeTitle = new Label();
            this.lblChallengeDesc = new Label();
            this.btnCompleteChallenge = new Button();
            
            this.panelMain.SuspendLayout();
            this.panelStats.SuspendLayout();
            this.panelQuickActions.SuspendLayout();
            this.panelDailyChallenge.SuspendLayout();
            this.SuspendLayout();

            // panelMain
            this.panelMain.Dock = DockStyle.Fill;
            this.panelMain.Padding = new Padding(30);
            this.panelMain.Controls.Add(this.lblWelcome);
            this.panelMain.Controls.Add(this.panelStats);
            this.panelMain.Controls.Add(this.panelQuickActions);
            this.panelMain.Controls.Add(this.panelDailyChallenge);

            // lblWelcome
            this.lblWelcome.AutoSize = true;
            this.lblWelcome.Font = new Font("Segoe UI", 20F, FontStyle.Bold);
            this.lblWelcome.ForeColor = Color.FromArgb(63, 81, 181);
            this.lblWelcome.Location = new Point(0, 0);
            this.lblWelcome.Size = new Size(400, 37);
            this.lblWelcome.Text = "Welcome to Study Buddy Pro!";

            // panelStats
            this.panelStats.BackColor = Color.FromArgb(248, 249, 250);
            this.panelStats.Location = new Point(0, 60);
            this.panelStats.Size = new Size(700, 120);
            this.panelStats.Padding = new Padding(20);
            this.panelStats.Controls.Add(this.lblQuickStats);
            this.panelStats.Controls.Add(this.lblSessionCount);
            this.panelStats.Controls.Add(this.lblFlashcardCount);

            // lblQuickStats
            this.lblQuickStats.AutoSize = true;
            this.lblQuickStats.Font = new Font("Segoe UI", 14F, FontStyle.Bold);
            this.lblQuickStats.ForeColor = Color.FromArgb(33, 150, 243);
            this.lblQuickStats.Location = new Point(0, 0);
            this.lblQuickStats.Text = "CHART Quick Stats";

            // lblSessionCount
            this.lblSessionCount.AutoSize = true;
            this.lblSessionCount.Font = new Font("Segoe UI", 11F);
            this.lblSessionCount.Location = new Point(0, 35);
            this.lblSessionCount.Size = new Size(200, 20);
            this.lblSessionCount.Text = "BOOKS Loading study sessions...";

            // lblFlashcardCount
            this.lblFlashcardCount.AutoSize = true;
            this.lblFlashcardCount.Font = new Font("Segoe UI", 11F);
            this.lblFlashcardCount.Location = new Point(0, 60);
            this.lblFlashcardCount.Size = new Size(200, 20);
            this.lblFlashcardCount.Text = "CARDS Loading flashcard data...";

            // panelQuickActions
            this.panelQuickActions.Location = new Point(0, 200);
            this.panelQuickActions.Size = new Size(700, 120);
            this.panelQuickActions.Controls.Add(this.btnQuickSummary);
            this.panelQuickActions.Controls.Add(this.btnQuickProblems);
            this.panelQuickActions.Controls.Add(this.btnQuickOptimizer);

            // btnQuickSummary
            this.btnQuickSummary.BackColor = Color.FromArgb(76, 175, 80);
            this.btnQuickSummary.FlatStyle = FlatStyle.Flat;
            this.btnQuickSummary.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.btnQuickSummary.ForeColor = Color.White;
            this.btnQuickSummary.Location = new Point(0, 0);
            this.btnQuickSummary.Size = new Size(150, 80);
            this.btnQuickSummary.Text = "[S] Quick\nSummary";
            this.btnQuickSummary.UseVisualStyleBackColor = false;

            // btnQuickProblems
            this.btnQuickProblems.BackColor = Color.FromArgb(255, 152, 0);
            this.btnQuickProblems.FlatStyle = FlatStyle.Flat;
            this.btnQuickProblems.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.btnQuickProblems.ForeColor = Color.White;
            this.btnQuickProblems.Location = new Point(170, 0);
            this.btnQuickProblems.Size = new Size(150, 80);
            this.btnQuickProblems.Text = "[P] Practice\nProblems";
            this.btnQuickProblems.UseVisualStyleBackColor = false;

            // btnQuickOptimizer
            this.btnQuickOptimizer.BackColor = Color.FromArgb(156, 39, 176);
            this.btnQuickOptimizer.FlatStyle = FlatStyle.Flat;
            this.btnQuickOptimizer.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.btnQuickOptimizer.ForeColor = Color.White;
            this.btnQuickOptimizer.Location = new Point(340, 0);
            this.btnQuickOptimizer.Size = new Size(150, 80);
            this.btnQuickOptimizer.Text = "[O] Study\nPlanner";
            this.btnQuickOptimizer.UseVisualStyleBackColor = false;

            // panelDailyChallenge
            this.panelDailyChallenge.BackColor = Color.FromArgb(255, 245, 200);
            this.panelDailyChallenge.Location = new Point(0, 340);
            this.panelDailyChallenge.Size = new Size(700, 100);
            this.panelDailyChallenge.Padding = new Padding(20);
            this.panelDailyChallenge.Controls.Add(this.lblChallengeTitle);
            this.panelDailyChallenge.Controls.Add(this.lblChallengeDesc);
            this.panelDailyChallenge.Controls.Add(this.btnCompleteChallenge);

            // lblChallengeTitle
            this.lblChallengeTitle.AutoSize = true;
            this.lblChallengeTitle.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            this.lblChallengeTitle.ForeColor = Color.FromArgb(255, 152, 0);
            this.lblChallengeTitle.Location = new Point(0, 0);
            this.lblChallengeTitle.Text = "TROPHY Today's Challenge";

            // lblChallengeDesc
            this.lblChallengeDesc.Font = new Font("Segoe UI", 10F);
            this.lblChallengeDesc.Location = new Point(0, 25);
            this.lblChallengeDesc.Size = new Size(500, 40);
            this.lblChallengeDesc.Text = "Complete your first AI-powered summary to earn 25 points!";

            // btnCompleteChallenge
            this.btnCompleteChallenge.BackColor = Color.FromArgb(255, 152, 0);
            this.btnCompleteChallenge.FlatStyle = FlatStyle.Flat;
            this.btnCompleteChallenge.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.btnCompleteChallenge.ForeColor = Color.White;
            this.btnCompleteChallenge.Location = new Point(520, 20);
            this.btnCompleteChallenge.Size = new Size(120, 35);
            this.btnCompleteChallenge.Text = "Start Challenge";
            this.btnCompleteChallenge.UseVisualStyleBackColor = false;

            // DashboardControl
            this.Controls.Add(this.panelMain);
            this.Name = "DashboardControl";
            this.Size = new Size(800, 600);

            this.panelMain.ResumeLayout(false);
            this.panelMain.PerformLayout();
            this.panelStats.ResumeLayout(false);
            this.panelStats.PerformLayout();
            this.panelQuickActions.ResumeLayout(false);
            this.panelDailyChallenge.ResumeLayout(false);
            this.panelDailyChallenge.PerformLayout();
            this.ResumeLayout(false);
        }

        private Panel panelMain;
        private Label lblWelcome;
        private Panel panelStats;
        private Label lblSessionCount;
        private Label lblFlashcardCount;
        private Label lblQuickStats;
        private Panel panelQuickActions;
        private Button btnQuickSummary;
        private Button btnQuickProblems;
        private Button btnQuickOptimizer;
        private Panel panelDailyChallenge;
        private Label lblChallengeTitle;
        private Label lblChallengeDesc;
        private Button btnCompleteChallenge;
    }
}