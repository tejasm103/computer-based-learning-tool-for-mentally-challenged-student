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
        // Swaragalu (ಸ್ವರಗಳು - Vowels)
        { letter: 'ಅ', word: 'ಅಮ್ಮ (Amma - Mother)' },
        { letter: 'ಆ', word: 'ಆನೆ (Aane - Elephant)' },
        { letter: 'ಇ', word: 'ಇಲಿ (Ili - Rat)' },
        { letter: 'ಈ', word: 'ಈಜು (Eeju - Swim)' },
        { letter: 'ಉ', word: 'ಉಡುಗೊರೆ (Udugore - Gift)' },
        { letter: 'ಊ', word: 'ಊಟ (Oota - Meal)' },
        { letter: 'ಋ', word: 'ಋಷಿ (Rushi - Sage)' },
        { letter: 'ಎ', word: 'ಎಲೆ (Ele - Leaf)' },
        { letter: 'ಏ', word: 'ಏಣಿ (Eeni - Ladder)' },
        { letter: 'ಐ', word: 'ಐದು (Aidu - Five)' },
        { letter: 'ಒ', word: 'ಒಂಟೆ (Onte - Camel)' },
        { letter: 'ಓ', word: 'ಓಲೆ (Oole - Earring)' },
        { letter: 'ಔ', word: 'ಔಷಧ (Aushadha - Medicine)' },
        { letter: 'ಅಂ', word: 'ಅಂಗಡಿ (Angadi - Shop)' },
        { letter: 'ಅಃ', word: 'ವಿಸರ್ಗ (Visarga)' },
        // Vyanjanagalu (ವ್ಯಂಜನಗಳು - Consonants)
        { letter: 'ಕ', word: 'ಕಮಲ (Kamala - Lotus)' },
        { letter: 'ಖ', word: 'ಖಡ್ಗ (Khadga - Sword)' },
        { letter: 'ಗ', word: 'ಗಣೇಶ (Ganesha)' },
        { letter: 'ಘ', word: 'ಘಂಟೆ (Ghante - Bell)' },
        { letter: 'ಙ', word: 'ಙ (Nga)' },
        { letter: 'ಚ', word: 'ಚಮಚ (Chamacha - Spoon)' },
        { letter: 'ಛ', word: 'ಛತ್ರಿ (Chhatri - Umbrella)' },
        { letter: 'ಜ', word: 'ಜಲ (Jala - Water)' },
        { letter: 'ಝ', word: 'ಝರಿ (Jhari - Stream)' },
        { letter: 'ಞ', word: 'ಞ (Nya)' },
        { letter: 'ಟ', word: 'ಟೊಮೆಟೊ (Tomato)' },
        { letter: 'ಠ', word: 'ಠಸ್ಸೆ (Thasse - Stamp)' },
        { letter: 'ಡ', word: 'ಡಮರು (Damaru - Drum)' },
        { letter: 'ಢ', word: 'ಢಕ್ಕೆ (Dhakke - Big Drum)' },
        { letter: 'ಣ', word: 'ವೀಣೆ (Veene - Lute)' },
        { letter: 'ತ', word: 'ತರಕಾರಿ (Tarakari - Vegetables)' },
        { letter: 'ಥ', word: 'ಥಳಥಳ (Thalathala - Sparkle)' },
        { letter: 'ದ', word: 'ದೀಪ (Deepa - Lamp)' },
        { letter: 'ಧ', word: 'ಧನುಸ್ಸು (Dhanussu - Bow)' },
        { letter: 'ನ', word: 'ನವಿಲು (Navilu - Peacock)' },
        { letter: 'ಪ', word: 'ಪಾರಿವಾಳ (Parivala - Pigeon)' },
        { letter: 'ಫ', word: 'ಫಲ (Phala - Fruit)' },
        { letter: 'ಬ', word: 'ಬಾಳೆಹಣ್ಣು (Balehannu - Banana)' },
        { letter: 'ಭ', word: 'ಭಾರತ (Bharatha - India)' },
        { letter: 'ಮ', word: 'ಮರ (Mara - Tree)' },
        { letter: 'ಯ', word: 'ಯಜ್ಞ (Yajna - Fire ritual)' },
        { letter: 'ರ', word: 'ರೈಲು (Railu - Train)' },
        { letter: 'ಲ', word: 'ಲಡ್ಡು (Laddu - Sweet)' },
        { letter: 'ವ', word: 'ವನ (Vana - Forest)' },
        { letter: 'ಶ', word: 'ಶಂಖ (Shankha - Conch)' },
        { letter: 'ಷ', word: 'ಷಟ್ಕೋನ (Shatkona - Hexagon)' },
        { letter: 'ಸ', word: 'ಸೂರ್ಯ (Surya - Sun)' },
        { letter: 'ಹ', word: 'ಹೂವು (Hoovu - Flower)' },
        { letter: 'ಳ', word: 'ಕಿಳಿ (Kili - Parrot)' }
      ],
      hi: [
        // Swar (स्वर - Vowels)
        { letter: 'अ', word: 'अनार (Pomegranate)' },
        { letter: 'आ', word: 'आम (Mango)' },
        { letter: 'इ', word: 'इमली (Tamarind)' },
        { letter: 'ई', word: 'ईख (Sugarcane)' },
        { letter: 'उ', word: 'उल्लू (Owl)' },
        { letter: 'ऊ', word: 'ऊन (Wool)' },
        { letter: 'ऋ', word: 'ऋषि (Sage)' },
        { letter: 'ए', word: 'एक (One)' },
        { letter: 'ऐ', word: 'ऐनक (Glasses)' },
        { letter: 'ओ', word: 'ओखली (Mortar)' },
        { letter: 'औ', word: 'औरत (Woman)' },
        { letter: 'अं', word: 'अंगूर (Grapes)' },
        { letter: 'अः', word: 'प्रातः (Morning)' },
        // Vyanjan (व्यंजन - Consonants)
        { letter: 'क', word: 'कमल (Lotus)' },
        { letter: 'ख', word: 'खरगोश (Rabbit)' },
        { letter: 'ग', word: 'गमला (Pot)' },
        { letter: 'घ', word: 'घर (House)' },
        { letter: 'ङ', word: 'अंग (Limb)' },
        { letter: 'च', word: 'चम्मच (Spoon)' },
        { letter: 'छ', word: 'छतरी (Umbrella)' },
        { letter: 'ज', word: 'जहाज (Ship)' },
        { letter: 'झ', word: 'झंडा (Flag)' },
        { letter: 'ञ', word: 'चंचल (Playful)' },
        { letter: 'ट', word: 'टमाटर (Tomato)' },
        { letter: 'ठ', word: 'ठठेरा (Tinsmith)' },
        { letter: 'ड', word: 'डमरू (Drum)' },
        { letter: 'ढ', word: 'ढक्कन (Lid)' },
        { letter: 'ण', word: 'बाण (Arrow)' },
        { letter: 'त', word: 'तरबूज (Watermelon)' },
        { letter: 'थ', word: 'थर्मस (Flask)' },
        { letter: 'द', word: 'दवात (Inkpot)' },
        { letter: 'ध', word: 'धनुष (Bow)' },
        { letter: 'न', word: 'नल (Tap)' },
        { letter: 'प', word: 'पतंग (Kite)' },
        { letter: 'फ', word: 'फल (Fruit)' },
        { letter: 'ब', word: 'बत्तख (Duck)' },
        { letter: 'भ', word: 'भालू (Bear)' },
        { letter: 'म', word: 'मछली (Fish)' },
        { letter: 'य', word: 'यज्ञ (Sacrifice)' },
        { letter: 'र', word: 'रथ (Chariot)' },
        { letter: 'ल', word: 'लट्टू (Top)' },
        { letter: 'व', word: 'वक (Heron)' },
        { letter: 'श', word: 'शलजम (Turnip)' },
        { letter: 'ष', word: 'षटकोण (Hexagon)' },
        { letter: 'स', word: 'सपेरा (Snake Charmer)' },
        { letter: 'ह', word: 'हाथी (Elephant)' },
        { letter: 'क्ष', word: 'क्षत्रिय (Warrior)' },
        { letter: 'त्र', word: 'त्रिशूल (Trident)' },
        { letter: 'ज्ञ', word: 'ज्ञानी (Wise person)' }
      ],
      en: [
        // English Alphabet A to Z
        { letter: 'A', word: 'Apple (/æ/ sound)' },
        { letter: 'B', word: 'Ball (/b/ sound)' },
        { letter: 'C', word: 'Cat (/k/ sound)' },
        { letter: 'D', word: 'Dog (/d/ sound)' },
        { letter: 'E', word: 'Elephant (/e/ sound)' },
        { letter: 'F', word: 'Fish (/f/ sound)' },
        { letter: 'G', word: 'Giraffe (/ɡ/ sound)' },
        { letter: 'H', word: 'House (/h/ sound)' },
        { letter: 'I', word: 'Ice cream (/aɪ/ sound)' },
        { letter: 'J', word: 'Jug (/dʒ/ sound)' },
        { letter: 'K', word: 'Kite (/k/ sound)' },
        { letter: 'L', word: 'Lion (/l/ sound)' },
        { letter: 'M', word: 'Monkey (/m/ sound)' },
        { letter: 'N', word: 'Nest (/n/ sound)' },
        { letter: 'O', word: 'Orange (/ɒ/ sound)' },
        { letter: 'P', word: 'Parrot (/p/ sound)' },
        { letter: 'Q', word: 'Queen (/kw/ sound)' },
        { letter: 'R', word: 'Rabbit (/r/ sound)' },
        { letter: 'S', word: 'Sun (/s/ sound)' },
        { letter: 'T', word: 'Tiger (/t/ sound)' },
        { letter: 'U', word: 'Umbrella (/ʌ/ sound)' },
        { letter: 'V', word: 'Van (/v/ sound)' },
        { letter: 'W', word: 'Watch (/w/ sound)' },
        { letter: 'X', word: 'Xylophone (/z/ sound)' },
        { letter: 'Y', word: 'Yak (/j/ sound)' },
        { letter: 'Z', word: 'Zebra (/z/ sound)' }
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
