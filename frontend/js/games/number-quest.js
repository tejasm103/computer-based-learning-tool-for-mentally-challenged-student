/**
 * AccessibleVerse — Number Quest
 * Fast-paced, Accessible Mathematics Arcade featuring Counting, Operations,
 * and Multiplication Tables 1 to 20 Mastery.
 */

class NumberQuestGame {
  constructor(containerId = 'math-quest-container') {
    this.container = document.getElementById(containerId);
    this.score = 0;
    this.streak = 0;
    this.currentMode = 'tables'; // 'counting' | 'addsub' | 'tables' | 'division'
    this.currentProblem = null;
    this.isUntimed = false;
  }

  init() {
    if (!this.container) return;
    this.setupUI();
    this.generateProblem();
  }

  setupUI() {
    this.container.innerHTML = `
      <div class="math-arcade-panel" style="margin: 0 auto;">
        <!-- Mode Tabs -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; margin-bottom: 1.5rem;">
          <button class="btn btn-sm btn-secondary math-mode-btn" data-mode="counting">🍎 Counting</button>
          <button class="btn btn-sm btn-secondary math-mode-btn" data-mode="addsub">➕ Addition / Sub</button>
          <button class="btn btn-sm btn-secondary math-mode-btn active" data-mode="tables">✖️ Tables 1–20</button>
          <button class="btn btn-sm btn-secondary math-mode-btn" data-mode="division">➗ Division</button>
        </div>

        <!-- HUD -->
        <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 1rem;">
          <span class="stat-pill"><i data-lucide="zap"></i> Score: <strong id="math-score">0</strong></span>
          <span class="stat-pill" style="color: var(--accent);"><i data-lucide="flame"></i> Streak: <strong id="math-streak">0</strong> 🔥</span>
        </div>

        <!-- Problem Display -->
        <div id="math-problem-box" class="math-problem-display">6 × 7 = ?</div>
        <div id="math-hint-box" style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.5rem; min-height: 24px;"></div>

        <!-- Multiple Choice Options -->
        <div class="math-options-grid" id="math-options-container"></div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Mode Selector
    this.container.querySelectorAll('.math-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('.math-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentMode = btn.getAttribute('data-mode');
        this.generateProblem();
      });
    });
  }

  generateProblem() {
    let question = "";
    let answer = 0;
    let hint = "";
    let options = [];

    if (this.currentMode === 'tables') {
      const a = Math.floor(Math.random() * 20) + 1; // 1 to 20
      const b = Math.floor(Math.random() * 10) + 1; // 1 to 10
      question = `${a} × ${b} = ?`;
      answer = a * b;
      hint = `Table of ${a}: ${a} added ${b} times`;
    } else if (this.currentMode === 'counting') {
      const count = Math.floor(Math.random() * 15) + 3;
      const emojis = ['🌟', '🍎', '🎈', '🚗', '🐱', '💎'];
      const icon = emojis[Math.floor(Math.random() * emojis.length)];
      question = icon.repeat(count);
      answer = count;
      hint = "Count each item carefully!";
    } else if (this.currentMode === 'addsub') {
      const isAdd = Math.random() > 0.4;
      if (isAdd) {
        const a = Math.floor(Math.random() * 50) + 5;
        const b = Math.floor(Math.random() * 50) + 5;
        question = `${a} + ${b} = ?`;
        answer = a + b;
        hint = "Sum up the two numbers";
      } else {
        const a = Math.floor(Math.random() * 60) + 20;
        const b = Math.floor(Math.random() * a);
        question = `${a} − ${b} = ?`;
        answer = a - b;
        hint = `Subtract ${b} from ${a}`;
      }
    } else {
      // Division
      const b = Math.floor(Math.random() * 10) + 2;
      const quotient = Math.floor(Math.random() * 12) + 1;
      const a = b * quotient;
      question = `${a} ÷ ${b} = ?`;
      answer = quotient;
      hint = `How many ${b}s fit into ${a}?`;
    }

    // Generate 3 plausible distractors
    options = [answer];
    while (options.length < 4) {
      const offset = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const fake = Math.max(0, answer + offset);
      if (!options.includes(fake)) {
        options.push(fake);
      }
    }
    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    this.currentProblem = { question, answer, hint, options };
    this.renderProblem();
  }

  renderProblem() {
    const box = this.container.querySelector('#math-problem-box');
    const hintBox = this.container.querySelector('#math-hint-box');
    const optContainer = this.container.querySelector('#math-options-container');

    if (box) box.textContent = this.currentProblem.question;
    if (hintBox) hintBox.textContent = this.currentProblem.hint;
    if (optContainer) {
      optContainer.innerHTML = '';
      this.currentProblem.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'math-opt-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => this.handleAnswer(opt, btn));
        optContainer.appendChild(btn);
      });
    }

    if (window.lang && this.currentMode !== 'counting') {
      window.lang.speakText(this.currentProblem.question.replace('?', ''));
    }
  }

  handleAnswer(selected, buttonEl) {
    if (selected === this.currentProblem.answer) {
      this.streak += 1;
      const gained = 20 + this.streak * 5;
      this.score += gained;
      buttonEl.style.background = '#d1fae5';
      buttonEl.style.borderColor = '#10b981';
      window.showToast(`Correct! +${gained} Points!`, 'success');

      // Sync with backend every 100 points
      if (this.score % 100 === 0 && window.api) {
        window.api.games.submitScore({
          game_id: 'number-quest',
          score: this.score,
          level: Math.floor(this.score / 150) + 1
        });
      }

      setTimeout(() => {
        this.generateProblem();
        this.updateHUD();
      }, 350);
    } else {
      this.streak = 0;
      buttonEl.style.background = '#ffe4e6';
      buttonEl.style.borderColor = '#ef4444';
      window.showToast(`Not quite! The correct answer was ${this.currentProblem.answer}.`, 'warning');
      setTimeout(() => {
        this.generateProblem();
        this.updateHUD();
      }, 1000);
    }
  }

  updateHUD() {
    const s = this.container.querySelector('#math-score');
    const st = this.container.querySelector('#math-streak');
    if (s) s.textContent = this.score;
    if (st) st.textContent = this.streak;
  }
}

// Global Export
window.NumberQuestGame = NumberQuestGame;
