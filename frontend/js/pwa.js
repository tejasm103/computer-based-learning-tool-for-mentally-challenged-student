/**
 * AccessibleVerse — PWA Manager & Offline Sync Client
 * Coordinates Service Worker lifecycle, offline status detection, installation prompts,
 * and automatic cloud progress synchronization upon network reconnection.
 */

class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isOnline = navigator.onLine;
  }

  init() {
    this.registerServiceWorker();
    this.setupConnectivityListeners();
    this.setupInstallPrompt();
    this.renderOfflineBanner();
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => {
            console.log('[PWA] Service Worker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.log('[PWA] Service Worker registration skipped/failed:', err.message);
          });
      });
    }
  }

  setupConnectivityListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.updateOfflineBanner(false);
      if (window.showToast) {
        window.showToast("🌐 Connection restored! Syncing your progress...", "info");
      }
      // Trigger automatic progress synchronization
      if (window.api && window.api.learningPath && window.api.learningPath.syncProgress) {
        window.api.learningPath.syncProgress().then((res) => {
          if (res && res.success) {
            console.log('[Sync] Offline progress successfully merged with cloud.');
            if (window.showToast) {
              window.showToast(`✅ Synced! ${res.new_lessons_synced || 0} lessons and XP verified.`, "success");
            }
          }
        }).catch(() => {});
      }
      window.dispatchEvent(new CustomEvent('networkStatusChanged', { detail: { online: true } }));
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.updateOfflineBanner(true);
      if (window.showToast) {
        window.showToast("⚡ You are now offline. Learning, games, and 3D worlds continue seamlessly!", "warning");
      }
      window.dispatchEvent(new CustomEvent('networkStatusChanged', { detail: { online: false } }));
    });
  }

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      const installBtn = document.getElementById('btn-pwa-install');
      if (installBtn) {
        installBtn.style.display = 'inline-flex';
        installBtn.addEventListener('click', async () => {
          if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log('[PWA] Install prompt outcome:', outcome);
            this.deferredPrompt = null;
            installBtn.style.display = 'none';
          }
        });
      }
    });

    window.addEventListener('appinstalled', () => {
      console.log('[PWA] AccessibleVerse was installed successfully!');
      this.deferredPrompt = null;
      const installBtn = document.getElementById('btn-pwa-install');
      if (installBtn) installBtn.style.display = 'none';
    });
  }

  renderOfflineBanner() {
    let banner = document.getElementById('offline-indicator-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'offline-indicator-banner';
      banner.setAttribute('role', 'status');
      banner.setAttribute('aria-live', 'polite');
      banner.style.cssText = `
        display: ${navigator.onLine ? 'none' : 'flex'};
        align-items: center;
        justify-content: center;
        gap: 0.6rem;
        background: #f59e0b;
        color: #0f172a;
        font-weight: 700;
        font-size: 0.85rem;
        padding: 0.4rem 1rem;
        text-align: center;
        position: sticky;
        top: 0;
        z-index: 9999;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      `;
      banner.innerHTML = `
        <span>⚡ <strong>Offline Mode:</strong> All cached lessons, quizzes, and 3D games remain fully playable. Your achievements will sync once online.</span>
      `;
      document.body.prepend(banner);
    }
  }

  updateOfflineBanner(isOffline) {
    const banner = document.getElementById('offline-indicator-banner');
    if (banner) {
      banner.style.display = isOffline ? 'flex' : 'none';
    }
  }
}

// Global PWA Instance
window.pwa = new PWAManager();
document.addEventListener('DOMContentLoaded', () => {
  window.pwa.init();
});
