import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/theme/Colors";
import i18n from "@/i18n";
import { useThemeContext } from "../contexts/ThemeContext";

const Button = ({
  href,
  onPress,
  text,
  leftIcon = null,
  rightIcon = null,
  style,
  textStyle,
  color = Colors.primary_color,
  /** Affiche le libellé d'attente et bloque l'appui, le temps d'un envoi. */
  loading = false,
  disabled = false,
  ...props
}) => {
  const router = useRouter();
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const handlePress = (e) => {
    if (onPress) onPress(e);

    if (href) {
      router.push(href);
    }
  };
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }, style]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled || loading}
      {...props}
    >
      {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
      <Text style={[theme.textStyles.buttonText, textStyle]}>
        {loading ? i18n.t("loading") : text}
      </Text>
      {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 48,
    backgroundColor: Colors.primary_color,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  iconLeft: {
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  iconRight: {
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Button;
