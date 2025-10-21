import { View, Text, StyleSheet } from "react-native";
import { CheckCircle, Clock, Send } from "lucide-react-native";

const StatusBadge = ({ status, text }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "confirmed":
        return {
          backgroundColor: "rgba(16, 185, 129, 0.10)",
          borderColor: "rgba(16, 185, 129, 0.20)",
          textColor: "#10B981",
          icon: <CheckCircle size={16} color="#10B981" />,
        };
      case "pending":
        return {
          backgroundColor: "rgba(14, 165, 233, 0.10)",
          borderColor: "rgba(14, 165, 233, 0.20)",
          textColor: "#0EA5E9",
          icon: <Clock size={16} color="#0EA5E9" />,
        };
      case "sent":
        return {
          backgroundColor: "rgba(245, 158, 11, 0.10)",
          borderColor: "rgba(245, 158, 11, 0.20)",
          textColor: "#F59E0B",
          icon: <Send size={16} color="#F59E0B" />,
        };
      default:
        return {
          backgroundColor: "rgba(14, 165, 233, 0.10)",
          borderColor: "rgba(14, 165, 233, 0.20)",
          textColor: "#0EA5E9",
          icon: null,
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <View
      style={[
        statusBadgeStyles.container,
        {
          backgroundColor: styles.backgroundColor,
          borderColor: styles.borderColor,
        },
      ]}
    >
      {styles.icon}
      <Text style={[statusBadgeStyles.text, { color: styles.textColor }]}>
        {text}
      </Text>
    </View>
  );
};

const statusBadgeStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    gap: 7,
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default StatusBadge;