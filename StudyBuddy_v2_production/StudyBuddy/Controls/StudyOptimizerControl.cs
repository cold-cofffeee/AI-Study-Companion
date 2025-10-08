using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using StudyBuddy.Helpers;
using StudyBuddy.Models;
using Newtonsoft.Json;

namespace StudyBuddy.Controls
{
    /// <summary>
    /// Study Time Optimizer Control
    /// Creates optimized study schedules using Pomodoro technique with AI recommendations
    /// </summary>
    public partial class StudyOptimizerControl : UserControl, IThemeAware, IAsyncInitializable
    {
        #region Private Fields

        private readonly SettingsHandler _settingsHandler;
        private GeminiApiClient? _geminiClient;
        private string _currentApiKey = string.Empty;
        private ThemeColors _themeColors;
        private List<ScheduleItem> _schedule = new List<ScheduleItem>();
        private System.Windows.Forms.Timer _focusTimer;
        private DateTime _sessionStartTime;
        private int _currentSessionMinutes = 0;
        private int _elapsedMinutes = 0;
        private bool _isBreak = false;

        #endregion

        #region Constructor

        public StudyOptimizerControl(SettingsHandler settingsHandler)
        {
            _settingsHandler = settingsHandler;
            _focusTimer = new System.Windows.Forms.Timer();
            _focusTimer.Interval = 60000; // 1 minute
            _focusTimer.Tick += FocusTimer_Tick;
            InitializeComponent();
        }

        #endregion

        #region Interface Implementations

        public async Task InitializeAsync()
        {
            await LoadSettingsAsync();
            InitializeControls();
        }

        public void OnThemeChanged(ThemeColors themeColors)
        {
            _themeColors = themeColors;
            ApplyTheme();
        }

        #endregion

        #region Initialization

        private async Task LoadSettingsAsync()
        {
            try
            {
                var settings = await _settingsHandler.LoadSettingsAsync();
                
                if (!string.IsNullOrEmpty(settings.ApiKey))
                {
                    _currentApiKey = settings.ApiKey;
                    _geminiClient = new GeminiApiClient(_currentApiKey);
                    lblApiStatus.Text = "AI Ready";
                    lblApiStatus.ForeColor = Color.Green;
                }
                else
                {
                    lblApiStatus.Text = "Configure API";
                    lblApiStatus.ForeColor = Color.Red;
                }

                // Load default session time
                nudStudyMinutes.Value = settings.DefaultStudySessionMinutes;
            }
            catch (Exception ex)
            {
                lblApiStatus.Text = $"Error: {ex.Message}";
                lblApiStatus.ForeColor = Color.Red;
            }
        }

        private void InitializeControls()
        {
            // Initialize difficulty dropdown
            cmbDifficulty.Items.AddRange(new[] { "Easy", "Medium", "Hard", "Expert" });
            cmbDifficulty.SelectedIndex = 1; // Default to Medium

            // Initialize time controls
            nudStudyMinutes.Minimum = 15;
            nudStudyMinutes.Maximum = 480; // 8 hours max
            nudStudyMinutes.Value = 120; // Default 2 hours

            UpdateButtonStates();
        }

        private void ApplyTheme()
        {
            if (_themeColors != null)
            {
                this.BackColor = _themeColors.Background;
                this.ForeColor = _themeColors.Text;
                
                groupPlanner.BackColor = _themeColors.Surface;
                groupSchedule.BackColor = _themeColors.Surface;
                groupSession.BackColor = _themeColors.Surface;
                
                txtTopic.BackColor = _themeColors.Background;
                txtTopic.ForeColor = _themeColors.Text;
                listSchedule.BackColor = _themeColors.Background;
                listSchedule.ForeColor = _themeColors.Text;
            }
        }

        #endregion

        #region Event Handlers

        private async void btnCreateSchedule_Click(object sender, EventArgs e)
        {
            if (_geminiClient == null)
            {
                MessageBox.Show("Please configure your API key first.", "API Key Required", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            if (string.IsNullOrWhiteSpace(txtTopic.Text))
            {
                MessageBox.Show("Please enter a study topic.", "Topic Required", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            try
            {
                btnCreateSchedule.Text = "Creating...";
                btnCreateSchedule.Enabled = false;
                Cursor = Cursors.WaitCursor;

                var topic = txtTopic.Text.Trim();
                var totalMinutes = (int)nudStudyMinutes.Value;
                var difficulty = cmbDifficulty.SelectedItem.ToString();

                var result = await _geminiClient.GenerateStudyScheduleAsync(topic, totalMinutes, difficulty);
                
                // Parse the JSON response
                var scheduleData = JsonConvert.DeserializeObject<dynamic>(result);
                _schedule.Clear();
                listSchedule.Items.Clear();

                var currentTime = DateTime.Now;
                
                if (scheduleData?.schedule != null)
                {
                    foreach (var item in scheduleData.schedule)
                    {
                        var scheduleItem = new ScheduleItem
                        {
                            Topic = topic,
                            StartTime = currentTime,
                            DurationMinutes = item.duration_minutes ?? 25,
                            Type = item.type?.ToString() ?? "Study",
                            Description = item.description?.ToString() ?? "",
                            IsCompleted = false
                        };

                        _schedule.Add(scheduleItem);
                        
                        var listItem = new ListViewItem(new string[]
                        {
                            currentTime.ToString("HH:mm"),
                            scheduleItem.Type,
                            scheduleItem.DurationMinutes.ToString() + " min",
                            scheduleItem.Description
                        });

                        if (scheduleItem.Type.ToLower() == "break")
                        {
                            listItem.BackColor = Color.FromArgb(230, 245, 255);
                        }

                        listSchedule.Items.Add(listItem);
                        currentTime = currentTime.AddMinutes(scheduleItem.DurationMinutes);
                    }
                }

                // Add micro-quizzes info
                if (scheduleData?.micro_quizzes != null)
                {
                    var quizInfo = string.Join("\n", scheduleData.micro_quizzes);
                    lblMicroQuizzes.Text = $"Break Activities:\n{quizInfo}";
                }

                UpdateButtonStates();
                UpdateScheduleStats();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error creating schedule: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                btnCreateSchedule.Text = "Create Schedule";
                btnCreateSchedule.Enabled = true;
                Cursor = Cursors.Default;
            }
        }

        private async void btnStartSession_Click(object sender, EventArgs e)
        {
            if (_schedule.Count == 0)
            {
                MessageBox.Show("Please create a schedule first.", "Schedule Required", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            if (_focusTimer.Enabled)
            {
                // Pause/Resume functionality
                _focusTimer.Stop();
                btnStartSession.Text = "Resume Session";
                btnStartSession.BackColor = Color.FromArgb(76, 175, 80);
                lblCurrentActivity.Text += " (Paused)";
                return;
            }

            // Check if resuming or starting new
            if (btnStartSession.Text == "Resume Session")
            {
                // Resume
                _focusTimer.Start();
                btnStartSession.Text = "Pause Session";
                btnStartSession.BackColor = Color.FromArgb(255, 152, 0);
                lblCurrentActivity.Text = lblCurrentActivity.Text.Replace(" (Paused)", "");
                return;
            }

            // Start new session
            var nextSession = _schedule.FirstOrDefault(s => !s.IsCompleted);
            if (nextSession == null)
            {
                MessageBox.Show("All sessions completed! Great job!", "Schedule Complete", MessageBoxButtons.OK, MessageBoxIcon.Information);
                return;
            }

            _sessionStartTime = DateTime.Now;
            _currentSessionMinutes = nextSession.DurationMinutes;
            _elapsedMinutes = 0;
            _isBreak = nextSession.Type.ToLower() == "break";

            _focusTimer.Start();
            btnStartSession.Text = "Pause Session";
            btnStartSession.BackColor = Color.FromArgb(255, 152, 0);
            btnStopSession.Enabled = true;
            
            lblCurrentActivity.Text = $"Current: {nextSession.Type} - {nextSession.Description}";
            UpdateSessionDisplay();
        }

        private void btnStopSession_Click(object sender, EventArgs e)
        {
            if (MessageBox.Show("Are you sure you want to stop the current session?", "Stop Session", 
                MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
            {
                StopCurrentSession();
            }
        }

        private void FocusTimer_Tick(object sender, EventArgs e)
        {
            _elapsedMinutes++;
            UpdateSessionDisplay();

            // Check if session is complete
            if (_elapsedMinutes >= _currentSessionMinutes)
            {
                CompleteCurrentSession();
            }
        }

        private void txtTopic_TextChanged(object sender, EventArgs e)
        {
            UpdateButtonStates();
        }

        #endregion

        #region Helper Methods

        private void UpdateButtonStates()
        {
            bool hasApiKey = !string.IsNullOrWhiteSpace(_currentApiKey);
            bool hasTopic = !string.IsNullOrWhiteSpace(txtTopic.Text);
            bool hasSchedule = _schedule.Count > 0;
            
            btnCreateSchedule.Enabled = hasApiKey && hasTopic;
            btnStartSession.Enabled = hasSchedule && !_focusTimer.Enabled;
        }

        private void UpdateSessionDisplay()
        {
            var remainingMinutes = _currentSessionMinutes - _elapsedMinutes;
            lblSessionTimer.Text = $"{remainingMinutes:D2}:00";
            
            var progress = (double)_elapsedMinutes / _currentSessionMinutes * 100;
            progressBar.Value = Math.Min((int)progress, 100);
            
            if (_isBreak)
            {
                lblSessionTimer.ForeColor = Color.FromArgb(76, 175, 80);
                lblCurrentActivity.ForeColor = Color.FromArgb(76, 175, 80);
            }
            else
            {
                lblSessionTimer.ForeColor = Color.FromArgb(33, 150, 243);
                lblCurrentActivity.ForeColor = Color.FromArgb(33, 150, 243);
            }
        }

        private void CompleteCurrentSession()
        {
            var completedSession = _schedule.FirstOrDefault(s => !s.IsCompleted);
            if (completedSession != null)
            {
                completedSession.IsCompleted = true;
                
                // Update list view
                var index = _schedule.IndexOf(completedSession);
                if (index >= 0 && index < listSchedule.Items.Count)
                {
                    listSchedule.Items[index].BackColor = Color.FromArgb(200, 255, 200);
                    listSchedule.Items[index].ForeColor = Color.Gray;
                }
            }

            StopCurrentSession();
            
            // Show completion message
            var nextSession = _schedule.FirstOrDefault(s => !s.IsCompleted);
            if (nextSession != null)
            {
                var sessionType = _isBreak ? "break" : "study session";
                var nextType = nextSession.Type.ToLower();
                MessageBox.Show($"{char.ToUpper(sessionType[0]) + sessionType.Substring(1)} completed!\n\nNext: {nextType} for {nextSession.DurationMinutes} minutes", 
                    "Session Complete", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            else
            {
                MessageBox.Show("All sessions completed! Excellent work!", "Schedule Complete", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }

            UpdateScheduleStats();
        }

        private void StopCurrentSession()
        {
            _focusTimer.Stop();
            btnStartSession.Text = "Start Session";
            btnStartSession.BackColor = Color.FromArgb(76, 175, 80);
            btnStopSession.Enabled = false;
            lblCurrentActivity.Text = "Ready to start";
            lblCurrentActivity.ForeColor = _themeColors?.Text ?? Color.Black;
            lblSessionTimer.Text = "00:00";
            lblSessionTimer.ForeColor = _themeColors?.Text ?? Color.Black;
            progressBar.Value = 0;
            _elapsedMinutes = 0;
            _currentSessionMinutes = 0;
            UpdateButtonStates();
        }

        private void UpdateScheduleStats()
        {
            var completedSessions = _schedule.Count(s => s.IsCompleted);
            var totalSessions = _schedule.Count;
            var studySessions = _schedule.Count(s => s.Type.ToLower() == "study");
            var breakSessions = _schedule.Count(s => s.Type.ToLower() == "break");
            
            lblScheduleStats.Text = $"Progress: {completedSessions}/{totalSessions} sessions\n" +
                                   $"Study blocks: {studySessions}\n" +
                                   $"Break blocks: {breakSessions}";
        }

        #endregion

        #region Designer Code

        private void InitializeComponent()
        {
            this.tableLayoutMain = new TableLayoutPanel();
            this.groupPlanner = new GroupBox();
            this.lblTopic = new Label();
            this.txtTopic = new TextBox();
            this.lblStudyTime = new Label();
            this.nudStudyMinutes = new NumericUpDown();
            this.lblDifficulty = new Label();
            this.cmbDifficulty = new ComboBox();
            this.btnCreateSchedule = new Button();
            this.lblApiStatus = new Label();
            this.groupSchedule = new GroupBox();
            this.listSchedule = new ListView();
            this.columnTime = new ColumnHeader();
            this.columnType = new ColumnHeader();
            this.columnDuration = new ColumnHeader();
            this.columnDescription = new ColumnHeader();
            this.lblMicroQuizzes = new Label();
            this.lblScheduleStats = new Label();
            this.groupSession = new GroupBox();
            this.lblSessionTimer = new Label();
            this.progressBar = new ProgressBar();
            this.lblCurrentActivity = new Label();
            this.btnStartSession = new Button();
            this.btnStopSession = new Button();

            this.tableLayoutMain.SuspendLayout();
            this.groupPlanner.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudStudyMinutes)).BeginInit();
            this.groupSchedule.SuspendLayout();
            this.groupSession.SuspendLayout();
            this.SuspendLayout();

            // tableLayoutMain
            this.tableLayoutMain.ColumnCount = 2;
            this.tableLayoutMain.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 320F));
            this.tableLayoutMain.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100F));
            this.tableLayoutMain.Controls.Add(this.groupPlanner, 0, 0);
            this.tableLayoutMain.Controls.Add(this.groupSession, 0, 1);
            this.tableLayoutMain.Controls.Add(this.groupSchedule, 1, 0);
            this.tableLayoutMain.Dock = DockStyle.Fill;
            this.tableLayoutMain.Name = "tableLayoutMain";
            this.tableLayoutMain.RowCount = 2;
            this.tableLayoutMain.RowStyles.Add(new RowStyle(SizeType.Percent, 60F));
            this.tableLayoutMain.RowStyles.Add(new RowStyle(SizeType.Percent, 40F));
            this.tableLayoutMain.SetRowSpan(this.groupSchedule, 2);
            this.tableLayoutMain.Size = new Size(1000, 700);
            this.tableLayoutMain.TabIndex = 0;

            // groupPlanner
            this.groupPlanner.Controls.Add(this.lblTopic);
            this.groupPlanner.Controls.Add(this.txtTopic);
            this.groupPlanner.Controls.Add(this.lblStudyTime);
            this.groupPlanner.Controls.Add(this.nudStudyMinutes);
            this.groupPlanner.Controls.Add(this.lblDifficulty);
            this.groupPlanner.Controls.Add(this.cmbDifficulty);
            this.groupPlanner.Controls.Add(this.btnCreateSchedule);
            this.groupPlanner.Controls.Add(this.lblApiStatus);
            this.groupPlanner.Dock = DockStyle.Fill;
            this.groupPlanner.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.groupPlanner.Location = new Point(4, 4);
            this.groupPlanner.Name = "groupPlanner";
            this.groupPlanner.Padding = new Padding(15);
            this.groupPlanner.Size = new Size(312, 412);
            this.groupPlanner.TabIndex = 0;
            this.groupPlanner.TabStop = false;
            this.groupPlanner.Text = "Study Planner";

            // lblTopic
            this.lblTopic.AutoSize = true;
            this.lblTopic.Font = new Font("Segoe UI", 10F);
            this.lblTopic.Location = new Point(20, 40);
            this.lblTopic.Name = "lblTopic";
            this.lblTopic.Size = new Size(82, 19);
            this.lblTopic.Text = "Study Topic:";

            // txtTopic
            this.txtTopic.Font = new Font("Segoe UI", 10F);
            this.txtTopic.Location = new Point(20, 65);
            this.txtTopic.Name = "txtTopic";
            this.txtTopic.PlaceholderText = "e.g., Calculus, Physics, History...";
            this.txtTopic.Size = new Size(270, 25);
            this.txtTopic.TabIndex = 1;
            this.txtTopic.TextChanged += this.txtTopic_TextChanged;

            // lblStudyTime
            this.lblStudyTime.AutoSize = true;
            this.lblStudyTime.Font = new Font("Segoe UI", 10F);
            this.lblStudyTime.Location = new Point(20, 100);
            this.lblStudyTime.Name = "lblStudyTime";
            this.lblStudyTime.Size = new Size(130, 19);
            this.lblStudyTime.Text = "Available Time (min):";

            // nudStudyMinutes
            this.nudStudyMinutes.Font = new Font("Segoe UI", 10F);
            this.nudStudyMinutes.Location = new Point(20, 125);
            this.nudStudyMinutes.Name = "nudStudyMinutes";
            this.nudStudyMinutes.Size = new Size(120, 25);
            this.nudStudyMinutes.TabIndex = 3;

            // lblDifficulty
            this.lblDifficulty.AutoSize = true;
            this.lblDifficulty.Font = new Font("Segoe UI", 10F);
            this.lblDifficulty.Location = new Point(20, 160);
            this.lblDifficulty.Name = "lblDifficulty";
            this.lblDifficulty.Size = new Size(109, 19);
            this.lblDifficulty.Text = "Content Difficulty:";

            // cmbDifficulty
            this.cmbDifficulty.DropDownStyle = ComboBoxStyle.DropDownList;
            this.cmbDifficulty.Font = new Font("Segoe UI", 10F);
            this.cmbDifficulty.Location = new Point(20, 185);
            this.cmbDifficulty.Name = "cmbDifficulty";
            this.cmbDifficulty.Size = new Size(150, 25);
            this.cmbDifficulty.TabIndex = 5;

            // btnCreateSchedule
            this.btnCreateSchedule.BackColor = Color.FromArgb(33, 150, 243);
            this.btnCreateSchedule.FlatStyle = FlatStyle.Flat;
            this.btnCreateSchedule.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.btnCreateSchedule.ForeColor = Color.White;
            this.btnCreateSchedule.Location = new Point(20, 230);
            this.btnCreateSchedule.Name = "btnCreateSchedule";
            this.btnCreateSchedule.Size = new Size(270, 40);
            this.btnCreateSchedule.Text = "Create AI Schedule";
            this.btnCreateSchedule.UseVisualStyleBackColor = false;
            this.btnCreateSchedule.Click += this.btnCreateSchedule_Click;

            // lblApiStatus
            this.lblApiStatus.AutoSize = true;
            this.lblApiStatus.Font = new Font("Segoe UI", 9F);
            this.lblApiStatus.Location = new Point(20, 285);
            this.lblApiStatus.Name = "lblApiStatus";
            this.lblApiStatus.Size = new Size(75, 15);
            this.lblApiStatus.Text = "AI Status: --";

            // groupSession
            this.groupSession.Controls.Add(this.lblSessionTimer);
            this.groupSession.Controls.Add(this.progressBar);
            this.groupSession.Controls.Add(this.lblCurrentActivity);
            this.groupSession.Controls.Add(this.btnStartSession);
            this.groupSession.Controls.Add(this.btnStopSession);
            this.groupSession.Dock = DockStyle.Fill;
            this.groupSession.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.groupSession.Location = new Point(4, 422);
            this.groupSession.Name = "groupSession";
            this.groupSession.Padding = new Padding(15);
            this.groupSession.Size = new Size(312, 274);
            this.groupSession.TabIndex = 1;
            this.groupSession.TabStop = false;
            this.groupSession.Text = "Focus Session";

            // lblSessionTimer
            this.lblSessionTimer.Font = new Font("Segoe UI", 32F, FontStyle.Bold);
            this.lblSessionTimer.ForeColor = Color.FromArgb(33, 150, 243);
            this.lblSessionTimer.Location = new Point(20, 30);
            this.lblSessionTimer.Name = "lblSessionTimer";
            this.lblSessionTimer.Size = new Size(270, 70);
            this.lblSessionTimer.Text = "00:00";
            this.lblSessionTimer.TextAlign = ContentAlignment.MiddleCenter;
            this.lblSessionTimer.BackColor = Color.FromArgb(245, 245, 245);
            this.lblSessionTimer.BorderStyle = BorderStyle.FixedSingle;

            // progressBar
            this.progressBar.Location = new Point(20, 110);
            this.progressBar.Name = "progressBar";
            this.progressBar.Size = new Size(270, 25);
            this.progressBar.TabIndex = 1;
            this.progressBar.Style = ProgressBarStyle.Continuous;

            // lblCurrentActivity
            this.lblCurrentActivity.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.lblCurrentActivity.Location = new Point(20, 145);
            this.lblCurrentActivity.Name = "lblCurrentActivity";
            this.lblCurrentActivity.Size = new Size(270, 30);
            this.lblCurrentActivity.Text = "Ready to start";
            this.lblCurrentActivity.TextAlign = ContentAlignment.MiddleCenter;

            // btnStartSession
            this.btnStartSession.BackColor = Color.FromArgb(76, 175, 80);
            this.btnStartSession.Enabled = false;
            this.btnStartSession.FlatStyle = FlatStyle.Flat;
            this.btnStartSession.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.btnStartSession.ForeColor = Color.White;
            this.btnStartSession.Location = new Point(20, 185);
            this.btnStartSession.Name = "btnStartSession";
            this.btnStartSession.Size = new Size(120, 40);
            this.btnStartSession.Text = "Start Session";
            this.btnStartSession.UseVisualStyleBackColor = false;
            this.btnStartSession.Click += this.btnStartSession_Click;

            // btnStopSession
            this.btnStopSession.BackColor = Color.FromArgb(244, 67, 54);
            this.btnStopSession.Enabled = false;
            this.btnStopSession.FlatStyle = FlatStyle.Flat;
            this.btnStopSession.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.btnStopSession.ForeColor = Color.White;
            this.btnStopSession.Location = new Point(150, 185);
            this.btnStopSession.Name = "btnStopSession";
            this.btnStopSession.Size = new Size(120, 40);
            this.btnStopSession.Text = "Stop Session";
            this.btnStopSession.UseVisualStyleBackColor = false;
            this.btnStopSession.Click += this.btnStopSession_Click;

            // groupSchedule
            this.groupSchedule.Controls.Add(this.listSchedule);
            this.groupSchedule.Controls.Add(this.lblMicroQuizzes);
            this.groupSchedule.Controls.Add(this.lblScheduleStats);
            this.groupSchedule.Dock = DockStyle.Fill;
            this.groupSchedule.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.groupSchedule.Location = new Point(324, 4);
            this.groupSchedule.Name = "groupSchedule";
            this.groupSchedule.Padding = new Padding(15);
            this.groupSchedule.Size = new Size(672, 692);
            this.groupSchedule.TabIndex = 2;
            this.groupSchedule.TabStop = false;
            this.groupSchedule.Text = "Study Schedule";

            // listSchedule
            this.listSchedule.Columns.AddRange(new ColumnHeader[] {
                this.columnTime,
                this.columnType,
                this.columnDuration,
                this.columnDescription});
            this.listSchedule.Font = new Font("Segoe UI", 10F);
            this.listSchedule.FullRowSelect = true;
            this.listSchedule.GridLines = true;
            this.listSchedule.Location = new Point(20, 35);
            this.listSchedule.Name = "listSchedule";
            this.listSchedule.Size = new Size(630, 450);
            this.listSchedule.TabIndex = 0;
            this.listSchedule.UseCompatibleStateImageBehavior = false;
            this.listSchedule.View = View.Details;

            // columnTime
            this.columnTime.Text = "Time";
            this.columnTime.Width = 80;

            // columnType
            this.columnType.Text = "Type";
            this.columnType.Width = 100;

            // columnDuration
            this.columnDuration.Text = "Duration";
            this.columnDuration.Width = 100;

            // columnDescription
            this.columnDescription.Text = "Description";
            this.columnDescription.Width = 350;

            // lblMicroQuizzes
            this.lblMicroQuizzes.Font = new Font("Segoe UI", 9F);
            this.lblMicroQuizzes.Location = new Point(20, 500);
            this.lblMicroQuizzes.Name = "lblMicroQuizzes";
            this.lblMicroQuizzes.Size = new Size(630, 100);
            this.lblMicroQuizzes.Text = "Break activities will appear here after generating a schedule.";

            // lblScheduleStats
            this.lblScheduleStats.Font = new Font("Segoe UI", 10F);
            this.lblScheduleStats.Location = new Point(20, 610);
            this.lblScheduleStats.Name = "lblScheduleStats";
            this.lblScheduleStats.Size = new Size(300, 60);
            this.lblScheduleStats.Text = "Create a schedule to see progress";

            // StudyOptimizerControl
            this.Controls.Add(this.tableLayoutMain);
            this.Name = "StudyOptimizerControl";
            this.Size = new Size(1000, 700);

            this.tableLayoutMain.ResumeLayout(false);
            this.groupPlanner.ResumeLayout(false);
            this.groupPlanner.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudStudyMinutes)).EndInit();
            this.groupSchedule.ResumeLayout(false);
            this.groupSession.ResumeLayout(false);
            this.ResumeLayout(false);
        }

        #endregion

        #region Controls

        private TableLayoutPanel tableLayoutMain;
        private GroupBox groupPlanner;
        private Label lblTopic;
        private TextBox txtTopic;
        private Label lblStudyTime;
        private NumericUpDown nudStudyMinutes;
        private Label lblDifficulty;
        private ComboBox cmbDifficulty;
        private Button btnCreateSchedule;
        private Label lblApiStatus;
        private GroupBox groupSession;
        private Label lblSessionTimer;
        private ProgressBar progressBar;
        private Label lblCurrentActivity;
        private Button btnStartSession;
        private Button btnStopSession;
        private GroupBox groupSchedule;
        private ListView listSchedule;
        private ColumnHeader columnTime;
        private ColumnHeader columnType;
        private ColumnHeader columnDuration;
        private ColumnHeader columnDescription;
        private Label lblMicroQuizzes;
        private Label lblScheduleStats;

        #endregion
    }
}