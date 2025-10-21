import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../theme/Colors";
import { Scale, Minus, Plus } from "lucide-react-native";

const WeightSelectorCard = () => {
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
        <Text style={styles.weightSelectorTitle}>Select Weight to Approve</Text>
      </View>

      <Text style={styles.weightSelectorDescription}>
        Choose how many kilograms you want to approve for this request (max 15kg
        available).
      </Text>

      {/* Weight Controls */}
      <View style={styles.weightControls}>
        <TouchableOpacity
          style={styles.weightButton}
          onPress={() => handleWeightChange(selectedWeight - 1)}
        >
          <Minus size={24} color={Colors.primary_color} />
        </TouchableOpacity>

        <View style={styles.weightDisplay}>
          <Text style={styles.weightValue}>{selectedWeight}</Text>
          <Text style={styles.weightUnit}>kilograms</Text>
        </View>

        <TouchableOpacity
          style={styles.weightButton}
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
          <Text style={styles.sliderLabel}>1kg</Text>
          <Text style={styles.sliderLabel}>15kg</Text>
        </View>
      </View>

      {/* Price Display */}
      <View style={styles.priceDisplay}>
        <Text style={styles.priceLabel}>Price:</Text>
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
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  weightSelectorDescription: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
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
    borderWidth: 0.612,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  weightDisplay: {
    width: 120,
    height: 76,
    backgroundColor: "rgba(14, 165, 233, 0.10)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  weightValue: {
    color: Colors.primary_color,
    fontSize: 24,
    fontWeight: "500",
    lineHeight: 32,
  },
  weightUnit: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  sliderContainer: {
    gap: 10,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: "#F8FAFC",
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
    color: Colors.tertiary_color,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  priceDisplay: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  priceLabel: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    textAlign: "center",
  },
  totalPriceText: {
    color: Colors.primary_color,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    textAlign: "center",
  },
});

export default WeightSelectorCard;