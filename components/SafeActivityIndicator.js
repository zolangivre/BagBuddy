import React from "react";
import { ActivityIndicator, Platform, View, StyleSheet } from "react-native";
import Colors from "@/theme/Colors";

export const SafeActivityIndicator = ({
  size = "large",
  color = Colors.primary,
  style,
  ...props
}) => {
  if (Platform.OS === "android") {
    return (
      <View
        style={[
          styles.container,
          size === "large" ? styles.large : styles.small,
          style,
        ]}
      >
        <ActivityIndicator
          size={size}
          color={color}
          animating={true}
          {...props}
        />
      </View>
    );
  }

  return (
    <ActivityIndicator
      size={size}
      color={color}
      animating={true}
      style={style}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  large: {
    minHeight: 44,
    minWidth: 44,
  },
  small: {
    minHeight: 24,
    minWidth: 24,
  },
});

export default SafeActivityIndicator;
