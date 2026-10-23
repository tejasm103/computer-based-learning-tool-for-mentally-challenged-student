/**
 * AccessibleVerse — YouTube Learning Library
 * Embeds official educational videos and playlist with search, category filters,
 * watch-later bookmarking, and "Open on YouTube" fallback links.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('videos-grid-container');
  if (!container) return;

  setupVideoFilters();
  await loadVideos();
});

function setupVideoFilters() {
  const searchInput = document.getElementById('video-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterVideos();
    });
  }

  const categorySelect = document.getElementById('video-category-filter');
  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      filterVideos();
    });
  }

  const langSelect = document.getElementById('video-language-filter');
  if (langSelect) {
    langSelect.addEventListener('change', () => {
      filterVideos();
    });
  }
}

let allVideos = [];

async function loadVideos() {
  const container = document.getElementById('videos-grid-container');
  if (!container) return;

  const data = await window.api.videos.getAll();
  allVideos = data.videos || window.FALLBACK_VIDEOS || [];

  renderVideos(allVideos);
  renderPlaylistBanner(data.playlist);
}

function filterVideos() {
  const q = (document.getElementById('video-search-input')?.value || '').toLowerCase().trim();
  const cat = document.getElementById('video-category-filter')?.value || 'all';
  const lang = document.getElementById('video-language-filter')?.value || 'all';

  const filtered = allVideos.filter(v => {
    const matchesQ = !q || v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q);
    const matchesCat = (cat === 'all') || v.category === cat;
    const matchesLang = (lang === 'all') || v.language === lang;
    return matchesQ && matchesCat && matchesLang;
  });

  renderVideos(filtered);
}

function renderVideos(videos) {
  const container = document.getElementById('videos-grid-container');
  if (!container) return;

  if (videos.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
        <p>No educational videos matched your search criteria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  videos.forEach(video => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.padding = '0';
    card.style.overflow = 'hidden';

    card.innerHTML = `
      <!-- Thumbnail with Play Button -->
      <div style="position: relative; height: 180px; background: #0f172a; cursor: pointer;" class="video-thumb-play" data-yt="${video.youtube_id}" data-title="${video.title}">
        <img src="${video.thumbnail}" alt="${video.title}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.85;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 52px; height: 52px; background: rgba(79, 70, 229, 0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 4px 14px rgba(0,0,0,0.5);">
          <i data-lucide="play" style="margin-left: 3px;"></i>
        </div>
        <span style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); color: #fff; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">${video.duration}</span>
      </div>

      <div style="padding: 1.25rem; display: flex; flex-direction: column; flex: 1;">
        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
          <span class="badge badge-primary">${video.category}</span>
          <span class="badge badge-secondary">${video.language.toUpperCase()}</span>
        </div>

        <h3 style="font-size: 1.1rem; line-height: 1.35; margin-bottom: 0.5rem;">${video.title}</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem; flex: 1;">${video.description}</p>

        <div style="display: flex; gap: 0.5rem; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
          <button class="btn btn-secondary btn-sm watch-video-btn" data-yt="${video.youtube_id}" data-title="${video.title}">
            <i data-lucide="play"></i> Watch Now
          </button>
          <a href="https://www.youtube.com/watch?v=${video.youtube_id}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Open fallback on YouTube" aria-label="Open on YouTube">
            <i data-lucide="external-link"></i> YouTube
          </a>
          <button class="btn btn-secondary btn-sm btn-icon bookmark-video-btn" data-id="${video.id}" title="Save to Watch Later" aria-label="Save to Watch Later">
            <i data-lucide="bookmark"></i>
          </button>
        </div>
      </div>
    `;

    // Watch listener
    card.querySelectorAll('.watch-video-btn, .video-thumb-play').forEach(btn => {
      btn.addEventListener('click', () => {
        openVideoModal(video.youtube_id, video.title);
      });
    });

    // Bookmark listener
    card.querySelector('.bookmark-video-btn').addEventListener('click', async () => {
      const res = await window.api.videos.toggleSave(video.id);
      window.showToast("Bookmark updated in your watch list!", "success");
    });

    container.appendChild(card);
  });

  if (window.lucide) window.lucide.createIcons();
}

function renderPlaylistBanner(playlist) {
  const bannerContainer = document.getElementById('playlist-banner-container');
  if (!bannerContainer || !playlist) return;

  bannerContainer.innerHTML = `
    <div class="card card-glass" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; border: 1.5px solid var(--primary); padding: 1.75rem;">
      <div style="max-width: 650px;">
        <span class="badge badge-primary" style="margin-bottom: 0.5rem;">Official YouTube Playlist</span>
        <h3 style="font-size: 1.35rem; margin-bottom: 0.4rem;">${playlist.title || 'AccessibleVerse Learning Series'}</h3>
        <p style="font-size: 0.9rem;">Watch our complete collection of multilingual lessons, mathematics fundamentals, and safety guidelines sequentially.</p>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <button class="btn btn-primary" onclick="openVideoModal('videoseries?list=PLJTr95DbZYT_Lbqfxsf3mdNetS-D_LiQk', 'Complete AccessibleVerse Playlist')">
          <i data-lucide="play"></i> Play Full Series
        </button>
        <a href="https://www.youtube.com/playlist?list=PLJTr95DbZYT_Lbqfxsf3mdNetS-D_LiQk" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
          <i data-lucide="external-link"></i> Open on YouTube
        </a>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

function openVideoModal(youtubeIdOrParam, title) {
  let modalBackdrop = document.getElementById('video-player-modal');
  if (!modalBackdrop) {
    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'video-player-modal';
    modalBackdrop.className = 'a11y-modal-backdrop';
    document.body.appendChild(modalBackdrop);
  }

  const embedUrl = youtubeIdOrParam.includes('videoseries')
    ? `https://www.youtube-nocookie.com/embed/${youtubeIdOrParam}`
    : `https://www.youtube-nocookie.com/embed/${youtubeIdOrParam}?autoplay=1&rel=0&modestbranding=1`;

  modalBackdrop.innerHTML = `
    <div class="a11y-panel" style="max-width: 860px; padding: 1.5rem;">
      <div class="a11y-panel-header">
        <h3 style="font-size: 1.15rem;">${title}</h3>
        <button class="a11y-close-btn" onclick="closeVideoModal()">&times;</button>
      </div>

      <!-- YouTube Embed Iframe -->
      <div style="position: relative; width: 100%; aspect-ratio: 16/9; background: #000; border-radius: var(--radius-md); overflow: hidden; margin: 1rem 0;">
        <iframe
          src="${embedUrl}"
          title="${title}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
        </iframe>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--text-muted);">
        <span>Accessibility Tip: Turn on closed captions (CC) directly inside the YouTube player bar.</span>
        <a href="https://www.youtube.com/watch?v=${youtubeIdOrParam}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
          <i data-lucide="external-link"></i> Fallback Link
        </a>
      </div>
    </div>
  `;

  modalBackdrop.classList.add('active');
  if (window.lucide) window.lucide.createIcons();
}

window.closeVideoModal = function() {
  const modal = document.getElementById('video-player-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.innerHTML = ''; // stops video playback
  }
};
