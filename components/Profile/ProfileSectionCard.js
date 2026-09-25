import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "@/theme/Colors";
import { globalStyles } from "@/theme/Styles";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { SafeActivityIndicator } from "@/components/SafeActivityIndicator";
import ErrorState from "@/components/ErrorState";

/**
 * Carte d'aperçu du profil (avis, annonces) : titre, lien « voir tout », puis
 * un spinner, une erreur (sans données à montrer), un message vide ou les
 * lignes passées en enfants.
 */
export default function ProfileSectionCard({
  title,
  onViewAll,
  loading,
  error,
  onRetry,
  isEmpty,
  emptyText,
  children,
}) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { i18n } = useLanguage();

  return (
    <View style={[globalStyles.card, { backgroundColor: theme.background_card }]}>
      <View style={styles.header}>
        <Text style={theme.textStyles.cardTitle}>{title}</Text>
        {onViewAll ? (
          <TouchableOpacity onPress={onViewAll} accessibilityRole="link">
            <Text style={theme.textStyles.highlight}>{i18n.t("view_all")}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.list}>
        {loading ? (
          <View style={styles.placeholder}>
            <SafeActivityIndicator size="medium" />
          </View>
        ) : error ? (
          <ErrorState onRetry={onRetry} style={styles.error} />
        ) : isEmpty ? (
          <View style={[styles.placeholder, styles.empty]}>
            <Text
              style={[
                theme.textStyles.bodyLarge,
                { fontStyle: "italic", textAlign: "center" },
              ]}
            >
              {emptyText}
            </Text>
          </View>
        ) : (
          children
        )}
      </View>
    </View>
  );
}

/** Ligne d'une carte d'aperçu, sur le fond des cartes de vol. */
export function ProfileSectionRow({ children, style }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  return (
    <View style={[styles.row, { backgroundColor: theme.flightCard }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  list: {
    gap: 12,
  },
  placeholder: {
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    flex: 1,
    padding: 20,
  },
  error: {
    flex: 0,
    minHeight: 0,
    padding: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
  },
});
