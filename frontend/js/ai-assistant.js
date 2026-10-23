/**
 * AccessibleVerse — Trilingual AI Learning Assistant
 * Accessible floating/docked AI tutor providing step-by-step explanations,
 * hints, real-world analogies, and practice drills in English, Kannada, and Hindi.
 */

class AIAssistant {
  constructor() {
    this.isOpen = false;
    this.currentLanguage = 'en';
    this.activeTopic = 'General Learning';
    this.panel = null;
  }

  init() {
    this.createWidget();
    this.bindEvents();
  }

  createWidget() {
    if (document.getElementById('ai-assistant-widget')) return;

    // Floating Launch Button
    const btn = document.createElement('button');
    btn.id = 'ai-assistant-toggle-btn';
    btn.className = 'btn btn-primary';
    btn.setAttribute('aria-label', 'Open AI Learning Assistant');
    btn.setAttribute('aria-expanded', 'false');
    btn.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 9998;
      border-radius: 50px;
      padding: 0.75rem 1.25rem;
      box-shadow: 0 10px 25px rgba(99, 102, 241, 0.45);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      font-size: 0.95rem;
    `;
    btn.innerHTML = `
      <i data-lucide="sparkles"></i>
      <span>AI Tutor</span>
    `;
    document.body.appendChild(btn);

    // AI Panel Drawer
    const panel = document.createElement('div');
    panel.id = 'ai-assistant-panel';
    panel.className = 'card card-glass';
    panel.style.cssText = `
      display: none;
      position: fixed;
      bottom: 5.5rem;
      right: 2rem;
      width: 400px;
      max-width: 92vw;
      height: 520px;
      max-height: 75vh;
      z-index: 9999;
      flex-direction: column;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
      padding: 1.25rem;
    `;

    panel.innerHTML = `
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="background: var(--primary); color: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
            <i data-lucide="bot"></i>
          </div>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">AI Learning Companion</div>
            <div style="font-size: 0.72rem; color: #10b981; font-weight: 600;">● Online / Trilingual Tutor</div>
          </div>
        </div>
        <div style="display: flex; gap: 0.3rem; align-items: center;">
          <button id="ai-lang-en" class="btn btn-sm btn-secondary ai-lang-btn active" style="padding: 2px 6px; font-size: 0.72rem;">EN</button>
          <button id="ai-lang-kn" class="btn btn-sm btn-secondary ai-lang-btn" style="padding: 2px 6px; font-size: 0.72rem;">ಕನ್ನಡ</button>
          <button id="ai-lang-hi" class="btn btn-sm btn-secondary ai-lang-btn" style="padding: 2px 6px; font-size: 0.72rem;">हिंदी</button>
          <button id="btn-close-ai" class="btn btn-sm btn-secondary" style="padding: 2px 6px; margin-left: 0.3rem;">✕</button>
        </div>
      </div>

      <!-- Quick Concept Suggestion Pills -->
      <div style="display: flex; gap: 0.3rem; overflow-x: auto; padding: 0.6rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
        <button class="btn btn-sm btn-secondary ai-quick-pill" data-topic="swaragalu" data-subject="kannada" style="font-size: 0.72rem; white-space: nowrap;">ಕನ್ನಡ ಸ್ವರಗಳು</button>
        <button class="btn btn-sm btn-secondary ai-quick-pill" data-topic="multiplication" data-subject="mathematics" style="font-size: 0.72rem; white-space: nowrap;">Multiplication Tables</button>
        <button class="btn btn-sm btn-secondary ai-quick-pill" data-topic="solar_system" data-subject="science" style="font-size: 0.72rem; white-space: nowrap;">Solar System</button>
        <button class="btn btn-sm btn-secondary ai-quick-pill" data-topic="passwords" data-subject="cybersecurity" style="font-size: 0.72rem; white-space: nowrap;">Password Security</button>
        <button class="btn btn-sm btn-secondary ai-quick-pill" data-topic="traffic" data-subject="everyday" style="font-size: 0.72rem; white-space: nowrap;">Traffic Signals</button>
      </div>

      <!-- Dialogue History Stream -->
      <div id="ai-chat-stream" style="flex: 1; overflow-y: auto; padding: 0.75rem 0; display: flex; flex-direction: column; gap: 0.75rem;">
        <div class="card card-glass" style="padding: 0.75rem; background: rgba(99,102,241,0.12); border-left: 3px solid var(--primary);">
          <div style="font-weight: 700; font-size: 0.85rem; color: #818cf8; margin-bottom: 0.2rem;">✨ Hello Explorer!</div>
          <p style="font-size: 0.82rem; margin: 0; line-height: 1.4;">I am your trilingual AI Learning Assistant. Ask me to explain any lesson, give hints, or create practice questions!</p>
        </div>
      </div>

      <!-- Input Bar -->
      <form id="ai-input-form" style="display: flex; gap: 0.5rem; margin-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.75rem;">
        <input type="text" id="ai-user-query" class="form-input" placeholder="Ask for an explanation or hint..." style="flex: 1; font-size: 0.88rem; padding: 0.5rem 0.75rem;" required>
        <button type="submit" class="btn btn-primary" style="padding: 0.5rem 0.85rem;">
          <i data-lucide="send"></i>
        </button>
      </form>
    `;

    document.body.appendChild(panel);
    this.panel = panel;

    if (window.lucide) window.lucide.createIcons();
  }

  bindEvents() {
    const toggleBtn = document.getElementById('ai-assistant-toggle-btn');
    const closeBtn = document.getElementById('btn-close-ai');
    const form = document.getElementById('ai-input-form');

    toggleBtn?.addEventListener('click', () => this.toggle());
    closeBtn?.addEventListener('click', () => this.close());

    // Language pills
    ['en', 'kn', 'hi'].forEach((lang) => {
      document.getElementById(`ai-lang-en`)?.addEventListener('click', () => this.setLanguage('en'));
      document.getElementById(`ai-lang-kn`)?.addEventListener('click', () => this.setLanguage('kn'));
      document.getElementById(`ai-lang-hi`)?.addEventListener('click', () => this.setLanguage('hi'));
    });

    // Quick suggestion pills
    document.querySelectorAll('.ai-quick-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        const topic = pill.dataset.topic;
        const subject = pill.dataset.subject;
        this.askExplanation(topic, subject);
      });
    });

    // Form submit
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('ai-user-query');
      const query = input.value.trim();
      if (!query) return;
      input.value = '';
      this.askExplanation(query, 'general');
    });
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
    document.querySelectorAll('.ai-lang-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`ai-lang-${lang}`)?.classList.add('active');
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.panel) {
      this.panel.style.display = this.isOpen ? 'flex' : 'none';
      const btn = document.getElementById('ai-assistant-toggle-btn');
      btn?.setAttribute('aria-expanded', this.isOpen ? 'true' : 'false');
    }
  }

  close() {
    this.isOpen = false;
    if (this.panel) this.panel.style.display = 'none';
    const btn = document.getElementById('ai-assistant-toggle-btn');
    btn?.setAttribute('aria-expanded', 'false');
  }

  async askExplanation(topic, subject = 'general') {
    const stream = document.getElementById('ai-chat-stream');
    if (!stream) return;

    // Render User Bubble
    const userBubble = document.createElement('div');
    userBubble.style.cssText = `
      align-self: flex-end;
      background: var(--primary);
      color: white;
      padding: 0.5rem 0.85rem;
      border-radius: 12px 12px 2px 12px;
      font-size: 0.85rem;
      max-width: 80%;
      word-break: break-word;
    `;
    userBubble.textContent = topic;
    stream.appendChild(userBubble);

    // Render Loading Bubble
    const loadingBubble = document.createElement('div');
    loadingBubble.className = 'card card-glass';
    loadingBubble.style.cssText = `
      align-self: flex-start;
      padding: 0.6rem 0.85rem;
      font-size: 0.82rem;
      color: #94a3b8;
    `;
    loadingBubble.innerHTML = `<span>Thinking & translating into ${this.currentLanguage.toUpperCase()}...</span>`;
    stream.appendChild(loadingBubble);
    stream.scrollTop = stream.scrollHeight;

    try {
      const res = await window.api.ai.explain({
        topic: topic,
        subject: subject,
        language: this.currentLanguage
      });

      loadingBubble.remove();

      // Render AI Response Card
      const aiCard = document.createElement('div');
      aiCard.className = 'card card-glass';
      aiCard.style.cssText = `
        align-self: flex-start;
        padding: 0.85rem;
        border-radius: 12px 12px 12px 2px;
        font-size: 0.84rem;
        background: rgba(30, 41, 59, 0.85);
        border: 1px solid rgba(255,255,255,0.1);
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        max-width: 95%;
      `;

      aiCard.innerHTML = `
        <div style="font-weight: 700; color: #f8fafc; font-size: 0.9rem;">📘 Explanation:</div>
        <p style="margin: 0; line-height: 1.45; color: #cbd5e1;">${res.explanation}</p>
        
        ${res.hint ? `
          <div style="background: rgba(245, 158, 11, 0.12); padding: 0.45rem 0.6rem; border-radius: 6px; border-left: 3px solid #f59e0b; margin-top: 0.2rem;">
            <strong style="color: #fbbf24; font-size: 0.78rem;">💡 Step-by-Step Hint:</strong>
            <div style="font-size: 0.78rem; color: #fef3c7; margin-top: 0.1rem;">${res.hint}</div>
          </div>
        ` : ''}

        ${res.example ? `
          <div style="background: rgba(16, 185, 129, 0.1); padding: 0.45rem 0.6rem; border-radius: 6px; border-left: 3px solid #10b981;">
            <strong style="color: #34d399; font-size: 0.78rem;">🌟 Real-World Example:</strong>
            <div style="font-size: 0.78rem; color: #d1fae5; margin-top: 0.1rem;">${res.example}</div>
          </div>
        ` : ''}

        ${res.practice_question ? `
          <div style="background: rgba(99, 102, 241, 0.1); padding: 0.45rem 0.6rem; border-radius: 6px; border-left: 3px solid #6366f1;">
            <strong style="color: #818cf8; font-size: 0.78rem;">🎯 Try It Yourself:</strong>
            <div style="font-size: 0.78rem; color: #e0e7ff; margin-top: 0.1rem;">${res.practice_question}</div>
          </div>
        ` : ''}

        <div style="display: flex; justify-content: flex-end; margin-top: 0.2rem;">
          <button class="btn btn-sm btn-secondary btn-tts-listen" style="padding: 2px 6px; font-size: 0.72rem; gap: 0.25rem;">
            <i data-lucide="volume-2" style="width: 14px; height: 14px;"></i> Listen
          </button>
        </div>
      `;

      // Read Aloud handler
      aiCard.querySelector('.btn-tts-listen')?.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(res.explanation);
          utter.lang = this.currentLanguage === 'kn' ? 'kn-IN' : (this.currentLanguage === 'hi' ? 'hi-IN' : 'en-US');
          window.speechSynthesis.speak(utter);
        }
      });

      stream.appendChild(aiCard);
      stream.scrollTop = stream.scrollHeight;
      if (window.lucide) window.lucide.createIcons();

    } catch (err) {
      loadingBubble.innerHTML = `<span style="color: #ef4444;">Could not load explanation. Please try again.</span>`;
    }
  }
}

// Global AI Assistant Instance
window.aiAssistant = new AIAssistant();
document.addEventListener('DOMContentLoaded', () => {
  window.aiAssistant.init();
});
