import React, { useState, useEffect } from "react";
import { View, Modal, TouchableOpacity, StyleSheet, Text } from "react-native";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";
import AirportInputModal from "./AirportInputModal";
import Button from "@/components/Button";
import RangeInput from "@/components/RangeInput";
import { X } from "lucide-react-native";

const FilterModal = ({ visible, onClose, onApply, appliedFilters }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [fromAirport, setFromAirport] = useState("");
  const [toAirport, setToAirport] = useState("");
  const [priceRange, setPriceRange] = useState([null, null]);
  const [weightRange, setWeightRange] = useState([null, null]);

  useEffect(() => {
    if (visible && appliedFilters) {
      setFromAirport(appliedFilters.from || "");
      setToAirport(appliedFilters.to || "");

      const newPriceRange = [
        appliedFilters.minPrice ?? null,
        appliedFilters.maxPrice ?? null,
      ];
      const newWeightRange = [
        appliedFilters.minWeight ?? null,
        appliedFilters.maxWeight ?? null,
      ];

      setPriceRange(newPriceRange);
      setWeightRange(newWeightRange);
    }
  }, [visible, appliedFilters]);

  const handleApply = () => {
    const filters = {};

    if (fromAirport) filters.from = fromAirport;
    if (toAirport) filters.to = toAirport;
    if (priceRange[0] !== null) filters.minPrice = priceRange[0];
    if (priceRange[1] !== null) filters.maxPrice = priceRange[1];
    if (weightRange[0] !== null) filters.minWeight = weightRange[0];
    if (weightRange[1] !== null) filters.maxWeight = weightRange[1];

    onApply(Object.keys(filters).length > 0 ? filters : null);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.background_card },
          ]}
        >
          <View style={styles.header}>
            <Text style={theme.textStyles.cardTitle}>{i18n.t("filters")}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={Colors.error_color} />
            </TouchableOpacity>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.rowInputGroup}>
              <AirportInputModal
                label={i18n.t("from")}
                value={fromAirport}
                onChangeText={setFromAirport}
                placeholder={i18n.t("origin")}
              />
              <AirportInputModal
                label={i18n.t("to")}
                value={toAirport}
                onChangeText={setToAirport}
                placeholder={i18n.t("destination")}
              />
            </View>
          </View>

          <RangeInput
            label={i18n.t("price_range")}
            minValue={priceRange[0]}
            maxValue={priceRange[1]}
            min={0}
            max={50}
            unit="$"
            onChange={setPriceRange}
          />

          <RangeInput
            label={i18n.t("weight_range")}
            minValue={weightRange[0]}
            maxValue={weightRange[1]}
            min={0}
            max={30}
            unit="kg"
            onChange={setWeightRange}
          />

          <Button text={i18n.t("apply_filters")} onPress={handleApply} />
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  modalContent: { borderRadius: 16, padding: 20, maxHeight: "90%" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardContent: { gap: 16, marginBottom: 12 },
  rowInputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
});
