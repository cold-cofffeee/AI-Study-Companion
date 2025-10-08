# AI Study Companion

A complete Windows Forms desktop application built with .NET 8 that transforms your study materials using AI-powered features.

## ?? Features

### **Core Features:**
- **?? Text Input:** Large textbox for pasting notes or textbook content with character counter
- **?? Language Selection:** Support for 10+ languages including English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, and Chinese
- **?? AI Processing (Google Gemini API):**
  - **?? Generate Summary:** Creates comprehensive bullet-point summaries
  - **? Create Quiz:** Generates 3-5 quiz questions with multiple choice answers
  - **?? Memory Tricks:** Creates mnemonics and memory aids for key concepts

### **Output Display:**
- **?? Tabbed Interface:** Each output appears in a separate tab for easy organization
- **?? Copy to Clipboard:** One-click copying of any output
- **?? PDF Export:** Save outputs as professionally formatted PDF files
- **?? Share Feature:** Easy sharing of content via any platform

### **Additional Features:**
- **? Modern UI:** Clean, responsive design with proper labels and tooltips
- **?? API Configuration:** Secure API key management with configuration dialog
- **?? Clear Functions:** Easy clearing of input and outputs
- **?? Character Counter:** Real-time character count display
- **?? Professional Styling:** Color-coded buttons and modern interface

### **UI/UX Requirements:**
- **Clean Design:** Modern WinForms interface with proper spacing
- **Responsive Layout:** Scrollable output sections for long content
- **Error Handling:** Comprehensive error handling for API failures
- **Multi-language UI:** Interface elements update based on selected language

### **Code Requirements:**
- **Async API Calls:** Non-blocking API integration
- **Clean Code Structure:** Separate classes/methods for readability
- **NuGet Packages:** Uses iTextSharp for PDF generation and HTTP client for API calls

## ?? Getting Started

### Prerequisites
- Windows 10/11
- .NET 8 Runtime
- Visual Studio 2022 (for development)
- Google Gemini API Key (free)

### Installation
1. Clone or download this repository
2. Open `StudyBuddy.sln` in Visual Studio 2022
3. Restore NuGet packages (should happen automatically)
4. Build and run the application

### Getting Your Google Gemini API Key
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key for use in the application

### First Time Setup
1. Launch the application
2. Click "Configure API Key" in the top-right corner
3. Paste your Google Gemini API key
4. You're ready to start using AI features!

## ?? How to Use

### Basic Workflow:
1. **Paste Content:** Copy and paste your study material into the text input area
2. **Select Language:** Choose your preferred language for AI responses
3. **Choose AI Feature:** Click on Generate Summary, Create Quiz, or Memory Tricks
4. **Review Output:** Results appear in new tabs in the output section
5. **Export/Share:** Use the action buttons to copy, save as PDF, or share your results

### Features in Detail:

#### Text Input
- Supports any text content: notes, textbook excerpts, articles, etc.
- Real-time character counter
- Clear button for quick reset

#### Language Selection
- Choose from 10+ supported languages
- AI responses will be generated in the selected language
- Helpful for international students or multilingual learning

#### AI Processing Options
- **Summary:** Perfect for condensing long texts into key points
- **Quiz:** Great for self-testing and exam preparation
- **Memory Tricks:** Helps with memorization using mnemonics and associations

#### Output Management
- Multiple tabs for organizing different outputs
- Copy any output to clipboard instantly
- Export to PDF with proper formatting
- Share feature for collaboration

## ??? Technical Details

### Built With:
- **.NET 8** - Target framework
- **Windows Forms** - UI framework
- **Google Gemini API** - AI processing
- **iTextSharp** - PDF generation
- **Newtonsoft.Json** - JSON handling
- **System.Net.Http** - API communication

### Architecture:
- **Form1.cs** - Main application form and logic
- **GeminiApiClient.cs** - Google Gemini API integration
- **PdfGenerator.cs** - PDF creation functionality
- **Models.cs** - Data models and enums
- **ApiKeyDialog.cs** - API key configuration dialog
- **ShareDialog.cs** - Content sharing dialog

### Security:
- API keys are stored locally only
- No data is saved or transmitted beyond Google's API
- All communications use HTTPS

## ?? Use Cases

- **Students:** Summarize textbook chapters, create study quizzes, generate memory aids
- **Educators:** Prepare teaching materials and assessment questions
- **Researchers:** Condense research papers and create study guides
- **Professionals:** Summarize reports, training materials, and documentation

## ?? Troubleshooting

### Common Issues:

**"API Key not configured" error:**
- Ensure you've clicked "Configure API Key" and entered a valid key
- Verify your API key is active at [Google AI Studio](https://ai.google.dev/)

**"Error processing request" message:**
- Check your internet connection
- Verify your API key hasn't reached its quota limit
- Ensure the input text isn't empty

**PDF export fails:**
- Check that you have write permissions to the selected folder
- Ensure the filename doesn't contain invalid characters

### Performance Tips:
- Keep input text reasonable in size (under 10,000 characters recommended)
- Wait for one AI request to complete before starting another
- Use the clear functions periodically to free up memory

## ?? Notes

- This application requires an active internet connection for AI features
- Google Gemini API has free tier limits; check Google's documentation for current quotas
- The application stores no personal data and makes no network calls except to Google's API
- All processing happens through Google's secure API endpoints

## ?? Contributing

This is a complete, ready-to-use application. Feel free to fork and modify for your specific needs!

## ?? License

This project is provided as-is for educational and personal use.