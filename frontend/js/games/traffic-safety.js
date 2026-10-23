/**
 * AccessibleVerse — Traffic Safety Challenge
 * Interactive Road Crossing Simulator and Traffic Sign Recognition.
 */

class TrafficSafetyGame {
  constructor(containerId = 'traffic-game-container') {
    this.container = document.getElementById(containerId);
    this.isRunning = false;
    this.score = 0;
    this.pedestrianY = 12; // bottom px
    this.signalState = 'red'; // 'red' | 'yellow' | 'green'
    this.timerId = null;
    this.animId = null;
    this.cars = [];
  }

  init() {
    if (!this.container) return;
    this.setupUI();
    this.startSimulation();
  }

  setupUI() {
    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
        <!-- Status Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 680px; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="badge badge-emerald">🚸 Road Safety Challenge</span>
            <span class="stat-pill"><i data-lucide="shield"></i> Safe Crossings: <strong id="traffic-crossings">0</strong></span>
          </div>
          <span class="stat-pill"><i data-lucide="zap"></i> Score: <strong id="traffic-score">0</strong></span>
        </div>

        <!-- Simulator Viewport -->
        <div class="traffic-sim-road" id="traffic-sim-viewport">
          <!-- Top Footpath / Safe Destination -->
          <div class="traffic-pedestrian-zone top-curb">
            <span style="color: #ffffff; font-weight: 700; font-size: 0.85rem;">🏫 School & Park Safe Zone (Destination)</span>
          </div>

          <!-- Zebra Crossing -->
          <div class="traffic-zebra-crossing"></div>

          <!-- Traffic Signal Pole -->
          <div class="traffic-light-signal">
            <div class="traffic-light-bulb red" id="light-red"></div>
            <div class="traffic-light-bulb yellow" id="light-yellow"></div>
            <div class="traffic-light-bulb green" id="light-green"></div>
          </div>

          <!-- Student Walker Avatar -->
          <div class="traffic-avatar-walker" id="traffic-avatar">🚶</div>

          <!-- Bottom Footpath / Starting Line -->
          <div class="traffic-pedestrian-zone bottom-curb">
            <span style="color: #ffffff; font-weight: 700; font-size: 0.85rem;">🚏 Starting Sidewalk (Look Left, Look Right)</span>
          </div>
        </div>

        <!-- Action Controls -->
        <div style="display: flex; gap: 1rem; margin-top: 1.25rem; align-items: center; flex-wrap: wrap; justify-content: center;">
          <button class="btn btn-primary btn-lg" id="traffic-cross-btn">
            <i data-lucide="footprints"></i>
            <span>Cross Road on Zebra Crossing</span>
          </button>
          <button class="btn btn-secondary" id="traffic-reset-btn">Reset Position</button>
        </div>

        <!-- Safe Walking Rules Callout -->
        <div class="card card-glass" style="margin-top: 1.5rem; max-width: 680px; width: 100%; font-size: 0.9rem;">
          <strong>💡 Pedestrian Safety Checklist:</strong>
          <ul style="margin-left: 1.5rem; margin-top: 0.4rem; color: var(--text-muted);">
            <li>Wait for the pedestrian signal to turn <strong>GREEN</strong>.</li>
            <li>Look <strong>Left, Right, and Left again</strong> before stepping down.</li>
            <li>Always stay inside the white <strong>Zebra Stripes</strong>.</li>
          </ul>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Buttons
    this.container.querySelector('#traffic-cross-btn').addEventListener('click', () => this.tryCrossing());
    this.container.querySelector('#traffic-reset-btn').addEventListener('click', () => this.resetAvatar());
  }

  startSimulation() {
    this.isRunning = true;
    this.cycleSignals();
    this.spawnCars();
    this.loopCars();
  }

  cycleSignals() {
    const cycle = () => {
      // Red: 5 seconds -> Yellow: 2 seconds -> Green: 5 seconds
      this.setSignal('red');
      setTimeout(() => {
        if (!this.isRunning) return;
        this.setSignal('yellow');
        setTimeout(() => {
          if (!this.isRunning) return;
          this.setSignal('green');
          setTimeout(() => {
            if (!this.isRunning) return;
            cycle();
          }, 5000);
        }, 2000);
      }, 5000);
    };
    cycle();
  }

  setSignal(state) {
    this.signalState = state;
    const r = this.container.querySelector('#light-red');
    const y = this.container.querySelector('#light-yellow');
    const g = this.container.querySelector('#light-green');

    if (r) r.classList.toggle('active', state === 'red');
    if (y) y.classList.toggle('active', state === 'yellow');
    if (g) g.classList.toggle('active', state === 'green');

    // Announce signal change if voice narration is active
    if (window.lang && state === 'green') {
      window.lang.speakText("Pedestrian Green light. Safe to cross on zebra crossing!");
    }
  }

  spawnCars() {
    const viewport = this.container.querySelector('#traffic-sim-viewport');
    if (!viewport) return;

    // Create 3 vehicle sprites
    const carTypes = ['🚗', '🚙', '🚌'];
    this.cars = [
      { el: null, x: -60, y: 130, speed: 3.5, icon: '🚗' },
      { el: null, x: 700, y: 220, speed: -4.0, icon: '🚙' },
      { el: null, x: -100, y: 310, speed: 2.8, icon: '🚌' }
    ];

    this.cars.forEach((c, idx) => {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.left = `${c.x}px`;
      el.style.top = `${c.y}px`;
      el.style.fontSize = '2.2rem';
      el.style.zIndex = '40';
      el.textContent = c.icon;
      viewport.appendChild(el);
      c.el = el;
    });
  }

  loopCars() {
    if (!this.isRunning) return;
    this.animId = requestAnimationFrame(() => this.loopCars());

    const viewport = this.container.querySelector('#traffic-sim-viewport');
    if (!viewport) return;
    const w = viewport.clientWidth || 680;

    // If signal is RED for cars (pedestrian GREEN), cars stop before zebra crossing!
    const carsMustStop = (this.signalState === 'green');

    this.cars.forEach(car => {
      if (carsMustStop) {
        // Slow down and stop before center zebra crossing
        const nearZebra = (car.speed > 0 && car.x > 180 && car.x < 240) ||
                          (car.speed < 0 && car.x < 480 && car.x > 420);
        if (!nearZebra) {
          car.x += car.speed * 0.4;
        }
      } else {
        car.x += car.speed;
      }

      // Wrap around
      if (car.speed > 0 && car.x > w + 60) car.x = -80;
      if (car.speed < 0 && car.x < -80) car.x = w + 80;

      if (car.el) {
        car.el.style.left = `${car.x}px`;
      }
    });
  }

  tryCrossing() {
    const avatar = this.container.querySelector('#traffic-avatar');
    if (!avatar) return;

    if (this.signalState !== 'green') {
      window.showToast("⚠️ DANGER! Cars have the green light. Wait for the pedestrian green signal!", "error");
      if (window.lang) {
        window.lang.speakText("Stop! Traffic signal is red for pedestrians. Wait for green.");
      }
      return;
    }

    // Move avatar across zebra crossing
    let currentBottom = 12;
    const stepInterval = setInterval(() => {
      currentBottom += 14;
      avatar.style.bottom = `${currentBottom}px`;

      if (currentBottom >= 415) {
        clearInterval(stepInterval);
        this.score += 100;
        window.showToast("🎉 Safe Crossing Complete! You followed road safety rules!", "success");

        const crossingsEl = this.container.querySelector('#traffic-crossings');
        const scoreEl = this.container.querySelector('#traffic-score');
        if (crossingsEl) crossingsEl.textContent = parseInt(crossingsEl.textContent || '0') + 1;
        if (scoreEl) scoreEl.textContent = this.score;

        if (window.api) {
          window.api.games.submitScore({
            game_id: 'traffic-safety',
            score: this.score,
            level: 1
          });
        }

        setTimeout(() => this.resetAvatar(), 1200);
      }
    }, 50);
  }

  resetAvatar() {
    const avatar = this.container.querySelector('#traffic-avatar');
    if (avatar) avatar.style.bottom = '12px';
  }
}

// Global Export
window.TrafficSafetyGame = TrafficSafetyGame;
