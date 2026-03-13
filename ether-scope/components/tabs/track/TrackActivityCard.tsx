import React from "react";
import { View, Text } from "react-native";
import HistoryCardMotion from "@/components/HistoryCardMotion";
import NeonBadge from "@/components/NeonBadge";
import { trackStyles } from "@/components/tabs/track/trackStyles";
import type { ActivityMessage } from "@/components/tabs/track/types";

type TrackActivityCardProps = {
  message: ActivityMessage;
  darkMode: boolean;
  index: number;
};

export default function TrackActivityCard({
  message,
  darkMode,
  index,
}: TrackActivityCardProps) {
  const incoming = message.type === "incoming";

  return (
    <HistoryCardMotion index={index}>
      <View
        className={`rounded-[18px] px-4 py-4 border mb-3 ${
          darkMode ? "" : "bg-white border-gray-200"
        }`}
        style={darkMode ? trackStyles.darkCard : undefined}
      >
        <View className="flex-row justify-between items-center">
          <Text
            className={`font-semibold ${incoming ? "text-green-400" : "text-red-400"}`}
          >
            {incoming ? "Received" : "Sent"} {message.amount} {message.symbol}
          </Text>

          <NeonBadge
            label={incoming ? "IN" : "OUT"}
            color={incoming ? "#22c55e" : "#ef4444"}
          />
        </View>

        <Text className="text-gray-400 text-xs mt-3">
          {new Date(message.date).toLocaleTimeString()}
        </Text>
      </View>
    </HistoryCardMotion>
  );
}
