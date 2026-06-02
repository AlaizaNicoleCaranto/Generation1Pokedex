# Screenshots Guide

Complete guide for capturing and organizing screenshots of the Gen1 Pokedex application.

---

## 📸 Setup for Screenshots

### Step 1: Create Screenshots Directory

```bash
mkdir -p docs/screenshots
```

### Step 2: Prepare Application

1. **Start Backend & Frontend** (see main README)
2. **Login with test account:**
   - Username: `trainer1`
   - Password: `test123`
3. **Populate data:**
   - Catch several Pokemon
   - Create a few favorites
   - Battle to level up Pokemon

### Step 3: Browser Setup

**Recommended resolution:** 1920x1080 (desktop)

For mobile screenshots:
- **iPhone:** 375x812
- **iPad:** 768x1024

---

## 📷 Screenshots to Capture

### 1. **Landing Page** (`01-landing-page.png`)

**URL:** `http://localhost:5173/`

**What to show:**
- Hero section with title
- "Start Playing" button
- Feature highlights (if any)
- Background animation

**Size:** Full viewport

```bash
# Browser: Press F12 → Ctrl+Shift+M → Capture
```

---

### 2. **Login Page** (`02-login-page.png`)

**URL:** `http://localhost:5173/login`

**What to show:**
- Login form
- Username & password fields
- "Login" button
- "Register" and "Forgot Password" links

**To capture:**
```
- Empty form (clean)
- Fill with test data (trainer1/test123)
- Capture filled form
```

---

### 3. **Register Page** (`03-register-page.png`)

**URL:** `http://localhost:5173/register`

**What to show:**
- Registration form
- Username field
- Email field
- Password field
- "Create Account" button

---

### 4. **Pokedex Grid** (`04-pokedex-grid.png`)

**URL:** `http://localhost:5173/pokedex` (logged in)

**What to show:**
- Grid of Pokemon cards (at least 8-12 visible)
- Search bar at top
- Filter options (Type, Rarity, Habitat)
- Pagination controls
- Pokemon sprites clearly visible

**Best screenshot tips:**
- Show mix of different Pokemon types
- Include search bar with some text
- Show pagination (page 1 of X)

---

### 5. **Pokemon Detail** (`05-pokemon-detail.png`)

**URL:** `http://localhost:5173/pokedex/25` (Pikachu example)

**What to show:**
- Large Pokemon sprite
- Pokedex number (025)
- Name
- Base stats (HP, ATK, DEF, etc.)
- Type badges
- Abilities
- Description
- "Catch" button (if not caught)
- Evolution chain (if applicable)

---

### 6. **User Collection** (`06-user-collection.png`)

**URL:** `http://localhost:5173/collection` (logged in)

**What to show:**
- List of caught Pokemon
- Level displayed for each
- XP progress bar (if visible)
- "Release" button
- "Add to Favorites" option
- Search functionality

**To prepare:**
- Catch at least 5-10 Pokemon before screenshot
- Mix of different levels

---

### 7. **Battle Simulator** (`07-battle-simulator.png`)

**URL:** `http://localhost:5173/battle` (logged in)

**What to show:**
- Pokemon selection dropdowns/buttons
- Two Pokemon showing (e.g., Pikachu vs Charmander)
- "Simulate Battle" button
- After battle:
  - Winner name/sprite
  - Battle log
  - XP gained message
  - "Battle Again" button

**Best practice:**
- Capture both:
  - Before battle (selection screen)
  - After battle (results screen)

---

### 8. **User Profile** (`08-user-profile.png`)

**URL:** `http://localhost:5173/profile` (logged in)

**What to show:**
- Username
- Email
- Total Pokemon caught count
- Pokedex completion %
- Earned badges (5 tiers)
- Profile edit button
- Last login date

---

### 9. **User Dashboard** (`09-user-dashboard.png`)

**URL:** `http://localhost:5173/dashboard` (logged in)

**What to show:**
- Welcome message
- Quick stats (Total Pokemon, Completion %)
- Recent catches
- Badges earned
- Daily challenge info
- Quick action buttons
- Leaderboard preview (top 3)

---

### 10. **Leaderboard** (`10-leaderboard.png`)

**URL:** `http://localhost:5173/leaderboard` (logged in)

**What to show:**
- Ranking table
- Top 10 trainers
- Rank number
- Trainer names
- Pokemon count
- Current user highlighted (if on leaderboard)

---

### 11. **Admin Dashboard** (`11-admin-dashboard.png`)

**URL:** `http://localhost:5173/admin/dashboard` (admin logged in)

**What to show:**
- Admin navigation menu
- Quick stats
  - Total users
  - Total Pokemon
  - Recent activity
- Link to admin panels

**To access:**
- Login with admin account

---

### 12. **Admin Users** (`12-admin-users.png`)

**URL:** `http://localhost:5173/admin/users` (admin only)

**What to show:**
- List of all users
- User columns:
  - Username
  - Status (ACTIVE/BANNED/SUSPENDED)
  - Pokemon count
  - Join date
- Action buttons:
  - Ban/Suspend
  - Reactivate
  - Reset password
  - Reset collection
- Search functionality

---

### 13. **Admin Pokemon Manager** (`13-admin-pokemon-manager.png`)

**URL:** `http://localhost:5173/admin/pokemons` (admin only)

**What to show:**
- List/Grid of all Pokemon
- Pokemon columns:
  - Pokedex number
  - Name
  - Type
  - Rarity
- Action buttons:
  - Edit
  - Delete
- "Add New Pokemon" button
- Search/filter

---

### 14. **Admin Audit Logs** (`14-admin-audit-logs.png`)

**URL:** `http://localhost:5173/admin/audit-logs` (admin only)

**What to show:**
- Table of audit log entries
- Columns:
  - Timestamp
  - Admin username
  - Action (BAN, SUSPEND, REACTIVATE, etc.)
  - Details
- Filter by action
- Search by user

---

## 🎯 Recommended Screenshot Sequence

For best documentation flow, capture in this order:

1. **User Journey:**
   - 01-landing-page.png
   - 02-login-page.png
   - 03-register-page.png

2. **Core Features:**
   - 04-pokedex-grid.png
   - 05-pokemon-detail.png
   - 06-user-collection.png
   - 07-battle-simulator.png

3. **User Features:**
   - 08-user-profile.png
   - 09-user-dashboard.png
   - 10-leaderboard.png

4. **Admin Features:**
   - 11-admin-dashboard.png
   - 12-admin-users.png
   - 13-admin-pokemon-manager.png
   - 14-admin-audit-logs.png

---

## 🛠️ Tools for Screenshots

### Browser Built-in

**Chrome/Edge:**
```
Press F12 → Ctrl+Shift+M → Right-click image → Screenshot
Or: Ctrl+Shift+P → "Screenshot"
```

**Firefox:**
```
Press F12 → Shift+F2 → "screenshot filename"
Or: Right-click → Take Screenshot
```

### Windows Tools

- **Snip & Sketch:** Win + Shift + S
- **Print Screen:** Entire screen
- **Alt + Print Screen:** Active window only

### Mac Tools

- **Cmd + Shift + 4:** Area selection
- **Cmd + Shift + 5:** Advanced options

### Online Tools

- **FireShot:** Browser extension (Chrome/Firefox)
- **Lightshot:** Quick screenshot tool
- **Gyazo:** Cloud-based screenshots

---

## 🎨 Screenshot Best Practices

### DO ✅

- **Clear data:** Show realistic but non-sensitive data
- **Full viewport:** Capture entire visible area
- **Consistent styling:** Use same theme throughout
- **High resolution:** 1920x1080 minimum for desktop
- **Mobile variants:** Capture on both desktop and mobile sizes
- **Zoom:** Use 100% zoom level (not 125% or 150%)
- **Descriptive names:** Use clear filenames
- **Compress images:** Reduce file size before committing

### DON'T ❌

- **Sensitive data:** No real passwords, emails, or personal info
- **Blurry images:** Use screenshot tools, not photos
- **Cut off elements:** Show complete UI
- **Different resolutions:** Keep consistent sizes
- **Outdated info:** Update when UI changes
- **Huge file sizes:** Compress to <500KB per image
- **Generic names:** Avoid "screenshot1.png"
- **Different themes:** Use same theme for all

---

## 📐 Image Optimization

### Using ImageMagick (Windows)

```bash
# Install: https://imagemagick.org/

# Resize and compress
magick input.png -resize 1920x -quality 85 output.png

# Batch process
for file in *.png; do
  magick "$file" -resize 1920x -quality 85 "optimized-$file"
done
```

### Using Online Tools

- **TinyPNG:** https://tinypng.com/
- **ImageOptim:** (Mac)
- **FileOptimizer:** (Windows)

### Target File Sizes

- Desktop (1920x1080): 150-300KB
- Mobile (375x812): 50-150KB
- Thumbnails (400x300): 20-50KB

---

## 🖼️ Adding to README

### Markdown Format

```markdown
### Pokedex Grid

![Pokedex Grid](docs/screenshots/04-pokedex-grid.png)

The main Pokedex view showing a grid of all 151 Generation 1 Pokemon. 
Users can search, filter by type/rarity/habitat, and paginate through results.

**Features shown:**
- Search bar for quick filtering
- Type filter dropdown
- Pokemon cards with sprites
- Pagination controls
```

### Create Caption Text

For each screenshot, include:
1. **Title** - What this page/feature is
2. **URL** - Where to access it
3. **Description** - What the user sees
4. **Features** - Key elements visible
5. **Context** - When/why to use this

---

## 📋 Screenshot Checklist

Before committing screenshots:

- [ ] All 14 recommended screenshots captured
- [ ] Filenames follow naming convention (01-XX.png)
- [ ] Files placed in `docs/screenshots/` folder
- [ ] Images optimized (< 300KB each)
- [ ] Consistent resolution (1920x1080)
- [ ] No sensitive data visible
- [ ] Clear and legible text
- [ ] Screenshots added to README.md
- [ ] Captions/descriptions provided
- [ ] Tested links work in markdown

---

## 📝 Example Screenshot Entry

```markdown
## 04. Pokedex Grid

**URL:** `/pokedex` (authenticated users)

**Description:** Browse all 151 Generation 1 Pokemon in a paginated grid with advanced search and filtering options.

![Pokedex Grid View](docs/screenshots/04-pokedex-grid.png)

**Features Demonstrated:**
- Paginated grid of Pokemon (20 per page)
- Search bar with autocomplete
- Filter dropdowns (Type, Rarity, Habitat)
- Pokemon cards showing sprite and name
- Pagination controls at bottom
- Click to view detailed Pokemon info
```

---

## 🔄 Updating Screenshots

When UI changes:

1. Delete old screenshot(s)
2. Take new screenshot(s) with updated UI
3. Save with same filename (no version numbers)
4. Update descriptions if needed
5. Commit with message: "docs: Update screenshots for [feature]"

---

## 💾 Folder Structure

```
docs/
└── screenshots/
    ├── 01-landing-page.png
    ├── 02-login-page.png
    ├── 03-register-page.png
    ├── 04-pokedex-grid.png
    ├── 05-pokemon-detail.png
    ├── 06-user-collection.png
    ├── 07-battle-simulator.png
    ├── 08-user-profile.png
    ├── 09-user-dashboard.png
    ├── 10-leaderboard.png
    ├── 11-admin-dashboard.png
    ├── 12-admin-users.png
    ├── 13-admin-pokemon-manager.png
    ├── 14-admin-audit-logs.png
    └── README.md (this file)
```

---

## 📞 Screenshot Support

Questions about screenshots?

1. Check this guide first
2. Look at existing screenshots in `docs/screenshots/`
3. Refer to application README.md for feature descriptions
4. Ask team members for clarification

---

**Last Updated:** June 3, 2026  
**Total Screenshots:** 14 recommended  
**Estimated Time:** 30-45 minutes to complete all screenshots

Happy documenting! 📸✨
