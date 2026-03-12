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

export default function Home() {
  const { darkMode } = useThemeMode();

  const [inputAddress, setInputAddress] = useState("");
  const [searchedAddress, setSearchedAddress] = useState("");
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const { data, isLoading, error } = useWalletTransactions(searchedAddress);

  const handleSearch = () => {
    if (!inputAddress.trim()) return;
    setSearchedAddress(inputAddress.trim());
  };

  const transactions = data?.transactions || [];

  return (
    <SafeAreaView
      className={`flex-1 px-4 ${darkMode ? "bg-black" : "bg-white"}`}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* TITLE */}
        <Text
          className={`text-3xl font-bold mt-6 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Wallet Explorer
        </Text>

        {/* INPUT */}
        <TextInput
          value={inputAddress}
          onChangeText={setInputAddress}
          placeholder="Enter wallet address..."
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
          <Text className="text-white font-semibold">Search</Text>
        </Pressable>

        {/* LOADING */}
        {isLoading && (
          <View className="mt-8 items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        )}

        {/* ERROR */}
        {error && (
          <Text className="text-red-400 mt-6">
            Failed to fetch transactions.
          </Text>
        )}

        {/* TRANSACTION LIST */}
        {!isLoading && transactions.length > 0 && (
          <View className="mt-8">
            {transactions.map((tx: any, index: number) => {
              const isSuccess = tx.status === "success";

              return (
                <TouchableOpacity
                  key={`${tx.hash ?? "nohash"}-${index}`}
                  onPress={() => setSelectedTx(tx)}
                  className={`rounded-2xl p-5 mb-4 ${
                    darkMode ? "bg-[#1A1A1D]" : "bg-gray-100"
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <Text
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-black"
                      }`}
                    >
                      Transaction
                    </Text>

                    <View
                      className={`px-3 py-1 rounded-full ${
                        isSuccess ? "bg-green-500/20" : "bg-red-500/20"
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          isSuccess ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {tx.status?.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text
                    className={`mt-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {tx.hash?.slice(0, 18)}...
                  </Text>

                  <Text
                    className={`mt-2 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {tx.amount?.toLocaleString?.()} {tx.symbol ?? ""}
                  </Text>

                  <Text
                    className={`${
                      darkMode ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {tx.date ? new Date(tx.date).toLocaleString() : ""}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* TRANSACTION MODAL */}
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
                  {selectedTx.amount?.toLocaleString?.()} {selectedTx.symbol}
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
