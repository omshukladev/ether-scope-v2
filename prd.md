# EtherScope Mobile - Product Requirement Document (PRD)

## 1. Overview

EtherScope Mobile is a mobile-first Ethereum wallet activity viewer and tracker.

The application allows users to:

- Search any Ethereum wallet address
- View merged transaction history (ETH + major ERC20 tokens)
- Track wallet activity in near real-time
- Receive push notifications on new activity
- Revisit previously searched wallets
- Authenticate using Google or Apple

The goal of V1 is to deliver a minimal, fast, and usable wallet activity monitoring app.

---

## 2. Problem Statement

Users who want to monitor Ethereum wallets must:

- Use block explorers
- Switch between ETH and token tabs
- Manually interpret transaction direction
- Lack real-time alerts in a simple mobile interface

There is no minimal mobile app that consolidates ETH + ERC20 transactions into a unified, easy-to-read feed with tracking capabilities.

---

## 3. Target Users

### Primary Users
- Retail crypto traders
- NFT traders
- On-chain observers
- Whale trackers

### Secondary Users
- Crypto analysts
- Developers
- Community managers

Users are expected to understand wallet addresses and basic blockchain concepts.

---

## 4. Product Scope (V1)

The application will contain four tabs:

1. Search
2. History
3. Track
4. Settings

---

## 5. Core User Flows

### 5.1 Search Wallet

1. User enters Ethereum wallet address
2. System validates address format
3. Backend fetches:
   - Normal ETH transactions
   - ERC20 token transfers
4. Backend merges and sorts transactions
5. App displays last 30 transactions

Each transaction displays:
- Token symbol
- Token type (ETH / ERC20)
- Amount
- Direction (IN / OUT / SELF)
- Status (SUCCESS / FAILED)
- Timestamp
- Shortened transaction hash

The searched wallet is saved in local history.

---

### 5.2 Search History

- Displays previously searched wallets
- User can:
  - Tap to reopen
  - Copy address
  - Delete entry
- Maximum 20 entries (local storage for MVP)

---

### 5.3 Track Wallet

- User adds wallet to tracking list
- System monitors for new transactions
- On detection:
  - Push notification sent
  - Activity added to tracking feed

MVP Limit:
- Maximum 3 tracked wallets per user

---

### 5.4 Authentication

- Google Sign-in
- Apple Sign-in
- Logout functionality
- User email displayed in settings

Tracking feature requires authentication.

---

## 6. MVP Feature List

### Included in V1

- Ethereum wallet search
- ETH transaction fetch
- ERC20 transfer fetch
- Merged + sorted transaction feed
- Last 30 transactions only
- Basic wallet validation
- Local search history
- Wallet tracking (polling-based)
- Push notifications
- Google & Apple login

---

## 7. Edge Cases

- Invalid wallet address
- Wallet with no transactions
- API failure
- Duplicate transactions
- Self-transfers
- Failed transactions
- Large-volume wallets
- Rate limiting

System must handle all gracefully with proper UI states.

---

## 8. Non-Goals (V1 Exclusions)

- No trading functionality
- No portfolio valuation
- No NFT display
- No DeFi analytics
- No multi-chain support
- No wallet connection (MetaMask)
- No advanced smart contract decoding

---

## 9. Success Metrics

### Product Metrics
- Daily Active Users
- Searches per user
- Tracking feature adoption rate
- Notification open rate

### Technical Metrics
- <1.5 second average response time
- <2% API failure rate

### Retention
- 30% 7-day retention
- 20% of users use tracking feature

---

## 10. Engineering Approach

The system will:

- Use Cloudflare Workers for backend
- Use Lava API for blockchain data
- Use Clerk for authentication
- Follow Test-Driven Development (TDD) practices

Detailed API contracts, database schema, infrastructure design, and test specifications will be defined in the Technical Requirement Document (TRD).

---

## 11. Versioning

This document defines Version 1 (V1) scope only.
Any feature outside this document is considered out-of-scope.