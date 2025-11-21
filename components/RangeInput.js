import React from "react";
import { View, StyleSheet, Text } from "react-native";
import NumberInput from "@/components/NumberInput";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";

const RangeInput = ({
  label,
  minValue,
  maxValue,
  onChange,
  min = 0,
  max = 1000,
  step = 1,
  unit = "",
  error = null,
}) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const handleMinChange = (val) => {
    if (!val || val === "") {
      onChange && onChange([null, maxValue]);
      return;
    }
    let number = parseInt(val, 10);
    if (maxValue !== null && number > maxValue) number = maxValue;
    if (number < min) number = min;
    onChange && onChange([number, maxValue]);
  };

  const handleMaxChange = (val) => {
    if (!val || val === "") {
      onChange && onChange([minValue, null]);
      return;
    }
    let number = parseInt(val, 10);
    if (minValue !== null && number < minValue) number = minValue;
    if (number > max) number = max;
    onChange && onChange([minValue, number]);
  };

  return (
    <View style={{ marginVertical: 12, gap: 6 }}>
      {label && <Text style={theme.textStyles.cardTitle}>{label}</Text>}

      <View style={styles.row}>
        <NumberInput
          label="Min"
          value={minValue !== null ? minValue?.toString() : ""}
          onChangeText={handleMinChange}
          min={min}
          max={max}
          placeholder="0"
        />
        <NumberInput
          label="Max"
          value={maxValue !== null ? maxValue?.toString() : ""}
          onChangeText={handleMaxChange}
          min={min}
          max={max}
          placeholder="50"
        />
      </View>

      {error && <Text style={theme.textStyles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
});

export default RangeInput;
