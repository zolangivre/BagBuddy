import { View, Text, StyleSheet } from "react-native";
import { MapPin, Calendar, Weight } from "lucide-react-native";
import Currency from "@/components/Currency";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import { globalStyles } from "@/theme/Styles";
import i18n from "@/i18n";

export default function MeetingDetailsCard({ transaction }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <View
      style={[globalStyles.card, { backgroundColor: theme.background_card }]}
    >
      <View style={styles.containerMeetingDetails}>
        <View style={[styles.contentRow, { gap: 5 }]}>
          <MapPin size={24} color={Colors.primary_color} />
          <Text style={theme.textStyles.cardTitle}>
            {i18n.t("meeting_details")}
          </Text>
        </View>
        <View style={[styles.contentColumn, { gap: 10 }]}>
          <View style={styles.contentRow}>
            <MapPin size={16} color={Colors.primary_color} />
            <View style={styles.contentColumn}>
              <Text style={theme.textStyles.cardTitle}>
                {i18n.t("meeting_details_step_one")}
              </Text>
              <Text style={theme.textStyles.bodyMedium}>Emirates - EK 203</Text>
            </View>
          </View>
          <View style={styles.contentRow}>
            <Calendar size={16} color={Colors.primary_color} />
            <View style={styles.contentColumn}>
              <Text style={theme.textStyles.cardTitle}>
                {transaction?.listingInfo?.dateDeparture}
              </Text>
              <Text style={theme.textStyles.bodyMedium}>
                {i18n.t("meeting_details_step_two_description", {
                  time: "14:30",
                })}
              </Text>
            </View>
          </View>
          <View style={styles.contentRow}>
            <Weight size={16} color={Colors.primary_color} />
            <View style={styles.contentColumn}>
              <Text style={theme.textStyles.cardTitle}>
                {i18n.t("meeting_details_step_three", { weight: "8kg" })}
              </Text>
              <Currency
                amount={transaction?.total}
                style={theme.textStyles.bodyMedium}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerMeetingDetails: {
    gap: 20,
  },
  contentColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 4,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
