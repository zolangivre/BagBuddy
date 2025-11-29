import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Button from "@/components/Button";
import Colors from "@/theme/Colors";
import { Weight, Plus, Activity, Calendar } from "lucide-react-native";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";

const ActionButton = ({ onSelectionChange, type = "home" }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [selected, setSelected] = useState(
    type === "home"
      ? "buy"
      : type === "transactions"
      ? "active"
      : type === "profile"
      ? "listings"
      : null
  );

  const handleSelect = (value) => {
    setSelected(value);
    if (onSelectionChange) {
      onSelectionChange(value);
    }
  };

  let buttons = [];
  if (type === "home") {
    buttons = [
      {
        key: "buy",
        text: i18n.t("buy_weight"),
        icon: Weight,
        color: Colors.primary_color,
      },
      {
        key: "sell",
        text: i18n.t("sell_weight"),
        icon: Plus,
        color: Colors.success_color,
      },
    ];
  } else if (type === "transactions") {
    buttons = [
      {
        key: "active",
        text: i18n.t("active"),
        icon: Activity,
        color: Colors.primary_color,
      },
      {
        key: "completed",
        text: i18n.t("completed"),
        icon: Calendar,
        color: Colors.success_color,
      },
    ];
  } else if (type === "profile") {
    buttons = [
      {
        key: "listings",
        text: i18n.t("listings"),
        color: Colors.primary_color,
      },
      {
        key: "reviews",
        text: i18n.t("reviews"),
        color: Colors.success_color,
      },
      {
        key: "settings",
        text: i18n.t("settings"),
        color: Colors.warning_color || "#FFA500",
      },
    ];
  }

  return (
    <View style={styles.actionSection}>
      <View
        style={[
          styles.actionButtonsContainer,
          { backgroundColor: theme.background_card },
        ]}
      >
        {buttons.map((btn) => {
          const Icon = btn.icon;
          const isSelected = selected === btn.key;

          const textColor =
            colorScheme === "dark"
              ? isSelected
                ? Colors.white
                : "#888888"
              : isSelected
              ? Colors.white
              : Colors.secondary_color;

          const iconColor = isSelected
            ? Colors.white
            : colorScheme === "dark"
            ? "#888888"
            : Colors.secondary_color;

          return (
            <Button
              key={btn.key}
              text={btn.text}
              leftIcon={Icon ? <Icon size={22} color={iconColor} /> : null}
              style={[
                { backgroundColor: theme.background.card },
                styles.baseButton,
                isSelected
                  ? { backgroundColor: btn.color, ...styles.selectedShadow }
                  : styles.notSelected,
              ]}
              textStyle={{
                color: textColor,
                fontSize: 14,
                fontWeight: "500",
              }}
              onPress={() => handleSelect(btn.key)}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionSection: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginTop: -15,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    gap: 8,
  },
  baseButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
  },
});

export default ActionButton;
