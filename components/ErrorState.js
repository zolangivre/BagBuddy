import { View, Text, StyleSheet } from "react-native";
import { CloudOff } from "lucide-react-native";
import Colors from "@/theme/Colors";
import Button from "@/components/Button";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { quietly } from "@/utils/quietly";

/**
 * À la place du contenu quand sa requête a échoué. Sans lui, un écran dont le
 * serveur ne répond pas ressemble à un écran vide (« aucune annonce »).
 */
export default function ErrorState({ onRetry, style }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { i18n } = useLanguage();

  return (
    <View style={[styles.container, style]} testID="error-state">
      <CloudOff size={40} color={Colors.tertiary_color} />
      <Text style={[theme.textStyles.cardTitle, styles.center]}>
        {i18n.t("load_error_title")}
      </Text>
      <Text style={[theme.textStyles.bodyMedium, styles.center]}>
        {i18n.t("load_error_message")}
      </Text>
      {onRetry ? (
        <Button
          text={i18n.t("retry")}
          onPress={() => quietly(onRetry)}
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 25,
  },
  center: { textAlign: "center" },
  button: { marginTop: 8, width: 200 },
});
