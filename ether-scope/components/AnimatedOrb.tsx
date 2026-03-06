import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface AnimatedOrbProps {
  colors: string[];
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
}

export const AnimatedOrb = ({
  colors,
  size,
  initialX,
  initialY,
  duration,
}: AnimatedOrbProps) => {
  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(initialX + 40, {
        duration,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );

    translateY.value = withRepeat(
      withTiming(initialY + 40, {
        duration: duration + 800,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: 0.45,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={colors}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: size / 2,
        }}
      />
    </Animated.View>
  );
};