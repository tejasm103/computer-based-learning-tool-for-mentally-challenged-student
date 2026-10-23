/**
 * AccessibleVerse - Global Configuration File
 *
 * HOW TO CONFIGURE:
 * 1. LOCAL DEVELOPMENT: Keep API_BASE_URL as 'http://127.0.0.1:5000' (or your local Flask port).
 * 2. PRODUCTION DEPLOYMENT (Render / Netlify):
 *    Replace API_BASE_URL with your live Render backend URL, e.g.:
 *    API_BASE_URL: 'https://accessibleverse-backend.onrender.com'
 */

const CONFIG = {
  // Local Flask Backend URL (change this to your Render service URL when deploying)
  API_BASE_URL: 'http://127.0.0.1:5000',

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

// Freeze configuration to prevent accidental modification
Object.freeze(CONFIG);

// Export to window for global browser access across plain JS scripts
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
