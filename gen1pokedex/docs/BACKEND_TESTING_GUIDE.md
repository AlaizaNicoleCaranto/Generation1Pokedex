# GEN1 POKEDEX BACKEND - COMPLETE TESTING GUIDE

Status: BACKEND COMPLETE AND READY FOR TESTING
Test Method: Postman (Import included JSON collection)

======================================================================
## TABLE OF CONTENTS
----------------------------------------------------------------------
1. [What's New](#whats-new)
2. [Quick Start](#quick-start)
3. [Testing Checklist](#testing-checklist)
4. [Error Scenarios to Test](#error-scenarios-to-test)
5. [Response Format Examples](#response-format-examples)
6. [Troubleshooting](#troubleshooting)
7. [Backend Ready Checklist](#backend-ready-checklist)

======================================================================
## WHAT'S NEW
======================================================================
### Admin User Management Features   
----------------------------------------------------------------------
| Admin Capability        | Description                              |
|-------------------------|------------------------------------------|
| View All Trainers       | See all registered users                 |
| Ban or Suspend Accounts | Temporarily/permanently disable accounts |
| Reactivate Users        | Restore banned or suspended accounts     |
| Reset Collections       | Clear all Pokemon from a user            |
| Reset Passwords         | Generate temporary passwords             |
----------------------------------------------------------------------
======================================================================
### Account Status Types
----------------------------------------------------------------------
| Status | Meaning | Can Login? |
|--------|---------|------------|
| ACTIVE | Normal gameplay allowed | Yes |
| SUSPENDED | Temporary restriction | No |
| BANNED | Permanent deactivation | No |
----------------------------------------------------------------------
======================================================================
### Timestamps Tracked
----------------------------------------------------------------------
- createdAt - When account was registered
- updatedAt - Last profile modification
- lastLogin - Most recent successful login
----------------------------------------------------------------------
======================================================================
## QUICK START
----------------------------------------------------------------------
----
Step 1: Import Postman Collection
----------------------------------------------------------------------
1. Open Postman application
2. Click File to Import
3. Select: Gen1_Pokedex_API_Collection.postman_collection.json
4. Click Import
5. All API endpoints now ready to test
----------------------------------------------------------------------
----
Step 2: Start the Backend
----------------------------------------------------------------------
    Navigate to project directory:
    cd C:\Users\Alaiza\OneDrive\Attachments\Documents\Programming\Java\gen1pokedex
----------------------------------------------------------------------
    Run the Spring Boot application:
    ./mvnw.cmd spring-boot:run
----------------------------------------------------------------------
    Wait for: "Started Gen1pokedexApplication in ..."
    Backend runs on: http://localhost:8080
----------------------------------------------------------------------
----
Step 3: Get JWT Token
----------------------------------------------------------------------
    POST http://localhost:8080/api/auth/login
    Content-Type: application/json

    Request Body:
    {
        "username": "trainer1",
        "password": "test123"
    }

    Response:
    {
         "token": "eyJhbGciOiJIUzI1NiIs...",
         "username": "trainer1"
    }

    Important: Copy the token and use it in all protected requests as:
    Authorization: Bearer YOUR_TOKEN_HERE
----------------------------------------------------------------------
======================================================================
## TESTING CHECKLIST
----------------------------------------------------------------------
----
Phase 1: Authentication (No Token Needed)
----------------------------------------------------------------------
| Number | Test | Expected Result |
|--------|------|-----------------|
| 1 | Register New Trainer | 200 OK, trainer profile with starter Pokemon |
| 2 | Login Trainer | 200 OK, JWT token provided |
| 3 | Copy token from login response | For next tests |
----------------------------------------------------------------------
----
Phase 2: Public Pokemon Browsing (No Token Needed)
----------------------------------------------------------------------
| Number | Endpoint | Expected Result |
|--------|----------|-----------------|
| 1 | GET /api/pokemons | 20 Pokemon with pagination |
| 2 | GET /api/pokemons/1 | Bulbasaur complete details |
| 3 | GET /api/pokemons/name/pikachu | Pikachu details |
| 4 | GET /api/pokemons/type/Fire | All Fire-type Pokemon |
| 5 | GET /api/pokemons/habitat/Forest | All Forest Pokemon |
| 6 | GET /api/pokemons/random | Different Pokemon each time |
| 7 | GET /api/pokemons/suggestions?prefix=pi | Pokemon names starting with pi |
| 8 | GET /api/pokemons/search?name=pika&type=Electric | Filtered results |
----------------------------------------------------------------------
----
Phase 3: User Collection (Token Required)
----------------------------------------------------------------------
Add JWT token to Authorization header for these tests
----------------------------------------------------------------------
| Number | Action | Expected Result |
|--------|--------|-----------------|
| 1 | Get User Profile | Trainer info plus Pokemon caught count |
| 2 | Catch Pokemon (ID: 25 = Pikachu) | Plus 1 Pokemon to collection |
| 3 | View Collection | Starter plus Pikachu (2 total) |
| 4 | Mark as Favorite (ID: 25) | Pikachu marked as favorite |
| 5 | View Profile Again | Favorite count = 1 |
| 6 | Remove Favorite (ID: 25) | Favorite removed |
| 7 | Release Pokemon (ID: 25) | Back to 1 Pokemon (starter only) |
| 8 | Update Profile | Profile updated with new email or bio |
----------------------------------------------------------------------
----
Phase 4: Evolution System (Token Required)
----------------------------------------------------------------------
| Number | Action | Expected Result |
|--------|--------|-----------------|
| 1 | Catch a Pokemon that can evolve (ID: 4 = Charmander) | Pokemon added to collection |
| 2 | Level up Pokemon multiple times | Level increases message |
| 3 | Evolve Pokemon when level requirement met | Pokemon evolves to next form |
----------------------------------------------------------------------
----
Phase 5: Gamification (Token Required)
----------------------------------------------------------------------
| Number | Feature | Expected Result |
|--------|---------|-----------------|
| 1 | Get Leaderboard | Top 10 trainers sorted by collection size |
| 2 | Get Random User | Random trainer profile |
| 3 | Get Daily Challenge | Today's featured Pokemon |
| 4 | Claim Daily Reward | Streak increases by 1 |
----------------------------------------------------------------------
----
Phase 6: Battle System (Token Required)
----------------------------------------------------------------------
| Number | Action | Expected Result |
|--------|--------|-----------------|
| 1 | Simulate Battle with pokemon1Id=25, pokemon2Id=4 | Battle result with winner (Pikachu vs Charmander) |
----------------------------------------------------------------------
----
Phase 7: Admin Pokemon Management (Admin Token Required)
----------------------------------------------------------------------
Need ADMIN JWT token first
----------------------------------------------------------------------
| Number | Action | Expected Result |
|--------|--------|-----------------|
| 1 | Add New Pokemon (number 150 Mewtwo) | 200 OK created |
| 2 | Add Pokemon number 152 (non-Gen1) | 400 Bad Request |
| 3 | Update Pokemon | Updated successfully |
| 4 | Delete Pokemon | 200 OK deleted |
----------------------------------------------------------------------
----
Phase 8: Admin User Management (Admin Token Required)
----------------------------------------------------------------------
| Number | Action | Expected Result |
|--------|--------|-----------------|
| 1 | Get All Users | List of all trainer accounts |
| 2 | Get User Details | Specific trainer info |
| 3 | Ban User | User status = BANNED |
| 4 | Try login as banned user | 403 Forbidden |
| 5 | Reactivate User | User status = ACTIVE |
| 6 | Suspend User | User status = SUSPENDED |
| 7 | Reset Password | Temporary password generated |
| 8 | Reset Collection | User Pokemon count = 0 |
----------------------------------------------------------------------
======================================================================
## ERROR SCENARIOS TO TEST
----------------------------------------------------------------------
| Scenario | Expected Result |
|----------|-----------------|
| Add Pokemon number 152 (non-Gen1) | 400 Bad Request - "Only Gen1 Pokemon (1-151)" |
| Login with wrong password | 401 Unauthorized |
| Access user profile with no token | 401 Unauthorized |
| Catch Pokemon that doesn't exist | 404 Not Found |
| Admin endpoint with USER token | 403 Forbidden |
| Invalid JSON body | 400 Bad Request |
| Ban user that's already banned | 400 Bad Request |
----------------------------------------------------------------------
======================================================================
## RESPONSE FORMAT EXAMPLES
----------------------------------------------------------------------
----
Success Response (200 OK)
----------------------------------------------------------------------
    {
         "username": "trainer1",
         "role": "USER",
         "email": "trainer@example.com",
         "bio": "Pokemon Master in training",
         "pokemonCount": 42,
         "favoriteCount": 5,
         "completionPercentage": 27.81,
         "status": "ACTIVE",
         "badges":
        [ 
            {
                "id": 1,
                "name": "Novice Trainer",
                "description": "Catch 5 Pokemon"
            }
        ]
    }
----------------------------------------------------------------------
----
Error Response (400 Bad Request)
----------------------------------------------------------------------
    {
        "timestamp": "2026-04-04T10:30:45",
        "message": "Invalid input: Only Gen1 Pokemon (1-151) can be added",
        "status": 400,
        "error_type": "VALIDATION_ERROR"
    }
----------------------------------------------------------------------
----
Ban or Suspend Error (403 Forbidden)
----------------------------------------------------------------------
    {
        "timestamp": "2026-04-04T10:30:45",
        "message": "Your account has been banned. Violating Terms of Service",
        "status": 403,
        "error_type": "USER_BANNED"
    }
----------------------------------------------------------------------
======================================================================
## TROUBLESHOOTING
----------------------------------------------------------------------
| Issue | Cause | Solution |
|-------|-------|----------|
| Connection refused | Backend not running | Run ./mvnw.cmd spring-boot:run |
| 401 Unauthorized | Missing JWT token | Copy token from login response |
| 403 Forbidden | Not admin role | Use admin JWT token |
| 404 Not Found | Pokemon ID doesn't exist | Check if ID is 1-151 |
| Public Key Retrieval error | MySQL connection issue | Add allowPublicKeyRetrieval=true to URL |
----------------------------------------------------------------------
======================================================================
## BACKEND READY CHECKLIST
----------------------------------------------------------------------
Before proceeding to frontend:
----------------------------------------------------------------------
-  Backend compiles successfully
-  Postman collection imported
-  Backend running on localhost:8080
-  Registration works (get starter)
-  Login works (get JWT token)
-  Can catch Pokemon (collection increases)
-  Evolution system works
-  Public endpoints work without token
-  Protected endpoints reject no-token requests
-  Admin endpoints protected (403 without admin role)
-  Gen1 validation works (reject number 152 and above)
-  Error messages are user-friendly
-  Ban or suspend prevents login
-  All HTTP status codes correct
----------------------------------------------------------------------
======================================================================
## NEXT: FRONTEND DEVELOPMENT
----------------------------------------------------------------------
Once all backend tests pass, proceed to frontend with confidence:
- API contract is stable
- All endpoints tested and working
- Error handling comprehensive
- User management complete
- Admin features functional
- Evolution system ready
- Leveling system ready
----------------------------------------------------------------------
======================================================================
## Backend is PRODUCTION-READY!
----------------------------------------------------------------------
Ready to build the UI.
----------------------------------------------------------------------