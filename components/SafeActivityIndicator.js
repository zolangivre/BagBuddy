import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

import loaderAnimation from "@/assets/loading.json";

export const SafeActivityIndicator = ({
  size = "large",
  style,
  loop = true,
  ...props
}) => {
  const dimensionMap = {
    large: 100,
    medium: 80,
    small: 30,
  };

  const dimension = dimensionMap[size] ?? 100;
  return (
    <View
      style={[styles.container, { width: dimension, height: dimension }, style]}
    >
      <LottieView
        source={loaderAnimation}
        autoPlay
        loop={loop}
        style={{ width: dimension, height: dimension }}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SafeActivityIndicator;
