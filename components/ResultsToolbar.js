import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { ArrowUpDown } from "lucide-react-native";
import Chip from "@/components/Chip";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Au-dessus des résultats : combien il y en a, le tri en cours (modifiable
 * sans rouvrir les filtres) et les filtres actifs, chacun retirable d'un appui.
 */
export default function ResultsToolbar({
  countLabel,
  sortLabel = null,
  onSortPress = null,
  chips = [],
  onRemoveChip,
  onClearAll,
}) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { i18n } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={theme.textStyles.cardTitle}>{countLabel}</Text>
        {onSortPress ? (
          <TouchableOpacity
            style={[styles.sort, { backgroundColor: theme.background_card }]}
            onPress={onSortPress}
            accessibilityRole="button"
            accessibilityLabel={`${i18n.t("sort")} : ${sortLabel}`}
          >
            <ArrowUpDown size={14} color={Colors.primary_color} />
            <Text style={[styles.sortText, { color: theme.title }]}>{sortLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {chips.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {chips.map((chip) => (
            <Chip key={chip.key} label={chip.label} onRemove={() => onRemoveChip(chip)} />
          ))}
          <TouchableOpacity onPress={onClearAll} style={styles.clearAll} hitSlop={8}>
            <Text style={styles.clearAllText}>{i18n.t("filter_clear_all")}</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sort: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 17,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  sortText: {
    fontSize: 13,
    fontWeight: "600",
  },
  chips: {
    gap: 8,
    alignItems: "center",
    paddingRight: 8,
  },
  clearAll: {
    paddingHorizontal: 6,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.error_color,
  },
});
