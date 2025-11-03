import { Text, StyleSheet, View } from "react-native";
import Colors from "../theme/Colors";
import { useThemeContext } from "../contexts/ThemeContext";

const Label = ({ text, borderColor = "rgba(255, 255, 255, 0)", backgroundColor, icon, colorText }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <View style={[styles.badge, { borderColor, backgroundColor }]}>
      {icon && <View style={{ marginRight: 5 }}>{icon}</View>}
      <Text style={[theme.textStyles.badgeText, { color: colorText }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
});

export default Label;
