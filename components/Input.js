import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Colors from "../theme/Colors";
import { useThemeContext } from "../contexts/ThemeContext";

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  leftIcon = null,
  rightIcon = null,
  onRightIconPress = null,
  secureTextEntry = false,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  error = null,
  ...props
}) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={[styles.label, { color: theme.text }]}> {label}</Text>
      ) : null}

      <View style={[styles.inputRow, error && styles.inputErrorRow]}>
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
        <TextInput
          style={[styles.input, multiline && styles.multiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          placeholderTextColor={theme.text}
          backgroundColor={theme.flightCard}
          color={theme.title}
          {...props}
        />

        {rightIcon ? (
          onRightIconPress ? (
            <TouchableOpacity
              onPress={onRightIconPress}
              style={styles.rightIcon}
            >
              {rightIcon}
            </TouchableOpacity>
          ) : (
            <View style={styles.rightIcon}>{rightIcon}</View>
          )
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
    alignSelf: "stretch",
  },
  label: {
    fontSize: 14,
    color: Colors.secondary_color,
    marginBottom: 6,
    fontWeight: "500",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
  },
  inputErrorRow: {
    borderColor: "#EF4444",
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: 48,
    backgroundColor: Colors.very_light_blue,
    borderRadius: 16,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: "400",
    color: Colors.secondary_color,
  },
  multiline: {
    height: "auto",
    paddingVertical: 10,
    textAlignVertical: "top",
  },
  error: {
    color: "#EF4444",
    marginTop: 6,
    fontSize: 13,
  },
});

Input.displayName = "Input";

export default Input;
