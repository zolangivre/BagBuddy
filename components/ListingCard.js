import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "@/theme/Colors";
import {
  ArrowRight,
  Scale,
  PlaneTakeoff,
  PlaneLanding,
  NotepadText,
} from "lucide-react-native";
import { useThemeContext } from "@/contexts/ThemeContext";
import { AIRPORT } from "@/constants/airports";
import {
  formatLocalizedDateTime,
  formatLocalizedTime,
  formatLocalizedDate,
} from "@/components/LocalizedDateTime";
import { useLanguage } from "@/contexts/LanguageContext";
import { globalStyles } from "@/theme/Styles";
import i18n from "@/i18n";
import Currency from "@/components/Currency";
import { router } from "expo-router";

const ListingCard = ({ item }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { language } = useLanguage();
  let departureAirportName;
  let timeDeparture;
  let arrivalAirportName;
  let timeArrival;
  let dateDeparture;
  let dateArrival;

  if (item) {
    departureAirportName =
      AIRPORT.find((airport) => airport.value === item?.departureAirport)
        ?.name || "???";
    arrivalAirportName =
      AIRPORT.find((airport) => airport.value === item?.arrivalAirport)?.name ||
      "???";
    dateDeparture = formatLocalizedDate(item?.departureDate, language);
    timeDeparture = formatLocalizedTime(item?.departureDate, language);
    dateArrival = formatLocalizedDate(item?.arrivalDate, language);
    timeArrival = formatLocalizedTime(item?.arrivalDate, language);
  }

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "edit-listing",
            params: { id: item?.id },
          })
        }
      >
        <View
          style={[
            globalStyles.card,
            { backgroundColor: theme.background_card },
          ]}
        >
          <Text style={[theme.textStyles.bodyMedium, { marginBottom: 10 }]}>
            {i18n.t("listed_on")}:{" "}
            {formatLocalizedDateTime(item?.createdAt, language)}
          </Text>
          {/* Route Information */}
          <View style={styles.routeContainer}>
            <View style={styles.airportSection}>
              <Text style={theme.textStyles.cardTitle}>
                {item?.departureAirport}
              </Text>
              <Text style={theme.textStyles.bodyMedium}>
                {departureAirportName}
              </Text>
            </View>

            <View style={styles.arrowSection}>
              <ArrowRight size={24} color={Colors.primary_color} />
            </View>

            <View style={styles.airportSection}>
              <Text
                style={[theme.textStyles.cardTitle, { textAlign: "right" }]}
              >
                {item?.arrivalAirport}
              </Text>
              <Text
                style={[theme.textStyles.bodyMedium, { textAlign: "right" }]}
              >
                {arrivalAirportName}
              </Text>
            </View>
          </View>

          {/* Time and Date */}
          <View style={styles.timeRow}>
            <View style={styles.timeSection}>
              <PlaneTakeoff size={16} color={Colors.primary_color} />
              <View style={{ alignItems: "center" }}>
                <View style={styles.dateSection}>
                  <Text style={theme.textStyles.bodyMedium}>
                    {dateDeparture}
                  </Text>
                </View>
                <View style={styles.dateSection}>
                  <Text style={{ color: theme.title }}>{timeDeparture}</Text>
                </View>
              </View>
            </View>
            <View style={styles.timeSection}>
              <PlaneLanding size={16} color={Colors.primary_color} />
              <View style={{ alignItems: "center" }}>
                <View style={styles.dateSection}>
                  <Text style={theme.textStyles.bodyMedium}>{dateArrival}</Text>
                </View>
                <View style={styles.dateSection}>
                  <Text style={{ color: theme.title }}>{timeArrival}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "column", gap: 5, marginBottom: 20 }}>
            <View style={[styles.contentRow, { gap: 5 }]}>
              <NotepadText size={16} color={Colors.primary_color} />
              <Text style={theme.textStyles.cardTitle}>
                {i18n.t("conditions")}
              </Text>
            </View>
            <View style={[styles.contentColumn, { gap: 10 }]}>
              <Text
                style={[theme.textStyles.bodyMedium, { textAlign: "justify" }]}
              >
                {item?.conditions}
              </Text>
            </View>
          </View>

          {/* Weight and Price */}
          <View style={styles.weightPriceRow}>
            <View style={styles.weightSection}>
              <Scale size={16} color={Colors.success_color} />
              <Text style={theme.textStyles.cardTitle}>
                {item?.remainingWeight}kg {i18n.t("available")}
              </Text>
            </View>
            <View style={styles.priceSection}>
              <Text style={theme.textStyles.number}>
                <Currency amount={item?.pricePerKg} />
                /kg
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  airportSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  arrowSection: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  airportCodeRight: {
    textAlign: "right",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  timeSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateSection: {
    justifyContent: "center",
    alignItems: "center",
  },
  weightPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.65,
    borderTopColor: "#E2E8F0",
    paddingTop: 16,
  },
  weightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  priceSection: {
    flex: 1,
    alignItems: "flex-end",
  },
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

export default ListingCard;
