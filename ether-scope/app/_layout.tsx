import "../global.css";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { customTheme } from "../theme/theme";
import { ClerkProvider } from '@clerk/expo'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!



export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}