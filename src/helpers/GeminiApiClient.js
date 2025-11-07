// Gemini API Client
// Compatible with both Node.js (main process) and Browser (renderer process)

class GeminiApiClient {
    constructor(apiKey) {
        // Use provided API key or fallback to environment variable
        this.apiKey = apiKey || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '') || '';
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
        
        if (!this.apiKey) {
            console.warn('Warning: No Gemini API key configured. Please set it in Settings or .env file');
        }
    }

    async generateContent(prompt) {
        try {
            // Use fetch API (works in both browser and Node.js 18+)
            const response = await fetch(
                `${this.baseUrl}?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }]
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.candidates && data.candidates[0]) {
                return data.candidates[0].content.parts[0].text;
            }

            throw new Error('Invalid response from Gemini API');
        } catch (error) {
            console.error('Gemini API error:', error);
            throw new Error(`API Error: ${error.message}`);
        }
    }

    async generateSummary(text, language = 'en', hscContext = false) {
        const languageInstruction = language !== 'en' ? ` Please respond in ${this.getLanguageName(language)}.` : '';
        const hscInstruction = hscContext ? `\n\n[HSC BANGLADESH CONTEXT]: You are helping a Higher Secondary Certificate (HSC) student from Bangladesh. Please provide explanations that align with the Bangladesh HSC curriculum. Use both Bengali and English terms where appropriate. Reference HSC exam patterns and standard textbook approaches when relevant.` : '';
        
        const prompt = `
            Analyze the following text and create a comprehensive study summary.${languageInstruction}${hscInstruction}
            
            Please provide:
            1. Key points in bullet format
            2. Main concepts
            3. Important details to remember
            
            Text to analyze:
            ${text}
            
            Format the response clearly with headers and bullet points.
        `;

        return await this.generateContent(prompt);
    }

    async generateQuiz(text, language = 'en', hscContext = false) {
        const languageInstruction = language !== 'en' ? ` Please respond in ${this.getLanguageName(language)}.` : '';
        const hscInstruction = hscContext ? `\n\n[HSC BANGLADESH CONTEXT]: Create quiz questions that align with HSC Bangladesh exam patterns. Use MCQ format similar to HSC board questions. Include both Bengali and English terms where appropriate.` : '';
        
        const prompt = `
            Based on the following text, create 5 multiple-choice quiz questions.${languageInstruction}${hscInstruction}
            
            Format each question as:
            Q#: [Question]
            A) [Option 1]
            B) [Option 2]
            C) [Option 3]
            D) [Option 4]
            Correct Answer: [Letter]
            Explanation: [Brief explanation]
            
            Text:
            ${text}
        `;

        return await this.generateContent(prompt);
    }

    async generateMnemonics(text, language = 'en', hscContext = false) {
        const languageInstruction = language !== 'en' ? ` Please respond in ${this.getLanguageName(language)}.` : '';
        const hscInstruction = hscContext ? `\n\n[HSC BANGLADESH CONTEXT]: Create memory tricks that resonate with Bangladeshi HSC students. Use Bengali cultural references, local examples, and both Bengali/English terms where helpful.` : '';
        
        const prompt = `
            Create memory tricks and mnemonics for the key concepts in this text.${languageInstruction}${hscInstruction}
            
            Provide:
            1. Acronyms for lists
            2. Associations and connections
            3. Visual imagery suggestions
            4. Rhymes or phrases to remember
            
            Text:
            ${text}
        `;

        return await this.generateContent(prompt);
    }

    async generateProblems(subject, difficulty, count, language = 'en', hscContext = false) {
        const languageInstruction = language !== 'en' ? ` Please respond in ${this.getLanguageName(language)}.` : '';
        const hscInstruction = hscContext ? `\n\n[HSC BANGLADESH CONTEXT]: Generate problems that match HSC Bangladesh syllabus and exam difficulty. Follow HSC board question patterns and use standard notation from HSC textbooks.` : '';
        
        const prompt = `
            Generate ${count} ${difficulty} difficulty practice problems for ${subject}.${languageInstruction}${hscInstruction}
            
            For each problem, provide:
            1. The problem statement
            2. Step-by-step solution
            3. Final answer
            
            Format clearly with problem numbers.
        `;

        return await this.generateContent(prompt);
    }

    async generateStudySchedule(topic, duration, difficulty, language = 'en', hscContext = false) {
        const languageInstruction = language !== 'en' ? ` Please respond in ${this.getLanguageName(language)}.` : '';
        const hscInstruction = hscContext ? `\n\n[HSC BANGLADESH CONTEXT]: Create a study schedule optimized for HSC Bangladesh exam preparation. Consider HSC syllabus structure, board exam patterns, and typical study practices in Bangladesh.` : '';
        
        const prompt = `
            Create an optimized ${duration}-minute study schedule for learning: ${topic}
            Difficulty level: ${difficulty}${languageInstruction}${hscInstruction}
            
            Use the Pomodoro technique with:
            - 25-minute focused study blocks
            - 5-minute short breaks
            - 15-minute long break after 4 sessions
            
            Include:
            1. Time blocks with activities
            2. Break suggestions
            3. Quick review prompts
            
            Format as a clear schedule.
        `;

        return await this.generateContent(prompt);
    }

    getLanguageName(code) {
        const languages = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese'
        };
        return languages[code] || 'English';
    }

    async testConnection() {
        try {
            await this.generateContent('Say "API connection successful"');
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = GeminiApiClient;
