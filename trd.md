# EtherScope Mobile

## Technical Requirement Document (TRD)

---

# 1. System Architecture Overview

## 1.1 High-Level Architecture

Mobile App (React Native / Expo)
↓
Cloudflare Workers API (Hono + TypeScript)
↓
Lava API (Ethereum Blockchain Data)
↓
Cloudflare D1 (User + Tracking + Search Metadata)
↓
Push Notification Service (Expo Push / Firebase FCM)

Authentication Flow:

Clerk → Webhook → Inngest → Cloudflare Worker → D1

---

## 1.2 Architectural Principles

* Stateless backend
* Edge-native deployment
* JWT-based authentication (Clerk)
* User data mirrored in D1 via webhook sync
* Polling-based tracking (no WebSockets in V1)
* API normalization layer between Lava and frontend
* Minimal but scalable database schema
* Test-Driven Development (TDD)
* Avoid overengineering

---

# 2. Frontend Responsibilities

## 2.1 UI Responsibilities

* Four-tab navigation:

  * Search
  * History
  * Track
  * Settings
* Render unified transaction feed
* Display loading, error, and empty states
* Display Clerk user profile (image, name, logout)

---

## 2.2 Client-Side Logic

* Ethereum address validation (pre-check)
* Debounced search input
* Persist authentication token (Clerk SDK)
* Register push notification token
* Handle foreground/background notifications
* Display DB-backed search history

---

## 2.3 API Interaction Rules

* Frontend calls backend only
* Never call Lava API directly
* All blockchain data must be normalized by backend
* All user-related endpoints require authentication

---

# 3. Backend Responsibilities (Cloudflare Workers)

Built with:

* TypeScript
* Hono
* Wrangler
* Vitest

---

## 3.1 Core Backend Modules

### Wallet Service

* Fetch ETH transactions
* Fetch ERC20 transfers
* Normalize responses
* Merge and sort
* Deduplicate transactions
* Detect direction (IN / OUT / SELF)
* Return latest 30 transactions

Future:

* NFT transactions
* DeFi interactions

---

### Tracking Service

* Store tracked wallets
* Enforce max 3 wallets per user
* Store last checked timestamp
* Poll Lava API via Cron
* Detect new transactions
* Insert into notifications_log
* Trigger push notifications

---

### Search History Service

* Store wallet searches per user
* Prevent duplicates
* Keep maximum 20 recent searches
* Update timestamp on re-search

---

### Auth Middleware

* Verify Clerk JWT via JWKS
* Attach userId to request context
* Ensure user exists in D1 (defensive insert)

---

### Health Monitoring

* Provide healthcheck endpoint
* Log system failures

---

# 4. Database Schema (Cloudflare D1)

## 4.1 Users

Clerk user mirrored via Inngest webhook.

```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,          -- Clerk user ID
  name TEXT,
  email TEXT UNIQUE,
  profile_image TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);
```

---

## 4.2 Wallet Searches

```sql
CREATE TABLE IF NOT EXISTS wallet_searches (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Constraint:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS user_wallet_unique
ON wallet_searches(user_id, wallet_address);
```

Behavior:

* If wallet searched again → update timestamp
* Keep max 20 per user (delete oldest)

---

## 4.3 Tracked Wallets

```sql
CREATE TABLE IF NOT EXISTS tracked_wallets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  last_checked_timestamp INTEGER,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Constraint:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS user_tracked_wallet_unique
ON tracked_wallets(user_id, wallet_address);
```

Business Rule:

* Maximum 3 tracked wallets per user

---

## 4.4 Notifications Log

```sql
CREATE TABLE IF NOT EXISTS notifications_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  tx_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
```

Constraint:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS notification_unique
ON notifications_log(user_id, tx_hash);
```

Purpose:

* Prevent duplicate push notifications

---

# 5. API Structure

Base path:

```
/api/v1
```

---

## 5.1 Wallet Search (Authenticated)

### GET /wallet/:address

* Requires authentication
* Stores search history
* Returns merged transactions

Success Response:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "wallet": "0x...",
    "transactions": []
  },
  "message": "Wallet fetched successfully"
}
```

---

## 5.2 Search History

### GET /history

Returns last 20 searched wallets for authenticated user.

---

## 5.3 Tracking

### POST /track

Body:

```json
{
  "wallet": "0x..."
}
```

### DELETE /track/:wallet

### GET /track

All tracking endpoints require authentication.

---

## 5.4 Healthcheck

### GET /health

Public endpoint.

---

# 6. HTTP Status Codes

| Endpoint              | Success | Validation | Auth | Not Found | Rate Limit | Service Error |
| --------------------- | ------- | ---------- | ---- | --------- | ---------- | ------------- |
| GET /health           | 200     | -          | -    | -         | -          | 500           |
| GET /wallet/:address  | 200     | 400        | 401  | -         | 429        | 503           |
| POST /track           | 200     | 400        | 401  | -         | -          | 500           |
| DELETE /track/:wallet | 200     | 400        | 401  | 404       | -          | 500           |

---

# 7. Authentication Strategy

Provider: Clerk

Flow:

1. User authenticates via Clerk SDK
2. Clerk returns JWT
3. Frontend sends: Authorization: Bearer <token>
4. Backend verifies JWT via Clerk JWKS
5. Extract userId
6. Ensure user exists in D1

User Sync Flow:

Clerk → Webhook → Inngest → Worker → Insert into users table

Fallback Safety:

```
INSERT INTO users (id, created_at)
ON CONFLICT DO NOTHING;
```

---

# 8. Scalability Considerations

## 8.1 Stateless API

* No session storage
* JWT-based auth

## 8.2 Rate Limiting

* IP-based search rate limit
* Per-user tracking limits
* 5 searches per 10 seconds

## 8.3 Caching

* Cache wallet results 15–30 seconds
* Use Cloudflare Cache API
* Reduce Lava API calls

## 8.4 Tracking Strategy

* Cron Trigger every 1–2 minutes
* Compare last_checked_timestamp
* Insert new tx into notifications_log
* Send push notification

---

# 9. Testing Strategy (Vitest)

## 9.1 Unit Tests

* Address validation
* Merge logic
* Deduplication
* Direction detection
* Tracking comparison logic

## 9.2 Integration Tests

* Mock Lava API
* Verify normalized response

## 9.3 Route Tests

* /health
* /wallet/:address
* /track
* /history

---

# 10. CI/CD Strategy

Using GitHub Actions.

Pipeline:

1. Install dependencies
2. Run linter
3. Run Vitest
4. Build project
5. Deploy via Wrangler

Example:

```yaml
- name: Deploy
  run: wrangler deploy
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
```

---

# 11. Observability

* Log errors
* Log cron executions
* Log Lava failures
* Health endpoint monitoring

Future:

* Sentry integration

---

# 12. Failure Handling

* Lava failure → 503
* D1 failure → 500
* Push failure → log and continue

---

# 13. Security

* Validate Ethereum address format
* Enforce authentication
* Protect Lava API key
* Configure CORS
* Enforce per-user limits

---

# 14. Performance Targets

* < 1.5s wallet search
* < 5s tracking cycle per wallet
* < 200ms cold start

---

# 15. Long-Term Stability Decisions

* No WebSockets (V1)
* No portfolio tracking (V1)
* No NFT display (V1)
* No DeFi analytics (V1)
* No multi-chain support (V1)

Focus: Clean, minimal, scalable wallet activity monitoring.

```

---

If you'd like next, we can:

- Create a matching **PRD v2**
- Or generate a **database migration file**
- Or design the **auth + webhook flow diagram** in detail.
```
