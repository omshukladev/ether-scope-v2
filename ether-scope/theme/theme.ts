import { MD3DarkTheme } from "react-native-paper";

export const customTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,

    primary: "#3B82F6",
    background: "#000000",
    surface: "#111111",
    secondary: "#1F2937",
    error: "#EF4444",

    onPrimary: "#FFFFFF",
    onBackground: "#FFFFFF",
  },
};