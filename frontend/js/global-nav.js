/**
 * AccessibleVerse — Global Navigation, Search & In-App Notification Center
 * Provides Ctrl+K unified search, notification drawer, role switcher, and companion dock.
 */

class GlobalNavManager {
  constructor() {
    this.searchModal = null;
    this.notificationDrawer = null;
    this.recentSearches = [];
  }

  init() {
    this.injectNavElements();
    this.setupKeyboardShortcuts();
    this.loadNotifications();
  }

  injectNavElements() {
    // 1. Add Search and Notification Bell to nav-actions if present
    const navActions = document.querySelector('.nav-actions');
    if (navActions && !document.getElementById('nav-global-search-btn')) {
      const searchBtn = document.createElement('button');
      searchBtn.id = 'nav-global-search-btn';
      searchBtn.className = 'btn btn-sm btn-secondary';
      searchBtn.setAttribute('aria-label', 'Open Global Search (Ctrl + K)');
      searchBtn.title = 'Search lessons, games, videos (Ctrl + K)';
      searchBtn.innerHTML = `<i data-lucide="search"></i> <span class="search-shortcut" style="font-size: 0.72rem; opacity: 0.8; margin-left: 0.2rem; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">Ctrl K</span>`;
      searchBtn.onclick = () => this.openSearch();
      navActions.prepend(searchBtn);

      // Notification Center Bell
      const notifBtn = document.createElement('button');
      notifBtn.id = 'nav-notif-btn';
      notifBtn.className = 'btn btn-sm btn-secondary';
      notifBtn.setAttribute('aria-label', 'View Notifications');
      notifBtn.style.position = 'relative';
      notifBtn.innerHTML = `
        <i data-lucide="bell"></i>
        <span id="notif-badge-count" style="position: absolute; top: -4px; right: -4px; background: #ef4444; color: white; font-size: 0.65rem; font-weight: 800; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;">2</span>
      `;
      notifBtn.onclick = () => this.toggleNotifications();
      navActions.insertBefore(notifBtn, searchBtn.nextSibling);

      // PWA Install Button (hidden until prompt ready)
      const pwaBtn = document.createElement('button');
      pwaBtn.id = 'btn-pwa-install';
      pwaBtn.className = 'btn btn-sm btn-primary';
      pwaBtn.style.display = 'none';
      pwaBtn.innerHTML = `<i data-lucide="download"></i> <span>Install</span>`;
      navActions.appendChild(pwaBtn);

      if (window.lucide) window.lucide.createIcons();
    }

    this.createSearchModal();
    this.createNotificationDrawer();
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openSearch();
      }
      // Escape to close
      if (e.key === 'Escape') {
        this.closeSearch();
        this.closeNotifications();
      }
    });
  }

  createSearchModal() {
    if (document.getElementById('global-search-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'global-search-modal';
    modal.className = 'modal-backdrop';
    modal.style.cssText = `
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.78);
      backdrop-filter: blur(8px);
      z-index: 10000;
      align-items: flex-start;
      justify-content: center;
      padding-top: 10vh;
    `;

    modal.innerHTML = `
      <div class="card card-glass" style="width: 90%; max-width: 680px; max-height: 80vh; display: flex; flex-direction: column; padding: 1.5rem; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 20px 50px rgba(0,0,0,0.5);" role="dialog" aria-modal="true" aria-label="Global Search">
        <div style="display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.75rem;">
          <i data-lucide="search" style="color: var(--primary);"></i>
          <input type="text" id="global-search-input" placeholder="Search lessons, games, science, videos, stories, cyber (EN / ಕನ್ನಡ / हिंदी)..." style="flex: 1; background: transparent; border: none; outline: none; color: inherit; font-size: 1.1rem; font-family: inherit;">
          <button id="btn-close-search" class="btn btn-sm btn-secondary" style="padding: 0.25rem 0.6rem;">✕</button>
        </div>

        <!-- Filter Category Tabs -->
        <div style="display: flex; gap: 0.4rem; overflow-x: auto; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
          <button class="btn btn-sm btn-secondary search-filter-btn active" data-filter="all">All</button>
          <button class="btn btn-sm btn-secondary search-filter-btn" data-filter="language">Languages</button>
          <button class="btn btn-sm btn-secondary search-filter-btn" data-filter="mathematics">Math</button>
          <button class="btn btn-sm btn-secondary search-filter-btn" data-filter="science">Science</button>
          <button class="btn btn-sm btn-secondary search-filter-btn" data-filter="cybersecurity">Cyber</button>
          <button class="btn btn-sm btn-secondary search-filter-btn" data-filter="everyday">Life Skills</button>
          <button class="btn btn-sm btn-secondary search-filter-btn" data-filter="coding">Coding</button>
        </div>

        <!-- Search Results Stream -->
        <div id="search-results-container" style="flex: 1; overflow-y: auto; margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; max-height: 48vh;">
          <div style="text-align: center; padding: 2rem; color: #94a3b8;">
            <p>Type keywords to discover lessons, quizzes, 3D worlds, and activities.</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.searchModal = modal;

    // Attach listeners
    document.getElementById('btn-close-search').onclick = () => this.closeSearch();
    modal.onclick = (e) => {
      if (e.target === modal) this.closeSearch();
    };

    const input = document.getElementById('global-search-input');
    input.addEventListener('input', () => this.performSearch());

    // Filter pill clicks
    modal.querySelectorAll('.search-filter-btn').forEach((btn) => {
      btn.onclick = () => {
        modal.querySelectorAll('.search-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.performSearch();
      };
    });
  }

  createNotificationDrawer() {
    if (document.getElementById('notif-drawer')) return;

    const drawer = document.createElement('div');
    drawer.id = 'notif-drawer';
    drawer.style.cssText = `
      display: none;
      position: fixed;
      top: 65px;
      right: 1.5rem;
      width: 360px;
      max-width: 90vw;
      background: rgba(30, 41, 59, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.5);
      z-index: 9999;
      padding: 1.25rem;
      flex-direction: column;
      gap: 0.75rem;
    `;

    drawer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.6rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 0.4rem;">
          <i data-lucide="bell" style="width: 16px; height: 16px; color: var(--primary);"></i> In-App Notifications
        </h3>
        <button id="btn-close-notif" class="btn btn-sm btn-secondary" style="padding: 2px 8px;">✕</button>
      </div>

      <div id="notif-items-list" style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 320px; overflow-y: auto;">
        <!-- Notification Items populated dynamically -->
      </div>
    `;

    document.body.appendChild(drawer);
    this.notificationDrawer = drawer;

    document.getElementById('btn-close-notif').onclick = () => this.closeNotifications();
  }

  loadNotifications() {
    const list = document.getElementById('notif-items-list');
    if (!list) return;

    const notifs = [
      {
        id: 'n1',
        title: '🎯 Daily Missions Active',
        desc: 'Complete 1 lesson and explore an interactive island to earn +150 bonus XP today!',
        link: 'dashboard.html',
        time: 'Today'
      },
      {
        id: 'n2',
        title: '🚀 Science Explorer Island Unlocked',
        desc: 'New planets simulation, eco-plant growth lab, and physics experiments ready to explore.',
        link: 'games.html',
        time: 'Just now'
      },
      {
        id: 'n3',
        title: '🛡️ Cybersecurity Escape Room Challenge',
        desc: 'Can you crack all 4 security vaults and earn your Cyber Shield Guardian badge?',
        link: 'games.html',
        time: 'Recommended'
      }
    ];

    list.innerHTML = notifs.map(n => `
      <a href="${n.link}" class="card card-glass" style="padding: 0.75rem; text-decoration: none; display: block; border-radius: 8px; transition: transform 0.2s;" onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform='none'">
        <div style="font-weight: 700; font-size: 0.88rem; color: #f8fafc;">${n.title}</div>
        <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 0.2rem; line-height: 1.3;">${n.desc}</div>
        <div style="font-size: 0.7rem; color: var(--primary); margin-top: 0.4rem; font-weight: 600;">${n.time}</div>
      </a>
    `).join('');
  }

  openSearch() {
    if (!this.searchModal) this.createSearchModal();
    this.searchModal.style.display = 'flex';
    const input = document.getElementById('global-search-input');
    if (input) {
      input.focus();
      this.performSearch();
    }
  }

  closeSearch() {
    if (this.searchModal) this.searchModal.style.display = 'none';
  }

  toggleNotifications() {
    if (!this.notificationDrawer) this.createNotificationDrawer();
    const isShowing = this.notificationDrawer.style.display === 'flex';
    this.notificationDrawer.style.display = isShowing ? 'none' : 'flex';
  }

  closeNotifications() {
    if (this.notificationDrawer) this.notificationDrawer.style.display = 'none';
  }

  performSearch() {
    const query = (document.getElementById('global-search-input')?.value || '').trim().toLowerCase();
    const activeFilterBtn = document.querySelector('.search-filter-btn.active');
    const filter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
    const container = document.getElementById('search-results-container');
    if (!container) return;

    // Search Corpus across all content
    const items = [
      { title: "ಕನ್ನಡ ವರ್ಣಮಾಲೆ - ಸ್ವರಗಳು (Kannada Vowels)", type: "Lesson", category: "language", lang: "kn", link: "lessons.html#kn-varnamale-1", desc: "Learn 14 Swaragalu with audio pronunciation." },
      { title: "ಕನ್ನಡ ವರ್ಣಮಾಲೆ - ವ್ಯಂಜನಗಳು (Consonants)", type: "Lesson", category: "language", lang: "kn", link: "lessons.html#kn-vyanjana-1", desc: "Learn 34 Vyanjangalu with word associations." },
      { title: "हिंदी वर्णमाला - स्वर और व्यंजन (Hindi Alphabet)", type: "Lesson", category: "language", lang: "hi", link: "lessons.html#hi-varnamala-1", desc: "Devanagari vowels and consonants with picture examples." },
      { title: "English Phonics & Alphabet Discovery A to Z", type: "Lesson", category: "language", lang: "en", link: "lessons.html#en-alphabet-phonics", desc: "Phonetic letter sounds and uppercase/lowercase pairs." },
      { title: "Numbers 1 to 100 & Place Value Counting", type: "Lesson", category: "mathematics", lang: "en", link: "lessons.html#math-numbers-100", desc: "Tens, units, and even/odd pattern exploration." },
      { title: "Multiplication Tables 1 to 20 Mastery", type: "Lesson", category: "mathematics", lang: "en", link: "lessons.html#math-multiplication-tables", desc: "Speed tricks and flash drill cards 1 to 20." },
      { title: "Cosmic Explorer: Planets & Solar System", type: "Science Lab", category: "science", lang: "en", link: "science.html", desc: "Interactive 3D planets, scale simulation, and moon orbits." },
      { title: "Living Ecosystems & Plant Photosynthesis", type: "Science Lab", category: "science", lang: "en", link: "science.html#ecosystem", desc: "Interactive plant water cycle and sunlight generator." },
      { title: "Cyber Shield: Passwords & Safe Browsing", type: "Escape Room", category: "cybersecurity", lang: "en", link: "cybersecurity.html", desc: "Solve phishing clues and crack the password vaults." },
      { title: "Indian Rupee (₹) Money & Grocery Shopping", type: "Life Skills", category: "everyday", lang: "en", link: "life-skills.html#money", desc: "Count coins, notes, and calculate shopping change." },
      { title: "Clock Reading & Daily Routine Scheduling", type: "Life Skills", category: "everyday", lang: "en", link: "life-skills.html#clock", desc: "Interactive analog clock hands and hour matching." },
      { title: "Interactive Coding Playground (HTML, CSS, JS, Python)", type: "Coding", category: "coding", lang: "en", link: "coding.html", desc: "Live code editor with instant preview and safe execution." },
      { title: "Interactive Branching Stories: Road Safety & Valley", type: "Story", category: "everyday", lang: "en", link: "stories.html", desc: "Choose your own adventure stories with audio narration." },
      { title: "3D Interactive Universe (6 Explorable Islands)", type: "3D World", category: "all", lang: "en", link: "games.html#metaverse-section", desc: "Math, Science, Language, Tech, Cyber, and Life islands." },
      { title: "3D Knowledge Runner Game", type: "Game", category: "all", lang: "en", link: "games.html#game-knowledge-runner", desc: "Answer questions on the run and collect coins." },
      { title: "Traffic Safety & Pedestrian Crossing", type: "Lesson", category: "everyday", lang: "en", link: "lessons.html#life-traffic-safety", desc: "Red, yellow, green signals and zebra crossing safety." },
      { title: "Personal Hygiene & Daily Routine", type: "Lesson", category: "everyday", lang: "en", link: "lessons.html#life-hygiene-habits", desc: "Dental care, 20-second hand washing, and healthy habits." }
    ];

    const filtered = items.filter((item) => {
      const matchCat = (filter === 'all') || (item.category === filter);
      if (!matchCat) return false;
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)
      );
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #94a3b8;">
          <p>No results found for "<strong>${query}</strong>" in ${filter.toUpperCase()}.</p>
          <p style="font-size: 0.85rem; margin-top: 0.4rem;">Try searching for <em>planets, kannada, multiplication, money,</em> or <em>passwords</em>.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((item) => `
      <a href="${item.link}" class="card card-glass" style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1.25rem; text-decoration: none; border-radius: 8px; transition: background 0.15s;" onmouseover="this.style.background='rgba(255,255,255,0.08)'" onmouseout="this.style.background=''">
        <div>
          <div style="font-weight: 700; color: #f8fafc; font-size: 0.95rem;">${item.title}</div>
          <div style="font-size: 0.82rem; color: #94a3b8; margin-top: 0.2rem;">${item.desc}</div>
        </div>
        <div style="display: flex; gap: 0.4rem; align-items: center;">
          <span class="badge badge-secondary" style="font-size: 0.72rem;">${item.type}</span>
          <span class="badge badge-primary" style="font-size: 0.72rem; text-transform: uppercase;">${item.lang}</span>
        </div>
      </a>
    `).join('');
  }
}

// Global Nav Instance
window.globalNav = new GlobalNavManager();
document.addEventListener('DOMContentLoaded', () => {
  window.globalNav.init();
});
