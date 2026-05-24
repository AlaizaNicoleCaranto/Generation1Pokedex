# Gen1 Pokedex Backend - Complete Documentation

A complete REST API for a Pokemon collection and battle game featuring user management, 151 Gen1 Pokemon browsing, team collection system, evolution chains, battle simulator, gamification with badges and daily challenges, and admin controls.

**Backend:** Java Spring Boot | **Database:** MySQL | **Auth:** JWT

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Overview](#-project-overview)
- [Feature Completeness](#-feature-completeness)
- [API Endpoints](#-api-endpoints)
- [Testing Guide](#-testing-guide)
- [Application Flow](#-application-flow)
- [Code Quality](#-code-quality)
- [Admin Management](#-admin-management)
- [Error Handling](#-error-handling)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- Java Development Kit (JDK) installed
- Maven installed
- MySQL database running

### Step 1: Start the Backend

Navigate to the project directory:
```bash
cd C:\Users\Alaiza\OneDrive\Attachments\Documents\Programming\Java\Generation1Pokedex\gen1pokedex
```

Run the Spring Boot application:
```bash
./mvnw.cmd spring-boot:run
```
or
```bash
./mvnw sprint-boot:run
```

Wait for confirmation message:
```
GENERATION 1 Pokédex BACKEND IS RUNNING SUCCESSFULLY!
```

**Backend URL:** `http://localhost:8080`

### Step 2: Import Postman Collection

1. Open Postman application
2. Click **File** → **Import**
3. Select `Gen1_Pokedex_API_Collection.postman_collection.json`
4. Click **Import**
5. All API endpoints ready to test

### Step 3: Get JWT Token

**Request:**
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "username": "trainer1",
    "password": "test123"
}
```

**Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "username": "trainer1",
    "role": "USER"
}
```

✅ **Copy the token** and use it in all protected requests:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📖 Project Overview

### What This Backend Does

The Gen1 Pokedex Backend is a complete REST API for a Pokemon collection and battle game featuring:

- **User Management** - Registration, login, profiles with authentication via JWT
- **Pokemon Discovery** - Browse, search, and filter the original 151 Gen1 Pokemon
- **Collection System** - Catch Pokemon, manage favorites, release Pokemon
- **Evolution System** - Pokemon evolve at specific levels with 20+ supported evolution chains
- **Leveling System** - Level up Pokemon with experience tracking
- **Battle System** - Simulate battles between two Pokemon with type effectiveness
- **Gamification** - Achievements, badges, daily challenges, leaderboards
- **Admin Controls** - Manage users, Pokemon, and view audit logs

### Database Schema

The application uses MySQL with the following key entities:

- **User** - Trainer profiles with authentication and status
- **Pokemon** - Gen1 Pokemon (1-151) with stats and abilities
- **UserPokemon** - Trainer's caught Pokemon collection (many-to-many)
- **PokemonLevel** - Tracks level and XP for each Pokemon per user
- **Type** - Pokemon types with type colors
- **Ability** - Pokemon abilities
- **Badge** - Achievement badges (5 tiers)
- **UserBadge** - Earned badges per trainer
- **DailyChallenge** - Daily featured Pokemon
- **UserDailyChallenge** - User's daily challenge progress and streak
- **PasswordResetToken** - Email-based password recovery tokens
- **AuditLog** - Admin action tracking

---

## ✨ Feature Completeness

### Authentication & Authorization

| Feature | Status | Details |
|---------|--------|---------|
| User Registration | ✅ Complete | POST /api/users/register - Random starter Pokemon assigned, email optional |
| User Login | ✅ Complete | POST /api/auth/login - JWT token generation with role |
| JWT Authentication | ✅ Complete | Stateless token-based authentication |
| Role-Based Access | ✅ Complete | USER and ADMIN roles with @PreAuthorize |
| Password Hashing | ✅ Complete | BCrypt password encryption |
| User Status Validation | ✅ Complete | ACTIVE, SUSPENDED, BANNED states enforced at login |
| Password Reset | ✅ Complete | Forgot password, reset password, change password workflows |
| Email Tracking | ✅ Complete | User email stored for recovery and notifications |

**Starter Pokemon Options (9 total):**
- Bulbasaur (1), Charmander (4), Squirtle (7)
- Pikachu (25), Mankey (54), Abra (63)
- Machop (66), Geodude (74), Eevee (133)

**Password Management Endpoints:**
- `POST /api/auth/forgot-password` - Send password reset token to email
- `POST /api/auth/reset-password` - Reset password using token
- `POST /api/auth/change-password` - Change password for logged-in user (requires current password)

---

### Pokemon Discovery & Browsing

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/pokemons` | GET | Paginated list of Pokemon (20 per page) |
| `/api/pokemons/{id}` | GET | Pokemon by database ID |
| `/api/pokemons/number/{number}` | GET | Pokemon by Pokedex number (1-151) |
| `/api/pokemons/name/{name}` | GET | Pokemon by exact name |
| `/api/pokemons/type/{type}` | GET | All Pokemon of specific type |
| `/api/pokemons/habitat/{habitat}` | GET | All Pokemon in habitat |
| `/api/pokemons/rarity/{rarity}` | GET | Filter by rarity |
| `/api/pokemons/random` | GET | Random Pokemon |
| `/api/pokemons/suggestions` | GET | Auto-complete suggestions by name prefix |
| `/api/pokemons/search` | GET | Advanced search with multiple filters |

**Pokemon Details Include:**
- Pokedex number, name, height, weight
- Description and habitat
- Base stats (HP, Attack, Defense, Sp.Atk, Sp.Def, Speed)
- Types and abilities
- Evolution chain information
- Rarity level
- Sprite URL for display

---

### User Collection & Profile Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/{username}/profile` | GET | View trainer profile with stats |
| `/api/users/{username}/profile` | PUT | Update email and bio |
| `/api/users/{username}/completion` | GET | Get Pokedex completion percentage (0-100) |
| `/api/users/{username}/collection` | GET | View all caught Pokemon |
| `/api/users/{username}/catch/{pokemonId}` | POST | Add Pokemon to collection |
| `/api/users/{username}/release/{userPokemonId}` | DELETE | Release Pokemon |
| `/api/users/{username}/favorites` | GET | View favorite Pokemon |
| `/api/users/{username}/favorite/{userPokemonId}` | POST | Mark as favorite |
| `/api/users/{username}/favorite/{userPokemonId}` | DELETE | Remove favorite |
| `/api/users/{username}/badges` | GET | View earned badges |
| `/api/users/leaderboard` | GET | Top 10 trainers by collection size |
| `/api/users/random` | GET | Random trainer profile |

**Profile Tracked Stats:**
- Total Pokemon caught
- Collection completion percentage
- Favorite Pokemon count
- Badges earned
- Last login timestamp

---

### Evolution System

The backend supports 20+ evolution chains from Generation 1:

| Pokemon | Level | Evolves To | Level 2 | Evolves To |
|---------|-------|------------|---------|------------|
| Bulbasaur | 16 | Ivysaur | 32 | Venusaur |
| Charmander | 16 | Charmeleon | 36 | Charizard |
| Squirtle | 16 | Wartortle | 36 | Blastoise |
| Caterpie | 7 | Metapod | 10 | Butterfree |
| Weedle | 7 | Kakuna | 10 | Beedrill |
| Pidgey | 18 | Pidgeotto | 36 | Pidgeot |
| Pikachu | 36 | Raichu | — | — |
| Geodude | 36 | Graveler | 45 | Golem |
| Abra | 16 | Kadabra | 36 | Alakazam |
| Machop | 28 | Machoke | 36 | Machamp |
| Eevee | 36 | Vaporeon | — | — |

**How Evolution Works:**
1. User catches a Pokemon that can evolve
2. Level up Pokemon through battles or actions
3. When Pokemon reaches required level, evolution becomes available
4. Call evolve endpoint to trigger evolution
5. Pokemon is replaced with its evolved form in collection

---

### Leveling System

- **Level Tracking** - Each caught Pokemon tracks its current level (1-100)
- **Experience Points** - Pokemon gain 20 XP per battle win
- **Level Up Formula** - 100 XP accumulates to 1 level
- **Battle Rewards** - Winner's Pokemon gains XP immediately after battle
- **Evolution Requirements** - Specific levels unlock evolution forms
- **Level Persistence** - Levels saved in PokemonLevel entity
- **Level Display** - Current XP and level shown in user profile
- **Console Logging** - Level up events logged for debugging

---

### Gamification Features

#### Badge System (5 Achievement Tiers)

| Badge Name | Requirement | Reward |
|------------|-------------|--------|
| 🥉 Novice Trainer | 5 Pokemon | Entry-level achievement |
| 🥈 Expert Trainer | 25 Pokemon | Mid-level achievement |
| 🥇 Master Trainer | 50 Pokemon | Advanced achievement |
| 💎 Legendary Collector | 100 Pokemon | Elite achievement |
| 👑 Pokemon Master | 151 Pokemon | Ultimate achievement |

**Badge System Features:**
- Badges automatically awarded when thresholds reached
- GET `/api/users/{username}/badges` to view earned badges
- Tracked in UserBadge entity with award date

#### Daily Challenges

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/{username}/daily-challenge` | GET | Today's challenge Pokemon |
| `/api/users/{username}/claim-reward` | POST | Claim daily reward |

**Daily Challenge Features:**
- Featured Pokemon changes daily
- Streak tracking for consecutive claims
- Rewards accumulate over time

---

### Battle System

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/battles/simulate` | POST | Simulate battle between two Pokemon |

**Battle Simulation:**
- Type effectiveness implemented for Gen1
- Stat-based combat calculations
- Winner determined by type advantage and stats
- Speed stat determines attack order
- Request: `pokemon1Id` and `pokemon2Id`
- Returns: Battle result with winner and XP rewards

**XP & Leveling System:**
- Winner gains **20 XP** per battle win
- **100 XP = 1 level up** (levels 1-100)
- Experience tracked per Pokemon per player
- Level up messages included in battle log
- Levels persist across battles
- Requirement for Pokemon evolution

---

### Admin Pokemon Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/pokemons` | POST | Add new Pokemon (Gen1 only: 1-151) |
| `/api/admin/pokemons/{id}` | PUT | Update Pokemon details |
| `/api/admin/pokemons/{id}` | DELETE | Delete Pokemon |
| `/api/admin/audit-logs` | GET | View action history |

**Admin Pokemon Features:**
- **Gen1 Validation** - Only Pokemon 1-151 allowed
- **Duplicate Prevention** - Can't add same Pokemon twice
- **Audit Trail** - All changes logged with timestamp and admin name
- **Full Update Support** - Update stats, name, abilities, types

**Add Pokemon Example:**
```json
{
  "pokedexNumber": 150,
  "name": "Mewtwo",
  "hp": 106,
  "attack": 110,
  "defense": 90,
  "spAtk": 154,
  "spDef": 90,
  "speed": 130
}
```

---

### Admin User Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/users` | GET | List all trainers |
| `/api/admin/users/{username}` | GET | Get specific user details |
| `/api/admin/users/{username}/ban` | POST | Ban user permanently |
| `/api/admin/users/{username}/suspend` | POST | Suspend user temporarily |
| `/api/admin/users/{username}/reactivate` | POST | Reactivate user |
| `/api/admin/users/{username}/collection` | DELETE | Clear all Pokemon |
| `/api/admin/users/{username}/reset-password` | POST | Generate temp password |
| `/api/admin/users/{username}/status` | PUT | Change user status |

**User Status System:**

| Status | Can Login? | Description |
|--------|-----------|-------------|
| ACTIVE | ✅ Yes | Normal gameplay allowed |
| SUSPENDED | ❌ No | Temporary restriction |
| BANNED | ❌ No | Permanent deactivation |

**Admin Capabilities:**

| Capability | Purpose |
|-----------|---------|
| View All Users | Monitor trainer accounts |
| Ban/Suspend Accounts | Enforce community guidelines |
| Reactivate Users | Restore restricted accounts |
| Reset Collections | Clear Pokemon if needed |
| Reset Passwords | Help users regain access |

**User Timestamps Tracked:**
- `createdAt` - Account registration date
- `updatedAt` - Last profile modification
- `lastLogin` - Most recent successful login

---

## 🧪 Testing Guide

### Test Environment Setup

1. **Start Backend** - `./mvnw.cmd spring-boot:run`
2. **Import Postman Collection** - `Gen1_Pokedex_API_Collection.postman_collection.json`
3. **Get JWT Token** - From login endpoint
4. **Set Authorization Header** - `Bearer YOUR_TOKEN_HERE`

### Testing Phases

#### Phase 1: Authentication (No Token Needed)

| # | Test | Expected Result | Method |
|---|------|-----------------|--------|
| 1 | Register New Trainer | 200 OK, trainer with starter Pokemon | POST /api/users/register |
| 2 | Login Trainer | 200 OK, JWT token provided | POST /api/auth/login |
| 3 | Copy Token | Save for protected requests | From login response |
| 4 | Forgot Password | 200 OK, reset token sent | POST /api/auth/forgot-password |
| 5 | Reset Password | 200 OK, password changed | POST /api/auth/reset-password |
| 6 | Change Password | 200 OK (with token) | POST /api/auth/change-password |

**Sample Registration:**
```json
{
  "username": "newtrainer",
  "password": "securepass123",
  "email": "trainer@example.com"
}
```

---

#### Phase 2: Public Pokemon Browsing (No Token Needed)

| # | Endpoint | Expected Result |
|---|----------|-----------------|
| 1 | GET /api/pokemons | 20 Pokemon with pagination |
| 2 | GET /api/pokemons/1 | Bulbasaur complete details |
| 3 | GET /api/pokemons/name/pikachu | Pikachu details |
| 4 | GET /api/pokemons/type/Fire | All Fire-type Pokemon |
| 5 | GET /api/pokemons/habitat/Forest | All Forest habitat Pokemon |
| 6 | GET /api/pokemons/random | Different Pokemon each time |
| 7 | GET /api/pokemons/rarity/Common | All common Pokemon |
| 8 | GET /api/pokemons/suggestions?prefix=pi | Names starting with "pi" |
| 9 | GET /api/pokemons/search?name=pika&type=Electric | Filtered results |

---

#### Phase 3: User Collection (Token Required)

**Headers Required:** `Authorization: Bearer YOUR_TOKEN_HERE`

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Get User Profile | Trainer info + Pokemon caught count |
| 2 | Get Completion % | Returns value between 0-100 |
| 3 | Catch Pokemon (ID: 25 = Pikachu) | +1 to collection |
| 4 | View Collection | Starter + new Pokemon |
| 5 | Mark as Favorite | Pikachu marked as favorite |
| 6 | View Profile Again | Favorite count updated |
| 7 | Remove Favorite | Favorite removed |
| 8 | Release Pokemon | Back to original count |
| 9 | Update Profile | Email/bio saved successfully |

---

#### Phase 4: Evolution System (Token Required)

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Catch Charmander (ID: 4) | Added to collection |
| 2 | Level Up Pokemon | Level increases |
| 3 | Evolve at Level 16 | Evolves to Charmeleon |
| 4 | Evolve at Level 36 | Evolves to Charizard |

---

#### Phase 5: Gamification (Token Required)

| # | Feature | Expected Result |
|---|---------|-----------------|
| 1 | Get Leaderboard | Top 10 trainers by collection size |
| 2 | Get Random User | Random trainer profile |
| 3 | Get Daily Challenge | Today's featured Pokemon |
| 4 | Claim Reward | Streak increases |
| 5 | View Badges | Earned badges listed |

---

#### Phase 6: Battle System (Token Required)

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Simulate Battle | Pikachu vs Charmander |
| 2 | Check Winner | Determined by type/stats |
| 3 | Verify XP Gained | Winner's Pokemon gains 20 XP |
| 4 | Check Level Up | If XP >= 100, Pokemon levels up |
| 5 | Multiple Battles | XP accumulates (100 XP = 1 level) |

**Battle Request:**
```json
{
  "pokemon1Id": 25,
  "pokemon2Id": 4
}
```

**Battle Response Includes:**
- Winner and loser names with sprites
- Turn-by-turn battle log with damage
- XP gained by winner (20 XP base)
- New level if level up occurred
- Remaining HP of winner

---

#### Phase 7: Admin Pokemon Management (Admin Token Required)

**Get Admin Token First:** Login with admin account

| # | Action | Expected Result | HTTP Status |
|---|--------|-----------------|-------------|
| 1 | Add Pokemon (ID: 150) | Mewtwo created | 200 OK |
| 2 | Add Pokemon (ID: 152) | Non-Gen1 rejected | 400 Bad Request |
| 3 | Update Pokemon | Details saved | 200 OK |
| 4 | Delete Pokemon | Removed successfully | 200 OK |
| 5 | Get Audit Logs | All admin actions listed | 200 OK |

---

#### Phase 8: Admin User Management (Admin Token Required)

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Get All Users | List of all trainers |
| 2 | Ban User | Status = BANNED |
| 3 | Login as Banned User | 403 Forbidden |
| 4 | Reactivate User | Status = ACTIVE |
| 5 | Suspend User | Status = SUSPENDED |
| 6 | Reset Password | Temp password generated |
| 7 | Reset Collection | Pokemon count = 0 |

---

## 📱 Application Flow

### Startup Sequence

```
Application Start
    ↓
Check if Database Already Seeded
    ↓
┌─────────────────────────────────────┐
│ If NO: Run DataSeeder               │
├─────────────────────────────────────┤
│ • Fetch 151 Gen1 Pokemon from API   │
│ • Seed 15 Pokemon Types             │
│ • Seed 100+ Abilities               │
│ • Seed Evolution Chains             │
│ • Seed Achievement Badges           │
│ • Create Default Admin User         │
└─────────────────────────────────────┘
    ↓
If YES: Skip seeding
    ↓
Create Admin User if Not Exists
    ↓
Backend Ready for Requests ✅
```

---

### User Registration Flow

```
POST /api/users/register
├─ Validate username (not duplicate)
├─ Hash password with BCrypt
├─ Create User entity (role: USER)
├─ Assign random starter Pokemon (9 options)
├─ Save to database
├─ Trigger badge check
└─ Return UserProfileDTO
```

---

### User Login Flow

```
POST /api/auth/login
├─ Find user by username
├─ Verify password with BCrypt
├─ Check user status (ACTIVE/SUSPENDED/BANNED)
│  ├─ If BANNED: Return 403 Forbidden "User account is banned"
│  ├─ If SUSPENDED: Return 403 Forbidden "User account is suspended"
│  └─ If ACTIVE: Continue
├─ Generate JWT token (includes username & role)
├─ Update lastLogin timestamp
├─ Return AuthResponse with token
└─ Frontend stores token in localStorage
```

**Status Enforcement Notes:**
- Status check happens BEFORE JWT generation
- Banned/Suspended users cannot obtain tokens
- lastLogin timestamp only updates on successful login

---

### Pokemon Catch Flow

```
POST /api/users/{username}/catch/{pokemonId}
├─ Find Pokemon by ID
├─ Find User by username
├─ Validate Pokemon not already in collection
├─ Create UserPokemon entity with initial level 1
├─ Check for badge awards (5, 25, 50, 100, 151 caught)
├─ Award badges if thresholds reached
├─ Save and return
└─ ✅ Pokemon added to collection
```

---

### Evolution Flow

```
User initiates evolution when Pokemon reaches required level
├─ Validate Pokemon exists in collection
├─ Check current level >= evolution requirement
├─ Find evolution target from database
├─ Update UserPokemon with evolved Pokemon ID and species
├─ Retain level and experience
├─ Save changes
└─ ✅ Pokemon evolved successfully
```

---

### Admin Action Flow

```
Admin requests action (add/update/delete Pokemon)
├─ Verify JWT token is valid
├─ Verify user has ADMIN role
├─ Validate request data
├─ For Pokemon: Validate Pokedex number 1-151
├─ Perform action (create/update/delete)
├─ Log action in AuditLog with admin name & timestamp
├─ Save changes to database
└─ Return success response
```

---

## 💻 Code Quality

### Architecture

**Clean Layered Architecture:**

```
HTTP Layer
    ↓
Controllers (HTTP routing)
    ↓
Services (Business logic)
    ↓
Repositories (Data access - Spring Data JPA)
    ↓
Entities (Database models)
```

### File Organization

**Controllers (8 total):**
- `AuthController.java` - Login, register
- `PokemonController.java` - Pokemon browsing
- `UserController.java` - User gameplay
- `BattleController.java` - Battle simulation
- `DailyChallengeController.java` - Daily features
- `AdminPokemonController.java` - Admin Pokemon management
- `AdminUserController.java` - Admin user management
- `AdminAuditController.java` - Audit log viewing

**Services (8 implementations):**
- `UserService/UserServiceImpl` - User business logic
- `PokemonService/PokemonServiceImpl` - Pokemon operations
- `UserManagementService/UserManagementServiceImpl` - Admin user management
- `BattleService.java` - Battle mechanics
- `DailyChallengeService.java` - Daily challenge logic
- `AuditLogService.java` - Action logging
- `AchievementService.java` - Badge awarding

### Documentation Standards

✅ **Every component documented:**
- Class header comments explaining purpose
- Method comments explaining functionality
- Field documentation
- Inline comments for complex logic
- DTOs document data structure

### Data Security

✅ **Security measures implemented:**
- Passwords hashed with BCrypt
- JWT tokens for stateless authentication
- Role-based access control (@PreAuthorize)
- Audit logging for admin actions
- Sensitive data excluded from DTOs (no passwords)
- JPA protection against SQL injection

### Validation & Business Rules

✅ **Enforced validations:**
- Gen1 Pokemon only (1-151)
- Duplicate usernames prevented
- User status validated at login
- Collection uniqueness enforced
- Favorite duplication prevented
- Badge milestone checks
- Evolution level requirements

---

## � Password Management

### Password Reset Workflow

**For Forgotten Passwords:**

1. **Request Password Reset**
```http
POST http://localhost:8080/api/auth/forgot-password
Content-Type: application/json

{
    "email": "trainer@example.com"
}
```

Response: Reset token sent to email (console in development)

2. **Reset Password with Token**
```http
POST http://localhost:8080/api/auth/reset-password
Content-Type: application/json

{
    "token": "token-from-email",
    "newPassword": "newPassword123"
}
```

Response: Password reset successfully

**For Logged-in Users (Change Password):**

```http
POST http://localhost:8080/api/auth/change-password
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
    "username": "trainer1",
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword456"
}
```

Response: Password changed successfully

**Password Requirements:**
- Minimum 6 characters
- No maximum length
- BCrypt hashing for storage
- Tokens expire in 1 hour
- Each password reset token can only be used once

---

## �👨‍💼 Admin Management

### Admin-Only Features

All admin endpoints require:
1. **Valid JWT token** with ADMIN role
2. **@PreAuthorize("hasRole('ADMIN')")** annotation

### Common Admin Tasks

#### Task 1: View All Users
```http
GET /api/admin/users
Authorization: Bearer ADMIN_TOKEN
```

#### Task 2: Ban a User
```http
POST /api/admin/users/{username}/ban?reason=Inappropriate+behavior
Authorization: Bearer ADMIN_TOKEN
```

**User Status Changes:**
- Before: ACTIVE → After: BANNED
- Banned users cannot login

#### Task 3: Suspend a User
```http
POST /api/admin/users/{username}/suspend?reason=Temporary+restriction
Authorization: Bearer ADMIN_TOKEN
```

**User Status Changes:**
- Before: ACTIVE → After: SUSPENDED
- Suspended users cannot login (temporary)

#### Task 4: Reactivate a User
```http
POST /api/admin/users/{username}/reactivate
Authorization: Bearer ADMIN_TOKEN
```

**User Status Changes:**
- Before: BANNED or SUSPENDED → After: ACTIVE
- User regains login access

#### Task 5: Reset User Password
```http
POST /api/admin/users/{username}/reset-password
Authorization: Bearer ADMIN_TOKEN
```

**Returns:** Temporary password for user

#### Task 6: Clear User Collection
```http
DELETE /api/admin/users/{username}/collection
Authorization: Bearer ADMIN_TOKEN
```

**Result:** User Pokemon count reset to 0 (or just starter)

#### Task 7: Add New Pokemon
```http
POST /api/admin/pokemons
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "pokedexNumber": 150,
  "name": "Mewtwo",
  "hp": 106,
  "attack": 110,
  "defense": 90,
  "spAtk": 154,
  "spDef": 90,
  "speed": 130,
  "description": "A powerful legendary Pokemon",
  "habitat": "Unknown",
  "rarity": "Legendary"
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Status | Meaning | Example Scenario |
|--------|---------|------------------|
| 200 OK | Success | Successfully caught Pokemon |
| 400 Bad Request | Invalid input | Pokemon number not 1-151 |
| 401 Unauthorized | Missing/invalid token | No JWT token provided |
| 403 Forbidden | Insufficient permission | USER trying to access ADMIN endpoint |
| 404 Not Found | Resource doesn't exist | Pokemon ID doesn't exist |
| 409 Conflict | Resource conflict | Trying to add duplicate Pokemon |
| 500 Internal Server Error | Unexpected error | Database connection failure |

### Error Response Format

All errors returned as JSON:
```json
{
  "timestamp": "2026-05-24T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Only Gen1 Pokemon (1-151) are allowed",
  "error_type": "VALIDATION_ERROR"
}
```

### Common Error Scenarios

| Scenario | Status | Message |
|----------|--------|---------|
| User account banned | 403 | User account is banned |
| User account suspended | 403 | User account is temporarily suspended |
| Add Pokemon #152 | 400 | Only Gen1 Pokemon (1-151) allowed |
| Wrong password | 401 | Invalid credentials |
| No JWT token | 401 | Missing authorization header |
| USER to ADMIN endpoint | 403 | Forbidden - requires ADMIN role |
| Pokemon doesn't exist | 404 | Pokemon not found |
| Duplicate username | 409 | Username already taken |
| Invalid JSON body | 400 | Invalid request format |
| Password reset token expired | 400 | Token has expired |
| Already used reset token | 400 | Token has already been used |

**Status Enforcement:**
- BANNED users: Cannot login, receive 403 Forbidden error
- SUSPENDED users: Cannot login, receive 403 Forbidden error  
- ACTIVE users: Can login and play normally
- Status checked immediately at login before JWT generation

---

## 🔧 Troubleshooting

### Issue: "Backend won't start"

**Solution:**
1. Check MySQL is running: `mysql -u root -p`
2. Verify database exists: `SHOW DATABASES;`
3. Check port 8080 not in use: `netstat -ano | findstr :8080`
4. Review logs in console output

---

### Issue: "Cannot get JWT token (login fails)"

**Solution:**
1. Verify username/password correct
2. Check user account status (not banned/suspended)
3. Ensure user exists in database
4. Check application.properties has correct DB settings

---

### Issue: "403 Forbidden on admin endpoints"

**Solution:**
1. Ensure JWT token from ADMIN account
2. Verify token in Authorization header format: `Bearer TOKEN`
3. Check token hasn't expired
4. Verify user has ADMIN role assigned

---

### Issue: "Pokemon won't evolve"

**Solution:**
1. Check Pokemon can evolve (is in evolution chain)
2. Verify Pokemon level meets requirement
3. Ensure Pokemon is in user's collection
4. Check evolution chain exists in database

---

### Issue: "Duplicate Pokemon error"

**Solution:**
1. Check if Pokemon already in user collection
2. For admin add: Check Pokedex number not already added
3. Use different Pokemon ID

---

### Issue: "Database connection error"

**Solution:**
1. Start MySQL service
2. Check database `gen1pokedex_db` exists
3. Verify connection string in `application.properties`
4. Check username/password credentials

---

## 📚 Additional Resources

- **Spring Boot Docs:** https://docs.spring.io/spring-boot/
- **Spring Data JPA:** https://docs.spring.io/spring-boot/docs/current/reference/html/data.html#data.sql.jpa-and-spring-data
- **Spring Security:** https://docs.spring.io/spring-boot/docs/current/reference/html/web.html#web.security
- **Postman Tutorial:** https://learning.postman.com/
- **JWT Authentication:** https://jwt.io/

---

## ✅ Verification Checklist

Before deploying to production, verify:

- [ ] All 151 Gen1 Pokemon seeded in database
- [ ] JWT authentication working on protected endpoints
- [ ] User registration creates account with starter Pokemon
- [ ] Pokemon browsing works without authentication
- [ ] User collection endpoints require valid token
- [ ] Evolution system works at specified levels
- [ ] Battle simulator returns valid results
- [ ] Admin endpoints require ADMIN role
- [ ] Banned/suspended users cannot login
- [ ] Audit logs track all admin actions
- [ ] Badge system awards correctly
- [ ] Daily challenge updates daily
- [ ] Leaderboard shows top 10 trainers
- [ ] All error messages are user-friendly
- [ ] Database backups scheduled
- [ ] Performance acceptable under load

---

## 📞 Support

For issues or questions about the backend:
1. Check the troubleshooting section above
2. Review the Postman collection for example requests
3. Check application logs for error details
4. Verify database connectivity

---

**Status:** ✅ Ready for Frontend Development  
**Date:** May 24, 2026  
**Version:** 1.0.0 - Production Release
