/**
 * AccessibleVerse — Interactive Science Explorer Engine
 * Multi-Simulation Lab: Solar System, Photosynthesis, Weather Machine, Pendulum Physics
 */

const PLANETS_DATA = [
  { id: 'mercury', name: 'Mercury', color: '#94a3b8', radius: 4, dist: 55, speed: 4.1, desc: 'Smallest planet and closest to the Sun. Extreme temperatures range from 430°C in daylight to -180°C at night.', kn: 'ಬುಧ: ಸೂರ್ಯನಿಗೆ ಅತ್ಯಂತ ಹತ್ತಿರವಿರುವ ಗ್ರಹ. ಹಗಲಿನಲ್ಲಿ ವಿಪರೀತ ಬಿಸಿಲು, ರಾತ್ರಿ ವಿಪರೀತ ಚಳಿ.', hi: 'बुध: सूर्य का सबसे निकटतम और सबसे छोटा ग्रह।' },
  { id: 'venus', name: 'Venus', color: '#fbbf24', radius: 7, dist: 85, speed: 1.6, desc: 'Hottest planet in our solar system with a thick toxic atmosphere of carbon dioxide and sulfuric acid clouds.', kn: 'ಶುಕ್ರ: ಅತಿ ಹೆಚ್ಚು ಬಿಸಿಯಾದ ಗ್ರಹ, ಹೊಳೆಯುವ ಬೆಳ್ಳಿ ಚುಕ್ಕಿ.', hi: 'शुक्र: सौरमंडल का सबसे गर्म ग्रह।' },
  { id: 'earth', name: 'Earth', color: '#06b6d4', radius: 8, dist: 120, speed: 1.0, desc: 'Our home oasis! 71% covered in liquid water, rich oxygen atmosphere, and teeming with diverse life.', kn: 'ಭೂಮಿ: ಜೀವಕೋಟಿಯ ಆವಾಸಸ್ಥಾನ, ನೀರು ಮತ್ತು ಆಮ್ಲಜನಕದಿಂದ ಸಮೃದ್ಧ.', hi: 'पृथ्वी: हमारा घर, जहाँ जीवन और जल मौजूद है।' },
  { id: 'mars', name: 'Mars', color: '#ef4444', radius: 5.5, dist: 160, speed: 0.53, desc: 'The Red Planet, colored by iron oxide (rust). Home to Olympus Mons, the largest volcano in the solar system.', kn: 'ಮಂಗಳ: ಕೆಂಪು ಗ್ರಹ. ಕಬ್ಬಿಣದ ಧೂಳು ಮತ್ತು ದೈತ್ಯ ಜ್ವಾಲಾಮುಖಿಗಳನ್ನು ಹೊಂದಿದೆ.', hi: 'मंगल: लाल ग्रह, जिस पर सौरमंडल का सबसे बड़ा ज्वालामुखी है।' },
  { id: 'jupiter', name: 'Jupiter', color: '#d97706', radius: 18, dist: 220, speed: 0.24, desc: 'King of planets! A gas giant more massive than all other planets combined, with a famous Great Red Spot storm.', kn: 'ಗುರು: ಅತಿ ದೊಡ್ಡ ಅನಿಲ ಗ್ರಹ. ಪ್ರಸಿದ್ಧ ಕೆಂಪು ಬಿರುಗಾಳಿಯನ್ನು ಹೊಂದಿದೆ.', hi: 'बृहस्पति: सौरमंडल का सबसे विशालकाय गैस दानव।' },
  { id: 'saturn', name: 'Saturn', color: '#fde047', radius: 14, dist: 280, speed: 0.12, rings: true, desc: 'Famous for its spectacular ring system made of billions of icy rock fragments and dust particles.', kn: 'ಶನಿ: ಸುಂದರವಾದ ಮಂಜುಗಡ್ಡೆಯ ಉಂಗುರಗಳನ್ನು ಹೊಂದಿರುವ ಗ್ರಹ.', hi: 'शनि: अपने चमकदार और सुंदर छल्लों के लिए प्रसिद्ध।' },
  { id: 'uranus', name: 'Uranus', color: '#38bdf8', radius: 10, dist: 335, speed: 0.06, desc: 'An ice giant that spins completely on its side like a rolling bowling ball, giving it 42-year long seasons.', kn: 'ಯುರೇನಸ್: ತಂಪಾದ ಮಂಜುಗಡ್ಡೆಯ ನೀಲಿ ಗ್ರಹ, ಪಕ್ಕಕ್ಕೆ ವಾಲಿಕೊಂಡು ಸುತ್ತುತ್ತದೆ.', hi: 'अरुण (यूरेनस): बर्फ से बना नीला ग्रह जो करवट लेकर घूमता है।' },
  { id: 'neptune', name: 'Neptune', color: '#3b82f6', radius: 9.5, dist: 385, speed: 0.03, desc: 'Most distant major planet, an ice giant with supersonic winds reaching over 2,000 km/h.', kn: 'ನೆಪ್ಚೂನ್: ಸೂರ್ಯನಿಂದ ಅತಿ ದೂರದಲ್ಲಿರುವ, ಅತಿ ವೇಗದ ಬಿರುಗಾಳಿ ಬೀಸುವ ಗ್ರಹ.', hi: 'वरुण (नेपच्यून): सबसे बाहरी बर्फीला ग्रह जहाँ भयानक तेज हवाएं चलती हैं।' }
];

let selectedPlanet = PLANETS_DATA[2]; // Earth
let solarSpeed = 1.0;
let showTrails = true;
let solarAngle = 0;
let solarReqId = null;

// Lab states
let activeTab = 'solar';
let plantReqId = null;
let weatherReqId = null;
let pendulumReqId = null;

// Weather State
let rainDrops = [];
let snowFlakes = [];

// Pendulum State
let pendulum = {
  length: 1.5,
  g: 9.8,
  angle: Math.PI / 4,
  angleV: 0,
  angleA: 0,
  damping: 0.996
};

document.addEventListener('DOMContentLoaded', () => {
  initPlanetChips();
  selectPlanet('earth');
  startSolarSimulation();
  if (window.lucide) lucide.createIcons();
});

// TAB SWITCHER
window.switchScienceTab = function(tabId) {
  activeTab = tabId;
  const tabs = ['solar', 'photosynthesis', 'weather', 'physics'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-${t}`);
    const panel = document.getElementById(`panel-${t}`);
    if (btn) btn.classList.toggle('active', t === tabId);
    if (panel) panel.style.display = t === tabId ? 'block' : 'none';
  });

  // Stop animations not in focus
  if (solarReqId) cancelAnimationFrame(solarReqId);
  if (plantReqId) cancelAnimationFrame(plantReqId);
  if (weatherReqId) cancelAnimationFrame(weatherReqId);
  if (pendulumReqId) cancelAnimationFrame(pendulumReqId);

  if (tabId === 'solar') startSolarSimulation();
  else if (tabId === 'photosynthesis') startPlantSimulation();
  else if (tabId === 'weather') startWeatherSimulation();
  else if (tabId === 'physics') startPendulumSimulation();

  if (window.lucide) lucide.createIcons();
};

// -------------------------------------------------------------
// 1. SOLAR SYSTEM SIMULATION
// -------------------------------------------------------------
function initPlanetChips() {
  const bar = document.getElementById('planet-selector-bar');
  if (!bar) return;
  bar.innerHTML = PLANETS_DATA.map(p => `
    <button class="planet-chip ${p.id === 'earth' ? 'active' : ''}" onclick="selectPlanet('${p.id}')">
      ${p.name}
    </button>
  `).join('');
}

window.selectPlanet = function(planetId) {
  const p = PLANETS_DATA.find(x => x.id === planetId);
  if (!p) return;
  selectedPlanet = p;

  document.querySelectorAll('.planet-chip').forEach(c => {
    c.classList.toggle('active', c.textContent.trim() === p.name);
  });

  const lang = localStorage.getItem('accessibleverse_lang') || 'en';
  let desc = p.desc;
  if (lang === 'kn' && p.kn) desc = p.kn;
  if (lang === 'hi' && p.hi) desc = p.hi;

  const infoBox = document.getElementById('planet-info-box');
  if (infoBox) {
    infoBox.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
        <span style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: ${p.color};"></span>
        <h3 style="margin: 0; font-size: 1.25rem;">${p.name}</h3>
        <span style="font-size: 0.85rem; color: #94a3b8;">(${p.dist} Million km from Sun)</span>
      </div>
      <p style="margin: 0;">${desc}</p>
    `;
  }
};

window.setSolarSpeed = function(val) {
  solarSpeed = parseFloat(val);
  const el = document.getElementById('speed-val');
  if (el) el.textContent = `${solarSpeed.toFixed(1)}x`;
};

window.toggleOrbitTrails = function(checked) {
  showTrails = checked;
};

window.resetSolarView = function() {
  solarAngle = 0;
  solarSpeed = 1.0;
  const speedInput = document.getElementById('solar-speed');
  if (speedInput) speedInput.value = 1.0;
  const speedVal = document.getElementById('speed-val');
  if (speedVal) speedVal.textContent = '1.0x';
};

window.speakCurrentPlanet = function() {
  if (!selectedPlanet) return;
  const lang = localStorage.getItem('accessibleverse_lang') || 'en';
  let text = `${selectedPlanet.name}. ${selectedPlanet.desc}`;
  if (lang === 'kn' && selectedPlanet.kn) text = `${selectedPlanet.name}. ${selectedPlanet.kn}`;
  if (lang === 'hi' && selectedPlanet.hi) text = `${selectedPlanet.name}. ${selectedPlanet.hi}`;

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(u);
  } else if (window.showToast) {
    window.showToast(text, 'info');
  }
};

function startSolarSimulation() {
  const canvas = document.getElementById('solar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function render() {
    solarAngle += 0.01 * solarSpeed;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Starfield Background
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 35; i++) {
      const sx = (Math.sin(i * 99) * 0.5 + 0.5) * canvas.width;
      const sy = (Math.cos(i * 33) * 0.5 + 0.5) * canvas.height;
      ctx.fillRect(sx, sy, 1.2, 1.2);
    }

    // Glowing Sun
    const sunGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 32);
    sunGrad.addColorStop(0, '#fef08a');
    sunGrad.addColorStop(0.4, '#eab308');
    sunGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();

    // Render Planet Orbits
    PLANETS_DATA.forEach(p => {
      const radiusX = p.dist * 0.95;
      const radiusY = p.dist * 0.36; // Elliptical perspective

      if (showTrails) {
        ctx.strokeStyle = p === selectedPlanet ? 'rgba(99, 102, 241, 0.6)' : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = p === selectedPlanet ? 1.5 : 0.8;
        ctx.beginPath();
        ctx.ellipse(cx, cy, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Planet Position
      const planetAngle = solarAngle * p.speed + (p.dist % 7);
      const px = cx + Math.cos(planetAngle) * radiusX;
      const py = cy + Math.sin(planetAngle) * radiusY;

      // Saturn Rings
      if (p.rings) {
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(px, py, p.radius * 2.2, p.radius * 0.7, Math.PI / 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Planet Body
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Selection Halo
      if (p === selectedPlanet) {
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, p.radius + 5, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    solarReqId = requestAnimationFrame(render);
  }

  render();
}

// -------------------------------------------------------------
// 2. PHOTOSYNTHESIS LAB SIMULATION
// -------------------------------------------------------------
function startPlantSimulation() {
  const canvas = document.getElementById('plant-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let bubbleTick = 0;

  function render() {
    bubbleTick += 0.05;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sun = parseInt(document.getElementById('sunlight-slider')?.value || 70);
    const water = parseInt(document.getElementById('water-slider')?.value || 60);

    // Sky Background depending on sunlight
    const skyAlpha = (sun / 100) * 0.5;
    ctx.fillStyle = `rgba(56, 189, 248, ${skyAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);

    // Soil Ground
    ctx.fillStyle = '#451a03';
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

    // Sun in upper corner
    if (sun > 10) {
      const sunR = 25 + (sun / 100) * 20;
      ctx.fillStyle = `rgba(251, 191, 36, ${sun / 100})`;
      ctx.beginPath();
      ctx.arc(100, 70, sunR, 0, Math.PI * 2);
      ctx.fill();

      // Sun rays
      ctx.strokeStyle = `rgba(251, 191, 36, ${(sun / 100) * 0.4})`;
      ctx.lineWidth = 2;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        ctx.beginPath();
        ctx.moveTo(100 + Math.cos(a) * (sunR + 5), 70 + Math.sin(a) * (sunR + 5));
        ctx.lineTo(100 + Math.cos(a) * (sunR + 25), 70 + Math.sin(a) * (sunR + 25));
        ctx.stroke();
      }
    }

    // Plant Stem & Leaf growth
    const stemH = 120 + ((sun + water) / 200) * 80;
    const plantX = canvas.width / 2;
    const soilY = canvas.height * 0.7;

    // Stem
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(plantX, soilY);
    ctx.quadraticCurveTo(plantX + Math.sin(bubbleTick) * 4, soilY - stemH / 2, plantX, soilY - stemH);
    ctx.stroke();

    // Leaves
    const leafColor = sun < 30 ? '#ca8a04' : '#16a34a';
    ctx.fillStyle = leafColor;

    // Left Leaf
    ctx.beginPath();
    ctx.ellipse(plantX - 45, soilY - stemH * 0.45, 45, 18, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // Right Leaf
    ctx.beginPath();
    ctx.ellipse(plantX + 45, soilY - stemH * 0.65, 48, 19, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // Flower at Top
    if (sun > 40 && water > 30) {
      ctx.fillStyle = '#ec4899';
      for (let p = 0; p < 5; p++) {
        const ang = (p * Math.PI * 2) / 5;
        ctx.beginPath();
        ctx.arc(plantX + Math.cos(ang) * 16, soilY - stemH + Math.sin(ang) * 16, 12, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(plantX, soilY - stemH, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Oxygen bubbles released from leaves
    if (sun > 20 && water > 15) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
      for (let b = 0; b < 6; b++) {
        const by = (soilY - stemH * 0.5 - ((bubbleTick * 35 + b * 40) % 180));
        const bx = plantX + (b % 2 === 0 ? -40 : 40) + Math.sin(bubbleTick + b) * 8;
        ctx.beginPath();
        ctx.arc(bx, by, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px sans-serif';
        ctx.fillText('O₂', bx + 6, by + 4);
      }
    }

    plantReqId = requestAnimationFrame(render);
  }

  render();
}

window.updatePlantLab = function() {
  const sun = parseInt(document.getElementById('sunlight-slider')?.value || 70);
  const water = parseInt(document.getElementById('water-slider')?.value || 60);
  const co2 = parseInt(document.getElementById('co2-slider')?.value || 50);

  document.getElementById('sunlight-val').textContent = `${sun}%`;
  document.getElementById('water-val').textContent = `${water}%`;
  document.getElementById('co2-val').textContent = `${co2}%`;

  // Calculate rate
  const o2Rate = Math.min(100, Math.round((sun * 0.4 + water * 0.35 + co2 * 0.25)));
  const glucoseRate = Math.min(100, Math.round((sun * 0.35 + water * 0.35 + co2 * 0.3)));

  const o2Gauge = document.getElementById('oxygen-gauge');
  const glucGauge = document.getElementById('glucose-gauge');
  const o2Val = document.getElementById('oxygen-val');
  const glucVal = document.getElementById('glucose-val');

  if (o2Gauge) o2Gauge.style.width = `${o2Rate}%`;
  if (glucGauge) glucGauge.style.width = `${glucoseRate}%`;
  if (o2Val) o2Val.textContent = `${o2Rate}%`;
  if (glucVal) glucVal.textContent = `${glucoseRate}%`;
};

// -------------------------------------------------------------
// 3. WEATHER MACHINE & WATER CYCLE
// -------------------------------------------------------------
function startWeatherSimulation() {
  const canvas = document.getElementById('weather-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Init rain and snow
  rainDrops = [];
  for (let i = 0; i < 70; i++) {
    rainDrops.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, l: 15, v: 8 + Math.random() * 5 });
  }
  snowFlakes = [];
  for (let i = 0; i < 60; i++) {
    snowFlakes.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: 2 + Math.random() * 2, v: 1 + Math.random() * 2 });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const temp = parseInt(document.getElementById('temp-slider')?.value || 22);
    const humidity = parseInt(document.getElementById('humidity-slider')?.value || 65);
    const wind = parseInt(document.getElementById('wind-slider')?.value || 15);

    // Sky Background depending on humidity
    const skyDarkness = (humidity / 100) * 0.55;
    ctx.fillStyle = `rgb(${Math.round(50 - skyDarkness * 35)}, ${Math.round(120 - skyDarkness * 70)}, ${Math.round(200 - skyDarkness * 90)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Rolling Green Hills
    ctx.fillStyle = temp <= 0 ? '#e2e8f0' : '#15803d';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.75);
    ctx.quadraticCurveTo(canvas.width * 0.3, canvas.height * 0.65, canvas.width * 0.6, canvas.height * 0.78);
    ctx.quadraticCurveTo(canvas.width * 0.85, canvas.height * 0.85, canvas.width, canvas.height * 0.72);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fill();

    // Ocean / Lake for Evaporation
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(canvas.width * 0.25, canvas.height * 0.88, 180, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cloud formation
    if (humidity > 35) {
      const cloudAlpha = (humidity / 100);
      ctx.fillStyle = humidity > 75 ? `rgba(100, 116, 139, ${cloudAlpha})` : `rgba(255, 255, 255, ${cloudAlpha})`;
      drawCloud(ctx, canvas.width * 0.45 + Math.sin(Date.now() * 0.001) * 20, 70, 70);
      drawCloud(ctx, canvas.width * 0.75, 90, 55);
    }

    // Precipitation: Rain or Snow
    if (humidity > 60) {
      if (temp <= 0) {
        // Snow
        ctx.fillStyle = '#ffffff';
        snowFlakes.forEach(s => {
          s.y += s.v;
          s.x += (wind / 60) * 3;
          if (s.y > canvas.height) s.y = -10;
          if (s.x > canvas.width) s.x = 0;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // Rain
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        rainDrops.forEach(r => {
          r.y += r.v;
          r.x += (wind / 60) * 4;
          if (r.y > canvas.height) r.y = -15;
          if (r.x > canvas.width) r.x = 0;
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x + (wind / 60) * 5, r.y + r.l);
          ctx.stroke();
        });
      }
    }

    weatherReqId = requestAnimationFrame(render);
  }

  render();
}

function drawCloud(ctx, x, y, size) {
  ctx.beginPath();
  ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
  ctx.arc(x + size * 0.4, y - size * 0.2, size * 0.45, 0, Math.PI * 2);
  ctx.arc(x + size * 0.8, y, size * 0.5, 0, Math.PI * 2);
  ctx.arc(x + size * 0.4, y + size * 0.2, size * 0.4, 0, Math.PI * 2);
  ctx.fill();
}

window.updateWeatherLab = function() {
  const temp = parseInt(document.getElementById('temp-slider')?.value || 22);
  const humidity = parseInt(document.getElementById('humidity-slider')?.value || 65);
  const wind = parseInt(document.getElementById('wind-slider')?.value || 15);

  document.getElementById('temp-val').textContent = `${temp}°C`;
  document.getElementById('humidity-val').textContent = `${humidity}%`;
  document.getElementById('wind-val').textContent = `${wind} km/h`;

  const box = document.getElementById('weather-status-box');
  if (box) {
    let condition = "Sunny and clear.";
    if (humidity > 60 && temp <= 0) condition = "❄️ Freezing conditions! Water vapor condenses into snow crystals.";
    else if (humidity > 75) condition = "⛈️ High humidity and cloud density! Heavy rain precipitation occurs.";
    else if (humidity > 50) condition = "⛅ Scattered cloud accumulation. Gentle water evaporation from surface lake.";

    box.innerHTML = `<strong>Current Atmosphere:</strong> ${condition} <br><small>Water cycle steps: 1. Evaporation ➔ 2. Condensation (Clouds) ➔ 3. Precipitation (Rain/Snow) ➔ 4. Collection.</small>`;
  }
};

// -------------------------------------------------------------
// 4. PENDULUM & GRAVITY LAB
// -------------------------------------------------------------
function startPendulumSimulation() {
  const canvas = document.getElementById('pendulum-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Physics calculations
    // a = (-g / l) * sin(theta)
    pendulum.angleA = (-1 * (pendulum.g / (pendulum.length * 60))) * Math.sin(pendulum.angle);
    pendulum.angleV += pendulum.angleA;
    pendulum.angleV *= pendulum.damping;
    pendulum.angle += pendulum.angleV;

    const originX = canvas.width / 2;
    const originY = 40;
    const pixelLen = pendulum.length * 90;

    const bobX = originX + Math.sin(pendulum.angle) * pixelLen;
    const bobY = originY + Math.cos(pendulum.angle) * pixelLen;

    // Ceiling Mount
    ctx.fillStyle = '#64748b';
    ctx.fillRect(originX - 40, originY - 12, 80, 12);

    // String
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Bob
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.arc(bobX, bobY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    pendulumReqId = requestAnimationFrame(render);
  }

  render();
}

window.updatePendulumLab = function() {
  const len = parseFloat(document.getElementById('length-slider')?.value || 1.5);
  const grav = parseFloat(document.getElementById('planet-gravity')?.value || 9.8);

  pendulum.length = len;
  pendulum.g = grav;

  document.getElementById('length-val').textContent = `${len.toFixed(1)} m`;

  const period = 2 * Math.PI * Math.sqrt(len / grav);
  const infoBox = document.getElementById('physics-info-box');
  if (infoBox) {
    infoBox.innerHTML = `
      <strong>Theoretical Period (T):</strong> ${period.toFixed(2)} seconds per oscillation.
      <br>Formula: <em>T = 2π √(L / g)</em>. With length ${len}m and gravity ${grav} m/s², the pendulum takes ${period.toFixed(2)}s for a complete back-and-forth swing.
    `;
  }
};

window.resetPendulum = function() {
  pendulum.angle = Math.PI / 4;
  pendulum.angleV = 0;
};
