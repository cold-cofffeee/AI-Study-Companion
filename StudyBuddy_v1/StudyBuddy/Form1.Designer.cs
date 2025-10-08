namespace StudyBuddy
{
    partial class Form1
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            tableLayoutMain = new TableLayoutPanel();
            panelTop = new Panel();
            lblTitle = new Label();
            lblSubtitle = new Label();
            btnConfigureApi = new Button();
            lblApiStatus = new Label();
            panelLeft = new Panel();
            groupInput = new GroupBox();
            txtInput = new TextBox();
            panelInputBottom = new Panel();
            lblCharCount = new Label();
            btnClearInput = new Button();
            groupLanguage = new GroupBox();
            cmbLanguage = new ComboBox();
            lblLanguageInfo = new Label();
            groupProcessing = new GroupBox();
            btnSummary = new Button();
            btnQuiz = new Button();
            btnMnemonics = new Button();
            panelRight = new Panel();
            groupOutput = new GroupBox();
            tabControlOutputs = new TabControl();
            panelOutputActions = new Panel();
            btnCopyToClipboard = new Button();
            btnSaveAsPdf = new Button();
            btnShare = new Button();
            btnClearOutputs = new Button();
            tableLayoutMain.SuspendLayout();
            panelTop.SuspendLayout();
            panelLeft.SuspendLayout();
            groupInput.SuspendLayout();
            panelInputBottom.SuspendLayout();
            groupLanguage.SuspendLayout();
            groupProcessing.SuspendLayout();
            panelRight.SuspendLayout();
            groupOutput.SuspendLayout();
            panelOutputActions.SuspendLayout();
            SuspendLayout();
            // 
            // tableLayoutMain
            // 
            tableLayoutMain.ColumnCount = 2;
            tableLayoutMain.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 40F));
            tableLayoutMain.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 60F));
            tableLayoutMain.Controls.Add(panelTop, 0, 0);
            tableLayoutMain.Controls.Add(panelLeft, 0, 1);
            tableLayoutMain.Controls.Add(panelRight, 1, 1);
            tableLayoutMain.Dock = DockStyle.Fill;
            tableLayoutMain.Location = new Point(0, 0);
            tableLayoutMain.Margin = new Padding(4);
            tableLayoutMain.Name = "tableLayoutMain";
            tableLayoutMain.Padding = new Padding(10);
            tableLayoutMain.RowCount = 2;
            tableLayoutMain.RowStyles.Add(new RowStyle(SizeType.Absolute, 80F));
            tableLayoutMain.RowStyles.Add(new RowStyle(SizeType.Percent, 100F));
            tableLayoutMain.Size = new Size(1370, 749);
            tableLayoutMain.TabIndex = 0;
            // 
            // panelTop
            // 
            tableLayoutMain.SetColumnSpan(panelTop, 2);
            panelTop.Controls.Add(lblTitle);
            panelTop.Controls.Add(lblSubtitle);
            panelTop.Controls.Add(btnConfigureApi);
            panelTop.Controls.Add(lblApiStatus);
            panelTop.Dock = DockStyle.Fill;
            panelTop.Location = new Point(14, 14);
            panelTop.Margin = new Padding(4);
            panelTop.Name = "panelTop";
            panelTop.Size = new Size(1342, 72);
            panelTop.TabIndex = 0;
            // 
            // lblTitle
            // 
            lblTitle.AutoSize = true;
            lblTitle.Font = new Font("Segoe UI", 20F, FontStyle.Bold);
            lblTitle.ForeColor = Color.FromArgb(63, 81, 181);
            lblTitle.Location = new Point(0, 0);
            lblTitle.Name = "lblTitle";
            lblTitle.Size = new Size(280, 37);
            lblTitle.TabIndex = 0;
            lblTitle.Text = "AI Study Companion";
            // 
            // lblSubtitle
            // 
            lblSubtitle.AutoSize = true;
            lblSubtitle.Font = new Font("Segoe UI", 10F);
            lblSubtitle.ForeColor = Color.Gray;
            lblSubtitle.Location = new Point(0, 40);
            lblSubtitle.Name = "lblSubtitle";
            lblSubtitle.Size = new Size(530, 19);
            lblSubtitle.TabIndex = 1;
            lblSubtitle.Text = "Transform your study materials with AI-powered summaries, quizzes, and mnemonics";
            // 
            // btnConfigureApi
            // 
            btnConfigureApi.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            btnConfigureApi.BackColor = Color.FromArgb(63, 81, 181);
            btnConfigureApi.FlatStyle = FlatStyle.Flat;
            btnConfigureApi.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            btnConfigureApi.ForeColor = Color.White;
            btnConfigureApi.Location = new Point(1150, 10);
            btnConfigureApi.Name = "btnConfigureApi";
            btnConfigureApi.Size = new Size(180, 35);
            btnConfigureApi.TabIndex = 2;
            btnConfigureApi.Text = "Configure API Key";
            btnConfigureApi.UseVisualStyleBackColor = false;
            btnConfigureApi.Click += btnConfigureApi_Click;
            // 
            // lblApiStatus
            // 
            lblApiStatus.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            lblApiStatus.Font = new Font("Segoe UI", 9F);
            lblApiStatus.ForeColor = Color.Red;
            lblApiStatus.Location = new Point(1150, 50);
            lblApiStatus.Name = "lblApiStatus";
            lblApiStatus.Size = new Size(180, 20);
            lblApiStatus.TabIndex = 3;
            lblApiStatus.Text = "API Key not configured";
            lblApiStatus.TextAlign = ContentAlignment.MiddleCenter;
            // 
            // panelLeft
            // 
            panelLeft.Controls.Add(groupInput);
            panelLeft.Controls.Add(groupLanguage);
            panelLeft.Controls.Add(groupProcessing);
            panelLeft.Dock = DockStyle.Fill;
            panelLeft.Location = new Point(14, 94);
            panelLeft.Margin = new Padding(4);
            panelLeft.Name = "panelLeft";
            panelLeft.Size = new Size(532, 641);
            panelLeft.TabIndex = 1;
            // 
            // groupInput
            // 
            groupInput.Controls.Add(txtInput);
            groupInput.Controls.Add(panelInputBottom);
            groupInput.Dock = DockStyle.Fill;
            groupInput.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            groupInput.Location = new Point(0, 0);
            groupInput.Margin = new Padding(4);
            groupInput.Name = "groupInput";
            groupInput.Padding = new Padding(4);
            groupInput.Size = new Size(532, 481);
            groupInput.TabIndex = 0;
            groupInput.TabStop = false;
            groupInput.Text = "📝 Text Input";
            // 
            // txtInput
            // 
            txtInput.Dock = DockStyle.Fill;
            txtInput.Font = new Font("Segoe UI", 11F);
            txtInput.Location = new Point(4, 24);
            txtInput.Margin = new Padding(4);
            txtInput.Multiline = true;
            txtInput.Name = "txtInput";
            txtInput.PlaceholderText = "Paste your notes, textbook content, or study material here...";
            txtInput.ScrollBars = ScrollBars.Vertical;
            txtInput.Size = new Size(524, 413);
            txtInput.TabIndex = 0;
            txtInput.TextChanged += txtInput_TextChanged;
            // 
            // panelInputBottom
            // 
            panelInputBottom.Controls.Add(lblCharCount);
            panelInputBottom.Controls.Add(btnClearInput);
            panelInputBottom.Dock = DockStyle.Bottom;
            panelInputBottom.Location = new Point(4, 437);
            panelInputBottom.Name = "panelInputBottom";
            panelInputBottom.Size = new Size(524, 40);
            panelInputBottom.TabIndex = 1;
            // 
            // lblCharCount
            // 
            lblCharCount.Anchor = AnchorStyles.Bottom | AnchorStyles.Left;
            lblCharCount.AutoSize = true;
            lblCharCount.Font = new Font("Segoe UI", 9F);
            lblCharCount.ForeColor = Color.Gray;
            lblCharCount.Location = new Point(0, 12);
            lblCharCount.Name = "lblCharCount";
            lblCharCount.Size = new Size(70, 15);
            lblCharCount.TabIndex = 0;
            lblCharCount.Text = "0 characters";
            // 
            // btnClearInput
            // 
            btnClearInput.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
            btnClearInput.BackColor = Color.FromArgb(244, 67, 54);
            btnClearInput.FlatStyle = FlatStyle.Flat;
            btnClearInput.Font = new Font("Segoe UI", 9F);
            btnClearInput.ForeColor = Color.White;
            btnClearInput.Location = new Point(440, 5);
            btnClearInput.Name = "btnClearInput";
            btnClearInput.Size = new Size(80, 30);
            btnClearInput.TabIndex = 1;
            btnClearInput.Text = "Clear";
            btnClearInput.UseVisualStyleBackColor = false;
            btnClearInput.Click += btnClearInput_Click;
            // 
            // groupLanguage
            // 
            groupLanguage.Controls.Add(cmbLanguage);
            groupLanguage.Controls.Add(lblLanguageInfo);
            groupLanguage.Dock = DockStyle.Bottom;
            groupLanguage.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            groupLanguage.Location = new Point(0, 481);
            groupLanguage.Margin = new Padding(4);
            groupLanguage.Name = "groupLanguage";
            groupLanguage.Padding = new Padding(4);
            groupLanguage.Size = new Size(532, 80);
            groupLanguage.TabIndex = 1;
            groupLanguage.TabStop = false;
            groupLanguage.Text = "🌐 Language Selection";
            // 
            // cmbLanguage
            // 
            cmbLanguage.DropDownStyle = ComboBoxStyle.DropDownList;
            cmbLanguage.Font = new Font("Segoe UI", 11F);
            cmbLanguage.FormattingEnabled = true;
            cmbLanguage.Location = new Point(8, 28);
            cmbLanguage.Name = "cmbLanguage";
            cmbLanguage.Size = new Size(200, 28);
            cmbLanguage.TabIndex = 0;
            // 
            // lblLanguageInfo
            // 
            lblLanguageInfo.AutoSize = true;
            lblLanguageInfo.Font = new Font("Segoe UI", 9F);
            lblLanguageInfo.ForeColor = Color.Gray;
            lblLanguageInfo.Location = new Point(221, 36);
            lblLanguageInfo.Name = "lblLanguageInfo";
            lblLanguageInfo.Size = new Size(253, 15);
            lblLanguageInfo.TabIndex = 1;
            lblLanguageInfo.Text = "AI responses will be generated in this language";
            // 
            // groupProcessing
            // 
            groupProcessing.Controls.Add(btnSummary);
            groupProcessing.Controls.Add(btnQuiz);
            groupProcessing.Controls.Add(btnMnemonics);
            groupProcessing.Dock = DockStyle.Bottom;
            groupProcessing.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            groupProcessing.Location = new Point(0, 561);
            groupProcessing.Margin = new Padding(4);
            groupProcessing.Name = "groupProcessing";
            groupProcessing.Padding = new Padding(4);
            groupProcessing.Size = new Size(532, 80);
            groupProcessing.TabIndex = 2;
            groupProcessing.TabStop = false;
            groupProcessing.Text = "🤖 AI Processing";
            // 
            // btnSummary
            // 
            btnSummary.BackColor = Color.FromArgb(76, 175, 80);
            btnSummary.Enabled = false;
            btnSummary.FlatStyle = FlatStyle.Flat;
            btnSummary.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            btnSummary.ForeColor = Color.White;
            btnSummary.Location = new Point(8, 28);
            btnSummary.Name = "btnSummary";
            btnSummary.Padding = new Padding(0, 3, 0, 0);
            btnSummary.Size = new Size(160, 40);
            btnSummary.TabIndex = 0;
            btnSummary.Text = "📋 Generate Summary";
            btnSummary.UseVisualStyleBackColor = false;
            btnSummary.Click += btnSummary_Click;
            // 
            // btnQuiz
            // 
            btnQuiz.BackColor = Color.FromArgb(255, 152, 0);
            btnQuiz.Enabled = false;
            btnQuiz.FlatStyle = FlatStyle.Flat;
            btnQuiz.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            btnQuiz.ForeColor = Color.White;
            btnQuiz.Location = new Point(180, 28);
            btnQuiz.Name = "btnQuiz";
            btnQuiz.Size = new Size(160, 40);
            btnQuiz.TabIndex = 1;
            btnQuiz.Text = "❓ Create Quiz";
            btnQuiz.UseVisualStyleBackColor = false;
            btnQuiz.Click += btnQuiz_Click;
            // 
            // btnMnemonics
            // 
            btnMnemonics.BackColor = Color.FromArgb(156, 39, 176);
            btnMnemonics.Enabled = false;
            btnMnemonics.FlatStyle = FlatStyle.Flat;
            btnMnemonics.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            btnMnemonics.ForeColor = Color.White;
            btnMnemonics.Location = new Point(352, 28);
            btnMnemonics.Name = "btnMnemonics";
            btnMnemonics.Size = new Size(160, 40);
            btnMnemonics.TabIndex = 2;
            btnMnemonics.Text = "\U0001f9e0 Memory Tricks";
            btnMnemonics.UseVisualStyleBackColor = false;
            btnMnemonics.Click += btnMnemonics_Click;
            // 
            // panelRight
            // 
            panelRight.Controls.Add(groupOutput);
            panelRight.Dock = DockStyle.Fill;
            panelRight.Location = new Point(554, 94);
            panelRight.Margin = new Padding(4);
            panelRight.Name = "panelRight";
            panelRight.Size = new Size(802, 641);
            panelRight.TabIndex = 2;
            // 
            // groupOutput
            // 
            groupOutput.Controls.Add(tabControlOutputs);
            groupOutput.Controls.Add(panelOutputActions);
            groupOutput.Dock = DockStyle.Fill;
            groupOutput.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            groupOutput.Location = new Point(0, 0);
            groupOutput.Margin = new Padding(4);
            groupOutput.Name = "groupOutput";
            groupOutput.Padding = new Padding(4);
            groupOutput.Size = new Size(802, 641);
            groupOutput.TabIndex = 0;
            groupOutput.TabStop = false;
            groupOutput.Text = "📤 Output Display";
            // 
            // tabControlOutputs
            // 
            tabControlOutputs.Dock = DockStyle.Fill;
            tabControlOutputs.Font = new Font("Segoe UI", 10F);
            tabControlOutputs.Location = new Point(4, 24);
            tabControlOutputs.Margin = new Padding(8);
            tabControlOutputs.Name = "tabControlOutputs";
            tabControlOutputs.Padding = new Point(12, 8);
            tabControlOutputs.SelectedIndex = 0;
            tabControlOutputs.Size = new Size(794, 573);
            tabControlOutputs.TabIndex = 0;
            // 
            // panelOutputActions
            // 
            panelOutputActions.Controls.Add(btnCopyToClipboard);
            panelOutputActions.Controls.Add(btnSaveAsPdf);
            panelOutputActions.Controls.Add(btnShare);
            panelOutputActions.Controls.Add(btnClearOutputs);
            panelOutputActions.Dock = DockStyle.Bottom;
            panelOutputActions.Location = new Point(4, 597);
            panelOutputActions.Name = "panelOutputActions";
            panelOutputActions.Size = new Size(794, 40);
            panelOutputActions.TabIndex = 1;
            // 
            // btnCopyToClipboard
            // 
            btnCopyToClipboard.BackColor = Color.FromArgb(33, 150, 243);
            btnCopyToClipboard.Enabled = false;
            btnCopyToClipboard.FlatStyle = FlatStyle.Flat;
            btnCopyToClipboard.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            btnCopyToClipboard.ForeColor = Color.White;
            btnCopyToClipboard.Location = new Point(0, 5);
            btnCopyToClipboard.Name = "btnCopyToClipboard";
            btnCopyToClipboard.Size = new Size(150, 30);
            btnCopyToClipboard.TabIndex = 0;
            btnCopyToClipboard.Text = "📋 Copy to Clipboard";
            btnCopyToClipboard.UseVisualStyleBackColor = false;
            btnCopyToClipboard.Click += btnCopyToClipboard_Click;
            // 
            // btnSaveAsPdf
            // 
            btnSaveAsPdf.BackColor = Color.FromArgb(76, 175, 80);
            btnSaveAsPdf.Enabled = false;
            btnSaveAsPdf.FlatStyle = FlatStyle.Flat;
            btnSaveAsPdf.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            btnSaveAsPdf.ForeColor = Color.White;
            btnSaveAsPdf.Location = new Point(160, 5);
            btnSaveAsPdf.Name = "btnSaveAsPdf";
            btnSaveAsPdf.Size = new Size(120, 30);
            btnSaveAsPdf.TabIndex = 1;
            btnSaveAsPdf.Text = "📄 Save as PDF";
            btnSaveAsPdf.UseVisualStyleBackColor = false;
            btnSaveAsPdf.Click += btnSaveAsPdf_Click;
            // 
            // btnShare
            // 
            btnShare.BackColor = Color.FromArgb(255, 152, 0);
            btnShare.Enabled = false;
            btnShare.FlatStyle = FlatStyle.Flat;
            btnShare.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            btnShare.ForeColor = Color.White;
            btnShare.Location = new Point(290, 5);
            btnShare.Name = "btnShare";
            btnShare.Size = new Size(100, 30);
            btnShare.TabIndex = 2;
            btnShare.Text = "📤 Share";
            btnShare.UseVisualStyleBackColor = false;
            btnShare.Click += btnShare_Click;
            // 
            // btnClearOutputs
            // 
            btnClearOutputs.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            btnClearOutputs.BackColor = Color.FromArgb(244, 67, 54);
            btnClearOutputs.FlatStyle = FlatStyle.Flat;
            btnClearOutputs.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            btnClearOutputs.ForeColor = Color.White;
            btnClearOutputs.Location = new Point(670, 5);
            btnClearOutputs.Name = "btnClearOutputs";
            btnClearOutputs.Size = new Size(120, 30);
            btnClearOutputs.TabIndex = 3;
            btnClearOutputs.Text = "🗑️ Clear All";
            btnClearOutputs.UseVisualStyleBackColor = false;
            btnClearOutputs.Click += btnClearOutputs_Click;
            // 
            // Form1
            // 
            AutoScaleDimensions = new SizeF(8F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1370, 749);
            Controls.Add(tableLayoutMain);
            Font = new Font("Segoe UI", 11F);
            MinimumSize = new Size(1200, 700);
            Name = "Form1";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "AI Study Companion";
            FormClosing += Form1_FormClosing;
            tableLayoutMain.ResumeLayout(false);
            panelTop.ResumeLayout(false);
            panelTop.PerformLayout();
            panelLeft.ResumeLayout(false);
            groupInput.ResumeLayout(false);
            groupInput.PerformLayout();
            panelInputBottom.ResumeLayout(false);
            panelInputBottom.PerformLayout();
            groupLanguage.ResumeLayout(false);
            groupLanguage.PerformLayout();
            groupProcessing.ResumeLayout(false);
            panelRight.ResumeLayout(false);
            groupOutput.ResumeLayout(false);
            panelOutputActions.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private System.Windows.Forms.TableLayoutPanel tableLayoutMain;
        private System.Windows.Forms.Panel panelTop;
        private System.Windows.Forms.Panel panelLeft;
        private System.Windows.Forms.Panel panelRight;
        
        private System.Windows.Forms.Label lblTitle;
        private System.Windows.Forms.Label lblSubtitle;
        private System.Windows.Forms.Button btnConfigureApi;
        private System.Windows.Forms.Label lblApiStatus;
        
        private System.Windows.Forms.GroupBox groupInput;
        private System.Windows.Forms.TextBox txtInput;
        private System.Windows.Forms.Panel panelInputBottom;
        private System.Windows.Forms.Label lblCharCount;
        private System.Windows.Forms.Button btnClearInput;
        
        private System.Windows.Forms.GroupBox groupLanguage;
        private System.Windows.Forms.ComboBox cmbLanguage;
        private System.Windows.Forms.Label lblLanguageInfo;
        
        private System.Windows.Forms.GroupBox groupProcessing;
        private System.Windows.Forms.Button btnSummary;
        private System.Windows.Forms.Button btnQuiz;
        private System.Windows.Forms.Button btnMnemonics;
        
        private System.Windows.Forms.GroupBox groupOutput;
        private System.Windows.Forms.TabControl tabControlOutputs;
        private System.Windows.Forms.Panel panelOutputActions;
        private System.Windows.Forms.Button btnCopyToClipboard;
        private System.Windows.Forms.Button btnSaveAsPdf;
        private System.Windows.Forms.Button btnShare;
        private System.Windows.Forms.Button btnClearOutputs;
    }
}
