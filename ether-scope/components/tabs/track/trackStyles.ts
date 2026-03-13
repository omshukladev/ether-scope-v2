import { StyleSheet } from "react-native";

export const trackStyles = StyleSheet.create({
  darkShell: {
    backgroundColor: "rgba(10, 16, 30, 0.5)",
    borderColor: "rgba(111, 162, 232, 0.26)",
  },
  darkCard: {
    backgroundColor: "rgba(11, 16, 30, 0.58)",
    borderColor: "rgba(111, 162, 232, 0.3)",
    shadowColor: "#0A4AA5",
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  addButton: {
    shadowColor: "#3b82f6",
    shadowOpacity: 0.26,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    transform: [{ scale: 1 }],
  },
  addButtonPressed: {
    opacity: 0.88,
    shadowOpacity: 0.14,
    transform: [{ scale: 0.985 }],
  },
  deleteButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
});
