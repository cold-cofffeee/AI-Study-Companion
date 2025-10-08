using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Threading.Tasks;
using System.Windows.Forms;
using PdfSharp.Drawing;
using PdfSharp.Pdf;

namespace StudyBuddy.Helpers
{
    /// <summary>
    /// PDF and Image export utilities for Study Buddy
    /// Handles exporting content to PDF and PNG formats
    /// </summary>
    public static class ExportHelper
    {
        /// <summary>
        /// Export RichTextBox content to PDF with proper formatting
        /// </summary>
        /// <param name="content">Text content to export</param>
        /// <param name="title">Document title</param>
        /// <param name="filePath">Output file path</param>
        /// <returns>True if successful</returns>
        public static async Task<bool> ExportToPdfAsync(string content, string title, string filePath)
        {
            try
            {
                await Task.Run(() =>
                {
                    // Create a new PDF document
                    var document = new PdfDocument();
                    document.Info.Title = title;
                    document.Info.Creator = "Study Buddy";
                    document.Info.CreationDate = DateTime.Now;

                    // Create a page
                    var page = document.AddPage();
                    var graphics = XGraphics.FromPdfPage(page);

                    // Define fonts
                    var titleFont = new XFont("Segoe UI", 16, XFontStyleEx.Bold);
                    var headerFont = new XFont("Segoe UI", 12, XFontStyleEx.Bold);
                    var bodyFont = new XFont("Segoe UI", 10, XFontStyleEx.Regular);
                    var codeFont = new XFont("Consolas", 9, XFontStyleEx.Regular);

                    // Define colors
                    var titleColor = XBrushes.DarkBlue;
                    var headerColor = XBrushes.DarkSlateGray;
                    var bodyColor = XBrushes.Black;

                    // Starting position
                    double yPosition = 50;
                    const double leftMargin = 50;
                    const double rightMargin = 50;
                    const double pageWidth = 595; // A4 width in points
                    const double contentWidth = pageWidth - leftMargin - rightMargin;

                    // Draw title
                    graphics.DrawString(title, titleFont, titleColor, new XPoint(leftMargin, yPosition));
                    yPosition += 30;

                    // Draw date
                    var dateText = $"Generated on {DateTime.Now:MMMM dd, yyyy}";
                    graphics.DrawString(dateText, bodyFont, XBrushes.Gray, new XPoint(leftMargin, yPosition));
                    yPosition += 25;

                    // Draw separator line
                    graphics.DrawLine(XPens.LightGray, leftMargin, yPosition, pageWidth - rightMargin, yPosition);
                    yPosition += 20;

                    // Process content line by line
                    var lines = content.Split('\n');
                    foreach (var line in lines)
                    {
                        if (string.IsNullOrWhiteSpace(line))
                        {
                            yPosition += 8;
                            continue;
                        }

                        var trimmedLine = line.Trim();
                        XFont currentFont = bodyFont;
                        XBrush currentBrush = bodyColor;

                        // Determine line type and styling
                        if (trimmedLine.StartsWith("# "))
                        {
                            currentFont = titleFont;
                            currentBrush = titleColor;
                            trimmedLine = trimmedLine.Substring(2);
                            yPosition += 5;
                        }
                        else if (trimmedLine.StartsWith("## "))
                        {
                            currentFont = headerFont;
                            currentBrush = headerColor;
                            trimmedLine = trimmedLine.Substring(3);
                            yPosition += 5;
                        }
                        else if (trimmedLine.StartsWith("- ") || trimmedLine.StartsWith("• "))
                        {
                            trimmedLine = "  • " + trimmedLine.Substring(2);
                        }
                        else if (trimmedLine.Contains("`"))
                        {
                            currentFont = codeFont;
                            currentBrush = XBrushes.DarkRed;
                        }

                        // Check if we need a new page
                        if (yPosition > page.Height - 100)
                        {
                            page = document.AddPage();
                            graphics = XGraphics.FromPdfPage(page);
                            yPosition = 50;
                        }

                        // Word wrap for long lines
                        var words = trimmedLine.Split(' ');
                        var currentLine = "";
                        
                        foreach (var word in words)
                        {
                            var testLine = string.IsNullOrEmpty(currentLine) ? word : currentLine + " " + word;
                            var testWidth = graphics.MeasureString(testLine, currentFont).Width;
                            
                            if (testWidth > contentWidth && !string.IsNullOrEmpty(currentLine))
                            {
                                // Draw the current line
                                graphics.DrawString(currentLine, currentFont, currentBrush, new XPoint(leftMargin, yPosition));
                                yPosition += 15;
                                currentLine = word;
                                
                                // Check for new page again
                                if (yPosition > page.Height - 100)
                                {
                                    page = document.AddPage();
                                    graphics = XGraphics.FromPdfPage(page);
                                    yPosition = 50;
                                }
                            }
                            else
                            {
                                currentLine = testLine;
                            }
                        }
                        
                        // Draw the remaining text
                        if (!string.IsNullOrEmpty(currentLine))
                        {
                            graphics.DrawString(currentLine, currentFont, currentBrush, new XPoint(leftMargin, yPosition));
                            yPosition += 15;
                        }
                    }

                    // Save the document
                    document.Save(filePath);
                    document.Close();
                });

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to export PDF: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Export control content to PNG image (Study Card)
        /// </summary>
        /// <param name="control">Control to capture</param>
        /// <param name="title">Card title</param>
        /// <param name="filePath">Output file path</param>
        /// <returns>True if successful</returns>
        public static async Task<bool> ExportToPngAsync(Control control, string title, string filePath)
        {
            try
            {
                await Task.Run(() =>
                {
                    var cardWidth = 800;
                    var cardHeight = 600;
                    
                    using (var bitmap = new Bitmap(cardWidth, cardHeight))
                    using (var graphics = Graphics.FromImage(bitmap))
                    {
                        // Set high quality rendering
                        graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
                        graphics.TextRenderingHint = System.Drawing.Text.TextRenderingHint.ClearTypeGridFit;

                        // Create gradient background
                        using (var brush = new System.Drawing.Drawing2D.LinearGradientBrush(
                            new Rectangle(0, 0, cardWidth, cardHeight),
                            Color.FromArgb(63, 81, 181),
                            Color.FromArgb(33, 150, 243),
                            45f))
                        {
                            graphics.FillRectangle(brush, 0, 0, cardWidth, cardHeight);
                        }

                        // Draw border
                        using (var borderPen = new Pen(Color.White, 3))
                        {
                            graphics.DrawRectangle(borderPen, 10, 10, cardWidth - 20, cardHeight - 20);
                        }

                        // Draw title
                        using (var titleFont = new Font("Segoe UI", 24, FontStyle.Bold))
                        using (var titleBrush = new SolidBrush(Color.White))
                        {
                            var titleSize = graphics.MeasureString(title, titleFont);
                            var titleX = (cardWidth - titleSize.Width) / 2;
                            graphics.DrawString(title, titleFont, titleBrush, titleX, 30);
                        }

                        // Draw Study Buddy watermark
                        using (var watermarkFont = new Font("Segoe UI", 12, FontStyle.Regular))
                        using (var watermarkBrush = new SolidBrush(Color.FromArgb(200, 255, 255, 255)))
                        {
                            graphics.DrawString("Study Buddy", watermarkFont, watermarkBrush, 30, 30);
                        }

                        // Draw date
                        var dateText = DateTime.Now.ToString("MMMM dd, yyyy");
                        using (var dateFont = new Font("Segoe UI", 10, FontStyle.Regular))
                        using (var dateBrush = new SolidBrush(Color.FromArgb(200, 255, 255, 255)))
                        {
                            var dateSize = graphics.MeasureString(dateText, dateFont);
                            graphics.DrawString(dateText, dateFont, dateBrush, cardWidth - dateSize.Width - 30, 30);
                        }

                        // Content area background
                        var contentRect = new Rectangle(40, 100, cardWidth - 80, cardHeight - 140);
                        using (var contentBrush = new SolidBrush(Color.FromArgb(240, 255, 255, 255)))
                        {
                            graphics.FillRoundedRectangle(contentBrush, contentRect, 10);
                        }

                        // Draw content
                        if (control is RichTextBox rtb && !string.IsNullOrEmpty(rtb.Text))
                        {
                            var contentText = rtb.Text;
                            if (contentText.Length > 500)
                            {
                                contentText = contentText.Substring(0, 500) + "...";
                            }

                            using (var contentFont = new Font("Segoe UI", 11, FontStyle.Regular))
                            using (var contentBrush = new SolidBrush(Color.FromArgb(60, 60, 60)))
                            {
                                var contentArea = new RectangleF(60, 120, cardWidth - 120, cardHeight - 180);
                                var format = new StringFormat
                                {
                                    Alignment = StringAlignment.Near,
                                    LineAlignment = StringAlignment.Near,
                                    FormatFlags = StringFormatFlags.LineLimit
                                };

                                graphics.DrawString(contentText, contentFont, contentBrush, contentArea, format);
                            }
                        }

                        // Save the image
                        bitmap.Save(filePath, ImageFormat.Png);
                    }
                });

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to export PNG: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Create a daily summary card as PNG
        /// </summary>
        /// <param name="summaryPoints">Key summary points</param>
        /// <param name="date">Date for the card</param>
        /// <param name="filePath">Output file path</param>
        /// <returns>True if successful</returns>
        public static async Task<bool> CreateDailySummaryCardAsync(string[] summaryPoints, DateTime date, string filePath)
        {
            try
            {
                await Task.Run(() =>
                {
                    var cardWidth = 600;
                    var cardHeight = 400;
                    
                    using (var bitmap = new Bitmap(cardWidth, cardHeight))
                    using (var graphics = Graphics.FromImage(bitmap))
                    {
                        graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
                        graphics.TextRenderingHint = System.Drawing.Text.TextRenderingHint.ClearTypeGridFit;

                        // Background gradient
                        using (var brush = new System.Drawing.Drawing2D.LinearGradientBrush(
                            new Rectangle(0, 0, cardWidth, cardHeight),
                            Color.FromArgb(76, 175, 80),
                            Color.FromArgb(129, 199, 132),
                            90f))
                        {
                            graphics.FillRectangle(brush, 0, 0, cardWidth, cardHeight);
                        }

                        // Header
                        using (var headerFont = new Font("Segoe UI", 18, FontStyle.Bold))
                        using (var headerBrush = new SolidBrush(Color.White))
                        {
                            var headerText = $"Daily Study Summary - {date:MMM dd, yyyy}";
                            var headerSize = graphics.MeasureString(headerText, headerFont);
                            var headerX = (cardWidth - headerSize.Width) / 2;
                            graphics.DrawString(headerText, headerFont, headerBrush, headerX, 30);
                        }

                        // Summary points
                        var yPos = 100;
                        using (var bulletFont = new Font("Segoe UI", 12, FontStyle.Regular))
                        using (var bulletBrush = new SolidBrush(Color.White))
                        {
                            for (int i = 0; i < Math.Min(summaryPoints.Length, 3); i++)
                            {
                                var point = summaryPoints[i];
                                if (point.Length > 60)
                                {
                                    point = point.Substring(0, 60) + "...";
                                }
                                
                                graphics.DrawString($"• {point}", bulletFont, bulletBrush, 50, yPos);
                                yPos += 35;
                            }
                        }

                        // Footer
                        using (var footerFont = new Font("Segoe UI", 10, FontStyle.Italic))
                        using (var footerBrush = new SolidBrush(Color.FromArgb(200, 255, 255, 255)))
                        {
                            graphics.DrawString("Generated by Study Buddy", footerFont, footerBrush, 50, cardHeight - 40);
                        }

                        bitmap.Save(filePath, ImageFormat.Png);
                    }
                });

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to create daily summary card: {ex.Message}", ex);
            }
        }
    }

    /// <summary>
    /// Extension methods for drawing rounded rectangles
    /// </summary>
    public static class GraphicsExtensions
    {
        public static void FillRoundedRectangle(this Graphics graphics, Brush brush, Rectangle rect, int radius)
        {
            using (var path = CreateRoundedRectanglePath(rect, radius))
            {
                graphics.FillPath(brush, path);
            }
        }

        public static void DrawRoundedRectangle(this Graphics graphics, Pen pen, Rectangle rect, int radius)
        {
            using (var path = CreateRoundedRectanglePath(rect, radius))
            {
                graphics.DrawPath(pen, path);
            }
        }

        private static System.Drawing.Drawing2D.GraphicsPath CreateRoundedRectanglePath(Rectangle rect, int radius)
        {
            var path = new System.Drawing.Drawing2D.GraphicsPath();
            var diameter = radius * 2;

            path.AddArc(rect.X, rect.Y, diameter, diameter, 180, 90);
            path.AddArc(rect.Right - diameter, rect.Y, diameter, diameter, 270, 90);
            path.AddArc(rect.Right - diameter, rect.Bottom - diameter, diameter, diameter, 0, 90);
            path.AddArc(rect.X, rect.Bottom - diameter, diameter, diameter, 90, 90);
            path.CloseFigure();

            return path;
        }
    }
}