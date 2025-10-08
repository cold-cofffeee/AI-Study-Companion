using iTextSharp.text;
using iTextSharp.text.pdf;
using System.IO;

namespace StudyBuddy
{
    public class PdfGenerator
    {
        public static void CreatePdf(string content, string filePath, string title = "AI Study Companion Output")
        {
            try
            {
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    var document = new Document(PageSize.A4, 50, 50, 25, 25);
                    var writer = PdfWriter.GetInstance(document, fileStream);
                    
                    document.Open();
                    
                    // Add title
                    var titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 16);
                    var titleParagraph = new Paragraph(title, titleFont)
                    {
                        Alignment = Element.ALIGN_CENTER
                    };
                    document.Add(titleParagraph);
                    document.Add(new Paragraph(" ")); // Empty line
                    
                    // Add content
                    var contentFont = FontFactory.GetFont(FontFactory.HELVETICA, 12);
                    var contentParagraph = new Paragraph(content, contentFont);
                    document.Add(contentParagraph);
                    
                    document.Close();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error creating PDF: {ex.Message}");
            }
        }
    }
}