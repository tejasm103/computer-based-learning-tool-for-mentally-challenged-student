/**
 * AccessibleVerse — Virtual Learning Companion ("Sparky / ಮಿತ್ರ / दोस्त")
 * Interactive animated companion offering contextual encouragement, streak celebrations,
 * hints, trilingual voice greetings, and distraction-free mute/disable controls.
 */

class LearningCompanion {
  constructor() {
    this.container = null;
    this.avatar = 'star'; // star | robot | rocket | pet
    this.isEnabled = true;
    this.speechBubble = null;
    this.speechTimeout = null;
  }

  init() {
    // Check user preference
    const stored = localStorage.getItem('accessibleverse_companion_enabled');
    if (stored !== null) {
      this.isEnabled = stored === 'true';
    }

    const user = window.api ? window.api.getCachedUser() : null;
    if (user && user.avatar) {
      this.avatar = user.avatar;
    }

    this.renderCompanion();
    this.setupListeners();
  }

  renderCompanion() {
    if (document.getElementById('companion-widget')) return;

    const widget = document.createElement('div');
    widget.id = 'companion-widget';
    widget.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 2rem;
      z-index: 9990;
      display: ${this.isEnabled ? 'flex' : 'none'};
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
      pointer-events: auto;
    `;

    // Speech Bubble
    const bubble = document.createElement('div');
    bubble.id = 'companion-bubble';
    bubble.className = 'card card-glass';
    bubble.style.cssText = `
      padding: 0.65rem 0.95rem;
      border-radius: 12px 12px 12px 2px;
      font-size: 0.82rem;
      max-width: 260px;
      line-height: 1.35;
      color: #f8fafc;
      border: 1px solid rgba(255,255,255,0.15);
      box-shadow: 0 8px 24px rgba(0,0,0,0.35);
      display: none;
      background: rgba(30, 41, 59, 0.95);
      animation: floatBubble 0.3s ease;
    `;
    widget.appendChild(bubble);
    this.speechBubble = bubble;

    // Avatar Avatar Action Container
    const avatarBtn = document.createElement('div');
    avatarBtn.id = 'companion-avatar-btn';
    avatarBtn.style.cssText = `
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      border: 2px solid var(--primary);
      border-radius: 50px;
      padding: 0.35rem 0.75rem 0.35rem 0.45rem;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(0,0,0,0.4);
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;

    avatarBtn.onmouseover = () => avatarBtn.style.transform = 'scale(1.08)';
    avatarBtn.onmouseout = () => avatarBtn.style.transform = 'scale(1)';
    avatarBtn.onclick = () => this.sayRandomMotivational();

    const avatarIcon = this.getAvatarIcon(this.avatar);
    avatarBtn.innerHTML = `
      <div id="companion-avatar-icon" style="font-size: 1.6rem; line-height: 1;">${avatarIcon}</div>
      <div style="display: flex; flex-direction: column;">
        <span style="font-size: 0.75rem; font-weight: 700; color: #818cf8;">Sparky</span>
        <span style="font-size: 0.62rem; color: #94a3b8;">Click for hint!</span>
      </div>
      <button id="btn-toggle-companion-menu" style="background: none; border: none; color: #64748b; font-size: 0.75rem; margin-left: 0.3rem; cursor: pointer; padding: 2px;" title="Companion settings" aria-label="Companion settings">⚙️</button>
    `;

    widget.appendChild(avatarBtn);
    document.body.appendChild(widget);
    this.container = widget;

    document.getElementById('btn-toggle-companion-menu')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleSettingsModal();
    });

    // Friendly initial greeting after 2 seconds
    setTimeout(() => {
      this.say("✨ Welcome! Click me anytime you need a quick tip or learning cheer!", 5000);
    }, 2000);
  }

  getAvatarIcon(type) {
    switch (type) {
      case 'robot': return '🤖';
      case 'rocket': return '🚀';
      case 'pet': return '🐾';
      case 'star':
      default: return '⭐';
    }
  }

  say(message, duration = 4000) {
    if (!this.speechBubble || !this.isEnabled) return;
    if (this.speechTimeout) clearTimeout(this.speechTimeout);

    this.speechBubble.textContent = message;
    this.speechBubble.style.display = 'block';

    this.speechTimeout = setTimeout(() => {
      if (this.speechBubble) this.speechBubble.style.display = 'none';
    }, duration);
  }

  sayRandomMotivational() {
    const lang = (window.lang && window.lang.currentLang) || 'en';
    const quotes = {
      en: [
        "🌟 You are making fantastic progress! Every lesson is a step forward.",
        "💡 Don't worry about mistakes — they are proof you are learning!",
        "🚀 Focus on one question at a time. You've got this!",
        "🎯 Remember to take deep breaths and stretch while learning."
      ],
      kn: [
        "🌟 ನೀವು ಅದ್ಭುತವಾಗಿ ಕಲಿಯುತ್ತಿದ್ದೀರಿ! ನಿಧಾನವಾಗಿ ಮತ್ತು ಅರ್ಥಮಾಡಿಕೊಂಡು ಕಲಿಯಿರಿ.",
        "💡 ತಪ್ಪುಗಳು ಕಲಿಕೆಯ ಮೊದಲ ಹೆಜ್ಜೆ — ಧೈರ್ಯವಾಗಿ ಮುಂದುವರಿಯಿರಿ!",
        "🚀 ದಿನಕ್ಕೊಂದು ಪಾಠ ಕಲಿಯುವುದು ನಿಮ್ಮನ್ನು ಜ್ಞಾನವಂತರನ್ನಾಗಿ ಮಾಡುತ್ತದೆ!"
      ],
      hi: [
        "🌟 आप बहुत अच्छा सीख रहे हैं! हर नया पाठ आपकी प्रगति का प्रमाण है।",
        "💡 गलतियों से घबराएं नहीं, वे हमें नया रास्ता सिखाती हैं!",
        "🎯 एक समय में एक ही विषय पर ध्यान दें, सफलता ज़रूर मिलेगी!"
      ]
    };

    const list = quotes[lang] || quotes['en'];
    const randomMsg = list[Math.floor(Math.random() * list.length)];
    this.say(randomMsg, 5500);
  }

  setupListeners() {
    // Listen for quiz mistake events to offer gentle comfort
    window.addEventListener('quizMistakeOccurred', (e) => {
      const q = e.detail;
      this.say(`💡 It's okay! We recorded this mistake in your Review Center so you can practice it anytime.`);
    });

    // Listen for level up / quiz perfection
    window.addEventListener('lessonCompleted', (e) => {
      this.say(`🎉 Brilliant job completing that lesson! +50 XP earned!`, 4000);
    });
  }

  toggleSettingsModal() {
    let modal = document.getElementById('companion-settings-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'companion-settings-modal';
      modal.className = 'modal-backdrop';
      modal.style.cssText = `
        position: fixed; inset: 0; background: rgba(15,23,42,0.8);
        display: flex; align-items: center; justify-content: center; z-index: 10001;
      `;
      modal.innerHTML = `
        <div class="card card-glass" style="width: 320px; padding: 1.5rem;">
          <h3 style="margin-top: 0; font-size: 1.1rem;">Learning Companion</h3>
          
          <div style="margin: 1rem 0;">
            <label class="form-label">Choose Companion Avatar:</label>
            <div style="display: flex; gap: 0.5rem; font-size: 1.6rem; margin-top: 0.4rem;">
              <button class="btn btn-secondary comp-av-opt" data-avatar="star" style="padding: 0.4rem 0.6rem;">⭐</button>
              <button class="btn btn-secondary comp-av-opt" data-avatar="robot" style="padding: 0.4rem 0.6rem;">🤖</button>
              <button class="btn btn-secondary comp-av-opt" data-avatar="rocket" style="padding: 0.4rem 0.6rem;">🚀</button>
              <button class="btn btn-secondary comp-av-opt" data-avatar="pet" style="padding: 0.4rem 0.6rem;">🐾</button>
            </div>
          </div>

          <div style="margin: 1rem 0;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" id="chk-comp-enabled" ${this.isEnabled ? 'checked' : ''} style="width: 18px; height: 18px;">
              <span>Show companion on screen</span>
            </label>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem;">
            <button id="btn-save-comp" class="btn btn-primary btn-sm">Save Preferences</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelectorAll('.comp-av-opt').forEach((b) => {
        b.onclick = () => {
          this.avatar = b.dataset.avatar;
          document.getElementById('companion-avatar-icon').textContent = this.getAvatarIcon(this.avatar);
        };
      });

      document.getElementById('btn-save-comp').onclick = () => {
        const enabled = document.getElementById('chk-comp-enabled').checked;
        this.isEnabled = enabled;
        localStorage.setItem('accessibleverse_companion_enabled', String(enabled));
        if (this.container) this.container.style.display = enabled ? 'flex' : 'none';
        modal.remove();
      };

      modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
      };
    }
  }
}

// Global Companion Instance
window.companion = new LearningCompanion();
document.addEventListener('DOMContentLoaded', () => {
  window.companion.init();
});
