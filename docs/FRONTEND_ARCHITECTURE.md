# Frontend Architecture

This document defines the folder structure, file organization, and architectural patterns for the React Native Expo mobile app.

---

## Tech Stack

```
Expo (React Native v0.81.5)
  ↓
Expo Router (file-based navigation)
  ↓
React Query (server state)
  ↓
NativeWind + Tailwind CSS (styling)
  ↓
React Native Reanimated (animations)
  ↓
Clerk Expo (authentication)
  ↓
Axios (HTTP + JWT)
```

---

## Folder Structure

```
ether-scope/
├── app/                          # Expo Router navigation (auto-routes)
│   ├── (auth)/                   # Auth screens (before login)
│   │   ├── _layout.tsx           # Auth layout wrapper
│   │   └── index.tsx             # Login screen (Clerk)
│   ├── (tabs)/                   # Main app screens (after login)
│   │   ├── _layout.tsx           # Tab navigation (4 bottom tabs)
│   │   ├── index.tsx             # Search/Explorer tab
│   │   ├── history.tsx           # History tab
│   │   ├── track.tsx             # Tracking tab
│   │   └── settings.tsx          # Settings tab
│   ├── _layout.tsx               # Root layout (Clerk + React Query providers)
│   └── splash.tsx                # Custom splash screen (3s delay)
│
├── components/                   # Reusable UI components
│   ├── Animated*.tsx             # Animated components
│   │   ├── AnimatedCard.tsx      # Animated card transitions
│   │   ├── AnimatedModal.tsx     # Animated modal/sheets
│   │   ├── AnimatedOrb.tsx       # Animated orb effects
│   │   └── HistoryCardMotion.tsx # Transaction card animation
│   ├── NeonBadge.tsx             # Neon-styled badges
│   ├── TokenIcon.tsx             # Token symbol/icon display
│   ├── DarkVeilBackground.tsx    # Background gradient veil
│   └── TransactionCard.tsx       # Transaction display card
│
├── hooks/                        # Custom React hooks
│   ├── useWallet.ts              # Fetch wallet transactions (React Query)
│   ├── useTracking.ts            # Manage tracked wallets
│   ├── useAuth.ts                # Auth state helpers
│   └── useTheme.ts               # Theme switching
│
├── services/                     # API layer
│   ├── walletService.ts          # Wallet API calls
│   ├── trackingService.ts        # Tracking API calls
│   └── historyService.ts         # History API calls
│
├── lib/                          # Utilities & context
│   ├── api.ts                    # Axios instance with JWT interceptor
│   ├── themeContext.tsx          # Dark/Light mode provider
│   ├── notifications.ts          # Push notification handlers
│   └── storage.ts                # AsyncStorage utilities
│
├── theme/                        # Theme configuration
│   ├── colors.ts                 # Color constants
│   └── spacing.ts                # Spacing/size constants
│
├── types/                        # TypeScript types
│   ├── wallet.ts                 # Wallet-related types
│   ├── tracking.ts               # Tracking types
│   └── api.ts                    # API response types
│
├── assets/                       # Images, icons, fonts
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── tailwind.config.js            # Tailwind configuration for NativeWind
├── nativewind-env.d.ts           # NativeWind type definitions
├── global.css                    # Global Tailwind styles
├── app.json                      # Expo configuration
├── eas.json                      # EAS build configuration
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
└── README.md                     # Frontend README
```

---

## Navigation Structure

### Expo Router (Auto-Routes)

The `app/` folder automatically creates routes:

```
app/
├── (auth)/index.tsx           → Route: (auth) / login
├── (tabs)/_layout.tsx         → Route: (tabs) with bottom tabs
├── (tabs)/index.tsx           → Route: (tabs) / search
├── (tabs)/history.tsx         → Route: (tabs)/history
├── (tabs)/track.tsx           → Route: (tabs)/track
├── (tabs)/settings.tsx        → Route: (tabs)/settings
└── splash.tsx                 → Route: /splash (custom)
```

### Navigation Logic

1. **App Start** → Check Clerk auth status
2. **Not Authenticated** → Redirect to `(auth)` → Login screen
3. **Authenticated** → Redirect to `(tabs)` → Bottom tab navigation
4. **Tab Navigation** → Swipe or tap bottom tabs

---

## Component Patterns

### Screen Component Pattern

```typescript
// app/(tabs)/index.tsx
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeMode } from "@/lib/themeContext";

export default function SearchTab() {
  const { darkMode } = useThemeMode();
  
  return (
    <View className="flex-1">
      <SafeAreaView className={`flex-1 px-4 ${darkMode ? "bg-black" : "bg-white"}`}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Content */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
```

### Custom Hook Pattern

```typescript
// hooks/useWallet.ts
import { useQuery } from "@tanstack/react-query";
import { walletService } from "@/services/walletService";

export function useWalletTransactions(address: string) {
  return useQuery({
    queryKey: ["wallet", address],
    queryFn: () => walletService.fetchTransactions(address),
    enabled: !!address && address.length === 42,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```

### Service Layer Pattern

```typescript
// services/walletService.ts
import { apiClient } from "@/lib/api";

export const walletService = {
  async fetchTransactions(address: string) {
    const response = await apiClient.get(`/wallet/${address}`);
    return response.data.data.transactions;
  },
  
  async getHistory() {
    const response = await apiClient.get(`/wallet/history`);
    return response.data.data;
  }
};
```

### Animated Component Pattern

```typescript
// components/HistoryCardMotion.tsx
import Animated, { 
  FadeInUp, 
  FadeOutDown,
  BounceIn 
} from "react-native-reanimated";
import { Pressable } from "react-native";

export default function HistoryCardMotion({ transaction, onPress }) {
  return (
    <Animated.View entering={FadeInUp} exiting={FadeOutDown}>
      <Pressable 
        onPress={onPress}
        className="bg-slate-900 rounded-lg p-4 mb-2"
      >
        {/* Card content */}
      </Pressable>
    </Animated.View>
  );
}
```

---

## File Descriptions

### Screen Files

| File | Purpose |
|------|---------|
| `app/_layout.tsx` | Root layout with Clerk/Query providers |
| `app/(auth)/index.tsx` | Clerk OAuth login screen |
| `app/(tabs)/_layout.tsx` | Bottom tab navigation setup |
| `app/(tabs)/index.tsx` | **Wallet Explorer** - Search wallets |
| `app/(tabs)/history.tsx` | **History** - Previously searched wallets |
| `app/(tabs)/track.tsx` | **Tracking** - Track up to 3 wallets |
| `app/(tabs)/settings.tsx` | **Settings** - Theme, logout, preferences |
| `app/splash.tsx` | Custom splash screen (3 second delay) |

### Component Files

| File | Purpose |
|------|---------|
| `AnimatedCard.tsx` | Animated entrance/exit for cards |
| `AnimatedModal.tsx` | Animated bottom sheet/modal |
| `HistoryCardMotion.tsx` | Transaction card with motion |
| `TokenIcon.tsx` | Display token symbol/logo |
| `NeonBadge.tsx` | Status/tag display with glow |
| `DarkVeilBackground.tsx` | Gradient background effect |
| `TransactionCard.tsx` | Single transaction display |

### Hook Files

| File | Purpose |
|------|---------|
| `useWallet.ts` | React Query hook for transactions |
| `useTracking.ts` | Manage tracked wallets |
| `useAuth.ts` | Auth state helpers |
| `useTheme.ts` | Theme context access |

### Service Files

| File | Purpose |
|------|---------|
| `walletService.ts` | API calls for wallet endpoints |
| `trackingService.ts` | API calls for tracking endpoints |
| `historyService.ts` | API calls for history endpoints |

### Utility Files

| File | Purpose |
|------|---------|
| `lib/api.ts` | Axios instance with JWT interceptor |
| `lib/themeContext.tsx` | Dark/Light mode provider |
| `lib/notifications.ts` | Push notification setup |
| `lib/storage.ts` | AsyncStorage helpers |

---

## Styling Rules

### Using NativeWind (Tailwind for React Native)

```typescript
// ✅ Use Tailwind classes
<View className="flex-1 px-4 bg-slate-900 rounded-lg">
  <Text className="text-white text-lg font-bold">Title</Text>
</View>

// ❌ Avoid inline styles
<View style={{ flex: 1, paddingHorizontal: 16, backgroundColor: "#111" }}>

// ❌ Avoid StyleSheet (unless performance critical)
const styles = StyleSheet.create({ ... });
```

### Color Scheme

**Dark Mode**:
- Background: `#000000` (pure black)
- Surface: `#111111` (dark gray)
- Text: `#FFFFFF` (white)
- Accent: `#3B82F6` (blue)

**Light Mode**:
- Background: `#FFFFFF` (white)
- Surface: `#F3F4F6` (light gray)
- Text: `#000000` (black)
- Accent: `#2563EB` (darker blue)

### Spacing
- Use Tailwind spacing: `p-4`, `m-2`, `px-4`, etc.
- Consistent 4px grid: `p-1` = 4px, `p-2` = 8px, etc.

---

## State Management

### Client State (Zustand)

Currently not used extensively. Add for:
- UI state (modals, filters)
- User preferences

### Server State (React Query)

Used for:
- Wallet transactions
- Tracked wallets
- Search history

```typescript
const { data, isLoading, error, refetch } = useWalletTransactions(address);
```

---

## Form Handling

### Input Validation

```typescript
// Wallet address validation
const isValidAddress = (addr: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
};
```

### Error Display

```typescript
{error && (
  <Text className="text-red-500 text-sm mt-2">
    {error.message}
  </Text>
)}
```

---

## Authentication Flow

1. **App Loads** → Check `useAuth()` status
2. **Not Logged In** → Show `(auth)` group → Login screen
3. **Clerk OAuth** → User signs in via Google/Apple
4. **Token Cached** → Stored in encrypted AsyncStorage
5. **Axios Interceptor** → Token auto-attached to requests
6. **User Verified** → Redirect to `(tabs)` navigation
7. **Logged In** → Can access protected endpoints

### Setup in `app/_layout.tsx`

```typescript
import { ClerkProvider, useAuth } from "@clerk/expo";
import { setClerkGetToken } from "@/lib/api";

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_KEY}>
      <AppProviders />
    </ClerkProvider>
  );
}

function AppProviders() {
  const { getToken, isLoaded } = useAuth();
  
  useEffect(() => {
    if (isLoaded) {
      setClerkGetToken(getToken);
    }
  }, [getToken, isLoaded]);
  
  // Return navigation
}
```

---

## Performance Optimization

### React Query Caching

```typescript
// Cache for 5 minutes
staleTime: 1000 * 60 * 5,

// Refetch in background
refetchOnWindowFocus: true,

// Don't refetch automatically
gcTime: 1000 * 60 * 10, // 10 minutes
```

### FlatList/ScrollView

```typescript
// ✅ Use optimized lists
<FlatList
  data={transactions}
  keyExtractor={(item) => item.hash}
  renderItem={({ item }) => <TransactionCard tx={item} />}
  showsVerticalScrollIndicator={false}
/>

// ❌ Avoid rendering all items at once
<ScrollView>
  {transactions.map(tx => <TransactionCard key={tx.hash} tx={tx} />)}
</ScrollView>
```

### Image Loading

```typescript
// Use Expo Image for optimization
import { Image } from "expo-image";

<Image 
  source={{ uri: tokenImageUrl }}
  style={{ width: 24, height: 24 }}
  cachePolicy="memory-disk"
/>
```

---

## Testing

Currently no tests. Add:
- Component tests (React Native Testing Library)
- Hook tests (React Hooks Testing)
- E2E tests (Detox)

---

## Dark/Light Mode Implementation

### Theme Context

```typescript
// lib/themeContext.tsx
const ThemeProvider: React.FC = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  
  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeContext);
```

### Usage in Components

```typescript
const { darkMode } = useThemeMode();

<View className={`${darkMode ? "bg-black" : "bg-white"}`}>
  <Text className={`${darkMode ? "text-white" : "text-black"}`}>
    Text
  </Text>
</View>
```

---

## Common Patterns

### Real-time Wallet Search

```typescript
const [inputAddress, setInputAddress] = useState("");
const [searchedAddress, setSearchedAddress] = useState("");

const { data, isLoading, error, refetch } = useWalletTransactions(searchedAddress);

const handleSearch = () => {
  if (inputAddress === searchedAddress) {
    refetch(); // Refresh same wallet
  } else {
    setSearchedAddress(inputAddress); // New search triggers query
  }
};
```

### Transaction List Display

```typescript
const timeAgo = (dateString: string) => {
  const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

<Text className="text-gray-500 text-sm">{timeAgo(tx.date)}</Text>
```

---

## Adding New Screens

Checklist:
- [ ] Create file in `app/(tabs)/newscreen.tsx`
- [ ] Export default component
- [ ] Add tab navigation config in `_layout.tsx`
- [ ] Create corresponding hook (if needed)
- [ ] Create corresponding service (if needed)
- [ ] Add types to `types/`
- [ ] Test navigation
- [ ] Update this document

---

## Adding New Components

Checklist:
- [ ] Create file in `components/ComponentName.tsx`
- [ ] Keep component focused (single responsibility)
- [ ] Use Tailwind classes only
- [ ] Export as named or default (consistent)
- [ ] Add PropTypes or TypeScript types
- [ ] Test in multiple screens
- [ ] Document in comments if complex

---

## Dependencies

### Core Dependencies
- `expo` - React Native runtime
- `expo-router` - Navigation
- `react-native` - Framework
- `react-native-reanimated` - Animations
- `nativewind` - Tailwind CSS
- `@tanstack/react-query` - Server state
- `@clerk/expo` - OAuth
- `axios` - HTTP client

### Adding New Packages

Before adding:
1. Check if Expo has built-in alternative
2. Verify React Native compatibility
3. Check bundle impact
4. Test on both iOS and Android

---

## Environment Variables

### `.env.local`

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
EXPO_PUBLIC_API_URL=http://localhost:8787/api
```

### Usage

```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL;
```

---

## Deployment (EAS Build)

### iOS
```bash
eas build --platform ios
eas submit --platform ios
```

### Android
```bash
eas build --platform android
eas submit --platform android
```

See `eas.json` for build configuration.

---

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Check for breaking changes
- Monitor bundle size
- Test on real devices
- Update documentation

### Performance Monitoring
- Use React DevTools
- Check animation FPS
- Monitor memory usage
- Profile with Lighthouse
