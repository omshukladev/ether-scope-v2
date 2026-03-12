import { View, Text, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser, useAuth } from "@clerk/expo";

export default function Settings() {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-black px-5">
      
      {/* TITLE */}
      <Text className="text-white text-3xl font-bold mt-6">
        Settings
      </Text>

      {/* PROFILE CARD */}
      <View className="bg-[#14171c] rounded-3xl p-6 items-center mt-6">

        <Image
          source={{ uri: user?.imageUrl }}
          className="w-24 h-24 rounded-full"
        />

        <Text className="text-white text-lg font-semibold mt-4">
          {user?.fullName ?? user?.primaryEmailAddress?.emailAddress}
        </Text>

      </View>

      {/* LOGOUT BUTTON */}
      <Pressable
        onPress={() => signOut()}
        className="border border-blue-500 rounded-2xl py-4 items-center mt-10"
      >
        <Text className="text-blue-500 font-semibold text-lg">
          Logout Account
        </Text>
      </Pressable>

    </SafeAreaView>
  );
}