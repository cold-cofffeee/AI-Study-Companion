// About Module
const About = {
    async render() {
        return `
            <div class="module-header">
                <h1 class="module-title">ℹ️ About Study Buddy Pro</h1>
                <p class="module-description">AI-Powered Learning Companion</p>
            </div>

            <div class="card" style="text-align: center;">
                <div style="font-size: 64px; margin-bottom: 20px;">📚</div>
                <h2 style="color: var(--primary-color); margin-bottom: 10px;">Study Buddy Pro</h2>
                <p style="color: var(--text-secondary); font-size: 18px; margin-bottom: 30px;">Version 2.0.0</p>
                
                <p style="max-width: 600px; margin: 0 auto 30px; line-height: 1.6;">
                    Study Buddy Pro is a comprehensive AI-powered learning companion designed to enhance 
                    your study experience through intelligent summaries, practice problems, optimized schedules, 
                    and spaced repetition flashcards.
                </p>
            </div>

            <div class="card">
                <h2 class="card-title">✨ Features</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    <div>
                        <h4 style="color: var(--primary-color); margin-bottom: 10px;">📊 Dashboard</h4>
                        <p style="color: var(--text-secondary); font-size: 14px;">
                            Track your study sessions, view stats, and access daily challenges
                        </p>
                    </div>
                    <div>
                        <h4 style="color: var(--primary-color); margin-bottom: 10px;">📝 AI Summarizer</h4>
                        <p style="color: var(--text-secondary); font-size: 14px;">
                            Generate summaries, quizzes, and memory tricks from any text
                        </p>
                    </div>
                    <div>
                        <h4 style="color: var(--primary-color); margin-bottom: 10px;">🧮 Problem Generator</h4>
                        <p style="color: var(--text-secondary); font-size: 14px;">
                            Create practice problems for Math, Physics, Chemistry, and more
                        </p>
                    </div>
                    <div>
                        <h4 style="color: var(--primary-color); margin-bottom: 10px;">⏰ Study Optimizer</h4>
                        <p style="color: var(--text-secondary); font-size: 14px;">
                            Optimize your study time with Pomodoro-based schedules
                        </p>
                    </div>
                    <div>
                        <h4 style="color: var(--primary-color); margin-bottom: 10px;">🎴 Flashcards</h4>
                        <p style="color: var(--text-secondary); font-size: 14px;">
                            Spaced repetition system for effective memorization
                        </p>
                    </div>
                    <div>
                        <h4 style="color: var(--primary-color); margin-bottom: 10px;">❓ Reverse Quiz</h4>
                        <p style="color: var(--text-secondary); font-size: 14px;">
                            Generate quizzes from answers and key concepts
                        </p>
                    </div>
                </div>
            </div>

            <div class="card">
                <h2 class="card-title">🚀 Getting Started</h2>
                <ol style="line-height: 2; padding-left: 20px;">
                    <li>Get your free Google Gemini API key from 
                        <a href="https://aistudio.google.com/app/apikey" 
                           style="color: var(--primary-color);">Google AI Studio</a>
                    </li>
                    <li>Go to Settings and enter your API key</li>
                    <li>Test the connection to verify it works</li>
                    <li>Start using AI-powered study features!</li>
                </ol>
            </div>

            <div class="card">
                <h2 class="card-title">🛠️ Technology Stack</h2>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
                    <span style="padding: 8px 15px; background: var(--hover-color); border-radius: 20px; font-size: 14px;">
                        Electron.js
                    </span>
                    <span style="padding: 8px 15px; background: var(--hover-color); border-radius: 20px; font-size: 14px;">
                        Node.js
                    </span>
                    <span style="padding: 8px 15px; background: var(--hover-color); border-radius: 20px; font-size: 14px;">
                        SQLite
                    </span>
                    <span style="padding: 8px 15px; background: var(--hover-color); border-radius: 20px; font-size: 14px;">
                        Google Gemini AI
                    </span>
                    <span style="padding: 8px 15px; background: var(--hover-color); border-radius: 20px; font-size: 14px;">
                        HTML/CSS/JavaScript
                    </span>
                </div>
            </div>

            <div class="card">
                <h2 class="card-title">📄 License & Credits</h2>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    <strong>License:</strong> MIT License<br>
                    <strong>Powered by:</strong> Google Gemini AI<br>
                    <strong>Version:</strong> 2.0.0 (Electron Edition)<br>
                    <strong>Built with:</strong> ❤️ for students everywhere
                </p>
            </div>

            <div class="card" style="text-align: center;">
                <p style="color: var(--text-secondary); margin-bottom: 20px;">
                    Need help or have feedback? We'd love to hear from you!
                </p>
                <div class="flex gap-10 flex-center">
                    <button class="btn btn-outline" onclick="About.openGitHub()">
                        💻 GitHub
                    </button>
                    <button class="btn btn-outline" onclick="About.openDocs()">
                        📚 Documentation
                    </button>
                    <button class="btn btn-outline" onclick="About.reportBug()">
                        🐛 Report Bug
                    </button>
                </div>
            </div>

            <div style="text-align: center; padding: 30px; color: var(--text-secondary); font-size: 14px;">
                © 2024 Study Buddy Pro. All rights reserved.<br>
                Made with ❤️ for lifelong learners
            </div>
        `;
    },

    async init() {
        // Module initialized
    },

    openGitHub() {
        require('electron').shell.openExternal('https://github.com');
    },

    openDocs() {
        showToast('Documentation coming soon!', 'info');
    },

    reportBug() {
        showToast('Please report bugs via GitHub Issues', 'info');
    }
};

window.About = About;
