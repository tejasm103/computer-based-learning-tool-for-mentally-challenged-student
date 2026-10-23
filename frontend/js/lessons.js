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

  // Generate full summary for narration
  const speakSummary = `${lesson.title}. Level: ${lesson.level}. ${lesson.description}`;

  modalBackdrop.innerHTML = `
    <div class="a11y-panel lesson-modal-panel" style="max-width: 840px;">
      <!-- Sticky Modal Header -->
      <div class="a11y-panel-header" style="flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.25rem;">
            <span class="badge badge-primary">${lesson.subject} • Level: ${lesson.level}</span>
            <span class="badge badge-amber"><i data-lucide="zap"></i> +${lesson.xp} XP</span>
          </div>
          <h3 id="modal-lesson-title" style="font-size: 1.3rem;">${lesson.title}</h3>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <!-- Speed Toggle -->
          <button class="btn btn-sm btn-secondary" id="modal-speech-speed-btn" title="Toggle narration speed" style="font-size: 0.8rem;">
            ⚡ 1x
          </button>

          <!-- Read Aloud Button -->
          <button class="btn btn-sm btn-primary" id="modal-read-aloud-btn" data-speak="${speakSummary}" title="Read lesson aloud">
            <i data-lucide="volume-2"></i> Listen
          </button>

          <!-- Close Button -->
          <button class="a11y-close-btn" onclick="document.getElementById('lesson-viewer-modal').classList.remove('active')" aria-label="Close lesson modal" style="font-size: 1.5rem; padding: 0.25rem 0.5rem;">&times;</button>
        </div>
      </div>

      <!-- Lesson Body with Dedicated Scrolling -->
      <div id="modal-lesson-body" class="lesson-modal-body" style="padding: 1rem 0; overflow-y: auto;">
        ${renderLessonContent(lesson)}
      </div>

      <!-- Sticky Footer Action -->
      <div class="lesson-modal-footer" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.75rem; flex-wrap: wrap; gap: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <button class="btn btn-secondary btn-sm" onclick="window.lang && window.lang.stopSpeech()">
            <i data-lucide="volume-x"></i> Stop Audio
          </button>
          <span style="font-size: 0.82rem; color: var(--text-muted);">💡 Tip: Click any card to hear it spoken!</span>
        </div>
        <button class="btn btn-primary" id="mark-lesson-complete-btn" data-id="${lesson.id}">
          <i data-lucide="check-circle-2"></i> Mark Lesson Completed (+${lesson.xp} XP)
        </button>
      </div>
    </div>
  `;

  modalBackdrop.classList.add('active');
  if (window.lucide) window.lucide.createIcons();

  // Speed toggle listener
  let isSlow = false;
  const speedBtn = modalBackdrop.querySelector('#modal-speech-speed-btn');
  if (speedBtn) {
    speedBtn.addEventListener('click', () => {
      isSlow = !isSlow;
      if (window.lang) {
        window.lang.setSpeechRate(isSlow ? 0.75 : 0.95);
      }
      speedBtn.innerHTML = isSlow ? '🐢 0.75x' : '⚡ 1x';
      window.showToast(isSlow ? 'Narration set to Calm & Slow (0.75x)' : 'Narration set to Standard Speed (1x)', 'info');
    });
  }

  // Completion listener
  modalBackdrop.querySelector('#mark-lesson-complete-btn').addEventListener('click', async () => {
    if (window.lang && window.lang.soundFX) {
      window.lang.soundFX.playFanfare();
    }
    const res = await window.api.lessons.complete(lesson.id);
    window.showToast(`🎉 Lesson Completed! +${res.xp_gained || lesson.xp} XP added to your profile!`, "success");
    modalBackdrop.classList.remove('active');
  });
}

function renderLessonContent(lesson) {
  const id = lesson.id;

  // 1. Kannada Vowels (ಸ್ವರಗಳು)
  if (id === 'kn-varnamale-1') {
    const vowels = lesson.content?.vowels || [];
    return `
      <div style="margin-bottom: 1rem;">
        <span class="badge badge-primary" style="margin-bottom: 0.4rem;">ವಿಷಯ ೧ (Topic 1): ೧೪ ಸ್ವರಗಳು (14 Vowels)</span>
        <p style="font-size: 0.95rem;">Click any Kannada letter to hear authentic pronunciation and word associations:</p>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(135px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
        ${vowels.map(v => `
          <button class="card card-glass topic-interactive-card" style="text-align: center; padding: 1rem; cursor: pointer; border-radius: var(--radius-md);" data-speak="${v.letter}, ${v.word}" data-lang="kn">
            <div style="font-size: 2.2rem; font-weight: 800; color: var(--primary); font-family: var(--font-kannada); line-height: 1.1;">${v.letter}</div>
            <div style="font-size: 0.88rem; font-weight: 600; color: var(--secondary-hover);">${v.trans}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">${v.word}</div>
            <span style="font-size: 0.7rem; color: var(--primary); display: inline-flex; align-items: center; gap: 2px; margin-top: 4px;">🔊 ಕೇಳಿ</span>
          </button>
        `).join('')}
      </div>
      <div class="card card-glass" style="padding: 1rem; border-left: 4px solid var(--primary);">
        <h4 style="font-size: 0.95rem; margin-bottom: 0.4rem;">💡 ಸ್ವರಗಳ ವರ್ಗೀಕರಣ (Vowel Types):</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted);">
          <strong>ಹ್ರಸ್ವ ಸ್ವರಗಳು (Short Vowels):</strong> ಅ, ಇ, ಉ, ಋ, ಎ, ಒ (ಒಂದು ಮಾತ್ರೆ ಕಾಲ)<br>
          <strong>ದೀರ್ಘ ಸ್ವರಗಳು (Long Vowels):</strong> ಆ, ಈ, ಊ, ಏ, ಐ, ಓ, ಔ (ಎರಡು ಮಾತ್ರೆ ಕಾಲ)<br>
          <strong>ಯೋಗವಾಹಗಳು (Yogavaha):</strong> ಅಂ (ಅನುಸ್ವಾರ), ಅಃ (ವಿಸರ್ಗ)
        </p>
      </div>
    `;
  }

  // 2. Kannada Consonants (ವ್ಯಂಜನಗಳು)
  if (id === 'kn-vyanjana-1') {
    const cons = lesson.content?.consonants || [];
    return `
      <div style="margin-bottom: 1rem;">
        <span class="badge badge-primary" style="margin-bottom: 0.4rem;">ವಿಷಯ ೧ (Topic 1): ೩೪ ವ್ಯಂಜನಗಳು (34 Consonants)</span>
        <p style="font-size: 0.95rem;">Click any Kannada consonant to hear its authentic sound and word example:</p>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(135px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
        ${cons.map(c => `
          <button class="card card-glass topic-interactive-card" style="text-align: center; padding: 0.9rem; cursor: pointer; border-radius: var(--radius-md);" data-speak="${c.letter}, ${c.word}" data-lang="kn">
            <div style="font-size: 2.1rem; font-weight: 800; color: var(--secondary-hover); font-family: var(--font-kannada); line-height: 1.1;">${c.letter}</div>
            <div style="font-size: 0.85rem; font-weight: 600;">${c.trans}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">${c.word}</div>
            <span style="font-size: 0.7rem; color: var(--secondary-hover); display: inline-flex; align-items: center; gap: 2px; margin-top: 4px;">🔊 ಕೇಳಿ</span>
          </button>
        `).join('')}
      </div>
      <div class="card card-glass" style="padding: 1rem; border-left: 4px solid var(--secondary-hover);">
        <h4 style="font-size: 0.95rem; margin-bottom: 0.4rem;">💡 ವರ್ಗೀಯ ಮತ್ತು ಅವರ್ಗೀಯ ವ್ಯಂಜನಗಳು:</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted);">
          <strong>ವರ್ಗೀಯ ವ್ಯಂಜನಗಳು (೨೫):</strong> ಕ-ವರ್ಗ, ಚ-ವರ್ಗ, ಟ-ವರ್ಗ, ತ-ವರ್ಗ, ಪ-ವರ್ಗ.<br>
          <strong>ಅವರ್ಗೀಯ ವ್ಯಂಜನಗಳು (೯):</strong> ಯ, ರ, ಲ, ವ, ಶ, ಷ, ಸ, ಹ, ಳ.
        </p>
      </div>
    `;
  }

  // 3. Hindi Alphabet (स्वर और व्यंजन)
  if (id === 'hi-varnamala-1') {
    const vowels = lesson.content?.vowels || [];
    const consonants = lesson.content?.consonants || [];
    return `
      <div style="margin-bottom: 1rem;">
        <span class="badge badge-primary">विषय १ (Topic 1): हिंदी स्वर (Hindi Vowels)</span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
        ${vowels.map(v => `
          <button class="card card-glass topic-interactive-card" style="text-align: center; padding: 0.9rem; cursor: pointer;" data-speak="${v.letter}, ${v.word}" data-lang="hi">
            <div style="font-size: 2rem; font-weight: 800; color: var(--primary); font-family: var(--font-devanagari);">${v.letter}</div>
            <div style="font-size: 0.85rem; font-weight: 600;">${v.trans || ''}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${v.word}</div>
            <span style="font-size: 0.7rem; color: var(--primary); display: inline-flex; align-items: center; gap: 2px; margin-top: 4px;">🔊 सुनें</span>
          </button>
        `).join('')}
      </div>

      <div style="margin-bottom: 1rem;">
        <span class="badge badge-secondary">विषय २ (Topic 2): हिंदी व्यंजन (Hindi Consonants)</span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
        ${consonants.map(c => `
          <button class="card card-glass topic-interactive-card" style="text-align: center; padding: 0.9rem; cursor: pointer;" data-speak="${c.letter}, ${c.word}" data-lang="hi">
            <div style="font-size: 2rem; font-weight: 800; color: var(--secondary-hover); font-family: var(--font-devanagari);">${c.letter}</div>
            <div style="font-size: 0.85rem; font-weight: 600;">${c.trans || ''}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${c.word}</div>
            <span style="font-size: 0.7rem; color: var(--secondary-hover); display: inline-flex; align-items: center; gap: 2px; margin-top: 4px;">🔊 सुनें</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  // 4. English Phonics & Words A–Z
  if (id === 'en-alphabet-phonics') {
    const letters = lesson.content?.letters || [];
    return `
      <div style="margin-bottom: 1rem;">
        <span class="badge badge-primary">Topic 1: Letters & Phonetic Sounds (A to Z)</span>
        <p style="font-size: 0.95rem; margin-top: 0.25rem;">Click any letter card to hear the letter name, phonetic sound, and vocabulary word:</p>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(145px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
        ${letters.map(l => `
          <button class="card card-glass topic-interactive-card" style="text-align: center; padding: 0.9rem; cursor: pointer;" data-speak="${l.upper} ${l.lower}. ${l.sound}. ${l.word}">
            <div style="font-size: 2rem; font-weight: 800; color: var(--primary);">${l.upper} ${l.lower}</div>
            <div style="font-size: 0.82rem; font-weight: 600; color: var(--secondary-hover);">${l.sound}</div>
            <div style="font-size: 0.8rem; color: var(--accent); margin-top: 0.2rem;">${l.word}</div>
            <span style="font-size: 0.7rem; color: var(--primary); display: inline-flex; align-items: center; gap: 2px; margin-top: 4px;">🔊 Listen</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  // 5. Numbers 1 to 100 & Counting Patterns (Interactive 100 Grid)
  if (id === 'math-numbers-100') {
    return `
      <div style="margin-bottom: 1rem;">
        <span class="badge badge-primary">Topic 1: Interactive 100-Number Grid</span>
        <p style="font-size: 0.95rem; margin-top: 0.35rem;">Click any number to hear its name spoken aloud. Use filters to practice evens, odds, and tens:</p>
      </div>

      <!-- Quick Filter Buttons -->
      <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem;">
        <button class="btn btn-sm btn-primary num-filter-btn" onclick="filterNumberGrid('all')">All (1–100)</button>
        <button class="btn btn-sm btn-secondary num-filter-btn" onclick="filterNumberGrid('even')">Even (2, 4, 6...)</button>
        <button class="btn btn-sm btn-secondary num-filter-btn" onclick="filterNumberGrid('odd')">Odd (1, 3, 5...)</button>
        <button class="btn btn-sm btn-secondary num-filter-btn" onclick="filterNumberGrid('tens')">Tens (10, 20...100)</button>
        <button class="btn btn-sm btn-secondary num-filter-btn" onclick="filterNumberGrid('fives')">Fives (5, 10...100)</button>
      </div>

      <!-- Interactive 100 Grid -->
      <div id="numbers-100-grid" style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 0.35rem; margin-bottom: 1.5rem; max-height: 280px; overflow-y: auto; padding: 0.5rem; background: var(--bg-hover); border-radius: var(--radius-md);">
        ${Array.from({length: 100}, (_, i) => i + 1).map(num => `
          <button class="num-cell-btn" data-num="${num}" style="aspect-ratio: 1; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-main); font-weight: 700; border-radius: 6px; cursor: pointer; font-size: 0.9rem;" data-speak="${num}" title="Click to hear ${num}">
            ${num}
          </button>
        `).join('')}
      </div>

      <!-- Topic 2: Place Value & Grouping -->
      <div class="card card-glass" style="padding: 1rem; margin-bottom: 1rem; border-left: 4px solid var(--accent-emerald);">
        <h4 style="font-size: 1rem; margin-bottom: 0.3rem;">Topic 2: Place Value (Tens & Ones)</h4>
        <p style="font-size: 0.88rem; color: var(--text-muted);">
          Every 2-digit number is made of <strong>Tens</strong> and <strong>Ones</strong>.<br>
          For example: <strong>47</strong> = 4 Tens (40) + 7 Ones (7).<br>
          10 Ones grouped together make exactly <strong>1 Ten</strong>.
        </p>
      </div>
    `;
  }

  // 6. Addition and Subtraction within 100
  if (id === 'math-addition-subtraction') {
    return `
      <div style="margin-bottom: 1rem;">
        <span class="badge badge-primary">Topic 1: Visual Addition & Subtraction Counter</span>
        <p style="font-size: 0.95rem; margin-top: 0.35rem;">Tap any math problem below to see the visual counter blocks and hear the equation spoken aloud:</p>
      </div>

      <!-- Quick Preset Pills -->
      <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem;">
        <button class="btn btn-sm btn-primary math-preset-btn" onclick="setMathProblem(5, '+', 3, 'Addition')">5 + 3</button>
        <button class="btn btn-sm btn-secondary math-preset-btn" onclick="setMathProblem(10, '+', 7, 'Addition')">10 + 7</button>
        <button class="btn btn-sm btn-secondary math-preset-btn" onclick="setMathProblem(25, '+', 15, 'Addition')">25 + 15</button>
        <button class="btn btn-sm btn-secondary math-preset-btn" onclick="setMathProblem(15, '-', 5, 'Subtraction')">15 − 5</button>
        <button class="btn btn-sm btn-secondary math-preset-btn" onclick="setMathProblem(30, '-', 12, 'Subtraction')">30 − 12</button>
        <button class="btn btn-sm btn-secondary math-preset-btn" onclick="setMathProblem(50, '-', 20, 'Subtraction')">50 − 20</button>
      </div>

      <!-- Interactive Equation Display Card -->
      <div class="card card-glass topic-interactive-card" id="math-problem-card" style="text-align: center; padding: 1.25rem; margin-bottom: 1.25rem; border-top: 4px solid var(--primary);" data-speak="Five plus three equals eight! Count together: one, two, three, four, five, six, seven, eight!">
        <div id="math-equation-title" style="font-size: 2.2rem; font-weight: 800; color: var(--primary); font-family: monospace;">
          5 + 3 = <span style="color: var(--accent-emerald);">8</span>
        </div>
        <p id="math-equation-desc" style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.35rem;">
          Start with 5 blue items, add 3 orange items. Total is 8 items!
        </p>

        <!-- Visual Block Counters -->
        <div id="math-visual-dots" style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem; padding: 0.75rem; background: var(--bg-hover); border-radius: var(--radius-sm);">
          <div style="display: flex; gap: 4px;">
            ${Array.from({length: 5}).map(() => `<span style="width: 16px; height: 16px; border-radius: 50%; background: #38bdf8; display: inline-block;"></span>`).join('')}
          </div>
          <span style="font-weight: 800; font-size: 1.2rem; color: var(--text-main);">+</span>
          <div style="display: flex; gap: 4px;">
            ${Array.from({length: 3}).map(() => `<span style="width: 16px; height: 16px; border-radius: 50%; background: #fb923c; display: inline-block;"></span>`).join('')}
          </div>
          <span style="font-weight: 800; font-size: 1.2rem; color: var(--text-main);">=</span>
          <div style="display: flex; gap: 4px;">
            ${Array.from({length: 8}).map(() => `<span style="width: 16px; height: 16px; border-radius: 50%; background: #22c55e; display: inline-block;"></span>`).join('')}
          </div>
        </div>

        <button class="btn btn-sm btn-secondary" style="margin-top: 0.75rem;" onclick="this.parentElement.click()">
          🔊 Listen to Equation
        </button>
      </div>

      <!-- Topic 2: Illustrated Real-World Word Problems -->
      <div style="margin-bottom: 1rem;">
        <span class="badge badge-emerald">Topic 2: Real-World Story Problems</span>
        <p style="font-size: 0.95rem; margin-top: 0.35rem;">Click each story problem to hear the solution step by step:</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
        <div class="card card-glass topic-interactive-card" style="border-left: 4px solid #22c55e; cursor: pointer;" data-speak="Story Problem One: Aarav picked 12 red apples from the orchard. Priya gave him 8 more green apples. How many apples does Aarav have now? 12 plus 8 equals 20 juicy apples in the basket!">
          <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">🍎 Apple Orchard Mystery</div>
          <h4 style="font-size: 0.95rem; margin-bottom: 0.25rem;">12 + 8 = 20 Apples</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Aarav had 12 apples. Priya gave him 8 more. Together they have <strong>20 apples</strong>!</p>
          <span style="font-size: 0.75rem; color: #22c55e;">🔊 Listen to Story</span>
        </div>

        <div class="card card-glass topic-interactive-card" style="border-left: 4px solid #f59e0b; cursor: pointer;" data-speak="Story Problem Two: 25 friendly sparrows were resting on a leafy tree. 10 sparrows flew away to drink fresh water. How many sparrows remain on the branch? 25 minus 10 equals 15 sparrows!">
          <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">🐦 Tree Branch Mystery</div>
          <h4 style="font-size: 0.95rem; margin-bottom: 0.25rem;">25 − 10 = 15 Birds</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted);">25 birds on the tree. 10 flew away. <strong>15 birds</strong> remain singing!</p>
          <span style="font-size: 0.75rem; color: #f59e0b;">🔊 Listen to Story</span>
        </div>
      </div>

      <!-- Topic 3: Mental Math Tricks -->
      <div class="card card-glass" style="padding: 1rem; border-left: 4px solid var(--primary);">
        <h4 style="font-size: 0.95rem; margin-bottom: 0.3rem;">💡 Mental Math Superpowers:</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
          • <strong>Doubles Magic:</strong> 4+4 = 8, 6+6 = 12, 10+10 = 20, 25+25 = 50.<br>
          • <strong>Adding 10:</strong> Only the tens digit changes! Example: 34 + 10 = 44.<br>
          • <strong>Subtracting from 100:</strong> 100 − 30 = 70. 100 − 50 = 50.
        </p>
      </div>
    `;
  }

  // 7. Multiplication Tables 1 to 20 Mastery
  if (id === 'math-multiplication-tables') {
    return `
      <div style="margin-bottom: 1rem;">
        <span class="badge badge-primary">Topic 1: Select a Table (1 to 20)</span>
        <p style="font-size: 0.95rem; margin-top: 0.3rem;">Tap any table button to view and practice recitation with spoken audio:</p>
      </div>

      <div style="display: flex; gap: 0.35rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
        ${Array.from({length: 20}, (_, i) => i + 1).map(num => `
          <button class="btn btn-sm ${num === 7 ? 'btn-primary' : 'btn-secondary'} table-picker-btn" onclick="renderTableCards(${num})" data-table="${num}">
            ${num}
          </button>
        `).join('')}
      </div>

      <div id="table-display-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.6rem; margin-bottom: 1.25rem;">
        ${Array.from({length: 10}, (_, i) => i + 1).map(i => `
          <div class="card card-glass topic-interactive-card" style="text-align: center; padding: 0.85rem; font-weight: 700; cursor: pointer;" data-speak="7 times ${i} is ${7 * i}">
            7 × ${i} = <span style="color: var(--primary); font-size: 1.15rem;">${7 * i}</span>
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 3px;">🔊 Click to hear</div>
          </div>
        `).join('')}
      </div>

      <div class="card card-glass" style="padding: 1rem; border-left: 4px solid var(--primary);">
        <h4 style="font-size: 0.95rem; margin-bottom: 0.3rem;">💡 Multiplication Trick:</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted);">
          Multiplication is fast addition! <strong>5 × 4</strong> means adding five four times: <strong>5 + 5 + 5 + 5 = 20</strong>.
        </p>
      </div>
    `;
  }

  // 7. Traffic Signals & Road Safety
  if (id === 'life-traffic-safety') {
    return `
      <div style="margin-bottom: 1rem;">
        <span class="badge badge-primary">Topic 1: The 3 Traffic Light Signals</span>
        <p style="font-size: 0.95rem; margin-top: 0.3rem;">Click each light to see it illuminate and hear the safety command:</p>
      </div>

      <!-- Interactive Traffic Light Simulator -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
        <div class="card card-glass topic-interactive-card" style="border-left: 5px solid #ef4444; cursor: pointer;" data-speak="Red Light means STOP! Vehicles and pedestrians must stop completely before the line.">
          <h4 style="color: #ef4444; font-size: 1.1rem; margin-bottom: 0.3rem;">🔴 RED LIGHT: STOP</h4>
          <p style="font-size: 0.88rem;">Vehicles must come to a complete halt. Never cross or proceed when the signal is red.</p>
          <span style="font-size: 0.75rem; color: #ef4444; display: inline-flex; align-items: center; gap: 3px; margin-top: 6px;">🔊 Click to Listen</span>
        </div>

        <div class="card card-glass topic-interactive-card" style="border-left: 5px solid #eab308; cursor: pointer;" data-speak="Yellow Light means CAUTION and WAIT! Prepare to stop safely. Do not speed up.">
          <h4 style="color: #eab308; font-size: 1.1rem; margin-bottom: 0.3rem;">🟡 YELLOW LIGHT: CAUTION</h4>
          <p style="font-size: 0.88rem;">Slow down and prepare to stop safely. Never speed up to beat the light.</p>
          <span style="font-size: 0.75rem; color: #eab308; display: inline-flex; align-items: center; gap: 3px; margin-top: 6px;">🔊 Click to Listen</span>
        </div>

        <div class="card card-glass topic-interactive-card" style="border-left: 5px solid #22c55e; cursor: pointer;" data-speak="Green Light means GO SAFELY! Proceed only when the road is clear and pedestrians have crossed.">
          <h4 style="color: #22c55e; font-size: 1.1rem; margin-bottom: 0.3rem;">🟢 GREEN LIGHT: GO</h4>
          <p style="font-size: 0.88rem;">Proceed with caution when the path is clear and crosswalks are empty.</p>
          <span style="font-size: 0.75rem; color: #22c55e; display: inline-flex; align-items: center; gap: 3px; margin-top: 6px;">🔊 Click to Listen</span>
        </div>
      </div>

      <!-- Topic 2: Zebra Crossing Safety -->
      <div class="card card-glass" style="padding: 1.25rem; margin-bottom: 1rem; border-left: 4px solid var(--primary);">
        <h4 style="margin-bottom: 0.5rem;">🦓 Topic 2: Zebra Crossing Etiquette</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; font-size: 0.88rem;">
          <div class="card card-glass" style="padding: 0.75rem;" data-speak="Step 1: Always stop at the curb and wait for traffic to stop.">
            <strong>1. Stop at the curb</strong><br>Never step into the road without looking.
          </div>
          <div class="card card-glass" style="padding: 0.75rem;" data-speak="Step 2: Look Left, Look Right, and Look Left again.">
            <strong>2. Look Left & Right</strong><br>Check both directions for approaching vehicles.
          </div>
          <div class="card card-glass" style="padding: 0.75rem;" data-speak="Step 3: Walk briskly across the white stripes; never run or look at phones.">
            <strong>3. Walk briskly</strong><br>Keep looking while crossing; never run.
          </div>
        </div>
      </div>
    `;
  }

  // 8. Personal Hygiene & Daily Habits
  if (id === 'life-hygiene-habits') {
    return `
      <div style="margin-bottom: 1rem;">
        <span class="badge badge-primary">Topic 1: 5 Daily Hygiene Super-Habits</span>
        <p style="font-size: 0.95rem; margin-top: 0.3rem;">Listen to each healthy routine and check off what you practiced today:</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
        <div class="card card-glass topic-interactive-card" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-left: 4px solid #38bdf8;" data-speak="Habit 1: 20-Second Handwashing. Wash hands with soap and water before meals and after playing outside.">
          <div>
            <h4 style="font-size: 1rem; margin-bottom: 0.2rem;">🧼 1. 20-Second Handwashing</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Use soap and scrub palms, backs, and fingernails for 20 seconds.</p>
          </div>
          <button class="btn btn-sm btn-secondary" onclick="startHandwashTimer(this)">⏱️ Start 20s Timer</button>
        </div>

        <div class="card card-glass topic-interactive-card" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-left: 4px solid #4ade80;" data-speak="Habit 2: Brush teeth twice daily. Morning after waking up, and night before bedtime.">
          <div>
            <h4 style="font-size: 1rem; margin-bottom: 0.2rem;">🪥 2. Brush Twice Daily</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Keep your smile bright and clean by brushing morning and bedtime.</p>
          </div>
          <span class="badge badge-emerald">Done ⭐</span>
        </div>

        <div class="card card-glass topic-interactive-card" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-left: 4px solid #f59e0b;" data-speak="Habit 3: Stay Hydrated & Eat Nutritious Food. Drink clean water throughout the day and enjoy fresh fruits.">
          <div>
            <h4 style="font-size: 1rem; margin-bottom: 0.2rem;">🍎 3. Fresh Fruits & Plenty of Water</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Drink 6-8 glasses of water daily and eat fresh vegetables.</p>
          </div>
          <span class="badge badge-amber">Health</span>
        </div>

        <div class="card card-glass topic-interactive-card" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-left: 4px solid #a855f7;" data-speak="Habit 4: 8 to 9 Hours of Sleep. A good night sleep helps your body heal, grow, and focus in school.">
          <div>
            <h4 style="font-size: 1rem; margin-bottom: 0.2rem;">🌙 4. Peaceful 8-9 Hours Sleep</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Rest helps your mind recharge and boosts your immune system.</p>
          </div>
          <span class="badge badge-primary">Rest</span>
        </div>
      </div>
    `;
  }

  // 9. Computer Basics & Coding Intro
  if (id === 'cs-coding-intro') {
    return `
      <div style="margin-bottom: 1rem;">
        <span class="badge badge-primary">Topic 1: Computer Hardware & Web Building</span>
        <p style="font-size: 0.95rem; margin-top: 0.3rem;">Learn HTML tags and Python logic with interactive preview:</p>
      </div>

      <div class="card card-glass" style="margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span class="badge badge-primary">HTML Code Example</span>
          <button class="btn btn-sm btn-secondary" onclick="window.runHtmlSnippet()">▶️ Run Preview</button>
        </div>
        <pre style="background: #0f172a; color: #38bdf8; padding: 1rem; border-radius: var(--radius-sm); overflow-x: auto; font-family: monospace; font-size: 0.88rem;">
&lt;h1&gt;Hello World!&lt;/h1&gt;
&lt;p&gt;Welcome to my accessible webpage!&lt;/p&gt;
&lt;button style="background: #4f46e5; color: white;"&gt;Click Me!&lt;/button&gt;</pre>
        <div id="html-code-preview" style="margin-top: 1rem; padding: 1rem; background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-sm); display: none;"></div>
      </div>

      <div class="card card-glass" style="border-left: 4px solid #4ade80;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span class="badge badge-emerald">Python Logic</span>
          <button class="btn btn-sm btn-secondary" data-speak="Python is a friendly programming language where code looks like clear English instructions.">🔊 Explain</button>
        </div>
        <pre style="background: #0f172a; color: #4ade80; padding: 1rem; border-radius: var(--radius-sm); overflow-x: auto; font-family: monospace; font-size: 0.88rem;">
# Friendly Python Greeter
name = "Explorer"
print(f"Welcome to AccessibleVerse, {name}!")

# Multiplication practice
for i in range(1, 6):
    print(f"5 x {i} = {5 * i}")</pre>
      </div>
    `;
  }

  // 10. Solar System & Planets (science-solar-system / sci-solar-planets)
  if (id === 'science-solar-system' || id === 'sci-solar-planets') {
    const planets = [
      { name: "Sun ☀️", fact: "The giant star at the center of our solar system holding all planets in orbit.", temp: "5,500°C" },
      { name: "Mercury 🪐", fact: "Smallest planet, closest to the Sun with rocky craters.", temp: "430°C / -180°C" },
      { name: "Venus 🟡", fact: "Hottest planet in our solar system with thick yellow clouds.", temp: "465°C" },
      { name: "Earth 🌍", fact: "Our home planet! Filled with blue oceans, green trees, and life.", temp: "15°C" },
      { name: "Mars 🔴", fact: "The Red Planet with iron dust and the biggest volcano in the system.", temp: "-65°C" },
      { name: "Jupiter 🌀", fact: "The largest planet with the famous Great Red Spot spinning storm.", temp: "-110°C" },
      { name: "Saturn 🪐", fact: "Famous for its stunning rings made of glistening ice and rock.", temp: "-140°C" },
      { name: "Uranus ❄️", fact: "An icy blue planet that spins on its side like a rolling ball.", temp: "-195°C" },
      { name: "Neptune 💨", fact: "The farthest and windiest blue planet with supersonic storms.", temp: "-200°C" }
    ];

    return `
      <div style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <span class="badge badge-primary">Topic 1: The 8 Planets & The Sun</span>
          <a href="science.html" class="btn btn-sm btn-primary">🚀 Launch 3D Space Simulator</a>
        </div>
        <p style="font-size: 0.95rem; margin-top: 0.35rem;">Click any planet to hear its astronomical facts and temperature:</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
        ${planets.map(p => `
          <div class="card card-glass topic-interactive-card" style="cursor: pointer; padding: 1rem; border-top: 3px solid var(--primary);" data-speak="${p.name}. ${p.fact} Temperature: ${p.temp}.">
            <h4 style="font-size: 1.1rem; color: var(--text-main); margin-bottom: 0.25rem;">${p.name}</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">${p.fact}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.6rem; font-size: 0.75rem;">
              <span class="badge badge-secondary">${p.temp}</span>
              <span style="color: var(--primary);">🔊 Listen</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 11. Photosynthesis & Plant Ecosystem (science-plant-ecosystem / sci-photosynthesis-lab)
  if (id === 'science-plant-ecosystem' || id === 'sci-photosynthesis-lab') {
    return `
      <div style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <span class="badge badge-primary">Topic 1: The Photosynthesis Reaction</span>
          <a href="science.html" class="btn btn-sm btn-primary">🌱 Launch 3D Science Lab</a>
        </div>
        <p style="font-size: 0.95rem; margin-top: 0.35rem;">How green plants convert light into food and clean oxygen for the Earth:</p>
      </div>

      <!-- 4 Step Interactive Recipe -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
        <div class="card card-glass topic-interactive-card" style="text-align: center; padding: 1rem; border-top: 3px solid #f59e0b;" data-speak="Sunlight: Plants absorb energy from the sun using green chlorophyll inside their leaves.">
          <div style="font-size: 2rem;">☀️</div>
          <h4 style="font-size: 0.95rem; margin: 0.3rem 0;">1. Sunlight</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted);">Energy from the Sun captured by chlorophyll.</p>
          <span style="font-size: 0.72rem; color: var(--primary);">🔊 Listen</span>
        </div>

        <div class="card card-glass topic-interactive-card" style="text-align: center; padding: 1rem; border-top: 3px solid #38bdf8;" data-speak="Water: Roots drink moisture and minerals deep from the soil.">
          <div style="font-size: 2rem;">💧</div>
          <h4 style="font-size: 0.95rem; margin: 0.3rem 0;">2. Water (H2O)</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted);">Roots absorb moisture from the earth.</p>
          <span style="font-size: 0.72rem; color: var(--primary);">🔊 Listen</span>
        </div>

        <div class="card card-glass topic-interactive-card" style="text-align: center; padding: 1rem; border-top: 3px solid #a855f7;" data-speak="Carbon Dioxide: Tiny pores in leaves called stomata take in air.">
          <div style="font-size: 2rem;">💨</div>
          <h4 style="font-size: 0.95rem; margin: 0.3rem 0;">3. Carbon Dioxide</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted);">Leaves breathe in CO2 from the air.</p>
          <span style="font-size: 0.72rem; color: var(--primary);">🔊 Listen</span>
        </div>

        <div class="card card-glass topic-interactive-card" style="text-align: center; padding: 1rem; border-top: 3px solid #22c55e;" data-speak="Clean Oxygen and Glucose: Plants release fresh oxygen for us to breathe and store food for growth.">
          <div style="font-size: 2rem;">🍃🫧</div>
          <h4 style="font-size: 0.95rem; margin: 0.3rem 0;">4. Food & Oxygen</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted);">Glucose sugar for growth + Oxygen for us!</p>
          <span style="font-size: 0.72rem; color: var(--primary);">🔊 Listen</span>
        </div>
      </div>
    `;
  }

  // 12. Cybersecurity & Online Safety
  if (id === 'cyber-safe-browsing') {
    return `
      <div style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <span class="badge badge-primary">Topic 1: Cyber Shield & Online Protection</span>
          <a href="cybersecurity.html" class="btn btn-sm btn-primary">🛡️ Cyber Escape Room</a>
        </div>
        <p style="font-size: 0.95rem; margin-top: 0.35rem;">Interactive online safety guidelines to protect your identity and family:</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
        <div class="card card-glass topic-interactive-card" style="border-left: 4px solid #ef4444;" data-speak="Password Shield: Never use 1 2 3 4 5 6 or your pet name. Combine 3 random words with numbers like BlueSkyTiger#99.">
          <h4 style="color: #ef4444; font-size: 1rem; margin-bottom: 0.3rem;">🔑 1. Password Shield</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Create long passwords using letters, numbers, and symbols. Never share your password with friends!</p>
          <span style="font-size: 0.75rem; color: #ef4444;">🔊 Listen</span>
        </div>

        <div class="card card-glass topic-interactive-card" style="border-left: 4px solid #f59e0b;" data-speak="Spotting Phishing Scams: Never click urgent links claiming you won a lottery or asking for your parent's card details.">
          <h4 style="color: #f59e0b; font-size: 1rem; margin-bottom: 0.3rem;">🎣 2. Phishing Detector</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Beware of fake messages saying 'You won a free iPhone! Click here now!'. Always ask a teacher or parent.</p>
          <span style="font-size: 0.75rem; color: #f59e0b;">🔊 Listen</span>
        </div>

        <div class="card card-glass topic-interactive-card" style="border-left: 4px solid #38bdf8;" data-speak="Webcam & Privacy Guard: Keep your camera turned off when not in class and never post your home address or phone number publicly.">
          <h4 style="color: #38bdf8; font-size: 1rem; margin-bottom: 0.3rem;">📷 3. Camera & Privacy</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Never post your home address, school name, or private photos on public forums.</p>
          <span style="font-size: 0.75rem; color: #38bdf8;">🔊 Listen</span>
        </div>
      </div>
    `;
  }

  // 13. Indian Rupee Money & Grocery Shopping
  if (id === 'life-money-shopping' || id === 'life-rupee-money') {
    return `
      <div style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <span class="badge badge-primary">Topic 1: Indian Currency Coins & Notes</span>
          <a href="life-skills.html" class="btn btn-sm btn-primary">🛒 Open Money Counter</a>
        </div>
        <p style="font-size: 0.95rem; margin-top: 0.35rem;">Click any coin or note below to hear its value and practical shopping usage:</p>
      </div>

      <!-- Currency Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
        <button class="card card-glass topic-interactive-card" style="text-align: center; padding: 0.85rem;" data-speak="One Rupee Coin. Used for small candies or pencil erasers.">
          <div style="font-size: 1.6rem; font-weight: 800; color: #94a3b8;">₹1</div>
          <div style="font-size: 0.78rem;">Coin</div>
          <span style="font-size: 0.7rem; color: var(--primary);">🔊 Listen</span>
        </button>

        <button class="card card-glass topic-interactive-card" style="text-align: center; padding: 0.85rem;" data-speak="Five Rupee Coin. Used for bus fare or a packet of biscuits.">
          <div style="font-size: 1.6rem; font-weight: 800; color: #94a3b8;">₹5</div>
          <div style="font-size: 0.78rem;">Coin</div>
          <span style="font-size: 0.7rem; color: var(--primary);">🔊 Listen</span>
        </button>

        <button class="card card-glass topic-interactive-card" style="text-align: center; padding: 0.85rem;" data-speak="Ten Rupee Coin or Note. Used for pen, chocolate, or fruit.">
          <div style="font-size: 1.6rem; font-weight: 800; color: #b45309;">₹10</div>
          <div style="font-size: 0.78rem;">Note / Coin</div>
          <span style="font-size: 0.7rem; color: var(--primary);">🔊 Listen</span>
        </button>

        <button class="card card-glass topic-interactive-card" style="text-align: center; padding: 0.85rem;" data-speak="Twenty Rupee Note. Orange colored note used for fresh juice or snacks.">
          <div style="font-size: 1.6rem; font-weight: 800; color: #ea580c;">₹20</div>
          <div style="font-size: 0.78rem;">Orange Note</div>
          <span style="font-size: 0.7rem; color: var(--primary);">🔊 Listen</span>
        </button>

        <button class="card card-glass topic-interactive-card" style="text-align: center; padding: 0.85rem;" data-speak="Fifty Rupee Note. Turquoise blue note used for school notebook or milk.">
          <div style="font-size: 1.6rem; font-weight: 800; color: #06b6d4;">₹50</div>
          <div style="font-size: 0.78rem;">Cyan Note</div>
          <span style="font-size: 0.7rem; color: var(--primary);">🔊 Listen</span>
        </button>

        <button class="card card-glass topic-interactive-card" style="text-align: center; padding: 0.85rem;" data-speak="One Hundred Rupee Note. Lavender note used for grocery shopping and books.">
          <div style="font-size: 1.6rem; font-weight: 800; color: #8b5cf6;">₹100</div>
          <div style="font-size: 0.78rem;">Lavender Note</div>
          <span style="font-size: 0.7rem; color: var(--primary);">🔊 Listen</span>
        </button>
      </div>

      <!-- Interactive Mini Supermarket Basket -->
      <div class="card card-glass" style="padding: 1.25rem; border-left: 4px solid var(--accent-emerald);">
        <h4 style="margin-bottom: 0.4rem;">Topic 2: Grocery Shopping Basket Simulator</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">Click items to add to your basket and see how change is calculated:</p>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn btn-sm btn-secondary" onclick="addShopItem('Fresh Apples', 30)">🍎 Apples (₹30)</button>
          <button class="btn btn-sm btn-secondary" onclick="addShopItem('Dairy Milk', 25)">🥛 Milk (₹25)</button>
          <button class="btn btn-sm btn-secondary" onclick="addShopItem('Wheat Bread', 20)">🍞 Bread (₹20)</button>
          <button class="btn btn-sm btn-secondary" onclick="addShopItem('Drawing Book', 35)">📒 Book (₹35)</button>
        </div>
        <div id="shop-cart-output" style="margin-top: 0.75rem; padding: 0.75rem; background: var(--bg-surface); border-radius: 6px; font-size: 0.9rem; font-weight: 600;">
          Cart Total: <span style="color: var(--primary);">₹0</span> | Paid with ₹100 note | Change: ₹100
        </div>
      </div>
    `;
  }

  // 14. Analog Clock Reading & Daily Routines
  if (id === 'life-clock-time' || id === 'life-clock-reading') {
    return `
      <div style="margin-bottom: 1rem;">
        <span class="badge badge-primary">Topic 1: Analog Clock Hands & Daily Hours</span>
        <p style="font-size: 0.95rem; margin-top: 0.35rem;">Learn how the Short Hand (Hours) and Long Hand (Minutes) tell time:</p>
      </div>

      <!-- Interactive Clock Face & Presets -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; align-items: center;">
        <div class="card card-glass" style="text-align: center; padding: 1.5rem;">
          <div id="clock-display-text" style="font-size: 2.5rem; font-weight: 800; color: var(--primary); font-family: monospace;">08:00 AM</div>
          <div id="clock-routine-desc" style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.4rem;">Morning Assembly & School Begins</div>
          <button class="btn btn-sm btn-secondary" id="clock-speak-time-btn" style="margin-top: 0.75rem;" data-speak="The time is 8:00 AM. School starts! Look at the short hand pointing to eight, and the long hand pointing to twelve.">
            🔊 Speak Time
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <button class="btn btn-sm btn-secondary" style="text-align: left; justify-content: flex-start;" onclick="setClockPreset('08:00 AM', 'Morning Assembly & School Starts', 8, 0)">
            ⏰ 8:00 AM — School Begins
          </button>
          <button class="btn btn-sm btn-secondary" style="text-align: left; justify-content: flex-start;" onclick="setClockPreset('12:30 PM', 'Healthy Lunch Break with Friends', 12, 30)">
            🍱 12:30 PM — Lunch Time (Half past 12)
          </button>
          <button class="btn btn-sm btn-secondary" style="text-align: left; justify-content: flex-start;" onclick="setClockPreset('05:00 PM', 'Outdoor Sports & Free Play', 5, 0)">
            ⚽ 5:00 PM — Play Time (5 O'clock)
          </button>
          <button class="btn btn-sm btn-secondary" style="text-align: left; justify-content: flex-start;" onclick="setClockPreset('09:00 PM', 'Bedtime Story & Peaceful Sleep', 9, 0)">
            🌙 9:00 PM — Bed Time (9 O'clock)
          </button>
        </div>
      </div>

      <div class="card card-glass" style="padding: 1rem; border-left: 4px solid var(--secondary-hover);">
        <h4 style="font-size: 0.95rem; margin-bottom: 0.3rem;">💡 Time Telling Rules:</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted);">
          • <strong>O'Clock:</strong> When the long hand points straight up at 12.<br>
          • <strong>Quarter Past:</strong> 15 minutes past the hour (long hand at 3).<br>
          • <strong>Half Past:</strong> 30 minutes past the hour (long hand at 6).<br>
          • <strong>AM vs PM:</strong> AM is morning (midnight to noon). PM is afternoon and evening (noon to midnight).
        </p>
      </div>
    `;
  }

  // Default Dynamic Topic Generator (Ensures NO lesson is ever missing topics!)
  return `
    <div style="margin-bottom: 1.25rem;">
      <span class="badge badge-primary">Topic 1: Core Concepts & Principles</span>
      <p style="font-size: 0.95rem; margin-top: 0.35rem;">${lesson.description}</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
      <div class="card card-glass topic-interactive-card" style="border-left: 4px solid var(--primary);" data-speak="${lesson.title}. Let's learn the fundamental concepts step by step.">
        <h4 style="margin-bottom: 0.3rem;">📖 Step 1: Foundational Ideas</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Master the key terms, definitions, and real-world everyday connections.</p>
        <span style="font-size: 0.75rem; color: var(--primary);">🔊 Listen</span>
      </div>

      <div class="card card-glass topic-interactive-card" style="border-left: 4px solid var(--accent-emerald);" data-speak="Step 2: Hands on Practice. Try applying what you learned with quizzes and games.">
        <h4 style="margin-bottom: 0.3rem;">🎯 Step 2: Interactive Application</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Solve fun challenges, explore 3D worlds, and test your knowledge in the Quiz module.</p>
        <span style="font-size: 0.75rem; color: var(--accent-emerald);">🔊 Listen</span>
      </div>
    </div>

    <div class="card card-glass" style="padding: 1rem; border-left: 4px solid var(--accent-amber);">
      <h4 style="font-size: 0.95rem; margin-bottom: 0.3rem;">⭐ Lesson Progress Rewards</h4>
      <p style="font-size: 0.85rem; color: var(--text-muted);">
        Completing this lesson rewards <strong>+${lesson.xp} XP</strong> to your profile and unlocks new achievements on your student dashboard!
      </p>
    </div>
  `;
}

// Interactive Number Grid Filter Helper
window.filterNumberGrid = function(type) {
  const grid = document.getElementById('numbers-100-grid');
  if (!grid) return;

  const btns = grid.querySelectorAll('.num-cell-btn');
  btns.forEach(btn => {
    const n = parseInt(btn.getAttribute('data-num'), 10);
    let match = true;
    if (type === 'even') match = (n % 2 === 0);
    else if (type === 'odd') match = (n % 2 !== 0);
    else if (type === 'tens') match = (n % 10 === 0);
    else if (type === 'fives') match = (n % 5 === 0);

    btn.style.opacity = match ? '1' : '0.2';
    btn.style.background = match ? 'var(--primary-light)' : 'var(--bg-surface)';
    btn.style.borderColor = match ? 'var(--primary)' : 'var(--border-color)';
  });

  if (window.lang) {
    window.lang.speakText(`Showing ${type} numbers in the 100 counting grid.`);
  }
};

// Interactive Multiplication Table Switcher Helper
window.renderTableCards = function(num) {
  const grid = document.getElementById('table-display-grid');
  if (!grid) return;

  // Highlight active table button
  document.querySelectorAll('.table-picker-btn').forEach(btn => {
    const isTarget = parseInt(btn.getAttribute('data-table'), 10) === num;
    btn.className = `btn btn-sm ${isTarget ? 'btn-primary' : 'btn-secondary'} table-picker-btn`;
  });

  grid.innerHTML = Array.from({length: 10}, (_, i) => i + 1).map(i => `
    <div class="card card-glass topic-interactive-card" style="text-align: center; padding: 0.85rem; font-weight: 700; cursor: pointer;" data-speak="${num} times ${i} is ${num * i}">
      ${num} × ${i} = <span style="color: var(--primary); font-size: 1.15rem;">${num * i}</span>
      <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 3px;">🔊 Click to hear</div>
    </div>
  `).join('');

  if (window.lang) {
    window.lang.speakText(`Table of ${num}`);
  }
};

// Handwash 20s Countdown Timer
window.startHandwashTimer = function(btn) {
  let seconds = 20;
  btn.disabled = true;
  btn.textContent = `Scrub: 20s remaining...`;

  if (window.lang) {
    window.lang.speakText('Start scrubbing! Palms, back of hands, between fingers, and thumbs for twenty seconds!');
  }

  const timer = setInterval(() => {
    seconds--;
    if (seconds > 0) {
      btn.textContent = `Scrub: ${seconds}s remaining...`;
    } else {
      clearInterval(timer);
      btn.disabled = false;
      btn.textContent = `✨ Clean Hands! (+20s Done)`;
      if (window.lang && window.lang.soundFX) {
        window.lang.soundFX.playFanfare();
        window.lang.speakText('Great job washing your hands! Rinse with clean water and dry with a clean towel.');
      }
    }
  }, 1000);
};

// Grocery Shopping Simulation Helper
let currentCartTotal = 0;
window.addShopItem = function(name, price) {
  currentCartTotal += price;
  const output = document.getElementById('shop-cart-output');
  if (output) {
    const paid = 100;
    const change = paid >= currentCartTotal ? paid - currentCartTotal : 0;
    output.innerHTML = `Added <strong>${name}</strong> (+₹${price}) | Total: <span style="color: var(--primary);">₹${currentCartTotal}</span> | Paid with ₹100 note | <strong>Change to receive: ₹${change}</strong>`;
  }
  if (window.lang) {
    window.lang.speakText(`Added ${name} for ${price} rupees. Total bill is now ${currentCartTotal} rupees. Change from a hundred rupee note is ${100 - currentCartTotal} rupees.`);
  }
};

// Analog Clock Preset Switcher Helper
window.setClockPreset = function(timeStr, desc, hour, minute) {
  const display = document.getElementById('clock-display-text');
  const descEl = document.getElementById('clock-routine-desc');
  const speakBtn = document.getElementById('clock-speak-time-btn');

  if (display) display.textContent = timeStr;
  if (descEl) descEl.textContent = desc;
  if (speakBtn) {
    const speech = `The time is ${timeStr}. ${desc}. The short hour hand is near ${hour}, and the long minute hand is at ${minute}.`;
    speakBtn.setAttribute('data-speak', speech);
  }

  if (window.lang) {
    window.lang.speakText(`The time is ${timeStr}. ${desc}.`);
  }
};

// Run HTML Live Preview Helper
window.runHtmlSnippet = function() {
  const p = document.getElementById('html-code-preview');
  if (p) {
    p.style.display = 'block';
    p.innerHTML = `
      <h3 style="color: var(--primary); margin-bottom: 0.4rem;">Hello World!</h3>
      <p style="margin: 0.4rem 0;">Welcome to my accessible webpage!</p>
      <button class="btn btn-primary btn-sm" onclick="alert('🎉 Awesome job running your first webpage snippet!')">Click Me!</button>
    `;
    if (window.lang) {
      window.lang.speakText('Preview updated! Hello World webpage is running live.');
    }
  }
};

// Interactive Math Addition & Subtraction Helper
window.setMathProblem = function(a, op, b, type) {
  const result = op === '+' ? a + b : a - b;
  const card = document.getElementById('math-problem-card');
  const title = document.getElementById('math-equation-title');
  const desc = document.getElementById('math-equation-desc');
  const dotsContainer = document.getElementById('math-visual-dots');

  // Highlight selected button
  document.querySelectorAll('.math-preset-btn').forEach(btn => {
    const isTarget = btn.textContent.trim().startsWith(`${a} ${op === '+' ? '+' : '−'} ${b}`);
    btn.className = `btn btn-sm ${isTarget ? 'btn-primary' : 'btn-secondary'} math-preset-btn`;
  });

  if (title) {
    title.innerHTML = `${a} ${op === '+' ? '+' : '−'} ${b} = <span style="color: var(--accent-emerald);">${result}</span>`;
  }

  if (desc) {
    if (op === '+') {
      desc.textContent = `Start with ${a} blue items, add ${b} orange items. Total sum is ${result} items!`;
    } else {
      desc.textContent = `Start with ${a} blue items, take away ${b} items. Remaining is ${result} items!`;
    }
  }

  if (dotsContainer) {
    const cappedA = Math.min(a, 15);
    const cappedB = Math.min(b, 15);
    const cappedRes = Math.min(result, 20);

    dotsContainer.innerHTML = `
      <div style="display: flex; gap: 4px; flex-wrap: wrap; max-width: 150px; justify-content: center;">
        ${Array.from({length: cappedA}).map(() => `<span style="width: 14px; height: 14px; border-radius: 50%; background: #38bdf8; display: inline-block;"></span>`).join('')}
      </div>
      <span style="font-weight: 800; font-size: 1.2rem; color: var(--text-main); margin: 0 4px;">${op === '+' ? '+' : '−'}</span>
      <div style="display: flex; gap: 4px; flex-wrap: wrap; max-width: 150px; justify-content: center;">
        ${Array.from({length: cappedB}).map(() => `<span style="width: 14px; height: 14px; border-radius: 50%; background: #fb923c; display: inline-block;"></span>`).join('')}
      </div>
      <span style="font-weight: 800; font-size: 1.2rem; color: var(--text-main); margin: 0 4px;">=</span>
      <div style="display: flex; gap: 4px; flex-wrap: wrap; max-width: 180px; justify-content: center;">
        ${Array.from({length: cappedRes}).map(() => `<span style="width: 14px; height: 14px; border-radius: 50%; background: #22c55e; display: inline-block;"></span>`).join('')}
      </div>
    `;
  }

  const spoken = `${a} ${op === '+' ? 'plus' : 'minus'} ${b} equals ${result}!`;
  if (card) {
    card.setAttribute('data-speak', `${spoken} ${desc ? desc.textContent : ''}`);
  }

  if (window.lang) {
    window.lang.speakText(spoken);
  }
};

