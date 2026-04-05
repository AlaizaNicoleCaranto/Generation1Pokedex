TODO: OKS NA, AAYUSIN NA LANG FORMATTING
# Gen1 Pokedex Backend - Finalized Flow Documentation

Project Status: COMPLETE AND READY FOR FRONTEND DEVELOPMENT
Last Updated: April 4, 2026
Backend Language: Java Spring Boot
Database: MySQL gen1pokedex_db
Architecture: REST API with JWT Authentication

## Complete Application Flow

### Application Startup

App Start
  ↓
Check if Database Already Seeded
  ↓
If NO: Run DataSeeder
  - Fetch 151 Gen1 Pokemon from PokeAPI
  - Seed 15 Pokemon Types with retro colors
  - Seed 100+ Pokemon Abilities
  - Seed Evolution Chains from PokeAPI
  - Seed Badges for achievements
  - Create Default Admin User
  ↓
If YES: Skip seeding, create admin user if not exists
  ↓
Backend Ready for Requests

## User Registration and Login Flow

### Registration Process

POST /api/users/register
{
  username: trainer123,
  password: securePass123
}
  ↓
Validate username not duplicate
  ↓
Hash password with BCrypt
  ↓
Create User entity with role USER
  ↓
Assign Random Starter Pokemon from 9 options
  [Bulbasaur(1), Charmander(4), Squirtle(7), 
   Pikachu(25), Mankey(54), Abra(63), 
   Machop(66), Geodude(74), Eevee(133)]
  ↓
Save user to database
  ↓
Auto-trigger Badge Check
  ↓
Return UserProfileDTO with starter info

### Login Process

POST /api/auth/login
{
  username: trainer123,
  password: securePass123
}
  ↓
Find user by username
  ↓
Verify password with BCrypt
  ↓
Check user status (ACTIVE, BANNED, SUSPENDED)
  ↓
Generate JWT Token with username and role
  ↓
Return AuthResponse with token and role
  ↓
Frontend stores token in localStorage

## Pokemon Discovery and Browsing

GET /api/pokemons?page=0&size=20&sort=name,asc
  ↓
Return 20 Pokemon sorted by name
  ↓
Each Pokemon includes:
  - ID, Pokedex Number (1-151)
  - Name, Height, Weight, Description
  - Habitat, Region, Rarity
  - Sprite URL for frontend display
  - Types (can be multiple)
  - Abilities (can be multiple)
  - Stats: HP, Attack, Defense, Speed, Special Attack, Special Defense
  - Evolution Chain info

### Advanced Search and Filters

GET /api/pokemons/search?name=pika&type=Electric&rarity=Common&habitat=Forest
  ↓
Filter Pokemon by:
  - Name (partial match)
  - Pokedex Number (exact)
  - Type
  - Rarity
  - Habitat
  ↓
Return matching Pokemon list

## Evolution System

### How Evolution Works

1. User catches a Pokemon that can evolve
2. User gains experience through battles or items
3. When Pokemon reaches required level, evolution becomes available
4. User calls evolve endpoint to trigger evolution
5. Pokemon is replaced with its evolved form

### Supported Evolutions (Gen1)

| Pokemon | Level | Evolves To |
|---------|-------|-------------|
| Bulbasaur | 16 | Ivysaur |
| Ivysaur | 32 | Venusaur |
| Charmander | 16 | Charmeleon |
| Charmeleon | 36 | Charizard |
| Squirtle | 16 | Wartortle |
| Wartortle | 36 | Blastoise |
| Caterpie | 7 | Metapod |
| Metapod | 10 | Butterfree |
| Weedle | 7 | Kakuna |
| Kakuna | 10 | Beedrill |
| Pidgey | 18 | Pidgeotto |
| Pidgeotto | 36 | Pidgeot |
| Pikachu | 36 | Raichu |
| Geodude | 36 | Graveler |
| Graveler | 45 | Golem |
| Abra | 16 | Kadabra |
| Kadabra | 36 | Alakazam |
| Machop | 28 | Machoke |
| Machoke | 36 | Machamp |
| Eevee | 36 | Vaporeon |

## Admin Management System (Protected Routes)

### Admin-Only Actions Require JWT and ROLE_ADMIN

#### Add New Pokemon (Gen1 ONLY: 1-151)

POST /api/admin/pokemons
{
  pokedexNumber: 152,
  name: Chikorita
}
  ↓
Validation Check:
  - Is Pokedex number between 1 and 151?
  - Does Pokemon already exist?
  - Are all required fields present?
  ↓
If valid: Save to database and log audit trail
If invalid: Return error with clear message

#### Update Pokemon Details

PUT /api/admin/pokemons/{id}
{
  name: Pikachu,
  hp: 35,
  attack: 55
}
  ↓
Find existing Pokemon
  ↓
Validate Pokedex number remains Gen1 if changed
  ↓
Update fields
  ↓
Log all changes in AuditLog
  ↓
Return updated Pokemon

#### Delete Pokemon

DELETE /api/admin/pokemons/{id}
  ↓
Log deletion in AuditLog
  ↓
Remove from database

#### View Audit Logs

GET /api/admin/audit-logs
  ↓
Return timeline of:
  - User: Which admin made the change
  - Action: Added, Updated, or Deleted
  - Pokemon: Which Pokemon affected
  - Timestamp: When did it happen

## User Gameplay Flow

### 1. Catch Pokemon

POST /api/users/{username}/catch/{pokemonId}
{
  username: trainer123,
  pokemonId: 25 (Pikachu)
}
  ↓
Find user by username
  ↓
Find Pokemon by ID
  ↓
Add Pokemon to user's collection (user_pokemons table)
  ↓
Check if user unlocked any badges (collection milestones)
  ↓
Return updated UserProfileDTO with new count

### 2. Personal Collection Management

GET /api/users/{username}/collection
  ↓
Return all caught Pokemon for this user
  ↓
Each entry shows:
  - Pokemon details
  - Current level (all start at level 1)
  - In favorites? (boolean)
  ↓
Frontend displays as grid or list

### 3. Release Pokemon

DELETE /api/users/{username}/release/{userPokemonId}
  ↓
Find user
  ↓
Find Pokemon
  ↓
Remove from both collection AND favorites
  ↓
Update completion percentage
  ↓
Return updated profile

### 4. Favorites System

POST /api/users/{username}/favorite/{userPokemonId}
  ↓
Ensure Pokemon is in user's collection first
  ↓
Add to favorites (user_favorites table)
  ↓
Return updated profile

DELETE /api/users/{username}/favorite/{userPokemonId}
  ↓
Remove from favorites
  ↓
Return updated profile

### 5. User Profile

GET /api/users/{username}/profile
  ↓
Return UserProfileDTO containing:
  - Username, Email, Bio
  - Pokemons Caught: X out of 151
  - Completion Percentage: XX percent
  - Favorites Count
  - Badges Earned
  - Leaderboard Rank

PUT /api/users/{username}/profile
{
  email: new@email.com,
  bio: I am a Pokemon master!
}
  ↓
Update profile fields
  ↓
Return updated profile

## Gamification System

### Badges and Achievements

Automatically awarded for milestones:
- 5 Pokemon Caught -> Novice Trainer
- 25 Pokemon Caught -> Expert Trainer
- 50 Pokemon Caught -> Master Trainer
- 100 Pokemon Caught -> Legendary Collector
- All 151 Pokemon -> Pokemon Master

GET /api/users/{username}/badges
  ↓
Return list of earned badges with:
  - Badge name
  - Description
  - Award date
  - Progress toward next badge

### Daily Challenge System

GET /api/daily-challenge/today
  ↓
Backend picks ONE random Pokemon per day (same for all users)
  ↓
Return challenge Pokemon with hint
  ↓
User tries to catch it
  ↓
If caught:
  POST /api/daily-challenge/{username}/claim
    ↓
    Award 1 streak point
    ↓
    If streak reaches 7 days: Award special badge
    ↓
    Reset if user misses a day

GET /api/users/{username}/daily-challenges
  ↓
Show challenge history and current streak

### Leaderboard

GET /api/users/leaderboard
  ↓
Return top 10 users sorted by:
  1. Pokemon caught (descending)
  2. Total badges earned
  3. Daily challenge streak
  ↓
Display rank, username, stats

## Battle Simulation

POST /api/battle/simulate
{
  pokemon1Id: 25, (Pikachu)
  pokemon2Id: 4   (Charmander)
}
  ↓
Fetch both Pokemon stats
  ↓
Calculate winner based on:
  - Attack vs Defense
  - Speed
  - Type advantages (simplified)
  ↓
Return BattleResult:
  {
    pokemon1: {...},
    pokemon2: {...},
    winner: pokemon1_name,
    reason: Higher attack stat
  }
  ↓
Frontend displays battle animation

## Security and Authentication

### JWT Token Flow

1. User logs in and receives JWT token
2. Store token in client
3. For every request, include header:
   Authorization: Bearer <JWT_TOKEN>

4. JwtRequestFilter intercepts request
   - Validate token signature
   - Check expiry
   - Extract username and role
   - Set SecurityContext

5. If token invalid or expired:
   - Return 401 Unauthorized
   - Frontend redirects to login

6. Role-based protection:
   - /api/admin/* -> Requires ROLE_ADMIN
   - /api/users/* -> Requires ROLE_USER
   - /api/pokemons -> Public (no auth needed)

### CORS Configuration

- Frontend can call backend from any domain during development
- Allowed methods: GET, POST, PUT, DELETE
- Allowed headers: Authorization, Content-Type

## Pokedex Progress Tracking

Formula: (Caught Pokemon divided by 151) multiplied by 100

Example:
- Caught 50 Pokemon -> 33 percent completion
- Caught 75 Pokemon -> 50 percent completion
- Caught 151 Pokemon -> 100 percent (Pokemon Master!)

Displayed in:
- User profile page
- Progress bar
- Badge milestones

## Unique Features Implemented

| Feature | Status | Description |
|---------|--------|-------------|
| Gen1 Validation | Complete | Admin can only add Pokemon 1-151 |
| Expanded Starters | Complete | Users get random from 9 options |
| Evolution System | Complete | 20+ evolution chains supported |
| Leveling System | Complete | Experience points and level tracking |
| Multiple Types | Complete | Dual-type support |
| Stats System | Complete | HP, Attack, Defense, Speed, Special Attack, Special Defense |
| Habitat System | Complete | Forest, Mountain, Cave, Water, Grassland |
| Rarity System | Complete | Common, Rare, Legendary |
| Abilities | Complete | 100+ seeded from PokeAPI |
| Audit Logging | Complete | Track all admin changes |
| Badges and Achievements | Complete | 5+ achievement tiers |
| Daily Challenges | Complete | Streak tracking |
| Leaderboard | Complete | Top 10 rankings |
| Battle Simulation | Complete | Pokemon comparison |
| Search and Filter | Complete | Advanced search with 5 filters |

## API Response Examples

### Pokemon List Response

[
  {
    id: 1,
    pokedexNumber: 1,
    name: Bulbasaur,
    height: 0.7,
    weight: 6.9,
    description: A small creature...,
    habitat: Grassland,
    region: Kanto,
    rarity: Common,
    spriteUrl: https://...,
    hp: 45,
    attack: 49,
    defense: 49,
    speed: 45,
    specialAttack: 65,
    specialDefense: 65,
    types: [Grass, Poison],
    abilities: [Overgrow],
    evolvesFrom: null
  }
]

### User Profile Response

{
  username: trainer123,
  email: trainer@example.com,
  bio: Pokemon Master in training,
  role: USER,
  pokemonCount: 42,
  favoriteCount: 5,
  completionPercentage: 27.81,
  status: ACTIVE,
  badges: [
    {
      id: 1,
      name: Novice Trainer,
      description: Catch 5 Pokemon
    }
  ]
}

### Evolution Response

When user evolves a Pokemon:
{
  username: trainer123,
  role: USER,
  email: trainer@example.com,
  bio: Pokemon Master,
  pokemonCount: 42,
  favoriteCount: 5,
  completionPercentage: 27.81,
  status: ACTIVE,
  badges: [...]
}

Console output:
Congratulations! Your Charmander evolved into Charmeleon!

## Backend Testing Checklist

Before frontend work:
- All 151 Pokemon are seeded correctly
- User registration assigns random starter
- Catch and release functionality works
- Battle simulator works
- Daily challenge picks random Pokemon
- Leaderboard sorts by collection size
- Admin Gen1 validation works (reject Pokemon 152 and above)
- JWT authentication and role checks work
- Audit logs track admin actions
- Badges auto-unlock at milestones
- Evolution system works for supported Pokemon

## Error Responses

| Status Code | Meaning | Example |
|-------------|---------|---------|
| 200 OK | Successful request | Pokemon caught successfully |
| 400 Bad Request | Invalid input | Only Gen1 Pokemon (1-151) can be added |
| 401 Unauthorized | Missing JWT token | Missing Authorization header |
| 403 Forbidden | Wrong role or banned | Your account has been banned |
| 404 Not Found | Resource missing | Pokemon not found with ID: 999 |
| 409 Conflict | Duplicate entry | Username already exists |
| 500 Internal Error | Server problem | Something went wrong |

## Conclusion

The Gen1 Pokedex backend is COMPLETE and FULLY FUNCTIONAL. All requirements are implemented, including:

- Full Gen1 Pokemon database (151 Pokemon)
- User authentication and JWT tokens
- Pokemon catching and collection management
- Evolution system with 20+ evolution chains
- Badges and achievements
- Daily challenges with streak tracking
- Battle simulation with type effectiveness
- Admin panel for Pokemon and user management
- Audit logging for all admin actions

Ready for Frontend Development!