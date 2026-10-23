/**
 * AccessibleVerse — Memory Match 3D
 * 3D Card-Flip Memory Matching Game for Multilingual Letters, Numbers & Safety Signs.
 */

class MemoryMatchGame {
  constructor(containerId = 'memory-match-container') {
    this.container = document.getElementById(containerId);
    this.cards = [];
    this.flippedCards = [];
    this.matchedCount = 0;
    this.moves = 0;
    this.isLocked = false;
    this.currentTheme = 'kannada';

    this.themes = {
      kannada: [
        { id: 1, val: "ಅ", pair: "ಅಮ್ಮ" },
        { id: 2, val: "ಆ", pair: "ಆನೆ" },
        { id: 3, val: "ಇ", pair: "ಇಲಿ" },
        { id: 4, val: "ಕ", pair: "ಕಮಲ" },
        { id: 5, val: "ಗ", pair: "ಗಣೇಶ" },
        { id: 6, val: "ರ", pair: "ರೈಲು" }
      ],
      safety: [
        { id: 1, val: "🔴 Red", pair: "Stop" },
        { id: 2, val: "🟡 Yellow", pair: "Wait" },
        { id: 3, val: "🟢 Green", pair: "Go" },
        { id: 4, val: "🦓 Zebra", pair: "Crossing" },
        { id: 5, val: "🚸 Sign", pair: "School" },
        { id: 6, val: "🛑 Sign", pair: "Halt" }
      ],
      math: [
        { id: 1, val: "6 × 7", pair: "42" },
        { id: 2, val: "8 × 9", pair: "72" },
        { id: 3, val: "25 × 4", pair: "100" },
        { id: 4, val: "12 × 12", pair: "144" },
        { id: 5, val: "45 ÷ 5", pair: "9" },
        { id: 6, val: "80 ÷ 4", pair: "20" }
      ]
    };
  }

  init() {
    if (!this.container) return;
    this.setupUI();
    this.start();
  }

  setupUI() {
    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
        <!-- Theme Controls -->
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 640px; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-sm btn-secondary mem-theme-btn active" data-theme="kannada">ಕನ್ನಡ Varnamale</button>
            <button class="btn btn-sm btn-secondary mem-theme-btn" data-theme="safety">Road Safety</button>
            <button class="btn btn-sm btn-secondary mem-theme-btn" data-theme="math">Math Tables</button>
          </div>
          <div style="display: flex; gap: 1rem; align-items: center;">
            <span class="stat-pill"><i data-lucide="footprints"></i> Moves: <strong id="mem-moves">0</strong></span>
            <button class="btn btn-primary btn-sm" id="mem-restart-btn">Restart</button>
          </div>
        </div>

        <!-- 3D Card Grid -->
        <div class="memory-grid" id="memory-cards-grid"></div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Theme selector
    this.container.querySelectorAll('.mem-theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('.mem-theme-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTheme = btn.getAttribute('data-theme');
        this.start();
      });
    });

    this.container.querySelector('#mem-restart-btn').addEventListener('click', () => this.start());
  }

  start() {
    this.moves = 0;
    this.matchedCount = 0;
    this.flippedCards = [];
    this.isLocked = false;
    this.updateHUD();

    const items = this.themes[this.currentTheme];
    // Build 12 card deck (6 pairs)
    const deck = [];
    items.forEach(item => {
      deck.push({ matchId: item.id, text: item.val });
      deck.push({ matchId: item.id, text: item.pair });
    });

    // Shuffle deck
    deck.sort(() => Math.random() - 0.5);

    const grid = this.container.querySelector('#memory-cards-grid');
    grid.innerHTML = '';

    deck.forEach((cardData, idx) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'memory-card';
      cardEl.setAttribute('data-index', idx);
      cardEl.setAttribute('role', 'button');
      cardEl.setAttribute('tabindex', '0');
      cardEl.setAttribute('aria-label', `Card ${idx + 1}`);

      cardEl.innerHTML = `
        <div class="memory-card-front">?</div>
        <div class="memory-card-back">${cardData.text}</div>
      `;

      cardEl.addEventListener('click', () => this.flipCard(cardEl, cardData));
      cardEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.flipCard(cardEl, cardData);
        }
      });

      grid.appendChild(cardEl);
    });
  }

  flipCard(cardEl, cardData) {
    if (this.isLocked) return;
    if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

    cardEl.classList.add('flipped');
    this.flippedCards.push({ el: cardEl, data: cardData });

    if (window.lang) {
      window.lang.speakText(cardData.text);
    }

    if (this.flippedCards.length === 2) {
      this.moves += 1;
      this.updateHUD();
      this.checkMatch();
    }
  }

  checkMatch() {
    this.isLocked = true;
    const [c1, c2] = this.flippedCards;

    if (c1.data.matchId === c2.data.matchId) {
      // Match found!
      setTimeout(() => {
        c1.el.classList.add('matched');
        c2.el.classList.add('matched');
        this.matchedCount += 1;
        this.flippedCards = [];
        this.isLocked = false;
        window.showToast("Matched Pair! Excellent memory!", "success");

        if (this.matchedCount === 6) {
          this.victory();
        }
      }, 500);
    } else {
      // No match, flip back
      setTimeout(() => {
        c1.el.classList.remove('flipped');
        c2.el.classList.remove('flipped');
        this.flippedCards = [];
        this.isLocked = false;
      }, 950);
    }
  }

  victory() {
    const finalScore = Math.max(100, 1000 - this.moves * 30);
    window.showToast(`🎉 Puzzle Completed in ${this.moves} moves! Score: ${finalScore}`, 'success');

    if (window.api) {
      window.api.games.submitScore({
        game_id: 'memory-match',
        score: finalScore,
        level: 1
      });
    }
  }

  updateHUD() {
    const m = this.container.querySelector('#mem-moves');
    if (m) m.textContent = this.moves;
  }
}

// Global Export
window.MemoryMatchGame = MemoryMatchGame;
