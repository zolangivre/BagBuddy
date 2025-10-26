import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Plane, ArrowRight, Clock } from "lucide-react-native";
import Colors from "../theme/Colors";
import RoundIconText from "./RoundIconText";
import { useThemeContext } from "../contexts/ThemeContext";
import i18n from "@/i18n";
import Label from "./Label";
import LocalizedDateTime,{
  formatLocalizedDate,
  formatLocalizedTime,
} from "@/components/LocalizedDateTime";
import { useLanguage } from "@/contexts/LanguageContext";


const FlightInfoCard = ({ item }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { language } = useLanguage();

  const dateText = formatLocalizedDate("2025-12-20T23:30:00Z", language);

  return (
    <View
      style={[
        styles.flightInfoContainer,
        { backgroundColor: theme.flightCard },
      ]}
    >
      <View style={styles.flightHeader}>
        <View style={styles.flightNumberContainer}>
          <RoundIconText
            icon={<Plane size={20} color={Colors.primary_color} />}
            backgroundColor={Colors.dark_cyan_translucent}
            size={32}
          />
          <Text style={[styles.flightNumber, { color: theme.title }]}>
            {item.flightNumber}
          </Text>
        </View>
        <Label
          text={dateText}
          backgroundColor={theme.background_card}
          colorText={theme.title}
          borderColor={Colors.dark_blue_grey}
        />
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeInfo}>
          <View style={styles.airportContainer}>
            <Text style={[styles.airportCode, { color: theme.title }]}>
              {item.departure}
            </Text>
            <Text style={[styles.routeLabel, { color: theme.text }]}>
              {i18n.t("departure")}
            </Text>
          </View>
          <View style={styles.arrowContainer}>
            <ArrowRight size={20} color={Colors.primary_color} />
            <View style={styles.routeLine} />
          </View>
          <View style={styles.airportContainer}>
            <Text style={[styles.airportCode, { color: theme.title }]}>
              {item.arrival}
            </Text>
            <Text style={[styles.routeLabel, { color: theme.text }]}>
              {i18n.t("arrival")}
            </Text>
          </View>
        </View>
        <View style={styles.timeContainer}>
          <Clock size={16} color={Colors.tertiary_color} />
          {/* <Text style={{ color: theme.text }}>
            {item.date}
          </Text> */}
          <LocalizedDateTime
            date={item.date}
            showDate={false}
            showTime={true}
            options={{ hour: "2-digit", minute: "2-digit",  }}
            style={{ color: theme.text }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flightInfoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
  },
  flightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  flightNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flightNumber: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "700",
  },
  dateText: {
    color: Colors.secondary_color,
    fontSize: 12,
    fontWeight: "500",
  },
  routeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  airportContainer: {
    alignItems: "center",
  },
  airportCode: {
    color: Colors.secondary_color,
    fontSize: 18,
    fontWeight: "700",
  },
  routeLabel: {
    color: Colors.tertiary_color,
    fontSize: 12,
    fontWeight: "400",
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
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});

export default FlightInfoCard;
