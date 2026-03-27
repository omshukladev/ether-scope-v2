# EtherScope Mobile

<div align="center">

[![React Native](https://img.shields.io/badge/React%20Native-v0.81.5-00a8e8?style=flat-square&logo=react)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-v54.0-000?style=flat-square&logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-API-f38020?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com)

A powerful mobile-first Ethereum wallet activity viewer and tracker.

[Features](#features) • [Getting Started](#getting-started) • [Architecture](#architecture) • [API Documentation](#api-documentation)

</div>

---

## 🎯 Overview

**EtherScope Mobile** is a modern mobile application that enables users to monitor Ethereum wallet activity in real-time. Whether you're a crypto trader, NFT enthusiast, or blockchain analyst, EtherScope simplifies wallet monitoring by consolidating ETH and ERC20 transaction data into a unified, easy-to-use interface with real-time notifications.

### Problem Statement

Existing blockchain monitoring solutions require users to:

- Use multiple block explorers and interfaces
- Manually switch between ETH and token transaction tabs
- Interpret complex transaction data
- Lack real-time mobile alerts

EtherScope solves these pain points with a native mobile-first experience designed specifically for wallet tracking.

---

## ✨ Features

### Core Functionality

- **🔍 Wallet Search** - Search any Ethereum wallet address and instantly view transaction history
- **📊 Unified Transaction Feed** - Consolidated view of ETH transfers and ERC20 tokens in a single chronological feed
- **💰 Token Support** - Automatic ERC20 token symbol resolution and balance tracking
- **📈 Transaction Details** - View transaction type (incoming/outgoing), status, amount, timestamp, and hash
- **⏱️ Real-Time Monitoring** - Track up to 3 wallets simultaneously with automatic polling

### User Experience

- **🔐 Secure Authentication** - OAuth-based login via Google and Apple accounts powered by Clerk
- **📱 Native Performance** - Optimized React Native app compiled for iOS and Android
- **🎨 Modern UI** - Animated components with NativeWind styling and Tailwind CSS
- **🌓 Dark/Light Mode** - Seamless theme switching for better accessibility
- **⏰ Search History** - Quick access to previously searched wallets (up to 20 entries)
- **🔔 Push Notifications** - Receive alerts when tracked wallets have new activity

### Developer Features

- **📦 Type-Safe** - Full TypeScript support across mobile and backend
- **⚡ Optimized Queries** - React Query for intelligent caching and background updates
- **🔄 Background Jobs** - Inngest-powered event-driven architecture for reliable task processing
- **📡 RESTful API** - Clean, documented API endpoints with Clerk JWT authentication

---

## 🏗️ Architecture

### Frontend Stack

```
ether-scope/
├── app/                      # Expo Router navigation
│   ├── (auth)/               # Authentication screens
│   ├── (tabs)/               # Main app tabs (Search, History, Track, Settings)
│   ├── _layout.tsx           # Root layout with providers
│   └── splash.tsx            # Custom splash screen
├── components/               # Reusable UI components
│   ├── tabs/                 # Tab-specific components
│   └── Animated*.tsx         # Motion components (Card, Modal, Orb, etc.)
├── hooks/                    # Custom React hooks
│   ├── useWallet.ts          # Wallet operations
│   └── useTracking.ts        # Tracking functionality
├── services/                 # API service layer
├── lib/                      # Utilities & context
│   ├── api.ts                # Axios instance with Clerk JWT
│   ├── themeContext.tsx      # Theme management
│   └── notifications.ts      # Push notification handling
└── theme/                    # Theme configuration
```

**Key Technologies:**

- **Expo Router** - File-based routing for native navigation
- **React Query** - Server state management and caching
- **NativeWind** - Utility-first styling with Tailwind CSS
- **React Native Reanimated** - Smooth, 60 FPS animations
- **Clerk** - Passwordless authentication (Google/Apple OAuth)
- **AsyncStorage** - Local persistence for search history

### Backend Architecture

```
backend/
├── src/
│   ├── index.ts              # Main Hono app with routes
│   ├── controllers/          # Business logic handlers
│   │   ├── wallet.controller.ts
│   │   ├── tracking.controller.ts
│   │   └── history.controller.ts
│   ├── services/             # External API integrations
│   │   ├── etherscan.service.ts   # Ethereum transaction data
│   │   ├── rpc.service.ts         # Direct RPC calls
│   │   └── walletScanner.service.ts
│   ├── routes/               # API endpoints
│   ├── middlewares/          # Auth & error handling
│   ├── inngest/              # Background job definitions
│   └── utils/                # Helpers & error handling
├── migrations/               # D1 database schema
└── wrangler.jsonc            # Cloudflare Workers config
```

**Key Technologies:**

- **Hono** - Lightweight web framework for Workers
- **Cloudflare Workers** - Serverless compute for API
- **Cloudflare D1** - SQLite database at the edge
- **Inngest** - Event-driven background job runner
- **Clerk Backend SDK** - JWT verification
- **Etherscan API** - Blockchain data source

### Data Flow

```
Mobile App
    ↓
Clerk Authentication (JWT)
    ↓
Cloudflare Worker (Hono)
    ↓
Clerk Verification
    ↓
Database (D1) / External APIs (Etherscan)
    ↓
Response ← JSON
```

---

## 🚀 Getting Started

### Android APK Download

Android users can directly install the latest app build from this repository:

- [Download EtherScope APK](./Ether%20Scope.apk)

If your browser blocks the file, navigate to the project root and install `Ether Scope.apk` manually on your Android device.

Quick install steps:

1. Download or copy `Ether Scope.apk` to your Android phone.
2. Open the APK file from your Downloads/File Manager app.
3. Allow installs from unknown sources when prompted.
4. Complete installation and open EtherScope.

### Prerequisites

- Node.js 18+ and npm/yarn
- iOS Simulator (Xcode) or Android Emulator
- Clerk account for authentication
- Etherscan API key for blockchain data
- Cloudflare account for backend deployment

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ether-scope-v2.git
cd ether-scope-v2
```

#### 2. Frontend Setup (Mobile App)

```bash
cd ether-scope
npm install

# Set up environment variables
cp .env.example .env.local

# Add to .env.local:
# EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
# EXPO_PUBLIC_API_URL=http://localhost:8787 (for development)
```

#### 3. Backend Setup (Cloudflare Workers)

```bash
cd backend
npm install

# Set up environment variables in wrangler.jsonc:
# - ETHERSCAN_API_KEY
# - CLERK_WEBHOOK_SECRET
# - Cloudflare D1 database binding

# Generate Cloudflare type bindings
npm run cf-typegen

# Run migrations (if D1 is configured)
npm run db:migrate
```

#### 4. Start Development

**Mobile App:**

```bash
cd ether-scope
npx expo start

# Choose platform:
# i - iOS Simulator
# a - Android Emulator
# w - Web
```

**Backend API:**

```bash
cd backend
npm run dev  # Runs on http://localhost:8787
```

---

## 📚 API Documentation

### Base URL

- **Development**: `http://localhost:8787/api`
- **Production**: `https://backend.hustler.workers.dev/api`

### Authentication

All protected endpoints require a valid Clerk JWT token in the Authorization header:

```bash
Authorization: Bearer <CLERK_JWT_TOKEN>
```

### Endpoints

#### Wallet Search

**Get Wallet Transactions**

```http
GET /wallet/:address
Authorization: Bearer <token>
```

**Query Parameters:**

- `address` (required) - Ethereum wallet address (42 characters with 0x prefix)

**Response:**

```json
{
  "status": 200,
  "message": "Wallet transactions fetched",
  "data": [
    {
      "hash": "0x123...",
      "from": "0x456...",
      "to": "0x789...",
      "amount": 1.5,
      "symbol": "ETH",
      "date": "2026-03-18T10:30:00Z",
      "type": "incoming",
      "status": "success"
    }
  ]
}
```

#### Wallet History

**Get Previously Searched Wallets**

```http
GET /wallet/history
Authorization: Bearer <token>
```

**Response:**

```json
{
  "status": 200,
  "message": "Wallet history fetched",
  "data": [
    {
      "address": "0x1234...",
      "timestamp": 1710756600
    }
  ]
}
```

#### Wallet Tracking

**Add Wallet to Tracking**

```http
POST /tracking/:address
Authorization: Bearer <token>
```

**Get Tracked Wallets**

```http
GET /tracking
Authorization: Bearer <token>
```

**Remove Tracked Wallet**

```http
DELETE /tracking/:address
Authorization: Bearer <token>
```

#### Health Check

**API Status**

```http
GET /health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-03-18T10:30:00Z"
}
```

---

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
EXPO_PUBLIC_API_URL=https://backend.hustler.workers.dev/api
```

#### Backend (wrangler.jsonc)

```toml
[env.production]
vars = { }
[env.production.secrets]
ETHERSCAN_API_KEY = "your_key"
CLERK_WEBHOOK_SECRET = "your_secret"
INNGEST_EVENT_KEY = "your_key"
INNGEST_SIGNING_KEY = "your_key"
```

---

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
```

### Wallet Tracking

```sql
CREATE TABLE tracked_wallets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id),
  UNIQUE(user_id, wallet_address)
);
```

### Wallet History

```sql
CREATE TABLE wallet_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  searched_at INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
```

---

## 📦 Project Structure

```
ether-scope-v2/
├── ether-scope/              # React Native Expo app
├── backend/                  # Cloudflare Workers API
├── tests/                    # Vitest unit tests
├── prd.md                    # Product Requirements
├── trd.md                    # Technical Requirements
├── roadmap.md                # Implementation Roadmap
├── todo.md                   # Task tracking
└── README.md                 # This file
```

---

## 🧪 Testing

### Frontend Tests

```bash
cd ether-scope
npm test
```

### Backend Tests

```bash
cd backend
npm test
```

### E2E Testing

Mobile testing uses Detox for automated interactions:

```bash
npm run test:e2e
```

---

## 🚀 Deployment

### Deploy Backend to Cloudflare Workers

```bash
cd backend
npm run deploy
```

### Publish Mobile App

#### iOS (via EAS)

```bash
eas build --platform ios
eas submit --platform ios
```

#### Android (via EAS)

```bash
eas build --platform android
eas submit --platform android
```

See [EAS Documentation](https://docs.eas.dev) for detailed build and submission instructions.

---

## 🔐 Security Considerations

- **JWT Verification**: All API endpoints verify Clerk JWT tokens server-side
- **Database**: D1 uses prepared statements to prevent SQL injection
- **Rate Limiting**: Implement via Cloudflare Workers for API protection
- **CORS**: Configured to handle cross-origin requests securely
- **Secure Storage**: Sensitive tokens stored in encrypted AsyncStorage
- **Environment Secrets**: Never commit `.env` files or secrets to version control

---

## 📊 Limitations & Roadmap

### Current Limitations (MVP)

- **Transaction Limit**: Last 50 transactions per wallet
- **Tracked Wallets**: Maximum 3 per user
- **Search History**: Maximum 20 entries (local storage)
- **Network**: Ethereum mainnet only

### Planned Features (V2+)

- [ ] Multi-chain support (Polygon, Arbitrum, Optimism)
- [ ] Advanced filtering and sorting
- [ ] Transaction analysis and portfolio tracking
- [ ] Gas optimization recommendations
- [ ] Custom alerts and thresholds
- [ ] Export transaction history (CSV/PDF)
- [ ] Integration with DeFi protocols

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Test on both iOS and Android simulators

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- [Expo](https://expo.dev) - React Native framework
- [Clerk](https://clerk.com) - Authentication infrastructure
- [Cloudflare Workers](https://workers.cloudflare.com) - Serverless compute
- [Etherscan API](https://etherscan.io/apis) - Blockchain data provider
- [React Query](https://tanstack.com/query) - Data fetching and caching
- [Inngest](https://www.inngest.com) - Event-driven background jobs

---

## 📞 Support & Feedback

For issues, questions, or feature requests:

- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions for Q&A
- **Email**: support@ether-scope.dev

---

<div align="center">

Built with ❤️ using React Native, TypeScript, and Cloudflare Workers

[⬆ Back to top](#ether-scope-mobile)

</div>
