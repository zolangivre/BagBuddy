import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Button from "./Button";
import Colors from "../theme/Colors";
import {
  Weight,
  Plus,
  Activity,
  Calendar,
} from "lucide-react-native";

const ActionButton = ({ onSelectionChange, type = "home" }) => {
  const [selected, setSelected] = useState(
    type === "home"
      ? "buy"
      : type === "transactions"
      ? "active"
      : type === "profile"
      ? "overview"
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
        text: "Buy weight",
        icon: Weight,
        color: Colors.primary_color,
      },
      {
        key: "sell",
        text: "Sell weight",
        icon: Plus,
        color: Colors.success_color,
      },
    ];
  } else if (type === "transactions") {
    buttons = [
      {
        key: "active",
        text: "Active",
        icon: Activity,
        color: Colors.primary_color,
      },
      {
        key: "completed",
        text: "Completed",
        icon: Calendar,
        color: Colors.success_color,
      },
    ];
  } else if (type === "profile") {
    buttons = [
      {
        key: "overview",
        text: "Overview",
        color: Colors.primary_color,
      },
      {
        key: "listings",
        text: "Listings",
        color: Colors.success_color,
      },
      {
        key: "settings",
        text: "Settings",
        color: Colors.warning_color || "#FFA500",
      },
    ];
  }

  return (
    <View style={styles.actionSection}>
      <View style={[styles.actionButtonsContainer, { gap: 8 }]}>
        {buttons.map((btn) => {
          const Icon = btn.icon;
          const isSelected = selected === btn.key;

          return (
            <Button
              key={btn.key}
              text={btn.text}
              leftIcon={
                Icon ? (
                  <Icon
                    size={22}
                    color={isSelected ? "#FFFFFF" : Colors.secondary_color}
                  />
                ) : null
              }
              style={[
                styles.baseButton,
                isSelected
                  ? { backgroundColor: btn.color, ...styles.selectedShadow }
                  : styles.notSelected,
              ]}
              textStyle={{
                color: isSelected ? "#FFFFFF" : Colors.secondary_color,
                fontSize: 15,
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
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginTop: -15,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  baseButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
});

export default ActionButton;
