# Backend Rules & Architecture

This document defines backend conventions, standards, and architectural decisions.

---

## Stack Overview

```
Hono (lightweight framework)
  ↓
Cloudflare Workers (runtime)
  ↓
D1 (SQLite database)
  ↓
Inngest (background jobs)
  ↓
Etherscan API (blockchain data)
```

---

## Technology Choices

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Hono | Lightweight, Workers-native, great TS support |
| Runtime | Cloudflare Workers | Serverless, global edge deployment, D1 integration |
| Database | D1 (SQLite) | Edge-native, simple, sufficient for MVP |
| Background Jobs | Inngest | Reliable, event-driven, webhook support |
| Auth Verification | Clerk Backend SDK | Seamless with Clerk OAuth |
| Blockchain Data | Etherscan API | Reliable, free tier available |

---

## Project Structure

```
backend/src/
├── index.ts                    # Main Hono app, routes setup
├── controllers/                # Business logic handlers
│   ├── wallet.controller.ts    # fetchWalletTransactions
│   ├── tracking.controller.ts  # Track management
│   ├── history.controller.ts   # History management
│   └── healthCheck.controller.ts
├── routes/                     # Route definitions
│   ├── wallet.route.ts         # GET /wallet/:address
│   ├── tracking.route.ts       # POST/GET/DELETE /tracking/:address
│   ├── history.route.ts        # GET /wallet/history
│   ├── clerkWebhook.route.ts   # POST /webhooks/clerk
│   └── healtCheck.route.ts     # GET /health
├── services/                   # External API integrations
│   ├── etherscan.service.ts    # Etherscan API calls
│   ├── rpc.service.ts          # Direct RPC calls
│   └── walletScanner.service.ts # Wallet scanning logic
├── middlewares/                # Auth, error handling
│   └── auth.middleware.ts      # JWT verification
├── utils/                      # Utility functions
│   ├── asyncHandler.ts         # Async error wrapper
│   ├── apiResponse.ts          # Response formatter
│   ├── apiError.ts             # Custom error class
│   ├── errorHandler.ts         # Global error handler
│   └── tokenMetadata.ts        # Token utilities
├── inngest/                    # Background jobs
│   ├── client.ts               # Inngest client setup
│   ├── functions.ts            # Job registry
│   └── functions/              # Job implementations
│       └── syncUser.ts         # User sync job
└── migrations/                 # D1 migrations
    └── 0001_init.sql          # Schema creation
```

---

## Naming Conventions

### Files
- Controllers: `*.controller.ts`
- Routes: `*.route.ts`
- Services: `*.service.ts`
- Middlewares: `*.middleware.ts`
- Utils: descriptive name (e.g., `apiResponse.ts`, `asyncHandler.ts`)

### Functions
- Controllers: camelCase, descriptive action (e.g., `walletActivity`, `addTrackedWallet`)
- Services: camelCase, action + noun (e.g., `fetchWalletTransactions`)
- Utilities: camelCase (e.g., `asyncHandler`, `apiResponse`)

### Variables
- Constants: UPPER_SNAKE_CASE (e.g., `BASE_URL`, `MAX_WALLETS`)
- Destructuring: camelCase (e.g., `const { userId, wallet }`)

---

## File Size Rules

Keep files focused:
- Controllers: <150 lines (one responsibility)
- Services: <200 lines (single integration)
- Routes: <80 lines (just route definitions)
- Utils: <100 lines (single utility)

If a file exceeds limits, split into smaller modules.

---

## Package Dependencies

### Core Dependencies
```json
{
  "hono": "^4.12.3",                 // Web framework
  "@clerk/backend": "^3.2.0",        // JWT verification
  "inngest": "^3.52.6",              // Background jobs
  "jose": "^6.2.0",                  // JWT handling
  "svix": "^1.86.0",                 // Webhook verification
  "uuid": "^13.0.0"                  // ID generation
}
```

### Adding New Packages

Before adding:
1. Check if Hono has built-in alternative
2. Verify Workers compatibility
3. Keep bundle size minimal
4. Use only essential packages

Avoid:
- Heavy node-specific packages
- Packages with native bindings
- Unnecessary polyfills

---

## Database Schema Rules

### Table Naming
- Lowercase with underscores: `tracked_wallets`, `wallet_history`
- Plural names for collections

### Column Naming
- Lowercase with underscores: `user_id`, `wallet_address`, `created_at`
- Use `_at` suffix for timestamps: `created_at`, `updated_at`
- Use `_id` suffix for foreign keys: `user_id`, `wallet_id`

### Data Types
- IDs: TEXT PRIMARY KEY (for user IDs from Clerk)
- Addresses: TEXT (lowercase stored)
- Timestamps: INTEGER (Unix timestamp)
- Large numbers: TEXT (to avoid precision loss)

### Current Schema

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

-- Wallet History (max 20 per user, local cache)
CREATE TABLE wallet_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  searched_at INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
```

### Migration Rules
- Create migrations in `migrations/` folder
- Name: `NNNN_description.sql` (e.g., `0001_init.sql`)
- Use `wrangler d1 migrations create` command
- Test migrations locally before deploying
- Document schema changes in this file

---

## Code Style Rules

### Imports
```typescript
// 1. External packages
import { Hono } from "hono";
import { cors } from "hono/cors";

// 2. Internal modules
import { walletController } from "@/controllers/wallet.controller";
import { apiResponse } from "@/utils/apiResponse";

// 3. Types
import type { Request, Response } from "./types";
```

### Error Handling
```typescript
// Always use asyncHandler for route handlers
const getWallet = asyncHandler(async (c: any) => {
  if (!isValid) {
    throw new apiError(400, "Invalid input");
  }
  
  return c.json(new apiResponse(200, data, "Success"));
});

// Do NOT use try-catch in controllers (handled by asyncHandler)
```

### Response Format
```typescript
// Always use apiResponse wrapper
return c.json(
  new apiResponse(200, { wallet, transactions }, "Wallet fetched"),
  200
);

// Never raw JSON
// ❌ return c.json({ wallet, transactions });
// ✅ return c.json(new apiResponse(...));
```

### Validation
```typescript
// Validate inputs at controller level
if (!wallet || wallet.length !== 42) {
  throw new apiError(400, "Invalid wallet address");
}

// Sanitize/lowercase addresses
const normalizedAddress = wallet.toLowerCase();
```

---

## API Endpoint Rules

### Route Definition Pattern
```typescript
// routes/wallet.route.ts
const router = new Hono<{ Bindings: Bindings }>();

router.get("/:address", authenticate, walletActivity);
router.get("/history", authenticate, getWalletHistory);

export default router;
```

### Controller Pattern
```typescript
// controllers/wallet.controller.ts
const walletActivity = asyncHandler(async (c: any) => {
  const wallet = c.req.param("address");
  const userId = c.get("userId");
  
  // Validation
  if (!wallet || wallet.length !== 42) {
    throw new apiError(400, "Invalid wallet address");
  }
  
  // Business logic
  const transactions = await fetchWalletTransactions(c.env, wallet);
  
  // Database operations
  await c.env.DB.prepare("INSERT ...").bind(...).run();
  
  // Response
  return c.json(new apiResponse(200, { wallet, transactions }, "Success"));
});

export { walletActivity };
```

---

## Authentication & Authorization

### Clerk JWT Verification
```typescript
// Automatic via middleware
const authenticate = async (c: any, next: any) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!token) throw new apiError(401, "Missing token");
  
  const userId = await verifyClerkToken(token, c.env.CLERK_SECRET);
  c.set("userId", userId);
  
  await next();
};
```

### Usage in Controllers
```typescript
const userId = c.get("userId"); // Already verified
```

---

## External API Integration Rules

### Etherscan Service Pattern
```typescript
// Always wrap API calls
const fetchWalletTransactions = async (env: any, address: string) => {
  const params = { /* ... */ };
  const response = await fetch(url);
  
  if (!response.ok) throw new apiError(500, "Etherscan API failed");
  
  const data = await response.json();
  
  // Normalize data
  return normalizeTransactions(data);
};
```

### Error Handling
```typescript
// Throw apiError for known errors
if (status === "0") {
  throw new apiError(400, "Invalid wallet address");
}

// Global handler catches all errors
app.onError(errorHandler);
```

---

## Environment Variables

### wrangler.jsonc
```toml
[env.production.secrets]
ETHERSCAN_API_KEY = "your_key"
CLERK_WEBHOOK_SECRET = "your_secret"
INNGEST_EVENT_KEY = "your_key"
INNGEST_SIGNING_KEY = "your_key"
```

### .dev.vars (local development)
```env
ETHERSCAN_API_KEY=local_key
CLERK_WEBHOOK_SECRET=local_secret
INNGEST_EVENT_KEY=local_key
INNGEST_SIGNING_KEY=local_key
```

Never commit secrets. Use environment variables.

---

## Deployment Rules

### Before Deploying
- Run type check: `npx tsc --noEmit`
- Test locally: `npm run dev`
- Check migrations: `wrangler d1 migrations list`

### Deployment Command
```bash
npm run deploy  # Minified production build
```

### Production Checklist
- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] CORS configured
- [ ] Error handling verified
- [ ] Rate limiting (if enabled)
- [ ] Webhook secrets configured

---

## Performance Optimization

### Queries
- Use prepared statements (prevents SQL injection)
- Batch operations when possible
- Cache Etherscan results if needed

### API Calls
- Parallel requests: `Promise.all([fetch(...), fetch(...)])`
- Timeouts: Set reasonable timeout for external APIs
- Retry logic: Implement for Inngest jobs

### Database
- Index frequently filtered columns
- Limit query results (pagination)
- Archive old history data periodically

---

## Logging & Monitoring

### Current Logging
- Errors: Logged by errorHandler
- Console: Use `console.log` for debugging (removed in production)

### To Add
- Structured logging (JSON format)
- Error tracking (Sentry/Rollbar)
- Performance monitoring
- Request/response logging

---

## Testing

Currently no tests exist. Add:
- Unit tests for services
- Integration tests for routes
- Mock Etherscan API responses
- Mock Clerk tokens

---

## Security Considerations

### CORS
- Restricted to necessary methods
- Headers validated

### JWT
- Verified server-side
- Tokens cached securely

### Database
- Prepared statements (no SQL injection)
- User-scoped queries (users can't access other users' data)

### Secrets
- Never commit to git
- Use environment variables
- Rotate regularly

---

## Common Patterns

### Rate Limiting (Future)
```typescript
// To be implemented
const rateLimit = (requests: number, interval: number) => {
  // Cloudflare rate limiting middleware
};
```

### Webhook Processing
```typescript
// Svix verification
const verifyWebhook = async (req: Request, secret: string) => {
  // Verify signature
  // Process payload
  // Return 200 to Svix
};
```

### Background Jobs (Inngest)
```typescript
// Define job
export const syncUserWallet = inngest.createFunction(
  { name: "sync-user-wallet" },
  { event: "wallet/track.added" },
  async ({ event }) => {
    // Poll and process
  }
);
```

---

## Maintenance

### Regular Tasks
- Monitor Etherscan API usage
- Check error logs
- Audit user data access
- Update dependencies monthly

### Deprecation Policy
- Mark deprecated endpoints with warning
- Provide migration period (2+ weeks)
- Log deprecation notices
- Remove after migration period

---

## Adding New Endpoints

Checklist:
- [ ] Create controller function (use asyncHandler)
- [ ] Create route definition
- [ ] Add authentication if needed
- [ ] Validate all inputs
- [ ] Add to API_CONTRACTS.md
- [ ] Test locally
- [ ] Update SESSION_LOG.md

---

## Dependencies Update Policy

- Update monthly (security patches)
- Test on staging before production
- Monitor for breaking changes
- Keep changelog updated
