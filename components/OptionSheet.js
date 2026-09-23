import React from "react";
import { View, Text, Modal, Pressable, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check } from "lucide-react-native";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";

/**
 * Courte liste de choix exclusifs qui monte du bas de l'écran (le tri, par
 * exemple). Un appui hors de la feuille la ferme sans rien changer.
 */
export default function OptionSheet({ visible, title, options, selected, onSelect, onClose }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button" />
      <View
        style={[
          styles.sheet,
          { backgroundColor: theme.background_card, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <View style={[styles.handle, { backgroundColor: theme.navTopBorder }]} />
        <Text style={[theme.textStyles.headerTitle, styles.title]}>{title}</Text>
        {options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.option, { borderBottomColor: theme.navTopBorder }]}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
            >
              {option.icon ?? null}
              <Text
                style={[
                  styles.optionLabel,
                  { color: isSelected ? Colors.primary_color : theme.title },
                  isSelected && styles.optionSelected,
                ]}
              >
                {option.label}
              </Text>
              {isSelected ? <Check size={20} color={Colors.primary_color} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 5,
    borderRadius: 3,
    marginBottom: 14,
  },
  title: {
    marginBottom: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
  },
  optionSelected: {
    fontWeight: "600",
  },
});
