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
    card.className = 'card 3d-video-card';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.padding = '0';
    card.style.overflow = 'hidden';
    card.style.borderRadius = 'var(--radius-lg)';
    card.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease';

    const is3D = video.title.includes('3D') || video.description.includes('3D') || video.category === 'science';

    card.innerHTML = `
      <!-- Thumbnail with 3D Play Overlay -->
      <div style="position: relative; height: 180px; background: #0f172a; cursor: pointer; overflow: hidden;" class="video-thumb-play" data-yt="${video.youtube_id}" data-title="${video.title}">
        <img src="${video.thumbnail}" alt="${video.title}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9; transition: transform 0.4s ease;">
        ${is3D ? `<span style="position: absolute; top: 10px; left: 10px; background: linear-gradient(135deg, #6366f1, #ec4899); color: #fff; font-size: 0.72rem; font-weight: 800; padding: 3px 8px; border-radius: 999px; box-shadow: 0 2px 8px rgba(0,0,0,0.4);">✨ 3D ANIMATION</span>` : ''}
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 54px; height: 54px; background: rgba(79, 70, 229, 0.92); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 4px 18px rgba(79, 70, 229, 0.6); transition: transform 0.2s ease;">
          <i data-lucide="play" style="margin-left: 3px; width: 24px; height: 24px;"></i>
        </div>
        <span style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.85); color: #fff; font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; font-weight: 600;">${video.duration}</span>
      </div>

      <div style="padding: 1.25rem; display: flex; flex-direction: column; flex: 1;">
        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
          <span class="badge badge-primary">${video.category}</span>
          <span class="badge badge-secondary">${video.language.toUpperCase()}</span>
          ${is3D ? `<span class="badge badge-amber">3D Virtual Lab</span>` : ''}
        </div>

        <h3 style="font-size: 1.1rem; line-height: 1.35; margin-bottom: 0.5rem;">${video.title}</h3>
        <p style="font-size: 0.86rem; color: var(--text-muted); margin-bottom: 1.25rem; flex: 1; line-height: 1.5;">${video.description}</p>

        <div style="display: flex; gap: 0.5rem; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
          <button class="btn btn-primary btn-sm watch-video-btn" data-yt="${video.youtube_id}" data-title="${video.title}" style="flex: 1;">
            <i data-lucide="play"></i> Watch Now
          </button>
          <button class="btn btn-secondary btn-sm btn-icon" data-speak="${video.title}. ${video.description}" title="Listen to video overview" aria-label="Listen to video overview">
            <i data-lucide="volume-2"></i>
          </button>
          <a href="https://www.youtube.com/watch?v=${video.youtube_id}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm btn-icon" title="Open fallback on YouTube" aria-label="Open on YouTube">
            <i data-lucide="external-link"></i>
          </a>
          <button class="btn btn-secondary btn-sm btn-icon bookmark-video-btn" data-id="${video.id}" title="Save to Watch Later" aria-label="Save to Watch Later">
            <i data-lucide="bookmark"></i>
          </button>
        </div>
      </div>
    `;

    // 3D Tilt Hover
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-6px) scale(1.015)';
      card.style.boxShadow = '0 12px 30px rgba(79, 70, 229, 0.2)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = '';
    });

    // Watch listener
    card.querySelectorAll('.watch-video-btn, .video-thumb-play').forEach(btn => {
      btn.addEventListener('click', () => {
        openVideoModal(video.youtube_id, video.title, video.description);
      });
    });

    // Bookmark listener
    card.querySelector('.bookmark-video-btn').addEventListener('click', async () => {
      if (window.lang && window.lang.soundFX) {
        window.lang.soundFX.playChime(659.25, 783.99);
      }
      const res = await window.api.videos.toggleSave(video.id);
      window.showToast("⭐ Video bookmarked in your Watch Later list!", "success");
    });

    container.appendChild(card);
  });

  if (window.lucide) window.lucide.createIcons();
}

function renderPlaylistBanner(playlist) {
  const bannerContainer = document.getElementById('playlist-banner-container');
  if (!bannerContainer || !playlist) return;

  bannerContainer.innerHTML = `
    <div class="card card-glass" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; border: 1.5px solid var(--primary); padding: 1.5rem; border-radius: var(--radius-lg); position: relative; overflow: hidden;">
      <div style="max-width: 650px;">
        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
          <span class="badge badge-primary">Official YouTube Playlist</span>
          <span class="badge badge-amber">✨ 3D Animations Included</span>
        </div>
        <h3 style="font-size: 1.3rem; margin-bottom: 0.4rem;">${playlist.title || 'AccessibleVerse Learning Series'}</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted);">Watch our complete collection of multilingual lessons, 3D animated science experiments, and safety guidelines sequentially.</p>
      </div>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="openVideoModal('videoseries?list=PLJTr95DbZYT_Lbqfxsf3mdNetS-D_LiQk', 'Complete AccessibleVerse Playlist', 'Sequential learning series with all lessons and 3D videos')">
          <i data-lucide="play"></i> Play Full Series
        </button>
        <a href="https://www.youtube.com/playlist?list=PLJTr95DbZYT_Lbqfxsf3mdNetS-D_LiQk" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
          <i data-lucide="external-link"></i> YouTube
        </a>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

function openVideoModal(youtubeIdOrParam, title, description = '') {
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

  const speakText = `${title}. ${description || 'Educational video lesson.'}`;

  modalBackdrop.innerHTML = `
    <div class="a11y-panel video-modal-panel" style="max-width: 820px; max-height: 85vh; padding: 1.25rem 1.5rem; display: flex; flex-direction: column;">
      <!-- Modal Header -->
      <div class="a11y-panel-header" style="flex-shrink: 0; padding-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
        <h3 style="font-size: 1.15rem; margin: 0;">${title}</h3>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <button class="btn btn-sm btn-secondary" data-speak="${speakText}" title="Listen to video description">
            <i data-lucide="volume-2"></i> Listen
          </button>
          <button class="a11y-close-btn" onclick="closeVideoModal()" aria-label="Close video player" style="font-size: 1.5rem;">&times;</button>
        </div>
      </div>

      <!-- YouTube Embed Iframe Responsive Container (16:9) -->
      <div style="position: relative; width: 100%; aspect-ratio: 16/9; max-height: calc(85vh - 160px); background: #000; border-radius: var(--radius-md); overflow: hidden; margin: 0.75rem 0; flex-shrink: 0;">
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

      <!-- Modal Footer -->
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--text-muted); flex-shrink: 0; padding-top: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
        <span>💡 Accessibility: Turn on Closed Captions (CC) in the video controls bar.</span>
        <div style="display: flex; gap: 0.5rem;">
          <a href="https://www.youtube.com/watch?v=${youtubeIdOrParam}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
            <i data-lucide="external-link"></i> Open on YouTube
          </a>
          <button class="btn btn-secondary btn-sm" onclick="closeVideoModal()">
            Done Watching
          </button>
        </div>
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
