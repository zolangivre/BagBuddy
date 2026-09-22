import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/theme/Colors";

const ButtonIcon = ({ href, icon, onPress, style, color, ...props }) => {
  const router = useRouter();

  const handlePress = (e) => {
    if (onPress) onPress(e);

    if (href) {
      router.push(href);
    }
  };
  return (
    <TouchableOpacity
      style={[styles.buttonIcon, { backgroundColor: color }, style]}
      onPress={handlePress}
      {...props}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: Colors.primary_color,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ButtonIcon;
