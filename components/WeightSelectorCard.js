import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../theme/Colors";
import { Scale, Minus, Plus } from "lucide-react-native";
import { useThemeContext } from "../contexts/ThemeContext";

const WeightSelectorCard = () => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [selectedWeight, setSelectedWeight] = useState(7);
  const pricePerKg = 12;
  const maxWeight = 15;

  const handleWeightChange = (newWeight) => {
    if (newWeight >= 1 && newWeight <= maxWeight) {
      setSelectedWeight(newWeight);
    }
  };

  const totalPrice = selectedWeight * pricePerKg;
  return (
    <>
      <View style={styles.weightSelectorHeader}>
        <Scale size={24} color={Colors.primary_color} />
        <Text style={[styles.weightSelectorTitle, { color: theme.title }]}>
          Select Weight to Approve
        </Text>
      </View>

      <Text style={[styles.weightSelectorDescription, { color: theme.text }]}>
        Choose how many kilograms you want to approve for this request (max 15kg
        available).
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
          <Text style={styles.weightValue}>{selectedWeight}</Text>
          <Text style={[styles.weightUnit, { color: theme.text }]}>kilograms</Text>
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
          <Text style={[styles.sliderLabel, { color: theme.text }]}>1kg</Text>
          <Text style={[styles.sliderLabel, { color: theme.text }]}>15kg</Text>
        </View>
      </View>

      {/* Price Display */}
      <View style={styles.priceDisplay}>
        <Text style={[styles.priceLabel, { color: theme.text }]}>Price:</Text>
        <Text style={styles.totalPriceText}>${totalPrice.toFixed(2)}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  weightSelectorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  weightSelectorTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  weightSelectorDescription: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
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
    borderWidth: 0.650,
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
  weightValue: {
    color: Colors.primary_color,
    fontSize: 24,
    fontWeight: "500",
  },
  weightUnit: {
    fontSize: 14,
    fontWeight: "400",
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
  sliderLabel: {
    fontSize: 12,
    fontWeight: "400",
  },
  priceDisplay: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },
  totalPriceText: {
    color: Colors.primary_color,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default WeightSelectorCard;