import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";

import { useWalletHistory } from "@/hooks/useWallet";
import { useThemeMode } from "@/lib/themeContext";
import TokenIcon from "@/components/TokenIcon";

import HistoryCardMotion from "@/components/HistoryCardMotion";
import DarkVeilBackground from "@/components/DarkVeilBackground";
import NeonBadge from "@/components/NeonBadge";

export default function History() {
  const { darkMode } = useThemeMode();
  const { data = [], isLoading } = useWalletHistory();

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyAddress = async (addr: string, index: number) => {
    await Clipboard.setStringAsync(addr);

    setCopiedIndex(index);

    setTimeout(() => {
      setCopiedIndex(null);
    }, 3000);
  };

  const shorten = (addr: string) => addr.slice(0, 6) + "..." + addr.slice(-4);

  const timeAgo = (timestamp: number) => {
    const diff = Math.floor(Date.now() / 1000) - timestamp;

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

    return `${Math.floor(diff / 86400)} day ago`;
  };

  return (
    <View className="flex-1">
      {/* Dark animated background */}
      <DarkVeilBackground />

      <SafeAreaView
        className={`flex-1 px-4 ${darkMode ? "bg-black" : "bg-white"}`}
      >
        {/* HEADER */}
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

        <ScrollView
          className="mt-6"
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
        >
          {isLoading && (
            <Text className="text-gray-400">Loading history...</Text>
          )}

          {data.map((item: any, index: number) => {
            const copied = copiedIndex === index;
            const historyKey =
              item?.id?.toString?.() ??
              `${item.wallet_address}-${item.created_at}-${index}`;

            return (
              <HistoryCardMotion key={historyKey} index={index}>
                <View
                  className={`rounded-[18px] px-5 py-4 border ${
                    darkMode
                      ? "bg-[#11141C] border-[#2D3F5A]"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {/* TOP ROW */}
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

                    {/* COPY BUTTON */}
                    <Pressable
                      onPress={() => copyAddress(item.wallet_address, index)}
                    >
                      <NeonBadge
                        label={copied ? "COPIED" : "COPY"}
                        color={copied ? "#22c55e" : "#3b82f6"}
                        flash={copied}
                      />
                    </Pressable>
                  </View>

                  {/* FOOTER */}
                  <View className="flex-row justify-between mt-4">
                    <Text className="text-gray-500 text-xs tracking-wide">
                      {timeAgo(item.created_at)}
                    </Text>

                    <Text className="text-gray-500 text-xs tracking-wide">
                      {new Date(item.created_at * 1000).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </HistoryCardMotion>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
