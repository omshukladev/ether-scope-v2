import React from "react";
import { View, StyleSheet } from "react-native";

export default function DarkVeilBackground() {
  return <View style={styles.container} pointerEvents="none" />;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
    zIndex: 0,
  },
});
