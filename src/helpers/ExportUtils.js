// Export Utilities for AI-Generated Content
// Provides copy to clipboard and export to PDF functionality

const ExportUtils = {
    /**
     * Copy text content to clipboard
     * @param {string} content - The content to copy
     * @param {string} successMessage - Message to show on success
     */
    async copyToClipboard(content, successMessage = 'Content copied to clipboard!') {
        try {
            await navigator.clipboard.writeText(content);
            showToast(successMessage, 'success');
            return true;
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            showToast('Failed to copy to clipboard', 'error');
            return false;
        }
    },

    /**
     * Export content to PDF using browser's print dialog
     * @param {string} content - HTML content to export
     * @param {string} title - Document title
     * @param {Object} options - Additional options
     */
    async exportToPDF(content, title = 'AI Study Content', options = {}) {
        try {
            const {
                includeTimestamp = true,
                moduleType = 'Content',
                metadata = {}
            } = options;

            // Create a hidden iframe for printing
            const printWindow = document.createElement('iframe');
            printWindow.style.position = 'fixed';
            printWindow.style.right = '0';
            printWindow.style.bottom = '0';
            printWindow.style.width = '0';
            printWindow.style.height = '0';
            printWindow.style.border = 'none';
            document.body.appendChild(printWindow);

            const doc = printWindow.contentDocument || printWindow.contentWindow.document;
            
            // Build HTML document for PDF
            const timestamp = includeTimestamp ? new Date().toLocaleString() : '';
            const metadataHtml = Object.entries(metadata)
                .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
                .join('');

            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        @page {
            margin: 2.5cm;
            size: A4;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            max-width: 100%;
            margin: 0;
            padding: 0;
            position: relative;
        }
        
        /* Watermark */
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            font-weight: bold;
            color: rgba(74, 144, 226, 0.08);
            z-index: -1;
            white-space: nowrap;
            pointer-events: none;
            user-select: none;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            margin-bottom: 30px;
            text-align: center;
            border-radius: 0;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        
        .header .subtitle {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .header .logo {
            font-size: 48px;
            margin-bottom: 10px;
        }
        
        .metadata {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 0 20px 30px 20px;
            border-left: 4px solid #667eea;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .metadata h3 {
            margin: 0 0 15px 0;
            color: #667eea;
            font-size: 18px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .metadata p {
            margin: 8px 0;
            color: #495057;
            font-size: 13px;
        }
        
        .metadata strong {
            color: #2c3e50;
            min-width: 120px;
            display: inline-block;
        }
        
        .content {
            font-size: 14px;
            padding: 0 20px;
        }
        
        .content h2 {
            color: #667eea;
            border-left: 5px solid #667eea;
            padding-left: 15px;
            margin: 30px 0 15px 0;
            font-size: 22px;
        }
        
        .content h3 {
            color: #495057;
            margin-top: 20px;
            font-size: 18px;
        }
        
        .content p {
            margin: 12px 0;
            text-align: justify;
            line-height: 1.8;
        }
        
        .content ul, .content ol {
            margin: 15px 0;
            padding-left: 35px;
        }
        
        .content li {
            margin: 8px 0;
            line-height: 1.6;
        }
        
        .content pre, .content code {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            overflow-x: auto;
            border: 1px solid #e9ecef;
        }
        
        .content strong {
            color: #667eea;
            font-weight: 600;
        }
        
        .problem-card {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            page-break-inside: avoid;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .problem-header {
            font-weight: 700;
            color: #667eea;
            margin-bottom: 15px;
            font-size: 18px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 8px;
        }
        
        .hints {
            margin-top: 15px;
            padding: 15px;
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            border-radius: 5px;
        }
        
        .hints strong {
            color: #856404;
        }
        
        .solution {
            margin-top: 15px;
            padding: 15px;
            background: #d4edda;
            border-left: 4px solid #28a745;
            border-radius: 5px;
        }
        
        .solution strong {
            color: #155724;
        }
        
        .footer {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            margin-top: 50px;
            padding: 25px 20px;
            border-radius: 0;
        }
        
        .footer .brand {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .footer .tagline {
            font-size: 12px;
            opacity: 0.9;
            font-style: italic;
        }
        
        .footer .copyright {
            font-size: 11px;
            margin-top: 10px;
            opacity: 0.8;
        }
        
        .task-breakdown {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
            border-left: 4px solid #667eea;
        }
        
        .task-breakdown h4 {
            color: #667eea;
            margin: 0 0 10px 0;
            font-size: 16px;
        }
        
        .difficulty-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin-left: 10px;
        }
        
        .difficulty-easy {
            background: #d4edda;
            color: #155724;
        }
        
        .difficulty-medium {
            background: #fff3cd;
            color: #856404;
        }
        
        .difficulty-hard {
            background: #f8d7da;
            color: #721c24;
        }
        
        @media print {
            body {
                padding: 0;
            }
            
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <!-- Watermark -->
    <div class="watermark">STUDY BUDDY PRO</div>
    
    <div class="header">
        <div class="logo">📚</div>
        <h1>${title}</h1>
        <div class="subtitle">${moduleType}</div>
    </div>
    
    ${metadataHtml || timestamp ? `
    <div class="metadata">
        <h3>📋 Document Information</h3>
        ${timestamp ? `<p><strong>Generated On:</strong> ${timestamp}</p>` : ''}
        ${metadataHtml}
    </div>
    ` : ''}
    
    <div class="content">
        ${content}
    </div>
    
    <div class="footer">
        <div class="brand">📚 Study Buddy Pro</div>
        <div class="tagline">AI-Powered Learning Companion</div>
        <div class="copyright">© ${new Date().getFullYear()} Study Buddy Pro. Generated with ❤️ for students worldwide.</div>
    </div>
</body>
</html>`;

            doc.open();
            doc.write(htmlContent);
            doc.close();

            // Wait for content to load
            await new Promise(resolve => setTimeout(resolve, 500));

            // Trigger print dialog (user can save as PDF)
            printWindow.contentWindow.focus();
            printWindow.contentWindow.print();

            // Clean up after printing
            setTimeout(() => {
                document.body.removeChild(printWindow);
            }, 1000);

            showToast('PDF export ready! Use the print dialog to save.', 'success');
            return true;
        } catch (error) {
            console.error('Failed to export PDF:', error);
            showToast('Failed to export PDF: ' + error.message, 'error');
            return false;
        }
    },

    /**
     * Get plain text from HTML content
     * @param {string} htmlContent - HTML string
     * @returns {string} Plain text
     */
    htmlToPlainText(htmlContent) {
        const temp = document.createElement('div');
        temp.innerHTML = htmlContent;
        return temp.textContent || temp.innerText || '';
    },

    /**
     * Create export buttons HTML
     * @param {string} copyHandler - Function name to call for copy
     * @param {string} pdfHandler - Function name to call for PDF
     * @returns {string} HTML string for buttons
     */
    createExportButtons(copyHandler, pdfHandler) {
        return `
            <div class="export-buttons" style="display: flex; gap: 10px; margin-top: 15px;">
                <button class="btn btn-outline" onclick="${copyHandler}" title="Copy to Clipboard">
                    📋 Copy
                </button>
                <button class="btn btn-outline" onclick="${pdfHandler}" title="Export as PDF">
                    📄 Save as PDF
                </button>
            </div>
        `;
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.ExportUtils = ExportUtils;
}
