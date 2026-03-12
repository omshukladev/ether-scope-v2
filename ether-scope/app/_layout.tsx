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

/* ---------------- KEEP NATIVE SPLASH VISIBLE ---------------- */

SplashScreen.preventAutoHideAsync();

/* ---------------- CONFIG ---------------- */

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const queryClient = new QueryClient();

/* ---------------- APP PROVIDERS ---------------- */

function AppProviders() {
  const { getToken } = useAuth();
  const { darkMode } = useThemeMode();

  useEffect(() => {
    setClerkGetToken(getToken);
  }, [getToken]);

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

/* ---------------- ROOT LAYOUT ---------------- */

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // give time for splash animation
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } finally {
        setReady(true);
        await SplashScreen.hideAsync();
      }
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
