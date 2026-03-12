import AsyncStorage from "@react-native-async-storage/async-storage";

const DARK_KEY = "dark_mode";
const NOTIF_KEY = "notifications_enabled";

/* ---------------- DARK MODE ---------------- */

export const getDarkMode = async () => {
  const value = await AsyncStorage.getItem(DARK_KEY);
  return value === "true";
};

export const setDarkMode = async (value: boolean) => {
  await AsyncStorage.setItem(DARK_KEY, value.toString());
};

/* ---------------- NOTIFICATIONS ---------------- */

export const getNotifications = async () => {
  const value = await AsyncStorage.getItem(NOTIF_KEY);
  return value === "true";
};

export const setNotifications = async (value: boolean) => {
  await AsyncStorage.setItem(NOTIF_KEY, value.toString());
};