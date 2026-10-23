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

// =================================================================
// Acoustic Audio Engine (Web Audio API)
// Provides instant offline acoustic feedback, melodic chimes, and fanfares
// =================================================================
class SoundFXEngine {
  constructor() {
    this.ctx = null;
  }

  getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Melodic two-tone chime when clicking audio or interactive buttons
  playChime(freq1 = 523.25, freq2 = 659.25) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Tone 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq1, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.28);

      // Tone 2 (Harmonic bell)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq2, now + 0.08);
      gain2.gain.setValueAtTime(0.1, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.38);
    } catch (e) {
      // AudioContext policy fallback
    }
  }

  // Celebratory fanfare for completing a lesson or quiz
  playFanfare() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + (idx * 0.1);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch (e) {}
  }
}

class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('accessibleverse_lang') || 'en';
    this.synth = window.speechSynthesis || null;
    this.soundFX = new SoundFXEngine();
    this.voices = [];
    this.speechRate = parseFloat(localStorage.getItem('accessibleverse_speech_rate')) || 0.95;
    this.isSpeaking = false;
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    this.loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices() || [];
  }

  init() {
    this.applyLanguage(this.currentLang);
    this.setupLanguagePickers();
    this.injectSpeechIndicator();
  }

  getCurrentLanguage() {
    return this.currentLang;
  }

  setSpeechRate(rate) {
    this.speechRate = Math.max(0.6, Math.min(1.5, rate));
    localStorage.setItem('accessibleverse_speech_rate', this.speechRate.toString());
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
          this.soundFX.playChime(440, 554.37); // A4 to C#5
          this.applyLanguage(lang);
        }
      }
    });
  }

  // Create on-screen accessible speech caption pill
  injectSpeechIndicator() {
    if (document.getElementById('a11y-speech-indicator')) return;
    const indicator = document.createElement('div');
    indicator.id = 'a11y-speech-indicator';
    indicator.setAttribute('role', 'status');
    indicator.setAttribute('aria-live', 'polite');
    indicator.style.cssText = `
      position: fixed;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%) translateY(120px);
      z-index: 999999;
      background: var(--bg-surface, #1e293b);
      color: var(--text-main, #ffffff);
      padding: 0.65rem 1.25rem;
      border-radius: 999px;
      border: 1.5px solid var(--primary, #6366f1);
      box-shadow: 0 8px 24px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
      font-weight: 500;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
      opacity: 0;
      pointer-events: none;
      max-width: 90vw;
    `;
    indicator.innerHTML = `
      <span class="speech-pulse-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #22c55e; animation: pulse 1s infinite alternate;"></span>
      <span id="a11y-speech-text" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 450px;">Speaking...</span>
      <button id="a11y-speech-stop-btn" style="pointer-events: auto; background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #f87171; border-radius: 999px; padding: 2px 8px; font-size: 0.75rem; cursor: pointer;">Stop ⏹</button>
    `;
    document.body.appendChild(indicator);

    indicator.querySelector('#a11y-speech-stop-btn').addEventListener('click', () => {
      this.stopSpeech();
    });
  }

  showSpeechIndicator(text) {
    const el = document.getElementById('a11y-speech-indicator');
    const txt = document.getElementById('a11y-speech-text');
    if (el && txt) {
      txt.textContent = `🔊 ${text.slice(0, 60)}${text.length > 60 ? '...' : ''}`;
      el.style.opacity = '1';
      el.style.transform = 'translateX(-50%) translateY(0)';
      el.style.pointerEvents = 'auto';
    }
  }

  hideSpeechIndicator() {
    const el = document.getElementById('a11y-speech-indicator');
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-50%) translateY(120px)';
      el.style.pointerEvents = 'none';
    }
  }

  // Transliterate Indic characters and extract English parenthesized meanings for fallback voices
  static transliterateForSpeech(text, targetLang) {
    if (!text || typeof text !== 'string') return '';
    let result = text;

    // 1. If text contains parenthesized English explanations like "ಅಮ್ಮ (Amma - Mother)", extract them
    if (result.includes('(') && result.includes(')')) {
      result = result.replace(/[\u0C80-\u0CFF\u0900-\u097F\s]*\(([^)]+)\)/g, '$1');
    }

    // 2. Common UI phrases transliteration
    result = result
      .replace(/ವಿಷಯ ೧/g, 'Topic 1')
      .replace(/ವಿಷಯ ೨/g, 'Topic 2')
      .replace(/ವಿಷಯ ೩/g, 'Topic 3')
      .replace(/विषय १/g, 'Topic 1')
      .replace(/विषय २/g, 'Topic 2')
      .replace(/ಕೇಳಿ/g, 'Listen')
      .replace(/ಸ್ವರಗಳು/g, 'Vowels')
      .replace(/ವ್ಯಂಜನಗಳು/g, 'Consonants')
      .replace(/ವರ್ಣಮಾಲೆ/g, 'Alphabet')
      .replace(/೧೪/g, '14')
      .replace(/೩೪/g, '34')
      .replace(/೧/g, '1')
      .replace(/೨/g, '2')
      .replace(/೩/g, '3')
      .replace(/೪/g, '4')
      .replace(/೫/g, '5')
      .replace(/೬/g, '6')
      .replace(/೭/g, '7')
      .replace(/೮/g, '8')
      .replace(/೯/g, '9')
      .replace(/೦/g, '0');

    // 3. Kannada Characters Phonetics
    const knMap = {
      'ಅ': 'Short Ah', 'ಆ': 'Long Aah', 'ಇ': 'Short Ee', 'ಈ': 'Long Eeee',
      'ಉ': 'Short Oo', 'ಊ': 'Long Oooo', 'ಋ': 'Ru', 'ಎ': 'Short Eh',
      'ಏ': 'Long Ayy', 'ಐ': 'Eye', 'ಒ': 'Short Oh', 'ಓ': 'Long Ohhh',
      'ಔ': 'Ow', 'ಅಂ': 'Am', 'ಅಃ': 'Aha',
      'ಕ': 'Ka', 'ಖ': 'Kha', 'ಗ': 'Ga', 'ಘ': 'Gha', 'ಙ': 'Nga',
      'ಚ': 'Cha', 'ಛ': 'Chha', 'ಜ': 'Ja', 'ಝ': 'Jha', 'ಞ': 'Nya',
      'ಟ': 'Ta', 'ಠ': 'Tha', 'ಡ': 'Da', 'ಢ': 'Dha', 'ಣ': 'Na',
      'ತ': 'Ta', 'ಥ': 'Tha', 'ದ': 'Da', 'ಧ': 'Dha', 'ನ': 'Na',
      'ಪ': 'Pa', 'ಫ': 'Pha', 'ಬ': 'Ba', 'ಭ': 'Bha', 'ಮ': 'Ma',
      'ಯ': 'Ya', 'ರ': 'Ra', 'ಲ': 'La', 'ವ': 'Va', 'ಶ': 'Sha',
      'ಷ': 'Sha', 'ಸ': 'Sa', 'ಹ': 'Ha', 'ಳ': 'La'
    };

    // 4. Hindi Characters Phonetics
    const hiMap = {
      'अ': 'Ah', 'आ': 'Aah', 'इ': 'Ee', 'ई': 'Eeee', 'उ': 'Oo', 'ऊ': 'Oooo',
      'ऋ': 'Ri', 'ए': 'Ayy', 'ऐ': 'Eye', 'ओ': 'Oh', 'औ': 'Ow', 'अं': 'Am', 'अः': 'Ah',
      'क': 'Ka', 'ख': 'Kha', 'ग': 'Ga', 'घ': 'Gha', 'ङ': 'Nga',
      'च': 'Cha', 'छ': 'Chha', 'ज': 'Ja', 'झ': 'Jha', 'ञ': 'Nya',
      'ट': 'Ta', 'ठ': 'Tha', 'ड': 'Da', 'ढ': 'Dha', 'ण': 'Na',
      'त': 'Ta', 'थ': 'Tha', 'द': 'Da', 'ध': 'Dha', 'न': 'Na',
      'प': 'Pa', 'फ': 'Pha', 'ब': 'Ba', 'भ': 'Bha', 'म': 'Ma',
      'य': 'Ya', 'र': 'Ra', 'ल': 'La', 'व': 'Va', 'श': 'Sha',
      'ष': 'Sha', 'ಸ': 'Sa', 'ह': 'Ha', 'क्ष': 'Ksha', 'त्र': 'Tra', 'ज्ञ': 'Gya'
    };

    const map = targetLang === 'kn' ? knMap : (targetLang === 'hi' ? hiMap : { ...knMap, ...hiMap });
    for (const [char, phoneme] of Object.entries(map)) {
      if (result.includes(char)) {
        result = result.split(char).join(phoneme + ' ');
      }
    }

    return result.trim() || text;
  }

  /**
   * Resilient Multilingual Web Speech API Narration
   * Features:
   * 1. Plays instant acoustic chime via Web Audio API.
   * 2. Overcomes Chromium Windows cancel-before-speak queue drop bug.
   * 3. Prevents GC deallocation of utterance in V8.
   * 4. Multi-tier voice selection: native regional -> Hindi Indic -> Indian English -> default.
   * 5. Fallback transliteration for systems lacking Indic speech packs so audio never fails.
   */
  speakText(text, lang = null, callback = null) {
    if (!text || typeof text !== 'string') return;

    // 1. Instant acoustic audio confirmation via Web Audio API
    this.soundFX.playChime(523.25, 659.25);

    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported on this device/browser.');
      if (callback) callback();
      return;
    }

    // Refresh voices if empty
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }

    // 2. Unstick synthesis if paused
    if (this.synth.paused) {
      this.synth.resume();
    }

    // 3. Cancel previous speech
    this.synth.cancel();

    // 4. Show friendly on-screen speech indicator
    this.showSpeechIndicator(text);

    // 5. Short timeout required for Chromium on Windows to settle the cancel before queueing
    setTimeout(() => {
      try {
        const targetLang = lang || this.currentLang;
        let spokenText = text;

        // Find best matching voice
        let matchedVoice = null;
        const voices = this.voices && this.voices.length > 0 ? this.voices : (this.synth.getVoices() || []);

        if (targetLang === 'kn') {
          // Look for native Kannada voice
          matchedVoice = voices.find(v => v.lang && (v.lang.startsWith('kn') || v.name.toLowerCase().includes('kannada')));
          if (!matchedVoice) {
            // Check Hindi (Indic phonetic engine)
            matchedVoice = voices.find(v => v.lang && (v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')));
          }
          if (!matchedVoice) {
            // Check Indian English
            matchedVoice = voices.find(v => v.lang && (v.lang === 'en-IN' || v.name.toLowerCase().includes('india')));
          }
        } else if (targetLang === 'hi') {
          matchedVoice = voices.find(v => v.lang && (v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')));
          if (!matchedVoice) {
            matchedVoice = voices.find(v => v.lang && (v.lang === 'en-IN' || v.name.toLowerCase().includes('india')));
          }
        } else {
          matchedVoice = voices.find(v => v.lang && (v.lang === 'en-IN' || v.lang.startsWith('en')));
        }

        // If no language-specific voice was found on this Windows/Chromium installation,
        // fall back to system default voice or first available voice (typically English)
        if (!matchedVoice) {
          matchedVoice = voices.find(v => v.default) || (voices.length > 0 ? voices[0] : null);
        }

        // Check if we are using an English or non-native voice for Kannada/Hindi
        const isNativeIndicVoice = matchedVoice && (
          (targetLang === 'kn' && (matchedVoice.lang.startsWith('kn') || matchedVoice.name.toLowerCase().includes('kannada'))) ||
          (targetLang === 'hi' && (matchedVoice.lang.startsWith('hi') || matchedVoice.name.toLowerCase().includes('hindi')))
        );

        if (!isNativeIndicVoice && (targetLang === 'kn' || targetLang === 'hi')) {
          spokenText = LanguageManager.transliterateForSpeech(spokenText, targetLang);
        }

        const utterance = new SpeechSynthesisUtterance(spokenText);

        // Always pair utterance.lang with the matched voice's actual language to avoid 'language-unavailable' drop
        if (matchedVoice) {
          utterance.voice = matchedVoice;
          utterance.lang = matchedVoice.lang;
        } else {
          utterance.lang = targetLang === 'kn' ? 'kn-IN' : (targetLang === 'hi' ? 'hi-IN' : 'en-US');
        }

        utterance.rate = this.speechRate;
        utterance.pitch = 1.05;

        // Critical: Store reference globally to avoid V8 garbage collection mid-speech
        window._activeSpeechUtterance = utterance;
        this.isSpeaking = true;

        utterance.onend = () => {
          this.isSpeaking = false;
          window._activeSpeechUtterance = null;
          this.hideSpeechIndicator();
          if (callback) callback();
        };

        utterance.onerror = (err) => {
          console.warn('[Speech] Synthesis event error:', err);
          this.isSpeaking = false;
          window._activeSpeechUtterance = null;
          this.hideSpeechIndicator();
          if (callback) callback();
        };

        this.synth.speak(utterance);
      } catch (err) {
        console.warn('[Speech] speak failed:', err);
        this.hideSpeechIndicator();
        if (callback) callback();
      }
    }, 45);
  }

  stopSpeech() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    window._activeSpeechUtterance = null;
    this.hideSpeechIndicator();
  }
}

// Global Export
window.SoundFX = SoundFXEngine;
window.lang = new LanguageManager();
document.addEventListener('DOMContentLoaded', () => window.lang.init());
