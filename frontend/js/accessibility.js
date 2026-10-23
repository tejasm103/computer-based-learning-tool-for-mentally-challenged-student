/**
 * AccessibleVerse — Accessibility Controller & Tools
 * Handles WCAG 2.2 AA / AAA features, preferences, floating launcher, and keyboard bindings.
 */

class AccessibilityManager {
  constructor() {
    this.storageKey = 'accessibleverse_a11y_prefs';
    this.defaults = {
      high_contrast: false,
      dark_mode: false,
      font_size: 'medium', // small, medium, large, xlarge
      dyslexic_font: false,
      narration: true,
      reduced_motion: false,
      mode_2d: false
    };
    this.prefs = this.loadPreferences();
    this.liveAnnouncer = null;
  }

  init() {
    this.applyAll();
    this.injectLauncherAndModal();
    this.setupKeyboardShortcuts();
    this.setupHoverNarration();
    this.createLiveAnnouncer();
  }

  loadPreferences() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? { ...this.defaults, ...JSON.parse(stored) } : { ...this.defaults };
    } catch {
      return { ...this.defaults };
    }
  }

  savePreferences() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.prefs));
    // If logged in, sync with backend profile
    if (window.api && window.api.getToken()) {
      window.api.auth.updateProfile({ accessibility_settings: this.prefs }).catch(() => {});
    }
  }

  applyAll() {
    const root = document.documentElement;

    // High Contrast
    if (this.prefs.high_contrast) {
      root.setAttribute('data-contrast', 'high');
    } else {
      root.removeAttribute('data-contrast');
    }

    // Dark Mode
    if (this.prefs.dark_mode) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    // Dyslexia Font
    if (this.prefs.dyslexic_font) {
      root.setAttribute('data-dyslexia', 'true');
    } else {
      root.removeAttribute('data-dyslexia');
    }

    // Reduced Motion
    if (this.prefs.reduced_motion) {
      root.setAttribute('data-reduced-motion', 'true');
    } else {
      root.removeAttribute('data-reduced-motion');
    }

    // 2D Mode
    if (this.prefs.mode_2d) {
      root.setAttribute('data-mode-2d', 'true');
    } else {
      root.removeAttribute('data-mode-2d');
    }

    // Font Sizing
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
    root.classList.add(`font-${this.prefs.font_size}`);

    // Notify 3D world if 2D mode toggled
    window.dispatchEvent(new CustomEvent('accessibilityChanged', { detail: this.prefs }));
  }

  toggle(settingKey) {
    if (typeof this.prefs[settingKey] === 'boolean') {
      this.prefs[settingKey] = !this.prefs[settingKey];
      this.savePreferences();
      this.applyAll();
      this.updateModalUI();
      this.announce(`${settingKey.replace('_', ' ')} is now ${this.prefs[settingKey] ? 'enabled' : 'disabled'}`);
    }
  }

  setFontSize(size) {
    if (['small', 'medium', 'large', 'xlarge'].includes(size)) {
      this.prefs.font_size = size;
      this.savePreferences();
      this.applyAll();
      this.updateModalUI();
      this.announce(`Font size changed to ${size}`);
    }
  }

  createLiveAnnouncer() {
    this.liveAnnouncer = document.createElement('div');
    this.liveAnnouncer.className = 'sr-only';
    this.liveAnnouncer.setAttribute('aria-live', 'polite');
    this.liveAnnouncer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(this.liveAnnouncer);
  }

  announce(text) {
    if (this.liveAnnouncer) {
      this.liveAnnouncer.textContent = text;
    }
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Alt + A toggles accessibility panel
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        this.toggleModal();
      }
      // Escape closes open modals
      if (e.key === 'Escape') {
        const modal = document.querySelector('.a11y-modal-backdrop');
        if (modal && modal.classList.contains('active')) {
          this.closeModal();
        }
      }
    });
  }

  setupHoverNarration() {
    // If narration is enabled, read aloud on hover or focus for designated accessible elements
    document.addEventListener('focusin', (e) => {
      if (!this.prefs.narration) return;
      const target = e.target.closest('[data-narrate]');
      if (target) {
        const text = target.getAttribute('data-narrate') || target.textContent;
        if (text && window.lang) {
          window.lang.speakText(text.trim());
        }
      }
    });
  }

  injectLauncherAndModal() {
    // 1. Floating Launcher Button
    const launcherBtn = document.createElement('button');
    launcherBtn.className = 'a11y-launcher-btn';
    launcherBtn.setAttribute('aria-label', 'Open Accessibility Tools (Alt + A)');
    launcherBtn.setAttribute('title', 'Accessibility Menu (Alt + A)');
    launcherBtn.innerHTML = `<i data-lucide="accessibility"></i>`;
    launcherBtn.addEventListener('click', () => this.toggleModal());
    document.body.appendChild(launcherBtn);

    // 2. Modal Overlay
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'a11y-modal-backdrop';
    modalBackdrop.setAttribute('role', 'dialog');
    modalBackdrop.setAttribute('aria-modal', 'true');
    modalBackdrop.setAttribute('aria-labelledby', 'a11y-panel-title');

    modalBackdrop.innerHTML = `
      <div class="a11y-panel">
        <div class="a11y-panel-header">
          <h3 id="a11y-panel-title">
            <i data-lucide="sliders" style="color: var(--primary);"></i>
            <span data-i18n="a11y_title">Accessibility Preferences</span>
          </h3>
          <button class="a11y-close-btn" aria-label="Close Accessibility Panel">&times;</button>
        </div>

        <!-- Font Resizing Group -->
        <div>
          <label class="form-label" style="margin-bottom: 0.5rem;" data-i18n="a11y_font_size">Text Scaling</label>
          <div class="a11y-font-group" role="group" aria-label="Font scale options">
            <button class="a11y-font-btn font-btn-small" onclick="window.a11y.setFontSize('small')">A-</button>
            <button class="a11y-font-btn font-btn-medium" onclick="window.a11y.setFontSize('medium')">A</button>
            <button class="a11y-font-btn font-btn-large" onclick="window.a11y.setFontSize('large')">A+</button>
            <button class="a11y-font-btn font-btn-xlarge" onclick="window.a11y.setFontSize('xlarge')">A++</button>
          </div>
        </div>

        <!-- Option Toggles Grid -->
        <div class="a11y-options-grid">
          <button class="a11y-card-toggle toggle-high-contrast" onclick="window.a11y.toggle('high_contrast')">
            <span class="a11y-card-title">
              <i data-lucide="eye"></i>
              <span data-i18n="a11y_high_contrast">High Contrast (AAA)</span>
            </span>
            <span class="a11y-card-desc" data-i18n="a11y_high_contrast_desc">Pure black & vivid yellow outlines</span>
          </button>

          <button class="a11y-card-toggle toggle-dark-mode" onclick="window.a11y.toggle('dark_mode')">
            <span class="a11y-card-title">
              <i data-lucide="moon"></i>
              <span data-i18n="a11y_dark_mode">Dark Theme</span>
            </span>
            <span class="a11y-card-desc" data-i18n="a11y_dark_mode_desc">Reduces eye strain</span>
          </button>

          <button class="a11y-card-toggle toggle-dyslexia" onclick="window.a11y.toggle('dyslexic_font')">
            <span class="a11y-card-title">
              <i data-lucide="type"></i>
              <span data-i18n="a11y_dyslexia">Dyslexia Font</span>
            </span>
            <span class="a11y-card-desc" data-i18n="a11y_dyslexia_desc">Weighted baseline Lexend font</span>
          </button>

          <button class="a11y-card-toggle toggle-narration" onclick="window.a11y.toggle('narration')">
            <span class="a11y-card-title">
              <i data-lucide="volume-2"></i>
              <span data-i18n="a11y_narration">Read Aloud (TTS)</span>
            </span>
            <span class="a11y-card-desc" data-i18n="a11y_narration_desc">Spoken guidance for questions</span>
          </button>

          <button class="a11y-card-toggle toggle-reduced-motion" onclick="window.a11y.toggle('reduced_motion')">
            <span class="a11y-card-title">
              <i data-lucide="zap-off"></i>
              <span data-i18n="a11y_reduced_motion">Reduce Motion</span>
            </span>
            <span class="a11y-card-desc" data-i18n="a11y_reduced_motion_desc">Minimizes fast animations</span>
          </button>

          <button class="a11y-card-toggle toggle-2d-mode" onclick="window.a11y.toggle('mode_2d')">
            <span class="a11y-card-title">
              <i data-lucide="image"></i>
              <span data-i18n="a11y_2d_mode">Simplified 2D</span>
            </span>
            <span class="a11y-card-desc" data-i18n="a11y_2d_mode_desc">Lightweight 2D graphics</span>
          </button>
        </div>
      </div>
    `;

    modalBackdrop.querySelector('.a11y-close-btn').addEventListener('click', () => this.closeModal());
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) this.closeModal();
    });

    document.body.appendChild(modalBackdrop);
    this.updateModalUI();
  }

  updateModalUI() {
    const modal = document.querySelector('.a11y-panel');
    if (!modal) return;

    // Update toggles active class
    modal.querySelector('.toggle-high-contrast')?.classList.toggle('active', this.prefs.high_contrast);
    modal.querySelector('.toggle-dark-mode')?.classList.toggle('active', this.prefs.dark_mode);
    modal.querySelector('.toggle-dyslexia')?.classList.toggle('active', this.prefs.dyslexic_font);
    modal.querySelector('.toggle-narration')?.classList.toggle('active', this.prefs.narration);
    modal.querySelector('.toggle-reduced-motion')?.classList.toggle('active', this.prefs.reduced_motion);
    modal.querySelector('.toggle-2d-mode')?.classList.toggle('active', this.prefs.mode_2d);

    // Font buttons
    modal.querySelectorAll('.a11y-font-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    modal.querySelector(`.font-btn-${this.prefs.font_size}`)?.classList.add('active');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  toggleModal() {
    const backdrop = document.querySelector('.a11y-modal-backdrop');
    if (backdrop.classList.contains('active')) {
      this.closeModal();
    } else {
      backdrop.classList.add('active');
      this.updateModalUI();
      backdrop.querySelector('.a11y-close-btn').focus();
    }
  }

  closeModal() {
    const backdrop = document.querySelector('.a11y-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('active');
      document.querySelector('.a11y-launcher-btn')?.focus();
    }
  }
}

// Global Export
window.a11y = new AccessibilityManager();
document.addEventListener('DOMContentLoaded', () => window.a11y.init());
