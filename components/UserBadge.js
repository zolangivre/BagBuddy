import { View, Text, StyleSheet } from "react-native";

const UserBadge = ({ type }) => {
  const isBuying = type === "buying";
  return (
    <View
      style={[
        userBadgeStyles.container,
        {
          backgroundColor: isBuying
            ? "rgba(14, 165, 233, 0.10)"
            : "rgba(16, 185, 129, 0.05)",
        },
      ]}
    >
      <Text
        style={[
          userBadgeStyles.text,
          { color: isBuying ? "#0EA5E9" : "#10B981" },
        ]}
      >
        {isBuying ? "Buying" : "Selling"}
      </Text>
    </View>
  );
};

const userBadgeStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 0.612,
    borderColor: "rgba(0, 0, 0, 0.00)",
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
});

export default UserBadge;
