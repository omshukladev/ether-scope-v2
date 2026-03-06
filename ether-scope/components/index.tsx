import { View, Text, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { AnimatedOrb } from "@/components/AnimatedOrb";

const { width, height } = Dimensions.get("window");

export default function AuthScreen() {
  return (
    <View className="flex-1 bg-slate-950">
      {/* ANIMATED BACKGROUND */}
      <View className="absolute inset-0 overflow-hidden">
        <LinearGradient
          colors={["#0f172a", "#1e293b", "#0f172a"]}
          style={{ position: "absolute", width: "100%", height: "100%" }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* ANIMATED ORBS */}
        <AnimatedOrb
          colors={["#3b82f6", "#1e40af"]}
          size={300}
          initialX={-80}
          initialY={height * 0.1}
          duration={5000}
        />
        <AnimatedOrb
          colors={["#1e40af", "#3b82f6"]}
          size={250}
          initialX={width - 100}
          initialY={height * 0.3}
          duration={6000}
        />
        <AnimatedOrb
          colors={["#60a5fa", "#3b82f6"]}
          size={200}
          initialX={width * 0.3}
          initialY={height * 0.6}
          duration={4500}
        />

        {/* BLUR OVERLAY */}
        <BlurView
          intensity={80}
          tint="dark"
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />
      </View>

      <SafeAreaView className="flex-1 justify-between">
        {/* TOP SECTION - BRANDING */}
        <View className="items-center pt-8">
          <Image
            source={require("../../assets/images/ether.png")}
            style={{ width: 60, height: 60, marginBottom: 8 }}
            contentFit="contain"
          />
          <Text className="text-3xl font-bold text-white tracking-wider">
            EtherScope
          </Text>
        </View>

        {/* CENTER SECTION - HERO */}
        <View className="flex-1 justify-center items-center px-6">
          <View
            style={{
              width: 240,
              height: 240,
              borderRadius: 120,
              backgroundColor: "rgba(229, 231, 235, 0.95)",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#3b82f6",
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.4,
              shadowRadius: 40,
              elevation: 20,
            }}
          >
            <Image
              source={require("../../assets/images/ether.png")}
              style={{ width: 130, height: 130 }}
              contentFit="contain"
            />
          </View>

          {/* HEADLINE */}
          <View className="mt-12 items-center">
            <Text className="text-5xl font-bold text-white text-center">
              Track Ethereum
            </Text>
            <Text className="text-5xl font-bold text-white text-center">
              wallets.
            </Text>
            <Text className="text-4xl font-bold text-blue-400 text-center mt-2">
              In real time.
            </Text>
          </View>

          {/* DESCRIPTION */}
          <Text className="text-gray-300 text-center mt-6 px-4 text-base leading-6">
            Search, monitor and get alerts instantly on any chain activity.
          </Text>
        </View>

        {/* BOTTOM SECTION - AUTH BUTTONS */}
        <View className="px-6 pb-8">
          {/* GOOGLE BUTTON */}
          <Pressable
            className="bg-white/95 py-4 rounded-2xl flex-row justify-center items-center mb-3 active:scale-95"
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            <Text className="text-gray-900 font-semibold text-base">
              Continue with Google
            </Text>
          </Pressable>

          {/* APPLE BUTTON */}
          <Pressable
            className="bg-slate-900/80 border border-slate-700 py-4 rounded-2xl flex-row justify-center items-center mb-4 active:scale-95"
            accessibilityRole="button"
            accessibilityLabel="Continue with Apple"
          >
            <Text className="text-white font-semibold text-base">
              Continue with Apple
            </Text>
          </Pressable>

          {/* DIVIDER */}
          <Text className="text-gray-600 text-center font-medium">OR</Text>

          {/* EMAIL OPTION */}
          <Pressable className="mt-4 mb-6">
            <Text className="text-gray-300 text-center text-base">
              Sign in with email address
            </Text>
          </Pressable>

          {/* FOOTER LINKS */}
          <View className="border-t border-gray-700 pt-6 items-center">
            <View className="flex-row items-center justify-center mb-4">
              <Text className="text-gray-400 text-sm">
                Don&apos;t have an account?{" "}
              </Text>
              <Pressable>
                <Text className="text-blue-400 font-semibold text-sm">
                  Create Account
                </Text>
              </Pressable>
            </View>

            <View className="flex-row items-center justify-center gap-3">
              <Pressable>
                <Text className="text-gray-500 text-xs">Terms of Service</Text>
              </Pressable>
              <Text className="text-gray-600 text-xs">•</Text>
              <Pressable>
                <Text className="text-gray-500 text-xs">Privacy Policy</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}


