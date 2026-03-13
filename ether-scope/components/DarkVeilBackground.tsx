import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

export default function DarkVeilBackground() {
  const driftX = useSharedValue(-10);
  const driftY = useSharedValue(-6);
  const shimmerX = useSharedValue(8);
  const shimmerY = useSharedValue(4);
  const accentPulse = useSharedValue(0);

  useEffect(() => {
    driftX.value = withRepeat(
      withTiming(10, {
        duration: 12000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );

    driftY.value = withRepeat(
      withTiming(6, {
        duration: 15000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );

    shimmerX.value = withRepeat(
      withTiming(-8, {
        duration: 13000,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    );

    shimmerY.value = withRepeat(
      withTiming(-4, {
        duration: 11000,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    );

    accentPulse.value = withRepeat(
      withTiming(1, {
        duration: 9000,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [accentPulse, driftX, driftY, shimmerX, shimmerY]);

  const layerOneStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: driftX.value },
      { translateY: driftY.value },
      { rotate: "-9deg" },
    ],
  }));

  const layerTwoStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shimmerX.value },
      { translateY: shimmerY.value },
      { rotate: "13deg" },
    ],
  }));

  const centerAccentStyle = useAnimatedStyle(() => ({
    opacity: 0.15 + accentPulse.value * 0.1,
    transform: [
      { translateX: -6 + accentPulse.value * 12 },
      { scale: 1 + accentPulse.value * 0.05 },
      { rotate: "-12deg" },
    ],
  }));

  return (
    <Animated.View style={styles.container} pointerEvents="none">
      <LinearGradient
        colors={["#000000", "#02050D", "#03070F", "#000000"]}
        locations={[0, 0.32, 0.74, 1]}
        start={{ x: 0.18, y: 0 }}
        end={{ x: 0.82, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[styles.layerOne, layerOneStyle]}>
        <LinearGradient
          colors={[
            "rgba(82, 45, 175, 0)",
            "rgba(94, 56, 196, 0.14)",
            "rgba(82, 45, 175, 0)",
          ]}
          locations={[0, 0.5, 1]}
          start={{ x: 0.1, y: 0.5 }}
          end={{ x: 0.9, y: 0.5 }}
          style={styles.bandFill}
        />
      </Animated.View>

      <Animated.View style={[styles.layerTwo, layerTwoStyle]}>
        <LinearGradient
          colors={[
            "rgba(59, 130, 246, 0)",
            "rgba(59, 130, 246, 0.08)",
            "rgba(59, 130, 246, 0)",
          ]}
          locations={[0, 0.48, 1]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.bandFill}
        />
      </Animated.View>

      <Animated.View style={[styles.centerAccent, centerAccentStyle]}>
        <LinearGradient
          colors={[
            "rgba(128, 71, 255, 0)",
            "rgba(128, 71, 255, 0.24)",
            "rgba(85, 60, 194, 0.2)",
            "rgba(128, 71, 255, 0)",
          ]}
          locations={[0, 0.38, 0.62, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.bandFill}
        />
      </Animated.View>

      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.28)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  layerOne: {
    position: "absolute",
    left: "-40%",
    top: "-20%",
    width: "180%",
    height: "120%",
    opacity: 0.75,
  },
  layerTwo: {
    position: "absolute",
    left: "-35%",
    top: "-24%",
    width: "175%",
    height: "130%",
    opacity: 0.62,
  },
  centerAccent: {
    position: "absolute",
    left: "-20%",
    top: "24%",
    width: "140%",
    height: "56%",
  },
  bandFill: {
    flex: 1,
  },
});
