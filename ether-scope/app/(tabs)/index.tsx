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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useWalletTransactions } from "@/hooks/useWallet";
import { useThemeMode } from "@/lib/themeContext";
import TokenIcon from "@/components/TokenIcon";

export default function Home() {
  const { darkMode } = useThemeMode();

  const [inputAddress, setInputAddress] = useState("");
  const [searchedAddress, setSearchedAddress] = useState("");
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const { data, isLoading, error } = useWalletTransactions(searchedAddress);

  const transactions = data?.transactions || [];

  const handleSearch = () => {
    if (!inputAddress.trim()) return;
    setSearchedAddress(inputAddress.trim());
  };

  return (
    <SafeAreaView className={`flex-1 px-4 ${darkMode ? "bg-black" : "bg-white"}`}>
      <ScrollView showsVerticalScrollIndicator={false}>

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
          className="bg-blue-500 mt-4 py-4 rounded-2xl items-center"
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

              <View className="bg-blue-500/20 px-2 py-1 rounded">
                <Text className="text-blue-400 text-xs font-semibold">
                  LIVE
                </Text>
              </View>
            </View>

            {transactions.map((tx: any, index: number) => {

              const isReceived =
                tx.to?.toLowerCase() === searchedAddress?.toLowerCase();

              const isSuccess = tx.status === "success";

              const directionLabel = isReceived ? "RECEIVED" : "SENT";

              return (
                <TouchableOpacity
                  key={`${tx.hash ?? "nohash"}-${index}`}
                  onPress={() => setSelectedTx(tx)}
                  className={`rounded-2xl p-5 mb-4 border shadow-lg shadow-black/30 ${
                    darkMode
                      ? "bg-[#151518] border-[#2A2A2E]"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {/* TOP ROW */}
                  <View className="flex-row items-center justify-between">

                    {/* LEFT SIDE */}
                    <View className="flex-row items-center gap-3">

                      {/* TOKEN ICON */}
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

                    {/* AMOUNT */}
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
                  <View className="flex-row justify-between mt-3">

                    <View className="flex-row gap-2">

                      {/* SENT / RECEIVED */}
                      <View
                        className={`px-2 py-1 rounded-full ${
                          isReceived ? "bg-green-500/20" : "bg-red-500/20"
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            isReceived ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {directionLabel}
                        </Text>
                      </View>

                      {/* SUCCESS / FAILED */}
                      <View
                        className={`px-2 py-1 rounded-full ${
                          isSuccess ? "bg-green-500/20" : "bg-red-500/20"
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            isSuccess ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {isSuccess ? "SUCCESS" : "FAILED"}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-gray-500 text-xs">
                      {tx.date
                        ? new Date(tx.date).toLocaleString()
                        : ""}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* TRANSACTION DETAILS MODAL */}
      <Modal visible={!!selectedTx} animationType="slide" transparent>

        <View className="flex-1 bg-black/70 justify-center px-6">

          <View
            className={`rounded-3xl p-6 ${
              darkMode ? "bg-[#1A1A1D]" : "bg-white"
            }`}
          >
            <View className="flex-row justify-end">
              <Pressable onPress={() => setSelectedTx(null)}>
                <Text className="text-blue-500 text-lg font-bold">✕</Text>
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
                <Text className={`mb-3 ${darkMode ? "text-white" : "text-black"}`}>
                  {selectedTx.hash}
                </Text>

                <Text className="text-gray-400">From</Text>
                <Text className={`mb-3 ${darkMode ? "text-white" : "text-black"}`}>
                  {selectedTx.from}
                </Text>

                <Text className="text-gray-400">To</Text>
                <Text className={`mb-3 ${darkMode ? "text-white" : "text-black"}`}>
                  {selectedTx.to}
                </Text>

                <Text className="text-gray-400">Amount</Text>
                <Text className={`mb-3 ${darkMode ? "text-white" : "text-black"}`}>
                  {selectedTx.amount?.toLocaleString?.()} {selectedTx.symbol}
                </Text>

                <Text className="text-gray-400">Date</Text>
                <Text className={`mb-3 ${darkMode ? "text-white" : "text-black"}`}>
                  {selectedTx.date
                    ? new Date(selectedTx.date).toLocaleString()
                    : ""}
                </Text>

                <Text className="text-gray-400">Status</Text>
                <Text
                  className={`${
                    selectedTx.status === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {selectedTx.status?.toUpperCase()}
                </Text>
              </>
            )}
          </View>

        </View>

      </Modal>
    </SafeAreaView>
  );
}