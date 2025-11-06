// Gemini API Client
const axios = require('axios');

class GeminiApiClient {
    constructor(apiKey) {
        // Use provided API key or fallback to environment variable
        this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
        
        if (!this.apiKey) {
            console.warn('Warning: No Gemini API key configured. Please set it in Settings or .env file');
        }
    }

    async generateContent(prompt) {
        try {
            const response = await axios.post(
                `${this.baseUrl}?key=${this.apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 60000
                }
            );

            if (response.data && response.data.candidates && response.data.candidates[0]) {
                return response.data.candidates[0].content.parts[0].text;
            }

            throw new Error('Invalid response from Gemini API');
        } catch (error) {
            console.error('Gemini API error:', error);
            throw new Error(`API Error: ${error.message}`);
        }
    }

    async generateSummary(text, language = 'en') {
        const languageInstruction = language !== 'en' ? ` Please respond in ${this.getLanguageName(language)}.` : '';
        
        const prompt = `
            Analyze the following text and create a comprehensive study summary.${languageInstruction}
            
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

    async generateQuiz(text, language = 'en') {
        const languageInstruction = language !== 'en' ? ` Please respond in ${this.getLanguageName(language)}.` : '';
        
        const prompt = `
            Based on the following text, create 5 multiple-choice quiz questions.${languageInstruction}
            
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

    async generateMnemonics(text, language = 'en') {
        const languageInstruction = language !== 'en' ? ` Please respond in ${this.getLanguageName(language)}.` : '';
        
        const prompt = `
            Create memory tricks and mnemonics for the key concepts in this text.${languageInstruction}
            
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

    async generateProblems(subject, difficulty, count, language = 'en') {
        const languageInstruction = language !== 'en' ? ` Please respond in ${this.getLanguageName(language)}.` : '';
        
        const prompt = `
            Generate ${count} ${difficulty} difficulty practice problems for ${subject}.${languageInstruction}
            
            For each problem, provide:
            1. The problem statement
            2. Step-by-step solution
            3. Final answer
            
            Format clearly with problem numbers.
        `;

        return await this.generateContent(prompt);
    }

    async generateStudySchedule(topic, duration, difficulty, language = 'en') {
        const languageInstruction = language !== 'en' ? ` Please respond in ${this.getLanguageName(language)}.` : '';
        
        const prompt = `
            Create an optimized ${duration}-minute study schedule for learning: ${topic}
            Difficulty level: ${difficulty}${languageInstruction}
            
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
