import Constants from "expo-constants";
import { Platform } from "react-native";

type NotificationsModule = typeof import("expo-notifications");

let notificationsModulePromise: Promise<NotificationsModule | null> | null =
  null;

const isExpoGo = Constants.executionEnvironment === "storeClient";
const isExpoGoAndroid = isExpoGo && Platform.OS === "android";

const getNotificationsModule =
  async (): Promise<NotificationsModule | null> => {
    if (isExpoGoAndroid) {
      // Android Expo Go does not support remote notifications.
      return null;
    }

    if (!notificationsModulePromise) {
      notificationsModulePromise = import("expo-notifications").catch(
        () => null,
      );
    }

    return notificationsModulePromise;
  };

export const requestNotificationPermission = async () => {
  const Notifications = await getNotificationsModule();

  if (!Notifications) {
    return false;
  }

  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  if (status === "granted" && Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("wallet-alerts", {
      name: "Wallet Alerts",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 200, 250],
      lightColor: "#3b82f6",
      sound: "default",
    });
  }

  return status === "granted";
};

export const configureNotificationHandler = async () => {
  const Notifications = await getNotificationsModule();

  if (!Notifications) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
};

export const scheduleWalletNotification = async (
  wallet: string,
  tx: { type?: string; amount?: string | number; symbol?: string },
) => {
  const Notifications = await getNotificationsModule();

  if (!Notifications) {
    return;
  }

  const direction = tx.type === "incoming" ? "Received" : "Sent";
  const shortWallet = `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  const currentBadge = await Notifications.getBadgeCountAsync();
  const nextBadge = Math.max(1, currentBadge + 1);

  await Notifications.setBadgeCountAsync(nextBadge);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "EtherScope",
      body: `${shortWallet} ${direction} ${tx.amount ?? ""} ${tx.symbol ?? ""}`.trim(),
      sound: "default",
      badge: nextBadge,
    },
    trigger: Platform.OS === "android" ? { channelId: "wallet-alerts" } : null,
  });
};

export const scheduleInfoNotification = async (title: string, body: string) => {
  const Notifications = await getNotificationsModule();

  if (!Notifications) {
    return;
  }

  const currentBadge = await Notifications.getBadgeCountAsync();
  const nextBadge = Math.max(1, currentBadge + 1);

  await Notifications.setBadgeCountAsync(nextBadge);

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
      badge: nextBadge,
    },
    trigger: Platform.OS === "android" ? { channelId: "wallet-alerts" } : null,
  });
};

export const isNotificationFeatureAvailable = () => !isExpoGoAndroid;
