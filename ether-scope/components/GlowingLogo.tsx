import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";

interface GlowingLogoProps {
  size?: number;
}

export const GlowingLogo = ({ size = 280 }: GlowingLogoProps) => {
  const float = useSharedValue(0);
  const glowOpacity = useSharedValue(0.15);
  const glowScale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Floating animation
    float.value = withRepeat(
      withTiming(-20, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );

    // Glow pulsing animation
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.25, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.15, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    // Subtle rotation
    rotation.value = withRepeat(
      withSequence(
        withTiming(3, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-3, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: float.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  const innerGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value * 1.5,
  }));

  const containerSize = size + 40;
  const glowSize = containerSize + 100;

  return (
    <View
      style={[
        styles.container,
        { width: containerSize, height: containerSize },
      ]}
    >
      {/* Outer Glow */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: glowSize,
            height: glowSize,
            borderRadius: glowSize / 2,
          },
          glowStyle,
        ]}
      />

      {/* Middle Glow Layer */}
      <Animated.View
        style={[
          styles.middleGlow,
          {
            width: containerSize + 60,
            height: containerSize + 60,
            borderRadius: (containerSize + 60) / 2,
          },
          innerGlowStyle,
        ]}
      />

      {/* Logo Container with Float Animation */}
      <Animated.View style={[styles.logoWrapper, floatStyle]}>
        <View
          style={[
            styles.logoBackground,
            {
              width: containerSize,
              height: containerSize,
              borderRadius: containerSize / 2,
            },
          ]}
        >
          {/* Inner Glow Ring */}
          <View
            style={[
              styles.innerRing,
              {
                width: containerSize - 10,
                height: containerSize - 10,
                borderRadius: (containerSize - 10) / 2,
              },
            ]}
          />

          <Image
            source={require("../assets/images/ether.png")}
            style={{
              width: size,
              height: size,
            }}
            contentFit="contain"
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    backgroundColor: "#3b82f6",
  },
  middleGlow: {
    position: "absolute",
    backgroundColor: "#60a5fa",
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoBackground: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(59, 130, 246, 0.08)",
    borderWidth: 1.5,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  innerRing: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(96, 165, 250, 0.2)",
  },
});
