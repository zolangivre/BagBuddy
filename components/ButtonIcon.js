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
      // Une icône seule n'a rien à lire pour VoiceOver/TalkBack : chaque appel
      // doit passer un accessibilityLabel.
      accessibilityRole="button"
      hitSlop={4}
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
