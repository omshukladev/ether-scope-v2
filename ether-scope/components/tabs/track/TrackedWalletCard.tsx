import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HistoryCardMotion from "@/components/HistoryCardMotion";
import { trackStyles } from "@/components/tabs/track/trackStyles";

type TrackedWalletCardProps = {
  walletAddress: string;
  darkMode: boolean;
  index: number;
  onDelete: (address: string) => void;
};

export default function TrackedWalletCard({
  walletAddress,
  darkMode,
  index,
  onDelete,
}: TrackedWalletCardProps) {
  return (
    <HistoryCardMotion index={index}>
      <View
        className={`rounded-[18px] px-4 py-4 border ${
          darkMode ? "" : "bg-white border-gray-200"
        }`}
        style={darkMode ? trackStyles.darkCard : undefined}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text
              numberOfLines={1}
              className={`font-semibold ${darkMode ? "text-white" : "text-black"}`}
            >
              {walletAddress}
            </Text>

            <Text className="text-gray-400 text-xs mt-1">Monitoring</Text>
          </View>

          <TouchableOpacity
            onPress={() => onDelete(walletAddress)}
            className="h-9 w-9 items-center justify-center rounded-full"
            style={trackStyles.deleteButton}
          >
            <Ionicons name="trash" size={18} color="#f87171" />
          </TouchableOpacity>
        </View>
      </View>
    </HistoryCardMotion>
  );
}
