/**
 * AccessibleVerse — Pronunciation & Speech Practice Studio
 * Trilingual letter/word audio pronunciations (TTS) and Web Speech Recognition practice.
 */

class PronunciationStudio {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.currentLanguage = 'kn';
    this.currentTargetWord = null;
    this.synth = window.speechSynthesis;
    this.words = [];
  }

  async init(containerId = 'pronunciation-studio-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.setupSpeechRecognition();
    await this.loadWords(this.currentLanguage);
    this.render();
  }

  setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 3;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateMicUI(true);
      };

      this.recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript.trim().toLowerCase();
        this.evaluatePronunciation(spoken);
      };

      this.recognition.onerror = (event) => {
        console.warn('[Speech] Error or mic denied:', event.error);
        this.isListening = false;
        this.updateMicUI(false);
        this.showResultStatus("Microphone unavailable or denied. You can still practice by listening and reading!", "warning");
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateMicUI(false);
      };
    }
  }

  async loadWords(lang) {
    this.currentLanguage = lang;
    if (window.api && window.api.practice) {
      const data = await window.api.practice.getPronunciationWords(lang);
      if (data) {
        this.words = data;
        return;
      }
    }

    // Offline fallback word list
    if (lang === 'kn') {
      this.words = [
        { letter: "ಅ", word: "ಅಮ್ಮ", trans: "Amma", meaning: "Mother", phonetic: "uh-muh", audio_text: "ಅಮ್ಮ" },
        { letter: "ಆ", word: "ಆನೆ", trans: "Aane", meaning: "Elephant", phonetic: "aah-nay", audio_text: "ಆನೆ" },
        { letter: "ಇ", word: "ಇಲಿ", trans: "Ili", meaning: "Rat / Mouse", phonetic: "ih-lee", audio_text: "ಇಲಿ" },
        { letter: "ಕ", word: "ಕಮಲ", trans: "Kamala", meaning: "Lotus", phonetic: "kuh-muh-luh", audio_text: "ಕಮಲ" },
        { letter: "ಗ", word: "ಗಣೇಶ", trans: "Ganesha", meaning: "Deity Ganesha", phonetic: "guh-nay-shuh", audio_text: "ಗಣೇಶ" }
      ];
    } else if (lang === 'hi') {
      this.words = [
        { letter: "अ", word: "अनार", trans: "Anar", meaning: "Pomegranate", phonetic: "uh-naar", audio_text: "अनार" },
        { letter: "आ", word: "आम", trans: "Aam", meaning: "Mango", phonetic: "aahm", audio_text: "आम" },
        { letter: "क", word: "कमल", trans: "Kamal", meaning: "Lotus", phonetic: "kuh-muhl", audio_text: "कमल" }
      ];
    } else {
      this.words = [
        { letter: "A", word: "Apple", trans: "Apple", meaning: "Fruit", phonetic: "/æp.əl/", audio_text: "Apple" },
        { letter: "B", word: "Butterfly", trans: "Butterfly", meaning: "Insect", phonetic: "/ˈbʌt.ə.flaɪ/", audio_text: "Butterfly" },
        { letter: "S", word: "Sunshine", trans: "Sunshine", meaning: "Warm light", phonetic: "/ˈsʌn.ʃaɪn/", audio_text: "Sunshine" }
      ];
    }
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="card card-glass" style="padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">
          <div>
            <h2 style="margin: 0; font-size: 1.35rem; display: flex; align-items: center; gap: 0.5rem;">
              <i data-lucide="mic" style="color: var(--primary);"></i> Pronunciation & Language Studio
            </h2>
            <p style="margin: 0.25rem 0 0; font-size: 0.88rem; color: #94a3b8;">
              Listen to native pronunciations and speak into the microphone to test your clarity.
            </p>
          </div>

          <!-- Language Selector -->
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn btn-sm btn-secondary lang-practice-btn ${this.currentLanguage === 'kn' ? 'active' : ''}" data-lang="kn">ಕನ್ನಡ</button>
            <button class="btn btn-sm btn-secondary lang-practice-btn ${this.currentLanguage === 'hi' ? 'active' : ''}" data-lang="hi">हिंदी</button>
            <button class="btn btn-sm btn-secondary lang-practice-btn ${this.currentLanguage === 'en' ? 'active' : ''}" data-lang="en">English</button>
          </div>
        </div>

        <!-- Target Word Display Card -->
        <div id="target-word-card" style="margin: 2rem 0; text-align: center; padding: 2.5rem 1.5rem; background: rgba(15,23,42,0.6); border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);">
          <div id="target-word-letter" style="font-size: 4.5rem; font-weight: 800; color: #facc15; line-height: 1.1;">ಅ</div>
          <div id="target-word-text" style="font-size: 2.2rem; font-weight: 700; margin-top: 0.5rem; color: #f8fafc;">ಅಮ್ಮ (Amma)</div>
          <div id="target-word-phonetic" style="font-size: 1rem; color: #94a3b8; margin-top: 0.25rem;">Phonetic sound: [ uh-muh ] • Meaning: Mother</div>

          <!-- Action Buttons -->
          <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1.75rem; flex-wrap: wrap;">
            <button id="btn-listen-word" class="btn btn-primary btn-lg" style="gap: 0.5rem;">
              <i data-lucide="volume-2"></i> Listen Pronunciation
            </button>

            <button id="btn-speak-word" class="btn btn-secondary btn-lg" style="gap: 0.5rem; position: relative;">
              <i data-lucide="mic"></i> <span id="speak-btn-text">Press & Speak</span>
              <span id="mic-pulse-ring" style="display: none; position: absolute; inset: -4px; border: 2px solid #ef4444; border-radius: 50px; animation: pulse 1.2s infinite;"></span>
            </button>
          </div>

          <!-- Live Speech Evaluation Status -->
          <div id="speech-eval-status" style="margin-top: 1.5rem; min-height: 2rem; font-weight: 600; font-size: 1rem;"></div>
        </div>

        <!-- Vocabulary Word Grid Picker -->
        <div>
          <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.75rem; color: #cbd5e1;">Practice Word Bank:</div>
          <div id="word-bank-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.75rem;">
            ${this.words.map((w, idx) => `
              <button class="card card-glass word-pick-btn ${idx === 0 ? 'active-word' : ''}" data-index="${idx}" style="padding: 0.75rem; text-align: center; cursor: pointer; border-radius: 10px; transition: transform 0.15s, border-color 0.15s;">
                <div style="font-size: 1.6rem; font-weight: 700; color: #facc15;">${w.letter}</div>
                <div style="font-weight: 600; font-size: 0.88rem; margin-top: 0.2rem;">${w.word}</div>
                <div style="font-size: 0.72rem; color: #94a3b8;">${w.trans}</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    this.selectWord(0);
    this.bindEvents();
  }

  selectWord(idx) {
    const word = this.words[idx];
    if (!word) return;
    this.currentTargetWord = word;

    document.getElementById('target-word-letter').textContent = word.letter;
    document.getElementById('target-word-text').textContent = `${word.word} (${word.trans})`;
    document.getElementById('target-word-phonetic').textContent = `Phonetic: [ ${word.phonetic} ] • Meaning: ${word.meaning}`;
    document.getElementById('speech-eval-status').textContent = '';

    document.querySelectorAll('.word-pick-btn').forEach((b, i) => {
      if (i === idx) {
        b.style.borderColor = 'var(--primary)';
        b.style.background = 'rgba(99,102,241,0.2)';
      } else {
        b.style.borderColor = 'rgba(255,255,255,0.1)';
        b.style.background = '';
      }
    });
  }

  bindEvents() {
    // Listen Pronunciation
    document.getElementById('btn-listen-word')?.addEventListener('click', () => {
      this.speakWord(this.currentTargetWord);
    });

    // Speak Pronunciation
    document.getElementById('btn-speak-word')?.addEventListener('click', () => {
      this.toggleSpeechRecognition();
    });

    // Word Pick Buttons
    document.querySelectorAll('.word-pick-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        this.selectWord(idx);
      });
    });

    // Language Toggle Buttons
    this.container.querySelectorAll('.lang-practice-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const lang = btn.dataset.lang;
        await this.loadWords(lang);
        this.render();
      });
    });
  }

  speakWord(wordObj) {
    if (!this.synth) return;
    this.synth.cancel();

    const textToSpeak = wordObj.audio_text || wordObj.word;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = this.currentLanguage === 'kn' ? 'kn-IN' : (this.currentLanguage === 'hi' ? 'hi-IN' : 'en-US');
    utterance.rate = 0.85; // slightly slower for educational phonics clarity
    this.synth.speak(utterance);
  }

  toggleSpeechRecognition() {
    if (!this.recognition) {
      this.showResultStatus("Speech recognition is not supported in this browser. Please use Chrome or Edge for voice recognition.", "warning");
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    } else {
      this.recognition.lang = this.currentLanguage === 'kn' ? 'kn-IN' : (this.currentLanguage === 'hi' ? 'hi-IN' : 'en-US');
      try {
        this.recognition.start();
      } catch (e) {
        this.recognition.stop();
      }
    }
  }

  updateMicUI(listening) {
    const ring = document.getElementById('mic-pulse-ring');
    const text = document.getElementById('speak-btn-text');
    if (ring && text) {
      ring.style.display = listening ? 'block' : 'none';
      text.textContent = listening ? 'Listening... Speak now!' : 'Press & Speak';
    }
  }

  evaluatePronunciation(spoken) {
    if (!this.currentTargetWord) return;
    const targetTrans = (this.currentTargetWord.trans || '').toLowerCase();
    const targetWord = (this.currentTargetWord.word || '').toLowerCase();

    // Check similarity
    const isMatch = spoken.includes(targetTrans) || spoken.includes(targetWord) || targetTrans.includes(spoken);

    if (isMatch) {
      this.showResultStatus(`🎉 Perfect pronunciation! You said "${spoken}". +25 XP earned!`, "success");
      if (window.api && window.api.games) {
        window.api.games.submitScore({ game_id: 'pronunciation_studio', score: 25, level: 1 });
      }
    } else {
      this.showResultStatus(`👂 Heard "${spoken}". Listen to the pronunciation again and give it another try!`, "warning");
    }
  }

  showResultStatus(msg, type = "info") {
    const statusEl = document.getElementById('speech-eval-status');
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = type === 'success' ? '#10b981' : (type === 'warning' ? '#f59e0b' : '#38bdf8');
  }
}

// Global Pronunciation Studio Instance
window.pronunciationStudio = new PronunciationStudio();
