import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Search, SlidersHorizontal } from "lucide-react-native";
import Colors from "@/theme/Colors";

/**
 * Point d'entrée des filtres, dans le bandeau : le trajet cherché en titre,
 * les autres critères en dessous, et le nombre de filtres actifs sur le bouton.
 * Tout le bloc ouvre la feuille de filtres.
 */
export default function SearchPill({
  title,
  subtitle,
  activeCount,
  onPress,
  accessibilityLabel,
  testID,
}) {
  return (
    <TouchableOpacity
      style={styles.pill}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <Search size={20} color={Colors.primary_color} />
      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <View style={[styles.filterButton, activeCount > 0 && styles.filterButtonActive]}>
        <SlidersHorizontal
          size={18}
          color={activeCount > 0 ? Colors.white : Colors.secondary_color}
        />
        {activeCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{activeCount}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingLeft: 18,
    paddingRight: 8,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 6,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary_color,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.tertiary_color,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.very_light_grey,
  },
  filterButtonActive: {
    backgroundColor: Colors.secondary_color,
    borderColor: Colors.secondary_color,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary_color,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.white,
  },
});
