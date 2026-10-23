/**
 * AccessibleVerse — Authentication Manager
 * Handles Registration, Login, Form Validation, and Role Selection.
 */

document.addEventListener('DOMContentLoaded', () => {
  setupRegisterForm();
  setupLoginForm();
});

function setupRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const fullName = document.getElementById('reg-fullname').value.trim() || username;
    const roleEl = document.querySelector('input[name="user-role"]:checked');
    const role = roleEl ? roleEl.value : 'student';

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';

    const res = await window.api.auth.register({
      username,
      email,
      password,
      full_name: fullName,
      role
    });

    submitBtn.disabled = false;
    submitBtn.textContent = 'Create My Free Account';

    if (res.success) {
      window.showToast("Registration successful! Welcome to AccessibleVerse.", "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 700);
    } else {
      window.showToast(res.error || "Registration failed. Please check inputs.", "error");
    }
  });
}

function setupLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const identifier = document.getElementById('login-identifier').value.trim();
    const password = document.getElementById('login-password').value;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing In...';

    const res = await window.api.auth.login({
      identifier,
      password
    });

    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign In to AccessibleVerse';

    if (res.success) {
      window.showToast("Welcome back! Loading your dashboard...", "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 700);
    } else {
      window.showToast(res.error || "Invalid username/email or password.", "error");
    }
  });
}

// Quick Fill Demo Credentials Helper for Beginner Testing
window.fillDemoLogin = function(role = 'student') {
  const idEl = document.getElementById('login-identifier');
  const pwEl = document.getElementById('login-password');
  if (idEl && pwEl) {
    if (role === 'student') {
      idEl.value = 'student';
      pwEl.value = 'password123';
    } else {
      idEl.value = 'teacher';
      pwEl.value = 'password123';
    }
    window.showToast(`Filled ${role} demo credentials. Click "Sign In"!`, "info");
  }
};
