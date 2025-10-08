using System;
using System.Drawing;
using System.Windows.Forms;

namespace StudyBuddy
{
    public partial class ApiKeyDialog : Form
    {
        public string ApiKey { get; private set; } = string.Empty;

        public ApiKeyDialog()
        {
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.lblTitle = new Label();
            this.lblInstructions = new Label();
            this.txtApiKey = new TextBox();
            this.btnOk = new Button();
            this.btnCancel = new Button();
            this.linkGeminiInfo = new LinkLabel();
            this.btnTestKey = new Button();
            this.lblKeyFormat = new Label();
            this.SuspendLayout();

            // Form properties
            this.AutoScaleDimensions = new SizeF(8F, 20F);
            this.AutoScaleMode = AutoScaleMode.Font;
            this.ClientSize = new Size(520, 320);
            this.Font = new Font("Segoe UI", 11F, FontStyle.Regular, GraphicsUnit.Point);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "ApiKeyDialog";
            this.StartPosition = FormStartPosition.CenterParent;
            this.Text = "Configure Google Gemini API Key";

            // lblTitle
            this.lblTitle.AutoSize = true;
            this.lblTitle.Font = new Font("Segoe UI", 14F, FontStyle.Bold);
            this.lblTitle.ForeColor = Color.FromArgb(63, 81, 181);
            this.lblTitle.Location = new Point(20, 20);
            this.lblTitle.Name = "lblTitle";
            this.lblTitle.Size = new Size(200, 25);
            this.lblTitle.Text = "Google Gemini API Key";

            // lblInstructions
            this.lblInstructions.Location = new Point(20, 55);
            this.lblInstructions.Name = "lblInstructions";
            this.lblInstructions.Size = new Size(480, 60);
            this.lblInstructions.Text = "To use AI features, you need a Google Gemini API key. You can get one for free from Google AI Studio. The API key will be stored locally and used only for API calls.";

            // linkGeminiInfo
            this.linkGeminiInfo.AutoSize = true;
            this.linkGeminiInfo.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.linkGeminiInfo.Location = new Point(20, 125);
            this.linkGeminiInfo.Name = "linkGeminiInfo";
            this.linkGeminiInfo.Size = new Size(300, 19);
            this.linkGeminiInfo.Text = "?? Get your free API key at aistudio.google.com";
            this.linkGeminiInfo.LinkClicked += (sender, e) =>
            {
                try
                {
                    System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                    {
                        FileName = "https://aistudio.google.com/app/apikey",
                        UseShellExecute = true
                    });
                }
                catch { }
            };

            // lblKeyFormat
            this.lblKeyFormat.AutoSize = true;
            this.lblKeyFormat.Font = new Font("Segoe UI", 9F);
            this.lblKeyFormat.ForeColor = Color.Gray;
            this.lblKeyFormat.Location = new Point(20, 155);
            this.lblKeyFormat.Name = "lblKeyFormat";
            this.lblKeyFormat.Size = new Size(350, 15);
            this.lblKeyFormat.Text = "API key format: AIzaSy... (starts with 'AIzaSy' and is about 39 characters)";

            // txtApiKey
            this.txtApiKey.Location = new Point(20, 180);
            this.txtApiKey.Name = "txtApiKey";
            this.txtApiKey.PlaceholderText = "Paste your Google Gemini API key here (AIzaSy...)";
            this.txtApiKey.Size = new Size(480, 27);
            this.txtApiKey.UseSystemPasswordChar = false; // Changed to false so users can see what they're typing
            this.txtApiKey.TextChanged += TxtApiKey_TextChanged;

            // btnTestKey
            this.btnTestKey.BackColor = Color.FromArgb(255, 152, 0);
            this.btnTestKey.Enabled = false;
            this.btnTestKey.FlatStyle = FlatStyle.Flat;
            this.btnTestKey.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            this.btnTestKey.ForeColor = Color.White;
            this.btnTestKey.Location = new Point(20, 220);
            this.btnTestKey.Name = "btnTestKey";
            this.btnTestKey.Size = new Size(100, 30);
            this.btnTestKey.Text = "Test Key";
            this.btnTestKey.UseVisualStyleBackColor = false;
            this.btnTestKey.Click += new EventHandler(this.btnTestKey_Click);

            // btnOk
            this.btnOk.BackColor = Color.FromArgb(63, 81, 181);
            this.btnOk.Enabled = false;
            this.btnOk.FlatStyle = FlatStyle.Flat;
            this.btnOk.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.btnOk.ForeColor = Color.White;
            this.btnOk.Location = new Point(340, 260);
            this.btnOk.Name = "btnOk";
            this.btnOk.Size = new Size(75, 35);
            this.btnOk.Text = "OK";
            this.btnOk.UseVisualStyleBackColor = false;
            this.btnOk.Click += new EventHandler(this.btnOk_Click);

            // btnCancel
            this.btnCancel.BackColor = Color.Gray;
            this.btnCancel.FlatStyle = FlatStyle.Flat;
            this.btnCancel.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            this.btnCancel.ForeColor = Color.White;
            this.btnCancel.Location = new Point(425, 260);
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.Size = new Size(75, 35);
            this.btnCancel.Text = "Cancel";
            this.btnCancel.UseVisualStyleBackColor = false;
            this.btnCancel.Click += new EventHandler(this.btnCancel_Click);

            this.Controls.Add(this.lblTitle);
            this.Controls.Add(this.lblInstructions);
            this.Controls.Add(this.linkGeminiInfo);
            this.Controls.Add(this.lblKeyFormat);
            this.Controls.Add(this.txtApiKey);
            this.Controls.Add(this.btnTestKey);
            this.Controls.Add(this.btnOk);
            this.Controls.Add(this.btnCancel);

            this.ResumeLayout(false);
            this.PerformLayout();
        }

        private void TxtApiKey_TextChanged(object sender, EventArgs e)
        {
            bool isValidFormat = IsValidApiKeyFormat(txtApiKey.Text);
            btnTestKey.Enabled = isValidFormat;
            btnOk.Enabled = isValidFormat;
            
            if (isValidFormat)
            {
                lblKeyFormat.ForeColor = Color.Green;
                lblKeyFormat.Text = "? API key format looks correct";
            }
            else
            {
                lblKeyFormat.ForeColor = Color.Gray;
                lblKeyFormat.Text = "API key format: AIzaSy... (starts with 'AIzaSy' and is about 39 characters)";
            }
        }

        private bool IsValidApiKeyFormat(string apiKey)
        {
            return !string.IsNullOrWhiteSpace(apiKey) && 
                   apiKey.StartsWith("AIzaSy") && 
                   apiKey.Length >= 35 && 
                   apiKey.Length <= 45;
        }

        private async void btnTestKey_Click(object sender, EventArgs e)
        {
            if (!IsValidApiKeyFormat(txtApiKey.Text))
            {
                MessageBox.Show("Please enter a valid API key format.", "Invalid Format", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            btnTestKey.Text = "Testing...";
            btnTestKey.Enabled = false;
            btnOk.Enabled = false;

            try
            {
                var testClient = new StudyBuddy.Helpers.GeminiApiClient(txtApiKey.Text.Trim());
                var result = await testClient.GenerateContentAsync("Hello! Please respond with just 'Working' to confirm the API key is valid.");
                
                if (!result.StartsWith("Error:") && !result.StartsWith("Network Error:") && !result.StartsWith("Invalid API Key:"))
                {
                    MessageBox.Show("? API key is working correctly!", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    btnOk.Enabled = true;
                }
                else
                {
                    MessageBox.Show($"API key test failed:\n\n{result}\n\nPlease check:\n1. Your API key is correct\n2. You have internet connection\n3. Your API key has Gemini API access enabled", "Test Failed", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
                
                testClient.Dispose();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error testing API key:\n{ex.Message}\n\nPlease check your internet connection and API key.", "Test Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                btnTestKey.Text = "Test Key";
                btnTestKey.Enabled = true;
                if (IsValidApiKeyFormat(txtApiKey.Text))
                {
                    btnOk.Enabled = true;
                }
            }
        }

        private void btnOk_Click(object sender, EventArgs e)
        {
            if (!IsValidApiKeyFormat(txtApiKey.Text))
            {
                MessageBox.Show("Please enter a valid API key.", "Invalid Input", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            ApiKey = txtApiKey.Text.Trim();
            DialogResult = DialogResult.OK;
            Close();
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.Cancel;
            Close();
        }

        private Label lblTitle;
        private Label lblInstructions;
        private TextBox txtApiKey;
        private Button btnOk;
        private Button btnCancel;
        private LinkLabel linkGeminiInfo;
        private Button btnTestKey;
        private Label lblKeyFormat;
    }
}