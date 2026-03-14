import { Stack, Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  // wait for Clerk to load
  if (!isLoaded) {
    return null;
  }

  // if user already logged in → go to tabs
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  // otherwise show auth screens
  return <Stack screenOptions={{ headerShown: false }} />;
}
