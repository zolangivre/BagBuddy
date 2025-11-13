import { Text, StyleSheet, View } from "react-native";

const Label = ({ text, borderColor = "rgba(255, 255, 255, 0)", backgroundColor, icon, colorText }) => {
  return (
    <View style={[styles.badge, { borderColor, backgroundColor }]}>
      {icon && <View style={{ marginRight: 5 }}>{icon}</View>}
      <Text style={[styles.badgeText, { color: colorText }]}>{text}</Text>
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
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default Label;
