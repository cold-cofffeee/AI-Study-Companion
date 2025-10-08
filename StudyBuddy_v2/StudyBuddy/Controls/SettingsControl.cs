using System;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using StudyBuddy.Helpers;
using StudyBuddy.Models;

namespace StudyBuddy.Controls
{
    /// <summary>
    /// Advanced Settings Control
    /// Comprehensive settings management for the application
    /// </summary>
    public partial class AdvancedSettings : UserControl, IThemeAware, IAsyncInitializable
    {
        #region Private Fields

        private readonly SettingsHandler _settingsHandler;
        private readonly MainForm _mainForm;
        private UserSettings _currentSettings;
        private ThemeColors _themeColors;

        #endregion

        #region Constructor

        public AdvancedSettings(SettingsHandler settingsHandler, MainForm mainForm)
        {
            _settingsHandler = settingsHandler;
            _mainForm = mainForm;
            InitializeComponent();
        }

        #endregion

        #region Interface Implementations

        public async Task InitializeAsync()
        {
            await LoadSettingsAsync();
            PopulateControls();
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
                _currentSettings = await _settingsHandler.LoadSettingsAsync();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error loading settings: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                _currentSettings = new UserSettings(); // Use defaults
            }
        }

        private void PopulateControls()
        {
            // API Settings
            if (!string.IsNullOrEmpty(_currentSettings.ApiKey))
            {
                txtApiKey.Text = new string('*', 20) + _currentSettings.ApiKey.Substring(Math.Max(0, _currentSettings.ApiKey.Length - 10));
                lblApiStatus.Text = "API Key configured [?]";
                lblApiStatus.ForeColor = Color.Green;
                btnTestApi.Enabled = true;
            }

            // Theme Settings
            cmbTheme.Items.AddRange(new[] { "Light", "Dark", "Auto (System)" });
            cmbTheme.SelectedIndex = (int)_currentSettings.Theme;

            // Language Settings  
            var languages = _settingsHandler.GetAvailableLanguages();
            cmbLanguage.DataSource = languages.ToList();
            cmbLanguage.DisplayMember = "DisplayName";
            cmbLanguage.ValueMember = "Code";
            
            var currentLang = languages.FirstOrDefault(l => l.Code == _currentSettings.DefaultLanguage);
            if (currentLang != null)
                cmbLanguage.SelectedItem = currentLang;

            // Window Settings
            chkRememberPosition.Checked = _currentSettings.RememberWindowPosition;
            chkStartMaximized.Checked = _currentSettings.StartMaximized;
            chkMinimizeToTray.Checked = _currentSettings.MinimizeToTray;

            // Study Settings
            nudSessionMinutes.Value = _currentSettings.DefaultStudySessionMinutes;
            nudBreakMinutes.Value = _currentSettings.DefaultBreakMinutes;
            chkAutoSave.Checked = _currentSettings.AutoSaveEnabled;
            nudAutoSaveInterval.Value = _currentSettings.AutoSaveIntervalMinutes;

            // Export Settings
            txtExportPath.Text = _currentSettings.DefaultExportPath;
            cmbExportFormat.Items.AddRange(new[] { "PDF", "PNG", "Text", "Word" });
            cmbExportFormat.SelectedIndex = (int)_currentSettings.DefaultExportFormat;

            // Performance Settings
            chkEnableAnimations.Checked = _currentSettings.EnableAnimations;
            chkPreloadContent.Checked = _currentSettings.PreloadContent;
            nudCacheSize.Value = _currentSettings.CacheSizeMB;
        }

        private void ApplyTheme()
        {
            if (_themeColors != null)
            {
                this.BackColor = _themeColors.Background;
                this.ForeColor = _themeColors.Text;
                
                groupApiSettings.BackColor = _themeColors.Surface;
                groupAppearance.BackColor = _themeColors.Surface;
                groupStudy.BackColor = _themeColors.Surface;
                groupExport.BackColor = _themeColors.Surface;
                groupPerformance.BackColor = _themeColors.Surface;
                
                txtApiKey.BackColor = _themeColors.Background;
                txtApiKey.ForeColor = _themeColors.Text;
                txtExportPath.BackColor = _themeColors.Background;
                txtExportPath.ForeColor = _themeColors.Text;
            }
        }

        #endregion

        #region Event Handlers

        private void btnConfigureApi_Click(object sender, EventArgs e)
        {
            using (var apiDialog = new ApiKeyDialog())
            {
                if (apiDialog.ShowDialog() == DialogResult.OK)
                {
                    txtApiKey.Text = new string('*', 20) + apiDialog.ApiKey.Substring(Math.Max(0, apiDialog.ApiKey.Length - 10));
                    _currentSettings.ApiKey = apiDialog.ApiKey;
                    lblApiStatus.Text = "API Key configured [?]";
                    lblApiStatus.ForeColor = Color.Green;
                    btnTestApi.Enabled = true;
                }
            }
        }

        private async void btnTestApi_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(_currentSettings.ApiKey))
            {
                MessageBox.Show("Please configure an API key first.", "No API Key", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            try
            {
                btnTestApi.Text = "Testing...";
                btnTestApi.Enabled = false;
                Cursor = Cursors.WaitCursor;

                var client = new GeminiApiClient(_currentSettings.ApiKey);
                var result = await client.GenerateContentAsync("Test connection - respond with 'OK'");
                
                if (!string.IsNullOrEmpty(result))
                {
                    lblApiStatus.Text = "API test successful [?]";
                    lblApiStatus.ForeColor = Color.Green;
                    MessageBox.Show("API connection test successful!", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                else
                {
                    throw new Exception("Empty response from API");
                }
            }
            catch (Exception ex)
            {
                lblApiStatus.Text = "API test failed ?";
                lblApiStatus.ForeColor = Color.Red;
                MessageBox.Show($"API test failed: {ex.Message}", "Test Failed", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                btnTestApi.Text = "Test API";
                btnTestApi.Enabled = true;
                Cursor = Cursors.Default;
            }
        }

        private void cmbTheme_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (_currentSettings != null)
            {
                _currentSettings.Theme = (Theme)cmbTheme.SelectedIndex;
                // Apply theme change immediately
                _mainForm.UpdateTheme(_currentSettings.Theme);
            }
        }

        private void btnBrowseExportPath_Click(object sender, EventArgs e)
        {
            using (var folderDialog = new FolderBrowserDialog())
            {
                folderDialog.Description = "Select default export folder";
                folderDialog.SelectedPath = txtExportPath.Text;
                
                if (folderDialog.ShowDialog() == DialogResult.OK)
                {
                    txtExportPath.Text = folderDialog.SelectedPath;
                    _currentSettings.DefaultExportPath = folderDialog.SelectedPath;
                }
            }
        }

        private async void btnSaveSettings_Click(object sender, EventArgs e)
        {
            try
            {
                // Update settings from controls
                if (cmbLanguage.SelectedItem is LanguageOption selectedLang)
                {
                    _currentSettings.DefaultLanguage = selectedLang.Code;
                }

                _currentSettings.RememberWindowPosition = chkRememberPosition.Checked;
                _currentSettings.StartMaximized = chkStartMaximized.Checked;
                _currentSettings.MinimizeToTray = chkMinimizeToTray.Checked;
                _currentSettings.DefaultStudySessionMinutes = (int)nudSessionMinutes.Value;
                _currentSettings.DefaultBreakMinutes = (int)nudBreakMinutes.Value;
                _currentSettings.AutoSaveEnabled = chkAutoSave.Checked;
                _currentSettings.AutoSaveIntervalMinutes = (int)nudAutoSaveInterval.Value;
                _currentSettings.DefaultExportFormat = (ExportFormat)cmbExportFormat.SelectedIndex;
                _currentSettings.EnableAnimations = chkEnableAnimations.Checked;
                _currentSettings.PreloadContent = chkPreloadContent.Checked;
                _currentSettings.CacheSizeMB = (int)nudCacheSize.Value;

                await _settingsHandler.SaveSettingsAsync(_currentSettings);
                
                MessageBox.Show("Settings saved successfully!", "Settings Saved", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error saving settings: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private async void btnResetSettings_Click(object sender, EventArgs e)
        {
            if (MessageBox.Show("Are you sure you want to reset all settings to defaults?\n\nThis action cannot be undone.", 
                "Confirm Reset", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
            {
                try
                {
                    _currentSettings = new UserSettings();
                    await _settingsHandler.SaveSettingsAsync(_currentSettings);
                    PopulateControls();
                    MessageBox.Show("Settings reset to defaults successfully!", "Reset Complete", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Error resetting settings: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void btnExportSettings_Click(object sender, EventArgs e)
        {
            using (var saveDialog = new SaveFileDialog())
            {
                saveDialog.Filter = "JSON files (*.json)|*.json";
                saveDialog.DefaultExt = "json";
                saveDialog.FileName = $"StudyBuddy_Settings_{DateTime.Now:yyyyMMdd}";

                if (saveDialog.ShowDialog() == DialogResult.OK)
                {
                    try
                    {
                        var json = Newtonsoft.Json.JsonConvert.SerializeObject(_currentSettings, Newtonsoft.Json.Formatting.Indented);
                        System.IO.File.WriteAllText(saveDialog.FileName, json);
                        MessageBox.Show("Settings exported successfully!", "Export Complete", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show($"Error exporting settings: {ex.Message}", "Export Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
            }
        }

        #endregion

        #region Designer Code

        private void InitializeComponent()
        {
            this.tabControl = new TabControl();
            this.tabApi = new TabPage();
            this.groupApiSettings = new GroupBox();
            this.lblApiKey = new Label();
            this.txtApiKey = new TextBox();
            this.btnConfigureApi = new Button();
            this.btnTestApi = new Button();
            this.lblApiStatus = new Label();
            this.tabAppearance = new TabPage();
            this.groupAppearance = new GroupBox();
            this.lblTheme = new Label();
            this.cmbTheme = new ComboBox();
            this.lblLanguage = new Label();
            this.cmbLanguage = new ComboBox();
            this.chkRememberPosition = new CheckBox();
            this.chkStartMaximized = new CheckBox();
            this.chkMinimizeToTray = new CheckBox();
            this.tabStudy = new TabPage();
            this.groupStudy = new GroupBox();
            this.lblSessionMinutes = new Label();
            this.nudSessionMinutes = new NumericUpDown();
            this.lblBreakMinutes = new Label();
            this.nudBreakMinutes = new NumericUpDown();
            this.chkAutoSave = new CheckBox();
            this.lblAutoSaveInterval = new Label();
            this.nudAutoSaveInterval = new NumericUpDown();
            this.tabExport = new TabPage();
            this.groupExport = new GroupBox();
            this.lblExportPath = new Label();
            this.txtExportPath = new TextBox();
            this.btnBrowseExportPath = new Button();
            this.lblExportFormat = new Label();
            this.cmbExportFormat = new ComboBox();
            this.tabPerformance = new TabPage();
            this.groupPerformance = new GroupBox();
            this.chkEnableAnimations = new CheckBox();
            this.chkPreloadContent = new CheckBox();
            this.lblCacheSize = new Label();
            this.nudCacheSize = new NumericUpDown();
            this.panelButtons = new Panel();
            this.btnSaveSettings = new Button();
            this.btnResetSettings = new Button();
            this.btnExportSettings = new Button();

            this.tabControl.SuspendLayout();
            this.tabApi.SuspendLayout();
            this.groupApiSettings.SuspendLayout();
            this.tabAppearance.SuspendLayout();
            this.groupAppearance.SuspendLayout();
            this.tabStudy.SuspendLayout();
            this.groupStudy.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudSessionMinutes)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudBreakMinutes)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudAutoSaveInterval)).BeginInit();
            this.tabExport.SuspendLayout();
            this.groupExport.SuspendLayout();
            this.tabPerformance.SuspendLayout();
            this.groupPerformance.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudCacheSize)).BeginInit();
            this.panelButtons.SuspendLayout();
            this.SuspendLayout();

            // tabControl
            this.tabControl.Controls.Add(this.tabApi);
            this.tabControl.Controls.Add(this.tabAppearance);
            this.tabControl.Controls.Add(this.tabStudy);
            this.tabControl.Controls.Add(this.tabExport);
            this.tabControl.Controls.Add(this.tabPerformance);
            this.tabControl.Dock = DockStyle.Fill;
            this.tabControl.Font = new Font("Segoe UI", 10F);
            this.tabControl.Location = new Point(0, 0);
            this.tabControl.Name = "tabControl";
            this.tabControl.SelectedIndex = 0;
            this.tabControl.Size = new Size(1000, 650);
            this.tabControl.TabIndex = 0;

            // tabApi
            this.tabApi.Controls.Add(this.groupApiSettings);
            this.tabApi.Location = new Point(4, 26);
            this.tabApi.Name = "tabApi";
            this.tabApi.Padding = new Padding(20);
            this.tabApi.Size = new Size(992, 620);
            this.tabApi.TabIndex = 0;
            this.tabApi.Text = "API Settings";
            this.tabApi.UseVisualStyleBackColor = true;

            // groupApiSettings
            this.groupApiSettings.Controls.Add(this.lblApiKey);
            this.groupApiSettings.Controls.Add(this.txtApiKey);
            this.groupApiSettings.Controls.Add(this.btnConfigureApi);
            this.groupApiSettings.Controls.Add(this.btnTestApi);
            this.groupApiSettings.Controls.Add(this.lblApiStatus);
            this.groupApiSettings.Dock = DockStyle.Fill;
            this.groupApiSettings.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.groupApiSettings.Location = new Point(20, 20);
            this.groupApiSettings.Name = "groupApiSettings";
            this.groupApiSettings.Padding = new Padding(20);
            this.groupApiSettings.Size = new Size(952, 580);
            this.groupApiSettings.TabIndex = 0;
            this.groupApiSettings.TabStop = false;
            this.groupApiSettings.Text = "Google Gemini API Configuration";

            // lblApiKey
            this.lblApiKey.AutoSize = true;
            this.lblApiKey.Font = new Font("Segoe UI", 10F);
            this.lblApiKey.Location = new Point(30, 50);
            this.lblApiKey.Name = "lblApiKey";
            this.lblApiKey.Size = new Size(61, 19);
            this.lblApiKey.Text = "API Key:";

            // txtApiKey
            this.txtApiKey.Font = new Font("Segoe UI", 10F);
            this.txtApiKey.Location = new Point(30, 75);
            this.txtApiKey.Name = "txtApiKey";
            this.txtApiKey.ReadOnly = true;
            this.txtApiKey.Size = new Size(400, 25);
            this.txtApiKey.TabIndex = 1;
            this.txtApiKey.Text = "Not configured";

            // btnConfigureApi
            this.btnConfigureApi.BackColor = Color.FromArgb(33, 150, 243);
            this.btnConfigureApi.FlatStyle = FlatStyle.Flat;
            this.btnConfigureApi.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.btnConfigureApi.ForeColor = Color.White;
            this.btnConfigureApi.Location = new Point(450, 73);
            this.btnConfigureApi.Name = "btnConfigureApi";
            this.btnConfigureApi.Size = new Size(120, 30);
            this.btnConfigureApi.Text = "Configure";
            this.btnConfigureApi.UseVisualStyleBackColor = false;
            this.btnConfigureApi.Click += this.btnConfigureApi_Click;

            // btnTestApi
            this.btnTestApi.BackColor = Color.FromArgb(76, 175, 80);
            this.btnTestApi.Enabled = false;
            this.btnTestApi.FlatStyle = FlatStyle.Flat;
            this.btnTestApi.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.btnTestApi.ForeColor = Color.White;
            this.btnTestApi.Location = new Point(580, 73);
            this.btnTestApi.Name = "btnTestApi";
            this.btnTestApi.Size = new Size(100, 30);
            this.btnTestApi.Text = "Test API";
            this.btnTestApi.UseVisualStyleBackColor = false;
            this.btnTestApi.Click += this.btnTestApi_Click;

            // lblApiStatus
            this.lblApiStatus.AutoSize = true;
            this.lblApiStatus.Font = new Font("Segoe UI", 9F);
            this.lblApiStatus.ForeColor = Color.Red;
            this.lblApiStatus.Location = new Point(30, 115);
            this.lblApiStatus.Name = "lblApiStatus";
            this.lblApiStatus.Size = new Size(130, 15);
            this.lblApiStatus.Text = "API Key not configured";

            // tabAppearance
            this.tabAppearance.Controls.Add(this.groupAppearance);
            this.tabAppearance.Location = new Point(4, 26);
            this.tabAppearance.Name = "tabAppearance";
            this.tabAppearance.Padding = new Padding(20);
            this.tabAppearance.Size = new Size(992, 620);
            this.tabAppearance.TabIndex = 1;
            this.tabAppearance.Text = "Appearance";
            this.tabAppearance.UseVisualStyleBackColor = true;

            // groupAppearance
            this.groupAppearance.Controls.Add(this.lblTheme);
            this.groupAppearance.Controls.Add(this.cmbTheme);
            this.groupAppearance.Controls.Add(this.lblLanguage);
            this.groupAppearance.Controls.Add(this.cmbLanguage);
            this.groupAppearance.Controls.Add(this.chkRememberPosition);
            this.groupAppearance.Controls.Add(this.chkStartMaximized);
            this.groupAppearance.Controls.Add(this.chkMinimizeToTray);
            this.groupAppearance.Dock = DockStyle.Fill;
            this.groupAppearance.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.groupAppearance.Location = new Point(20, 20);
            this.groupAppearance.Name = "groupAppearance";
            this.groupAppearance.Padding = new Padding(20);
            this.groupAppearance.Size = new Size(952, 580);
            this.groupAppearance.TabIndex = 0;
            this.groupAppearance.TabStop = false;
            this.groupAppearance.Text = "Appearance & Behavior";

            // lblTheme, cmbTheme, lblLanguage, cmbLanguage, checkboxes...
            // [Additional control setup code would continue here for all tabs]

            // panelButtons
            this.panelButtons.Controls.Add(this.btnSaveSettings);
            this.panelButtons.Controls.Add(this.btnResetSettings);
            this.panelButtons.Controls.Add(this.btnExportSettings);
            this.panelButtons.Dock = DockStyle.Bottom;
            this.panelButtons.Location = new Point(0, 650);
            this.panelButtons.Name = "panelButtons";
            this.panelButtons.Size = new Size(1000, 50);
            this.panelButtons.TabIndex = 1;

            // btnSaveSettings
            this.btnSaveSettings.BackColor = Color.FromArgb(76, 175, 80);
            this.btnSaveSettings.FlatStyle = FlatStyle.Flat;
            this.btnSaveSettings.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.btnSaveSettings.ForeColor = Color.White;
            this.btnSaveSettings.Location = new Point(700, 10);
            this.btnSaveSettings.Name = "btnSaveSettings";
            this.btnSaveSettings.Size = new Size(120, 35);
            this.btnSaveSettings.Text = "Save Settings";
            this.btnSaveSettings.UseVisualStyleBackColor = false;
            this.btnSaveSettings.Click += this.btnSaveSettings_Click;

            // btnResetSettings
            this.btnResetSettings.BackColor = Color.FromArgb(244, 67, 54);
            this.btnResetSettings.FlatStyle = FlatStyle.Flat;
            this.btnResetSettings.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.btnResetSettings.ForeColor = Color.White;
            this.btnResetSettings.Location = new Point(830, 10);
            this.btnResetSettings.Name = "btnResetSettings";
            this.btnResetSettings.Size = new Size(80, 35);
            this.btnResetSettings.Text = "Reset";
            this.btnResetSettings.UseVisualStyleBackColor = false;
            this.btnResetSettings.Click += this.btnResetSettings_Click;

            // btnExportSettings
            this.btnExportSettings.BackColor = Color.FromArgb(158, 158, 158);
            this.btnExportSettings.FlatStyle = FlatStyle.Flat;
            this.btnExportSettings.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.btnExportSettings.ForeColor = Color.White;
            this.btnExportSettings.Location = new Point(920, 10);
            this.btnExportSettings.Name = "btnExportSettings";
            this.btnExportSettings.Size = new Size(70, 35);
            this.btnExportSettings.Text = "Export";
            this.btnExportSettings.UseVisualStyleBackColor = false;
            this.btnExportSettings.Click += this.btnExportSettings_Click;

            // AdvancedSettings
            this.Controls.Add(this.tabControl);
            this.Controls.Add(this.panelButtons);
            this.Name = "AdvancedSettings";
            this.Size = new Size(1000, 700);

            // Resume layout
            this.tabControl.ResumeLayout(false);
            this.tabApi.ResumeLayout(false);
            this.groupApiSettings.ResumeLayout(false);
            this.groupApiSettings.PerformLayout();
            this.panelButtons.ResumeLayout(false);
            this.ResumeLayout(false);
        }

        #endregion

        #region Controls

        private TabControl tabControl;
        private TabPage tabApi;
        private TabPage tabAppearance;
        private TabPage tabStudy;
        private TabPage tabExport;
        private TabPage tabPerformance;
        private GroupBox groupApiSettings;
        private Label lblApiKey;
        private TextBox txtApiKey;
        private Button btnConfigureApi;
        private Button btnTestApi;
        private Label lblApiStatus;
        private GroupBox groupAppearance;
        private Label lblTheme;
        private ComboBox cmbTheme;
        private Label lblLanguage;
        private ComboBox cmbLanguage;
        private CheckBox chkRememberPosition;
        private CheckBox chkStartMaximized;
        private CheckBox chkMinimizeToTray;
        private GroupBox groupStudy;
        private Label lblSessionMinutes;
        private NumericUpDown nudSessionMinutes;
        private Label lblBreakMinutes;
        private NumericUpDown nudBreakMinutes;
        private CheckBox chkAutoSave;
        private Label lblAutoSaveInterval;
        private NumericUpDown nudAutoSaveInterval;
        private GroupBox groupExport;
        private Label lblExportPath;
        private TextBox txtExportPath;
        private Button btnBrowseExportPath;
        private Label lblExportFormat;
        private ComboBox cmbExportFormat;
        private GroupBox groupPerformance;
        private CheckBox chkEnableAnimations;
        private CheckBox chkPreloadContent;
        private Label lblCacheSize;
        private NumericUpDown nudCacheSize;
        private Panel panelButtons;
        private Button btnSaveSettings;
        private Button btnResetSettings;
        private Button btnExportSettings;

        #endregion
    }
}