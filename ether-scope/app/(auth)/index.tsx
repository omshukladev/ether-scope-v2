import { View, Text, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedOrb } from "@/components/AnimatedOrb";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { useEffect } from "react";

const { width, height } = Dimensions.get("window");

export default function AuthScreen() {

  /* FLOATING ETH LOGO */
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withTiming(-15, {
        duration: 3500,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }],
  }));

  return (
    <View className="flex-1">

      {/* BACKGROUND GRADIENT */}
      <LinearGradient
        colors={["#0B0F1A", "#000000"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* ANIMATED ORBS */}
      <AnimatedOrb
        colors={["#3b82f6", "#22d3ee"]}
        size={320}
        initialX={-120}
        initialY={height * 0.1}
        duration={5000}
      />

      <AnimatedOrb
        colors={["#6366f1", "#3b82f6"]}
        size={260}
        initialX={width - 120}
        initialY={height * 0.3}
        duration={6000}
      />

      <AnimatedOrb
        colors={["#22d3ee", "#6366f1"]}
        size={220}
        initialX={width * 0.2}
        initialY={height * 0.7}
        duration={5500}
      />

      <SafeAreaView className="flex-1 justify-between">

        {/* HEADER */}
        <View className="flex-row items-center px-6 pt-4">
          <View className="bg-white p-2 rounded-lg mr-3">
            <Ionicons name="flash" size={16} color="black" />
          </View>

          <Text className="text-white text-lg font-semibold">
            EtherScope
          </Text>
        </View>

        {/* HERO SECTION */}
        <View className="flex-1 justify-center items-center">

          <View
            style={{
              width: width * 0.7,
              height: width * 0.7,
              borderRadius: width,
              backgroundColor: "#e5e7eb",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Animated.View style={floatStyle}>
              <Image
                source={require("../../assets/images/ether.png")}
                style={{ width: 120, height: 120 }}
                contentFit="contain"
              />
            </Animated.View>
          </View>

          {/* FLOATING ICONS */}

          <Ionicons
            name="flash"
            size={22}
            color="white"
            style={{
              position: "absolute",
              top: 40,
              right: 80,
            }}
          />

          <Ionicons
            name="shield-outline"
            size={22}
            color="#60a5fa"
            style={{
              position: "absolute",
              left: 70,
              top: 130,
            }}
          />

          <Ionicons
            name="grid-outline"
            size={22}
            color="#60a5fa"
            style={{
              position: "absolute",
              bottom: 60,
              left: 90,
            }}
          />

          <Ionicons
            name="globe-outline"
            size={22}
            color="white"
            style={{
              position: "absolute",
              bottom: 60,
              right: 90,
            }}
          />

        </View>

        {/* TEXT */}
        <View className="px-10 items-center">

          <Text className="text-white text-3xl font-bold text-center">
            Track Ethereum wallets.
          </Text>

          <Text className="text-blue-400 text-3xl font-bold text-center">
            In real time.
          </Text>

          <Text className="text-gray-400 text-center mt-4">
            Search, monitor and get alerts instantly on any chain activity.
          </Text>

        </View>

        {/* AUTH BUTTONS */}
        <View className="px-6 pb-10 pt-6">

          {/* GOOGLE */}
          <Pressable className="bg-white rounded-xl py-4 flex-row justify-center items-center mb-4">
            <Ionicons name="logo-google" size={20} color="black" />
            <Text className="ml-2 text-black font-semibold">
              Continue with Google
            </Text>
          </Pressable>

          {/* APPLE */}
          <Pressable className="bg-[#111827] rounded-xl py-4 flex-row justify-center items-center">
            <Ionicons name="logo-apple" size={20} color="white" />
            <Text className="ml-2 text-white font-semibold">
              Continue with Apple
            </Text>
          </Pressable>

        </View>

      </SafeAreaView>
    </View>
  );
}