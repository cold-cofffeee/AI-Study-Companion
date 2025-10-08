using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;
using StudyBuddy.Helpers;
using StudyBuddy.Models;

namespace StudyBuddy.Controls
{
    /// <summary>
    /// Advanced Study Summarizer Control with AI-powered features
    /// Main feature of the Study Buddy application
    /// </summary>
    public partial class SummarizerControl : UserControl, IThemeAware, IAsyncInitializable
    {
        #region Private Fields

        private readonly SettingsHandler _settingsHandler;
        private GeminiApiClient? _geminiClient;
        private List<StudyOutput> _outputs = new List<StudyOutput>();
        private string _currentApiKey = string.Empty;
        private ThemeColors _themeColors;

        #endregion

        #region Constructor

        public SummarizerControl(SettingsHandler settingsHandler)
        {
            _settingsHandler = settingsHandler;
            InitializeComponent();
        }

        #endregion

        #region Interface Implementations

        public async Task InitializeAsync()
        {
            await LoadSettingsAsync();
            InitializeLanguageDropdown();
            UpdateButtonStates();
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
                    lblApiStatus.Text = "API Key configured ?";
                    lblApiStatus.ForeColor = Color.Green;
                }
            }
            catch (Exception ex)
            {
                lblApiStatus.Text = $"Error loading settings: {ex.Message}";
                lblApiStatus.ForeColor = Color.Red;
            }
        }

        private void InitializeLanguageDropdown()
        {
            var languages = _settingsHandler.GetAvailableLanguages();
            cmbLanguage.DataSource = languages.ToList();
            cmbLanguage.DisplayMember = "DisplayName";
            cmbLanguage.ValueMember = "Code";
            cmbLanguage.SelectedIndex = 0; // Default to English
        }

        private void ApplyTheme()
        {
            if (_themeColors != null)
            {
                this.BackColor = _themeColors.Background;
                this.ForeColor = _themeColors.Text;
                
                // Apply theme to panels
                groupInput.BackColor = _themeColors.Surface;
                groupLanguage.BackColor = _themeColors.Surface;
                groupProcessing.BackColor = _themeColors.Surface;
                groupOutput.BackColor = _themeColors.Surface;
                
                txtInput.BackColor = _themeColors.Background;
                txtInput.ForeColor = _themeColors.Text;
                
                tabControlOutputs.BackColor = _themeColors.Background;
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
                    _currentApiKey = apiDialog.ApiKey;
                    _geminiClient?.Dispose();
                    _geminiClient = new GeminiApiClient(_currentApiKey);
                    lblApiStatus.Text = "API Key configured ?";
                    lblApiStatus.ForeColor = Color.Green;
                    UpdateButtonStates();
                    
                    // Save the API key
                    _ = Task.Run(async () =>
                    {
                        await _settingsHandler.UpdateSettingAsync(s => s.ApiKey = _currentApiKey);
                    });
                }
            }
        }

        private async void btnSummary_Click(object sender, EventArgs e)
        {
            await ProcessWithGeminiAsync("summary", "Summary");
        }

        private async void btnQuiz_Click(object sender, EventArgs e)
        {
            await ProcessWithGeminiAsync("quiz", "Quiz Questions");
        }

        private async void btnMnemonics_Click(object sender, EventArgs e)
        {
            await ProcessWithGeminiAsync("mnemonics", "Memory Tricks");
        }

        private void txtInput_TextChanged(object sender, EventArgs e)
        {
            UpdateButtonStates();
            lblCharCount.Text = $"{txtInput.Text.Length} characters";
        }

        private void btnClearInput_Click(object sender, EventArgs e)
        {
            txtInput.Clear();
            txtInput.Focus();
        }

        private void btnClearOutputs_Click(object sender, EventArgs e)
        {
            tabControlOutputs.TabPages.Clear();
            _outputs.Clear();
            UpdateButtonStates();
        }

        private void btnCopyToClipboard_Click(object sender, EventArgs e)
        {
            if (tabControlOutputs.SelectedTab?.Controls[0] is RichTextBox rtb)
            {
                var selectedOutput = _outputs.FirstOrDefault(o => o.Title == tabControlOutputs.SelectedTab.Text);
                if (selectedOutput != null)
                {
                    var cleanContent = CleanApiResponse(selectedOutput.Content);
                    var markdownContent = ConvertToMarkdown(cleanContent);
                    Clipboard.SetText(markdownContent);
                }
                else
                {
                    Clipboard.SetText(rtb.Text);
                }
                
                MessageBox.Show("Content copied to clipboard in markdown format!", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }

        private async void btnSaveAsPdf_Click(object sender, EventArgs e)
        {
            if (tabControlOutputs.SelectedTab?.Controls[0] is RichTextBox rtb)
            {
                using (var saveDialog = new SaveFileDialog())
                {
                    saveDialog.Filter = "PDF files (*.pdf)|*.pdf";
                    saveDialog.DefaultExt = "pdf";
                    saveDialog.FileName = $"StudyBuddy_Summary_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";

                    if (saveDialog.ShowDialog() == DialogResult.OK)
                    {
                        try
                        {
                            await ExportHelper.ExportToPdfAsync(rtb.Text, tabControlOutputs.SelectedTab.Text, saveDialog.FileName);
                            MessageBox.Show("PDF saved successfully!", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        }
                        catch (Exception ex)
                        {
                            MessageBox.Show($"Error saving PDF: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        }
                    }
                }
            }
        }

        private void btnShare_Click(object sender, EventArgs e)
        {
            if (tabControlOutputs.SelectedTab?.Controls[0] is RichTextBox rtb)
            {
                using (var shareDialog = new ShareDialog(rtb.Text, tabControlOutputs.SelectedTab.Text))
                {
                    shareDialog.ShowDialog();
                }
            }
        }

        #endregion

        #region AI Processing

        private async Task ProcessWithGeminiAsync(string outputType, string title)
        {
            if (_geminiClient == null)
            {
                MessageBox.Show("Please configure your API key first.", "API Key Required", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            if (string.IsNullOrWhiteSpace(txtInput.Text))
            {
                MessageBox.Show("Please enter some text to analyze.", "Input Required", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            try
            {
                // Show processing indicator
                var activeButton = GetActiveProcessingButton(outputType);
                var originalText = activeButton.Text;
                activeButton.Text = "Processing...";
                activeButton.Enabled = false;
                Cursor = Cursors.WaitCursor;

                // Get selected language
                var selectedLanguage = (LanguageOption)cmbLanguage.SelectedItem;
                var language = selectedLanguage?.Code ?? "en";

                string result;
                OutputType type;

                // Call appropriate API method based on output type
                switch (outputType.ToLower())
                {
                    case "summary":
                        result = await _geminiClient.GenerateStudySummaryAsync(txtInput.Text, language);
                        type = OutputType.Summary;
                        break;
                    case "quiz":
                        // For quiz, we can use the summary method and extract quiz portion
                        result = await _geminiClient.GenerateStudySummaryAsync(txtInput.Text, language);
                        type = OutputType.Quiz;
                        break;
                    case "mnemonics":
                        result = await _geminiClient.GenerateStudySummaryAsync(txtInput.Text, language);
                        type = OutputType.Mnemonics;
                        break;
                    default:
                        result = await _geminiClient.GenerateContentAsync($"Analyze this text: {txtInput.Text}");
                        type = OutputType.Summary;
                        break;
                }

                // Create output object
                var output = new StudyOutput
                {
                    Title = GetCleanTitle(title),
                    Content = result,
                    Type = type,
                    CreatedAt = DateTime.Now,
                    Language = language,
                    SourceText = txtInput.Text
                };

                _outputs.Add(output);

                // Add to output tabs
                AddOutputTab(output);

                UpdateButtonStates();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error processing request: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                // Restore button state
                var button = GetActiveProcessingButton(outputType);
                button.Text = GetOriginalButtonText(outputType);
                button.Enabled = true;
                Cursor = Cursors.Default;
            }
        }

        #endregion

        #region Helper Methods

        private void UpdateButtonStates()
        {
            bool hasText = !string.IsNullOrWhiteSpace(txtInput.Text);
            bool hasApiKey = !string.IsNullOrWhiteSpace(_currentApiKey);
            bool canProcess = hasText && hasApiKey;

            btnSummary.Enabled = canProcess;
            btnQuiz.Enabled = canProcess;
            btnMnemonics.Enabled = canProcess;

            bool hasOutputs = _outputs.Count > 0;
            btnCopyToClipboard.Enabled = hasOutputs;
            btnSaveAsPdf.Enabled = hasOutputs;
            btnShare.Enabled = hasOutputs;
        }

        private Button GetActiveProcessingButton(string outputType)
        {
            return outputType.ToLower() switch
            {
                "summary" => btnSummary,
                "quiz" => btnQuiz,
                "mnemonics" => btnMnemonics,
                _ => btnSummary
            };
        }

        private string GetOriginalButtonText(string outputType)
        {
            return outputType.ToLower() switch
            {
                "summary" => "?? Generate Summary",
                "quiz" => "? Create Quiz",
                "mnemonics" => "?? Memory Tricks",
                _ => "Process"
            };
        }

        private string GetCleanTitle(string baseTitle)
        {
            var timestamp = DateTime.Now.ToString("HH:mm");
            return $"{baseTitle} ({timestamp})";
        }

        private void AddOutputTab(StudyOutput output)
        {
            var tabPage = new TabPage(output.Title);
            
            var richTextBox = new RichTextBox
            {
                Dock = DockStyle.Fill,
                ReadOnly = true,
                Font = new Font("Segoe UI", 12),
                BackColor = Color.White,
                ScrollBars = RichTextBoxScrollBars.Vertical,
                Padding = new Padding(20),
                SelectionIndent = 15,
                SelectionRightIndent = 15
            };

            // Apply markdown-style formatting
            ApplyMarkdownFormatting(richTextBox, output.Content);

            tabPage.Controls.Add(richTextBox);
            tabControlOutputs.TabPages.Add(tabPage);
            tabControlOutputs.SelectedTab = tabPage;
        }

        private void ApplyMarkdownFormatting(RichTextBox rtb, string content)
        {
            var cleanContent = CleanApiResponse(content);
            
            rtb.Clear();
            rtb.Text = cleanContent;
            
            var lines = cleanContent.Split('\n');
            var currentPosition = 0;
            
            foreach (var line in lines)
            {
                if (string.IsNullOrEmpty(line.Trim()))
                {
                    currentPosition += line.Length + 1;
                    continue;
                }
                
                var lineLength = line.Length;
                rtb.Select(currentPosition, lineLength);
                
                var trimmedLine = line.Trim();
                
                // Apply markdown-style formatting
                if (trimmedLine.StartsWith("# "))
                {
                    rtb.SelectionFont = new Font("Segoe UI", 18, FontStyle.Bold);
                    rtb.SelectionColor = Color.FromArgb(63, 81, 181);
                }
                else if (trimmedLine.StartsWith("## "))
                {
                    rtb.SelectionFont = new Font("Segoe UI", 16, FontStyle.Bold);
                    rtb.SelectionColor = Color.FromArgb(33, 150, 243);
                }
                else if (trimmedLine.StartsWith("### "))
                {
                    rtb.SelectionFont = new Font("Segoe UI", 14, FontStyle.Bold);
                    rtb.SelectionColor = Color.FromArgb(76, 175, 80);
                }
                else if (trimmedLine.StartsWith("- ") || trimmedLine.StartsWith("* ") || trimmedLine.StartsWith("• "))
                {
                    rtb.SelectionFont = new Font("Segoe UI", 12, FontStyle.Regular);
                    rtb.SelectionColor = Color.FromArgb(33, 33, 33);
                    rtb.SelectionIndent = 25;
                    rtb.SelectionHangingIndent = 15;
                }
                else if (Regex.IsMatch(trimmedLine, @"^\d+\.\s"))
                {
                    rtb.SelectionFont = new Font("Segoe UI", 12, FontStyle.Regular);
                    rtb.SelectionColor = Color.FromArgb(33, 33, 33);
                    rtb.SelectionIndent = 25;
                    rtb.SelectionHangingIndent = 15;
                }
                else
                {
                    rtb.SelectionFont = new Font("Segoe UI", 12, FontStyle.Regular);
                    rtb.SelectionColor = Color.FromArgb(33, 33, 33);
                    rtb.SelectionIndent = 0;
                    rtb.SelectionHangingIndent = 0;
                }
                
                currentPosition += lineLength + 1;
            }
            
            rtb.Select(0, 0);
        }

        private string CleanApiResponse(string content)
        {
            if (string.IsNullOrEmpty(content)) return content;

            var lines = content.Split('\n');
            var cleanedLines = new List<string>();
            
            foreach (var line in lines)
            {
                var trimmed = line.Trim();
                
                if (trimmed.Contains("given the prompt") || 
                    trimmed.Contains("comprehensive bullet-point summary") ||
                    trimmed.Contains("needs to cover") ||
                    trimmed.Contains("(since the original prompt") ||
                    trimmed.Contains("*as if*") ||
                    trimmed.Contains("Implicitly Responded To") ||
                    trimmed.StartsWith("Okay,") ||
                    trimmed.All(c => c == '?' || c == '*' || c == '=' || c == '-' || char.IsWhiteSpace(c)) ||
                    string.IsNullOrWhiteSpace(trimmed))
                {
                    continue;
                }
                
                cleanedLines.Add(trimmed);
            }
            
            return string.Join("\n\n", cleanedLines);
        }

        private string ConvertToMarkdown(string content)
        {
            if (string.IsNullOrEmpty(content)) return content;
                
            var lines = content.Split('\n');
            var markdownLines = new List<string>();
            
            foreach (var line in lines)
            {
                var trimmed = line.Trim();
                if (string.IsNullOrEmpty(trimmed))
                {
                    markdownLines.Add("");
                    continue;
                }
                
                if (trimmed.EndsWith(":") && !trimmed.StartsWith("-") && !trimmed.StartsWith("•"))
                {
                    markdownLines.Add($"## {trimmed.TrimEnd(':')}");
                    markdownLines.Add("");
                }
                else if (trimmed.StartsWith("•") || trimmed.StartsWith("*"))
                {
                    markdownLines.Add($"- {trimmed.Substring(1).Trim()}");
                }
                else if (trimmed.StartsWith("-"))
                {
                    markdownLines.Add(trimmed);
                }
                else
                {
                    markdownLines.Add(trimmed);
                }
            }
            
            return string.Join("\n", markdownLines);
        }

        #endregion

        #region Designer Code

        private void InitializeComponent()
        {
            this.tableLayoutMain = new TableLayoutPanel();
            this.groupInput = new GroupBox();
            this.txtInput = new TextBox();
            this.panelInputBottom = new Panel();
            this.lblCharCount = new Label();
            this.btnClearInput = new Button();
            this.groupLanguage = new GroupBox();
            this.cmbLanguage = new ComboBox();
            this.lblLanguageInfo = new Label();
            this.groupProcessing = new GroupBox();
            this.btnSummary = new Button();
            this.btnQuiz = new Button();
            this.btnMnemonics = new Button();
            this.groupOutput = new GroupBox();
            this.tabControlOutputs = new TabControl();
            this.panelOutputActions = new Panel();
            this.btnCopyToClipboard = new Button();
            this.btnSaveAsPdf = new Button();
            this.btnShare = new Button();
            this.btnClearOutputs = new Button();
            this.panelApiConfig = new Panel();
            this.btnConfigureApi = new Button();
            this.lblApiStatus = new Label();

            this.tableLayoutMain.SuspendLayout();
            this.groupInput.SuspendLayout();
            this.panelInputBottom.SuspendLayout();
            this.groupLanguage.SuspendLayout();
            this.groupProcessing.SuspendLayout();
            this.groupOutput.SuspendLayout();
            this.panelOutputActions.SuspendLayout();
            this.panelApiConfig.SuspendLayout();
            this.SuspendLayout();

            // tableLayoutMain
            this.tableLayoutMain.ColumnCount = 2;
            this.tableLayoutMain.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 40F));
            this.tableLayoutMain.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 60F));
            this.tableLayoutMain.Controls.Add(this.groupInput, 0, 0);
            this.tableLayoutMain.Controls.Add(this.groupLanguage, 0, 1);
            this.tableLayoutMain.Controls.Add(this.groupProcessing, 0, 2);
            this.tableLayoutMain.Controls.Add(this.panelApiConfig, 0, 3);
            this.tableLayoutMain.Controls.Add(this.groupOutput, 1, 0);
            this.tableLayoutMain.Dock = DockStyle.Fill;
            this.tableLayoutMain.Location = new Point(0, 0);
            this.tableLayoutMain.Name = "tableLayoutMain";
            this.tableLayoutMain.RowCount = 4;
            this.tableLayoutMain.RowStyles.Add(new RowStyle(SizeType.Percent, 50F));
            this.tableLayoutMain.RowStyles.Add(new RowStyle(SizeType.Absolute, 80F));
            this.tableLayoutMain.RowStyles.Add(new RowStyle(SizeType.Absolute, 80F));
            this.tableLayoutMain.RowStyles.Add(new RowStyle(SizeType.Absolute, 60F));
            this.tableLayoutMain.SetRowSpan(this.groupOutput, 4);
            this.tableLayoutMain.Size = new Size(1000, 700);
            this.tableLayoutMain.TabIndex = 0;

            // groupInput
            this.groupInput.Controls.Add(this.txtInput);
            this.groupInput.Controls.Add(this.panelInputBottom);
            this.groupInput.Dock = DockStyle.Fill;
            this.groupInput.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.groupInput.Location = new Point(4, 4);
            this.groupInput.Name = "groupInput";
            this.groupInput.Padding = new Padding(10);
            this.groupInput.Size = new Size(392, 472);
            this.groupInput.TabIndex = 0;
            this.groupInput.TabStop = false;
            this.groupInput.Text = "?? Text Input";

            // txtInput
            this.txtInput.Dock = DockStyle.Fill;
            this.txtInput.Font = new Font("Segoe UI", 11F);
            this.txtInput.Location = new Point(10, 34);
            this.txtInput.Multiline = true;
            this.txtInput.Name = "txtInput";
            this.txtInput.PlaceholderText = "Paste your notes, textbook content, or study material here...";
            this.txtInput.ScrollBars = ScrollBars.Vertical;
            this.txtInput.Size = new Size(372, 398);
            this.txtInput.TabIndex = 0;
            this.txtInput.TextChanged += this.txtInput_TextChanged;

            // panelInputBottom
            this.panelInputBottom.Controls.Add(this.lblCharCount);
            this.panelInputBottom.Controls.Add(this.btnClearInput);
            this.panelInputBottom.Dock = DockStyle.Bottom;
            this.panelInputBottom.Location = new Point(10, 432);
            this.panelInputBottom.Name = "panelInputBottom";
            this.panelInputBottom.Size = new Size(372, 40);
            this.panelInputBottom.TabIndex = 1;

            // lblCharCount
            this.lblCharCount.AutoSize = true;
            this.lblCharCount.Font = new Font("Segoe UI", 9F);
            this.lblCharCount.ForeColor = Color.Gray;
            this.lblCharCount.Location = new Point(0, 12);
            this.lblCharCount.Name = "lblCharCount";
            this.lblCharCount.Size = new Size(70, 15);
            this.lblCharCount.Text = "0 characters";

            // btnClearInput
            this.btnClearInput.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
            this.btnClearInput.BackColor = Color.FromArgb(244, 67, 54);
            this.btnClearInput.FlatStyle = FlatStyle.Flat;
            this.btnClearInput.Font = new Font("Segoe UI", 9F);
            this.btnClearInput.ForeColor = Color.White;
            this.btnClearInput.Location = new Point(292, 5);
            this.btnClearInput.Name = "btnClearInput";
            this.btnClearInput.Size = new Size(80, 30);
            this.btnClearInput.Text = "Clear";
            this.btnClearInput.UseVisualStyleBackColor = false;
            this.btnClearInput.Click += this.btnClearInput_Click;

            // groupLanguage
            this.groupLanguage.Controls.Add(this.cmbLanguage);
            this.groupLanguage.Controls.Add(this.lblLanguageInfo);
            this.groupLanguage.Dock = DockStyle.Fill;
            this.groupLanguage.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.groupLanguage.Location = new Point(4, 484);
            this.groupLanguage.Name = "groupLanguage";
            this.groupLanguage.Padding = new Padding(10);
            this.groupLanguage.Size = new Size(392, 74);
            this.groupLanguage.TabIndex = 1;
            this.groupLanguage.TabStop = false;
            this.groupLanguage.Text = "?? Language Selection";

            // cmbLanguage
            this.cmbLanguage.DropDownStyle = ComboBoxStyle.DropDownList;
            this.cmbLanguage.Font = new Font("Segoe UI", 11F);
            this.cmbLanguage.FormattingEnabled = true;
            this.cmbLanguage.Location = new Point(10, 30);
            this.cmbLanguage.Name = "cmbLanguage";
            this.cmbLanguage.Size = new Size(200, 28);
            this.cmbLanguage.TabIndex = 0;

            // lblLanguageInfo
            this.lblLanguageInfo.AutoSize = true;
            this.lblLanguageInfo.Font = new Font("Segoe UI", 9F);
            this.lblLanguageInfo.ForeColor = Color.Gray;
            this.lblLanguageInfo.Location = new Point(220, 37);
            this.lblLanguageInfo.Name = "lblLanguageInfo";
            this.lblLanguageInfo.Size = new Size(150, 15);
            this.lblLanguageInfo.Text = "AI responses language";

            // groupProcessing
            this.groupProcessing.Controls.Add(this.btnSummary);
            this.groupProcessing.Controls.Add(this.btnQuiz);
            this.groupProcessing.Controls.Add(this.btnMnemonics);
            this.groupProcessing.Dock = DockStyle.Fill;
            this.groupProcessing.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.groupProcessing.Location = new Point(4, 564);
            this.groupProcessing.Name = "groupProcessing";
            this.groupProcessing.Padding = new Padding(10);
            this.groupProcessing.Size = new Size(392, 74);
            this.groupProcessing.TabIndex = 2;
            this.groupProcessing.TabStop = false;
            this.groupProcessing.Text = "?? AI Processing";

            // btnSummary
            this.btnSummary.BackColor = Color.FromArgb(76, 175, 80);
            this.btnSummary.Enabled = false;
            this.btnSummary.FlatStyle = FlatStyle.Flat;
            this.btnSummary.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.btnSummary.ForeColor = Color.White;
            this.btnSummary.Location = new Point(10, 30);
            this.btnSummary.Name = "btnSummary";
            this.btnSummary.Size = new Size(120, 35);
            this.btnSummary.Text = "?? Summary";
            this.btnSummary.UseVisualStyleBackColor = false;
            this.btnSummary.Click += this.btnSummary_Click;

            // btnQuiz
            this.btnQuiz.BackColor = Color.FromArgb(255, 152, 0);
            this.btnQuiz.Enabled = false;
            this.btnQuiz.FlatStyle = FlatStyle.Flat;
            this.btnQuiz.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.btnQuiz.ForeColor = Color.White;
            this.btnQuiz.Location = new Point(140, 30);
            this.btnQuiz.Name = "btnQuiz";
            this.btnQuiz.Size = new Size(120, 35);
            this.btnQuiz.Text = "? Quiz";
            this.btnQuiz.UseVisualStyleBackColor = false;
            this.btnQuiz.Click += this.btnQuiz_Click;

            // btnMnemonics
            this.btnMnemonics.BackColor = Color.FromArgb(156, 39, 176);
            this.btnMnemonics.Enabled = false;
            this.btnMnemonics.FlatStyle = FlatStyle.Flat;
            this.btnMnemonics.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.btnMnemonics.ForeColor = Color.White;
            this.btnMnemonics.Location = new Point(270, 30);
            this.btnMnemonics.Name = "btnMnemonics";
            this.btnMnemonics.Size = new Size(112, 35);
            this.btnMnemonics.Text = "?? Memory";
            this.btnMnemonics.UseVisualStyleBackColor = false;
            this.btnMnemonics.Click += this.btnMnemonics_Click;

            // panelApiConfig
            this.panelApiConfig.Controls.Add(this.btnConfigureApi);
            this.panelApiConfig.Controls.Add(this.lblApiStatus);
            this.panelApiConfig.Dock = DockStyle.Fill;
            this.panelApiConfig.Location = new Point(4, 644);
            this.panelApiConfig.Name = "panelApiConfig";
            this.panelApiConfig.Size = new Size(392, 54);
            this.panelApiConfig.TabIndex = 3;

            // btnConfigureApi
            this.btnConfigureApi.BackColor = Color.FromArgb(63, 81, 181);
            this.btnConfigureApi.FlatStyle = FlatStyle.Flat;
            this.btnConfigureApi.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.btnConfigureApi.ForeColor = Color.White;
            this.btnConfigureApi.Location = new Point(10, 10);
            this.btnConfigureApi.Name = "btnConfigureApi";
            this.btnConfigureApi.Size = new Size(150, 35);
            this.btnConfigureApi.Text = "?? Configure API";
            this.btnConfigureApi.UseVisualStyleBackColor = false;
            this.btnConfigureApi.Click += this.btnConfigureApi_Click;

            // lblApiStatus
            this.lblApiStatus.AutoSize = true;
            this.lblApiStatus.Font = new Font("Segoe UI", 9F);
            this.lblApiStatus.ForeColor = Color.Red;
            this.lblApiStatus.Location = new Point(170, 20);
            this.lblApiStatus.Name = "lblApiStatus";
            this.lblApiStatus.Size = new Size(130, 15);
            this.lblApiStatus.Text = "API Key not configured";

            // groupOutput
            this.groupOutput.Controls.Add(this.tabControlOutputs);
            this.groupOutput.Controls.Add(this.panelOutputActions);
            this.groupOutput.Dock = DockStyle.Fill;
            this.groupOutput.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            this.groupOutput.Location = new Point(404, 4);
            this.groupOutput.Name = "groupOutput";
            this.groupOutput.Padding = new Padding(10);
            this.groupOutput.Size = new Size(592, 694);
            this.groupOutput.TabIndex = 4;
            this.groupOutput.TabStop = false;
            this.groupOutput.Text = "?? Output Display";

            // tabControlOutputs
            this.tabControlOutputs.Dock = DockStyle.Fill;
            this.tabControlOutputs.Font = new Font("Segoe UI", 10F);
            this.tabControlOutputs.Location = new Point(10, 34);
            this.tabControlOutputs.Name = "tabControlOutputs";
            this.tabControlOutputs.SelectedIndex = 0;
            this.tabControlOutputs.Size = new Size(572, 620);
            this.tabControlOutputs.TabIndex = 0;

            // panelOutputActions
            this.panelOutputActions.Controls.Add(this.btnCopyToClipboard);
            this.panelOutputActions.Controls.Add(this.btnSaveAsPdf);
            this.panelOutputActions.Controls.Add(this.btnShare);
            this.panelOutputActions.Controls.Add(this.btnClearOutputs);
            this.panelOutputActions.Dock = DockStyle.Bottom;
            this.panelOutputActions.Location = new Point(10, 654);
            this.panelOutputActions.Name = "panelOutputActions";
            this.panelOutputActions.Size = new Size(572, 40);
            this.panelOutputActions.TabIndex = 1;

            // btnCopyToClipboard
            this.btnCopyToClipboard.BackColor = Color.FromArgb(33, 150, 243);
            this.btnCopyToClipboard.Enabled = false;
            this.btnCopyToClipboard.FlatStyle = FlatStyle.Flat;
            this.btnCopyToClipboard.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.btnCopyToClipboard.ForeColor = Color.White;
            this.btnCopyToClipboard.Location = new Point(0, 5);
            this.btnCopyToClipboard.Name = "btnCopyToClipboard";
            this.btnCopyToClipboard.Size = new Size(130, 30);
            this.btnCopyToClipboard.Text = "?? Copy";
            this.btnCopyToClipboard.UseVisualStyleBackColor = false;
            this.btnCopyToClipboard.Click += this.btnCopyToClipboard_Click;

            // btnSaveAsPdf
            this.btnSaveAsPdf.BackColor = Color.FromArgb(76, 175, 80);
            this.btnSaveAsPdf.Enabled = false;
            this.btnSaveAsPdf.FlatStyle = FlatStyle.Flat;
            this.btnSaveAsPdf.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.btnSaveAsPdf.ForeColor = Color.White;
            this.btnSaveAsPdf.Location = new Point(140, 5);
            this.btnSaveAsPdf.Name = "btnSaveAsPdf";
            this.btnSaveAsPdf.Size = new Size(100, 30);
            this.btnSaveAsPdf.Text = "?? PDF";
            this.btnSaveAsPdf.UseVisualStyleBackColor = false;
            this.btnSaveAsPdf.Click += this.btnSaveAsPdf_Click;

            // btnShare
            this.btnShare.BackColor = Color.FromArgb(255, 152, 0);
            this.btnShare.Enabled = false;
            this.btnShare.FlatStyle = FlatStyle.Flat;
            this.btnShare.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.btnShare.ForeColor = Color.White;
            this.btnShare.Location = new Point(250, 5);
            this.btnShare.Name = "btnShare";
            this.btnShare.Size = new Size(100, 30);
            this.btnShare.Text = "?? Share";
            this.btnShare.UseVisualStyleBackColor = false;
            this.btnShare.Click += this.btnShare_Click;

            // btnClearOutputs
            this.btnClearOutputs.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            this.btnClearOutputs.BackColor = Color.FromArgb(244, 67, 54);
            this.btnClearOutputs.FlatStyle = FlatStyle.Flat;
            this.btnClearOutputs.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.btnClearOutputs.ForeColor = Color.White;
            this.btnClearOutputs.Location = new Point(462, 5);
            this.btnClearOutputs.Name = "btnClearOutputs";
            this.btnClearOutputs.Size = new Size(100, 30);
            this.btnClearOutputs.Text = "??? Clear";
            this.btnClearOutputs.UseVisualStyleBackColor = false;
            this.btnClearOutputs.Click += this.btnClearOutputs_Click;

            // SummarizerControl
            this.Controls.Add(this.tableLayoutMain);
            this.Name = "SummarizerControl";
            this.Size = new Size(1000, 700);

            this.tableLayoutMain.ResumeLayout(false);
            this.groupInput.ResumeLayout(false);
            this.groupInput.PerformLayout();
            this.panelInputBottom.ResumeLayout(false);
            this.panelInputBottom.PerformLayout();
            this.groupLanguage.ResumeLayout(false);
            this.groupLanguage.PerformLayout();
            this.groupProcessing.ResumeLayout(false);
            this.groupOutput.ResumeLayout(false);
            this.panelOutputActions.ResumeLayout(false);
            this.panelApiConfig.ResumeLayout(false);
            this.panelApiConfig.PerformLayout();
            this.ResumeLayout(false);
        }

        #endregion

        #region Controls

        private TableLayoutPanel tableLayoutMain;
        private GroupBox groupInput;
        private TextBox txtInput;
        private Panel panelInputBottom;
        private Label lblCharCount;
        private Button btnClearInput;
        private GroupBox groupLanguage;
        private ComboBox cmbLanguage;
        private Label lblLanguageInfo;
        private GroupBox groupProcessing;
        private Button btnSummary;
        private Button btnQuiz;
        private Button btnMnemonics;
        private GroupBox groupOutput;
        private TabControl tabControlOutputs;
        private Panel panelOutputActions;
        private Button btnCopyToClipboard;
        private Button btnSaveAsPdf;
        private Button btnShare;
        private Button btnClearOutputs;
        private Panel panelApiConfig;
        private Button btnConfigureApi;
        private Label lblApiStatus;

        #endregion
    }
}