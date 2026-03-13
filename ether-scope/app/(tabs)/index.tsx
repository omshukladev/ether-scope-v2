import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useWalletTransactions } from "@/hooks/useWallet";
import { useThemeMode } from "@/lib/themeContext";
import TokenIcon from "@/components/TokenIcon";

import HistoryCardMotion from "@/components/HistoryCardMotion";
import NeonBadge from "@/components/NeonBadge";
import DarkVeilBackground from "@/components/DarkVeilBackground";
import AnimatedModal from "@/components/AnimatedModal";

export default function Home() {
  const { darkMode } = useThemeMode();

  const [inputAddress, setInputAddress] = useState("");
  const [searchedAddress, setSearchedAddress] = useState("");
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [scanPressed, setScanPressed] = useState(false);

  const { data, isLoading, error, refetch } =
    useWalletTransactions(searchedAddress);

  const transactions = data?.transactions ?? [];

  const handleSearch = () => {
    const addr = inputAddress.trim();

    if (!addr) return;

    if (addr.toLowerCase() === searchedAddress.toLowerCase()) {
      refetch();
    } else {
      setSearchedAddress(addr);
    }

    setInputAddress("");
  };

  const timeAgo = (dateString: string) => {
    const timestamp = new Date(dateString).getTime();
    const diff = Math.floor((Date.now() - timestamp) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

    return `${Math.floor(diff / 86400)} day ago`;
  };

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
          {/* HEADER */}
          <Text
            className={`text-3xl font-bold mt-6 ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Wallet Explorer
          </Text>

          <Text
            className={`mt-2 text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Enter any Ethereum wallet address to track activity
          </Text>

          {/* SEARCH INPUT */}
          <TextInput
            value={inputAddress}
            onChangeText={setInputAddress}
            placeholder="0x... or vitalik.eth"
            placeholderTextColor={darkMode ? "#6B6B70" : "#9CA3AF"}
            className={`mt-6 p-4 rounded-2xl ${
              darkMode ? "bg-[#1A1A1D] text-white" : "bg-gray-100 text-black"
            }`}
          />

          {/* SEARCH BUTTON */}
          <Pressable
            onPress={handleSearch}
            onPressIn={() => setScanPressed(true)}
            onPressOut={() => setScanPressed(false)}
            className="bg-blue-500 mt-4 py-4 rounded-2xl items-center w-full"
            style={[styles.scanButton, scanPressed && styles.scanButtonPressed]}
            android_ripple={{ color: "rgba(255,255,255,0.12)", borderless: false }}
          >
            <Text className="text-white font-semibold text-base">
              Scan Network
            </Text>
          </Pressable>

          {/* LOADING */}
          {isLoading && (
            <View className="mt-10 items-center">
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
          )}

          {/* ERROR */}
          {error && (
            <Text className="text-red-400 mt-6">
              Failed to fetch transactions.
            </Text>
          )}

          {/* TRANSACTIONS */}
          {!isLoading && transactions.length > 0 && (
            <View className="mt-10">
              {/* SECTION HEADER */}
              <View className="flex-row justify-between items-center mb-4">
                <Text
                  className={`text-sm font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  RECENT TRANSACTIONS
                </Text>

                <NeonBadge label="LIVE" color="#3b82f6" />
              </View>

              {transactions.map((tx: any, index: number) => {
                const isReceived =
                  tx.to?.toLowerCase() === searchedAddress?.toLowerCase();

                const isSuccess = tx.status === "success";

                const directionLabel = isReceived ? "RECEIVED" : "SENT";

                return (
                  <HistoryCardMotion key={`${tx.hash}-${index}`} index={index}>
                    <TouchableOpacity
                      onPress={() => setSelectedTx(tx)}
                      className={`rounded-[18px] px-5 py-4 border ${
                        darkMode
                          ? ""
                          : "bg-white border-gray-200"
                      }`}
                      style={darkMode ? styles.darkCard : undefined}
                    >
                      {/* TOP ROW */}
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                          <TokenIcon symbol={tx.symbol} />

                          <View>
                            <Text
                              className={`font-semibold ${
                                darkMode ? "text-white" : "text-black"
                              }`}
                            >
                              {tx.symbol ?? "Token"}
                            </Text>

                            <Text className="text-gray-400 text-xs">
                              {tx.hash?.slice(0, 12)}...
                            </Text>
                          </View>
                        </View>

                        <Text
                          className={`font-semibold ${
                            isReceived ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {isReceived ? "+" : "-"}
                          {tx.amount?.toLocaleString?.()} {tx.symbol}
                        </Text>
                      </View>

                      {/* FOOTER */}
                      <View className="flex-row justify-between mt-4">
                        <View className="flex-row gap-2">
                          <NeonBadge
                            label={directionLabel}
                            color={isReceived ? "#38bdf8" : "#fb923c"}
                          />

                          <NeonBadge
                            label={isSuccess ? "SUCCESS" : "FAILED"}
                            color={isSuccess ? "#22c55e" : "#ef4444"}
                          />
                        </View>

                        <Text className="text-gray-500 text-xs tracking-wide">
                          {tx.date ? timeAgo(tx.date) : ""}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </HistoryCardMotion>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* MODAL */}
        <Modal visible={!!selectedTx} transparent animationType="none">
          <View
            className="flex-1 justify-center px-6"
            style={{
              backgroundColor: darkMode
                ? "rgba(4, 8, 20, 0.58)"
                : "rgba(238, 244, 255, 0.56)",
            }}
          >
            <AnimatedModal darkMode={darkMode}>
              <View className="rounded-3xl">
                <View className="flex-row justify-end">
                  <Pressable onPress={() => setSelectedTx(null)}>
                    <Text className="text-blue-400 text-lg font-bold">✕</Text>
                  </Pressable>
                </View>

                {selectedTx && (
                  <>
                    <Text
                      className={`text-2xl font-bold mb-4 ${
                        darkMode ? "text-white" : "text-black"
                      }`}
                    >
                      Transaction Details
                    </Text>

                    <Text className="text-gray-400">Hash</Text>
                    <Text
                      className={`mb-3 ${darkMode ? "text-white" : "text-black"}`}
                    >
                      {selectedTx.hash}
                    </Text>

                    <Text className="text-gray-400">From</Text>
                    <Text
                      className={`mb-3 ${darkMode ? "text-white" : "text-black"}`}
                    >
                      {selectedTx.from}
                    </Text>

                    <Text className="text-gray-400">To</Text>
                    <Text
                      className={`mb-3 ${darkMode ? "text-white" : "text-black"}`}
                    >
                      {selectedTx.to}
                    </Text>

                    <Text className="text-gray-400">Amount</Text>
                    <Text
                      className={`mb-3 ${darkMode ? "text-white" : "text-black"}`}
                    >
                      {selectedTx.amount?.toLocaleString?.()}{" "}
                      {selectedTx.symbol}
                    </Text>

                    <Text className="text-gray-400">Date</Text>
                    <Text
                      className={`mb-3 ${darkMode ? "text-white" : "text-black"}`}
                    >
                      {selectedTx.date
                        ? new Date(selectedTx.date).toLocaleString()
                        : ""}
                    </Text>

                    <Text className="text-gray-400">Status</Text>
                    <Text
                      className={
                        selectedTx.status === "success"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {selectedTx.status?.toUpperCase()}
                    </Text>
                  </>
                )}
              </View>
            </AnimatedModal>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    shadowColor: "#3b82f6",
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    transform: [{ scale: 1 }],
  },
  scanButtonPressed: {
    opacity: 0.88,
    shadowOpacity: 0.14,
    transform: [{ scale: 0.985 }],
  },
  darkCard: {
    backgroundColor: "rgba(11, 16, 30, 0.58)",
    borderColor: "rgba(111, 162, 232, 0.3)",
    shadowColor: "#0A4AA5",
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
});
