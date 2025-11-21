import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "@/theme/Colors";
import { Scale, Minus, Plus } from "lucide-react-native";
import { useThemeContext } from "@/contexts/ThemeContext";
import { globalStyles } from "@/theme/Styles";
import Currency from "@/components/Currency";
import i18n from "@/i18n";

const WeightSelectorCard = ({ item, onWeightChange }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  let pricePerKg = null;
  let maxWeight = null;
  if (item) {
    pricePerKg = item.pricePerKg;
    maxWeight = item.remainingWeight;
  }
  const [selectedWeight, setSelectedWeight] = useState(1);

  const handleWeightChange = (newWeight) => {
    if (newWeight >= 1 && newWeight <= maxWeight) {
      setSelectedWeight(newWeight);
      if (onWeightChange) onWeightChange(newWeight);
    }
  };

  const totalPrice = selectedWeight * pricePerKg;
  return (
    <View
      style={[
        globalStyles.card,
        { backgroundColor: theme.background_card, gap: 20 },
      ]}
    >
      <View style={styles.weightSelectorHeader}>
        <Scale size={24} color={Colors.primary_color} />
        <Text style={theme.textStyles.cardTitle}>
          {i18n.t("select_weight_to_approve")}
        </Text>
      </View>

      <Text style={[theme.textStyles.bodyMedium, { textAlign: "center" }]}>
        {i18n.t("select_weight_to_approve_description", { weight: maxWeight })}
      </Text>

      {/* Weight Controls */}
      <View style={styles.weightControls}>
        <TouchableOpacity
          style={[styles.weightButton, { backgroundColor: theme.flightCard }]}
          onPress={() => handleWeightChange(selectedWeight - 1)}
        >
          <Minus size={24} color={Colors.primary_color} />
        </TouchableOpacity>

        <View style={styles.weightDisplay}>
          <Text style={theme.textStyles.number}>{selectedWeight}</Text>
          <Text style={theme.textStyles.bodyMedium}>kilograms</Text>
        </View>

        <TouchableOpacity
          style={[styles.weightButton, { backgroundColor: theme.flightCard }]}
          onPress={() => handleWeightChange(selectedWeight + 1)}
        >
          <Plus size={24} color={Colors.primary_color} />
        </TouchableOpacity>
      </View>

      {/* Slider */}
      <View style={styles.sliderContainer}>
        <View style={styles.sliderTrack}>
          <View
            style={[
              styles.sliderFill,
              { width: `${(selectedWeight / maxWeight) * 100}%` },
            ]}
          />
        </View>
        <View style={styles.sliderLabels}>
          <Text style={theme.textStyles.bodyMedium}>1kg</Text>
          <Text style={theme.textStyles.bodyMedium}>{maxWeight}kg</Text>
        </View>
      </View>

      {/* Price Display */}
      <View style={styles.priceDisplay}>
        <Text style={theme.textStyles.bodyMedium}>Price:</Text>
        <Currency
          style={[theme.textStyles.bodyMedium, { color: Colors.primary_color }]}
          amount={totalPrice}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weightSelectorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  weightControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  weightButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 0.65,
    borderColor: Colors.dark_cyan_translucent_2,
    justifyContent: "center",
    alignItems: "center",
  },
  weightDisplay: {
    width: 120,
    height: 76,
    backgroundColor: Colors.dark_cyan_translucent_3,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  sliderContainer: {
    gap: 10,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: Colors.very_light_blue,
    borderRadius: 12,
    position: "relative",
  },
  sliderFill: {
    height: 8,
    backgroundColor: Colors.primary_color,
    borderRadius: 12,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceDisplay: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
});

export default WeightSelectorCard;
