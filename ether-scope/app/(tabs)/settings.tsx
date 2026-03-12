import { View, Text, Pressable, Image, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser, useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";

import { useThemeMode } from "@/lib/themeContext";

import { getNotifications, setNotifications } from "@/lib/settingsStore";

import { requestNotificationPermission } from "@/lib/notifications";

export default function Settings() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const { darkMode, toggleTheme } = useThemeMode();

  const [notifications, setNotif] = useState(false);

  /* ---------------- LOAD NOTIFICATION SETTING ---------------- */

  useEffect(() => {
    const load = async () => {
      setNotif(await getNotifications());
    };

    load();
  }, []);

  /* ---------------- NOTIFICATIONS ---------------- */

  const toggleNotifications = async () => {
    const newValue = !notifications;

    if (newValue) {
      const granted = await requestNotificationPermission();

      if (!granted) {
        alert("Notifications permission denied");
        return;
      }
    }

    setNotif(newValue);
    await setNotifications(newValue);
  };

  return (
    <SafeAreaView
      className={`flex-1 px-5 ${darkMode ? "bg-black" : "bg-white"}`}
    >
      {/* TITLE */}
      <Text
        className={`text-3xl font-bold mt-6 ${
          darkMode ? "text-white" : "text-black"
        }`}
      >
        Settings
      </Text>

      {/* PROFILE */}
      <View
        className={`rounded-3xl p-6 items-center mt-6 ${
          darkMode ? "bg-[#14171c]" : "bg-gray-100"
        }`}
      >
        <Image
          source={{ uri: user?.imageUrl }}
          className="w-24 h-24 rounded-full"
        />

        <Text
          className={`text-lg font-semibold mt-4 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          {user?.fullName ?? user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      {/* PREFERENCES */}
      <View
        className={`rounded-3xl p-6 mt-6 ${
          darkMode ? "bg-[#14171c]" : "bg-gray-100"
        }`}
      >
        {/* DARK MODE */}
        <View className="flex-row justify-between items-center mb-5">
          <View>
            <Text
              className={`font-semibold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Dark Mode
            </Text>

            <Text className="text-gray-400 text-xs">
              Optimized for OLED screens
            </Text>
          </View>

          <Switch value={darkMode} onValueChange={toggleTheme} />
        </View>

        {/* NOTIFICATIONS */}
        <View className="flex-row justify-between items-center">
          <View>
            <Text
              className={`font-semibold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Notifications
            </Text>

            <Text className="text-gray-400 text-xs">
              Alerts for tracked wallets
            </Text>
          </View>

          <Switch value={notifications} onValueChange={toggleNotifications} />
        </View>
      </View>

      {/* LOGOUT */}
      <Pressable
        onPress={() => signOut()}
        className="border border-blue-500 rounded-2xl py-4 items-center mt-8"
      >
        <Text className="text-blue-500 font-semibold text-lg">
          Logout Account
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
