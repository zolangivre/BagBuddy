import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Champ des écrans de connexion : icône dans le champ, bordure qui suit le
 * focus et l'erreur, bascule d'affichage pour les mots de passe.
 *
 * `Icon` est un composant lucide (Mail, Lock…), pas un élément : le champ lui
 * donne sa couleur selon l'état. `inputRef` permet de passer au champ suivant.
 */
export default function AuthField({
  label,
  icon: Icon,
  error = null,
  hint = null,
  password = false,
  inputRef,
  style,
  ...inputProps
}) {
  const { theme: colorScheme } = useThemeContext();
  const { i18n } = useLanguage();
  const theme = Colors[colorScheme] ?? Colors.light;
  const isDark = colorScheme === "dark";
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const borderColor = error
    ? Colors.error_color
    : focused
      ? Colors.primary_color
      : isDark
        ? Colors.dark_4
        : Colors.very_light_grey;
  const iconColor = error
    ? Colors.error_color
    : focused
      ? Colors.primary_color
      : theme.text;

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text style={[styles.label, { color: theme.title }]}>{label}</Text>
      ) : null}

      <View
        style={[
          styles.field,
          {
            borderColor,
            backgroundColor: isDark ? Colors.dark_4 : Colors.very_light_blue,
          },
          focused && !error && styles.fieldFocused,
        ]}
      >
        {Icon ? <Icon size={20} color={iconColor} /> : null}
        <TextInput
          autoCorrect={false}
          {...inputProps}
          ref={inputRef}
          style={[styles.input, { color: theme.title }]}
          placeholderTextColor={theme.text}
          secureTextEntry={password && !revealed}
          autoCapitalize={password ? "none" : inputProps.autoCapitalize}
          onFocus={(e) => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
        />
        {password ? (
          <TouchableOpacity
            onPress={() => setRevealed((value) => !value)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={i18n.t(
              revealed ? "auth_hide_password" : "auth_show_password"
            )}
          >
            {revealed ? (
              <EyeOff size={20} color={theme.text} />
            ) : (
              <Eye size={20} color={theme.text} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <Text style={[theme.textStyles.caption, styles.error]}>{error}</Text>
      ) : hint ? (
        <Text style={theme.textStyles.caption}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  fieldFocused: {
    shadowColor: Colors.primary_color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    fontSize: 16,
  },
  error: {
    color: Colors.error_color,
  },
});
