import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { trackStyles } from "@/components/tabs/track/trackStyles";

type TrackInputSectionProps = {
  darkMode: boolean;
  input: string;
  onChangeInput: (value: string) => void;
  onAddWallet: () => void;
  isPending: boolean;
};

export default function TrackInputSection({
  darkMode,
  input,
  onChangeInput,
  onAddWallet,
  isPending,
}: TrackInputSectionProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <View
      className={`mt-6 p-4 rounded-[18px] border ${
        darkMode ? "" : "bg-gray-100 border-gray-200"
      }`}
      style={darkMode ? trackStyles.darkShell : undefined}
    >
      <TextInput
        value={input}
        onChangeText={onChangeInput}
        placeholder="Enter wallet address"
        placeholderTextColor={darkMode ? "#78849A" : "#9CA3AF"}
        className={`p-4 rounded-2xl border ${
          darkMode
            ? "bg-[#171A23] border-[#2C3F60] text-white"
            : "bg-white border-gray-200 text-black"
        }`}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Pressable
        onPress={onAddWallet}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        disabled={isPending}
        className="bg-blue-500 mt-3 py-3.5 rounded-2xl items-center"
        style={[trackStyles.addButton, pressed && trackStyles.addButtonPressed]}
        android_ripple={{
          color: "rgba(255,255,255,0.12)",
          borderless: false,
        }}
      >
        <Text className="text-white font-semibold text-base">
          {isPending ? "Adding..." : "Add Wallet"}
        </Text>
      </Pressable>
    </View>
  );
}
