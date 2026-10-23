/**
 * AccessibleVerse — Global Application Core
 * Shared UI helpers, navigation state, toast system, and fallback curriculum.
 */

// Global Toast System
window.showToast = function(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');

  let iconName = 'info';
  if (type === 'success') iconName = 'check-circle-2';
  if (type === 'error') iconName = 'alert-triangle';
  if (type === 'warning') iconName = 'alert-circle';

  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// Application Bootstrapper
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Setup Mobile Navigation Toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // 3. Highlight Current Active Nav Link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 4. Update Navbar Authentication State
  updateNavbarAuth();

  // 5. Setup Narration Badges & Click-to-Speak
  document.addEventListener('click', (e) => {
    const speakEl = e.target.closest('[data-speak]');
    if (speakEl) {
      const text = speakEl.getAttribute('data-speak') || speakEl.textContent;
      const lang = speakEl.getAttribute('data-lang') || (window.lang ? window.lang.getCurrentLanguage() : 'en');
      if (window.lang && text) {
        window.lang.speakText(text, lang);
      }
    }
  });
});

// Update navbar with user login status or "Sign In"
function updateNavbarAuth() {
  const authContainer = document.querySelector('.nav-auth-slot');
  if (!authContainer) return;

  const user = window.api ? window.api.getCachedUser() : null;

  if (user) {
    authContainer.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <a href="dashboard.html" class="btn btn-secondary btn-sm" title="Go to Dashboard">
          <i data-lucide="layout-dashboard"></i>
          <span>${user.full_name || user.username}</span>
          <span class="badge badge-primary" style="margin-left: 0.3rem;">⚡ ${user.xp || 0} XP</span>
        </a>
        <button onclick="handleLogout()" class="btn btn-secondary btn-sm btn-icon" title="Log Out" aria-label="Log Out">
          <i data-lucide="log-out"></i>
        </button>
      </div>
    `;
  } else {
    authContainer.innerHTML = `
      <a href="login.html" class="btn btn-secondary btn-sm" data-i18n="nav_login">Sign In</a>
      <a href="register.html" class="btn btn-primary btn-sm" data-i18n="nav_register">Join Free</a>
    `;
  }

  if (window.lucide) window.lucide.createIcons();
}

// Global Logout Handler
window.handleLogout = async function() {
  if (window.api) {
    await window.api.auth.logout();
  }
  window.showToast("You have been signed out.", "info");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 500);
};

// Fallback Educational Curriculum & Videos for seamless client operation
window.FALLBACK_VIDEOS = [
  { id: "vid_01", youtube_id: "x6D51-pz2A4", title: "Kannada Varnamale for Beginners - Swaragalu & Vyanjangalu", category: "language", language: "kn", level: "beginner", duration: "12:45", description: "Learn basic Kannada alphabets, proper pronunciation, and writing strokes for vowels and consonants.", thumbnail: "https://img.youtube.com/vi/x6D51-pz2A4/hqdefault.jpg" },
  { id: "vid_02", youtube_id: "D0Ajq682yrA", title: "Hindi Varnamala - Swar aur Vyanjan with Pictures", category: "language", language: "hi", level: "beginner", duration: "10:15", description: "Visual Hindi alphabet learning guide with phonetic sounds, pronunciation tips, and everyday examples.", thumbnail: "https://img.youtube.com/vi/D0Ajq682yrA/hqdefault.jpg" },
  { id: "vid_03", youtube_id: "p-kAI-qOeJA", title: "English Phonics and Alphabet Adventure A to Z", category: "language", language: "en", level: "beginner", duration: "14:20", description: "Master English letter sounds, phonics blending, uppercase, and lowercase letter recognition.", thumbnail: "https://img.youtube.com/vi/p-kAI-qOeJA/hqdefault.jpg" },
  { id: "vid_04", youtube_id: "ccEpTTZW34g", title: "Numbers 1 to 100 & Counting with Fun Visuals", category: "mathematics", language: "en", level: "beginner", duration: "15:30", description: "Learn numbers 1 to 100, place value concepts, counting blocks, and number identification games.", thumbnail: "https://img.youtube.com/vi/ccEpTTZW34g/hqdefault.jpg" },
  { id: "vid_05", youtube_id: "4YzNB9DNmoI", title: "Multiplication Tables 1 to 20 Made Super Easy", category: "mathematics", language: "en", level: "intermediate", duration: "18:05", description: "Speed tricks, memory songs, and visual patterns to memorize multiplication tables effortlessly.", thumbnail: "https://img.youtube.com/vi/4YzNB9DNmoI/hqdefault.jpg" },
  { id: "vid_06", youtube_id: "XRW67ZxPGk8", title: "Traffic Signals, Road Safety & Pedestrian Crossing", category: "everyday", language: "en", level: "beginner", duration: "09:40", description: "Understanding red, yellow, and green traffic lights, zebra crossings, and essential road safety rules.", thumbnail: "https://img.youtube.com/vi/XRW67ZxPGk8/hqdefault.jpg" },
  { id: "vid_07", youtube_id: "FnW0TqxhJik", title: "Daily Hygiene, Healthy Habits & Morning Routines", category: "everyday", language: "en", level: "beginner", duration: "08:15", description: "Step-by-step hand washing, dental care, dressing up, and developing positive daily routines.", thumbnail: "https://img.youtube.com/vi/FnW0TqxhJik/hqdefault.jpg" },
  { id: "vid_08", youtube_id: "KaBYEZ6q2tY", title: "Emotions, Communication & Social Interactions", category: "everyday", language: "en", level: "intermediate", duration: "11:50", description: "Recognizing feelings, building empathy, respectful conversations, and expressing needs clearly.", thumbnail: "https://img.youtube.com/vi/KaBYEZ6q2tY/hqdefault.jpg" },
  { id: "vid_09", youtube_id: "NUMz00m8ySk", title: "Computer Basics, Mouse, Keyboard & Internet Safety", category: "technology", language: "en", level: "beginner", duration: "13:10", description: "Parts of a computer, staying safe on the web, password hygiene, and cyber awareness.", thumbnail: "https://img.youtube.com/vi/NUMz00m8ySk/hqdefault.jpg" },
  { id: "vid_10", youtube_id: "xPq1KrYWbqo", title: "Coding for Kids: HTML, CSS & JavaScript Fundamentals", category: "technology", language: "en", level: "intermediate", duration: "16:45", description: "Create your first interactive web page with tags, colors, animations, and friendly logic.", thumbnail: "https://img.youtube.com/vi/xPq1KrYWbqo/hqdefault.jpg" }
];

window.FALLBACK_LESSONS = [
  {
    id: "kn-varnamale-1",
    title: "ಕನ್ನಡ ವರ್ಣಮಾಲೆ - ಸ್ವರಗಳು (Kannada Vowels)",
    subject: "kannada",
    level: "beginner",
    icon: "book-open",
    description: "Learn the 14 Kannada Swaragalu (ಅ to ಅಃ) with audio pronunciation and word associations.",
    xp: 50,
    content: {
      vowels: [
        { letter: "ಅ", trans: "a", word: "ಅಮ್ಮ (Amma - Mother)" },
        { letter: "ಆ", trans: "aa", word: "ಆನೆ (Aane - Elephant)" },
        { letter: "ಇ", trans: "i", word: "ಇಲಿ (Ili - Rat)" },
        { letter: "ಈ", trans: "ee", word: "ಈಜು (Eeju - Swim)" },
        { letter: "ಉ", trans: "u", word: "ಉಡುಗೊರೆ (Udugore - Gift)" },
        { letter: "ಊ", trans: "oo", word: "ಊಟ (Oota - Meal)" },
        { letter: "ಋ", trans: "ru", word: "ಋಷಿ (Rushi - Sage)" },
        { letter: "ಎ", trans: "e", word: "ಎಲೆ (Ele - Leaf)" },
        { letter: "ಏ", trans: "ee", word: "ಏಣಿ (Eeni - Ladder)" },
        { letter: "ಐ", trans: "ai", word: "ಐದು (Aidu - Five)" },
        { letter: "ಒ", trans: "o", word: "ಒಂಟೆ (Onte - Camel)" },
        { letter: "ಓ", trans: "oo", word: "ಓಲೆ (Oole - Earring)" },
        { letter: "ಔ", trans: "au", word: "ಔಷಧ (Aushadha - Medicine)" },
        { letter: "ಅಂ", trans: "am", word: "ಅಂಗಡಿ (Angadi - Shop)" },
        { letter: "ಅಃ", trans: "aha", word: "ವಿಸರ್ಗ (Visarga)" }
      ]
    }
  },
  {
    id: "kn-vyanjana-1",
    title: "ಕನ್ನಡ ವರ್ಣಮಾಲೆ - ವ್ಯಂಜನಗಳು (Kannada Consonants)",
    subject: "kannada",
    level: "intermediate",
    icon: "book-open",
    description: "Learn all 34 Kannada Vyanjangalu (ಕ to ಳ) organized by vargas and avargiya vyanjana with audio.",
    xp: 60,
    content: {
      consonants: [
        { letter: "ಕ", trans: "ka", word: "ಕಮಲ (Kamala - Lotus)" },
        { letter: "ಖ", trans: "kha", word: "ಖಡ್ಗ (Khadga - Sword)" },
        { letter: "ಗ", trans: "ga", word: "ಗಣೇಶ (Ganesha - Deity)" },
        { letter: "ಘ", trans: "gha", word: "ಘಂಟೆ (Ghante - Bell)" },
        { letter: "ಙ", trans: "nga", word: "ಙ (Nga)" },
        { letter: "ಚ", trans: "cha", word: "ಚಮಚ (Chamacha - Spoon)" },
        { letter: "ಛ", trans: "chha", word: "ಛತ್ರಿ (Chhatri - Umbrella)" },
        { letter: "ಜ", trans: "ja", word: "ಜಲ (Jala - Water)" },
        { letter: "ಝ", trans: "jha", word: "ಝರಿ (Jhari - Stream)" },
        { letter: "ಞ", trans: "nya", word: "ಞ (Nya)" },
        { letter: "ಟ", trans: "ta", word: "ಟೊಮೆಟೊ (Tomato)" },
        { letter: "ಠ", trans: "tha", word: "ಠಸ್ಸೆ (Thasse - Stamp)" },
        { letter: "ಡ", trans: "da", word: "ಡಮರು (Damaru - Drum)" },
        { letter: "ಢ", trans: "dha", word: "ಢಕ್ಕೆ (Dhakke - Big Drum)" },
        { letter: "ಣ", trans: "na", word: "ವೀಣೆ (Veene - Lute)" },
        { letter: "ತ", trans: "ta", word: "ತರಕಾರಿ (Tarakari - Vegetables)" },
        { letter: "ಥ", trans: "tha", word: "ಥಳಥಳ (Thalathala - Sparkle)" },
        { letter: "ದ", trans: "da", word: "ದೀಪ (Deepa - Lamp)" },
        { letter: "ಧ", trans: "dha", word: "ಧನುಸ್ಸು (Dhanussu - Bow)" },
        { letter: "ನ", trans: "na", word: "ನವಿಲು (Navilu - Peacock)" },
        { letter: "ಪ", trans: "pa", word: "ಪಾರಿವಾಳ (Parivala - Pigeon)" },
        { letter: "ಫ", trans: "pha", word: "ಫಲ (Phala - Fruit)" },
        { letter: "ಬ", trans: "ba", word: "ಬಾಳೆಹಣ್ಣು (Balehannu - Banana)" },
        { letter: "ಭ", trans: "bha", word: "ಭಾರತ (Bharatha - India)" },
        { letter: "ಮ", trans: "ma", word: "ಮರ (Mara - Tree)" },
        { letter: "ಯ", trans: "ya", word: "ಯಜ್ಞ (Yajna - Fire ritual)" },
        { letter: "ರ", trans: "ra", word: "ರೈಲು (Railu - Train)" },
        { letter: "ಲ", trans: "la", word: "ಲಡ್ಡು (Laddu - Sweet)" },
        { letter: "ವ", trans: "va", word: "ವನ (Vana - Forest)" },
        { letter: "ಶ", trans: "sha", word: "ಶಂಖ (Shankha - Conch)" },
        { letter: "ಷ", trans: "sha", word: "ಷಟ್ಕೋನ (Shatkona - Hexagon)" },
        { letter: "ಸ", trans: "sa", word: "ಸೂರ್ಯ (Surya - Sun)" },
        { letter: "ಹ", trans: "ha", word: "ಹೂವು (Hoovu - Flower)" },
        { letter: "ಳ", trans: "la", word: "ಕಿಳಿ (Kili - Parrot)" }
      ]
    }
  },
  {
    id: "hi-varnamala-1",
    title: "हिंदी वर्णमाला - स्वर और व्यंजन (Hindi Alphabet)",
    subject: "hindi",
    level: "beginner",
    icon: "languages",
    description: "Master all Devanagari vowels (स्वर) and consonants (व्यंजन) with audio guide and picture examples.",
    xp: 50,
    content: {
      vowels: [
        { letter: "अ", trans: "a", word: "अनार (Pomegranate)" },
        { letter: "आ", trans: "aa", word: "आम (Mango)" },
        { letter: "इ", trans: "i", word: "इमली (Tamarind)" },
        { letter: "ई", trans: "ee", word: "ईख (Sugarcane)" },
        { letter: "उ", trans: "u", word: "उल्लू (Owl)" },
        { letter: "ऊ", trans: "oo", word: "ऊन (Wool)" },
        { letter: "ऋ", trans: "ri", word: "ऋषि (Sage)" },
        { letter: "ए", trans: "e", word: "एक (One)" },
        { letter: "ऐ", trans: "ai", word: "ऐनक (Glasses)" },
        { letter: "ओ", trans: "o", word: "ओखली (Mortar)" },
        { letter: "औ", trans: "au", word: "औरत (Woman)" },
        { letter: "अं", trans: "am", word: "अंगूर (Grapes)" },
        { letter: "अः", trans: "ah", word: "प्रातः (Morning)" }
      ],
      consonants: [
        { letter: "क", trans: "ka", word: "कमल (Lotus)" },
        { letter: "ख", trans: "kha", word: "खरगोश (Rabbit)" },
        { letter: "ग", trans: "ga", word: "गमला (Pot)" },
        { letter: "घ", trans: "gha", word: "घर (House)" },
        { letter: "ङ", trans: "nga", word: "अंग (Limb)" },
        { letter: "च", trans: "cha", word: "चम्मच (Spoon)" },
        { letter: "छ", trans: "chha", word: "छतरी (Umbrella)" },
        { letter: "ज", trans: "ja", word: "जहाज (Ship)" },
        { letter: "झ", trans: "jha", word: "झंडा (Flag)" },
        { letter: "ञ", trans: "nya", word: "चंचल (Playful)" },
        { letter: "ट", trans: "ta", word: "टमाटर (Tomato)" },
        { letter: "ठ", trans: "tha", word: "ठठेरा (Tinsmith)" },
        { letter: "ड", trans: "da", word: "डमरू (Drum)" },
        { letter: "ढ", trans: "dha", word: "ढक्कन (Lid)" },
        { letter: "ण", trans: "na", word: "बाण (Arrow)" },
        { letter: "त", trans: "ta", word: "तरबूज (Watermelon)" },
        { letter: "थ", trans: "tha", word: "थर्मस (Flask)" },
        { letter: "द", trans: "da", word: "दवात (Inkpot)" },
        { letter: "ध", trans: "dha", word: "धनुष (Bow)" },
        { letter: "न", trans: "na", word: "नल (Tap)" },
        { letter: "प", trans: "pa", word: "पतंग (Kite)" },
        { letter: "फ", trans: "pha", word: "फल (Fruit)" },
        { letter: "ब", trans: "ba", word: "बत्तख (Duck)" },
        { letter: "भ", trans: "bha", word: "भालू (Bear)" },
        { letter: "म", trans: "ma", word: "मछली (Fish)" },
        { letter: "य", trans: "ya", word: "यज्ञ (Sacrifice)" },
        { letter: "र", trans: "ra", word: "रथ (Chariot)" },
        { letter: "ल", trans: "la", word: "लट्टू (Top)" },
        { letter: "व", trans: "va", word: "वक (Heron)" },
        { letter: "श", trans: "sha", word: "शलजम (Turnip)" },
        { letter: "ष", trans: "sha", word: "षटकोण (Hexagon)" },
        { letter: "स", trans: "sa", word: "सपेरा (Snake Charmer)" },
        { letter: "ह", trans: "ha", word: "हाथी (Elephant)" },
        { letter: "क्ष", trans: "ksha", word: "क्षत्रिय (Warrior)" },
        { letter: "त्र", trans: "tra", word: "त्रिशूल (Trident)" },
        { letter: "ज्ञ", trans: "gya", word: "ज्ञानी (Wise person)" }
      ]
    }
  },
  {
    id: "en-alphabet-phonics",
    title: "English Phonics & Word Discovery A to Z",
    subject: "english",
    level: "beginner",
    icon: "type",
    description: "Learn all 26 English letters A to Z, upper and lowercase pairs, phonetic sounds, and everyday vocabulary.",
    xp: 50,
    content: {
      letters: [
        { upper: "A", lower: "a", sound: "/æ/ as in Apple", word: "Apple" },
        { upper: "B", lower: "b", sound: "/b/ as in Ball", word: "Ball" },
        { upper: "C", lower: "c", sound: "/k/ as in Cat", word: "Cat" },
        { upper: "D", lower: "d", sound: "/d/ as in Dog", word: "Dog" },
        { upper: "E", lower: "e", sound: "/e/ as in Elephant", word: "Elephant" },
        { upper: "F", lower: "f", sound: "/f/ as in Fish", word: "Fish" },
        { upper: "G", lower: "g", sound: "/ɡ/ as in Giraffe", word: "Giraffe" },
        { upper: "H", lower: "h", sound: "/h/ as in House", word: "House" },
        { upper: "I", lower: "i", sound: "/aɪ/ as in Ice cream", word: "Ice cream" },
        { upper: "J", lower: "j", sound: "/dʒ/ as in Jug", word: "Jug" },
        { upper: "K", lower: "k", sound: "/k/ as in Kite", word: "Kite" },
        { upper: "L", lower: "l", sound: "/l/ as in Lion", word: "Lion" },
        { upper: "M", lower: "m", sound: "/m/ as in Monkey", word: "Monkey" },
        { upper: "N", lower: "n", sound: "/n/ as in Nest", word: "Nest" },
        { upper: "O", lower: "o", sound: "/ɒ/ as in Orange", word: "Orange" },
        { upper: "P", lower: "p", sound: "/p/ as in Parrot", word: "Parrot" },
        { upper: "Q", lower: "q", sound: "/kw/ as in Queen", word: "Queen" },
        { upper: "R", lower: "r", sound: "/r/ as in Rabbit", word: "Rabbit" },
        { upper: "S", lower: "s", sound: "/s/ as in Sun", word: "Sun" },
        { upper: "T", lower: "t", sound: "/t/ as in Tiger", word: "Tiger" },
        { upper: "U", lower: "u", sound: "/ʌ/ as in Umbrella", word: "Umbrella" },
        { upper: "V", lower: "v", sound: "/v/ as in Van", word: "Van" },
        { upper: "W", lower: "w", sound: "/w/ as in Watch", word: "Watch" },
        { upper: "X", lower: "x", sound: "/z/ as in Xylophone", word: "Xylophone" },
        { upper: "Y", lower: "y", sound: "/j/ as in Yak", word: "Yak" },
        { upper: "Z", lower: "z", sound: "/z/ as in Zebra", word: "Zebra" }
      ]
    }
  },
  {
    id: "math-numbers-100",
    title: "Numbers 1 to 100 & Counting Patterns",
    subject: "mathematics",
    level: "beginner",
    icon: "calculator",
    description: "Explore 1 to 100 counting grid, tens and units, even and odd numbers with interactive counters.",
    xp: 50
  },
  {
    id: "math-multiplication-tables",
    title: "Multiplication Tables 1 to 20 Mastery",
    subject: "mathematics",
    level: "intermediate",
    icon: "hash",
    description: "Master multiplication tables from 1 to 20 with interactive drill cards, audio spoken tables, and patterns.",
    xp: 75
  },
  {
    id: "life-traffic-safety",
    title: "Traffic Signals, Road Safety & Safe Crossing",
    subject: "everyday",
    level: "beginner",
    icon: "shield-check",
    description: "Learn the 3 traffic light signals, zebra crossing etiquette, pedestrian guidelines, and key signs.",
    xp: 60
  },
  {
    id: "life-hygiene-habits",
    title: "Personal Hygiene, Daily Routine & Health",
    subject: "everyday",
    level: "beginner",
    icon: "sparkles",
    description: "Daily grooming habits: brush twice daily, 20-second hand washing, nutritious meals, and rest.",
    xp: 50
  },
  {
    id: "cs-coding-intro",
    title: "Computer Basics & First Steps in Coding",
    subject: "technology",
    level: "beginner",
    icon: "code",
    description: "Discover computer parts, safe internet habits, and write your first HTML and Python code snippets.",
    xp: 80
  }
];
