import { View, Text, StyleSheet } from "react-native";
import { NotepadText } from "lucide-react-native";
import Colors from "@/theme/Colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import { globalStyles } from "@/theme/Styles";
import i18n from "@/i18n";

export default function ListingConditionsCard({ transaction }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const listing = transaction.listingInfo;

  return (
    <View
      style={[globalStyles.card, { backgroundColor: theme.background_card }]}
    >
      <View style={styles.containerMeetingDetails}>
        <View style={[styles.contentRow, { gap: 5 }]}>
          <NotepadText size={24} color={Colors.primary_color} />
          <Text style={theme.textStyles.cardTitle}>{i18n.t("conditions")}</Text>
        </View>
        <View style={[styles.contentColumn, { gap: 10 }]}>
          <Text style={theme.textStyles.bodyMedium}>{listing?.conditions || i18n.t("no_conditions")}</Text>
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
