import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import DarkVeilBackground from "@/components/DarkVeilBackground";
import NeonBadge from "@/components/NeonBadge";
import TrackInputSection from "@/components/tabs/track/TrackInputSection";
import TrackedWalletCard from "@/components/tabs/track/TrackedWalletCard";
import { trackStyles } from "@/components/tabs/track/trackStyles";

import {
  useAddTrackedWallet,
  useDeleteTrackedWallet,
  useTrackedWallets,
} from "@/hooks/useTracking";

import {
  configureNotificationHandler,
  scheduleInfoNotification,
  scheduleWalletNotification,
} from "@/lib/notifications";
import { getNotifications } from "@/lib/settingsStore";
import { useThemeMode } from "@/lib/themeContext";
import { fetchWalletTransactions } from "@/services/wallet";

export default function Track() {
  const { darkMode } = useThemeMode();
  const [input, setInput] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const lastSeenEventIds = useRef<Record<string, string[]>>({});

  const { data, isLoading } = useTrackedWallets();
  const addWallet = useAddTrackedWallet();
  const deleteWallet = useDeleteTrackedWallet();

  const wallets = useMemo(() => data ?? [], [data]);

  /* ---------- ADD WALLET ---------- */

  const handleAddWallet = async () => {
    if (!input) return;

    const address = input.trim().toLowerCase();

    try {
      await addWallet.mutateAsync(address);

      if (notificationsEnabled) {
        await scheduleInfoNotification(
          "EtherScope",
          `Tracking enabled for ${address.slice(0, 6)}...${address.slice(-4)}`,
        );
      }
    } catch (err) {
      console.log("Add wallet error:", err);
    }

    setInput("");
  };

  /* ---------- SEND NOTIFICATION ---------- */

  useEffect(() => {
    configureNotificationHandler();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let alive = true;

      const loadNotificationState = async () => {
        const enabled = await getNotifications();

        if (alive) {
          setNotificationsEnabled(enabled);
        }
      };

      loadNotificationState();

      return () => {
        alive = false;
      };
    }, []),
  );

  /* ---------- POLLING ---------- */

  useEffect(() => {
    if (wallets.length === 0) return;

    const buildEventId = (tx: any) => {
      return [
        tx.hash ?? "",
        tx.from ?? "",
        tx.to ?? "",
        tx.symbol ?? "",
        tx.amount ?? "",
        tx.date ?? "",
      ].join("|");
    };

    const interval = setInterval(async () => {
      for (const wallet of wallets) {
        try {
          const data = await fetchWalletTransactions(wallet.wallet_address);
          const transactions = data.transactions ?? [];

          if (transactions.length === 0) continue;

          const currentIds = transactions.map(buildEventId);
          const previousIds = lastSeenEventIds.current[wallet.wallet_address];

          // First observation seeds cache; no backfilled notifications.
          if (!previousIds) {
            lastSeenEventIds.current[wallet.wallet_address] = currentIds;
            continue;
          }

          const previousSet = new Set(previousIds);
          const newTransactions = transactions.filter(
            (tx: any) => !previousSet.has(buildEventId(tx)),
          );

          lastSeenEventIds.current[wallet.wallet_address] = currentIds;

          if (newTransactions.length > 0 && notificationsEnabled) {
            // Send oldest->newest to keep notification order natural.
            for (const tx of [...newTransactions].reverse()) {
              await scheduleWalletNotification(wallet.wallet_address, tx);
            }
          }
        } catch (err) {
          console.log("Polling error:", err);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [wallets, notificationsEnabled]);

  /* ---------- UI ---------- */

  return (
    <View className="flex-1">
      <DarkVeilBackground />

      <SafeAreaView
        className={`flex-1 px-4 ${darkMode ? "bg-transparent" : "bg-white"}`}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
        >
          <Text
            className={`text-3xl font-bold mt-6 ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Track Wallets
          </Text>

          <Text
            className={`mt-2 text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Add wallets to monitor live incoming and outgoing activity
          </Text>

          <TrackInputSection
            darkMode={darkMode}
            input={input}
            onChangeInput={setInput}
            onAddWallet={handleAddWallet}
            isPending={addWallet.isPending}
          />

          <View className="mt-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className={`text-sm font-semibold ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                TRACKED WALLETS
              </Text>

              <NeonBadge label={`${wallets.length} ACTIVE`} color="#3b82f6" />
            </View>

            {isLoading && (
              <Text className="text-gray-400">Loading tracked wallets...</Text>
            )}

            {!isLoading && wallets.length === 0 && (
              <View
                className={`rounded-2xl p-4 border ${
                  darkMode ? "" : "bg-gray-50 border-gray-200"
                }`}
                style={darkMode ? trackStyles.darkCard : undefined}
              >
                <Text className="text-gray-400 text-sm">
                  No wallets added yet. Add your first wallet above.
                </Text>
              </View>
            )}

            {wallets.map((item: any, index: number) => (
              <TrackedWalletCard
                key={item.wallet_address}
                walletAddress={item.wallet_address}
                darkMode={darkMode}
                index={index}
                onDelete={(address) => deleteWallet.mutate(address)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
