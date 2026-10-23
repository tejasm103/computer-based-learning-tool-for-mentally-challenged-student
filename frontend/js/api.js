/**
 * AccessibleVerse — Single Reusable API Client
 * Connects the frontend to the Flask REST API with automatic offline / local fallback.
 */

class ApiClient {
  constructor() {
    this._baseUrl = null;
    this.tokenKey = 'accessibleverse_jwt_token';
    this.userKey = 'accessibleverse_user_profile';
  }

  get baseUrl() {
    return this._baseUrl || (window.CONFIG && window.CONFIG.API_BASE_URL) || 'http://127.0.0.1:5000';
  }

  set baseUrl(url) {
    this._baseUrl = url;
  }

  // Token Management
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token) {
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      localStorage.removeItem(this.tokenKey);
    }
  }

  getCachedUser() {
    try {
      const data = localStorage.getItem(this.userKey);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  setCachedUser(user) {
    if (user) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.userKey);
    }
  }

  clearAuth() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getHeaders(isJson = true) {
    const headers = {};
    if (isJson) {
      headers['Content-Type'] = 'application/json';
    }
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Base Request Handler with automatic offline fallback
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultOptions = {
      headers: this.getHeaders(options.isJson !== false)
    };
    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
      }
      return { success: true, data };
    } catch (err) {
      console.warn(`[API] Network or server error calling ${endpoint}:`, err.message);
      // Return structured error so caller can gracefully decide or trigger offline fallback
      return { success: false, error: err.message, isOffline: true };
    }
  }

  // =================================================================
  // API Modules
  // =================================================================

  health = {
    check: async () => {
      const res = await this.request('/api/health', { method: 'GET' });
      return res.success ? res.data : {
        status: 'offline',
        notice: 'Flask server is currently not reachable on ' + this.baseUrl + '. Ensure backend/run.py is running.'
      };
    }
  };

  auth = {
    register: async (userData) => {
      const res = await this.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (res.success) {
        this.setToken(res.data.access_token);
        this.setCachedUser(res.data.user);
        return { success: true, user: res.data.user, token: res.data.access_token };
      }
      // Offline fallback: create local profile
      if (res.isOffline) {
        const localUser = {
          id: 'local_' + Date.now(),
          username: userData.username,
          full_name: userData.full_name || userData.username,
          email: userData.email,
          role: userData.role || 'student',
          avatar: userData.avatar || 'star',
          xp: 100,
          streak: 1,
          completed_lessons: [],
          achievements: ['ach_first_lesson'],
          accessibility_settings: {}
        };
        this.setCachedUser(localUser);
        this.setToken('mock_jwt_token_local');
        return { success: true, user: localUser, isLocalFallback: true };
      }
      return { success: false, error: res.error };
    },

    login: async (credentials) => {
      const res = await this.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      if (res.success) {
        this.setToken(res.data.access_token);
        this.setCachedUser(res.data.user);
        return { success: true, user: res.data.user, token: res.data.access_token };
      }
      // Offline fallback: if credentials match cached user or demo
      if (res.isOffline) {
        const cached = this.getCachedUser();
        if (cached && (cached.email === credentials.identifier || cached.username === credentials.identifier)) {
          this.setToken('mock_jwt_token_local');
          return { success: true, user: cached, isLocalFallback: true };
        }
        // Allow Demo Student login in offline mode
        if (credentials.identifier === 'student' || credentials.identifier === 'demo') {
          const demoUser = {
            id: 'demo_student',
            username: 'DemoStudent',
            full_name: 'Alex Explorer',
            email: 'student@accessibleverse.org',
            role: 'student',
            avatar: 'star',
            xp: 250,
            streak: 3,
            completed_lessons: ['kn-varnamale-1', 'life-traffic-safety'],
            achievements: ['ach_first_lesson', 'ach_math_whiz'],
            accessibility_settings: {}
          };
          this.setCachedUser(demoUser);
          this.setToken('mock_jwt_token_local');
          return { success: true, user: demoUser, isLocalFallback: true };
        }
      }
      return { success: false, error: res.error };
    },

    getMe: async () => {
      const token = this.getToken();
      if (!token) return { success: false, user: null };

      const res = await this.request('/api/auth/me', { method: 'GET' });
      if (res.success) {
        this.setCachedUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      // Return cached user if offline
      const cached = this.getCachedUser();
      return { success: !!cached, user: cached, isLocalFallback: true };
    },

    updateProfile: async (profileData) => {
      const res = await this.request('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      if (res.success) {
        const cached = this.getCachedUser() || {};
        const updated = { ...cached, ...res.data.user };
        this.setCachedUser(updated);
        return { success: true, user: updated };
      }
      // Offline fallback
      const cached = this.getCachedUser() || {};
      const updated = { ...cached, ...profileData };
      this.setCachedUser(updated);
      return { success: true, user: updated, isLocalFallback: true };
    },

    logout: async () => {
      try {
        await this.request('/api/auth/logout', { method: 'POST' });
      } finally {
        this.clearAuth();
      }
      return { success: true };
    }
  };

  lessons = {
    getAll: async (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      const endpoint = `/api/lessons${qs ? '?' + qs : ''}`;
      const res = await this.request(endpoint, { method: 'GET' });
      if (res.success) return res.data.lessons;

      // Fallback local lessons
      return window.FALLBACK_LESSONS || [];
    },

    getById: async (id) => {
      const res = await this.request(`/api/lessons/${id}`, { method: 'GET' });
      if (res.success) return res.data.lesson;

      // Fallback
      const list = window.FALLBACK_LESSONS || [];
      return list.find(l => l.id === id) || null;
    },

    complete: async (id) => {
      const res = await this.request(`/api/lessons/${id}/complete`, { method: 'POST' });
      // Update local storage XP
      const cached = this.getCachedUser();
      if (cached) {
        if (!cached.completed_lessons) cached.completed_lessons = [];
        if (!cached.completed_lessons.includes(id)) {
          cached.completed_lessons.push(id);
          cached.xp = (cached.xp || 0) + (res.data?.xp_gained || 50);
          this.setCachedUser(cached);
        }
      }
      return res.success ? res.data : { success: true, xp_gained: 50, isLocal: true };
    }
  };

  videos = {
    getAll: async (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      const endpoint = `/api/videos${qs ? '?' + qs : ''}`;
      const res = await this.request(endpoint, { method: 'GET' });
      if (res.success) return res.data;

      // Fallback curated video library
      return {
        videos: window.FALLBACK_VIDEOS || [],
        playlist: {
          playlist_id: 'PLJTr95DbZYT_Lbqfxsf3mdNetS-D_LiQk',
          title: 'AccessibleVerse Multilingual & Life Skills Playlist'
        }
      };
    },

    toggleSave: async (videoId) => {
      const res = await this.request(`/api/videos/${videoId}/save`, { method: 'POST' });
      return res.success ? res.data : { status: 'toggled', isLocal: true };
    }
  };

  quizzes = {
    getAll: async () => {
      const res = await this.request('/api/quizzes', { method: 'GET' });
      return res.success ? res.data.quizzes : (window.FALLBACK_QUIZZES || []);
    },

    submit: async (quizId, answers) => {
      const cachedUser = this.getCachedUser();
      const payload = {
        quiz_id: quizId,
        answers: answers,
        user_id: cachedUser ? cachedUser.id : 'guest'
      };
      const res = await this.request('/api/quizzes/submit', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      return res.success ? res.data : null;
    }
  };

  games = {
    submitScore: async (scoreData) => {
      const cached = this.getCachedUser();
      const payload = {
        ...scoreData,
        user_id: cached ? cached.id : 'guest',
        username: cached ? (cached.full_name || cached.username) : (scoreData.username || 'Explorer')
      };
      const res = await this.request('/api/games/score', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      // Award XP locally too
      if (cached) {
        cached.xp = (cached.xp || 0) + (res.data?.xp_earned || 20);
        this.setCachedUser(cached);
      }
      return res.success ? res.data : { success: true, isLocal: true };
    },

    getLeaderboard: async (gameId) => {
      const res = await this.request(`/api/games/leaderboard/${gameId}`, { method: 'GET' });
      if (res.success) return res.data.leaderboard;
      return [
        { username: 'Alex Champion', score: 850, level: 4 },
        { username: 'Deepa Star', score: 620, level: 3 },
        { username: 'Rohan Quest', score: 490, level: 2 }
      ];
    }
  };

  progress = {
    getDashboard: async () => {
      const res = await this.request('/api/progress/dashboard', { method: 'GET' });
      if (res.success) return res.data;

      // Fallback dashboard data from local cache
      const cached = this.getCachedUser() || {
        username: 'Explorer',
        full_name: 'Guest Explorer',
        role: 'student',
        xp: 150,
        completed_lessons: ['kn-varnamale-1']
      };
      return {
        user: {
          ...cached,
          level: Math.floor((cached.xp || 0) / 100) + 1,
          xp_in_level: (cached.xp || 0) % 100,
          completed_count: (cached.completed_lessons || []).length,
          total_lessons: 8,
          progress_percent: 25.0
        },
        achievements: [
          { id: 'ach_first_lesson', title: 'First Step!', description: 'Complete your first learning lesson.', icon: 'award', unlocked: true, xp: 50 },
          { id: 'ach_polyglot', title: 'Trilingual Explorer', description: 'Explore lessons in Kannada, Hindi, and English.', icon: 'globe', unlocked: true, xp: 100 },
          { id: 'ach_math_whiz', title: 'Math Whiz', description: 'Score 100+ points in Number Quest.', icon: 'calculator', unlocked: false, xp: 75 }
        ],
        completed_lesson_ids: cached.completed_lessons || []
      };
    }
  };
}

// Global Export
window.api = new ApiClient();
