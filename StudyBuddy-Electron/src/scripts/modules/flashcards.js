// Flashcards Module
// ipcRenderer is available globally via window.ipcRenderer from app.js

const Flashcards = {
    data: {
        cards: [],
        currentIndex: 0,
        isFlipped: false
    },

    async render() {
        return `
            <div class="module-header">
                <h1 class="module-title">🎴 Flashcard System</h1>
                <p class="module-description">Spaced repetition learning with flashcards</p>
            </div>

            <div class="card">
                <h2 class="card-title">➕ Create New Flashcard</h2>
                <div class="input-group">
                    <label class="input-label">Question/Front:</label>
                    <textarea id="flashcard-question" class="textarea-field" 
                              placeholder="Enter the question or front side of the card..."></textarea>
                </div>
                <div class="input-group">
                    <label class="input-label">Answer/Back:</label>
                    <textarea id="flashcard-answer" class="textarea-field" 
                              placeholder="Enter the answer or back side of the card..."></textarea>
                </div>
                <div class="flex gap-20" style="flex-wrap: wrap;">
                    <div class="input-group" style="flex: 1; min-width: 200px;">
                        <label class="input-label">Category:</label>
                        <input type="text" id="flashcard-category" class="input-field" 
                               placeholder="e.g., Math, History">
                    </div>
                    <div class="input-group" style="flex: 1; min-width: 200px;">
                        <label class="input-label">Difficulty:</label>
                        <select id="flashcard-difficulty" class="select-field">
                            <option value="1">Easy</option>
                            <option value="2" selected>Medium</option>
                            <option value="3">Hard</option>
                        </select>
                    </div>
                </div>
                <button class="btn btn-primary mt-20" onclick="Flashcards.createCard()">
                    ➕ Add Flashcard
                </button>
            </div>

            <div class="card">
                <div class="flex-between mb-20">
                    <h2 class="card-title">📚 Review Flashcards</h2>
                    <div>
                        <span id="card-counter" style="color: var(--text-secondary);">0 cards due</span>
                    </div>
                </div>
                <div id="flashcard-viewer" style="display: none;">
                    <div class="flashcard" id="flashcard" onclick="Flashcards.flipCard()">
                        <div class="flashcard-inner">
                            <div class="flashcard-front" id="card-front">
                                Click to reveal
                            </div>
                            <div class="flashcard-back" id="card-back">
                                Answer
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-10 mt-20 flex-center">
                        <button class="btn btn-danger" onclick="Flashcards.rateCard(1)">
                            ❌ Again
                        </button>
                        <button class="btn btn-warning" onclick="Flashcards.rateCard(3)">
                            😐 Hard
                        </button>
                        <button class="btn btn-success" onclick="Flashcards.rateCard(4)">
                            ✓ Good
                        </button>
                        <button class="btn btn-primary" onclick="Flashcards.rateCard(5)">
                            ⭐ Easy
                        </button>
                    </div>
                </div>
                <div id="no-cards" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    No flashcards to review. Create some cards to get started!
                </div>
            </div>

            <div class="card">
                <h2 class="card-title">📊 All Flashcards</h2>
                <div id="all-cards-list"></div>
                <button class="btn btn-outline mt-20" onclick="Flashcards.loadAllCards()">
                    🔄 Refresh List
                </button>
            </div>
        `;
    },

    async init() {
        await this.loadDueCards();
        await this.loadAllCards();
    },

    async loadDueCards() {
        try {
            this.data.cards = await window.ipcRenderer.invoke('db-get-flashcards');
            document.getElementById('card-counter').textContent = `${this.data.cards.length} cards due`;
            
            if (this.data.cards.length > 0) {
                document.getElementById('flashcard-viewer').style.display = 'block';
                document.getElementById('no-cards').style.display = 'none';
                this.showCard(0);
            } else {
                document.getElementById('flashcard-viewer').style.display = 'none';
                document.getElementById('no-cards').style.display = 'block';
            }
        } catch (error) {
            console.error('Error loading flashcards:', error);
        }
    },

    showCard(index) {
        if (index >= this.data.cards.length) {
            document.getElementById('flashcard-viewer').style.display = 'none';
            document.getElementById('no-cards').textContent = 'Great job! All cards reviewed! 🎉';
            document.getElementById('no-cards').style.display = 'block';
            return;
        }

        const card = this.data.cards[index];
        this.data.currentIndex = index;
        this.data.isFlipped = false;
        
        document.getElementById('card-front').textContent = card.question || '';
        document.getElementById('card-back').textContent = card.answer || '';
        document.getElementById('flashcard').classList.remove('flipped');
    },

    flipCard() {
        this.data.isFlipped = !this.data.isFlipped;
        const flashcard = document.getElementById('flashcard');
        if (this.data.isFlipped) {
            flashcard.classList.add('flipped');
        } else {
            flashcard.classList.remove('flipped');
        }
    },

    async rateCard(rating) {
        const card = this.data.cards[this.data.currentIndex];
        
        // SM-2 Algorithm for spaced repetition
        let easeFactor = card.ease_factor || 2.5;
        let interval = card.interval || 1;
        let reviewCount = (card.review_count || 0) + 1;
        let correctCount = card.correct_count || 0;

        if (rating >= 3) {
            correctCount++;
            easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
            
            if (interval === 1) {
                interval = 6;
            } else {
                interval = Math.round(interval * easeFactor);
            }
        } else {
            interval = 1;
        }

        easeFactor = Math.max(1.3, easeFactor);
        
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + interval);

        await window.ipcRenderer.invoke('db-update-flashcard', card.id, {
            reviewCount,
            correctCount,
            easeFactor,
            interval,
            nextReviewDate: nextReviewDate.toISOString()
        });

        showToast('Card reviewed!', 'success');
        this.showCard(this.data.currentIndex + 1);
    },

    async createCard() {
        const question = document.getElementById('flashcard-question')?.value;
        const answer = document.getElementById('flashcard-answer')?.value;
        const category = document.getElementById('flashcard-category')?.value;
        const difficulty = parseInt(document.getElementById('flashcard-difficulty')?.value) || 2;

        if (!question || !answer) {
            showToast('Please fill in both question and answer', 'warning');
            return;
        }

        try {
            await window.ipcRenderer.invoke('db-save-flashcard', {
                question,
                answer,
                category,
                difficultyLevel: difficulty
            });

            showToast('Flashcard created successfully!', 'success');
            
            // Clear inputs
            document.getElementById('flashcard-question').value = '';
            document.getElementById('flashcard-answer').value = '';
            document.getElementById('flashcard-category').value = '';
            
            await this.loadAllCards();
        } catch (error) {
            showToast('Failed to create flashcard: ' + error.message, 'error');
        }
    },

    async loadAllCards() {
        try {
            const allCards = await window.ipcRenderer.invoke('db-query', 
                'SELECT * FROM flashcards ORDER BY created_at DESC', []);
            
            const container = document.getElementById('all-cards-list');
            
            if (allCards.length === 0) {
                container.innerHTML = '<p style="color: var(--text-secondary);">No flashcards yet.</p>';
                return;
            }

            const html = allCards.map(card => `
                <div class="schedule-item">
                    <div style="flex: 1;">
                        <strong>${card.question}</strong>
                        <p style="color: var(--text-secondary); font-size: 12px; margin-top: 5px;">
                            ${card.category || 'Uncategorized'} | Reviews: ${card.review_count || 0}
                        </p>
                    </div>
                    <button class="btn btn-outline" onclick="Flashcards.deleteCard(${card.id})" style="padding: 5px 10px; font-size: 12px;">
                        🗑️ Delete
                    </button>
                </div>
            `).join('');
            
            container.innerHTML = html;
        } catch (error) {
            console.error('Error loading all cards:', error);
        }
    },

    async deleteCard(id) {
        if (confirm('Are you sure you want to delete this flashcard?')) {
            try {
                await window.ipcRenderer.invoke('db-query', 'DELETE FROM flashcards WHERE id = ?', [id]);
                showToast('Flashcard deleted', 'success');
                await this.loadAllCards();
                await this.loadDueCards();
            } catch (error) {
                showToast('Failed to delete flashcard', 'error');
            }
        }
    }
};

window.Flashcards = Flashcards;
