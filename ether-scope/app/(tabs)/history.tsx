import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";

import { useWalletHistory } from "@/hooks/useWallet";
import { useThemeMode } from "@/lib/themeContext";
import TokenIcon from "@/components/TokenIcon";

export default function History() {
  const { darkMode } = useThemeMode();

  const { data = [], isLoading } = useWalletHistory();

  const copyAddress = async (addr: string) => {
    await Clipboard.setStringAsync(addr);
    alert("Address copied");
  };

  const shorten = (addr: string) => addr.slice(0, 6) + "..." + addr.slice(-4);

  const timeAgo = (timestamp: number) => {
    const diff = Math.floor(Date.now() / 1000) - timestamp;

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;

    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <SafeAreaView
      className={`flex-1 px-4 ${darkMode ? "bg-black" : "bg-white"}`}
    >
      <Text
        className={`text-3xl font-bold mt-6 ${
          darkMode ? "text-white" : "text-black"
        }`}
      >
        Activity Log
      </Text>

      <Text className="text-gray-400 mt-2">
        Manage your past wallet searches
      </Text>

      <ScrollView className="mt-6">
        {isLoading && <Text className="text-gray-400">Loading history...</Text>}

        {data.map((item: any, index: number) => (
          <View
            key={index}
            className={`rounded-2xl p-5 mb-4 border ${
              darkMode
                ? "bg-[#151518] border-[#2A2A2E]"
                : "bg-white border-gray-200"
            }`}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <TokenIcon symbol="ETH" />

                <View>
                  <Text
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {shorten(item.wallet_address)}
                  </Text>

                  <Text className="text-gray-400 text-xs">Ethereum</Text>
                </View>
              </View>

              <Pressable
                onPress={() => copyAddress(item.wallet_address)}
                className="px-3 py-1 rounded-lg bg-blue-500/20"
              >
                <Text className="text-blue-400 text-xs font-semibold">
                  COPY
                </Text>
              </Pressable>
            </View>

            <View className="flex-row justify-between mt-3">
              <Text className="text-gray-500 text-xs">
                {timeAgo(item.created_at)}
              </Text>

              <Text className="text-gray-500 text-xs">
                {new Date(item.created_at * 1000).toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
