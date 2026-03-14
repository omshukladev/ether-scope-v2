import "../global.css";
import { Stack } from "expo-router";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import * as WebBrowser from "expo-web-browser";
import { ThemeProvider, useThemeMode } from "@/lib/themeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setClerkGetToken } from "@/lib/api";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import Splash from "./splash";

WebBrowser.maybeCompleteAuthSession();
SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const queryClient = new QueryClient();

function AppProviders() {
  const { getToken, isLoaded } = useAuth();
  const { darkMode } = useThemeMode();

  useEffect(() => {
    if (!isLoaded) return;
    setClerkGetToken(getToken);
  }, [getToken, isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: darkMode ? "#000000" : "#ffffff",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setReady(true);
      await SplashScreen.hideAsync();
    }

    prepare();
  }, []);

  if (!ready) {
    return <Splash />;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ThemeProvider>
        <AppProviders />
      </ThemeProvider>
    </ClerkProvider>
  );
}
