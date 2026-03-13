import React, { useEffect } from "react";
import { Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";

interface Props {
  label: string;
  color: string;
  flash?: boolean;
}

export default function NeonBadge({ label, color, flash }: Props) {
  const glow = useSharedValue(0.72);

  useEffect(() => {
    glow.value = withRepeat(
      withTiming(1, {
        duration: 1800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (flash) {
      glow.value = withSequence(
        withTiming(1.08, { duration: 140 }),
        withTiming(0.86, { duration: 170 }),
      );
    }
  }, [flash, glow]);

  const style = useAnimatedStyle(() => ({
    opacity: glow.value,
    shadowOpacity: glow.value * 0.8,
  }));

  return (
    <Animated.View
      style={[
        {
          paddingHorizontal: 14,
          paddingVertical: 6,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: color,
          shadowColor: color,
          shadowRadius: 7,
          shadowOffset: { width: 0, height: 0 },
        },
        style,
      ]}
    >
      <Text
        style={{
          color,
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 0.4,
        }}
      >
        {label}
      </Text>
    </Animated.View>
  );
}
