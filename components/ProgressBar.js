import React from "react";
import { View, StyleSheet } from "react-native";
import Colors from "../theme/Colors";

const ProgressBar = ({ step = 0 }) => {
  const clamped = Math.max(0, Math.min(step, 4));
  const percent = (clamped / 4) * 100;
  return (
    <View style={styles.progressBarContainer}>
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
