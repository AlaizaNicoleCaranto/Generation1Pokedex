# Gen1 Pokedex Frontend - Complete Documentation

A modern, responsive React + Vite web application for exploring, collecting, and battling Gen1 Pokemon. Features real-time user authentication, interactive Pokemon discovery, collection management, and battle simulator with persistent game state.

**Frontend:** React 19 + Vite | **Styling:** Tailwind CSS | **State:** React Query + Context API

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Pages & Routes](#-pages--routes)
- [Components](#-components)
- [Services](#-services)
- [State Management](#-state-management)
- [API Integration](#-api-integration)
- [Development](#-development)
- [Building & Deployment](#-building--deployment)
- [Styling Guide](#-styling-guide)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn package manager
- Backend running at `http://localhost:8080`

### Step 1: Install Dependencies

Navigate to frontend folder:
```bash
cd gen1pokedex-frontend
```

Install packages:
```bash
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

Output:
```
  VITE v8.0.12  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

**Frontend URL:** `http://localhost:5173`

### Step 3: Verify Backend Connection

1. Open frontend in browser
2. Go to Login page
3. Try logging in with credentials:
   - Username: `trainer1`
   - Password: `test123`

✅ If login succeeds, backend connection is working!

---

## 📖 Project Overview

### What This Frontend Does

The Gen1 Pokedex Frontend is a complete React web application for Pokemon collection gameplay:

- **Authentication** - User registration, login, password recovery
- **Pokemon Discovery** - Browse, search, filter 151 Gen1 Pokemon
- **Collection Management** - Catch Pokemon, manage favorites, track completion
- **Evolution & Leveling** - Visual evolution system, XP tracking
- **Battle Simulator** - Real-time battle with type effectiveness
- **User Dashboard** - Profile, stats, leaderboard
- **Daily Challenges** - Streak tracking, daily rewards
- **Admin Panel** - Manage users, Pokemon, audit logs
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS

### Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Framework** | React 19, React Router v7 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 3, PostCSS |
| **HTTP Client** | Axios |
| **State Management** | React Context API + React Query |
| **Code Quality** | ESLint with React plugins |

---

## ✨ Features

### 1. Authentication System

| Feature | Description |
|---------|-------------|
| **Registration** | Create new trainer account with email (optional) |
| **Login** | JWT token-based authentication |
| **Forgot Password** | Email-based password recovery |
| **Reset Password** | Change password with token |
| **Change Password** | Update password for logged-in users |
| **Session Persistence** | Token stored in localStorage |
| **Auto-Logout** | Redirect to login on token expiry |

---

### 2. Pokemon Discovery

| Feature | Description |
|---------|-------------|
| **Pokedex Grid** | Paginated list of all 151 Pokemon |
| **Pokemon Details** | Full stats, abilities, types, evolution chain |
| **Advanced Search** | Filter by name, type, rarity, habitat |
| **Auto-Complete** | Name suggestions while typing |
| **Random Pokemon** | Discover random Pokemon |
| **Type Filtering** | View all Pokemon of specific type |

**Pokemon Display Includes:**
- Sprite image
- Pokedex number and name
- Base stats (HP, Attack, Defense, Sp.Atk, Sp.Def, Speed)
- Types and abilities
- Description and habitat
- Rarity level

---

### 3. Collection Management

| Feature | Description |
|---------|-------------|
| **Catch Pokemon** | Add Pokemon from Pokedex to collection |
| **Release Pokemon** | Remove Pokemon from collection |
| **Favorites** | Mark important Pokemon as favorites |
| **View Collection** | See all caught Pokemon with levels |
| **Completion %** | Track Pokedex completion progress |
| **Level Display** | Current level and XP per Pokemon |

---

### 4. Evolution & Leveling

| Feature | Description |
|---------|-------------|
| **Level Tracking** | Display Pokemon level (1-100) |
| **XP Progress** | Show XP toward next level |
| **Evolution Chains** | Visual representation of evolution paths |
| **Evolve Button** | Trigger evolution when requirements met |
| **Level-up Animations** | Visual feedback when Pokemon levels up |

---

### 5. Battle System

| Feature | Description |
|---------|-------------|
| **Battle Simulator** | Select 2 Pokemon to battle |
| **Real-time Combat** | Turn-by-turn battle simulation |
| **Type Effectiveness** | Color-coded type advantage display |
| **Battle Log** | Full turn-by-turn action log |
| **XP Rewards** | Display XP gained by winner |
| **Level Up Notification** | Alert if Pokemon levels up |

---

### 6. User Dashboard

| Feature | Description |
|---------|-------------|
| **Profile Info** | Username, email, creation date |
| **Collection Stats** | Total Pokemon, completion %, favorites |
| **Badges** | Display earned achievement badges |
| **Recent Activity** | Show recent Pokemon catches |
| **Leaderboard** | Top 10 trainers by collection size |
| **Daily Challenge** | Today's featured Pokemon and streak |

---

### 7. Admin Panel

| Feature | Description |
|---------|-------------|
| **User Management** | List all users, ban/suspend, reset passwords |
| **Pokemon Manager** | Add/edit/delete Pokemon |
| **Audit Logs** | View all admin actions |
| **User Search** | Find specific users quickly |
| **Batch Actions** | Perform actions on multiple users |

---

## 📁 Project Structure

```
gen1pokedex-frontend/
├── src/
│   ├── components/
│   │   ├── auth/              # Login, Register, Password Recovery
│   │   ├── common/            # Navbar, Footer, Spinner, Buttons
│   │   ├── dashboard/         # User & Admin Dashboard
│   │   ├── pokedex/           # Pokemon Grid, Detail, Search
│   │   ├── user/              # Profile, Collection, Leaderboard
│   │   ├── battle/            # Battle Simulator
│   │   ├── landing/           # Landing/Home Page
│   │   ├── map/               # Region Map Display
│   │   └── admin/             # Admin Management Tools
│   ├── contexts/
│   │   └── AuthContext.jsx    # Global Auth State
│   ├── services/
│   │   ├── api.js             # Axios HTTP client
│   │   ├── authService.js     # Auth API calls
│   │   ├── pokemonService.js  # Pokemon API calls
│   │   ├── userService.js     # User API calls
│   │   ├── battleService.js   # Battle API calls
│   │   └── soundService.js    # Background music
│   ├── assets/                # Images, icons, sprites
│   ├── App.jsx                # Main App with routes
│   ├── main.jsx               # React app entry point
│   └── index.css              # Global styles
├── public/                    # Static assets
├── dist/                      # Build output
├── package.json              # Dependencies & scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
├── postcss.config.js         # PostCSS config
└── index.html                # HTML entry point
```

---

## 🛣️ Pages & Routes

### Public Routes (No Token Required)

| Path | Component | Description |
|------|-----------|-------------|
| `/` | LandingPage | Welcome page with game intro |
| `/login` | LoginPage | User login form |
| `/register` | RegisterPage | New account registration |
| `/forgot-password` | ForgotPasswordPage | Password reset request |
| `/reset-password?token=...` | ResetPasswordPage | Password reset form |

### Protected Routes (Token Required)

| Path | Component | Description |
|------|-----------|-------------|
| `/dashboard` | UserDashboard | User home & stats |
| `/pokedex` | PokedexGrid | Browse all Pokemon |
| `/pokedex/:id` | PokemonDetail | Pokemon details view |
| `/collection` | UserCollection | Your caught Pokemon |
| `/profile` | UserProfile | User profile & settings |
| `/leaderboard` | Leaderboard | Top trainers ranking |
| `/battle` | BattleSimulator | Battle 2 Pokemon |
| `/map` | RegionMap | Region visualization |

### Admin Routes (Admin Role Required)

| Path | Component | Description |
|------|-----------|-------------|
| `/admin/dashboard` | AdminDashboard | Admin overview |
| `/admin/users` | AdminUsers | Manage user accounts |
| `/admin/pokemons` | AdminPokemonManager | Manage Pokemon |
| `/admin/audit-logs` | AdminAuditLogs | View action logs |

---

## 🧩 Components

### Layout Components

- **Navbar.jsx** - Top navigation with user menu
- **FloatingButtons.jsx** - Quick action buttons (Music, Settings)
- **LoadingSpinner.jsx** - Loading indicator
- **BackgroundWithPokemon.jsx** - Animated background

### Auth Components

- **LoginPage.jsx** - Login form with validation
- **RegisterPage.jsx** - Registration form
- **ForgotPasswordPage.jsx** - Password reset request
- **ResetPasswordPage.jsx** - Reset password with token

### Dashboard Components

- **UserDashboard.jsx** - Main user dashboard
- **AdminDashboard.jsx** - Admin dashboard

### Pokedex Components

- **PokedexGrid.jsx** - Grid of all Pokemon with pagination
- **PokemonDetail.jsx** - Detailed Pokemon information
- **PokemonCard.jsx** - Individual Pokemon card
- **SearchBar.jsx** - Advanced search with filters

### User Components

- **UserProfile.jsx** - User profile and stats
- **UserCollection.jsx** - User's caught Pokemon
- **Leaderboard.jsx** - Top trainers list
- **BadgeDisplay.jsx** - User's earned badges

### Battle Component

- **BattleSimulator.jsx** - Battle selection and results
- **BattleLog.jsx** - Turn-by-turn battle display

### Admin Components

- **AdminUsers.jsx** - User management interface
- **AdminPokemonManager.jsx** - Pokemon CRUD interface
- **AdminAuditLogs.jsx** - Audit log viewer

---

## 🔧 Services

### API Service (`services/api.js`)

```javascript
// Base Axios instance with token management
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000
});

// Auto-adds JWT token to all requests
// Auto-removes token on 401 response
```

### Auth Service (`services/authService.js`)

```javascript
- login(username, password)
- register(username, password, email)
- forgotPassword(email)
- resetPassword(token, newPassword)
- changePassword(username, currentPassword, newPassword)
- logout()
- getCurrentUser()
```

### Pokemon Service (`services/pokemonService.js`)

```javascript
- getAllPokemons(page, size, sort)
- getPokemonById(id)
- getPokemonByName(name)
- getPokemonByNumber(number)
- searchPokemons(filters)
- filterByType(type)
- filterByHabitat(habitat)
- getRandomPokemon()
- getSuggestions(prefix)
```

### User Service (`services/userService.js`)

```javascript
- getUserProfile(username)
- updateProfile(username, email, bio)
- catchPokemon(username, pokemonId)
- releasePokemon(username, userPokemonId)
- getCollection(username)
- addFavorite(username, userPokemonId)
- removeFavorite(username, userPokemonId)
- getLeaderboard()
- getCompletion(username)
```

### Battle Service (`services/battleService.js`)

```javascript
- simulateBattle(pokemon1Id, pokemon2Id)
- levelUpPokemon(username, pokemonId, xp)
- getPokemonLevel(username, pokemonId)
```

---

## 💾 State Management

### AuthContext

**Global authentication state:**

```javascript
const { user, userProfile, loading, login, logout, register } = useAuth();
```

**Properties:**
- `user` - Current logged-in user
- `userProfile` - User profile data
- `loading` - Auth loading state
- `token` - JWT token
- `login()` - Authenticate user
- `logout()` - Sign out
- `register()` - Create new account

### React Query

Used for server state management:

```javascript
// Example: Fetch Pokemon list
const { data: pokemons, isLoading } = useQuery({
  queryKey: ['pokemons', page, size],
  queryFn: () => pokemonService.getAllPokemons(page, size)
});
```

### Local State (useState)

Component-level state for UI:
- Form inputs
- Toggle states
- Modal visibility
- Filters

---

## 🔌 API Integration

### Base API Configuration

```
Base URL: http://localhost:8080/api
Authorization Header: Bearer {JWT_TOKEN}
Content-Type: application/json
```

### Request/Response Examples

**Login Request:**
```javascript
POST /api/auth/login
{
  "username": "trainer1",
  "password": "test123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "username": "trainer1",
  "role": "USER"
}
```

**Catch Pokemon Request:**
```javascript
POST /api/users/{username}/catch/{pokemonId}
Authorization: Bearer {token}

Response:
{
  "username": "trainer1",
  "pokemonCount": 2,
  "completionPercentage": 1.32,
  ...
}
```

### Error Handling

All API errors are caught and displayed to user:

```javascript
try {
  const response = await api.post('/auth/login', credentials);
  // Success
} catch (error) {
  if (error.response?.status === 401) {
    // Show "Invalid credentials"
  } else if (error.response?.status === 403) {
    // Show "Account banned/suspended"
  } else {
    // Show generic error
  }
}
```

---

## 💻 Development

### Available Scripts

**Development server:**
```bash
npm run dev
```
Runs on http://localhost:5173 with hot reload

**Build for production:**
```bash
npm run build
```
Creates optimized bundle in `dist/` folder

**Preview production build:**
```bash
npm run preview
```
Serves `dist/` folder locally

**Lint code:**
```bash
npm run lint
```
Checks code quality with ESLint

### Development Workflow

1. Start backend: `./mvnw.cmd spring-boot:run`
2. Start frontend: `npm run dev`
3. Open http://localhost:5173
4. Make changes - HMR reloads automatically
5. Check console for errors
6. Run `npm run lint` before committing

### File Naming Conventions

- **Components:** PascalCase (e.g., `UserProfile.jsx`)
- **Services:** camelCase (e.g., `pokemonService.js`)
- **Files:** Kebab-case for utilities (e.g., `custom-hook.js`)
- **CSS Classes:** Tailwind utilities + custom prefixes (e.g., `bg-gradient-to-r`)

---

## 🏗️ Building & Deployment

### Production Build

```bash
npm run build
```

This creates:
- Minified JavaScript
- Optimized CSS
- Compressed assets
- Source maps (for debugging)

### Build Output

```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-xxx.js    # Main bundle
│   ├── vendor-xxx.js   # Dependencies
│   └── style-xxx.css   # Compiled CSS
└── ...
```

### Deployment Options

**1. Static Hosting (Recommended)**
- Vercel, Netlify, GitHub Pages
- Upload `dist/` folder
- Set up rewrites for SPA routing

**2. Node.js Server**
- Use `npm run build`
- Serve `dist/` folder with Express.js
- Handle SPA routing

**3. Docker Container**
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

### Environment Variables

Create `.env` file (not committed):

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=Gen1 Pokedex
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 🎨 Styling Guide

### Tailwind CSS

All styling uses Tailwind CSS utility classes:

```jsx
// Button example
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
  Click Me
</button>
```

### Color Palette

```css
Primary:   bg-blue-500, text-blue-500
Success:   bg-green-500, text-green-500
Warning:   bg-yellow-500, text-yellow-500
Danger:    bg-red-500, text-red-500
Pokemon Types:
  Fire:    bg-red-400
  Water:   bg-blue-400
  Grass:   bg-green-400
  Electric: bg-yellow-300
  ...
```

### Responsive Design

```jsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Custom Styles

Global styles in `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom components */
.card {
  @apply bg-white rounded-lg shadow-md p-4;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
}
```

---

## 🔧 Troubleshooting

### Issue: "Backend connection refused"

**Solution:**
1. Verify backend running on http://localhost:8080
2. Check API base URL in `services/api.js`
3. Look for CORS errors in browser console
4. Verify backend has CORS enabled

---

### Issue: "Login fails with 401 error"

**Solution:**
1. Check username/password correct
2. Verify backend running
3. Check if user account exists
4. Look at browser console for error details

---

### Issue: "Cannot import component"

**Solution:**
1. Verify file path is correct
2. Check file extension (.jsx vs .js)
3. Ensure component is exported
4. Check for circular imports

---

### Issue: "Styling not applying"

**Solution:**
1. Verify Tailwind config includes src directory
2. Check class names are correct (typos?)
3. Clear node_modules and reinstall: `rm -r node_modules && npm install`
4. Restart dev server

---

### Issue: "HMR (Hot Module Reload) not working"

**Solution:**
1. Try refreshing page manually
2. Clear browser cache
3. Restart `npm run dev`
4. Check firewall settings

---

### Issue: "Token expired / Cannot access protected routes"

**Solution:**
1. Log out and log back in (refresh token)
2. Clear localStorage: `localStorage.clear()`
3. Hard refresh page: Ctrl+Shift+R
4. Check browser console for token errors

---

### Issue: "Build fails"

**Solution:**
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install

# Try build again
npm run build

# Check for ESLint errors
npm run lint -- --fix
```

---

## 📚 Additional Resources

- **React Docs:** https://react.dev/
- **Vite Docs:** https://vitejs.dev/
- **React Router:** https://reactrouter.com/
- **Tailwind CSS:** https://tailwindcss.com/
- **Axios:** https://axios-http.com/
- **React Query:** https://tanstack.com/query/latest

---

## ✅ Development Checklist

Before committing code:

- [ ] Code runs without errors
- [ ] No console warnings
- [ ] ESLint passes: `npm run lint`
- [ ] Responsive design tested on mobile
- [ ] All forms validated
- [ ] Error messages user-friendly
- [ ] Loading states shown
- [ ] Protected routes require token
- [ ] Token refresh working
- [ ] Build successful: `npm run build`

---

**Status:** ✅ Development Ready  
**Date:** June 3, 2026  
**Version:** 1.0.0 - Alpha Release
