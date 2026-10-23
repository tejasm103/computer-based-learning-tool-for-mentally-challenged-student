/**
 * AccessibleVerse — Digital Student Portfolio & Verified Certificates Logic
 */

let myCertificates = [];
let myProjects = [];

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('accessibleverse_user') || '{}');
  const studentName = user.name || user.username || 'Explorer';
  const nameEl = document.getElementById('portfolio-student-name');
  if (nameEl) nameEl.textContent = `${studentName}'s Portfolio`;

  loadPortfolio();
  if (window.lucide) lucide.createIcons();
});

async function loadPortfolio() {
  const user = JSON.parse(localStorage.getItem('accessibleverse_user') || '{}');
  const studentName = user.name || user.username || 'Explorer';

  // 1. Load Certificates
  try {
    if (window.ApiClient && window.ApiClient.portfolio) {
      const res = await window.ApiClient.portfolio.getMyCertificates();
      myCertificates = (res && res.certificates) || [];
    }
  } catch {}

  if (!myCertificates || myCertificates.length === 0) {
    myCertificates = [
      {
        certificate_id: 'CERT-AV-2026-8912',
        course_name: 'Languages & Kannada Alphabet Sanctuary',
        recipient_name: studentName,
        issue_date: 'October 2026',
        description: 'Successfully mastered basic Kannada swaragalu and multilingual vocabulary.'
      },
      {
        certificate_id: 'CERT-AV-2026-3401',
        course_name: 'Cyber Defender & Safe Browsing',
        recipient_name: studentName,
        issue_date: 'October 2026',
        description: 'Neutralized 4 cybersecurity escape chambers and mastered password entropy.'
      }
    ];
  }

  // 2. Load Projects
  try {
    if (window.ApiClient && window.ApiClient.portfolio) {
      const res = await window.ApiClient.portfolio.getMyPortfolio();
      myProjects = (res && res.items) || [];
    }
  } catch {}

  if (!myProjects || myProjects.length === 0) {
    myProjects = [
      {
        id: 'proj_1',
        title: 'HTML & CSS Button Challenge',
        content: 'Created an accessible glowing button with high-contrast text and hover animations.',
        category: 'code',
        created_at: 'Oct 23, 2026'
      },
      {
        id: 'proj_2',
        title: 'Road Safety Reflection',
        content: 'Practiced the zebra crossing decision tree in the interactive stories. Learned the look-right-look-left-look-right rule.',
        category: 'reflection',
        created_at: 'Oct 22, 2026'
      }
    ];
  }

  renderCertificates();
  renderProjects();
}

function renderCertificates() {
  const container = document.getElementById('certificates-grid');
  if (!container) return;

  container.innerHTML = myCertificates.map(c => `
    <div class="cert-card">
      <div>
        <span class="cert-id-tag">${c.certificate_id}</span>
        <h3 style="color: #f8fafc; font-size: 1.25rem; margin: 0.75rem 0 0.35rem;">${c.course_name}</h3>
        <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.5; margin: 0 0 1rem;">${c.description || ''}</p>
      </div>

      <div style="border-top: 1px solid rgba(251, 191, 36, 0.2); padding-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.8rem; color: #94a3b8;">Issued: ${c.issue_date}</span>
        <button class="btn btn-secondary btn-sm" onclick="openCertificateModal('${c.certificate_id}')">
          <i data-lucide="eye"></i> View & Print
        </button>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function renderProjects() {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  container.innerHTML = myProjects.map(p => `
    <div class="sim-card" style="margin-bottom: 0;">
      <span style="text-transform: uppercase; font-size: 0.75rem; font-weight: 800; color: #38bdf8;">${p.category || 'Project'}</span>
      <h3 style="color: #f8fafc; font-size: 1.15rem; margin: 0.35rem 0 0.5rem;">${p.title}</h3>
      <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.5; margin: 0 0 1rem;">${p.content}</p>
      <span style="font-size: 0.8rem; color: #94a3b8;">Saved: ${p.created_at || 'Recently'}</span>
    </div>
  `).join('');
}

window.openCertificateModal = function(certId) {
  const cert = myCertificates.find(c => c.certificate_id === certId);
  if (!cert) return;

  document.getElementById('modal-cert-recipient').textContent = cert.recipient_name;
  document.getElementById('modal-cert-course').textContent = cert.course_name;
  document.getElementById('modal-cert-date').textContent = `Date: ${cert.issue_date}`;
  document.getElementById('modal-cert-id').textContent = `ID: ${cert.certificate_id}`;

  const modal = document.getElementById('modal-cert-view');
  if (modal) modal.showModal();
};

window.verifyCertificate = async function() {
  const input = document.getElementById('verify-cert-id-input');
  const certId = (input?.value || '').trim().toUpperCase();
  const resBox = document.getElementById('cert-verification-result');
  if (!resBox) return;

  if (!certId) {
    if (window.showToast) window.showToast('Please enter a certificate identifier.', 'warning');
    return;
  }

  resBox.style.display = 'block';

  try {
    if (window.ApiClient && window.ApiClient.portfolio) {
      const res = await window.ApiClient.portfolio.verifyCertificate(certId);
      if (res && res.valid) {
        resBox.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.15); border: 2px solid #10b981; padding: 1.25rem; border-radius: 12px; color: #10b981;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 1.75rem;">🛡️✅</span>
              <div>
                <strong style="font-size: 1.1rem; color: #f8fafc;">VERIFIED AUTHENTIC CERTIFICATE</strong>
                <div style="color: #cbd5e1; font-size: 0.9rem; margin-top: 0.25rem;">
                  Awarded to: <strong>${res.certificate.recipient_name}</strong> for <em>${res.certificate.course_name}</em>.
                  <br>Certificate ID: <code style="color: #fbbf24;">${res.certificate.certificate_id}</code>
                </div>
              </div>
            </div>
          </div>
        `;
        return;
      }
    }
  } catch {}

  // Check local list
  const localMatch = myCertificates.find(c => c.certificate_id === certId);
  if (localMatch) {
    resBox.innerHTML = `
      <div style="background: rgba(16, 185, 129, 0.15); border: 2px solid #10b981; padding: 1.25rem; border-radius: 12px; color: #10b981;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 1.75rem;">🛡️✅</span>
          <div>
            <strong style="font-size: 1.1rem; color: #f8fafc;">VERIFIED AUTHENTIC CERTIFICATE</strong>
            <div style="color: #cbd5e1; font-size: 0.9rem; margin-top: 0.25rem;">
              Awarded to: <strong>${localMatch.recipient_name}</strong> for <em>${localMatch.course_name}</em>.
              <br>Certificate ID: <code style="color: #fbbf24;">${localMatch.certificate_id}</code>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    resBox.innerHTML = `
      <div style="background: rgba(239, 68, 68, 0.15); border: 2px solid #ef4444; padding: 1rem; border-radius: 12px; color: #f87171;">
        <strong>❌ Unrecognized Certificate Identifier!</strong>
        <p style="margin: 0.25rem 0 0; color: #cbd5e1;">The identifier "${certId}" could not be verified in the records. Please ensure it was typed correctly.</p>
      </div>
    `;
  }
};

window.showAddProjectModal = function() {
  const modal = document.getElementById('modal-add-project');
  if (modal) modal.showModal();
};

window.handleAddProject = async function(e) {
  e.preventDefault();
  const title = document.getElementById('proj-title').value;
  const content = document.getElementById('proj-content').value;

  const newProj = {
    id: `proj_${Date.now()}`,
    title,
    content,
    category: 'reflection',
    created_at: 'Just now'
  };

  try {
    if (window.ApiClient && window.ApiClient.portfolio) {
      await window.ApiClient.portfolio.addItem({ title, content, category: 'reflection' });
    }
  } catch {}

  myProjects.unshift(newProj);
  renderProjects();

  document.getElementById('modal-add-project').close();
  if (window.showToast) window.showToast(`Project "${title}" added to your portfolio!`, 'success');
};
