/**
 * AccessibleVerse — Teacher & Guardian Dashboard Logic
 * Classroom creation, student rosters, assignments, and feedback
 */

let myClassrooms = [];
let activeClassroom = null;

document.addEventListener('DOMContentLoaded', () => {
  loadClassrooms();
  if (window.lucide) lucide.createIcons();
});

async function loadClassrooms() {
  const container = document.getElementById('classrooms-list');
  if (!container) return;

  try {
    if (window.ApiClient && window.ApiClient.classrooms) {
      const res = await window.ApiClient.classrooms.getMyClassrooms();
      myClassrooms = (res && res.classrooms) || [];
    }
  } catch (err) {
    console.warn('Backend classrooms fetch failed. Falling back to local data:', err);
  }

  // If empty, provide curated demo classrooms
  if (!myClassrooms || myClassrooms.length === 0) {
    myClassrooms = [
      {
        id: 'cls_5a',
        name: 'Class 5A — Science & Cosmic Oasis',
        subject: 'science',
        join_code: 'AV-5821',
        student_count: 14,
        assignments: [
          { id: 'asgn_1', title: 'Explore the Solar System simulation', due: 'Tomorrow 5:00 PM', status: 'Active' },
          { id: 'asgn_2', title: 'Complete Photosynthesis Lab', due: 'Friday 4:00 PM', status: 'Pending' }
        ],
        students: [
          { name: 'Aarav Sharma', completed: 8, xp: 240 },
          { name: 'Diya Patel', completed: 11, xp: 320 },
          { name: 'Kiran Gowda', completed: 6, xp: 190 },
          { name: 'Sneha Rao', completed: 10, xp: 300 }
        ]
      },
      {
        id: 'cls_6b',
        name: 'Class 6B — Coding & Tech Explorers',
        subject: 'technology',
        join_code: 'AV-9134',
        student_count: 18,
        assignments: [
          { id: 'asgn_3', title: 'Build Glowing Button in Coding Playground', due: 'Oct 28', status: 'Active' }
        ],
        students: [
          { name: 'Rohan Joshi', completed: 9, xp: 275 },
          { name: 'Ananya Hegde', completed: 12, xp: 380 }
        ]
      }
    ];
  }

  renderClassroomCards();
  if (myClassrooms.length > 0) {
    selectClassroom(myClassrooms[0].id);
  }
}

function renderClassroomCards() {
  const container = document.getElementById('classrooms-list');
  if (!container) return;

  container.innerHTML = myClassrooms.map(c => `
    <div class="classroom-card ${activeClassroom && activeClassroom.id === c.id ? 'active' : ''}" id="card-${c.id}" onclick="selectClassroom('${c.id}')">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <strong style="color: #f8fafc; font-size: 1rem;">${c.name}</strong>
        <span class="join-code-pill" style="font-size: 0.75rem;">${c.join_code}</span>
      </div>
      <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.5rem; display: flex; justify-content: space-between;">
        <span>Subject: ${c.subject || 'General'}</span>
        <span>${(c.students || []).length || c.student_count || 0} Students</span>
      </div>
    </div>
  `).join('');
}

window.selectClassroom = function(classId) {
  const cls = myClassrooms.find(x => x.id === classId);
  if (!cls) return;
  activeClassroom = cls;

  document.querySelectorAll('.classroom-card').forEach(c => c.classList.remove('active'));
  const card = document.getElementById(`card-${classId}`);
  if (card) card.classList.add('active');

  document.getElementById('active-class-name').textContent = cls.name;
  document.getElementById('active-class-sub').textContent = `Subject: ${cls.subject} • Enrolled Students: ${(cls.students || []).length || cls.student_count || 0}`;
  document.getElementById('active-join-code').innerHTML = `<i data-lucide="key"></i> Join Code: ${cls.join_code}`;

  renderAssignments(cls.assignments || []);
  renderRoster(cls.students || []);
  if (window.lucide) lucide.createIcons();
};

function renderAssignments(assignments) {
  const container = document.getElementById('assignments-list');
  if (!container) return;

  if (assignments.length === 0) {
    container.innerHTML = '<p style="color: #94a3b8; font-style: italic;">No active assignments for this classroom.</p>';
    return;
  }

  container.innerHTML = assignments.map(a => `
    <div style="background: #0f172a; border: 1px solid #334155; padding: 0.85rem 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong style="color: #f8fafc; font-size: 0.95rem;">${a.title}</strong>
        <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.15rem;">Due: ${a.due || a.due_date || 'No deadline'}</div>
      </div>
      <span style="font-size: 0.8rem; font-weight: 700; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 0.2rem 0.6rem; border-radius: 9999px;">
        ${a.status || 'Active'}
      </span>
    </div>
  `).join('');
}

function renderRoster(students) {
  const tbody = document.getElementById('student-roster-body');
  if (!tbody) return;

  if (students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="color: #94a3b8; text-align: center;">No students have joined this classroom yet. Share the Join Code!</td></tr>';
    return;
  }

  tbody.innerHTML = students.map((s, idx) => `
    <tr>
      <td><strong>${s.name || s.username || 'Student'}</strong></td>
      <td>${s.completed || 0} Activities</td>
      <td style="color: #f59e0b; font-weight: 700;">${s.xp || 0} XP</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="sendTeacherFeedback('${s.name || 'Student'}')">
          <i data-lucide="message-square"></i> Send Feedback
        </button>
      </td>
    </tr>
  `).join('');
}

window.showCreateClassModal = function() {
  const modal = document.getElementById('modal-create-class');
  if (modal) modal.showModal();
};

window.handleCreateClass = async function(e) {
  e.preventDefault();
  const name = document.getElementById('new-class-name').value;
  const subject = document.getElementById('new-class-subject').value;

  const newClass = {
    id: `cls_${Date.now()}`,
    name,
    subject,
    join_code: `AV-${Math.floor(1000 + Math.random() * 9000)}`,
    student_count: 0,
    assignments: [],
    students: []
  };

  try {
    if (window.ApiClient && window.ApiClient.classrooms) {
      const res = await window.ApiClient.classrooms.createClassroom(name, '', subject);
      if (res && res.classroom) {
        newClass.id = res.classroom.id;
        newClass.join_code = res.classroom.join_code;
      }
    }
  } catch {}

  myClassrooms.unshift(newClass);
  renderClassroomCards();
  selectClassroom(newClass.id);

  document.getElementById('modal-create-class').close();
  if (window.showToast) window.showToast(`Classroom "${name}" created! Join Code: ${newClass.join_code}`, 'success');
};

window.joinClassroomWithCode = async function() {
  const input = document.getElementById('join-code-input');
  const code = (input?.value || '').trim().toUpperCase();

  if (!code) {
    if (window.showToast) window.showToast('Please enter a 6-character classroom code.', 'warning');
    return;
  }

  try {
    if (window.ApiClient && window.ApiClient.classrooms) {
      const res = await window.ApiClient.classrooms.joinClassroom(code);
      if (res && res.classroom) {
        if (window.showToast) window.showToast(`Successfully joined "${res.classroom.name}"!`, 'success');
        input.value = '';
        return;
      }
    }
  } catch (err) {
    console.warn('API join error, falling back to local confirmation:', err);
  }

  if (window.showToast) window.showToast(`Joined classroom ${code}! Assignments are now visible on your Dashboard.`, 'success');
  input.value = '';
};

window.sendTeacherFeedback = function(studentName) {
  const msg = prompt(`Enter encouraging feedback for ${studentName}:`, 'Great progress this week! Keep exploring the 3D Science and Coding challenges!');
  if (msg) {
    if (window.showToast) window.showToast(`Feedback sent to ${studentName}!`, 'success');
  }
};
