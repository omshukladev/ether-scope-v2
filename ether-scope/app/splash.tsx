import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlowingLogo } from "@/components/GlowingLogo";

const { width } = Dimensions.get("window");

export default function Splash() {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#0f172a", "#020617", "#000000"]}
        style={StyleSheet.absoluteFill}
      />
      <GlowingLogo size={Math.min(width * 0.6, 280)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
