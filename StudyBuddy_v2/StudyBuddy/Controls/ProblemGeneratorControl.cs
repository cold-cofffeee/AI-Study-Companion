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
    /// Random Problem Generator Control
    /// Generates practice problems for Math, Physics, Chemistry with solutions
    /// </summary>
    public partial class ProblemGeneratorControl : UserControl, IThemeAware, IAsyncInitializable
    {
        #region Private Fields

        private readonly SettingsHandler _settingsHandler;
        private GeminiApiClient? _geminiClient;
        private string _currentApiKey = string.Empty;
        private ThemeColors _themeColors;
        private List<StudyProblem> _problems = new List<StudyProblem>();
        private StudyProblem? _currentProblem;
        private DateTime _startTime;
        private System.Windows.Forms.Timer _timer;
        private int _elapsedSeconds = 0;

        #endregion

        #region Constructor

        public ProblemGeneratorControl(SettingsHandler settingsHandler)
        {
            _settingsHandler = settingsHandler;
            _timer = new System.Windows.Forms.Timer();
            _timer.Interval = 1000; // 1 second
            _timer.Tick += Timer_Tick;
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
                    lblApiStatus.Text = "API Ready";
                    lblApiStatus.ForeColor = Color.Green;
                }
                else
                {
                    lblApiStatus.Text = "Configure API Key";
                    lblApiStatus.ForeColor = Color.Red;
                }
            }
            catch (Exception ex)
            {
                lblApiStatus.Text = $"Error: {ex.Message}";
                lblApiStatus.ForeColor = Color.Red;
            }
        }

        private void InitializeControls()
        {
            // Initialize subject dropdown
            cmbSubject.Items.AddRange(new[] { "Math", "Physics", "Chemistry", "Biology", "Computer Science" });
            cmbSubject.SelectedIndex = 0;

            // Initialize difficulty dropdown
            cmbDifficulty.Items.AddRange(new[] { "Easy", "Medium", "Hard", "Expert" });
            cmbDifficulty.SelectedIndex = 1; // Default to Medium

            // Initialize count
            nudCount.Minimum = 1;
            nudCount.Maximum = 10;
            nudCount.Value = 3;

            UpdateButtonStates();
        }

        private void ApplyTheme()
        {
            if (_themeColors != null)
            {
                this.BackColor = _themeColors.Background;
                this.ForeColor = _themeColors.Text;
                
                groupGenerator.BackColor = _themeColors.Surface;
                groupProblem.BackColor = _themeColors.Surface;
                groupTimer.BackColor = _themeColors.Surface;
                
                txtProblem.BackColor = _themeColors.Background;
                txtProblem.ForeColor = _themeColors.Text;
                txtSolution.BackColor = _themeColors.Background;
                txtSolution.ForeColor = _themeColors.Text;
            }
        }

        #endregion

        #region Event Handlers

        private async void btnGenerate_Click(object sender, EventArgs e)
        {
            if (_geminiClient == null)
            {
                MessageBox.Show("Please configure your API key first.", "API Key Required", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            try
            {
                btnGenerate.Text = "Generating...";
                btnGenerate.Enabled = false;
                Cursor = Cursors.WaitCursor;

                var subject = cmbSubject.SelectedItem.ToString();
                var difficulty = cmbDifficulty.SelectedItem.ToString();
                var count = (int)nudCount.Value;

                var result = await _geminiClient.GenerateStudyProblemsAsync(subject, difficulty, count);
                
                // Parse the JSON response
                var problems = JsonConvert.DeserializeObject<List<dynamic>>(result);
                _problems.Clear();

                foreach (var problem in problems)
                {
                    _problems.Add(new StudyProblem
                    {
                        Subject = subject,
                        Difficulty = difficulty,
                        Question = problem.question?.ToString() ?? "Problem generation failed",
                        Solution = problem.solution?.ToString() ?? "Solution unavailable",
                        Steps = problem.steps?.ToString() ?? "Steps unavailable",
                        CreatedAt = DateTime.Now
                    });
                }

                if (_problems.Count > 0)
                {
                    LoadProblem(0);
                    UpdateNavigationButtons();
                }

                UpdateButtonStates();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error generating problems: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                btnGenerate.Text = "Generate Problems";
                btnGenerate.Enabled = true;
                Cursor = Cursors.Default;
            }
        }

        private void btnStartTimer_Click(object sender, EventArgs e)
        {
            if (_timer.Enabled)
            {
                // Stop timer
                _timer.Stop();
                btnStartTimer.Text = "Start Timer";
                btnStartTimer.BackColor = Color.FromArgb(76, 175, 80);
            }
            else
            {
                // Start timer
                _startTime = DateTime.Now;
                _elapsedSeconds = 0;
                _timer.Start();
                btnStartTimer.Text = "Stop Timer";
                btnStartTimer.BackColor = Color.FromArgb(244, 67, 54);
                UpdateTimerDisplay();
            }
        }

        private void btnShowSolution_Click(object sender, EventArgs e)
        {
            if (_currentProblem != null)
            {
                if (txtSolution.Visible)
                {
                    txtSolution.Visible = false;
                    btnShowSolution.Text = "Show Solution";
                }
                else
                {
                    txtSolution.Text = $"Solution: {_currentProblem.Solution}\n\nSteps:\n{_currentProblem.Steps}";
                    txtSolution.Visible = true;
                    btnShowSolution.Text = "Hide Solution";
                    
                    // Stop timer if running
                    if (_timer.Enabled)
                    {
                        _timer.Stop();
                        btnStartTimer.Text = "Start Timer";
                        btnStartTimer.BackColor = Color.FromArgb(76, 175, 80);
                        
                        // Save solve time
                        if (_currentProblem != null)
                        {
                            _currentProblem.SolveTimeSeconds = _elapsedSeconds;
                            _currentProblem.IsCompleted = true;
                        }
                    }
                }
            }
        }

        private void btnPrevious_Click(object sender, EventArgs e)
        {
            var currentIndex = _problems.IndexOf(_currentProblem);
            if (currentIndex > 0)
            {
                LoadProblem(currentIndex - 1);
                UpdateNavigationButtons();
            }
        }

        private void btnNext_Click(object sender, EventArgs e)
        {
            var currentIndex = _problems.IndexOf(_currentProblem);
            if (currentIndex < _problems.Count - 1)
            {
                LoadProblem(currentIndex + 1);
                UpdateNavigationButtons();
            }
        }

        private void Timer_Tick(object sender, EventArgs e)
        {
            _elapsedSeconds++;
            UpdateTimerDisplay();
        }

        private void cmbSubject_SelectedIndexChanged(object sender, EventArgs e)
        {
            UpdateButtonStates();
        }

        #endregion

        #region Helper Methods

        private void LoadProblem(int index)
        {
            if (index >= 0 && index < _problems.Count)
            {
                _currentProblem = _problems[index];
                txtProblem.Text = _currentProblem.Question;
                txtSolution.Visible = false;
                btnShowSolution.Text = "Show Solution";
                
                // Reset timer
                if (_timer.Enabled)
                {
                    _timer.Stop();
                    btnStartTimer.Text = "Start Timer";
                    btnStartTimer.BackColor = Color.FromArgb(76, 175, 80);
                }
                _elapsedSeconds = 0;
                UpdateTimerDisplay();
                
                lblProblemInfo.Text = $"Problem {index + 1} of {_problems.Count} - {_currentProblem.Subject} ({_currentProblem.Difficulty})";
            }
        }

        private void UpdateNavigationButtons()
        {
            if (_currentProblem != null && _problems.Count > 0)
            {
                var currentIndex = _problems.IndexOf(_currentProblem);
                btnPrevious.Enabled = currentIndex > 0;
                btnNext.Enabled = currentIndex < _problems.Count - 1;
            }
        }

        private void UpdateButtonStates()
        {
            bool hasApiKey = !string.IsNullOrWhiteSpace(_currentApiKey);
            bool hasSubject = cmbSubject.SelectedItem != null;
            
            btnGenerate.Enabled = hasApiKey && hasSubject;
            btnStartTimer.Enabled = _currentProblem != null;
            btnShowSolution.Enabled = _currentProblem != null;
        }

        private void UpdateTimerDisplay()
        {
            var minutes = _elapsedSeconds / 60;
            var seconds = _elapsedSeconds % 60;
            lblTimer.Text = $"{minutes:D2}:{seconds:D2}";
        }

        #endregion

        #region Designer Code

        private void InitializeComponent()
        {
            this.tableLayoutMain = new TableLayoutPanel();
            this.groupGenerator = new GroupBox();
            this.lblSubject = new Label();
            this.cmbSubject = new ComboBox();
            this.lblDifficulty = new Label();
            this.cmbDifficulty = new ComboBox();
            this.lblCount = new Label();
            this.nudCount = new NumericUpDown();
            this.btnGenerate = new Button();
            this.lblApiStatus = new Label();
            this.groupProblem = new GroupBox();
            this.lblProblemInfo = new Label();
            this.txtProblem = new TextBox();
            this.txtSolution = new TextBox();
            this.panelProblemActions = new Panel();
            this.btnShowSolution = new Button();
            this.btnPrevious = new Button();
            this.btnNext = new Button();
            this.groupTimer = new GroupBox();
            this.lblTimer = new Label();
            this.btnStartTimer = new Button();
            this.lblTimerInfo = new Label();

            this.tableLayoutMain.SuspendLayout();
            this.groupGenerator.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudCount)).BeginInit();
            this.groupProblem.SuspendLayout();
            this.panelProblemActions.SuspendLayout();
            this.groupTimer.SuspendLayout();
            this.SuspendLayout();

            // tableLayoutMain
            this.tableLayoutMain.ColumnCount = 2;
            this.tableLayoutMain.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 300F));
            this.tableLayoutMain.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100F));
            this.tableLayoutMain.Controls.Add(this.groupGenerator, 0, 0);
            this.tableLayoutMain.Controls.Add(this.groupTimer, 0, 1);
            this.tableLayoutMain.Controls.Add(this.groupProblem, 1, 0);
            this.tableLayoutMain.Dock = DockStyle.Fill;
            this.tableLayoutMain.Name = "tableLayoutMain";
            this.tableLayoutMain.RowCount = 2;
            this.tableLayoutMain.RowStyles.Add(new RowStyle(SizeType.Percent, 70F));
            this.tableLayoutMain.RowStyles.Add(new RowStyle(SizeType.Percent, 30F));
            this.tableLayoutMain.SetRowSpan(this.groupProblem, 2);
            this.tableLayoutMain.Size = new Size(1000, 700);
            this.tableLayoutMain.TabIndex = 0;

            // groupGenerator
            this.groupGenerator.Controls.Add(this.lblSubject);
            this.groupGenerator.Controls.Add(this.cmbSubject);
            this.groupGenerator.Controls.Add(this.lblDifficulty);
            this.groupGenerator.Controls.Add(this.cmbDifficulty);
            this.groupGenerator.Controls.Add(this.lblCount);
            this.groupGenerator.Controls.Add(this.nudCount);
            this.groupGenerator.Controls.Add(this.btnGenerate);
            this.groupGenerator.Controls.Add(this.lblApiStatus);
            this.groupGenerator.Dock = DockStyle.Fill;
            this.groupGenerator.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.groupGenerator.Location = new Point(4, 4);
            this.groupGenerator.Name = "groupGenerator";
            this.groupGenerator.Padding = new Padding(15);
            this.groupGenerator.Size = new Size(292, 482);
            this.groupGenerator.TabIndex = 0;
            this.groupGenerator.TabStop = false;
            this.groupGenerator.Text = "Problem Generator";

            // lblSubject
            this.lblSubject.AutoSize = true;
            this.lblSubject.Font = new Font("Segoe UI", 10F);
            this.lblSubject.Location = new Point(20, 40);
            this.lblSubject.Name = "lblSubject";
            this.lblSubject.Size = new Size(54, 19);
            this.lblSubject.Text = "Subject:";

            // cmbSubject
            this.cmbSubject.DropDownStyle = ComboBoxStyle.DropDownList;
            this.cmbSubject.Font = new Font("Segoe UI", 10F);
            this.cmbSubject.Location = new Point(20, 65);
            this.cmbSubject.Name = "cmbSubject";
            this.cmbSubject.Size = new Size(250, 25);
            this.cmbSubject.TabIndex = 1;
            this.cmbSubject.SelectedIndexChanged += this.cmbSubject_SelectedIndexChanged;

            // lblDifficulty
            this.lblDifficulty.AutoSize = true;
            this.lblDifficulty.Font = new Font("Segoe UI", 10F);
            this.lblDifficulty.Location = new Point(20, 100);
            this.lblDifficulty.Name = "lblDifficulty";
            this.lblDifficulty.Size = new Size(69, 19);
            this.lblDifficulty.Text = "Difficulty:";

            // cmbDifficulty
            this.cmbDifficulty.DropDownStyle = ComboBoxStyle.DropDownList;
            this.cmbDifficulty.Font = new Font("Segoe UI", 10F);
            this.cmbDifficulty.Location = new Point(20, 125);
            this.cmbDifficulty.Name = "cmbDifficulty";
            this.cmbDifficulty.Size = new Size(250, 25);
            this.cmbDifficulty.TabIndex = 3;

            // lblCount
            this.lblCount.AutoSize = true;
            this.lblCount.Font = new Font("Segoe UI", 10F);
            this.lblCount.Location = new Point(20, 160);
            this.lblCount.Name = "lblCount";
            this.lblCount.Size = new Size(119, 19);
            this.lblCount.Text = "Number of Problems:";

            // nudCount
            this.nudCount.Font = new Font("Segoe UI", 10F);
            this.nudCount.Location = new Point(20, 185);
            this.nudCount.Name = "nudCount";
            this.nudCount.Size = new Size(120, 25);
            this.nudCount.TabIndex = 5;

            // btnGenerate
            this.btnGenerate.BackColor = Color.FromArgb(33, 150, 243);
            this.btnGenerate.FlatStyle = FlatStyle.Flat;
            this.btnGenerate.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.btnGenerate.ForeColor = Color.White;
            this.btnGenerate.Location = new Point(20, 230);
            this.btnGenerate.Name = "btnGenerate";
            this.btnGenerate.Size = new Size(250, 40);
            this.btnGenerate.Text = "Generate Problems";
            this.btnGenerate.UseVisualStyleBackColor = false;
            this.btnGenerate.Click += this.btnGenerate_Click;

            // lblApiStatus
            this.lblApiStatus.AutoSize = true;
            this.lblApiStatus.Font = new Font("Segoe UI", 9F);
            this.lblApiStatus.Location = new Point(20, 285);
            this.lblApiStatus.Name = "lblApiStatus";
            this.lblApiStatus.Size = new Size(75, 15);
            this.lblApiStatus.Text = "API Status: --";

            // groupTimer
            this.groupTimer.Controls.Add(this.lblTimer);
            this.groupTimer.Controls.Add(this.btnStartTimer);
            this.groupTimer.Controls.Add(this.lblTimerInfo);
            this.groupTimer.Dock = DockStyle.Fill;
            this.groupTimer.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.groupTimer.Location = new Point(4, 492);
            this.groupTimer.Name = "groupTimer";
            this.groupTimer.Padding = new Padding(15);
            this.groupTimer.Size = new Size(292, 204);
            this.groupTimer.TabIndex = 1;
            this.groupTimer.TabStop = false;
            this.groupTimer.Text = "Solve Timer";

            // lblTimer
            this.lblTimer.Font = new Font("Segoe UI", 24F, FontStyle.Bold);
            this.lblTimer.ForeColor = Color.FromArgb(33, 150, 243);
            this.lblTimer.Location = new Point(20, 40);
            this.lblTimer.Name = "lblTimer";
            this.lblTimer.Size = new Size(250, 50);
            this.lblTimer.Text = "00:00";
            this.lblTimer.TextAlign = ContentAlignment.MiddleCenter;

            // btnStartTimer
            this.btnStartTimer.BackColor = Color.FromArgb(76, 175, 80);
            this.btnStartTimer.Enabled = false;
            this.btnStartTimer.FlatStyle = FlatStyle.Flat;
            this.btnStartTimer.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.btnStartTimer.ForeColor = Color.White;
            this.btnStartTimer.Location = new Point(70, 100);
            this.btnStartTimer.Name = "btnStartTimer";
            this.btnStartTimer.Size = new Size(150, 35);
            this.btnStartTimer.Text = "Start Timer";
            this.btnStartTimer.UseVisualStyleBackColor = false;
            this.btnStartTimer.Click += this.btnStartTimer_Click;

            // lblTimerInfo
            this.lblTimerInfo.Font = new Font("Segoe UI", 9F);
            this.lblTimerInfo.ForeColor = Color.Gray;
            this.lblTimerInfo.Location = new Point(20, 145);
            this.lblTimerInfo.Name = "lblTimerInfo";
            this.lblTimerInfo.Size = new Size(250, 40);
            this.lblTimerInfo.Text = "Track your solving time for each problem";
            this.lblTimerInfo.TextAlign = ContentAlignment.MiddleCenter;

            // groupProblem
            this.groupProblem.Controls.Add(this.lblProblemInfo);
            this.groupProblem.Controls.Add(this.txtProblem);
            this.groupProblem.Controls.Add(this.txtSolution);
            this.groupProblem.Controls.Add(this.panelProblemActions);
            this.groupProblem.Dock = DockStyle.Fill;
            this.groupProblem.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.groupProblem.Location = new Point(304, 4);
            this.groupProblem.Name = "groupProblem";
            this.groupProblem.Padding = new Padding(15);
            this.groupProblem.Size = new Size(692, 692);
            this.groupProblem.TabIndex = 2;
            this.groupProblem.TabStop = false;
            this.groupProblem.Text = "Problem Display";

            // lblProblemInfo
            this.lblProblemInfo.AutoSize = true;
            this.lblProblemInfo.Font = new Font("Segoe UI", 10F);
            this.lblProblemInfo.ForeColor = Color.Gray;
            this.lblProblemInfo.Location = new Point(20, 35);
            this.lblProblemInfo.Name = "lblProblemInfo";
            this.lblProblemInfo.Size = new Size(200, 19);
            this.lblProblemInfo.Text = "Generate problems to start";

            // txtProblem
            this.txtProblem.Font = new Font("Segoe UI", 12F);
            this.txtProblem.Location = new Point(20, 65);
            this.txtProblem.Multiline = true;
            this.txtProblem.Name = "txtProblem";
            this.txtProblem.ReadOnly = true;
            this.txtProblem.ScrollBars = ScrollBars.Vertical;
            this.txtProblem.Size = new Size(650, 250);
            this.txtProblem.TabIndex = 1;
            this.txtProblem.Text = "No problem loaded. Generate problems to begin.";

            // txtSolution
            this.txtSolution.Font = new Font("Segoe UI", 11F);
            this.txtSolution.Location = new Point(20, 370);
            this.txtSolution.Multiline = true;
            this.txtSolution.Name = "txtSolution";
            this.txtSolution.ReadOnly = true;
            this.txtSolution.ScrollBars = ScrollBars.Vertical;
            this.txtSolution.Size = new Size(650, 250);
            this.txtSolution.TabIndex = 2;
            this.txtSolution.Visible = false;

            // panelProblemActions
            this.panelProblemActions.Controls.Add(this.btnShowSolution);
            this.panelProblemActions.Controls.Add(this.btnPrevious);
            this.panelProblemActions.Controls.Add(this.btnNext);
            this.panelProblemActions.Location = new Point(20, 325);
            this.panelProblemActions.Name = "panelProblemActions";
            this.panelProblemActions.Size = new Size(650, 40);
            this.panelProblemActions.TabIndex = 3;

            // btnShowSolution
            this.btnShowSolution.BackColor = Color.FromArgb(255, 152, 0);
            this.btnShowSolution.Enabled = false;
            this.btnShowSolution.FlatStyle = FlatStyle.Flat;
            this.btnShowSolution.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.btnShowSolution.ForeColor = Color.White;
            this.btnShowSolution.Location = new Point(275, 5);
            this.btnShowSolution.Name = "btnShowSolution";
            this.btnShowSolution.Size = new Size(120, 30);
            this.btnShowSolution.Text = "Show Solution";
            this.btnShowSolution.UseVisualStyleBackColor = false;
            this.btnShowSolution.Click += this.btnShowSolution_Click;

            // btnPrevious
            this.btnPrevious.BackColor = Color.FromArgb(158, 158, 158);
            this.btnPrevious.Enabled = false;
            this.btnPrevious.FlatStyle = FlatStyle.Flat;
            this.btnPrevious.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.btnPrevious.ForeColor = Color.White;
            this.btnPrevious.Location = new Point(0, 5);
            this.btnPrevious.Name = "btnPrevious";
            this.btnPrevious.Size = new Size(100, 30);
            this.btnPrevious.Text = "< Previous";
            this.btnPrevious.UseVisualStyleBackColor = false;
            this.btnPrevious.Click += this.btnPrevious_Click;

            // btnNext
            this.btnNext.BackColor = Color.FromArgb(158, 158, 158);
            this.btnNext.Enabled = false;
            this.btnNext.FlatStyle = FlatStyle.Flat;
            this.btnNext.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.btnNext.ForeColor = Color.White;
            this.btnNext.Location = new Point(550, 5);
            this.btnNext.Name = "btnNext";
            this.btnNext.Size = new Size(100, 30);
            this.btnNext.Text = "Next >";
            this.btnNext.UseVisualStyleBackColor = false;
            this.btnNext.Click += this.btnNext_Click;

            // ProblemGeneratorControl
            this.Controls.Add(this.tableLayoutMain);
            this.Name = "ProblemGeneratorControl";
            this.Size = new Size(1000, 700);

            this.tableLayoutMain.ResumeLayout(false);
            this.groupGenerator.ResumeLayout(false);
            this.groupGenerator.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudCount)).EndInit();
            this.groupProblem.ResumeLayout(false);
            this.groupProblem.PerformLayout();
            this.panelProblemActions.ResumeLayout(false);
            this.groupTimer.ResumeLayout(false);
            this.ResumeLayout(false);
        }

        #endregion

        #region Controls

        private TableLayoutPanel tableLayoutMain;
        private GroupBox groupGenerator;
        private Label lblSubject;
        private ComboBox cmbSubject;
        private Label lblDifficulty;
        private ComboBox cmbDifficulty;
        private Label lblCount;
        private NumericUpDown nudCount;
        private Button btnGenerate;
        private Label lblApiStatus;
        private GroupBox groupTimer;
        private Label lblTimer;
        private Button btnStartTimer;
        private Label lblTimerInfo;
        private GroupBox groupProblem;
        private Label lblProblemInfo;
        private TextBox txtProblem;
        private TextBox txtSolution;
        private Panel panelProblemActions;
        private Button btnShowSolution;
        private Button btnPrevious;
        private Button btnNext;

        #endregion
    }
}