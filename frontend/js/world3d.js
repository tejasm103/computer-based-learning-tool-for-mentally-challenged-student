/**
 * AccessibleVerse — Interactive 3D Educational Metaverse
 * Built with Three.js featuring Floating Islands, Animated Mascot "Sparky",
 * Dynamic Lighting, Raycast Hover Interactions, and 2D Canvas Fallback.
 */

class EducationalWorld3D {
  constructor(canvasId = 'world3d-canvas', containerId = 'world3d-container') {
    this.canvas = document.getElementById(canvasId);
    this.container = document.getElementById(containerId);
    this.is2DMode = false;
    this.isReducedMotion = false;

    // Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = null;

    // Interactive Objects
    this.islands = [];
    this.mascot = null;
    this.particles = null;
    this.raycaster = null;
    this.mouse = null;
    this.hoveredIsland = null;

    // 2D Canvas Fallback
    this.canvas2D = null;
    this.ctx2D = null;
    this.animFrameId = null;
  }

  init() {
    if (!this.canvas || !this.container) return;

    // Check accessibility preferences
    const storedPrefs = localStorage.getItem('accessibleverse_a11y_prefs');
    if (storedPrefs) {
      try {
        const p = JSON.parse(storedPrefs);
        this.is2DMode = !!p.mode_2d;
        this.isReducedMotion = !!p.reduced_motion;
      } catch {}
    }

    // Check WebGL availability
    const hasWebGL = this.checkWebGL();
    if (this.is2DMode || !hasWebGL) {
      this.init2DFallback();
    } else {
      this.init3DScene();
    }

    // Listen for accessibility changes
    window.addEventListener('accessibilityChanged', (e) => {
      const prefs = e.detail;
      this.isReducedMotion = !!prefs.reduced_motion;
      if (prefs.mode_2d !== this.is2DMode) {
        this.is2DMode = prefs.mode_2d;
        if (this.is2DMode) {
          this.switchTo2D();
        } else {
          this.switchTo3D();
        }
      }
    });

    // Window Resize
    window.addEventListener('resize', () => this.onResize());
  }

  checkWebGL() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
    } catch {
      return false;
    }
  }

  init3DScene() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded. Falling back to 2D.');
      this.init2DFallback();
      return;
    }

    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();

    // Responsive Camera
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 550;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 18, 38);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Orbit Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2.1; // Don't dip below islands
      this.controls.minDistance = 15;
      this.controls.maxDistance = 65;
      this.controls.target.set(0, 2, 0);
    }

    // Setup Lighting & Environment
    this.setupLighting();
    this.setupStarfield();

    // Build 3D Islands
    this.createFloatingIslands();

    // Build Mascot "Sparky"
    this.createMascotSparky();

    // Raycaster for Hover & Click
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.setupInteractions();

    // Start Animation Loop
    this.animate();
  }

  setupLighting() {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    // Main Sun Directional Light
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    sunLight.position.set(20, 40, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    const d = 25;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    this.scene.add(sunLight);

    // Colored Accent Rim Lights for depth
    const indigoPoint = new THREE.PointLight(0x6366f1, 2, 35);
    indigoPoint.position.set(-15, 10, -5);
    this.scene.add(indigoPoint);

    const cyanPoint = new THREE.PointLight(0x06b6d4, 2, 35);
    cyanPoint.position.set(15, 10, 5);
    this.scene.add(cyanPoint);
  }

  setupStarfield() {
    const starCount = 600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 120;
      positions[i + 1] = (Math.random() - 0.5) * 80 + 10;
      positions[i + 2] = (Math.random() - 0.5) * 120;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.35,
      transparent: true,
      opacity: 0.6
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createFloatingIslands() {
    // 1. Language Sanctuary (Left)
    const langIsland = this.buildIslandMesh({
      name: "Language Island",
      subject: "kannada",
      pos: [-14, 0, -2],
      color: 0x4f46e5,
      accentColor: 0x818cf8,
      glyphText: "ಅ अ A",
      monumentType: 'rings'
    });
    this.islands.push(langIsland);
    this.scene.add(langIsland.group);

    // 2. Math Mountain (Right)
    const mathIsland = this.buildIslandMesh({
      name: "Math Mountain",
      subject: "mathematics",
      pos: [14, 2, -4],
      color: 0x06b6d4,
      accentColor: 0x38bdf8,
      glyphText: "1 2 3 ×",
      monumentType: 'pyramid'
    });
    this.islands.push(mathIsland);
    this.scene.add(mathIsland.group);

    // 3. Safety & Life Island (Center-Forward)
    const safetyIsland = this.buildIslandMesh({
      name: "Everyday & Safety Island",
      subject: "everyday",
      pos: [0, -2, 10],
      color: 0x10b981,
      accentColor: 0x34d399,
      glyphText: "🚦 🚸 🛡️",
      monumentType: 'traffic'
    });
    this.islands.push(safetyIsland);
    this.scene.add(safetyIsland.group);

    // 4. Cyber & Coding Island (Center-Back)
    const cyberIsland = this.buildIslandMesh({
      name: "Cyber & Tech Hub",
      subject: "technology",
      pos: [0, 4, -16],
      color: 0xec4899,
      accentColor: 0xf472b6,
      glyphText: "</> 💻 🌐",
      monumentType: 'cyber'
    });
    this.islands.push(cyberIsland);
    this.scene.add(cyberIsland.group);
  }

  buildIslandMesh(config) {
    const group = new THREE.Group();
    group.position.set(...config.pos);

    // Floating Island Base (Hexagonal Cylindrical Platform)
    const baseGeo = new THREE.CylinderGeometry(5.2, 3.2, 2.5, 6);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x242e42,
      roughness: 0.6,
      metalness: 0.1
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.receiveShadow = true;
    group.add(base);

    // Grassy Surface Plate
    const topGeo = new THREE.CylinderGeometry(5.3, 5.2, 0.4, 6);
    const topMat = new THREE.MeshStandardMaterial({
      color: config.color,
      roughness: 0.4,
      metalness: 0.2
    });
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.y = 1.3;
    top.receiveShadow = true;
    group.add(top);

    // Floating Monument Centerpiece
    let monument;
    if (config.monumentType === 'rings') {
      monument = new THREE.Group();
      const torusGeo = new THREE.TorusGeometry(1.8, 0.18, 16, 48);
      const torusMat = new THREE.MeshStandardMaterial({
        color: config.accentColor,
        roughness: 0.2,
        metalness: 0.8
      });
      const ring1 = new THREE.Mesh(torusGeo, torusMat);
      const ring2 = ring1.clone();
      ring2.rotation.x = Math.PI / 2;
      monument.add(ring1);
      monument.add(ring2);
      monument.position.y = 3.5;
    } else if (config.monumentType === 'pyramid') {
      const pyrGeo = new THREE.OctahedronGeometry(1.8, 0);
      const pyrMat = new THREE.MeshStandardMaterial({
        color: config.accentColor,
        roughness: 0.1,
        metalness: 0.7
      });
      monument = new THREE.Mesh(pyrGeo, pyrMat);
      monument.position.y = 3.5;
    } else if (config.monumentType === 'traffic') {
      monument = new THREE.Group();
      const poleGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.5, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 2.5;

      const boxGeo = new THREE.BoxGeometry(0.8, 2.0, 0.6);
      const boxMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      const box = new THREE.Mesh(boxGeo, boxMat);
      box.position.y = 3.2;

      // Traffic Signal Bulbs
      const bulbGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const redBulb = new THREE.Mesh(bulbGeo, new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      redBulb.position.set(0, 3.7, 0.32);
      const yellowBulb = new THREE.Mesh(bulbGeo, new THREE.MeshBasicMaterial({ color: 0xeab308 }));
      yellowBulb.position.set(0, 3.2, 0.32);
      const greenBulb = new THREE.Mesh(bulbGeo, new THREE.MeshBasicMaterial({ color: 0x22c55e }));
      greenBulb.position.set(0, 2.7, 0.32);

      monument.add(pole);
      monument.add(box);
      monument.add(redBulb);
      monument.add(yellowBulb);
      monument.add(greenBulb);
    } else {
      // Cyber Hub
      const cyberGeo = new THREE.CylinderGeometry(1.2, 1.2, 3.5, 8);
      const cyberMat = new THREE.MeshStandardMaterial({
        color: config.accentColor,
        roughness: 0.2,
        metalness: 0.9,
        wireframe: true
      });
      monument = new THREE.Mesh(cyberGeo, cyberMat);
      monument.position.y = 3.5;
    }

    if (monument) {
      group.add(monument);
    }

    // Attach interaction metadata
    group.userData = {
      name: config.name,
      subject: config.subject,
      monument: monument,
      initialY: config.pos[1],
      hoverY: config.pos[1] + 1.2,
      baseColor: config.color
    };

    return { group, base, top, monument, data: group.userData };
  }

  createMascotSparky() {
    const mascotGroup = new THREE.Group();
    mascotGroup.position.set(0, 6, 2);

    // Mascot Head
    const headGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.4,
      roughness: 0.2
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.castShadow = true;
    mascotGroup.add(head);

    // Glowing Cyan Visor Screen
    const visorGeo = new THREE.SphereGeometry(1.05, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.rotation.x = Math.PI / 2;
    visor.position.set(0, 0, 0.25);
    mascotGroup.add(visor);

    // Antenna & Glowing Signal Sphere
    const antGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.9);
    const antMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
    const antenna = new THREE.Mesh(antGeo, antMat);
    antenna.position.set(0, 1.5, 0);
    mascotGroup.add(antenna);

    const bulbGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const antennaBulb = new THREE.Mesh(bulbGeo, bulbMat);
    antennaBulb.position.set(0, 2.0, 0);
    mascotGroup.add(antennaBulb);

    // Floating Robotic Waving Hands
    const handGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const handMat = new THREE.MeshStandardMaterial({ color: 0x4f46e5 });

    const leftHand = new THREE.Mesh(handGeo, handMat);
    leftHand.position.set(-1.6, -0.4, 0.5);
    mascotGroup.add(leftHand);

    const rightHand = new THREE.Mesh(handGeo, handMat);
    rightHand.position.set(1.6, -0.2, 0.5);
    mascotGroup.add(rightHand);

    this.mascot = {
      group: mascotGroup,
      head,
      antennaBulb,
      leftHand,
      rightHand,
      baseY: 6
    };

    this.scene.add(mascotGroup);
  }

  setupInteractions() {
    const onPointerMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    this.canvas.addEventListener('mousemove', onPointerMove);
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        onPointerMove(e.touches[0]);
      }
    });

    // Click on Island to navigate to curriculum
    this.canvas.addEventListener('click', () => {
      if (this.hoveredIsland) {
        const subject = this.hoveredIsland.userData.subject;
        window.location.href = `lessons.html?subject=${subject}`;
      }
    });
  }

  animate() {
    this.animFrameId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Rotate Particles
    if (this.particles && !this.isReducedMotion) {
      this.particles.rotation.y = time * 0.03;
    }

    // Animate Floating Islands and Monuments
    this.islands.forEach((isl, idx) => {
      if (!this.isReducedMotion) {
        // Subtle floating bob
        const floatOffset = Math.sin(time * 1.5 + idx * 1.5) * 0.35;
        isl.group.position.y = THREE.MathUtils.lerp(
          isl.group.position.y,
          isl.data.initialY + floatOffset,
          0.05
        );

        // Rotate monument
        if (isl.monument) {
          isl.monument.rotation.y += 0.015;
          isl.monument.rotation.x = Math.sin(time * 0.8) * 0.1;
        }
      }
    });

    // Animate Mascot "Sparky"
    if (this.mascot && !this.isReducedMotion) {
      this.mascot.group.position.y = this.mascot.baseY + Math.sin(time * 2.5) * 0.45;
      this.mascot.rightHand.position.y = -0.2 + Math.sin(time * 6) * 0.35;
      this.mascot.rightHand.position.x = 1.6 + Math.cos(time * 6) * 0.15;
    }

    // Raycast Detection for Island Hover
    if (this.camera && this.raycaster && this.mouse) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const islandGroups = this.islands.map(i => i.group);
      const intersects = this.raycaster.intersectObjects(islandGroups, true);

      if (intersects.length > 0) {
        // Find topmost island group
        let hitGroup = intersects[0].object;
        while (hitGroup.parent && !islandGroups.includes(hitGroup)) {
          hitGroup = hitGroup.parent;
        }

        if (hitGroup && islandGroups.includes(hitGroup)) {
          this.hoveredIsland = hitGroup;
          this.canvas.style.cursor = 'pointer';
          hitGroup.position.y = THREE.MathUtils.lerp(hitGroup.position.y, hitGroup.userData.hoverY, 0.1);
        }
      } else {
        this.hoveredIsland = null;
        this.canvas.style.cursor = 'grab';
      }
    }

    // Update Orbit Controls
    if (this.controls) {
      this.controls.update();
    }

    // Render Scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  onResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 550;

    if (this.camera && this.renderer) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }

    if (this.canvas2D) {
      this.canvas2D.width = width;
      this.canvas2D.height = height;
      this.draw2DFallback();
    }
  }

  // =================================================================
  // 2D Canvas Fallback for Accessibility / Low-Power Mode
  // =================================================================
  init2DFallback() {
    if (this.canvas) this.canvas.style.display = 'none';

    let c2d = document.getElementById('world-2d-canvas');
    if (!c2d) {
      c2d = document.createElement('canvas');
      c2d.id = 'world-2d-canvas';
      c2d.className = 'world-2d-canvas';
      this.container.appendChild(c2d);
    }

    this.canvas2D = c2d;
    this.canvas2D.style.display = 'block';
    this.canvas2D.width = this.container.clientWidth;
    this.canvas2D.height = this.container.clientHeight || 550;
    this.ctx2D = this.canvas2D.getContext('2d');

    this.canvas2D.addEventListener('click', (e) => {
      const rect = this.canvas2D.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Click areas for 2D islands
      if (x < rect.width * 0.45 && y < rect.height * 0.5) {
        window.location.href = 'lessons.html?subject=kannada';
      } else if (x > rect.width * 0.55 && y < rect.height * 0.5) {
        window.location.href = 'lessons.html?subject=mathematics';
      } else if (y > rect.height * 0.6) {
        window.location.href = 'lessons.html?subject=everyday';
      }
    });

    this.draw2DFallback();
  }

  draw2DFallback() {
    if (!this.ctx2D || !this.canvas2D) return;
    const ctx = this.ctx2D;
    const w = this.canvas2D.width;
    const h = this.canvas2D.height;

    ctx.clearRect(0, 0, w, h);

    // Deep cosmic gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#090d16');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 2D Mascot "Sparky"
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.25, 32, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(w / 2 - 20, h * 0.25 - 8, 40, 16);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 15px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👋 Hello Explorer! Click an Island below:', w / 2, h * 0.38);

    // Island 1: Language Sanctuary
    this.draw2DIsland(w * 0.25, h * 0.55, 'Language Island', 'ಕನ್ನಡ • हिंदी • English', '#4f46e5');

    // Island 2: Math Mountain
    this.draw2DIsland(w * 0.75, h * 0.55, 'Math Mountain', '1 to 100 • Tables 1–20', '#06b6d4');

    // Island 3: Everyday Life & Safety
    this.draw2DIsland(w * 0.5, h * 0.82, 'Life & Safety Hub', '🚦 Traffic • 🧼 Habits • 💻 Coding', '#10b981');
  }

  draw2DIsland(x, y, title, subtitle, color) {
    const ctx = this.ctx2D;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x - 120, y - 45, 240, 90, 16);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, x, y - 5);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '13px Inter, sans-serif';
    ctx.fillText(subtitle, x, y + 20);
    ctx.restore();
  }

  switchTo2D() {
    if (this.canvas) this.canvas.style.display = 'none';
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.init2DFallback();
  }

  switchTo3D() {
    if (this.canvas2D) this.canvas2D.style.display = 'none';
    if (this.canvas) this.canvas.style.display = 'block';
    if (!this.scene) {
      this.init3DScene();
    } else {
      this.animate();
    }
  }
}

// Global Export
window.EducationalWorld3D = EducationalWorld3D;
