/**
 * AccessibleVerse — Student & Teacher Dashboard Manager
 * Manages XP progress, streaks, achievements, curriculum mastery, and teacher analytics.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const dashboardRoot = document.getElementById('dashboard-root');
  if (!dashboardRoot) return;

  await loadDashboardData();
});

async function loadDashboardData() {
  const root = document.getElementById('dashboard-root');
  if (!root) return;

  root.innerHTML = `
    <div style="text-align: center; padding: 4rem;">
      <i data-lucide="loader" class="spin" style="width: 36px; height: 36px; color: var(--primary);"></i>
      <p style="margin-top: 1rem;">Loading your learning dashboard...</p>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();

  const data = await window.api.progress.getDashboard();
  if (!data || !data.user) {
    root.innerHTML = `
      <div class="card" style="max-width: 500px; margin: 3rem auto; text-align: center; padding: 2.5rem;">
        <i data-lucide="lock" style="width: 48px; height: 48px; color: var(--accent); margin-bottom: 1rem;"></i>
        <h2>Sign In to View Dashboard</h2>
        <p style="margin: 0.75rem 0 1.5rem;">Create a free account or sign in to track XP, game scores, and achievements.</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <a href="login.html" class="btn btn-primary">Sign In</a>
          <a href="register.html" class="btn btn-secondary">Join Free</a>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const user = data.user;
  const isTeacher = (user.role === 'teacher');
  const level = user.level || Math.floor((user.xp || 0) / 100) + 1;
  const xpInLevel = user.xp_in_level !== undefined ? user.xp_in_level : ((user.xp || 0) % 100);

  root.innerHTML = `
    <!-- Top Welcome Banner -->
    <div class="card card-glass" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2rem; border-left: 5px solid var(--primary);">
      <div style="display: flex; align-items: center; gap: 1.25rem;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #fff; box-shadow: 0 4px 14px var(--primary-glow);">
          ${user.avatar === 'robot' ? '🤖' : (user.avatar === 'rocket' ? '🚀' : '⭐')}
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <h2 style="font-size: 1.6rem;">${user.full_name || user.username}</h2>
            <span class="badge ${isTeacher ? 'badge-rose' : 'badge-primary'}">${user.role.toUpperCase()}</span>
          </div>
          <p style="font-size: 0.9rem; margin-top: 0.2rem;">Welcome back! Ready for your next learning quest?</p>
        </div>
      </div>

      <div style="display: flex; gap: 1.5rem; align-items: center;">
        <div style="text-align: right;">
          <div style="font-size: 0.85rem; color: var(--text-muted);">Current Streak</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: var(--accent-amber);">🔥 ${user.streak || 1} Days</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.85rem; color: var(--text-muted);">Total XP</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary);">⚡ ${user.xp || 0} XP</div>
        </div>
      </div>
    </div>

    <!-- Student Progress Level Meter -->
    <div class="card" style="margin-bottom: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <span style="font-weight: 700;">Level ${level} Explorer</span>
        <span style="font-size: 0.85rem; color: var(--text-muted);">${xpInLevel} / 100 XP to Level ${level + 1}</span>
      </div>
      <div style="width: 100%; height: 14px; background: var(--bg-hover); border-radius: var(--radius-full); overflow: hidden; border: 1px solid var(--border-color);">
        <div style="width: ${xpInLevel}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); transition: width 0.5s ease;"></div>
      </div>
    </div>

    ${isTeacher && data.teacher_analytics ? renderTeacherAnalytics(data.teacher_analytics) : ''}

    <!-- 2 Column Layout: Quick Launch & Achievements -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; margin-bottom: 2.5rem;">
      <!-- Quick Launchpad -->
      <div class="card">
        <h3 style="margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
          <i data-lucide="compass" style="color: var(--primary);"></i> Learning Launchpad
        </h3>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <a href="games.html" class="btn btn-secondary" style="justify-content: space-between; text-align: left;">
            <span style="display: flex; align-items: center; gap: 0.5rem;"><i data-lucide="gamepad-2"></i> Play 3D Knowledge Runner</span>
            <span class="badge badge-emerald">Active</span>
          </a>
          <a href="lessons.html?subject=kannada" class="btn btn-secondary" style="justify-content: space-between; text-align: left;">
            <span style="display: flex; align-items: center; gap: 0.5rem;"><i data-lucide="book-open"></i> Practice ಕನ್ನಡ Varnamale</span>
            <span class="badge badge-primary">+50 XP</span>
          </a>
          <a href="lessons.html?subject=mathematics" class="btn btn-secondary" style="justify-content: space-between; text-align: left;">
            <span style="display: flex; align-items: center; gap: 0.5rem;"><i data-lucide="calculator"></i> Multiplication Tables 1–20</span>
            <span class="badge badge-secondary">+75 XP</span>
          </a>
          <a href="videos.html" class="btn btn-secondary" style="justify-content: space-between; text-align: left;">
            <span style="display: flex; align-items: center; gap: 0.5rem;"><i data-lucide="film"></i> Watch Educational YouTube Library</span>
            <span class="badge badge-amber">10 Videos</span>
          </a>
        </div>
      </div>

      <!-- Achievements & Badges -->
      <div class="card">
        <h3 style="margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
          <i data-lucide="award" style="color: var(--accent-amber);"></i> Badges & Achievements
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          ${(data.achievements || []).map(ach => `
            <div class="card card-glass" style="padding: 0.9rem; text-align: center; border: 1.5px solid ${ach.unlocked ? 'var(--primary)' : 'var(--border-color)'}; opacity: ${ach.unlocked ? '1' : '0.55'};">
              <div style="font-size: 1.8rem; margin-bottom: 0.25rem;">${ach.unlocked ? '🏆' : '🔒'}</div>
              <div style="font-weight: 700; font-size: 0.9rem;">${ach.title}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${ach.description}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

function renderTeacherAnalytics(analytics) {
  return `
    <!-- Teacher Dashboard Analytics Module -->
    <div class="card" style="margin-bottom: 2rem; background: linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(79, 70, 229, 0.05)); border: 1.5px solid var(--accent);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <h3 style="display: flex; align-items: center; gap: 0.5rem;">
          <i data-lucide="users" style="color: var(--accent);"></i> Classroom Management & Analytics
        </h3>
        <span class="badge badge-rose">Teacher Mode Active</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div class="card card-glass" style="text-align: center; padding: 1.25rem;">
          <div style="font-size: 2rem; font-weight: 800; color: var(--primary);">${analytics.total_students}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">Active Students</div>
        </div>
        <div class="card card-glass" style="text-align: center; padding: 1.25rem;">
          <div style="font-size: 2rem; font-weight: 800; color: var(--accent-emerald);">${analytics.average_xp}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">Class Average XP</div>
        </div>
        <div class="card card-glass" style="text-align: center; padding: 1.25rem;">
          <div style="font-size: 2rem; font-weight: 800; color: var(--accent-amber);">${analytics.class_streak} Days</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">Class Streak</div>
        </div>
      </div>

      <div>
        <h4 style="font-size: 1rem; margin-bottom: 0.5rem;">Pedagogical Recommendations:</h4>
        <ul style="margin-left: 1.5rem; font-size: 0.9rem; color: var(--text-muted);">
          ${(analytics.recommendations || []).map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}
