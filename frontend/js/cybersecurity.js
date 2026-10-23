/**
 * AccessibleVerse — Cybersecurity Escape Room Game Logic
 * 4 Interactive Chambers: Phishing Detector, Password Vault, Wi-Fi/SSL, Privacy Inspector
 */

const PHISHING_EMAILS = [
  {
    id: 'phish_1',
    from: 'security-alert@micros0ft-support-urgent.ru',
    subject: '🚨 URGENT: Your account will be DELETED in 2 hours!',
    body: 'Dear Customer, suspicious activity was found. Click here immediately to verify your password or lose all data: http://update-login-verify.xyz/login.exe',
    isSafe: false,
    redFlags: 'Fake sender domain (@micros0ft-support-urgent.ru), urgent threat, generic greeting, suspicious .exe link.'
  },
  {
    id: 'phish_2',
    from: 'principal@greenwood-high.edu.in',
    subject: 'Upcoming Annual Science Exhibition & Parent Notice',
    body: 'Hello Students, please review the schedule for tomorrow\'s Science Fair in the main auditorium at 10:00 AM. Best regards, Greenwood High.',
    isSafe: true,
    redFlags: 'Verified school domain (.edu.in), calm tone, official schedule announcement with no password requests.'
  },
  {
    id: 'phish_3',
    from: 'prize-winner@freelottery-winner-million.biz',
    subject: '🎉 YOU WON ₹5,00,000! Claim Your Cash Today!',
    body: 'Congratulations! You have been randomly chosen. Send your bank account number and UPI PIN immediately to claim your winnings.',
    isSafe: false,
    redFlags: 'Too-good-to-be-true promise, asking for private bank details & UPI PIN, unknown sender.'
  }
];

const WIFI_NETWORKS = [
  { id: 'wifi_1', ssid: 'FREE_AIRPORT_SUPERFAST_NO_PASSWORD', sec: 'None (Open / Unencrypted)', safe: false, desc: 'Hacker rogue hotspot without encryption. Sniffers can read every webpage you open!' },
  { id: 'wifi_2', ssid: 'Airport_Official_Guest_WPA3', sec: 'WPA3 Enterprise (HTTPS)', safe: true, desc: 'Legitimate encrypted airport network. All packets are encrypted.' },
  { id: 'wifi_3', ssid: 'CoffeeShop_Free_HTTP', sec: 'WEP (Obsolete / Insecure)', safe: false, desc: 'Outdated, easily broken encryption. Transmits passwords in clear text.' }
];

const SOCIAL_POSTS = [
  { id: 'post_1', text: '🏆 Won first prize in the school district chess tournament today! So proud of our team!', isUnsafe: false, tag: 'Safe Achievement' },
  { id: 'post_2', text: '✈️ Off to Goa for 2 whole weeks! Our house at 42 Maple Street is completely empty until Nov 10th!', isUnsafe: true, tag: '⚠️ Burglary Risk: Exposed home address & empty home dates' },
  { id: 'post_3', text: '🎂 Can\'t believe I was born on 14th August 2011! Celebrating my birthday with mom today!', isUnsafe: true, tag: '⚠️ Identity Theft Risk: Full Date of Birth is used to reset bank security questions' },
  { id: 'post_4', text: '📚 Reading my favorite mystery book in the library.', isUnsafe: false, tag: 'Safe Hobby Post' }
];

let currentChamber = 1;
let selectedEmailId = null;
let selectedWifiId = null;
let vpnEnabled = false;
let flaggedPosts = new Set();

document.addEventListener('DOMContentLoaded', () => {
  renderChamber1();
  renderChamber3();
  renderChamber4();
  if (window.lucide) lucide.createIcons();
});

// CHAMBER 1: PHISHING
function renderChamber1() {
  const container = document.getElementById('phishing-inbox');
  if (!container) return;
  container.innerHTML = PHISHING_EMAILS.map(e => `
    <div class="email-item" id="card-${e.id}" onclick="selectEmail('${e.id}')">
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
        <strong style="color: #f8fafc; font-size: 1rem;">${e.subject}</strong>
        <span style="font-size: 0.8rem; color: #94a3b8;">From: ${e.from}</span>
      </div>
      <p style="color: #cbd5e1; margin: 0.5rem 0; font-size: 0.9rem;">${e.body}</p>
    </div>
  `).join('');
}

window.selectEmail = function(id) {
  selectedEmailId = id;
  document.querySelectorAll('.email-item').forEach(el => el.classList.remove('selected'));
  const card = document.getElementById(`card-${id}`);
  if (card) card.classList.add('selected');

  const email = PHISHING_EMAILS.find(e => e.id === id);
  const fb = document.getElementById('chamber-1-feedback');
  fb.style.display = 'block';

  if (email.isSafe) {
    fb.innerHTML = `
      <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; padding: 1rem; border-radius: 8px; color: #10b981;">
        <strong>✅ Correct! You identified the legitimate school email!</strong>
        <p style="margin: 0.25rem 0 0.75rem; color: #e2e8f0;">${email.redFlags}</p>
        <button class="btn btn-primary btn-sm" onclick="advanceChamber(2)">
          Proceed to Chamber 2: Password Vault <i data-lucide="arrow-right"></i>
        </button>
      </div>
    `;
  } else {
    fb.innerHTML = `
      <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; padding: 1rem; border-radius: 8px; color: #f87171;">
        <strong>❌ Phishing Trap Triggered!</strong>
        <p style="margin: 0.25rem 0;">Why this is dangerous: ${email.redFlags}</p>
        <small style="color: #e2e8f0;">Always check the sender domain and never click urgent password links. Try selecting the real safe email!</small>
      </div>
    `;
  }
  if (window.lucide) lucide.createIcons();
};

// CHAMBER 2: PASSWORD VAULT
window.testPasswordStrength = function(pass) {
  const lenValid = pass.length >= 12;
  const upperValid = /[A-Z]/.test(pass);
  const lowerValid = /[a-z]/.test(pass);
  const numValid = /[0-9]/.test(pass);
  const symValid = /[^A-Za-z0-9]/.test(pass);

  updateRule('rule-len', lenValid, '12+ Characters');
  updateRule('rule-upper', upperValid, 'Uppercase Letter (A-Z)');
  updateRule('rule-lower', lowerValid, 'Lowercase Letter (a-z)');
  updateRule('rule-num', numValid, 'Number (0-9)');
  updateRule('rule-sym', symValid, 'Special Symbol (!@#$)');

  let score = 0;
  if (lenValid) score += 25;
  if (upperValid && lowerValid) score += 25;
  if (numValid) score += 25;
  if (symValid) score += 25;

  const fill = document.getElementById('pass-meter-fill');
  const label = document.getElementById('pass-strength-label');
  const crack = document.getElementById('pass-crack-time');

  fill.style.width = `${score}%`;

  if (score < 50) {
    fill.style.background = '#ef4444';
    label.textContent = 'Strength: Weak';
    crack.textContent = 'Crack Time: ~3 seconds';
  } else if (score < 100) {
    fill.style.background = '#f59e0b';
    label.textContent = 'Strength: Moderate';
    crack.textContent = 'Crack Time: ~2 weeks';
  } else {
    fill.style.background = '#10b981';
    label.textContent = 'Strength: Unbreakable (Fortress)';
    crack.textContent = 'Crack Time: 400,000+ Years';
  }
};

function updateRule(elId, valid, text) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.style.color = valid ? '#10b981' : '#ef4444';
  el.innerHTML = `${valid ? '✅' : '❌'} ${text}`;
}

window.submitPasswordChamber = function() {
  const pass = document.getElementById('vault-password-input')?.value || '';
  const fb = document.getElementById('chamber-2-feedback');
  fb.style.display = 'block';

  if (pass.length >= 12 && /[A-Z]/.test(pass) && /[a-z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) {
    fb.innerHTML = `
      <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; padding: 1rem; border-radius: 8px; color: #10b981;">
        <strong>🔓 Vault Unlocked! High Cryptographic Entropy Achieved!</strong>
        <p style="margin: 0.25rem 0 0.75rem; color: #e2e8f0;">Computers cannot crack this combination without billions of trial attempts.</p>
        <button class="btn btn-primary btn-sm" onclick="advanceChamber(3)">
          Proceed to Chamber 3: Wi-Fi Defense <i data-lucide="arrow-right"></i>
        </button>
      </div>
    `;
  } else {
    fb.innerHTML = `
      <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; padding: 1rem; border-radius: 8px; color: #f87171;">
        <strong>🔒 Vault Remains Locked!</strong>
        <p style="margin: 0.25rem 0;">Please ensure all 5 requirements are met (length, upper, lower, numbers, symbols).</p>
      </div>
    `;
  }
  if (window.lucide) lucide.createIcons();
};

// CHAMBER 3: WI-FI & SSL
function renderChamber3() {
  const list = document.getElementById('wifi-networks-list');
  if (!list) return;
  list.innerHTML = WIFI_NETWORKS.map(w => `
    <div class="email-item" id="wifi-card-${w.id}" onclick="selectWifi('${w.id}')">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong style="color: #f8fafc; font-size: 1rem;">📶 ${w.ssid}</strong>
          <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.2rem;">Security: ${w.sec}</div>
        </div>
        <span style="font-size: 0.85rem; color: ${w.safe ? '#10b981' : '#f59e0b'};">
          ${w.safe ? '🔒 Encrypted' : '⚠️ Vulnerable'}
        </span>
      </div>
    </div>
  `).join('');
}

window.selectWifi = function(id) {
  selectedWifiId = id;
  document.querySelectorAll('#wifi-networks-list .email-item').forEach(el => el.classList.remove('selected'));
  const card = document.getElementById(`wifi-card-${id}`);
  if (card) card.classList.add('selected');
};

window.toggleVpn = function() {
  vpnEnabled = !vpnEnabled;
  const btn = document.getElementById('vpn-toggle-btn');
  if (btn) {
    btn.innerHTML = vpnEnabled ? '<i data-lucide="shield-check"></i> VPN: ACTIVE (Encrypted)' : '<i data-lucide="shield-off"></i> VPN: OFF';
    btn.className = vpnEnabled ? 'btn btn-primary' : 'btn btn-secondary';
  }
  if (window.lucide) lucide.createIcons();
};

window.submitWifiChamber = function() {
  const fb = document.getElementById('chamber-3-feedback');
  fb.style.display = 'block';

  const chosen = WIFI_NETWORKS.find(w => w.id === selectedWifiId);
  if (!chosen) {
    fb.innerHTML = '<div style="color: #ef4444;">Please select a Wi-Fi network first.</div>';
    return;
  }

  if (chosen.safe && vpnEnabled) {
    fb.innerHTML = `
      <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; padding: 1rem; border-radius: 8px; color: #10b981;">
        <strong>✅ Ironclad Connection Established!</strong>
        <p style="margin: 0.25rem 0 0.75rem; color: #e2e8f0;">You chose WPA3 Enterprise encryption AND activated a VPN tunnel. Any hacker attempting to sniff packets sees only garbled ciphertext!</p>
        <button class="btn btn-primary btn-sm" onclick="advanceChamber(4)">
          Proceed to Chamber 4: Privacy Inspector <i data-lucide="arrow-right"></i>
        </button>
      </div>
    `;
  } else {
    fb.innerHTML = `
      <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; padding: 1rem; border-radius: 8px; color: #f87171;">
        <strong>⚠️ Security Risk Detected!</strong>
        <p style="margin: 0.25rem 0;">${chosen.desc} ${!vpnEnabled ? '<br>Also: You left your VPN turned OFF on a public hotspot!' : ''}</p>
        <small style="color: #e2e8f0;">Choose the safe official network and turn ON the VPN shield.</small>
      </div>
    `;
  }
  if (window.lucide) lucide.createIcons();
};

// CHAMBER 4: PRIVACY INSPECTOR
function renderChamber4() {
  const list = document.getElementById('social-posts-list');
  if (!list) return;
  list.innerHTML = SOCIAL_POSTS.map(p => `
    <div class="email-item" id="post-card-${p.id}" onclick="togglePostFlag('${p.id}')">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
        <p style="margin: 0; color: #e2e8f0; font-size: 0.95rem;">"${p.text}"</p>
        <button class="btn btn-secondary btn-sm" id="flag-btn-${p.id}">
          <i data-lucide="flag"></i> Flag Unsafe
        </button>
      </div>
    </div>
  `).join('');
}

window.togglePostFlag = function(id) {
  if (flaggedPosts.has(id)) {
    flaggedPosts.delete(id);
  } else {
    flaggedPosts.add(id);
  }

  const card = document.getElementById(`post-card-${id}`);
  const btn = document.getElementById(`flag-btn-${id}`);
  const isFlagged = flaggedPosts.has(id);

  if (card) card.classList.toggle('selected', isFlagged);
  if (btn) {
    btn.innerHTML = isFlagged ? '<i data-lucide="alert-triangle"></i> Flagged as Risk' : '<i data-lucide="flag"></i> Flag Unsafe';
    btn.className = isFlagged ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
  }
  if (window.lucide) lucide.createIcons();
};

window.submitPrivacyChamber = function() {
  const fb = document.getElementById('chamber-4-feedback');
  fb.style.display = 'block';

  // Posts 2 and 3 are unsafe
  const correctFlags = flaggedPosts.has('post_2') && flaggedPosts.has('post_3') && !flaggedPosts.has('post_1') && !flaggedPosts.has('post_4');

  if (correctFlags) {
    // Escape Complete!
    document.getElementById('chamber-4').style.display = 'none';
    document.getElementById('escape-victory').style.display = 'block';

    // Award XP
    try {
      const user = JSON.parse(localStorage.getItem('accessibleverse_user') || '{}');
      user.xp = (user.xp || 0) + 50;
      user.achievements = user.achievements || [];
      if (!user.achievements.includes('cyber_defender')) {
        user.achievements.push('cyber_defender');
      }
      localStorage.setItem('accessibleverse_user', JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('xpUpdated', { detail: { xp: user.xp, added: 50 } }));
      if (window.ApiClient && window.ApiClient.learningPath) {
        window.ApiClient.learningPath.syncProgress({ addedXp: 50, achievement: 'cyber_defender' }).catch(() => {});
      }
    } catch {}

    if (window.showToast) {
      window.showToast('🏆 Escape Room Cleared! +50 XP Awarded!', 'success');
    }
  } else {
    fb.innerHTML = `
      <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; padding: 1rem; border-radius: 8px; color: #f87171;">
        <strong>⚠️ Audit Incomplete!</strong>
        <p style="margin: 0.25rem 0;">Examine which posts reveal personal identifiable information (home addresses, vacation vacancy dates, exact birthday dates). Do not flag posts that just celebrate safe hobbies or chess!</p>
      </div>
    `;
  }
  if (window.lucide) lucide.createIcons();
};

window.advanceChamber = function(nextNum) {
  currentChamber = nextNum;
  for (let i = 1; i <= 4; i++) {
    const ch = document.getElementById(`chamber-${i}`);
    const st = document.getElementById(`step-chamber-${i}`);
    if (ch) ch.style.display = i === nextNum ? 'block' : 'none';
    if (st) {
      st.classList.toggle('active', i === nextNum);
      if (i < nextNum) st.classList.add('completed');
    }
  }
  window.scrollTo({ top: 150, behavior: 'smooth' });
  if (window.lucide) lucide.createIcons();
};

window.getChamberHint = function(chamberNum) {
  const hints = {
    1: 'Look at the sender email address after the @ symbol. Official schools use domains like .edu or .edu.in, while scammers use bizarre random domains and urgent panic threats.',
    2: 'A great passphrase formula is 3 or 4 random capitalized words glued with numbers and punctuation symbols, e.g. "Sunset#Tiger$9821".',
    3: 'Public Wi-Fi networks without padlocks (open networks) let anyone intercept your web traffic. Always choose WPA3 / HTTPS and activate a VPN shield.',
    4: 'Identity thieves and burglars scour social media for: (1) Empty home vacation announcements with full street addresses, and (2) Full birthdates which are used to bypass bank security.'
  };

  if (window.showToast) {
    window.showToast(`💡 Clue: ${hints[chamberNum]}`, 'info');
  } else {
    alert(hints[chamberNum]);
  }
};
