import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  ArrowRight,
  PlaneTakeoff,
  PlaneLanding,
} from "lucide-react-native";
import Colors from "../theme/Colors";
import { useThemeContext } from "../contexts/ThemeContext";
import i18n from "@/i18n";
import Label from "./Label";
import LocalizedDateTime, {
  formatLocalizedDate,
} from "@/components/LocalizedDateTime";
import { useLanguage } from "@/contexts/LanguageContext";

const FlightInfoCard = ({ item }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { language } = useLanguage();

  const dateDeparture = formatLocalizedDate(item.dateDeparture, language);
  const dateArrival = formatLocalizedDate(item.dateArrival, language);
  return (
    <View
      style={[
        styles.flightInfoContainer,
        { backgroundColor: theme.flightCard },
      ]}
    >
      <View style={styles.flightHeader}>
        <View style={styles.routeInfo}>
          <View style={styles.airportContainer}>
            <Text style={theme.textStyles.titleMedium}>
              {item.departureAirport}
            </Text>
            <Text style={theme.textStyles.bodySmall}>
              {i18n.t("departure")}
            </Text>
          </View>
          <View style={styles.arrowContainer}>
            <ArrowRight size={20} color={Colors.primary_color} />
            <View style={styles.routeLine} />
          </View>
          <View style={styles.airportContainer}>
            <Text style={theme.textStyles.titleMedium}>
              {item.arrivalAirport}
            </Text>
            <Text style={theme.textStyles.bodySmall}>{i18n.t("arrival")}</Text>
          </View>
        </View>
      </View>
      <View style={styles.dateTimeContainer}>
        <View style={styles.iconTime}>
          <PlaneTakeoff size={16} color={Colors.primary_color} />
          <LocalizedDateTime
            date={item.dateDeparture}
            showDate={false}
            showTime={true}
            options={{ hour: "2-digit", minute: "2-digit" }}
            style={{ color: theme.text }}
          />
        </View>
        <Label
          text={dateDeparture}
          backgroundColor={theme.background_card}
          colorText={theme.title}
          borderColor={Colors.dark_blue_grey}
        />
      </View>
      <View style={styles.dateTimeContainer}>
        <View style={styles.iconTime}>
          <PlaneLanding size={16} color={Colors.primary_color} />
          <LocalizedDateTime
            date={item.dateArrival}
            showDate={false}
            showTime={true}
            options={{ hour: "2-digit", minute: "2-digit" }}
            style={{ color: theme.text }}
          />
        </View>
        <Label
          text={dateArrival}
          backgroundColor={theme.background_card}
          colorText={theme.title}
          borderColor={Colors.dark_blue_grey}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flightInfoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
  },
  flightHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  flightNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  routeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  airportContainer: {
    alignItems: "center",
  },
  arrowContainer: {
    alignItems: "center",
    gap: 4,
  },
  routeLine: {
    width: 32,
    height: 1,
    backgroundColor: Colors.dark_cyan_translucent_2,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  iconTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});

export default FlightInfoCard;
