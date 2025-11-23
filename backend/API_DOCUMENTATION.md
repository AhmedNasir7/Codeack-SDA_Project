# Codeack Backend API Documentation

This document lists all available REST API endpoints for the Codeack backend.

## Base URL
```
http://localhost:3000
```

---

## Core Entity Endpoints

### Users (`/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create a new user |
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| GET | `/users/username/:username` | Get user by username |
| GET | `/users/email/:email` | Get user by email |
| PATCH | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

**Example Create User:**
```json
POST /users
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password_hash": "hashed_password",
  "age": 25
}
```

---

### Authentication (`/authentication`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/authentication` | Create authentication record |
| GET | `/authentication` | Get all authentication records |
| GET | `/authentication/:id` | Get authentication by ID |
| GET | `/authentication/username/:username` | Get by username |
| GET | `/authentication/email/:email` | Get by email |
| PATCH | `/authentication/:id/last-login` | Update last login timestamp |
| PATCH | `/authentication/:id/active` | Update active status |
| DELETE | `/authentication/:id` | Delete authentication record |

---

### Portfolio (`/portfolio`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/portfolio` | Create portfolio |
| GET | `/portfolio` | Get all portfolios |
| GET | `/portfolio/:id` | Get portfolio by ID |
| PATCH | `/portfolio/:id` | Update portfolio |
| PATCH | `/portfolio/:id/increment-solved` | Increment solved questions |
| PATCH | `/portfolio/:id/add-score` | Add score to portfolio |
| DELETE | `/portfolio/:id` | Delete portfolio |

**Example Increment Solved:**
```json
PATCH /portfolio/1/increment-solved
{
  "increment": 1
}
```

---

### Challenge (`/challenge`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/challenge` | Create challenge |
| GET | `/challenge` | Get all challenges |
| GET | `/challenge/:id` | Get challenge by ID |
| GET | `/challenge/difficulty/:difficulty` | Get challenges by difficulty |
| PATCH | `/challenge/:id` | Update challenge |
| DELETE | `/challenge/:id` | Delete challenge |

**Example Create Challenge:**
```json
POST /challenge
{
  "title": "Two Sum",
  "description": "Find two numbers that add up to target",
  "difficulty": "Easy",
  "allowed_languages": ["Python", "JavaScript", "Java"],
  "time_limit": 300
}
```

---

### Team (`/team`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/team` | Create team |
| GET | `/team` | Get all teams |
| GET | `/team/:id` | Get team by ID |
| PATCH | `/team/:id` | Update team |
| PATCH | `/team/:id/increment-member` | Increment member count |
| PATCH | `/team/:id/add-score` | Add score to team |
| DELETE | `/team/:id` | Delete team |

---

### Tournament (`/tournament`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tournament` | Create tournament |
| GET | `/tournament` | Get all tournaments |
| GET | `/tournament/:id` | Get tournament by ID |
| GET | `/tournament/status/:status` | Get tournaments by status |
| GET | `/tournament/active` | Get active tournaments |
| PATCH | `/tournament/:id` | Update tournament |
| DELETE | `/tournament/:id` | Delete tournament |

**Example Create Tournament:**
```json
POST /tournament
{
  "tournament_name": "Winter Coding Championship",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-31T23:59:59Z",
  "prize_pool": 10000.00,
  "status": "Upcoming"
}
```

---

### Submission (`/submission`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/submission` | Create submission |
| GET | `/submission` | Get all submissions |
| GET | `/submission/:id` | Get submission by ID |
| GET | `/submission/status/:status` | Get submissions by status |
| PATCH | `/submission/:id/status` | Update submission status |
| DELETE | `/submission/:id` | Delete submission |

---

### Leaderboard (`/leaderboard`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/leaderboard` | Create leaderboard |
| GET | `/leaderboard` | Get all leaderboards |
| GET | `/leaderboard/:id` | Get leaderboard by ID |
| PATCH | `/leaderboard/:id` | Update leaderboard |
| DELETE | `/leaderboard/:id` | Delete leaderboard |

---

## Challenge Type Endpoints

### Coding Battle (`/coding-battle`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/coding-battle` | Create coding battle |
| GET | `/coding-battle` | Get all coding battles |
| GET | `/coding-battle/:id` | Get coding battle by ID |
| GET | `/coding-battle/challenge/:challengeId` | Get by challenge ID |
| PATCH | `/coding-battle/:id` | Update coding battle |
| DELETE | `/coding-battle/:id` | Delete coding battle |

---

### Bug Fixing Challenge (`/bug-fixing-challenge`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bug-fixing-challenge` | Create bug fixing challenge |
| GET | `/bug-fixing-challenge` | Get all bug fixing challenges |
| GET | `/bug-fixing-challenge/:id` | Get by ID |
| GET | `/bug-fixing-challenge/challenge/:challengeId` | Get by challenge ID |
| PATCH | `/bug-fixing-challenge/:id` | Update bug fixing challenge |
| DELETE | `/bug-fixing-challenge/:id` | Delete bug fixing challenge |

**Example Create Bug Fixing Challenge:**
```json
POST /bug-fixing-challenge
{
  "challenge_id": 1,
  "penalty_rules": "Each failed attempt reduces score by 10%",
  "buggy_code": "def add(a, b): return a - b",
  "number_of_bugs": 1,
  "expected_output": "Function should return sum"
}
```

---

### Frontend Challenge (`/frontend-challenge`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/frontend-challenge` | Create frontend challenge |
| GET | `/frontend-challenge` | Get all frontend challenges |
| GET | `/frontend-challenge/:id` | Get by ID |
| GET | `/frontend-challenge/challenge/:challengeId` | Get by challenge ID |
| PATCH | `/frontend-challenge/:id` | Update frontend challenge |
| DELETE | `/frontend-challenge/:id` | Delete frontend challenge |

---

## Relationship Table Endpoints

### User Submissions (`/user-submissions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user-submissions` | Create user submission |
| GET | `/user-submissions` | Get all user submissions |
| GET | `/user-submissions/:id` | Get submission by ID |
| GET | `/user-submissions/user/:userId` | Get submissions by user |
| GET | `/user-submissions/challenge/:challengeId` | Get submissions by challenge |
| GET | `/user-submissions/user/:userId/challenge/:challengeId` | Get specific user challenge submission |
| PATCH | `/user-submissions/:id` | Update user submission |
| DELETE | `/user-submissions/:id` | Delete user submission |

**Example Create User Submission:**
```json
POST /user-submissions
{
  "user_id": 1,
  "challenge_id": 1,
  "submission_id": 1,
  "code_content": "function solution() { return true; }",
  "language": "JavaScript",
  "score": 100,
  "execution_time": 50,
  "memory_used": 1024
}
```

---

### Team Members (`/team-members`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/team-members` | Add member to team |
| GET | `/team-members` | Get all team members |
| GET | `/team-members/:id` | Get team member by ID |
| GET | `/team-members/team/:teamId` | Get members of a team |
| GET | `/team-members/user/:userId` | Get teams for a user |
| PATCH | `/team-members/:id` | Update team member |
| DELETE | `/team-members/:id` | Remove team member |
| DELETE | `/team-members/team/:teamId/user/:userId` | Remove specific member from team |

---

### Tournament Participants (`/tournament-participants`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tournament-participants` | Register participant |
| GET | `/tournament-participants` | Get all participants |
| GET | `/tournament-participants/:id` | Get participant by ID |
| GET | `/tournament-participants/tournament/:tournamentId` | Get participants of tournament |
| GET | `/tournament-participants/user/:userId` | Get tournaments for a user |
| PATCH | `/tournament-participants/:id` | Update participant |
| DELETE | `/tournament-participants/:id` | Remove participant |

---

### Tournament Challenges (`/tournament-challenges`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tournament-challenges` | Add challenge to tournament |
| GET | `/tournament-challenges` | Get all tournament challenges |
| GET | `/tournament-challenges/:id` | Get by ID |
| GET | `/tournament-challenges/tournament/:tournamentId` | Get challenges for tournament |
| GET | `/tournament-challenges/challenge/:challengeId` | Get tournaments for challenge |
| PATCH | `/tournament-challenges/:id` | Update tournament challenge |
| DELETE | `/tournament-challenges/:id` | Remove challenge from tournament |

---

### Leaderboard Entries (`/leaderboard-entries`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/leaderboard-entries` | Create leaderboard entry |
| GET | `/leaderboard-entries` | Get all entries |
| GET | `/leaderboard-entries/:id` | Get entry by ID |
| GET | `/leaderboard-entries/leaderboard/:leaderboardId` | Get entries for leaderboard |
| GET | `/leaderboard-entries/leaderboard/:leaderboardId/top?limit=10` | Get top N entries |
| GET | `/leaderboard-entries/user/:userId` | Get entries for user |
| GET | `/leaderboard-entries/team/:teamId` | Get entries for team |
| PATCH | `/leaderboard-entries/:id` | Update entry |
| DELETE | `/leaderboard-entries/:id` | Delete entry |

**Example Get Top 10:**
```
GET /leaderboard-entries/leaderboard/1/top?limit=10
```

---

## Common Response Formats

### Success Response
```json
{
  "id": 1,
  "field1": "value1",
  "field2": "value2",
  ...
}
```

### Error Response
```json
{
  "message": "Error message",
  "error": "Detailed error information",
  "statusCode": 400
}
```

---

## Notes

- All endpoints use JSON for request/response bodies
- ID parameters in URLs are integers
- Timestamps are in ISO 8601 format
- Arrays in JSON (like `allowed_languages`) should be sent as JSON arrays
- The Supabase client handles all database operations
- All services are available for dependency injection in other modules

---

## Testing Endpoints

You can test the database connection:
```
GET http://localhost:3000/test-db
```

This will return the connection status and Supabase configuration.

