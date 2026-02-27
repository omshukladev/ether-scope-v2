Your sample test suite is for a **custom username/password auth system**.

EtherScope uses:

* Clerk
* JWT-based authentication
* No `/signup`
* No `/signin`
* No password storage

So we cannot reuse that structure directly.

---

# 🧠 For EtherScope V1

Auth rules (from TRD):

* Clerk handles signup/signin
* Backend only verifies JWT
* Search = public
* Tracking = protected
* No username/password endpoints

So our test roadmap must reflect that architecture.

---

# 📘 Here Is Your `roadmap.md`

You can paste this into your repo as:

```
roadmap.md
```

---

# 🧪 EtherScope Backend Testing Roadmap

## 🎯 Philosophy

We follow strict Test-Driven Development (TDD):

1. Write failing test
2. Implement minimal logic
3. Make test pass
4. Refactor
5. Move to next feature

We build in controlled layers.

---

# 🧱 PHASE 1 — Foundation Tests (Infrastructure Safety)

Goal: Ensure backend skeleton works.

---

## ✅ Step 1 — Healthcheck Route

### Endpoint:

```
GET /api/v1/health
```

### Tests:

* Should return 200
* Should return `{ status: "ok" }`
* Should return timestamp
* Should not require authentication

After this passes → CI baseline is valid.

---

# 🔐 PHASE 2 — Authentication Guard

Goal: Protect tracking routes.

We do NOT test Clerk itself.
We test behavior when token is:

* Missing
* Invalid
* Valid

---

## ✅ Step 2 — Auth Middleware Tests

Test cases:

1. No Authorization header → 401
2. Invalid token → 401
3. Valid token → attaches `userId`
4. Valid token → route executes

This is pure middleware testing.

---

## ✅ Step 3 — Protected Route Enforcement

Endpoint:

```
POST /api/v1/track
```

Tests:

1. Without auth → 401
2. With valid token → 200
3. Ensure userId is accessible in handler

At this stage:
Auth system is locked down.

---

# 🔎 PHASE 3 — Wallet Search (Public)

Endpoint:

```
GET /api/v1/wallet/:address
```

We mock Lava API responses.

---

## ✅ Step 4 — Address Validation

Test cases:

1. Valid Ethereum address → passes
2. Invalid format → 400
3. Empty address → 400

---

## ✅ Step 5 — Merge Logic (Unit Test Only)

We test pure function:

Input:

* ETH tx list
* ERC20 tx list

Expect:

* Merged
* Sorted descending
* Deduplicated
* Direction detected correctly
* Status parsed
* Limited to 30

This is core logic.
Must be heavily tested.

---

## ✅ Step 6 — Wallet API Integration Test

Mock Lava API:

Test cases:

1. ETH only
2. ERC20 only
3. Mixed
4. Duplicate tx
5. Failed tx
6. Large wallet (more than 30)

Expect normalized structure:

```json
{
  wallet,
  transactions: [...]
}
```

---

# 📌 PHASE 4 — Tracking System

Endpoint:

```
POST /api/v1/track
DELETE /api/v1/track/:wallet
GET /api/v1/track
```

---

## ✅ Step 7 — Add Wallet to Tracking

Test cases:

1. Auth required
2. Valid address required
3. User can add wallet
4. Duplicate wallet not allowed
5. Max 3 wallets enforced

---

## ✅ Step 8 — Delete Tracking

Test cases:

1. Auth required
2. Delete own wallet → success
3. Delete non-existing wallet → 400
4. Cannot delete another user’s wallet

---

## ✅ Step 9 — Get Tracking List

Test:

1. Returns only user's wallets
2. Returns empty if none
3. Returns max 3

---

# 🔁 PHASE 5 — Tracking Poll Logic (Unit Only)

This is cron logic.

We test pure function:

Input:

* Previous timestamp
* Latest tx list

Expect:

* Detect new tx
* Ignore old tx
* No duplicate notification
* Log notification

No API here.
Pure service tests.

---

# 🚦 PHASE 6 — Rate Limiting

Search endpoint:

Tests:

1. 5 requests within window → allowed
2. 6th request → 429

Tracking endpoint:

1. Per-user limit enforced

---

# 📦 PHASE 7 — Error Handling

Test cases:

1. Lava API failure → 503
2. D1 failure → graceful error
3. Invalid JSON body → 400
4. Missing required fields → 400

---

# 🧪 Final Test Structure

```
/tests
  health.test.ts
  auth.middleware.test.ts
  track.routes.test.ts
  wallet.validation.test.ts
  wallet.merge.test.ts
  wallet.api.test.ts
  tracking.service.test.ts
  rate.limit.test.ts
  error.handling.test.ts
```

---

# 🚀 Order We Actually Implement

You will NOT build everything at once.

Correct order:

1. Health
2. Auth middleware
3. Protected track route
4. Address validation
5. Merge logic
6. Wallet endpoint
7. Tracking CRUD
8. Polling logic
9. Rate limiting
10. Failure handling

---

# 🧠 Important Difference From Your Example

Your example:

* Tests real HTTP server
* Depends on running backend

For EtherScope, better approach:

* Use Hono `app.request()` for most tests
* Mock Lava API
* Mock Clerk verification
* Avoid hitting real server in CI

Much cleaner.
Much faster.
More deterministic.

---

