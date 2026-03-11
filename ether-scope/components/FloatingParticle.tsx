import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";

interface FloatingParticleProps {
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay?: number;
  color: string;
}

export const FloatingParticle = ({
  size,
  initialX,
  initialY,
  duration,
  delay = 0,
  color,
}: FloatingParticleProps) => {
  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    translateX.value = withDelay(
      delay,
      withRepeat(
        withTiming(initialX + 30, {
          duration,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      ),
    );

    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(initialY - 50, {
          duration: duration + 500,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      ),
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0.6, {
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
};
