# 🚀 Prompt Vault AI — Enterprise-Grade MERN Prompt Management System

> **"Your AI Prompts. Organized. Smarter."**
> A modern, production-quality MERN Stack web application designed to save, organize, discover, and improve AI prompts across ChatGPT, Claude, Gemini, Midjourney, and custom LLMs. Recreated meticulously from the **Stitch UI design**.

---

## 🎨 Visual & UX Design (Stitch Inspired)

- **Theme**: Dark premium SaaS palette (`#07090e` Obsidian background, deep card surfaces `#0d121f`).
- **Gradients**: Electric Indigo, Royal Purple, and Cyan accent gradients.
- **Glassmorphism**: Backdrop blur with thin, elegant borders (`rgba(255, 255, 255, 0.08)`).
- **Prompt Cards**: Monospace code blocks with dynamic `{parameter}` token highlights.
- **Quality Scoring**: Interactive Before & After comparison with gradient progress bars.
- **Responsiveness**: Pixel-perfect on desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

### Frontend
- **React.js (v18)** + **Vite** for ultra-fast HMR and building.
- **Tailwind CSS** with custom dark theme colors, typography, and glows.
- **React Router v6** (Browser routing with protected route guards).
- **Axios** with automatic JWT authorization header interceptors.
- **Lucide React** for modern, crisp icons.

### Backend
- **Node.js** & **Express.js** RESTful API.
- **MongoDB** with **Mongoose** schema modeling, indexes, and validation.
- **JWT (JSON Web Tokens)** for stateless, secure authentication.
- **bcryptjs** for salted password hashing.
- **AI Service Layer**: Pluggable architecture supporting **Google Gemini**, **OpenAI**, and an intelligent **Autonomous Heuristic Fallback Engine** that works out-of-the-box without requiring an API key.
- **CORS** & **Dotenv** configuration.

---

## 📁 Project Structure

```text
PromptVaultAi/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection with resilient fallback
│   ├── controllers/
│   │   ├── authController.js      # User registration, login, and auth verification
│   │   └── promptController.js    # CRUD, stats, seed, and favorite management
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT Bearer token protection
│   │   └── errorMiddleware.js     # Global 404 and error handling
│   ├── models/
│   │   ├── User.js                # User schema with hashed passwords
│   │   └── Prompt.js              # Prompt schema with indexes and categories
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth routes
│   │   ├── promptRoutes.js        # /api/prompts routes
│   │   └── aiRoutes.js            # /api/ai routes
│   ├── services/
│   │   └── aiService.js           # Multi-provider AI enhancement & scoring engine
│   ├── .env                       # Backend environment variables
│   ├── .env.example               # Template environment configuration
│   ├── package.json
│   └── server.js                  # Main Express application entrypoint
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosInstance.js   # Centralized Axios client with JWT interceptor
│   │   │   ├── authApi.js         # Auth endpoints
│   │   │   ├── promptApi.js       # Prompt CRUD & Stats endpoints
│   │   │   └── aiApi.js           # AI prompt improver endpoints
│   │   ├── components/
│   │   │   ├── Button.jsx         # Multi-variant button system
│   │   │   ├── EmptyState.jsx     # Stylized empty state illustration
│   │   │   ├── Footer.jsx         # Stitch-style footer
│   │   │   ├── Input.jsx          # Input & TextArea with monospace code styling
│   │   │   ├── LoadingSpinner.jsx # Glowing orbital spinner and skeleton cards
│   │   │   ├── Modal.jsx          # Accessible dialog modal
│   │   │   ├── Navbar.jsx         # Responsive top navbar with mobile drawer
│   │   │   ├── PromptCard.jsx     # Rich prompt card (Grid & List views, copy toast)
│   │   │   ├── ProtectedRoute.jsx # Route authentication guard
│   │   │   ├── Select.jsx         # Custom dropdown selector
│   │   │   └── Sidebar.jsx        # Premium SaaS dashboard sidebar
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Persistent auth state & login/register actions
│   │   │   └── ToastContext.jsx   # Auto-dismissing toast notifications
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx    # Stitch landing page replica with live demo
│   │   │   ├── LoginPage.jsx      # Sign in page with 1-click demo account fill
│   │   │   ├── RegisterPage.jsx   # Sign up page with validation
│   │   │   ├── DashboardPage.jsx  # Analytics overview, stats, recent prompts
│   │   │   ├── MyPromptsPage.jsx  # Search, filter, tags, sort, and grid/list view
│   │   │   ├── PromptDetailsPage.jsx # Full prompt view, word count, actions
│   │   │   ├── CreatePromptPage.jsx  # Form with inline AI enhancement
│   │   │   ├── EditPromptPage.jsx    # Edit prompt form with AI helper
│   │   │   ├── FavoritesPage.jsx  # Starred prompts for one-tap retrieval
│   │   │   ├── AiImproverPage.jsx # Autonomous prompt refinement studio & scoring
│   │   │   ├── SettingsPage.jsx   # Profile management, AI status, JSON export
│   │   │   └── NotFoundPage.jsx   # 404 error page
│   │   ├── App.jsx                # React Router root configuration
│   │   ├── index.css              # Tailwind base & custom scrollbar
│   │   └── main.jsx               # React DOM entrypoint
│   ├── index.html                 # Inter & JetBrains Mono font imports
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js             # Vite config with backend /api proxy
├── screen.png                     # Original Stitch UI design reference
├── package.json                   # Root package runner
└── README.md
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/promptvault
JWT_SECRET=replace_with_a_long_random_secret
AI_API_KEY=your_gemini_or_openai_api_key_or_leave_empty_for_heuristic_engine
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

*(Note: If you leave `AI_API_KEY` blank, the app will automatically use its built-in smart prompt engineering heuristics engine without throwing any errors!)*

For production, set `CORS_ORIGINS` to the frontend's exact origin(s), comma-separated (scheme and host only). Local development allows HTTP origins on `localhost` and `127.0.0.1` across Vite ports. Set the frontend build variable `VITE_API_URL` to the backend API URL, including `/api` (for example, `https://api.example.com/api`). When `VITE_API_URL` is unset, local development uses the Vite `/api` proxy.

For production, replace `JWT_SECRET` with a long, private random value and configure `MONGO_URI` to a persistent MongoDB deployment. The in-memory database is only used as a development/test fallback; the API will not start in production when its database or JWT secret is unavailable.

---

## 🏃 Running the Application

### 1. Start the Backend:
```bash
cd backend
npm install
npm run dev
# Server will run on http://localhost:5000
```

### 2. Start the Frontend:
```bash
cd frontend
npm install
npm run dev
# Frontend will run on http://localhost:5173
```

---

## 🌟 Key Features Implemented

1. **Stitch Landing Page Recreation**:
   - Hero banner with "✦ Your AI Prompt Workspace".
   - Gradient headline: "Your AI Prompts. Organized. Smarter."
   - Hero prompt card matching Stitch design with `{105mm f/1.4}` parameter highlighting and one-click copy.
   - Live interactive AI scoring widget right on the landing page.
   - 4 Feature highlights ("Engineered For Flow").
   - Instant Retrieval search preview with sample cards.
   - 3-step workflow roadmap.
   - Full responsive footer with company and product links.

2. **Real Authentication (JWT & bcryptjs)**:
   - Registration and login with email uniqueness validation and password hashing.
   - Persistent login state with token storage.
   - Protected routes with graceful redirects.
   - One-click "Demo Credentials" button for effortless testing.

3. **Dashboard with Real-Time Analytics**:
   - Statistics: Total Prompts, Favorites, Categories Used, Recently Added (Last 7 Days).
   - Recent prompts section with favorite toggling, direct editing, and details.
   - Curated starter pack seeding button to immediately populate the workspace.

4. **Prompt Library & Instant Retrieval**:
   - Live search across title, content, description, and tags.
   - Category filtering (Development, Writing, Marketing, Image Generation, Productivity, Education, Other).
   - AI Model filtering (ChatGPT, Gemini, Claude, Midjourney, Other).
   - Favorite filter toggle.
   - Sort by Newest, Oldest, Title A-Z, Title Z-A.
   - View mode switcher (Grid view vs List view).

5. **AI Prompt Improver Studio**:
   - Paste any prompt and click **"Improve Prompt ✨"**.
   - Generates an optimized, structured instruction with role definition and parameter placeholders.
   - Calculates **Quality Score** (e.g. 94/100) with a gradient progress bar.
   - Suggests descriptive title, category, and tags.
   - Explains specific improvements made.
   - **One-click "Save to Vault"** or **"Copy Improved Prompt"**.

6. **Settings & Vault Backup**:
   - Profile management.
   - AI engine status monitor.
   - **1-Click Export Vault (JSON)**: Downloads complete prompt library for offline backups.
