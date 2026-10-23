/**
 * AccessibleVerse - Global Configuration File
 *
 * HOW IT WORKS:
 * 1. Automatic Environment Detection:
 *    - On localhost / 127.0.0.1: Automatically uses 'http://127.0.0.1:5000'
 *    - On Netlify / Production: Automatically uses your Render service URL
 * 2. Live Runtime Customization:
 *    - You can override the backend URL anytime in the UI or in localStorage ('ACCESSIBLEVERSE_API_URL')
 *    - Console helper available: window.setBackendUrl('https://your-backend.onrender.com')
 */

function resolveApiBaseUrl() {
  if (typeof window !== 'undefined') {
    // 1. Runtime override from localStorage (set via UI or console)
    try {
      const stored = localStorage.getItem('ACCESSIBLEVERSE_API_URL');
      if (stored && stored.trim()) {
        return stored.trim().replace(/\/+$/, '');
      }
    } catch (e) {
      // localStorage may be restricted in some iframe contexts
    }

    // 2. Global window override (if injected via script or HTML)
    if (window.__API_BASE_URL__) {
      return window.__API_BASE_URL__.trim().replace(/\/+$/, '');
    }

    // 3. Localhost development check
    if (window.location && window.location.hostname) {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') {
        return 'http://127.0.0.1:5000';
      }
    }
  }

  // 4. Default Production Render Backend URL
  // Replace this with your exact Render service URL if named differently:
  return 'https://accessibleverse-backend.onrender.com';
}

const CONFIG = {
  // Resolved Backend REST API URL (dynamic getter)
  get API_BASE_URL() {
    return resolveApiBaseUrl();
  },

  // App Metadata
  APP_NAME: 'AccessibleVerse — Learn Without Limits',
  VERSION: '1.0.0',

  // YouTube Playlist ID for the learning library
  YOUTUBE_PLAYLIST_ID: 'PLJTr95DbZYT_Lbqfxsf3mdNetS-D_LiQk',

  // Supported Languages
  LANGUAGES: ['en', 'kn', 'hi'],
  DEFAULT_LANGUAGE: 'en',

  // Audio / Speech Settings
  SPEECH_RATES: {
    slow: 0.75,
    normal: 1.0,
    fast: 1.25
  }
};

// Console & Window Helpers for live testing
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;

  window.setBackendUrl = function(newUrl) {
    if (!newUrl || !newUrl.trim()) {
      localStorage.removeItem('ACCESSIBLEVERSE_API_URL');
      console.log('🔄 Reset backend URL to default:', CONFIG.API_BASE_URL);
    } else {
      const cleanUrl = newUrl.trim().replace(/\/+$/, '');
      localStorage.setItem('ACCESSIBLEVERSE_API_URL', cleanUrl);
      console.log('✅ Set backend URL to:', cleanUrl);
    }
    if (window.api) {
      window.api.baseUrl = CONFIG.API_BASE_URL;
    }
    return CONFIG.API_BASE_URL;
  };

  window.getBackendUrl = function() {
    return CONFIG.API_BASE_URL;
  };
}
