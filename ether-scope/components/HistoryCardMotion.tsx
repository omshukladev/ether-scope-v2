import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const CARD_RADIUS = 18;

interface HistoryCardMotionProps {
  children: React.ReactNode;
  index: number;
}

export default function HistoryCardMotion({
  children,
  index,
}: HistoryCardMotionProps) {
  const enterProgress = useRef(new Animated.Value(0)).current;
  const pulseProgress = useRef(new Animated.Value(0)).current;
  const sheenProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 85;

    enterProgress.setValue(0);
    pulseProgress.setValue(0);
    sheenProgress.setValue(0);

    const enterAnimation = Animated.sequence([
      Animated.delay(delay),
      Animated.timing(enterProgress, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    const pulseAnimation = Animated.sequence([
      Animated.delay(delay + 220),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseProgress, {
            toValue: 1,
            duration: 2100,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseProgress, {
            toValue: 0,
            duration: 2100,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
    ]);

    const sheenAnimation = Animated.sequence([
      Animated.delay(delay + 900),
      Animated.loop(
        Animated.sequence([
          Animated.timing(sheenProgress, {
            toValue: 1,
            duration: 2400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(1200),
          Animated.timing(sheenProgress, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ),
    ]);

    enterAnimation.start();
    pulseAnimation.start();
    sheenAnimation.start();

    return () => {
      enterAnimation.stop();
      pulseAnimation.stop();
      sheenAnimation.stop();
    };
  }, [enterProgress, index, pulseProgress, sheenProgress]);

  const enterStyle = {
    opacity: enterProgress,
    transform: [
      {
        translateY: enterProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
      {
        scale: enterProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.972, 1],
        }),
      },
      {
        translateX: enterProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [3, 0],
        }),
      },
    ],
  } as const;

  const glowStyle = {
    opacity: pulseProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.06, 0.14],
    }),
    transform: [
      {
        scale: pulseProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.985, 1.01],
        }),
      },
    ],
  } as const;

  const sheenStyle = {
    opacity: pulseProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.13, 0.23],
    }),
    transform: [
      {
        translateX: sheenProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [-180, 360],
        }),
      },
      { rotate: "-18deg" },
    ],
  } as const;

  return (
    <Animated.View style={[styles.wrapper, enterStyle]}>
      <Animated.View
        style={[styles.outerGlow, glowStyle]}
        pointerEvents="none"
      />

      {children}

      <View style={styles.accentLayer} pointerEvents="none">
        <View style={styles.outline} pointerEvents="none" />

        <Animated.View style={[styles.sheen, sheenStyle]} pointerEvents="none">
          <LinearGradient
            colors={[
              "rgba(255,255,255,0)",
              "rgba(168, 228, 255, 0.12)",
              "rgba(140, 188, 255, 0.26)",
              "rgba(255,255,255,0)",
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    marginBottom: 14,
  },
  outerGlow: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: CARD_RADIUS,
    backgroundColor: "rgba(99, 176, 255, 0.1)",
  },
  accentLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    zIndex: 3,
  },
  outline: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: "rgba(120, 166, 225, 0.26)",
  },
  sheen: {
    position: "absolute",
    top: -24,
    width: 150,
    height: 210,
  },
});
