import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function AnimatedModal({ children }: any) {
  const scale = useSharedValue(0.92);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 260 });
    opacity.value = withTiming(1, { duration: 260 });
    translateY.value = withTiming(0, { duration: 260 });
    glowOpacity.value = withTiming(0.85, { duration: 320 });
  }, [glowOpacity, opacity, scale, translateY]);

  const modalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.glow, glowStyle]} pointerEvents="none">
        <View style={styles.glowRing} />
      </Animated.View>

      <Animated.View style={[styles.modalContainer, modalStyle]}>
        <LinearGradient
          colors={[
            "rgba(103, 131, 255, 0.72)",
            "rgba(171, 188, 255, 0.5)",
            "rgba(155, 255, 243, 0.55)",
          ]}
          start={{ x: 0, y: 0.1 }}
          end={{ x: 1, y: 0.9 }}
          style={styles.modalBorder}
        >
          <View style={styles.panel}>
            <BlurView
              intensity={42}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.content}>{children}</View>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  glow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
  },

  glowRing: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(100, 198, 255, 0.5)",
    shadowColor: "#52d6ff",
    shadowOpacity: 0.46,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 22,
  },

  modalContainer: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
  },

  modalBorder: {
    borderRadius: 30,
    padding: 2,
  },

  panel: {
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "rgba(11, 13, 22, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(150, 170, 255, 0.22)",
  },

  content: {
    padding: 24,
  },
});
