/**
 * AccessibleVerse — Puzzle World
 * Spatial Shapes, Sequential Logic, and Educational Pattern Matching Puzzles.
 */

class PuzzleWorldGame {
  constructor(containerId = 'puzzle-world-container') {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.currentLevel = 0;
    this.score = 0;

    this.puzzles = [
      {
        title: "Geometric Shape Pattern",
        description: "What shape comes next in this sequence?",
        sequence: ["🔴 Circle", "🔷 Diamond", "🔺 Triangle", "🔴 Circle", "🔷 Diamond", "❓"],
        options: ["🔺 Triangle", "⭐ Star", "🟪 Square", "🔴 Circle"],
        correct: 0,
        explanation: "The pattern repeats: Circle, Diamond, Triangle. So after Diamond comes Triangle!"
      },
      {
        title: "Traffic Light Flow",
        description: "What signal follows Red & Yellow caution before vehicles go?",
        sequence: ["🔴 Red (Stop)", "🟡 Yellow (Wait)", "❓"],
        options: ["🟢 Green (Go)", "🔵 Blue", "🟣 Violet", "⚫ Off"],
        correct: 0,
        explanation: "Green light signals vehicles to safely proceed after stopping."
      },
      {
        title: "Mathematical Powers of Two",
        description: "Find the missing number in the doubling sequence:",
        sequence: ["2", "4", "8", "16", "32", "❓"],
        options: ["48", "64", "50", "36"],
        correct: 1,
        explanation: "Each number doubles: 32 × 2 = 64!"
      },
      {
        title: "Kannada Swaragalu Order",
        description: "Complete the Kannada vowel series:",
        sequence: ["ಅ", "ಆ", "ಇ", "ಈ", "ಉ", "❓"],
        options: ["ಊ", "ಋ", "ಎ", "ಐ"],
        correct: 0,
        explanation: "In Kannada Varnamale, 'ಉ' (short u) is followed by 'ಊ' (long oo as in Oota)."
      },
      {
        title: "Hindi Swar Order (हिंदी स्वर)",
        description: "Complete the Hindi vowel sequence:",
        sequence: ["अ", "आ", "इ", "ई", "उ", "❓"],
        options: ["ऊ", "ए", "ओ", "ऋ"],
        correct: 0,
        explanation: "In Hindi Varnamala, 'उ' (short u) is followed by 'ऊ' (long oo as in Oon)!"
      },
      {
        title: "English Alphabet Sequence",
        description: "Which letter comes next in the alphabet?",
        sequence: ["A", "B", "C", "D", "E", "❓"],
        options: ["F", "G", "H", "K"],
        correct: 0,
        explanation: "Letter E is followed by letter F (F for Fish) in the English alphabet!"
      },
      {
        title: "Daily Hygiene Routine",
        description: "What is the crucial morning routine after waking up?",
        sequence: ["🌅 Wake Up", "🪥 Brush Teeth", "🚿 Bath", "❓"],
        options: ["👕 Wear Clean Clothes", "💤 Go back to sleep", "🎮 Play video games for 5 hours", "📺 Watch TV in dark"],
        correct: 0,
        explanation: "After bathing, dressing in neat, clean clothes sets you up for a productive day!"
      },
      {
        title: "Road Safety Sequence",
        description: "What should you do before crossing the street?",
        sequence: ["🚶 Approach Curb", "👀 Look Left", "👀 Look Right", "❓"],
        options: ["🚶 Walk across Zebra Crossing safely", "🏃 Run blindly", "📱 Stare at phone", "🛑 Close eyes"],
        correct: 0,
        explanation: "Always check left, check right, and cross calmly on the zebra crossing!"
      }
    ];
  }

  init() {
    if (!this.container) {
      this.container = document.getElementById(this.containerId || 'puzzle-world-container');
    }
    if (!this.container) return;
    this.score = 0;
    this.currentLevel = 0;
    this.setupUI();
    this.loadPuzzle(0);
  }

  setupUI() {
    this.container.innerHTML = `
      <div class="card" style="max-width: 680px; margin: 0 auto; padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
          <div>
            <h3 id="puzzle-title">Pattern Puzzle</h3>
            <p id="puzzle-desc" style="font-size: 0.9rem;">Analyze the sequence and choose the missing piece.</p>
          </div>
          <span class="stat-pill"><i data-lucide="award"></i> Level: <strong id="puzzle-lvl">1/8</strong></span>
        </div>

        <!-- Sequence Row -->
        <div id="puzzle-seq-row" style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; margin: 2rem 0;"></div>

        <!-- Feedback Box -->
        <div id="puzzle-feedback" style="min-height: 28px; text-align: center; font-weight: 600; margin-bottom: 1.5rem;"></div>

        <!-- Options Grid -->
        <div id="puzzle-options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;"></div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  loadPuzzle(idx) {
    if (idx >= this.puzzles.length) {
      this.completedAll();
      return;
    }

    this.currentLevel = idx;
    const p = this.puzzles[idx];

    this.container.querySelector('#puzzle-title').textContent = p.title;
    this.container.querySelector('#puzzle-desc').textContent = p.description;
    this.container.querySelector('#puzzle-lvl').textContent = `${idx + 1}/${this.puzzles.length}`;
    this.container.querySelector('#puzzle-feedback').textContent = '';

    // Render Sequence Chips
    const seqRow = this.container.querySelector('#puzzle-seq-row');
    seqRow.innerHTML = '';
    p.sequence.forEach(item => {
      const chip = document.createElement('div');
      chip.className = 'card card-glass';
      chip.style.padding = '0.75rem 1.25rem';
      chip.style.fontSize = '1.2rem';
      chip.style.fontWeight = '700';
      chip.style.textAlign = 'center';
      chip.textContent = item;
      if (item === '❓') {
        chip.style.border = '2px dashed var(--primary)';
        chip.style.color = 'var(--primary)';
      }
      seqRow.appendChild(chip);
    });

    // Render Options
    const optGrid = this.container.querySelector('#puzzle-options-grid');
    optGrid.innerHTML = '';
    p.options.forEach((opt, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-secondary';
      btn.style.padding = '1.1rem';
      btn.style.fontSize = '1.1rem';
      btn.textContent = opt;
      btn.addEventListener('click', () => this.handleAnswer(optIdx, btn));
      optGrid.appendChild(btn);
    });

    if (window.lang) {
      window.lang.speakText(p.title + ". " + p.description);
    }
  }

  handleAnswer(selectedIdx, btnEl) {
    const p = this.puzzles[this.currentLevel];
    const fb = this.container.querySelector('#puzzle-feedback');

    if (selectedIdx === p.correct) {
      this.score += 100;
      btnEl.style.background = '#d1fae5';
      btnEl.style.borderColor = '#10b981';
      fb.style.color = '#059669';
      fb.textContent = `🎉 Correct! ${p.explanation}`;
      window.showToast("Puzzle Solved! +100 XP", "success");

      setTimeout(() => {
        this.loadPuzzle(this.currentLevel + 1);
      }, 1800);
    } else {
      btnEl.style.background = '#ffe4e6';
      btnEl.style.borderColor = '#ef4444';
      fb.style.color = '#dc2626';
      fb.textContent = `Not quite right. Re-check the pattern order!`;
    }
  }

  completedAll() {
    this.container.innerHTML = `
      <div class="card" style="max-width: 580px; margin: 0 auto; text-align: center; padding: 3rem;">
        <i data-lucide="check-circle" style="width: 64px; height: 64px; color: var(--accent-emerald); margin-bottom: 1rem;"></i>
        <h2>Congratulations! Puzzle Master!</h2>
        <p style="margin: 1rem 0 2rem;">You successfully solved all sequential logic and pattern challenges.</p>
        <button class="btn btn-primary" onclick="window.puzzleGame.init()">Play Again</button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();

    if (window.api) {
      window.api.games.submitScore({
        game_id: 'puzzle-world',
        score: this.score,
        level: 8
      });
    }
  }
}

// Global Export
window.PuzzleWorldGame = PuzzleWorldGame;
