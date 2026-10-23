# AccessibleVerse — Learn Without Limits 🌟

A competition-quality, WCAG 2.2 accessible educational web platform featuring an interactive 3D learning world, trilingual curriculum (Kannada, Hindi, English), mathematics tables 1 to 20, everyday road safety and hygiene habits, coding fundamentals, 6 playable educational games, and a curated YouTube learning library.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies & Tools | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, Vanilla ES6+ JavaScript | Zero bundler, runs directly as static files without build steps. |
| **3D & Graphics** | Three.js (WebGL) + HTML5 2D Canvas Fallback | Interactive 3D learning world, floating islands, mascot character "Sparky", and 3D Endless Runner. |
| **Accessibility** | Web Speech API, WCAG 2.2 AA / AAA | High Contrast mode, Dyslexia-friendly font (Lexend), font scaler, voice narration, reduced motion. |
| **Backend** | Python 3, Flask REST API, Flask-CORS, Flask-JWT-Extended | Secure token-based authentication, modular blueprints, password hashing with Werkzeug. |
| **Database** | MongoDB Atlas with PyMongo & dnspython | Persistent storage for users, completed lessons, quiz scores, game high scores, and achievements. |
| **Hosting** | Netlify (Frontend) & Render (Backend) | Static edge deployment for HTML/CSS/JS and cloud web service for Flask. |

---

## 📁 Project Folder Structure

```
├── frontend/
│   ├── index.html                    # 3D Educational World & Main Landing
│   ├── login.html                    # Accessible sign in with quick demo helper
│   ├── register.html                 # Student / Teacher account creation
│   ├── dashboard.html                # XP progress meter, streaks, and teacher analytics
│   ├── lessons.html                  # Trilingual curriculum browser & interactive reader
│   ├── games.html                    # Arcade hosting all 6 playable educational games
│   ├── videos.html                   # Curated YouTube learning library & playlist embeds
│   ├── profile.html                  # Avatar selection, language, and accessibility settings
│   ├── css/
│   │   ├── style.css                 # Core design system, glassmorphism, colors, cards
│   │   ├── responsive.css            # Responsive layout for desktop, tablet, and mobile
│   │   ├── accessibility.css         # High contrast (AAA), dyslexia font, font scaling
│   │   └── games.css                 # 3D runner HUD, virtual controls, game styling
│   ├── js/
│   │   ├── config.js                 # Global API_BASE_URL and application constants
│   │   ├── api.js                    # Reusable API client with seamless offline fallback
│   │   ├── app.js                    # Shared UI helpers, toast alerts, auth states
│   │   ├── auth.js                   # Form validation and JWT management
│   │   ├── language.js               # Kannada, Hindi, English translations & Speech API
│   │   ├── accessibility.js          # WCAG controller and floating toolbar panel
│   │   ├── dashboard.js              # XP meter, streak, achievements, teacher classroom
│   │   ├── lessons.js                # Curriculum reader, multiplication tables, code sandbox
│   │   ├── videos.js                 # YouTube embeds, playlist, and category filters
│   │   ├── world3d.js                # Three.js 3D world with floating islands & 2D fallback
│   │   └── games/
│   │       ├── knowledge-runner.js   # 3D Endless Runner (Jump, Slide, Checkpoints)
│   │       ├── alphabet-adventure.js # Multilingual letter balloon matching
│   │       ├── number-quest.js       # Counting, addition, tables 1-20 frenzy
│   │       ├── memory-match.js       # 3D card-flip memory matching
│   │       ├── puzzle-world.js       # Sequential pattern and logic puzzles
│   │       └── traffic-safety.js     # Road crossing & traffic signal simulation
│   ├── assets/                       # Images, audio, and 3D models
│   ├── netlify.toml                  # Netlify deployment configuration
│   └── .env.example                  # Client environment notes
├── backend/
│   ├── app/
│   │   ├── __init__.py               # Flask application factory (CORS, JWT, Blueprints)
│   │   ├── extensions.py             # Safe PyMongo and JWT initialization
│   │   ├── routes/                   # Auth, Lessons, Videos, Quizzes, Games, Progress, Health
│   │   ├── models/                   # Schemas for users, scores, attempts, and progress
│   │   └── services/                 # Database queries, seed data, and memory fallback
│   ├── tests/
│   │   └── test_api.py               # Automated pytest suite for backend endpoints
│   ├── requirements.txt              # Python package dependencies
│   ├── run.py                        # Local Flask server entry point
│   ├── .env.example                  # Backend environment template
│   └── .env                          # Local environment secrets (ignored by Git)
├── netlify.toml                      # Root Netlify configuration
├── README.md                         # Beginner-friendly setup and deployment guide
└── .gitignore                        # Git exclusion rules (protects credentials)
```

---

## 🚀 Beginner Quickstart Guide (Step-by-Step)

### Step 1: Install Python & Dependencies

1. Make sure Python 3.10+ is installed on your computer. Check with:
   ```bash
   python --version
   ```
2. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Step 2: Configure MongoDB Atlas

1. Open `backend/.env` in your text editor.
2. Locate the line:
   ```env
   MONGODB_URI=mongodb+srv://tejasm103:<db_password>@cluster0.3neibjf.mongodb.net/?compressors=zlib
   ```
3. Replace `<db_password>` with your actual MongoDB Atlas database user password:
   * *Tip:* If your password has special characters like `@` or `#`, encode them (for example, replace `@` with `%40`).
   * *Important:* In your MongoDB Atlas web dashboard under **Network Access**, ensure your current IP address (or `0.0.0.0/0` for universal development access) is allowlisted.

### Step 3: Run the Flask Backend

From inside the `backend/` directory, start the server:
```bash
python run.py
```
You will see:
```
🚀 AccessibleVerse Backend REST API is running!
📡 Local URL: http://127.0.0.1:5000
🩺 Health Check: http://127.0.0.1:5000/api/health
```

### Step 4: Verify the Health Check

Open your browser or run:
```bash
curl http://127.0.0.1:5000/api/health
```
You will receive:
```json
{
  "database": {
    "connected": true,
    "database_name": "accessibleverse",
    "engine": "MongoDB Atlas",
    "notice": "Connected and operational"
  },
  "service": "AccessibleVerse Backend REST API",
  "status": "healthy"
}
```

> **Note on Offline Development:** If your MongoDB password is not yet configured, the backend starts in graceful local fallback mode without crashing, and reports the exact setup guidance in `/api/health`.

### Step 5: Run Automated Tests

To verify that all endpoints (health, authentication, lessons, videos, quizzes, and game scores) are functioning:
```bash
cd backend
python -m pytest tests
```
*Result: 5 passed in <1s.*

### Step 6: Launch the Frontend

Because the frontend is plain HTML5, CSS3, and JavaScript, **no build step or bundler is required!**

You can use any local static server:
1. **Using Python:**
   ```bash
   cd frontend
   python -m http.server 5500
   ```
2. **Using VS Code Live Server:** Right-click `frontend/index.html` and click **"Open with Live Server"**.
3. Visit: [http://localhost:5500](http://localhost:5500) (or `http://127.0.0.1:5500`).

---

## 🎮 The 6 Playable Educational Games

1. **Knowledge Runner 3D**:
   * Real Three.js 3-lane endless highway.
   * Controls: Left / Right arrows (or `A` / `D` / on-screen D-pad) to change lanes, Up Arrow (or `Space` / `W`) to jump, Down Arrow (`S`) to slide.
   * Curriculum checkpoints pop up at score milestones with multiple-choice questions in Kannada, Hindi, Math, and Road Safety. Answering correctly grants bonus XP!
2. **Alphabet Adventure**:
   * Falling balloons carrying letters in Kannada (ಅ, ಆ, ಕ, ಗ), Hindi (अ, आ, क, ख), and English (A to Z).
   * Web Speech API announces target phonics; user catches matching bubbles.
3. **Number Quest Arcade**:
   * 4 game modes: Visual counting, Addition & Subtraction, Multiplication Tables 1 to 20 Frenzy, and Division.
4. **Memory Match 3D**:
   * Interactive 3D card-flip animation (`rotateY(180deg)`). Pair letters, numbers, and road signs.
5. **Puzzle World**:
   * Sequential logic puzzles: geometric patterns, traffic light sequences, doubling numbers, and hygiene routines.
6. **Traffic Safety Challenge**:
   * Real-time road crossing simulator. Observe moving vehicles and cross on the Zebra Crossing only when the pedestrian light turns GREEN.

---

## 🌐 Trilingual Curriculum

AccessibleVerse natively supports 3 languages across both the interface and lessons:
* **ಕನ್ನಡ (Kannada)**: 14 Swaragalu (ಅ to ಅಃ), 34 Vyanjangalu (ಕ to ಳ), word associations, and synthetic narration via Web Speech API (`kn-IN`).
* **हिंदी (Hindi)**: Hindi Varnamala (स्वर and व्यंजन), matras, vocabulary, and narration (`hi-IN`).
* **English**: Uppercase & lowercase pairs, phonics sound guide (`/æ/`, `/b/`, `/k/`), spelling, and sentences (`en-US`).

---

## ♿ Accessibility Features (WCAG 2.2 AA / AAA)

* **Accessibility Toolbar (Alt + A)**: Click the floating badge at the bottom-left or press `Alt + A` to open options anytime.
* **High Contrast Mode**: Crisp pure black surfaces with canary yellow (`#ffff00`) and cyan outlines.
* **Dyslexia-Friendly Typography**: Uses the Lexend font with weighted baselines, enhanced letter-spacing, and increased line height.
* **Text Resizing**: `A-`, `A`, `A+`, and `A++` scaling buttons.
* **Read Aloud (TTS)**: Spoken audio narration for questions, vocabulary, and directions.
* **Reduced Motion**: Disables 3D camera sweeps and fast particle effects for vestibular accessibility.
* **Simplified 2D Mode**: Swaps the 3D WebGL scene for an accessible 2D canvas on lower-power devices.

---

## 🚢 Production Deployment Guide

### Deploying the Backend on Render

1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New > Web Service**.
3. Connect your GitHub repository.
4. Configure service settings:
   * **Root Directory:** `backend`
   * **Environment:** `Python 3`
   * **Build Command:** `pip install -r requirements.txt`
   * **Start Command:** `python run.py` (or `gunicorn run:app`)
5. In the **Environment Variables** section on Render, add:
   * `MONGODB_URI`: Your Atlas connection string with your actual password.
   * `MONGODB_DB_NAME`: `accessibleverse`
   * `JWT_SECRET_KEY`: A secure 32+ character random string.
   * `FRONTEND_ORIGIN`: Your live Netlify domain (e.g. `https://your-site.netlify.app`).
   * `FLASK_ENV`: `production`
6. Click **Deploy Web Service**. Render will assign a public URL (e.g., `https://accessibleverse-backend.onrender.com`).

### Deploying the Frontend on Netlify

1. In your local `frontend/js/config.js`, update `API_BASE_URL` with your Render backend URL:
   ```javascript
   const CONFIG = {
     API_BASE_URL: 'https://your-backend.onrender.com',
     ...
   };
   ```
2. Commit and push the change to GitHub.
3. Sign in to [Netlify](https://www.netlify.com) and click **Add new site > Import an existing project**.
4. Select your GitHub repository.
5. In build settings:
   * **Base directory:** Leave blank (or `frontend`)
   * **Publish directory:** `frontend`
   * **Build command:** Leave empty (static HTML/CSS/JS requires no build step!)
6. Click **Deploy Site**. Netlify will publish your site to an HTTPS production URL within seconds.

---

## 🧪 Verification & Automated Testing Checklist

- [x] Flask REST API health route (`GET /api/health`) verified with status 200.
- [x] Automated pytest suite passing 5/5 tests in `backend/tests/test_api.py`.
- [x] Secure JWT registration and login with Werkzeug password hashing.
- [x] MongoDB database connectivity with PyMongo and dnspython.
- [x] 10 Curated YouTube video embeds + official playlist metadata loaded.
- [x] Three.js 3D world with interactive floating islands and mascot "Sparky".
- [x] 2D low-power canvas fallback toggle verified.
- [x] 6 playable educational games functioning with score tracking.
- [x] Multilingual dictionary and Web Speech API narration in Kannada, Hindi, and English.
- [x] WCAG 2.2 accessibility tools: High contrast, Dyslexia font, text scaling, keyboard focus rings.
- [x] Single reusable `js/api.js` client reading `API_BASE_URL` from `js/config.js`.

---

## 📄 License & Credits

Built for competition and inclusive education. All educational contents and codes are open and accessible under the MIT License.
