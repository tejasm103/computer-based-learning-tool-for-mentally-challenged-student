/**
 * AccessibleVerse — Multilingual Language Engine
 * Supports Kannada, Hindi, and English with UI translation and Web Speech API narration.
 */

const TRANSLATIONS = {
  en: {
    // Navigation
    nav_home: "Home",
    nav_lessons: "Lessons",
    nav_games: "3D Games",
    nav_videos: "Video Library",
    nav_dashboard: "Dashboard",
    nav_login: "Sign In",
    nav_register: "Join Free",
    nav_logout: "Log Out",
    nav_profile: "My Profile",

    // Hero Section
    hero_badge: "✨ Learn Without Limits — Accessible to All",
    hero_title: "Explore, Learn & Play in an Interactive 3D World",
    hero_subtitle: "A competition-quality multilingual educational metaverse designed for students of every ability. Master Kannada, Hindi, English, Mathematics, Road Safety, and Coding.",
    hero_cta_start: "Start Learning Free",
    hero_cta_games: "Play 3D Games",
    hero_feature_trilingual: "Trilingual: Kannada, Hindi & English",
    hero_feature_accessible: "WCAG 2.2 AA Accessible & Screen-Reader Ready",
    hero_feature_3d: "Genuine 3D World with 2D Low-Power Mode",

    // 3D Controls
    world_hint_orbit: "Drag to rotate view | Scroll to zoom",
    world_mode_2d: "Switch to 2D Mode",
    world_mode_3d: "Switch to 3D World",

    // Sections
    sec_features_title: "Empowering Every Learner",
    sec_features_subtitle: "Built with Universal Design for Learning (UDL) principles so nobody is left behind.",
    sec_curriculum_title: "Multilingual & Everyday Curriculum",
    sec_curriculum_subtitle: "From foundational alphabets to daily life skills and future-ready technology.",

    // Language Cards
    cur_kannada_title: "ಕನ್ನಡ (Kannada)",
    cur_kannada_desc: "Master Kannada Varnamale — 14 Swaragalu, 34 Vyanjangalu, letter tracing, and authentic pronunciation.",
    cur_hindi_title: "हिंदी (Hindi)",
    cur_hindi_desc: "Learn Hindi Varnamala — Swar, Vyanjan, matras, phonetics, and everyday Hindi vocabulary.",
    cur_english_title: "English Phonics",
    cur_english_desc: "A–Z uppercase & lowercase, phonics blending, spelling exploration, and reading comprehension.",
    cur_math_title: "Mathematics & Numbers",
    cur_math_desc: "Counting 1–100, arithmetic (+, -, *, /), Multiplication tables 1 to 20, shapes, and currency.",
    cur_safety_title: "Everyday Road Safety",
    cur_safety_desc: "Traffic lights (Red, Yellow, Green), zebra crossing etiquette, and road pedestrian signs.",
    cur_coding_title: "Computer & Cyber Basics",
    cur_coding_desc: "Safe web surfing, digital hygiene, and interactive beginner coding with HTML & Python.",

    // Accessibility Panel
    a11y_title: "Accessibility Preferences",
    a11y_high_contrast: "High Contrast (AAA)",
    a11y_high_contrast_desc: "Pure black & vivid yellow outlines for visual clarity",
    a11y_dark_mode: "Dark Theme",
    a11y_dark_mode_desc: "Reduces eye strain with sleek dark surfaces",
    a11y_dyslexia: "Dyslexia-Friendly Font",
    a11y_dyslexia_desc: "Uses weighted baseline typography (Lexend)",
    a11y_font_size: "Text Scaling",
    a11y_narration: "Read Aloud (TTS)",
    a11y_narration_desc: "Spoken narration for texts, questions, and guides",
    a11y_reduced_motion: "Reduce Motion",
    a11y_reduced_motion_desc: "Minimizes animations, shakes, and rapid transitions",
    a11y_2d_mode: "Simplified 2D Graphics",
    a11y_2d_mode_desc: "Replaces 3D WebGL scenes with lightweight 2D canvas",

    // Common Buttons
    btn_listen: "Listen",
    btn_complete: "Mark Completed",
    btn_play: "Play Game",
    btn_watch: "Watch Video",
    btn_submit: "Submit Answer",
    btn_next: "Next",
    btn_prev: "Previous"
  },

  kn: {
    // Navigation
    nav_home: "ಮುಖಪುಟ",
    nav_lessons: "ಪಾಠಗಳು",
    nav_games: "೩ಡಿ ಆಟಗಳು",
    nav_videos: "ವೀಡಿಯೊ ಗ್ರಂಥಾಲಯ",
    nav_dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    nav_login: "ಲಾಗಿನ್",
    nav_register: "ಖಾತೆ ತೆರೆಯಿರಿ",
    nav_logout: "ಲಾಗ್ ಔಟ್",
    nav_profile: "ನನ್ನ ಪ್ರೊಫೈಲ್",

    // Hero Section
    hero_badge: "✨ ಎಲ್ಲರಿಗೂ ಸಮಾನ ಶಿಕ್ಷಣ — ಯಾವುದೇ ಮಿತಿಯಿಲ್ಲದೆ ಕಲಿಯಿರಿ",
    hero_title: "೩ಡಿ ಕಲಿಕಾ ಜಗತ್ತಿನಲ್ಲಿ ಅನ್ವೇಷಿಸಿ, ಕಲಿಯಿರಿ ಮತ್ತು ಆನಂದಿಸಿ",
    hero_subtitle: "ಕನ್ನಡ, ಹಿಂದಿ, ಇಂಗ್ಲಿಷ್, ಗಣಿತ, ರಸ್ತೆ ಸುರಕ್ಷತೆ ಮತ್ತು ಕಂಪ್ಯೂಟರ್ ಶಿಕ್ಷಣವನ್ನು ಸುಲಭವಾಗಿ ಕಲಿಯಲು ವಿಶೇಷವಾಗಿ ರೂಪಿಸಲಾದ ತಾಣ.",
    hero_cta_start: "ಉಚಿತವಾಗಿ ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ",
    hero_cta_games: "೩ಡಿ ಆಟಗಳನ್ನು ಆಡಿ",
    hero_feature_trilingual: "ತ್ರಿಭಾಷಾ ಶಿಕ್ಷಣ: ಕನ್ನಡ, ಹಿಂದಿ ಮತ್ತು ಇಂಗ್ಲಿಷ್",
    hero_feature_accessible: "ವಿಶೇಷ ಚೇತನ ಸ್ನೇಹಿ (WCAG 2.2 AA ಮಾನದಂಡ)",
    hero_feature_3d: "ನೈಜ ೩ಡಿ ಜಗತ್ತು ಮತ್ತು ಸರಳ ೨ಡಿ ಮೋಡ್",

    // 3D Controls
    world_hint_orbit: "ನೋಟ ತಿರುಗಿಸಲು ಎಳೆಯಿರಿ | ಜೂಮ್ ಮಾಡಲು ಸ್ಕ್ರಾಲ್ ಮಾಡಿ",
    world_mode_2d: "೨ಡಿ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಿ",
    world_mode_3d: "೩ಡಿ ಜಗತ್ತಿಗೆ ಬದಲಾಯಿಸಿ",

    // Sections
    sec_features_title: "ಪ್ರತಿಯೊಬ್ಬ ವಿದ್ಯಾರ್ಥಿಯ ಸಶಕ್ತೀಕರಣ",
    sec_features_subtitle: "ಎಲ್ಲಾ ಸಾಮರ್ಥ್ಯದ ಕಲಿಯುವವರಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.",
    sec_curriculum_title: "ಭಾಷೆ ಮತ್ತು ಜೀವನ ಕೌಶಲ್ಯ ಪಠ್ಯಕ್ರಮ",
    sec_curriculum_subtitle: "ವರ್ಣಮಾಲೆಯಿಂದ ಹಿಡಿದು ದಿನನಿತ್ಯದ ಸುರಕ್ಷತೆ ಮತ್ತು ಕೋಡಿಂಗ್ ವರೆಗೆ.",

    // Language Cards
    cur_kannada_title: "ಕನ್ನಡ ವರ್ಣಮಾಲೆ",
    cur_kannada_desc: "೧೪ ಸ್ವರಗಳು (ಅ ಇಂದ ಅಃ), ೩೪ ವ್ಯಂಜನಗಳು (ಕ ಇಂದ ಳ), ಪದ ಪರಿಚಯ ಮತ್ತು ಸರಿಯಾದ ಉಚ್ಚಾರಣೆ.",
    cur_hindi_title: "हिंदी वर्णमाला",
    cur_hindi_desc: "ಹಿಂದಿ ಸ್ವರ ಮತ್ತು ವ್ಯಂಜನಗಳು, ಶಬ್ದ ರಚನೆ ಮತ್ತು ಮಾತನಾಡುವ ಅಭ್ಯಾಸ.",
    cur_english_title: "ಇಂಗ್ಲಿಷ್ ಫೋನಿಕ್ಸ್",
    cur_english_desc: "A ಇಂದ Z ವರೆಗೆ ದೊಡ್ಡ ಮತ್ತು ಸಣ್ಣ ಅಕ್ಷರಗಳು, ಧ್ವನಿಗಳು ಮತ್ತು ಪದಗಳ ಬಳಕೆ.",
    cur_math_title: "ಗಣಿತ ಮತ್ತು ಸಂಖ್ಯೆಗಳು",
    cur_math_desc: "೧ ರಿಂದ ೧೦೦ ರವರೆಗೆ ಎಣಿಕೆ, ೧ ರಿಂದ ೨೦ ರವರೆಗೆ ಮಗ್ಗಿಕಟ್ಟುಗಳು, ಆಕಾರಗಳು ಮತ್ತು ರೂಪಾಯಿ ಲೆಕ್ಕಾಚಾರ.",
    cur_safety_title: "ರಸ್ತೆ ಸುರಕ್ಷತೆ",
    cur_safety_desc: "ಕೆಂಪು, ಹಳದಿ, ಹಸಿರು ದೀಪಗಳು, ಜೀಬ್ರಾ ಕ್ರಾಸಿಂಗ್ ಮತ್ತು ಸುರಕ್ಷಿತವಾಗಿ ರಸ್ತೆ ದಾಟುವ ನಿಯಮಗಳು.",
    cur_coding_title: "ಕಂಪ್ಯೂಟರ್ ಮತ್ತು ಕೋಡಿಂಗ್",
    cur_coding_desc: "ಸುರಕ್ಷಿತ ಇಂಟರ್ನೆಟ್ ಬಳಕೆ, HTML ಮತ್ತು ಪೈಥಾನ್ ಮೂಲ ಪಾಠಗಳು.",

    // Accessibility Panel
    a11y_title: "ಪ್ರವೇಶಸಾಧ್ಯತಾ ಆಯ್ಕೆಗಳು",
    a11y_high_contrast: "ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್ (AAA)",
    a11y_high_contrast_desc: "ಕಣ್ಣಿನ ಸ್ಪಷ್ಟತೆಗಾಗಿ ಕಪ್ಪು ಮತ್ತು ಹಳದಿ ಬಣ್ಣಗಳ ವಿನ್ಯಾಸ",
    a11y_dark_mode: "ಕಪ್ಪು ಥೀಮ್",
    a11y_dark_mode_desc: "ಕಣ್ಣಿನ ಆಯಾಸ ಕಡಿಮೆ ಮಾಡಲು",
    a11y_dyslexia: "ಡಿಸ್ಲೆಕ್ಸಿಯಾ ಸ್ನೇಹಿ ಅಕ್ಷರಗಳು",
    a11y_dyslexia_desc: "ಓದಲು ಸುಲಭವಾಗುವ ಲೆಕ್ಸೆಂಡ್ ಫಾಂಟ್",
    a11y_font_size: "ಅಕ್ಷರದ ಗಾತ್ರ",
    a11y_narration: "ಧ್ವನಿ ಓದುವಿಕೆ (TTS)",
    a11y_narration_desc: "ಪಠ್ಯ ಮತ್ತು ಪ್ರಶ್ನೆಗಳನ್ನು ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ",
    a11y_reduced_motion: "ಚಲನೆ ಕಡಿಮೆ ಮಾಡಿ",
    a11y_reduced_motion_desc: "ಅನಿಮೇಷನ್‌ಗಳನ್ನು ಕಡಿಮೆ ಮಾಡಿ",
    a11y_2d_mode: "ಸರಳ ೨ಡಿ ಗ್ರಾಫಿಕ್ಸ್",
    a11y_2d_mode_desc: "ಕಡಿಮೆ ವೇಗದ ಸಾಧನಗಳಿಗಾಗಿ ೨ಡಿ ಮೋಡ್",

    // Common Buttons
    btn_listen: "ಕೇಳಿ",
    btn_complete: "ಮುಗಿದಿದೆ ಎಂದು ಗುರುತಿಸಿ",
    btn_play: "ಆಟ ಆಡಿ",
    btn_watch: "ವೀಡಿಯೊ ವೀಕ್ಷಿಸಿ",
    btn_submit: "ಉತ್ತರ ಸಲ್ಲಿಸಿ",
    btn_next: "ಮುಂದಿನದು",
    btn_prev: "ಹಿಂದಿನದು"
  },

  hi: {
    // Navigation
    nav_home: "मुख्य पृष्ठ",
    nav_lessons: "पाठ",
    nav_games: "3D खेल",
    nav_videos: "वीडियो लाइब्रेरी",
    nav_dashboard: "डैशबोर्ड",
    nav_login: "लॉग इन",
    nav_register: "निशुल्क जुड़ें",
    nav_logout: "लॉग आउट",
    nav_profile: "मेरी प्रोफ़ाइल",

    // Hero Section
    hero_badge: "✨ सीमा रहित शिक्षा — सभी के लिए सुलभ",
    hero_title: "इंटरैक्टिव 3D दुनिया में सीखें, खोजें और खेलें",
    hero_subtitle: "कन्नड़, हिंदी, अंग्रेजी, गणित, सड़क सुरक्षा और कोडिंग सीखने के लिए विशेष रूप से डिज़ाइन किया गया सुलभ मंच।",
    hero_cta_start: "निशुल्क सीखना शुरू करें",
    hero_cta_games: "3D खेल खेलें",
    hero_feature_trilingual: "त्रिभाषी: कन्नड़, हिंदी और अंग्रेजी",
    hero_feature_accessible: "दिव्यांग मित्रवत (WCAG 2.2 AA मानक)",
    hero_feature_3d: "सच्ची 3D दुनिया और सरल 2D मोड",

    // 3D Controls
    world_hint_orbit: "दृष्टि घुमाने के लिए ड्रैग करें | ज़ूम करने के लिए स्क्रॉल करें",
    world_mode_2d: "2D मोड में बदलें",
    world_mode_3d: "3D दुनिया में बदलें",

    // Sections
    sec_features_title: "हर विद्यार्थी का सशक्तिकरण",
    sec_features_subtitle: "सार्वभौमिक डिज़ाइन सिद्धांतों पर आधारित ताकि कोई पीछे न छूटे।",
    sec_curriculum_title: "बहुभाषी और जीवन कौशल पाठ्यक्रम",
    sec_curriculum_subtitle: "वर्णमाला से लेकर दैनिक सुरक्षा और भविष्य की तकनीक तक।",

    // Language Cards
    cur_kannada_title: "कन्नड़ वर्णमाला",
    cur_kannada_desc: "कन्नड़ के 14 स्वर, 34 व्यंजन, अक्षर पहचान और सही उच्चारण सीखें।",
    cur_hindi_title: "हिंदी वर्णमाला",
    cur_hindi_desc: "अ से ज्ञ तक स्वर और व्यंजन, मात्राएं, शब्द निर्माण और शुद्ध उच्चारण।",
    cur_english_title: "अंग्रेजी फ़ोनिक्स",
    cur_english_desc: "A से Z तक बड़े और छोटे अक्षर, ध्वनि मिलान और बुनियादी शब्दावली।",
    cur_math_title: "गणित और संख्याएं",
    cur_math_desc: "1 से 100 तक गिनती, 1 से 20 तक पहाड़े, आकृतियां और मुद्रा गणना।",
    cur_safety_title: "सड़क सुरक्षा और यातायात संकेत",
    cur_safety_desc: "लाल, पीली और हरी बत्ती के नियम, ज़ेबरा क्रॉसिंग और सुरक्षित आवागमन।",
    cur_coding_title: "कंप्यूटर और कोडिंग",
    cur_coding_desc: "सुरक्षित इंटरनेट, पासवर्ड सुरक्षा, HTML और पायथन प्रोग्रामिंग।",

    // Accessibility Panel
    a11y_title: "पहुंच-योग्यता प्राथमिकताएं",
    a11y_high_contrast: "उच्च कंट्रास्ट (AAA)",
    a11y_high_contrast_desc: "स्पष्ट दृष्टि के लिए काला और पीला रूप",
    a11y_dark_mode: "डार्क थीम",
    a11y_dark_mode_desc: "आंखों के तनाव को कम करने के लिए",
    a11y_dyslexia: "डिस्लेक्सिया मित्रवत फ़ॉन्ट",
    a11y_dyslexia_desc: "पढ़ने में आसान लेक्सेंड फ़ॉन्ट",
    a11y_font_size: "टेक्स्ट का आकार",
    a11y_narration: "बोलकर सुनाएं (TTS)",
    a11y_narration_desc: "टेक्स्ट और प्रश्नों को सुनकर समझें",
    a11y_reduced_motion: "गति कम करें",
    a11y_reduced_motion_desc: "तेज़ एनिमेशन बंद करें",
    a11y_2d_mode: "सरल 2D ग्राफ़िक्स",
    a11y_2d_mode_desc: "धीमे उपकरणों के लिए 2D कैनवास",

    // Common Buttons
    btn_listen: "सुनें",
    btn_complete: "पूरा चिह्नित करें",
    btn_play: "खेलें",
    btn_watch: "वीडियो देखें",
    btn_submit: "उत्तर भेजें",
    btn_next: "अगला",
    btn_prev: "पिछला"
  }
};

class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('accessibleverse_lang') || 'en';
    this.synth = window.speechSynthesis || null;
  }

  init() {
    this.applyLanguage(this.currentLang);
    this.setupLanguagePickers();
  }

  getCurrentLanguage() {
    return this.currentLang;
  }

  t(key) {
    const langDict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  }

  applyLanguage(lang) {
    if (!TRANSLATIONS[lang]) lang = 'en';
    this.currentLang = lang;
    localStorage.setItem('accessibleverse_lang', lang);
    document.documentElement.lang = lang;

    // Apply translations to all DOM elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation) {
        if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
          el.setAttribute('placeholder', translation);
        } else {
          el.textContent = translation;
        }
      }
    });

    // Update active state in language selector pills/dropdowns
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const targetLang = btn.getAttribute('data-lang');
      btn.classList.toggle('active', targetLang === lang);
      btn.setAttribute('aria-pressed', targetLang === lang ? 'true' : 'false');
    });

    // Dispatch event so other components (3D scene, games) can adapt
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  }

  setupLanguagePickers() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-btn');
      if (btn) {
        const lang = btn.getAttribute('data-lang');
        if (lang) {
          this.applyLanguage(lang);
        }
      }
    });
  }

  // Web Speech API Narration (Synthetic Speech)
  speakText(text, lang = null) {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported on this device/browser.');
      return;
    }

    // Cancel existing speech
    this.synth.cancel();

    const targetLang = lang || this.currentLang;
    const utterance = new SpeechSynthesisUtterance(text);

    // Map language code to BCP 47 voice locale
    if (targetLang === 'kn') {
      utterance.lang = 'kn-IN';
    } else if (targetLang === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = 0.95; // slightly slower for educational clarity
    utterance.pitch = 1.05; // friendly tone

    // Attempt to pick a natural regional voice if available in browser
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    this.synth.speak(utterance);
  }

  stopSpeech() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

// Global Export
window.lang = new LanguageManager();
document.addEventListener('DOMContentLoaded', () => window.lang.init());
