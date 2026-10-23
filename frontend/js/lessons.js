/**
 * AccessibleVerse — Educational Lessons & Curriculum Engine
 * Multilingual Alphabet Readers, Mathematics Tables 1-20, Road Safety, and Coding Sandbox.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('lessons-grid-container');
  if (!container) return;

  // Read URL query params (e.g. ?subject=kannada)
  const urlParams = new URLSearchParams(window.location.search);
  let activeSubject = urlParams.get('subject') || 'all';

  setupFilters(activeSubject);
  await loadLessons(activeSubject);
});

function setupFilters(currentSubject) {
  const filterBtns = document.querySelectorAll('.subject-filter-btn');
  filterBtns.forEach(btn => {
    const sub = btn.getAttribute('data-subject');
    if (sub === currentSubject) btn.classList.add('active');

    btn.addEventListener('click', async () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const selected = btn.getAttribute('data-subject');
      await loadLessons(selected);
    });
  });
}

async function loadLessons(subject = 'all') {
  const container = document.getElementById('lessons-grid-container');
  if (!container) return;

  container.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
      <i data-lucide="loader" class="spin" style="width: 32px; height: 32px; color: var(--primary);"></i>
      <p style="margin-top: 0.75rem;">Loading curriculum lessons...</p>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();

  const params = (subject !== 'all') ? { subject } : {};
  const lessons = await window.api.lessons.getAll(params);

  if (!lessons || lessons.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
        <p>No lessons found in this category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  lessons.forEach(lesson => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';

    let badgeClass = 'badge-primary';
    if (lesson.subject === 'mathematics') badgeClass = 'badge-secondary';
    if (lesson.subject === 'everyday') badgeClass = 'badge-emerald';
    if (lesson.subject === 'technology') badgeClass = 'badge-rose';

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
        <span class="badge ${badgeClass}">${lesson.subject}</span>
        <span class="badge badge-amber"><i data-lucide="zap"></i> +${lesson.xp} XP</span>
      </div>

      <h3 style="margin-bottom: 0.5rem; font-size: 1.25rem;">${lesson.title}</h3>
      <p style="font-size: 0.92rem; margin-bottom: 1.5rem; flex: 1;">${lesson.description}</p>

      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <button class="btn btn-primary btn-sm open-lesson-btn" data-id="${lesson.id}" style="flex: 1;">
          <i data-lucide="book-open"></i> Open Lesson
        </button>
        <button class="btn btn-secondary btn-sm btn-icon listen-lesson-btn" data-speak="${lesson.title}. ${lesson.description}" title="Listen to Summary">
          <i data-lucide="volume-2"></i>
        </button>
      </div>
    `;

    card.querySelector('.open-lesson-btn').addEventListener('click', () => {
      openLessonModal(lesson);
    });

    container.appendChild(card);
  });

  if (window.lucide) window.lucide.createIcons();
}

function openLessonModal(lesson) {
  let modalBackdrop = document.getElementById('lesson-viewer-modal');
  if (!modalBackdrop) {
    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'lesson-viewer-modal';
    modalBackdrop.className = 'a11y-modal-backdrop';
    document.body.appendChild(modalBackdrop);
  }

  modalBackdrop.innerHTML = `
    <div class="a11y-panel" style="max-width: 780px;">
      <div class="a11y-panel-header">
        <div>
          <span class="badge badge-primary" style="margin-bottom: 0.25rem;">${lesson.subject} • Level: ${lesson.level}</span>
          <h3 id="modal-lesson-title">${lesson.title}</h3>
        </div>
        <button class="a11y-close-btn" onclick="document.getElementById('lesson-viewer-modal').classList.remove('active')">&times;</button>
      </div>

      <!-- Lesson Body -->
      <div id="modal-lesson-body" style="padding: 1rem 0; overflow-y: auto; max-height: 55vh;">
        ${renderLessonContent(lesson)}
      </div>

      <!-- Footer Action -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 1rem;">
        <span class="badge badge-amber"><i data-lucide="award"></i> Completion Reward: +${lesson.xp} XP</span>
        <button class="btn btn-primary" id="mark-lesson-complete-btn" data-id="${lesson.id}">
          <i data-lucide="check-circle-2"></i> Mark Lesson Completed
        </button>
      </div>
    </div>
  `;

  modalBackdrop.classList.add('active');
  if (window.lucide) window.lucide.createIcons();

  // Completion listener
  modalBackdrop.querySelector('#mark-lesson-complete-btn').addEventListener('click', async () => {
    const res = await window.api.lessons.complete(lesson.id);
    window.showToast(`🎉 Lesson Completed! +${res.xp_gained || lesson.xp} XP added to your profile!`, "success");
    modalBackdrop.classList.remove('active');
  });
}

function renderLessonContent(lesson) {
  // 1. Kannada Vowels
  if (lesson.id === 'kn-varnamale-1') {
    const vowels = lesson.content?.vowels || [];
    return `
      <p style="margin-bottom: 1.25rem;">Click any Kannada letter below to listen to authentic synthetic audio pronunciation:</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.75rem;">
        ${vowels.map(v => `
          <button class="card card-glass" style="text-align: center; padding: 1rem; cursor: pointer; border-radius: var(--radius-md);" data-speak="${v.letter}, ${v.word}" data-lang="kn">
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--primary); font-family: var(--font-kannada);">${v.letter}</div>
            <div style="font-size: 0.85rem; font-weight: 600;">${v.trans}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">${v.word}</div>
          </button>
        `).join('')}
      </div>
    `;
  }

  // 2. Kannada Consonants
  if (lesson.id === 'kn-vyanjana-1') {
    const cons = lesson.content?.consonants || [];
    return `
      <p style="margin-bottom: 1.25rem;">Click any Kannada consonant (ವ್ಯಂಜನ) to hear its sound:</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.75rem;">
        ${cons.map(c => `
          <button class="card card-glass" style="text-align: center; padding: 1rem; cursor: pointer; border-radius: var(--radius-md);" data-speak="${c.letter}, ${c.word}" data-lang="kn">
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--secondary-hover); font-family: var(--font-kannada);">${c.letter}</div>
            <div style="font-size: 0.85rem; font-weight: 600;">${c.trans}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">${c.word}</div>
          </button>
        `).join('')}
      </div>
    `;
  }

  // 3. Hindi Alphabet
  if (lesson.id === 'hi-varnamala-1') {
    const vowels = lesson.content?.vowels || [];
    const consonants = lesson.content?.consonants || [];
    return `
      <h4 style="margin-bottom: 0.75rem;">हिंदी स्वर (Hindi Vowels)</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
        ${vowels.map(v => `
          <button class="card card-glass" style="text-align: center; padding: 0.9rem; cursor: pointer;" data-speak="${v.letter}, ${v.word}" data-lang="hi">
            <div style="font-size: 2rem; font-weight: 800; color: var(--primary); font-family: var(--font-devanagari);">${v.letter}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${v.word}</div>
          </button>
        `).join('')}
      </div>

      <h4 style="margin-bottom: 0.75rem;">हिंदी व्यंजन (Hindi Consonants)</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.75rem;">
        ${consonants.map(c => `
          <button class="card card-glass" style="text-align: center; padding: 0.9rem; cursor: pointer;" data-speak="${c.letter}, ${c.word}" data-lang="hi">
            <div style="font-size: 2rem; font-weight: 800; color: var(--secondary-hover); font-family: var(--font-devanagari);">${c.letter}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${c.word}</div>
          </button>
        `).join('')}
      </div>
    `;
  }

  // 4. English Phonics
  if (lesson.id === 'en-alphabet-phonics') {
    const letters = lesson.content?.letters || [];
    return `
      <p style="margin-bottom: 1.25rem;">Explore English Phonics letters A–Z. Click to hear each sound:</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem;">
        ${letters.map(l => `
          <button class="card card-glass" style="text-align: center; padding: 1rem; cursor: pointer;" data-speak="${l.upper} ${l.lower}. ${l.sound}. ${l.word}">
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--primary);">${l.upper} ${l.lower}</div>
            <div style="font-size: 0.85rem; font-weight: 600;">${l.sound}</div>
            <div style="font-size: 0.8rem; color: var(--accent); margin-top: 0.2rem;">${l.word}</div>
          </button>
        `).join('')}
      </div>
    `;
  }

  // 5. Mathematics Tables 1 to 20
  if (lesson.id === 'math-multiplication-tables') {
    return `
      <p style="margin-bottom: 1rem;">Select any Multiplication Table from 1 to 20 to view and recite:</p>
      <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
        ${Array.from({length: 20}, (_, i) => i + 1).map(num => `
          <button class="btn btn-sm btn-secondary" onclick="renderTableCards(${num})">Table of ${num}</button>
        `).join('')}
      </div>
      <div id="table-display-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.6rem;">
        <!-- Default Table of 7 -->
        ${Array.from({length: 10}, (_, i) => i + 1).map(i => `
          <div class="card card-glass" style="text-align: center; padding: 0.75rem; font-weight: 700; cursor: pointer;" data-speak="7 times ${i} is ${7 * i}">
            7 × ${i} = <span style="color: var(--primary);">${7 * i}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 6. Traffic Safety
  if (lesson.id === 'life-traffic-safety') {
    return `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div class="card card-glass" style="border-left: 4px solid #ef4444;">
          <h4>🔴 Red Light: STOP</h4>
          <p>Vehicles must come to a full stop before the stop line. Never jump a red light.</p>
        </div>
        <div class="card card-glass" style="border-left: 4px solid #eab308;">
          <h4>🟡 Yellow Light: CAUTION & WAIT</h4>
          <p>Prepare to stop safely. Do not speed through the intersection.</p>
        </div>
        <div class="card card-glass" style="border-left: 4px solid #22c55e;">
          <h4>🟢 Green Light: GO SAFELY</h4>
          <p>Proceed when the intersection is clear and pedestrians have crossed.</p>
        </div>
        <div class="card card-glass" style="border-left: 4px solid var(--primary);">
          <h4>🦓 Zebra Crossing Etiquette</h4>
          <p>Pedestrians must always cross on the designated zebra stripes. Look Left, Look Right, and Look Left again before stepping on the road.</p>
        </div>
      </div>
    `;
  }

  // 7. Coding & Technology Sandbox
  if (lesson.id === 'cs-coding-intro') {
    return `
      <p style="margin-bottom: 1rem;">Interactive Beginner Coding Sandbox: Explore HTML & Python syntax!</p>
      <div class="card card-glass" style="margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span class="badge badge-primary">HTML Code Example</span>
          <button class="btn btn-sm btn-secondary" onclick="window.runHtmlSnippet()">Run Preview</button>
        </div>
        <pre style="background: #0f172a; color: #38bdf8; padding: 1rem; border-radius: var(--radius-sm); overflow-x: auto; font-family: monospace; font-size: 0.9rem;">
&lt;h1&gt;Hello World!&lt;/h1&gt;
&lt;p&gt;Welcome to my accessible webpage!&lt;/p&gt;
&lt;button style="background: #4f46e5; color: white;"&gt;Click Me!&lt;/button&gt;</pre>
        <div id="html-code-preview" style="margin-top: 1rem; padding: 1rem; background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-sm); display: none;"></div>
      </div>

      <div class="card card-glass">
        <span class="badge badge-emerald" style="margin-bottom: 0.5rem;">Python Friendly Logic</span>
        <pre style="background: #0f172a; color: #4ade80; padding: 1rem; border-radius: var(--radius-sm); overflow-x: auto; font-family: monospace; font-size: 0.9rem;">
# Python Greeter Program
name = "Explorer"
print(f"Welcome to AccessibleVerse, {name}!")

# Multiplication practice
for i in range(1, 6):
    print(f"5 x {i} = {5 * i}")</pre>
      </div>
    `;
  }

  // Default Fallback
  return `
    <p>${lesson.description}</p>
    <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-hover); border-radius: var(--radius-md);">
      <strong>Study Topics:</strong>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem; color: var(--text-muted);">
        <li>Core concepts and real-world examples</li>
        <li>Spoken pronunciation and phonetic guides</li>
        <li>Review quiz available in the Quiz section</li>
      </ul>
    </div>
  `;
}

// Interactive Multiplication Table Card Switcher Helper
window.renderTableCards = function(num) {
  const grid = document.getElementById('table-display-grid');
  if (!grid) return;
  grid.innerHTML = Array.from({length: 10}, (_, i) => i + 1).map(i => `
    <div class="card card-glass" style="text-align: center; padding: 0.75rem; font-weight: 700; cursor: pointer;" data-speak="${num} times ${i} is ${num * i}">
      ${num} × ${i} = <span style="color: var(--primary);">${num * i}</span>
    </div>
  `).join('');
};

window.runHtmlSnippet = function() {
  const p = document.getElementById('html-code-preview');
  if (p) {
    p.style.display = 'block';
    p.innerHTML = `
      <h3 style="color: var(--primary);">Hello World!</h3>
      <p style="margin: 0.5rem 0;">Welcome to my accessible webpage!</p>
      <button class="btn btn-primary btn-sm" onclick="alert('Awesome job coding!')">Click Me!</button>
    `;
  }
};
