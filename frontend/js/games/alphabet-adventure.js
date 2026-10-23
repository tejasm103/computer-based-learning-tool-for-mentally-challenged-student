/**
 * AccessibleVerse — Alphabet Adventure
 * Interactive Letter & Phonics Matching in Kannada, Hindi, and English.
 */

class AlphabetAdventureGame {
  constructor(containerId = 'alphabet-stage-container') {
    this.container = document.getElementById(containerId);
    this.isRunning = false;
    this.score = 0;
    this.currentLanguage = 'kn'; // 'kn' | 'hi' | 'en'
    this.currentTarget = null;
    this.bubbles = [];
    this.spawnTimer = null;
    this.animFrameId = null;

    this.vocabSets = {
      kn: [
        { letter: 'ಅ', word: 'ಅಮ್ಮ (Amma - Mother)' },
        { letter: 'ಆ', word: 'ಆನೆ (Aane - Elephant)' },
        { letter: 'ಇ', word: 'ಇಲಿ (Ili - Rat)' },
        { letter: 'ಈ', word: 'ಈಜು (Eeju - Swim)' },
        { letter: 'ಉ', word: 'ಉಡುಗೊರೆ (Udugore - Gift)' },
        { letter: 'ಕ', word: 'ಕಮಲ (Kamala - Lotus)' },
        { letter: 'ಗ', word: 'ಗಣೇಶ (Ganesha)' },
        { letter: 'ರ', word: 'ರೈಲು (Railu - Train)' }
      ],
      hi: [
        { letter: 'अ', word: 'अनार (Pomegranate)' },
        { letter: 'आ', word: 'आम (Mango)' },
        { letter: 'इ', word: 'इमली (Tamarind)' },
        { letter: 'ई', word: 'ईख (Sugarcane)' },
        { letter: 'क', word: 'कमल (Lotus)' },
        { letter: 'ख', word: 'खरगोश (Rabbit)' },
        { letter: 'म', word: 'मछली (Fish)' }
      ],
      en: [
        { letter: 'A', word: 'Apple (/æ/ sound)' },
        { letter: 'B', word: 'Ball (/b/ sound)' },
        { letter: 'C', word: 'Cat (/k/ sound)' },
        { letter: 'D', word: 'Dog (/d/ sound)' },
        { letter: 'E', word: 'Elephant (/e/ sound)' },
        { letter: 'F', word: 'Fish (/f/ sound)' }
      ]
    };
  }

  init() {
    if (!this.container) return;
    this.setupUI();
  }

  setupUI() {
    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; height: 100%; width: 100%; position: relative;">
        <!-- Top Toolbar -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-surface); border-bottom: 1px solid var(--border-color); z-index: 10;">
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-sm btn-secondary alpha-lang-btn active" data-lang="kn">ಕನ್ನಡ</button>
            <button class="btn btn-sm btn-secondary alpha-lang-btn" data-lang="hi">हिंदी</button>
            <button class="btn btn-sm btn-secondary alpha-lang-btn" data-lang="en">English</button>
          </div>
          <div style="display: flex; gap: 1rem; align-items: center;">
            <span class="stat-pill"><i data-lucide="zap"></i> Score: <strong id="alpha-score">0</strong></span>
            <button class="btn btn-primary btn-sm" id="alpha-start-btn">Start Game</button>
          </div>
        </div>

        <!-- Target Prompt Bar -->
        <div id="alpha-prompt-bar" style="background: var(--primary-light); padding: 0.75rem 1.5rem; text-align: center; font-weight: 700; color: var(--primary); display: flex; align-items: center; justify-content: center; gap: 0.75rem;">
          <span>Press "Start Game" to begin Alphabet Adventure!</span>
        </div>

        <!-- Flying Bubbles Stage -->
        <div id="alpha-play-area" style="flex: 1; position: relative; overflow: hidden; background: radial-gradient(circle at center, #1e1b4b, #090d16);"></div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Language buttons
    this.container.querySelectorAll('.alpha-lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.alpha-lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentLanguage = btn.getAttribute('data-lang');
        if (this.isRunning) this.pickNextTarget();
      });
    });

    // Start Button
    const startBtn = this.container.querySelector('#alpha-start-btn');
    startBtn.addEventListener('click', () => {
      if (!this.isRunning) {
        this.start();
        startBtn.textContent = 'Restart';
      } else {
        this.start();
      }
    });
  }

  start() {
    this.isRunning = true;
    this.score = 0;
    this.clearBubbles();
    this.updateScore();
    this.pickNextTarget();

    if (this.spawnTimer) clearInterval(this.spawnTimer);
    this.spawnTimer = setInterval(() => {
      if (this.isRunning) this.spawnBubble();
    }, 1200);

    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.animateBubbles();
  }

  pickNextTarget() {
    const list = this.vocabSets[this.currentLanguage];
    this.currentTarget = list[Math.floor(Math.random() * list.length)];

    const promptBar = this.container.querySelector('#alpha-prompt-bar');
    if (promptBar) {
      promptBar.innerHTML = `
        <i data-lucide="volume-2" style="cursor: pointer;" id="alpha-replay-sound" title="Hear Prompt"></i>
        <span>Find & Click: <strong>${this.currentTarget.letter}</strong> for <em>${this.currentTarget.word}</em></span>
      `;
      if (window.lucide) window.lucide.createIcons();

      const replayBtn = promptBar.querySelector('#alpha-replay-sound');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          this.speakPrompt();
        });
      }
    }

    this.speakPrompt();
  }

  speakPrompt() {
    if (window.lang && this.currentTarget) {
      const speechText = `${this.currentTarget.letter}, ${this.currentTarget.word}`;
      window.lang.speakText(speechText, this.currentLanguage);
    }
  }

  spawnBubble() {
    const playArea = this.container.querySelector('#alpha-play-area');
    if (!playArea) return;

    const list = this.vocabSets[this.currentLanguage];
    // 40% chance of spawning current target letter, otherwise random distractor
    const item = (Math.random() < 0.4) ? this.currentTarget : list[Math.floor(Math.random() * list.length)];

    const bubble = document.createElement('div');
    bubble.className = 'falling-letter-bubble';
    bubble.textContent = item.letter;
    bubble.setAttribute('data-letter', item.letter);

    const areaWidth = playArea.clientWidth - 80;
    const posX = Math.max(20, Math.floor(Math.random() * areaWidth));
    bubble.style.left = `${posX}px`;
    bubble.style.top = `-70px`;

    playArea.appendChild(bubble);

    const speed = 1.2 + Math.random() * 1.5;
    this.bubbles.push({ el: bubble, y: -70, speed, letter: item.letter });

    // Click handler
    bubble.addEventListener('click', () => {
      if (!this.isRunning) return;

      if (item.letter === this.currentTarget.letter) {
        this.score += 50;
        this.updateScore();
        window.showToast(`Correct! Found ${item.letter}`, 'success');

        // Balloon pop effect
        bubble.style.transform = 'scale(1.5)';
        bubble.style.opacity = '0';
        bubble.style.transition = 'all 0.2s ease';

        setTimeout(() => {
          this.removeBubble(bubble);
        }, 200);

        this.pickNextTarget();
      } else {
        window.showToast(`That was ${item.letter}. Try looking for ${this.currentTarget.letter}!`, 'warning');
      }
    });
  }

  animateBubbles() {
    if (!this.isRunning) return;
    this.animFrameId = requestAnimationFrame(() => this.animateBubbles());

    const playArea = this.container.querySelector('#alpha-play-area');
    if (!playArea) return;
    const maxY = playArea.clientHeight;

    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.y += b.speed;
      b.el.style.top = `${b.y}px`;

      if (b.y > maxY) {
        this.removeBubble(b.el);
        this.bubbles.splice(i, 1);
      }
    }
  }

  removeBubble(el) {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  clearBubbles() {
    this.bubbles.forEach(b => this.removeBubble(b.el));
    this.bubbles = [];
  }

  updateScore() {
    const el = this.container.querySelector('#alpha-score');
    if (el) el.textContent = this.score;

    if (this.score > 0 && this.score % 250 === 0 && window.api) {
      window.api.games.submitScore({
        game_id: 'alphabet-adventure',
        score: this.score,
        level: Math.floor(this.score / 200) + 1
      });
    }
  }
}

// Global Export
window.AlphabetAdventureGame = AlphabetAdventureGame;
