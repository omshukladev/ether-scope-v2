import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";

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

import { useThemeMode } from "@/lib/themeContext";
import { fetchWalletTransactions } from "@/services/wallet";

/* ---------- REQUIRED FOR FOREGROUND NOTIFICATIONS ---------- */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Track() {
  const { darkMode } = useThemeMode();
  const [input, setInput] = useState("");

  const lastSeenTx = useRef<Record<string, string>>({});

  const { data, isLoading } = useTrackedWallets();
  const addWallet = useAddTrackedWallet();
  const deleteWallet = useDeleteTrackedWallet();

  const wallets = useMemo(() => data ?? [], [data]);

  /* ---------- ADD WALLET ---------- */

  const handleAddWallet = () => {
    if (!input) return;

    addWallet.mutate(input.trim());
    setInput("");
  };

  /* ---------- SEND NOTIFICATION ---------- */

  const sendNotification = async (wallet: string, tx: any) => {
    const direction = tx.type === "incoming" ? "Received" : "Sent";
    const shortWallet = `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "EtherScope",
        body: `${shortWallet} ${direction} ${tx.amount} ${tx.symbol}`,
      },
      trigger: null,
    });
  };

  /* ---------- POLLING ---------- */

  useEffect(() => {
    if (wallets.length === 0) return;

    const interval = setInterval(async () => {
      for (const wallet of wallets) {
        try {
          const data = await fetchWalletTransactions(wallet.wallet_address);
          const latest = data.transactions?.[0];

          if (!latest) continue;

          const lastHash = lastSeenTx.current[wallet.wallet_address];

          if (!lastHash) {
            lastSeenTx.current[wallet.wallet_address] = latest.hash;
            continue;
          }

          if (lastHash !== latest.hash) {
            lastSeenTx.current[wallet.wallet_address] = latest.hash;

            await sendNotification(wallet.wallet_address, latest);
          }
        } catch (err) {
          console.log("Polling error:", err);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [wallets]);

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
