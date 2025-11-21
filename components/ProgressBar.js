import React from "react";
import { View, StyleSheet } from "react-native";
import Colors from "@/theme/Colors";

const ProgressBar = ({ step = 0, totalSteps = 4, width = 80, style }) => {
  // If the ProgressBar is placed in a row without an explicit width,
  // the container can collapse to width 0 because its children are
  // absolutely positioned. Provide a sensible default width and allow
  // callers to override via the `width` prop or `style` prop.
  const clamped = Math.max(0, Math.min(step, totalSteps));
  const percent = (clamped / totalSteps) * 100;
  return (
    <View style={[styles.progressBarContainer, { width }, style]}>
      <View style={styles.progressBarTrail} />
      <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  progressBarTrail: {
    width: "100%",
    height: 9,
    borderRadius: 999,
    backgroundColor: "rgba(14, 165, 233, 0.10)",
  },
  progressBarFill: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 9,
    borderRadius: 999,
    backgroundColor: Colors.primary_color,
  },
});

export default ProgressBar;
