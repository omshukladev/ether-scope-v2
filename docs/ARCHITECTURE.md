# Architecture Overview

This document provides a high-level architectural overview of EtherScope V2.

---

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     ETHER SCOPE V2 ARCHITECTURE                 │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│   MOBILE APP (Frontend)  │
│   ├─ Expo Router         │
│   ├─ React Query         │
│   ├─ Clerk OAuth         │
│   └─ Axios + JWT         │
└────────────┬─────────────┘
             │ (HTTPS)
             │ JWT Token in Header
             ▼
┌──────────────────────────────────────────┐
│    CLOUDFLARE WORKERS (Backend)          │
│    ├─ Hono Framework                     │
│    ├─ Auth Middleware (JWT Verification)│
│    ├─ CORS Configuration                 │
│    └─ Error Handling                     │
└────────┬─────────────────────┬───────────┘
         │                     │
         │                     │
    ┌────▼────┐          ┌────▼──────┐
    │   D1    │          │  Inngest  │
    │ SQLite  │          │   Jobs    │
    │ Database│          │           │
    └────┬────┘          └────┬──────┘
         │                    │
    ┌────▼────────────────────▼────┐
    │  Etherscan API               │
    │  (Blockchain Data Source)    │
    └─────────────────────────────┘
```

---

## Technology Stack Summary

### Frontend (ether-scope/)
```
- Expo 54.0 (React Native runtime)
- React 19.1
- React Native 0.81.5
- Expo Router 6.0 (file-based navigation)
- React Query 5.90 (server state)
- NativeWind 4.2 (Tailwind CSS)
- React Native Reanimated 4.1 (animations)
- Clerk Expo 3.0 (OAuth)
- Axios 1.13 (HTTP client)
- AsyncStorage 2.2 (secure persistence)
```

### Backend (backend/)
```
- Hono 4.12 (web framework)
- Cloudflare Workers (serverless compute)
- D1 (SQLite at edge)
- Inngest 3.52 (background jobs)
- Clerk Backend SDK 3.2 (JWT verification)
- Node 18+ (type definitions)
- TypeScript 5
```

### External Services
```
- Clerk (OAuth + JWT)
- Etherscan API (blockchain data)
- Cloudflare (Workers + D1 + KV)
- Inngest (background jobs)
```

---

## Data Flow

### 1. User Search Wallet

```
User enters address in app
         ↓
Frontend validates (42 chars, 0x prefix)
         ↓
useWalletTransactions hook triggered
         ↓
React Query calls walletService.fetchTransactions()
         ↓
Axios GET /api/wallet/:address
         ↓
Auto-injects Clerk JWT token
         ↓
HTTP POST to cloudflare worker
         ↓
Auth middleware verifies JWT
         ↓
Controller validates address format
         ↓
Etherscan service makes 2 parallel calls:
   ├─ GET ETH transfers (txlist action)
   └─ GET ERC20 transfers (tokentx action)
         ↓
Normalize both to unified format
         ↓
Merge & sort by date (descending)
         ↓
Save address to wallet_history table
         ↓
Return JSON response
         ↓
React Query caches result (5 min stale)
         ↓
Frontend displays transaction list
```

### 2. User Tracks Wallet

```
User taps "Track" button
         ↓
Frontend POST /api/tracking/:address
         ↓
Backend inserts to tracked_wallets table
         ↓
Inngest webhook triggered
         ↓
Background job scheduled (polling every 5 min)
         ↓
Each poll fetches latest transactions
         ↓
Compare with previous poll
         ↓
If new activity: trigger notification job
         ↓
Push notification sent to user device
         ↓
User sees real-time alert
```

### 3. User Logs In

```
App loads
         ↓
Check Clerk auth state
         ↓
If not authenticated → show login screen
         ↓
User taps "Sign In with Google/Apple"
         ↓
Clerk OAuth flow
         ↓
User authorizes
         ↓
Clerk returns JWT token
         ↓
Token stored in encrypted AsyncStorage
         ↓
setClerkGetToken() updates axios interceptor
         ↓
Frontend redirected to (tabs) navigation
         ↓
Can now access protected endpoints
```

---

## Authentication Architecture

### Frontend Authentication

```
┌─────────────────────────────────────────┐
│      Clerk Provider (Root Layout)       │
├─────────────────────────────────────────┤
│ - Wraps entire app                      │
│ - Handles OAuth flows                   │
│ - Manages token lifecycle               │
│ - Provides useAuth() hook               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Axios Interceptor (lib/api.ts)         │
├─────────────────────────────────────────┤
│ - Retrieves JWT from Clerk              │
│ - Injects into Authorization header     │
│ - Attaches to ALL requests              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   HTTP Request to Backend               │
│   Header: Authorization: Bearer <JWT>   │
└─────────────────────────────────────────┘
```

### Backend Authentication

```
┌──────────────────────────────────────────────┐
│   Incoming Request                           │
│   Header: Authorization: Bearer <JWT>        │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│   Auth Middleware (middlewares/auth.ts)      │
├──────────────────────────────────────────────┤
│ - Extract token from Authorization header    │
│ - Verify with Clerk SDK                      │
│ - Extract userId from JWT claims             │
│ - Store in context (c.set("userId", id))     │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│   Route Handler (Authenticated)              │
│   Access user: const userId = c.get("userId")│
└──────────────────────────────────────────────┘
```

---

## Database Architecture

### Schema

```sql
-- Users (synced from Clerk)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

-- Tracked Wallets (max 3 per user)
CREATE TABLE tracked_wallets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id),
  UNIQUE(user_id, wallet_address)
);

-- Wallet History (search history, max 20)
CREATE TABLE wallet_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  searched_at INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
```

### Data Relationships

```
users (1)
  │
  ├─── (M) tracked_wallets
  │        └─ One user can track multiple wallets (max 3)
  │
  └─── (M) wallet_history
           └─ One user has search history (max 20)
```

### User Data Sync

```
Clerk User Event
       ↓
Clerk Webhook → POST /api/webhooks/clerk
       ↓
Inngest Job (or direct insert)
       ↓
Insert/Update user in D1
       ↓
User data ready for API
```

---

## API Architecture

### Request/Response Pattern

```
Frontend Request:
GET /api/wallet/0x1234567890123456789012345678901234567890
Authorization: Bearer eyJhbGc...

Backend Response:
{
  "status": 200,
  "message": "Wallet transactions fetched",
  "data": {
    "wallet": "0x1234...",
    "transactions": [
      {
        "hash": "0xabc...",
        "from": "0x456...",
        "to": "0x789...",
        "amount": 1.5,
        "symbol": "ETH",
        "date": "2026-05-18T10:30:00Z",
        "type": "incoming",
        "status": "success"
      }
    ]
  }
}
```

### Route Structure

```
/api/
├─ /health                      # Health check
├─ /wallet
│  ├─ /:address                 # GET wallet transactions
│  ├─ /history                  # GET search history
├─ /tracking
│  ├─ /:address                 # POST add, DELETE remove
│  └─ (default)                 # GET all tracked
├─ /webhooks
│  └─ /clerk                    # POST webhook
└─ /inngest                     # POST job events
```

---

## Background Job Architecture

### Inngest Setup

```
Inngest Client
       ↓
┌─ Define Functions:
│  ├─ syncUserWallet (periodic polling)
│  ├─ sendNotification (new activity)
│  └─ syncClerkUser (user sync)
│
└─ Trigger via:
   ├─ Webhook: POST /api/inngest
   ├─ Scheduled: Inngest scheduler
   └─ Event: App publishes events
```

### Example: Wallet Polling

```
User adds wallet to tracking
       ↓
Inngest job scheduled
       ↓
Every 5 minutes:
  ├─ Fetch latest transactions
  ├─ Compare with cached
  ├─ If new: prepare notification
  ├─ Trigger notification job
  └─ Next poll in 5 min
       ↓
User receives push notification
```

---

## Caching Strategy

### Frontend Caching (React Query)

```
Query Cache:
├─ wallet transactions
│  ├─ staleTime: 5 minutes
│  ├─ gcTime: 10 minutes
│  └─ Key: ["wallet", address]
│
├─ tracked wallets
│  ├─ staleTime: 1 minute
│  └─ Key: ["tracking"]
│
└─ search history
   ├─ staleTime: 5 minutes
   └─ Key: ["history"]
```

### Backend Caching (Future)

Could add Cloudflare KV or D1 response caching:
- Cache Etherscan API responses
- Cache token metadata
- Cache frequently accessed wallets

---

## Error Handling Strategy

### Frontend

```
Component receives error from hook
       ↓
Display error message to user
       ↓
Provide retry button
       ↓
Log error for debugging
```

### Backend

```
Error occurs in route/service
       ↓
Throw apiError(code, message)
       ↓
asyncHandler catches it
       ↓
Global errorHandler formats response
       ↓
Return standardized error JSON
```

### Etherscan Integration

```
If Etherscan API fails:
├─ Log error
├─ Throw apiError(500, "Blockchain data unavailable")
├─ Frontend shows "Try again later"
└─ User can retry manually
```

---

## Performance Considerations

### Frontend Optimization
- Memoize components with React.memo()
- Use FlatList for lists (not ScrollView)
- Lazy load images
- Batch state updates
- Remove unnecessary re-renders

### Backend Optimization
- Parallel Etherscan API calls (Promise.all)
- Database query efficiency (indexed lookups)
- Response compression (Cloudflare auto)
- Rate limiting (to be added)

### Network Optimization
- JWT caching (valid for hours)
- Query caching (5 min for transactions)
- Batch API requests
- Partial responses (pagination if needed)

---

## Security Architecture

### Authentication
- Clerk JWT verification on every request
- JWT scoped to user ID
- Token refreshed automatically by Clerk

### Data Isolation
- All queries filtered by user_id
- Users can only access their own data
- Foreign key constraints enforced

### API Security
- CORS restricted to allowed methods
- SQL injection prevented (prepared statements)
- XSS prevented (API response JSON only)
- HTTPS only (Cloudflare enforces)

### Secrets Management
- Environment variables (never committed)
- Clerk webhook secret verified (Svix)
- Etherscan API key in backend only

---

## Scalability Plan

### Current State (MVP)
- Single Cloudflare Worker
- Single D1 database
- Etherscan API as source of truth
- Inngest for background jobs

### Near Future (V1.0)
- Response caching (KV store)
- Rate limiting (Cloudflare limit)
- Batch transaction processing
- Advanced error tracking

### Long Term (V2.0)
- Multi-chain support
- Local transaction indexing
- WebSocket for real-time updates
- Custom notifications system
- Portfolio tracking

---

## Deployment Architecture

### Environments

**Development**:
```
Frontend: localhost:8081 (expo dev)
Backend: localhost:8787 (wrangler dev)
Database: Local D1 (wrangler)
```

**Production**:
```
Frontend: EAS Build (iOS App Store, Google Play)
Backend: Cloudflare Workers (Edge servers globally)
Database: Cloudflare D1 (SQLite at edge)
```

### CI/CD Pipeline (To Implement)

```
Git Push
  ├─ Run TypeScript check
  ├─ Run linter
  ├─ Run tests
  ├─ Build frontend
  ├─ Build backend
  └─ Deploy to production
```

---

## Key Design Decisions

| Decision | Reason |
|----------|--------|
| Cloudflare Workers | Serverless, global edge, D1 native |
| Expo Router | File-based routing, native ecosystem |
| React Query | State management, caching, refetching |
| Hono | Lightweight, Workers-native, great TS |
| D1 SQLite | Simple, edge-native, sufficient for MVP |
| Inngest | Reliable jobs, webhook support, event-driven |

---

## Related Documents

- API_CONTRACTS.md - API endpoint specifications
- BACKEND_RULES.md - Backend conventions
- FRONTEND_ARCHITECTURE.md - Frontend structure
- FRONTEND_RULES.md - Frontend conventions
- SESSION_LOG.md - Development history
