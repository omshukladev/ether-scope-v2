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
Cloudflare D1 (Tracking Metadata)
        ↓
Push Notification Service (Expo Push / Firebase FCM)

---

## 1.2 Architectural Principles

- Stateless backend
- Edge-native deployment
- Polling-based tracking (no WebSockets in V1)
- API normalization layer between Lava and frontend
- Minimal persistent storage
- Test-Driven Development (TDD) for backend logic
- Avoid overengineering

---

# 2. Frontend Responsibilities

## 2.1 UI Responsibilities

- Four-tab navigation:
  - Search
  - History
  - Track
  - Settings
- Render unified transaction feed
- Display loading and error states
- Render empty states

---

## 2.2 Client-Side Logic

- Ethereum address validation
- Debounced search input
- Store search history locally (max 20 wallets)
- Persist authentication token
- Register push notification token
- Handle foreground/background notifications

---

## 2.3 API Interaction Rules

- Frontend calls backend only
- Never call Lava API directly
- All transaction data must be normalized by backend

---

# 3. Backend Responsibilities (Cloudflare Workers)

Built with:
- TypeScript
- Hono
- Wrangler
- Vitest

---

## 3.1 Core Backend Modules

### Wallet Service
- Fetch ETH transactions
- Fetch ERC20 transfers
- Normalize responses
- Merge and sort
- Deduplicate transactions
- Return latest 30 transactions

### Tracking Service
- Store tracked wallets
- Store last checked timestamp
- Poll Lava API
- Detect new transactions
- Trigger notifications

### Auth Middleware
- Verify Clerk JWT
- Attach user context

### Health Monitoring
- Provide healthcheck endpoint

---

# 4. Database Schema (Cloudflare D1)

Only minimal tracking metadata is stored.

---

## 4.1 users

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT,
  created_at INTEGER
);
```

---

## 4.2 tracked_wallets

```sql
CREATE TABLE tracked_wallets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  last_checked_timestamp INTEGER,
  created_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Constraint:

* Maximum 3 tracked wallets per user (enforced in backend logic)

---

## 4.3 notifications_log (Recommended for V1)

```sql
CREATE TABLE notifications_log (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  wallet_address TEXT,
  tx_hash TEXT,
  created_at INTEGER
);
```

Purpose:

* Prevent duplicate notifications

---

# 5. API Structure

Base path:

```
/api/v1
```

---

## 5.1 Wallet Search

### GET /wallet/:address

Description:
Returns merged ETH + ERC20 transactions.

Response:

```json
{
  "wallet": "0x...",
  "transactions": [
    {
      "txHash": "0x...",
      "timestamp": 1712341234,
      "tokenSymbol": "ETH",
      "tokenType": "ETH",
      "amount": "0.52",
      "direction": "OUT",
      "status": "SUCCESS",
      "from": "0x...",
      "to": "0x..."
    }
  ]
}
```

---

## 5.2 Tracking

### POST /track

Body:

```json
{
  "wallet": "0x..."
}
```

Auth required.

---

### DELETE /track/:wallet

Auth required.

---

### GET /track

Returns list of tracked wallets for authenticated user.

---

## 5.3 Healthcheck

### GET /health

Response:

```json
{
  "status": "ok",
  "timestamp": 1712341234
}
```

---

# 6. Authentication Strategy

Authentication provider: Clerk

Flow:

1. Mobile authenticates via Clerk SDK
2. Clerk returns JWT
3. Mobile sends JWT in Authorization header:
   Authorization: Bearer <token>
4. Backend verifies JWT using Clerk JWKS
5. Extract user_id and attach to request context

Rules:

* Search endpoint is public
* Tracking endpoints require authentication

---

# 7. Third-Party Dependencies

Core:

* Hono
* Clerk
* Lava API
* Cloudflare Workers
* Cloudflare D1
* Expo Push or Firebase FCM
* Vitest
* Wrangler

Optional future:

* Sentry (error monitoring)

---

# 8. Scalability Considerations

## 8.1 Stateless API

* No session storage
* JWT-based auth
* Minimal database usage

---

## 8.2 Rate Limiting

* IP-based limit for search endpoint
* Per-user limit for tracking
* Maximum 5 searches per 10 seconds

---

## 8.3 Caching Strategy

* Cache wallet search results for 15–30 seconds
* Use Cloudflare Cache API
* Reduce Lava API calls

---

## 8.4 Tracking Strategy (MVP)

* Use Cloudflare Cron Trigger
* Run every 1–2 minutes
* Fetch tracked wallets
* Compare latest transaction timestamp
* Send push notification if new activity detected

---

# 9. Testing Strategy (Vitest)

Backend follows Test-Driven Development (TDD).

---

## 9.1 Unit Tests

Test:

* Ethereum address validation
* Merge logic
* Deduplication logic
* Direction detection
* Failed transaction parsing
* Tracking comparison logic

---

## 9.2 Integration Tests

* Mock Lava API
* Simulate ETH and ERC20 responses
* Verify merged response correctness

---

## 9.3 API Route Tests

Test endpoints:

* /wallet/:address
* /track
* /health

---

## 9.4 Test Structure

```
/tests
  wallet.service.test.ts
  tracking.service.test.ts
  api.routes.test.ts
```

---

# 10. CI/CD Strategy

Using GitHub Actions.

---

## 10.1 Pipeline Steps

1. Install dependencies
2. Run linter
3. Run Vitest
4. Build project
5. Build Docker image (optional but recommended)
6. Deploy via Wrangler

---

## 10.2 Wrangler Deployment

```
wrangler deploy
```

GitHub Action:

```yaml
- name: Deploy
  run: wrangler deploy
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
```

---

# 11. Observability

* Log errors
* Log tracking runs
* Log Lava API failures
* Healthcheck endpoint
* Cloudflare Analytics

Future:

* Add Sentry

---

# 12. Failure Handling

If Lava API fails:

* Return 503
* Retry maximum 2 times

If D1 fails:

* Log error
* Return graceful error

If push notification fails:

* Log error
* Continue processing

---

# 13. Security Considerations

* Validate Ethereum address format
* Sanitize inputs
* Protect Lava API key (backend only)
* Enforce authentication on tracking endpoints
* Configure CORS restrictions

---

# 14. Performance Targets

* Search API response < 1.5 seconds
* Tracking poll cycle < 5 seconds per wallet
* Cold start < 200ms

---

# 15. Long-Term Stability Decisions

We intentionally:

* Avoid WebSockets in V1
* Avoid storing full transaction history in database
* Avoid complex analytics
* Keep polling simple
* Keep infrastructure minimal

This ensures cost control, simplicity, and scalability.

