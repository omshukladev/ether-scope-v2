import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import { useThemeMode } from "@/lib/themeContext";

export default function TabsLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { darkMode } = useThemeMode();

  // wait until Clerk loads session
  if (!isLoaded) return null;

  // block access if user not logged in
  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: darkMode ? "#6b7280" : "#9ca3af",

        tabBarStyle: {
          backgroundColor: darkMode ? "#000000" : "#ffffff",
          borderTopColor: darkMode ? "#111827" : "#e5e7eb",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="track"
        options={{
          title: "Track",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}