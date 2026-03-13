import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface AnimatedHistoryCardProps {
  children: React.ReactNode;
  index: number;
}

export default function AnimatedHistoryCard({
  children,
  index,
}: AnimatedHistoryCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);
  const glowOpacity = useSharedValue(0.3);
  const borderOpacity = useSharedValue(0.75);
  const shimmerX = useSharedValue(-160);

  useEffect(() => {
    const delay = index * 80;

    opacity.value = withDelay(delay, withTiming(1, { duration: 420 }));
    translateY.value = withDelay(
      delay,
      withTiming(0, {
        duration: 420,
        easing: Easing.out(Easing.cubic),
      }),
    );

    glowOpacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0.6, {
          duration: 2300,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      ),
    );

    borderOpacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 2300,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      ),
    );

    shimmerX.value = withDelay(
      delay + 600,
      withRepeat(
        withTiming(440, {
          duration: 2600,
          easing: Easing.out(Easing.quad),
        }),
        -1,
        false,
      ),
    );
  }, [borderOpacity, glowOpacity, index, opacity, shimmerX, translateY]);

  const enterStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: borderOpacity.value,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
    opacity: 0.55,
  }));

  return (
    <Animated.View style={[styles.wrapper, enterStyle]}>
      <Animated.View
        style={[styles.outerGlow, glowStyle]}
        pointerEvents="none"
      />

      <Animated.View style={[styles.ringWrap, ringStyle]} pointerEvents="none">
        <LinearGradient
          colors={[
            "rgba(128, 200, 255, 0.9)",
            "rgba(132, 138, 255, 0.86)",
            "rgba(146, 246, 240, 0.92)",
          ]}
          start={{ x: 0.02, y: 0.05 }}
          end={{ x: 1, y: 1 }}
          style={styles.ring}
        >
          <View style={styles.ringCutout} />
        </LinearGradient>
      </Animated.View>

      <Animated.View style={styles.shimmerMask} pointerEvents="none">
        <Animated.View style={[styles.shimmer, shimmerStyle]}>
          <LinearGradient
            colors={[
              "rgba(0,0,0,0)",
              "rgba(149, 227, 255, 0.95)",
              "rgba(0,0,0,0)",
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </Animated.View>

      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    marginBottom: 16,
  },
  outerGlow: {
    position: "absolute",
    top: 4,
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: 19,
    backgroundColor: "rgba(72, 178, 255, 0.16)",
  },
  ringWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 4,
    borderRadius: 18,
    overflow: "hidden",
  },
  ring: {
    width: "100%",
    height: "100%",
    padding: 1,
    borderRadius: 18,
  },
  ringCutout: {
    flex: 1,
    borderRadius: 17,
    backgroundColor: "transparent",
  },
  shimmerMask: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    borderRadius: 18,
    overflow: "hidden",
  },
  shimmer: {
    width: 120,
    height: 8,
  },
});
