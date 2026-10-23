/**
 * AccessibleVerse — Knowledge Runner 3D
 * Genuine Three.js 3-Lane Endless Runner with Jump, Slide, Checkpoint Quizzes,
 * Web Audio FX, Mobile Touch Controls, and MongoDB High-Score Sync.
 */

class KnowledgeRunnerGame {
  constructor(canvasId = 'runner-3d-canvas') {
    this.canvas = document.getElementById(canvasId);
    this.isRunning = false;
    this.isPaused = false;
    this.score = 0;
    this.lives = 3;
    this.currentLane = 0; // -1: Left, 0: Center, 1: Right
    this.laneWidth = 3.6;
    this.speed = 18;
    this.distance = 0;
    this.checkpointTarget = 120;
    this.isUntimed = false;

    // Three.js Objects
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.player = null;
    this.tracks = [];
    this.obstacles = [];
    this.collectibles = [];
    this.clock = null;

    // Jumping & Sliding State
    this.isJumping = false;
    this.jumpVelocity = 0;
    this.gravity = -38;
    this.isSliding = false;
    this.slideTimer = 0;

    // Audio Synthesizer
    this.audioCtx = null;
  }

  init() {
    if (!this.canvas) return;

    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0f172a, 0.015);

    const width = this.canvas.clientWidth || 800;
    const height = this.canvas.clientHeight || 500;
    this.camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 200);
    this.camera.position.set(0, 6.5, 11);
    this.camera.lookAt(0, 2, -15);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x090d16);
    this.renderer.shadowMap.enabled = true;

    this.setupLighting();
    this.buildTracks();
    this.buildPlayer();
    this.setupControls();

    // Check if untimed mode preferred
    const prefs = window.a11y ? window.a11y.prefs : {};
    if (prefs.reduced_motion) {
      this.speed = 10;
      this.isUntimed = true;
    }

    this.updateHUD();
  }

  initAudio() {
    if (!this.audioCtx) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      } catch {}
    }
  }

  playTone(freq, type = 'sine', duration = 0.15) {
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {}
  }

  setupLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 25, 15);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    const runnerGlow = new THREE.PointLight(0x06b6d4, 1.5, 20);
    runnerGlow.position.set(0, 4, 5);
    this.scene.add(runnerGlow);
  }

  buildTracks() {
    // Continuous 3-lane Highway
    for (let i = 0; i < 4; i++) {
      const trackGroup = new THREE.Group();
      trackGroup.position.z = -i * 50;

      // Road Surface
      const roadGeo = new THREE.BoxGeometry(12, 0.5, 50);
      const roadMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.5
      });
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.position.y = -0.25;
      road.receiveShadow = true;
      trackGroup.add(road);

      // Lane Divider Strips
      for (const lx of [-1.8, 1.8]) {
        const stripGeo = new THREE.PlaneGeometry(0.2, 50);
        const stripMat = new THREE.MeshBasicMaterial({ color: 0x475569 });
        const strip = new THREE.Mesh(stripGeo, stripMat);
        strip.rotation.x = -Math.PI / 2;
        strip.position.set(lx, 0.01, 0);
        trackGroup.add(strip);
      }

      this.tracks.push(trackGroup);
      this.scene.add(trackGroup);
    }
  }

  buildPlayer() {
    const group = new THREE.Group();
    group.position.set(0, 1, 0);

    // Glowing Runner Body (Cyber Bot)
    const bodyGeo = new THREE.BoxGeometry(1.2, 1.6, 1.0);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      metalness: 0.6,
      roughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    group.add(body);

    // Visor Eyes
    const eyeGeo = new THREE.BoxGeometry(0.9, 0.35, 0.3);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const eyes = new THREE.Mesh(eyeGeo, eyeMat);
    eyes.position.set(0, 0.35, -0.45);
    group.add(eyes);

    this.player = group;
    this.scene.add(this.player);
  }

  setupControls() {
    window.addEventListener('keydown', (e) => {
      if (!this.isRunning || this.isPaused) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.shiftLane(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.shiftLane(1);
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        e.preventDefault();
        this.jump();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        this.slide();
      }
    });

    // Touch Swipe Controls
    let touchStartX = 0;
    let touchStartY = 0;

    this.canvas.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      this.initAudio();
    });

    this.canvas.addEventListener('touchend', (e) => {
      if (!this.isRunning || this.isPaused) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 35) this.shiftLane(1);
        else if (dx < -35) this.shiftLane(-1);
      } else {
        if (dy < -35) this.jump();
        else if (dy > 35) this.slide();
      }
    });
  }

  shiftLane(dir) {
    const nextLane = this.currentLane + dir;
    if (nextLane >= -1 && nextLane <= 1) {
      this.currentLane = nextLane;
      this.playTone(380, 'sine', 0.08);
    }
  }

  jump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.jumpVelocity = 14;
      this.playTone(550, 'triangle', 0.15);
    }
  }

  slide() {
    if (!this.isSliding) {
      this.isSliding = true;
      this.slideTimer = 0.55;
      this.player.scale.set(1.2, 0.5, 1.2);
      this.playTone(280, 'sine', 0.12);
    }
  }

  start() {
    this.initAudio();
    this.isRunning = true;
    this.isPaused = false;
    this.score = 0;
    this.lives = 3;
    this.currentLane = 0;
    this.distance = 0;
    this.clearDynamicObjects();
    this.updateHUD();
    this.loop();
  }

  clearDynamicObjects() {
    this.obstacles.forEach(o => this.scene.remove(o.mesh));
    this.collectibles.forEach(c => this.scene.remove(c.mesh));
    this.obstacles = [];
    this.collectibles = [];
  }

  spawnObstacle() {
    const laneIndex = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
    const isOverhead = Math.random() > 0.6; // High beam to slide under vs hurdle to jump over

    let mesh;
    if (isOverhead) {
      // Laser beam barrier (must slide under)
      const geo = new THREE.BoxGeometry(this.laneWidth * 0.8, 0.4, 0.4);
      const mat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(laneIndex * this.laneWidth, 2.2, -75);
    } else {
      // Hurdle block (must jump over or dodge)
      const geo = new THREE.BoxGeometry(2.0, 1.0, 1.0);
      const mat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
      mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(laneIndex * this.laneWidth, 0.5, -75);
    }

    this.scene.add(mesh);
    this.obstacles.push({ mesh, isOverhead, lane: laneIndex });
  }

  spawnCollectible() {
    const laneIndex = Math.floor(Math.random() * 3) - 1;
    const geo = new THREE.OctahedronGeometry(0.55);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      metalness: 0.8,
      roughness: 0.1
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(laneIndex * this.laneWidth, 1.4, -75);

    this.scene.add(mesh);
    this.collectibles.push({ mesh, lane: laneIndex });
  }

  loop() {
    if (!this.isRunning) return;
    requestAnimationFrame(() => this.loop());

    if (this.isPaused) return;

    const delta = Math.min(this.clock.getDelta(), 0.1);
    this.distance += this.speed * delta;
    this.score += Math.floor(this.speed * delta * 0.5);

    // Update Player Horizontal Lane
    const targetX = this.currentLane * this.laneWidth;
    this.player.position.x = THREE.MathUtils.lerp(this.player.position.x, targetX, 0.2);

    // Jump Physics
    if (this.isJumping) {
      this.player.position.y += this.jumpVelocity * delta;
      this.jumpVelocity += this.gravity * delta;
      if (this.player.position.y <= 1.0) {
        this.player.position.y = 1.0;
        this.isJumping = false;
        this.jumpVelocity = 0;
      }
    }

    // Slide Timer
    if (this.isSliding) {
      this.slideTimer -= delta;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
        this.player.scale.set(1, 1, 1);
      }
    }

    // Scroll Tracks forward
    this.tracks.forEach(track => {
      track.position.z += this.speed * delta;
      if (track.position.z > 30) {
        track.position.z -= 200;
      }
    });

    // Spawn Obstacles & Collectibles
    if (Math.random() < 0.035) {
      this.spawnObstacle();
    }
    if (Math.random() < 0.05) {
      this.spawnCollectible();
    }

    // Update Obstacles & Check Collisions
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.mesh.position.z += this.speed * delta;

      // Collision Check
      if (Math.abs(obs.mesh.position.z - this.player.position.z) < 1.2) {
        if (Math.abs(obs.mesh.position.x - this.player.position.x) < 1.2) {
          let hit = false;
          if (obs.isOverhead) {
            // Player must be sliding
            if (!this.isSliding) hit = true;
          } else {
            // Player must be jumping over
            if (this.player.position.y < 1.5) hit = true;
          }

          if (hit) {
            this.handleCollision();
            this.scene.remove(obs.mesh);
            this.obstacles.splice(i, 1);
            continue;
          }
        }
      }

      // Cleanup
      if (obs.mesh.position.z > 15) {
        this.scene.remove(obs.mesh);
        this.obstacles.splice(i, 1);
      }
    }

    // Update Collectibles
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const col = this.collectibles[i];
      col.mesh.position.z += this.speed * delta;
      col.mesh.rotation.y += 0.05;

      // Pickup Check
      if (Math.abs(col.mesh.position.z - this.player.position.z) < 1.4) {
        if (Math.abs(col.mesh.position.x - this.player.position.x) < 1.4) {
          this.score += 50;
          this.playTone(880, 'sine', 0.1);
          this.scene.remove(col.mesh);
          this.collectibles.splice(i, 1);
          this.updateHUD();
          continue;
        }
      }

      if (col.mesh.position.z > 15) {
        this.scene.remove(col.mesh);
        this.collectibles.splice(i, 1);
      }
    }

    // Checkpoint Quiz Trigger
    if (this.distance > this.checkpointTarget) {
      this.checkpointTarget += 150;
      this.triggerCheckpointQuiz();
    }

    this.updateHUD();
    this.renderer.render(this.scene, this.camera);
  }

  handleCollision() {
    this.playTone(180, 'sawtooth', 0.25);
    if (!this.isUntimed) {
      this.lives -= 1;
    }
    this.updateHUD();

    if (this.lives <= 0 && !this.isUntimed) {
      this.gameOver();
    }
  }

  triggerCheckpointQuiz() {
    this.isPaused = true;
    const questions = [
      {
        q: "In Kannada, which letter is the first Swara (Vowel)?",
        opts: ["ಅ (Short a)", "ಕ (Ka)", "ಮ (Ma)", "ರ (Ra)"],
        correct: 0
      },
      {
        q: "What does the RED traffic signal indicate?",
        opts: ["Speed Up", "STOP completely", "Honk loud", "Turn Right"],
        correct: 1
      },
      {
        q: "Mathematics Challenge: What is 6 × 7?",
        opts: ["36", "42", "48", "54"],
        correct: 1
      },
      {
        q: "Hindi Phonics: Which letter represents 'कमल' (Lotus)?",
        opts: ["क", "ख", "ग", "घ"],
        correct: 0
      }
    ];

    const randomQ = questions[Math.floor(Math.random() * questions.length)];
    const overlay = document.querySelector('.runner-question-overlay');
    if (!overlay) {
      this.isPaused = false;
      return;
    }

    overlay.querySelector('.question-text').textContent = randomQ.q;
    const optsContainer = overlay.querySelector('.runner-question-options');
    optsContainer.innerHTML = '';

    randomQ.opts.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-secondary';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        if (idx === randomQ.correct) {
          this.score += 150;
          this.playTone(950, 'sine', 0.2);
          window.showToast("Correct! +150 XP & Speed Boost!", "success");
        } else {
          window.showToast("Good attempt! Keep running!", "info");
        }
        overlay.classList.remove('active');
        this.isPaused = false;
      });
      optsContainer.appendChild(btn);
    });

    overlay.classList.add('active');
    if (window.lang) {
      window.lang.speakText(randomQ.q);
    }
  }

  gameOver() {
    this.isRunning = false;
    window.showToast(`Game Over! Final Score: ${this.score}`, 'info');

    // Submit score to backend
    if (window.api) {
      window.api.games.submitScore({
        game_id: 'knowledge-runner',
        score: this.score,
        level: Math.floor(this.score / 200) + 1
      });
    }

    const startBtn = document.getElementById('runner-start-btn');
    if (startBtn) {
      startBtn.textContent = 'Restart Run';
      startBtn.style.display = 'inline-flex';
    }
  }

  updateHUD() {
    const scoreEl = document.getElementById('runner-score-val');
    const livesEl = document.getElementById('runner-lives-val');
    if (scoreEl) scoreEl.textContent = this.score;
    if (livesEl) livesEl.textContent = this.isUntimed ? '∞ Untimed' : '❤️'.repeat(Math.max(0, this.lives));
  }
}

// Global Export
window.KnowledgeRunnerGame = KnowledgeRunnerGame;
