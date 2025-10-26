import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import { Scale } from "lucide-react-native";
import i18n from "@/i18n";

const NumberInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  min = 0,
  max = 200,
  icon,
}) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const handleChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    if (numericValue === "") {
      onChangeText("");
    } else {
      let number = parseInt(numericValue, 10);
      if (number < min) number = min;
      if (number > max) number = max;
      onChangeText(number.toString());
    }
  };

  const increment = () => {
    let number = parseInt(value || "0", 10) + 1;
    if (number > max) number = max;
    onChangeText(number.toString());
  };

  const decrement = () => {
    let number = parseInt(value || "0", 10) - 1;
    if (number < min) number = min;
    onChangeText(number.toString());
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        {icon}
        {label && (
          <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        )}
      </View>

      <View style={[styles.inputRow, { backgroundColor: theme.flightCard }]}>
        <TouchableOpacity style={styles.arrow} onPress={decrement}>
          <Text style={[styles.arrowText, { color: theme.title }]}>-</Text>
        </TouchableOpacity>

        <TextInput
          style={[styles.input, { color: theme.title }]}
          value={value?.toString()}
          onChangeText={handleChange}
          keyboardType="numeric"
          placeholder={placeholder}
        />

        <TouchableOpacity style={styles.arrow} onPress={increment}>
          <Text style={[styles.arrowText, { color: theme.title }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
  },
  arrow: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    fontSize: 20,
    fontWeight: "600",
  },
});

export default NumberInput;
