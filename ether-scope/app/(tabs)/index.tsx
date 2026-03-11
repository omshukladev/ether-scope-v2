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

export default function Home() {
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
    <SafeAreaView className="flex-1 bg-black px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* TITLE */}
        <Text className="text-3xl font-bold text-white mt-6">
          Wallet Explorer
        </Text>

        {/* INPUT */}
        <TextInput
          value={inputAddress}
          onChangeText={setInputAddress}
          placeholder="Enter wallet address..."
          placeholderTextColor="#6B6B70"
          className="mt-6 bg-[#1A1A1D] text-white p-4 rounded-2xl"
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
                  className="bg-[#1A1A1D] rounded-2xl p-5 mb-4"
                >
                  <View className="flex-row justify-between items-center">
                    <Text className="text-white font-semibold">
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

                  <Text className="text-gray-300 mt-2">
                    {tx.hash?.slice(0, 18)}...
                  </Text>

                  <Text className="text-gray-400 mt-2">
                    {tx.amount?.toLocaleString?.()} {tx.symbol ?? ""}
                  </Text>

                  <Text className="text-gray-500">
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
          <View className="bg-[#1A1A1D] rounded-3xl p-6">
            <View className="flex-row justify-end">
              <Pressable onPress={() => setSelectedTx(null)}>
                <Text className="text-blue-500 text-lg font-bold">✕</Text>
              </Pressable>
            </View>

            {selectedTx && (
              <>
                <Text className="text-2xl font-bold text-white mb-4">
                  Transaction Details
                </Text>

                <Text className="text-gray-400">Hash</Text>
                <Text className="text-white mb-3">{selectedTx.hash}</Text>

                <Text className="text-gray-400">From</Text>
                <Text className="text-white mb-3">{selectedTx.from}</Text>

                <Text className="text-gray-400">To</Text>
                <Text className="text-white mb-3">{selectedTx.to}</Text>

                <Text className="text-gray-400">Amount</Text>
                <Text className="text-white mb-3">
                  {selectedTx.amount?.toLocaleString?.()} {selectedTx.symbol}
                </Text>

                <Text className="text-gray-400">Date</Text>
                <Text className="text-white mb-3">
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