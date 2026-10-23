/**
 * AccessibleVerse — Real-World Life Skills Engine
 * Indian Rupee (₹) Grocery Market + Interactive Analog Clock Trainer
 */

const GROCERY_ITEMS = [
  { id: 'item_milk', name: 'Fresh Milk (1L)', price: 30, icon: '🥛' },
  { id: 'item_apples', name: 'Kashmir Apples (1kg)', price: 80, icon: '🍎' },
  { id: 'item_bread', name: 'Whole Wheat Bread', price: 40, icon: '🍞' },
  { id: 'item_pencils', name: 'Color Pencil Set', price: 25, icon: '✏️' },
  { id: 'item_geometry', name: 'Geometry Tool Box', price: 65, icon: '📐' },
  { id: 'item_soap', name: 'Hygienic Bath Soap', price: 20, icon: '🧼' }
];

let cart = [];
let moneyGiven = 0;

// Clock State
let currentHour = 10;
let currentMinute = 15;
let targetHour = 8;
let targetMinute = 30;

document.addEventListener('DOMContentLoaded', () => {
  renderMarketShelf();
  drawClock(currentHour, currentMinute);
  if (window.lucide) lucide.createIcons();
});

window.switchSkillTab = function(tabKey) {
  ['market', 'clock', 'hygiene'].forEach(k => {
    const btn = document.getElementById(`tab-${k}`);
    const sec = document.getElementById(`section-${k}`);
    if (btn) btn.classList.toggle('active', k === tabKey);
    if (sec) sec.style.display = k === tabKey ? 'block' : 'none';
  });

  if (tabKey === 'clock') {
    setTimeout(() => drawClock(currentHour, currentMinute), 50);
  }
  if (window.lucide) lucide.createIcons();
};

// -------------------------------------------------------------
// 1. GROCERY MARKET
// -------------------------------------------------------------
function renderMarketShelf() {
  const shelf = document.getElementById('market-shelf');
  if (!shelf) return;
  shelf.innerHTML = GROCERY_ITEMS.map(i => `
    <div class="item-card" onclick="addToCart('${i.id}')">
      <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">${i.icon}</div>
      <strong style="font-size: 0.85rem; color: #f8fafc; display: block;">${i.name}</strong>
      <span style="font-size: 0.95rem; font-weight: 800; color: #10b981;">₹${i.price}</span>
    </div>
  `).join('');
}

window.addToCart = function(itemId) {
  const item = GROCERY_ITEMS.find(x => x.id === itemId);
  if (!item) return;
  cart.push(item);
  renderCart();
};

window.clearCart = function() {
  cart = [];
  moneyGiven = 0;
  renderCart();
  const fb = document.getElementById('checkout-feedback');
  if (fb) fb.style.display = 'none';
};

function renderCart() {
  const list = document.getElementById('cart-items-list');
  const totalSpan = document.getElementById('bill-total');
  const moneyGivenSpan = document.getElementById('money-given');

  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = '<p style="color: #94a3b8; font-style: italic;">Cart is empty. Click items on the left to add!</p>';
    if (totalSpan) totalSpan.textContent = '₹0';
    if (moneyGivenSpan) moneyGivenSpan.textContent = '₹0';
    return;
  }

  const total = cart.reduce((sum, i) => sum + i.price, 0);
  list.innerHTML = cart.map((i, idx) => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.35rem 0; font-size: 0.9rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
      <span>${i.icon} ${i.name}</span>
      <div>
        <strong style="color: #f8fafc; margin-right: 0.5rem;">₹${i.price}</strong>
        <button style="background: none; border: none; color: #ef4444; cursor: pointer;" onclick="removeFromCart(${idx})">✕</button>
      </div>
    </div>
  `).join('');

  if (totalSpan) totalSpan.textContent = `₹${total}`;
  if (moneyGivenSpan) moneyGivenSpan.textContent = `₹${moneyGiven}`;
}

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  renderCart();
};

window.addMoney = function(amount) {
  moneyGiven += amount;
  const moneyGivenSpan = document.getElementById('money-given');
  if (moneyGivenSpan) moneyGivenSpan.textContent = `₹${moneyGiven}`;
};

window.checkoutMarket = function() {
  const fb = document.getElementById('checkout-feedback');
  if (!fb) return;
  fb.style.display = 'block';

  const total = cart.reduce((sum, i) => sum + i.price, 0);
  if (total === 0) {
    fb.innerHTML = '<div style="color: #f59e0b;">Your cart is empty! Add some groceries first.</div>';
    return;
  }

  if (moneyGiven < total) {
    const shortage = total - moneyGiven;
    fb.innerHTML = `
      <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; padding: 0.85rem; border-radius: 8px; color: #f87171;">
        <strong>Not enough money!</strong> Shortage of ₹${shortage}. Add more notes or coins above.
      </div>
    `;
    return;
  }

  const change = moneyGiven - total;
  fb.innerHTML = `
    <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; padding: 1rem; border-radius: 8px; color: #10b981;">
      <strong>🧾 Payment Successful! Receipt Issued:</strong>
      <div style="margin: 0.5rem 0; color: #f8fafc;">
        Total: ₹${total} | Paid: ₹${moneyGiven} | <strong>Change Returned: ₹${change}</strong>
      </div>
      <small style="color: #cbd5e1;">Excellent shopping calculation! +20 XP awarded.</small>
    </div>
  `;

  // Award XP
  try {
    const user = JSON.parse(localStorage.getItem('accessibleverse_user') || '{}');
    user.xp = (user.xp || 0) + 20;
    localStorage.setItem('accessibleverse_user', JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('xpUpdated', { detail: { xp: user.xp, added: 20 } }));
    if (window.showToast) window.showToast(`Shopping Completed! ₹${change} change received. +20 XP!`, 'success');
  } catch {}
};

// -------------------------------------------------------------
// 2. ANALOG CLOCK TRAINER
// -------------------------------------------------------------
function drawClock(hour, minute) {
  const canvas = document.getElementById('analog-clock-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = canvas.width / 2 - 15;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Clock Face
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Hour Numbers
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 16px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let num = 1; num <= 12; num++) {
    const ang = (num * Math.PI) / 6;
    const nx = cx + Math.sin(ang) * (r - 25);
    const ny = cy - Math.cos(ang) * (r - 25);
    ctx.fillText(num.toString(), nx, ny);
  }

  // Minute Marks (ticks)
  for (let tick = 0; tick < 60; tick++) {
    const ang = (tick * Math.PI) / 30;
    const isMajor = tick % 5 === 0;
    const tLen = isMajor ? 8 : 4;
    ctx.strokeStyle = isMajor ? '#94a3b8' : '#475569';
    ctx.lineWidth = isMajor ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.sin(ang) * (r - 8), cy - Math.cos(ang) * (r - 8));
    ctx.lineTo(cx + Math.sin(ang) * (r - 8 - tLen), cy - Math.cos(ang) * (r - 8 - tLen));
    ctx.stroke();
  }

  // Hour Hand
  const hourAng = ((hour % 12) * Math.PI) / 6 + (minute * Math.PI) / (6 * 60);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.sin(hourAng) * (r * 0.5), cy - Math.cos(hourAng) * (r * 0.5));
  ctx.stroke();

  // Minute Hand
  const minAng = (minute * Math.PI) / 30;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.sin(minAng) * (r * 0.75), cy - Math.cos(minAng) * (r * 0.75));
  ctx.stroke();

  // Center Pin
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fill();
}

window.updateClockFromSliders = function() {
  currentHour = parseInt(document.getElementById('hour-slider')?.value || 10);
  currentMinute = parseInt(document.getElementById('minute-slider')?.value || 15);

  document.getElementById('hour-val').textContent = currentHour;
  document.getElementById('minute-val').textContent = currentMinute.toString().padStart(2, '0');

  const paddedMin = currentMinute.toString().padStart(2, '0');
  document.getElementById('digital-clock-display').textContent = `${currentHour}:${paddedMin} AM`;

  drawClock(currentHour, currentMinute);
};

window.checkClockChallenge = function() {
  const fb = document.getElementById('clock-feedback');
  if (!fb) return;

  if (currentHour === targetHour && Math.abs(currentMinute - targetMinute) <= 2) {
    fb.style.color = '#10b981';
    fb.innerHTML = '✅ Correct! The clock is set to 8:30 AM! +15 XP!';
    try {
      const user = JSON.parse(localStorage.getItem('accessibleverse_user') || '{}');
      user.xp = (user.xp || 0) + 15;
      localStorage.setItem('accessibleverse_user', JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('xpUpdated', { detail: { xp: user.xp, added: 15 } }));
    } catch {}
  } else {
    fb.style.color = '#ef4444';
    fb.innerHTML = `❌ Current time is ${currentHour}:${currentMinute.toString().padStart(2, '0')}. Please adjust to 8:30 AM.`;
  }
};

window.startEyeTimer = function() {
  if (window.showToast) {
    window.showToast('👀 Looking at an object 20 feet away for 20 seconds...', 'info');
  }
  let remaining = 20;
  const interval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(interval);
      if (window.showToast) window.showToast('✨ Great job resting your eyes! Eye strain relieved.', 'success');
    }
  }, 1000);
};
