# API Contracts

This document defines all API endpoints, request/response schemas, and authentication requirements.

**Base URL**: 
- Development: `http://localhost:8787/api`
- Production: `https://backend.hustler.workers.dev/api`

**Authentication**: All endpoints (except `/health`) require `Authorization: Bearer <CLERK_JWT_TOKEN>`

---

## Health Check

### GET /health
Health check endpoint (no auth required)

**Response** (200):
```json
{
  "status": "ok",
  "timestamp": "2026-05-18T10:40:00Z"
}
```

---

## Wallet Endpoints

### GET /wallet/:address
Fetch all transactions for a wallet (ETH + ERC20)

**Parameters**:
- `address` (path param, required) - Ethereum wallet address (42 chars with 0x prefix)

**Response** (200):
```json
{
  "status": 200,
  "message": "Wallet transactions fetched",
  "data": {
    "wallet": "0x1234567890123456789012345678901234567890",
    "transactions": [
      {
        "hash": "0xabc123...",
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

**Error Responses**:
- 400: Invalid wallet address
- 401: User not authenticated
- 500: Etherscan API error

---

### GET /wallet/history
Fetch user's search history (last 20 wallets)

**Response** (200):
```json
{
  "status": 200,
  "message": "Wallet history fetched",
  "data": [
    {
      "address": "0x1234567890123456789012345678901234567890",
      "searched_at": 1710756600
    }
  ]
}
```

---

## Tracking Endpoints

### POST /tracking/:address
Add wallet to tracking list (max 3 per user)

**Parameters**:
- `address` (path param, required) - Ethereum wallet address

**Response** (200):
```json
{
  "status": 200,
  "message": "Wallet added to tracking",
  "data": {
    "wallet": "0x1234567890123456789012345678901234567890"
  }
}
```

**Error Responses**:
- 400: Invalid wallet address
- 401: User not authenticated

---

### GET /tracking
Get all tracked wallets for user

**Response** (200):
```json
{
  "status": 200,
  "message": "Tracked wallets fetched",
  "data": [
    {
      "wallet_address": "0x1234567890123456789012345678901234567890",
      "created_at": 1710756600
    }
  ]
}
```

---

### DELETE /tracking/:address
Remove wallet from tracking

**Parameters**:
- `address` (path param, required) - Ethereum wallet address

**Response** (200):
```json
{
  "status": 200,
  "message": "Wallet removed from tracking",
  "data": null
}
```

---

## Webhook Endpoints

### POST /webhooks/clerk
Clerk webhook for user sync (user.created, user.updated, user.deleted)

**Headers Required**:
- `svix-id`: Webhook ID
- `svix-timestamp`: Timestamp
- `svix-signature`: HMAC signature

**Body**:
```json
{
  "type": "user.created",
  "data": {
    "id": "user_123",
    "email_addresses": [
      {
        "email_address": "user@example.com"
      }
    ]
  }
}
```

**Response** (200):
```json
{
  "status": 200,
  "message": "Webhook processed"
}
```

---

## Inngest Endpoints

### POST /api/inngest
Inngest job execution endpoint (internal use only)

Used for:
- Background wallet polling
- Push notifications
- User data sync

---

## Error Response Format

All error responses follow this format:

```json
{
  "status": [error_code],
  "message": "[error_message]",
  "data": null
}
```

**Common Status Codes**:
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

---

## Response Format Standard

All successful responses:
```json
{
  "status": 200,
  "message": "[human_readable_message]",
  "data": [response_data]
}
```

---

## Rate Limiting

Currently not implemented. To be added:
- 100 requests per minute per user IP
- Cloudflare Workers rate limit middleware

---

## CORS Configuration

Allowed:
- Methods: GET, POST, PUT, DELETE
- Headers: Content-Type, Authorization, X-Requested-With
- Origin: * (all origins)

---

## Data Type Definitions

### Transaction Object
```typescript
{
  hash: string;           // Transaction hash
  from: string;          // Sender address
  to: string;            // Recipient address
  amount: number;        // Amount in standard units (ETH or token decimals)
  symbol: string;        // Token symbol (ETH, USDC, etc)
  date: string;          // ISO 8601 format
  type: "incoming" | "outgoing";
  status: "success" | "failed";
}
```

### Wallet History Object
```typescript
{
  address: string;       // Wallet address (lowercase)
  searched_at: number;   // Unix timestamp
}
```

### Tracked Wallet Object
```typescript
{
  wallet_address: string;  // Wallet address (lowercase)
  created_at: number;      // Unix timestamp
}
```

---

## Frontend API Calls

### Using Axios Interceptor

```typescript
// Auto-attaches Clerk JWT token
import { apiClient } from '@/lib/api';

// Fetch wallet transactions
const response = await apiClient.get(`/wallet/0x1234...`);

// Add to tracking
await apiClient.post(`/tracking/0x1234...`);

// Get all tracked
const tracked = await apiClient.get(`/tracking`);

// Delete from tracking
await apiClient.delete(`/tracking/0x1234...`);
```

---

## Versioning

Current API Version: v1

Breaking changes will be documented here with migration guides.
