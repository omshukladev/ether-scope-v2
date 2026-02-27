# EtherScope Mobile

## Implementation Roadmap

This roadmap defines a controlled, phase-based execution plan aligned with the PRD and TRD.

The goal is:

- Predictable delivery
- Small deployable checkpoints
- Test-driven backend development
- Avoiding premature complexity

---

# Phase 0 — Foundation Setup

## Goal

Deploy a minimal working API with CI/CD and healthcheck.

---

## 0.1 Repository Structure

```

/apps
/mobile
/api
/docs
PRD.md
TRD.md
IMPLEMENTATION_ROADMAP.md

```

Inside `/apps/api`:

```

src/
index.ts
routes/
services/
middleware/
tests/
wrangler.toml
vitest.config.ts

```

---

## 0.2 Install Core Backend Dependencies

- hono
- typescript
- wrangler
- vitest
- zod
- clerk-sdk
- dotenv (dev only)

---

## 0.3 Implement Health Endpoint

Write test first:

```

GET /health
→ returns 200
→ returns { status: "ok" }

```

Then implement route.

Deploy using:

```

wrangler deploy

```

Add GitHub Actions pipeline:

1. Install dependencies
2. Run tests
3. Deploy

---

### Checkpoint 1

- CI passing
- `/health` deployed
- Project deployable

---

# Phase 1 — Wallet Search Engine (Core MVP)

This delivers real product value.

---

## Step 1 — Ethereum Address Validation (TDD)

Create:

```

services/address.service.ts

```

Test cases:

- Valid address
- Invalid address
- Lowercase address
- Checksum handling

No Lava integration yet.

---

### Checkpoint 2

Pure utility tested and stable.

---

## Step 2 — Lava Client Abstraction

Create:

```

services/lava.client.ts

```

Functions:

- fetchEthTransactions()
- fetchErc20Transfers()

Rules:

- Do not call Lava inside route handlers.
- Always abstract through service.

Mock this client in tests.

---

## Step 3 — Transaction Normalizer

Create:

```

services/transaction.mapper.ts

```

Test cases:

- ETH IN
- ETH OUT
- ERC20 IN
- ERC20 OUT
- Failed transaction
- Self transfer
- Duplicate hash handling

This is critical business logic.

Do not wire to API yet.

---

### Checkpoint 3

Mock Lava response → returns normalized transaction list.

---

## Step 4 — Merge and Sort Logic

Create:

```

services/wallet.service.ts

```

Test:

- Combined ETH + ERC20
- Sorted by timestamp
- Deduplicated by txHash + logIndex
- Limited to last 30

Then wire route:

```

GET /api/v1/wallet/:address

```

---

## Step 5 — Add Rate Limiting and Cache

- IP-based rate limiting
- 15–30 second cache
- Basic retry logic for Lava failures

---

### Checkpoint 4

Search endpoint production-ready.

Deploy.

Stop.

Do NOT start tracking yet.

---

# Phase 2 — Authentication Layer

---

## Step 6 — Clerk Integration

Create:

```

middleware/auth.middleware.ts

```

Test:

- Missing token
- Invalid token
- Valid token attaches user context

Protect:

- All tracking routes

Search remains public.

---

### Checkpoint 5

Authentication verified and working.

---

# Phase 3 — Tracking System

Now controlled complexity begins.

---

## Step 7 — D1 Schema Setup

Create tables:

- users
- tracked_wallets
- notifications_log

Test database queries locally using Wrangler.

---

## Step 8 — Tracking Comparison Logic (Pure Function)

Create:

```

services/tracking.service.ts

```

Function:

```

detectNewTransactions(lastCheckedTimestamp, transactions)

```

Test cases:

- No new transactions
- One new transaction
- Multiple new transactions
- Duplicate prevention

Keep pure and deterministic.

---

## Step 9 — Tracking API Routes

Implement:

- POST /track
- GET /track
- DELETE /track/:wallet

Enforce:

- Maximum 3 tracked wallets per user

Test route behavior thoroughly.

---

## Step 10 — Cron Worker

Add scheduled handler in Worker:

Flow:

1. Fetch tracked wallets
2. Fetch latest transactions
3. Compare timestamps
4. Send push notifications
5. Update last_checked_timestamp

Keep sequential.
Avoid parallel optimization initially.

---

### Checkpoint 6

Tracking system functional without push.

---

# Phase 4 — Push Notifications

---

## Step 11 — Device Token Registration

Create new table:

```

device_tokens

```

Add endpoint:

```

POST /device-token

```

Store:

- user_id
- device_token

---

## Step 12 — Notification Service

Create:

```

services/notification.service.ts

```

Mock during tests.

Integrate into cron logic.

---

### Checkpoint 7

Tracking + push notifications complete.

---

# Frontend State Management Plan

Keep state simple.

---

## Global State (React Native)

Use:

- Zustand or React Context

State shape:

```

authState
user
token

trackingState
trackedWallets

uiState
loading
error

```

---

## Local Storage

Use AsyncStorage.

Store:

- searchHistory (max 20)
- auth token

---

## Data Fetch Strategy

Search Tab:

- Always fetch fresh data
- Respect backend caching

Track Tab:

- Poll backend every 30–60 seconds
- Push handles real-time updates

---

# Data Flow Mapping

---

## Wallet Search Flow

User → Mobile  
↓  
GET /wallet/:address  
↓  
Worker  
↓  
Lava API  
↓  
Normalize + Merge  
↓  
Return JSON  
↓  
Render UI

---

## Tracking Flow

User → Add wallet  
↓  
POST /track  
↓  
Store in D1

Cron (every 2 minutes)  
↓  
Fetch tracked wallets  
↓  
Fetch Lava transactions  
↓  
Compare timestamps  
↓  
If new → Send push  
↓  
Update last_checked_timestamp

---

# Risk Areas

---

## 1. Lava API Rate Limits

Mitigation:

- Add caching
- Limit tracked wallets
- Poll every 2 minutes minimum

---

## 2. Duplicate Notifications

Mitigation:

- notifications_log table
- Compare txHash before sending

---

## 3. Large Wallet Performance

Mitigation:

- Fetch only latest transactions
- Always slice to 30

---

## 4. Cron Timeout

Mitigation:

- Sequential processing
- Cap number of tracked wallets

---

## 5. JWT Verification Latency

Mitigation:

- Cache Clerk JWKS

---

# Strict Dependency Order

Follow exactly:

1. Health endpoint
2. Address validation
3. Lava client abstraction
4. Transaction normalization
5. Wallet route
6. Rate limiting + cache
7. Clerk middleware
8. D1 schema
9. Tracking comparison logic
10. Tracking routes
11. Cron
12. Push service

Do NOT change this order.

---

# Controlled Execution Strategy

Each phase must:

- Have tests
- Pass CI
- Be deployable
- Be production-safe
- Be independently functional

Never build multiple complex systems simultaneously.

---

# Execution Philosophy

- Ship Search first
- Add Tracking safely
- Avoid premature scaling
- Avoid infrastructure complexity
- Keep backend stateless
- Test business logic first

This roadmap ensures stable, controlled, and scalable delivery.
