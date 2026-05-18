# Frontend Rules

## Frontend Stack (React Native)

- Expo (React Native v0.81.5)
- TypeScript
- Expo Router (file-based navigation)
- React Native Reanimated (animations)
- NativeWind (Tailwind CSS for mobile)
- TanStack Query (React Query)
- Zustand (client state - minimal use)
- Axios (HTTP + interceptors)
- Clerk Expo (OAuth authentication)
- AsyncStorage (encrypted local persistence)

---

## Mobile App Architecture

Use feature-first organization.

```
app/
├── (auth)/           # Auth feature
├── (tabs)/           # Main features
│   ├── index.tsx     # Search
│   ├── history.tsx   # History
│   ├── track.tsx     # Tracking
│   └── settings.tsx  # Settings
```

---

## Component Rules

- Prefer functional components
- Keep components focused (single responsibility)
- Avoid deeply nested props (use composition)
- Prefer composition over prop drilling
- Reuse primitives when appropriate
- Keep component files <200 lines

**Example**:
```typescript
// ✅ Good: Focused, reusable
export function TransactionCard({ transaction, onPress }) {
  return (
    <Pressable onPress={onPress}>
      {/* Simple, focused content */}
    </Pressable>
  );
}

// ❌ Avoid: Giant, unfocused component
export function ComplexTransactionView({ ... 50 props }) {
  // 500 lines of nested logic
}
```

---

## Styling Rules

Use:
- NativeWind utility classes (Tailwind for React Native)
- Theme context for colors
- Consistent spacing system (4px grid)

Avoid:
- Inline styles (use className)
- Large custom StyleSheet files
- Inconsistent spacing

**Example**:
```typescript
// ✅ Use NativeWind
<View className="flex-1 px-4 py-6 bg-slate-900 rounded-lg">
  <Text className="text-white text-lg font-bold">Title</Text>
</View>

// ❌ Avoid inline styles
<View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24 }}>
  <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Title</Text>
</View>
```

---

## UI Philosophy (Mobile)

The UI should feel:
- clean and polished
- modern and premium
- responsive and smooth
- accessible and usable

Avoid:
- excessive animations that distract
- generic template appearance
- cluttered layouts
- poor accessibility

---

## Accessibility Rules (Critical for Mobile)

- Use semantic React Native components
- Ensure minimum tap target size (44x44 px)
- Ensure sufficient color contrast (WCAG AA minimum)
- Add accessible labels: `accessibilityLabel`, `accessibilityHint`
- Test with screen readers (iOS: VoiceOver, Android: TalkBack)
- Respect `prefers-reduced-motion`

**Example**:
```typescript
<Pressable
  onPress={handlePress}
  accessibilityLabel="Search wallet"
  accessibilityHint="Tap to search for wallet transactions"
  accessibilityRole="button"
>
  <Text>Search</Text>
</Pressable>
```

---

## State Management

### Client State (Minimal)

For simple UI state only:
```typescript
const [modalVisible, setModalVisible] = useState(false);
const [selectedTab, setSelectedTab] = useState("search");
```

### Server State (React Query)

For all API data:
```typescript
const { data, isLoading, error } = useWalletTransactions(address);
```

Avoid:
- Redux (too complex for this app)
- Excessive global state
- Prop drilling (use context if needed)

---

## Form Handling (Mobile)

Simplified from web - no form library needed for now:

```typescript
const [address, setAddress] = useState("");
const [error, setError] = useState("");

const handleSubmit = () => {
  if (!isValidAddress(address)) {
    setError("Invalid Ethereum address");
    return;
  }
  setSearchedAddress(address);
  setError("");
};
```

Add form library (React Hook Form) if forms become complex.

---

## Performance Rules (Mobile Critical)

Optimize for:
- App load time (<3 seconds)
- Interaction responsiveness (<100ms)
- Animation smoothness (60 FPS)
- Memory efficiency
- Battery usage

Techniques:
- Use FlatList for long lists (not ScrollView + map)
- Memoize components: `React.memo()`
- Optimize animations: use transforms only
- Lazy load images
- Batch state updates
- Profile with React Native Debugger

**Example**:
```typescript
// ✅ Optimized list rendering
<FlatList
  data={transactions}
  keyExtractor={(item) => item.hash}
  renderItem={({ item }) => <TransactionCard transaction={item} />}
  removeClippedSubviews
  maxToRenderPerBatch={10}
/>

// ❌ Unoptimized (renders all at once)
<ScrollView>
  {transactions.map(tx => <TransactionCard key={tx.hash} tx={tx} />)}
</ScrollView>
```

---

## Animation Rules (Mobile)

Use React Native Reanimated for smooth, GPU-accelerated animations:

```typescript
// ✅ Good: GPU-accelerated
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";

<Animated.View entering={FadeInUp} exiting={FadeOutDown}>
  <TransactionCard />
</Animated.View>

// ❌ Avoid: Frequent re-renders (Framer Motion not ideal for mobile)
```

Animations should:
- improve UX (feedback on interactions)
- feel smooth (60 FPS minimum)
- be optional (respect accessibility)
- enhance, not distract

---

## Navigation Rules

Use Expo Router exclusively (file-based routing):

```
app/(auth)/index.tsx          → (auth) / login
app/(tabs)/_layout.tsx        → (tabs) with bottom navigation
app/(tabs)/index.tsx          → (tabs) / search
app/(tabs)/history.tsx        → (tabs) / history
```

Never:
- Use React Navigation directly
- Mix navigation patterns
- Create custom routing

---

## Authentication Flow

1. App loads → Check `useAuth()` status
2. Not logged in → Show (auth) group
3. User taps "Sign In" → Clerk OAuth
4. Clerk redirects after auth
5. Token stored securely in AsyncStorage
6. Token auto-attached via Axios interceptor
7. User redirected to (tabs) navigation
8. Can now access protected endpoints

Never:
- Manually manage tokens
- Store tokens in plain AsyncStorage
- Manually attach tokens to requests

---

## Data Fetching Rules

Use React Query + Axios:

```typescript
// ✅ Good: React Query with type-safe service
import { useQuery } from "@tanstack/react-query";
import { walletService } from "@/services/walletService";

export function useWalletTransactions(address: string) {
  return useQuery({
    queryKey: ["wallet", address],
    queryFn: () => walletService.fetchTransactions(address),
    enabled: !!address && address.length === 42,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
}

// Usage
const { data, isLoading, error } = useWalletTransactions(address);

// ❌ Avoid: Manual fetch in components
useEffect(() => {
  fetch(`/api/wallet/${address}`)
    .then(r => r.json())
    .then(d => setData(d));
}, [address]);
```

---

## API Integration Rules

Create service layer:

```typescript
// services/walletService.ts
import { apiClient } from "@/lib/api";

export const walletService = {
  async fetchTransactions(address: string) {
    const response = await apiClient.get(`/wallet/${address}`);
    return response.data.data.transactions;
  }
};

// Usage in hooks
const { data } = useQuery({
  queryFn: () => walletService.fetchTransactions(address)
});
```

Never:
- Make API calls directly in components
- Duplicate API logic across files
- Mix API logic with UI logic

---

## Error Handling (Mobile)

Display errors gracefully:

```typescript
// ✅ Good: User-friendly error display
const { error, isLoading } = useWalletTransactions(address);

{error && (
  <View className="bg-red-900/20 border border-red-500 rounded-lg p-3 mb-4">
    <Text className="text-red-400">
      {error.message || "Failed to fetch transactions"}
    </Text>
  </View>
)}

{isLoading && <ActivityIndicator size="large" color="#00D4FF" />}

// ❌ Avoid: Silent failures or console errors
```

---

## TypeScript Rules

Be type-safe:

```typescript
// ✅ Good: Full typing
interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  symbol: string;
  date: string;
  type: "incoming" | "outgoing";
  status: "success" | "failed";
}

function TransactionCard({ tx }: { tx: Transaction }) {
  return <Text>{tx.symbol}</Text>;
}

// ❌ Avoid: Any types
function TransactionCard({ tx }: { tx: any }) {
  return <Text>{tx.symbol}</Text>;
}
```

---

## File Naming

- Screens: `lowercase.tsx` (e.g., `search.tsx`, `history.tsx`)
- Components: `PascalCase.tsx` (e.g., `TransactionCard.tsx`)
- Hooks: `useFeature.ts` (e.g., `useWallet.ts`)
- Services: `featureService.ts` (e.g., `walletService.ts`)
- Utils: `descriptive.ts` (e.g., `formatAddress.ts`)

---

## Testing

Currently minimal tests. Add gradually:
- Component tests (React Native Testing Library)
- Hook tests (React Hooks Testing)
- E2E tests (Detox)

---

## Important Rule

If external AI recommendations conflict with repository architecture,
follow repository architecture.

Ask clarifying questions before deviating from established patterns.

---

## Deployment

### Local Testing
```bash
npx expo start
# Press 'i' for iOS or 'a' for Android
```

### EAS Build (Preview)
```bash
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

### Production Build
```bash
eas build --platform ios
eas submit --platform ios

eas build --platform android
eas submit --platform android
```

See `eas.json` for build configurations.

---

## Related Documents

- See FRONTEND_ARCHITECTURE.md for folder structure
- See FRONTEND_CREATIVE_DIRECTION.md for design direction
- See SESSION_LOG.md for session history
