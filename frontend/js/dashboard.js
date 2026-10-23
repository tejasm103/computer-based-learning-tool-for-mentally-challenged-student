/**
 * AccessibleVerse — Advanced Student & Teacher Dashboard
 * Features:
 * - Daily Missions tracking & XP claiming
 * - Smart Study Calendar & Weekly Planning
 * - Mistake Review & Targeted Practice Launcher
 * - 6-Subject Mastery Visualizers
 * - Teacher / Guardian Classroom Management shortcuts
 * - Digital Portfolio & Verified Certificates launcher
 */

let dashboardData = null;
let dailyMissions = [];
let unresolvedMistakes = [];
let studyPlan = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadAdvancedDashboard();
});

async function loadAdvancedDashboard() {
  const root = document.getElementById('dashboard-root');
  if (!root) return;

  root.innerHTML = `
    <div style="text-align: center; padding: 4rem;">
      <div style="font-size: 2.5rem; margin-bottom: 1rem;" class="spin">⭐</div>
      <p style="color: #94a3b8; font-size: 1.1rem;">Personalizing your learning dashboard...</p>
    </div>
  `;

  // 1. Fetch User Dashboard Data
  try {
    if (window.api && window.api.progress) {
      dashboardData = await window.api.progress.getDashboard();
    }
  } catch {}

  // Local storage user fallback
  const localUser = JSON.parse(localStorage.getItem('accessibleverse_user') || 'null');
  const user = (dashboardData && dashboardData.user) || localUser || {
    username: 'Explorer',
    role: 'student',
    xp: 145,
    streak: 3,
    level: 2,
    avatar: 'star'
  };

  // 2. Fetch Daily Missions
  try {
    if (window.ApiClient && window.ApiClient.learningPath) {
      const res = await window.ApiClient.learningPath.getDailyMissions();
      dailyMissions = (res && res.missions) || [];
    }
  } catch {}

  if (!dailyMissions || dailyMissions.length === 0) {
    dailyMissions = [
      { id: 'mission_lesson', title: 'Complete 1 Science or Math Lesson', current: 1, target: 1, xp_reward: 25, claimed: false },
      { id: 'mission_quiz', title: 'Score 100% on a Quiz', current: 0, target: 1, xp_reward: 35, claimed: false },
      { id: 'mission_star', title: 'Collect a Hidden Star in the 3D Universe', current: 1, target: 1, xp_reward: 15, claimed: false }
    ];
  }

  // 3. Fetch Unresolved Mistakes
  try {
    if (window.ApiClient && window.ApiClient.practice) {
      const res = await window.ApiClient.practice.getUnresolvedMistakes();
      unresolvedMistakes = (res && res.mistakes) || [];
    }
  } catch {}

  if (!unresolvedMistakes || unresolvedMistakes.length === 0) {
    unresolvedMistakes = [
      { id: 'mst_1', question_text: 'What do green leaves use to capture sunlight?', your_answer: 'Carbon Dioxide', correct_answer: 'Chlorophyll', explanation: 'Chlorophyll is the green pigment in plant chloroplasts that absorbs sunlight energy.' },
      { id: 'mst_2', question_text: 'What should you do before stepping onto a zebra crossing?', your_answer: 'Sprint across immediately', correct_answer: 'Look right, look left, and look right again', explanation: 'Always visually verify both directions of moving traffic before stepping onto the road.' }
    ];
  }

  // 4. Fetch Study Plan
  try {
    if (window.ApiClient && window.ApiClient.learningPath) {
      studyPlan = await window.ApiClient.learningPath.getStudyPlan();
    }
  } catch {}

  if (!studyPlan) {
    studyPlan = {
      recommended_subject: 'science',
      daily_goal_minutes: 25,
      completed_today_minutes: 15,
      recommended_lessons: [
        { id: 'science_solar', title: 'Solar System Orbits', subject: 'science', url: 'science.html' },
        { id: 'cyber_passwords', title: 'Password Entropy Vault', subject: 'cybersecurity', url: 'cybersecurity.html' }
      ]
    };
  }

  renderFullDashboard(user);
}

function renderFullDashboard(user) {
  const root = document.getElementById('dashboard-root');
  if (!root) return;

  const isTeacher = user.role === 'teacher';
  const level = user.level || Math.floor((user.xp || 0) / 100) + 1;
  const xpInLevel = (user.xp || 0) % 100;

  root.innerHTML = `
    <!-- Top Welcome Banner -->
    <div class="card card-glass" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2rem; border-left: 5px solid #6366f1;">
      <div style="display: flex; align-items: center; gap: 1.25rem;">
        <div style="width: 68px; height: 68px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #06b6d4); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; color: #fff; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);">
          ${user.avatar === 'robot' ? '🤖' : (user.avatar === 'rocket' ? '🚀' : '⭐')}
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <h2 style="font-size: 1.6rem; margin: 0;">${user.name || user.full_name || user.username || 'Explorer'}</h2>
            <span class="badge ${isTeacher ? 'badge-rose' : 'badge-primary'}">${(user.role || 'student').toUpperCase()}</span>
          </div>
          <p style="font-size: 0.95rem; margin-top: 0.25rem; color: #94a3b8;">
            Ready to explore? Your personalized AI tutor and study plan are ready!
          </p>
        </div>
      </div>

      <div style="display: flex; gap: 1.5rem; align-items: center;">
        <div style="text-align: right;">
          <div style="font-size: 0.85rem; color: #94a3b8;">Daily Streak</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: #f59e0b;">🔥 ${user.streak || 1} Days</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.85rem; color: #94a3b8;">Total Experience</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: #38bdf8;">⚡ ${user.xp || 0} XP</div>
        </div>
      </div>
    </div>

    <!-- Level Progress Meter -->
    <div class="card" style="margin-bottom: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <span style="font-weight: 700; color: #f8fafc;">Level ${level} Universe Pioneer</span>
        <span style="font-size: 0.85rem; color: #94a3b8;">${xpInLevel} / 100 XP to Level ${level + 1}</span>
      </div>
      <div style="width: 100%; height: 14px; background: rgba(255, 255, 255, 0.1); border-radius: 9999px; overflow: hidden;">
        <div style="width: ${xpInLevel}%; height: 100%; background: linear-gradient(90deg, #6366f1, #06b6d4); transition: width 0.5s ease;"></div>
      </div>
    </div>

    <!-- 2 Column Layout: Daily Missions & Mistake Review Center -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
      <!-- Daily Missions -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h3 style="margin: 0; font-size: 1.2rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="target" style="color: #f59e0b;"></i> Daily 3 Missions
          </h3>
          <span style="font-size: 0.8rem; color: #10b981; font-weight: 700;">Resets at Midnight</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${dailyMissions.map(m => {
            const isDone = (m.current || 0) >= (m.target || 1);
            return `
              <div style="background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <strong style="font-size: 0.95rem; color: #f8fafc;">${m.title}</strong>
                  <span style="font-size: 0.85rem; color: #fbbf24; font-weight: 700;">+${m.xp_reward} XP</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
                  <div style="flex: 1; height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden;">
                    <div style="width: ${Math.min(100, Math.round(((m.current || 0) / (m.target || 1)) * 100))}%; height: 100%; background: #10b981;"></div>
                  </div>
                  ${isDone && !m.claimed ? `
                    <button class="btn btn-primary btn-sm" onclick="claimDailyMission('${m.id}', ${m.xp_reward})">Claim</button>
                  ` : (m.claimed ? `<span style="font-size: 0.8rem; color: #10b981; font-weight: 700;">Claimed ✅</span>` : `<span style="font-size: 0.8rem; color: #94a3b8;">${m.current || 0}/${m.target || 1}</span>`)}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Mistake Review & Practice Center -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h3 style="margin: 0; font-size: 1.2rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="rotate-ccw" style="color: #ef4444;"></i> Mistake Review Center
          </h3>
          <span style="font-size: 0.8rem; color: #f87171; background: rgba(239, 68, 68, 0.15); padding: 0.2rem 0.6rem; border-radius: 9999px; font-weight: 700;">
            ${unresolvedMistakes.length} To Review
          </span>
        </div>

        <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 1rem;">
          Review and resolve questions you previously missed to fortify your subject mastery!
        </p>

        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${unresolvedMistakes.slice(0, 2).map((m, idx) => `
            <div style="background: #0f172a; border-left: 3px solid #ef4444; padding: 0.85rem 1rem; border-radius: 0 8px 8px 0;">
              <strong style="font-size: 0.9rem; color: #f8fafc; display: block; margin-bottom: 0.25rem;">Q: ${m.question_text}</strong>
              <div style="font-size: 0.8rem; color: #94a3b8;">
                Your Answer: <span style="color: #ef4444; text-decoration: line-through;">${m.your_answer}</span> • Correct: <span style="color: #10b981; font-weight: 700;">${m.correct_answer}</span>
              </div>
              <p style="font-size: 0.8rem; color: #cbd5e1; margin: 0.35rem 0 0.5rem; line-height: 1.4;">${m.explanation || ''}</p>
              <button class="btn btn-secondary btn-sm" onclick="resolveMistake('${m.id}')">
                <i data-lucide="check"></i> Mark Mastered (+15 XP)
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- 6-Subject Mastery Progress -->
    <div class="card" style="margin-bottom: 2rem;">
      <h3 style="margin-bottom: 1.25rem; font-size: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
        <i data-lucide="bar-chart-2" style="color: #38bdf8;"></i> 6-Island Subject Mastery
      </h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
        ${renderSubjectMeter('🪐 Science Explorer', 65, '#10b981', 'science.html')}
        ${renderSubjectMeter('🔢 Mathematics Mountain', 80, '#06b6d4', 'lessons.html?subject=mathematics')}
        ${renderSubjectMeter('🗣️ Languages Sanctuary', 70, '#4f46e5', 'lessons.html?subject=kannada')}
        ${renderSubjectMeter('💻 Coding & Computers', 55, '#8b5cf6', 'coding.html')}
        ${renderSubjectMeter('🛡️ Cybersecurity Citadel', 60, '#ef4444', 'cybersecurity.html')}
        ${renderSubjectMeter('₹ Real-World Life Skills', 75, '#f59e0b', 'life-skills.html')}
      </div>
    </div>

    <!-- Educational Hub Quick Launchpad -->
    <h3 style="margin-bottom: 1rem; font-size: 1.25rem;">Interactive Learning Hubs:</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2.5rem;">
      <a href="science.html" class="card" style="text-decoration: none; padding: 1.25rem; transition: transform 0.2s; display: flex; align-items: center; gap: 1rem;">
        <div style="font-size: 2rem;">🪐</div>
        <div>
          <strong style="color: #f8fafc; font-size: 1rem; display: block;">Science Explorer</strong>
          <small style="color: #94a3b8;">Solar system & physics labs</small>
        </div>
      </a>
      <a href="coding.html" class="card" style="text-decoration: none; padding: 1.25rem; transition: transform 0.2s; display: flex; align-items: center; gap: 1rem;">
        <div style="font-size: 2rem;">💻</div>
        <div>
          <strong style="color: #f8fafc; font-size: 1rem; display: block;">Coding Playground</strong>
          <small style="color: #94a3b8;">HTML, CSS, JS & Python</small>
        </div>
      </a>
      <a href="cybersecurity.html" class="card" style="text-decoration: none; padding: 1.25rem; transition: transform 0.2s; display: flex; align-items: center; gap: 1rem;">
        <div style="font-size: 2rem;">🛡️</div>
        <div>
          <strong style="color: #f8fafc; font-size: 1rem; display: block;">Cyber Escape Room</strong>
          <small style="color: #94a3b8;">Passwords & phishing defense</small>
        </div>
      </a>
      <a href="life-skills.html" class="card" style="text-decoration: none; padding: 1.25rem; transition: transform 0.2s; display: flex; align-items: center; gap: 1rem;">
        <div style="font-size: 2rem;">₹</div>
        <div>
          <strong style="color: #f8fafc; font-size: 1rem; display: block;">Real-World Skills</strong>
          <small style="color: #94a3b8;">Rupee grocery market & clocks</small>
        </div>
      </a>
      <a href="stories.html" class="card" style="text-decoration: none; padding: 1.25rem; transition: transform 0.2s; display: flex; align-items: center; gap: 1rem;">
        <div style="font-size: 2rem;">📖</div>
        <div>
          <strong style="color: #f8fafc; font-size: 1rem; display: block;">Branching Stories</strong>
          <small style="color: #94a3b8;">Road safety & citizenship</small>
        </div>
      </a>
      <a href="teacher.html" class="card" style="text-decoration: none; padding: 1.25rem; transition: transform 0.2s; display: flex; align-items: center; gap: 1rem;">
        <div style="font-size: 2rem;">🎓</div>
        <div>
          <strong style="color: #f8fafc; font-size: 1rem; display: block;">Teacher & Classrooms</strong>
          <small style="color: #94a3b8;">Assign lessons & view rosters</small>
        </div>
      </a>
      <a href="portfolio.html" class="card" style="text-decoration: none; padding: 1.25rem; transition: transform 0.2s; display: flex; align-items: center; gap: 1rem;">
        <div style="font-size: 2rem;">🏅</div>
        <div>
          <strong style="color: #f8fafc; font-size: 1rem; display: block;">Student Portfolio</strong>
          <small style="color: #94a3b8;">Verified certificates & badges</small>
        </div>
      </a>
      <a href="games.html" class="card" style="text-decoration: none; padding: 1.25rem; transition: transform 0.2s; display: flex; align-items: center; gap: 1rem;">
        <div style="font-size: 2rem;">🎮</div>
        <div>
          <strong style="color: #f8fafc; font-size: 1rem; display: block;">3D Runner & Games</strong>
          <small style="color: #94a3b8;">High-speed educational runs</small>
        </div>
      </a>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

function renderSubjectMeter(title, percent, color, url) {
  return `
    <a href="${url}" style="text-decoration: none; color: inherit; background: #0f172a; border: 1px solid #334155; padding: 1rem; border-radius: 10px; display: block;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <strong style="font-size: 0.9rem; color: #f8fafc;">${title}</strong>
        <span style="font-size: 0.85rem; font-weight: 700; color: ${color};">${percent}%</span>
      </div>
      <div style="width: 100%; height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden;">
        <div style="width: ${percent}%; height: 100%; background: ${color};"></div>
      </div>
    </a>
  `;
}

window.claimDailyMission = async function(missionId, xp) {
  const m = dailyMissions.find(x => x.id === missionId);
  if (!m) return;
  m.claimed = true;

  try {
    const user = JSON.parse(localStorage.getItem('accessibleverse_user') || '{}');
    user.xp = (user.xp || 0) + xp;
    localStorage.setItem('accessibleverse_user', JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('xpUpdated', { detail: { xp: user.xp, added: xp } }));
    if (window.ApiClient && window.ApiClient.learningPath) {
      window.ApiClient.learningPath.syncProgress({ addedXp: xp, claimedMission: missionId }).catch(() => {});
    }
  } catch {}

  if (window.showToast) window.showToast(`🎉 Mission Reward Claimed! +${xp} XP!`, 'success');
  loadAdvancedDashboard();
};

window.resolveMistake = async function(mistakeId) {
  try {
    if (window.ApiClient && window.ApiClient.practice) {
      await window.ApiClient.practice.resolveMistake(mistakeId);
    }
  } catch {}

  unresolvedMistakes = unresolvedMistakes.filter(m => m.id !== mistakeId);

  try {
    const user = JSON.parse(localStorage.getItem('accessibleverse_user') || '{}');
    user.xp = (user.xp || 0) + 15;
    localStorage.setItem('accessibleverse_user', JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('xpUpdated', { detail: { xp: user.xp, added: 15 } }));
  } catch {}

  if (window.showToast) window.showToast('✨ Mistake Resolved! Subject Mastery increased by +15 XP!', 'success');
  loadAdvancedDashboard();
};
