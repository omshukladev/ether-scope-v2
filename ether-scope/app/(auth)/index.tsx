import {
  View,
  Text,
  Pressable,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedOrb } from "@/components/AnimatedOrb";
import { FloatingParticle } from "@/components/FloatingParticle";
import { GlowingLogo } from "@/components/GlowingLogo";

import { useState } from "react";
import { useSSO } from "@clerk/expo";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function AuthScreen() {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);

  const handleSSOLogin = async (strategy: "oauth_google" | "oauth_apple") => {
    try {
      setLoadingStrategy(strategy);

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }

      router.replace("/(tabs)");
    } catch (err) {
      console.log("SSO Error:", err);
    } finally {
      setLoadingStrategy(null);
    }
  };

  return (
    <View className="flex-1">
      {/* BACKGROUND */}
      <LinearGradient
        colors={["#0f172a", "#020617", "#000000"]}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />

      {/* LARGE BACKGROUND ORBS */}
      <AnimatedOrb
        colors={["#3b82f6", "#1e40af"]}
        size={280}
        initialX={-120}
        initialY={height * 0.05}
        duration={8000}
      />

      <AnimatedOrb
        colors={["#6366f1", "#3730a3"]}
        size={250}
        initialX={width - 100}
        initialY={height * 0.7}
        duration={9000}
      />

      <AnimatedOrb
        colors={["#0ea5e9", "#2563eb"]}
        size={180}
        initialX={width * 0.1}
        initialY={height * 0.82}
        duration={7500}
      />

      {/* FLOATING PARTICLES */}
      <FloatingParticle
        size={8}
        initialX={width * 0.2}
        initialY={height * 0.15}
        duration={4000}
        delay={0}
        color="#60a5fa"
      />

      <FloatingParticle
        size={6}
        initialX={width * 0.75}
        initialY={height * 0.2}
        duration={5000}
        delay={800}
        color="#818cf8"
      />

      <FloatingParticle
        size={10}
        initialX={width * 0.85}
        initialY={height * 0.45}
        duration={4500}
        delay={1200}
        color="#38bdf8"
      />

      <FloatingParticle
        size={7}
        initialX={width * 0.15}
        initialY={height * 0.6}
        duration={5500}
        delay={400}
        color="#60a5fa"
      />

      <FloatingParticle
        size={9}
        initialX={width * 0.9}
        initialY={height * 0.15}
        duration={6000}
        delay={1600}
        color="#818cf8"
      />

      <FloatingParticle
        size={5}
        initialX={width * 0.4}
        initialY={height * 0.3}
        duration={4800}
        delay={600}
        color="#38bdf8"
      />

      <SafeAreaView className="flex-1" style={styles.container}>
        {/* HEADER */}
        <View className="flex-row items-center px-6 pt-2">
          <View className="bg-white p-2.5 rounded-xl mr-3 shadow-lg">
            <Ionicons name="flash" size={18} color="black" />
          </View>
          <Text className="text-white text-xl font-bold tracking-tight">
            EtherScope
          </Text>
        </View>

        {/* HERO SECTION */}
        <View style={styles.heroContainer}>
          {/* LOGO WITH ANIMATIONS */}
          <GlowingLogo size={280} />

          {/* TEXT CONTENT */}
          <View className="items-center mt-12 px-8">
            <Text className="text-white text-4xl font-bold text-center tracking-tight">
              Track Ethereum wallets
            </Text>

            <Text className="text-blue-400 text-4xl font-bold text-center tracking-tight mt-1">
              in real time
            </Text>

            <Text className="text-gray-400 text-base text-center mt-6 leading-6 max-w-sm">
              Search, monitor and get alerts instantly on any chain activity.
            </Text>
          </View>
        </View>

        {/* AUTH BUTTONS */}
        <View className="px-8 pb-8">
          <Pressable
            onPress={() => handleSSOLogin("oauth_google")}
            className="bg-white rounded-2xl py-5 flex-row justify-center items-center mb-4 shadow-xl"
            style={styles.button}
          >
            {loadingStrategy === "oauth_google" ? (
              <ActivityIndicator color="black" />
            ) : (
              <>
                <Ionicons name="logo-google" size={22} color="black" />
                <Text className="ml-3 text-black font-bold text-lg">
                  Continue with Google
                </Text>
              </>
            )}
          </Pressable>

          <Pressable
            onPress={() => handleSSOLogin("oauth_apple")}
            className="bg-[#1e293b] rounded-2xl py-5 flex-row justify-center items-center border border-slate-700"
            style={styles.button}
          >
            {loadingStrategy === "oauth_apple" ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="logo-apple" size={22} color="white" />
                <Text className="ml-3 text-white font-bold text-lg">
                  Continue with Apple
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
  heroContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingTop: 40,
  },
  button: {
    elevation: 8,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
});
