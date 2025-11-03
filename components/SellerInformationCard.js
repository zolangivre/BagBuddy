import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../theme/Colors";
import {
  MessageCircle,
  Phone,
  Plane,
  Dot,
  ArrowRight,
  Scale,
  PlaneTakeoff,
  PlaneLanding,
} from "lucide-react-native";
import ButtonIcon from "./ButtonIcon";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import { useThemeContext } from "../contexts/ThemeContext";
import { AIRPORT } from "@/constants/airports";
import LocalizedDateTime, {
  formatLocalizedDate,
} from "@/components/LocalizedDateTime";
import { useLanguage } from "@/contexts/LanguageContext";

const SellerInformationCard = ({ item }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const status = item?.status;
  const { language } = useLanguage();
  const departureAirportName = AIRPORT.find(
    (airport) => airport.value === item?.departureAirport
  )?.name;
  const arrivalAirportName = AIRPORT.find(
    (airport) => airport.value === item?.arrivalAirport
  )?.name;

  const dateDeparture = formatLocalizedDate(
    item.dateDeparture,
    language
  );
  const dateArrival = formatLocalizedDate(item.dateArrival, language);
  return (
    <>
      <View style={[styles.sellerCard, { backgroundColor: theme.flightCard }]}>
        <View style={styles.sellerAvatar}>
          <Text style={styles.sellerInitials}>KB</Text>
        </View>
        <View style={styles.sellerInfo}>
          <Text style={theme.textStyles.cardTitle}>{item?.sellerName}</Text>
          <Text style={theme.textStyles.bodyMedium}>★ 4.9 • Seller</Text>
        </View>
        <ButtonIcon
          //   onPress={}
          icon={<MessageCircle size={16} color={theme.title} />}
        />
        <ButtonIcon
          //   onPress={}
          icon={<Phone size={16} color={theme.title} />}
        />
      </View>

      {/* Flight Details */}
      <View style={styles.flightDetailsRow}>
        <Plane size={16} color={Colors.primary_color} />
        <Text style={theme.textStyles.cardTitle}>Flight number</Text>
        <Dot size={20} color={Colors.tertiary_color} />
        <Text style={theme.textStyles.bodyLarge}>{item?.flightNumber}</Text>
      </View>

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
          <Text style={[theme.textStyles.cardTitle, { textAlign: "right" }]}>
            {item?.arrivalAirport}
          </Text>
          <Text style={[theme.textStyles.bodyMedium, { textAlign: "right" }]}>
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
              <Text style={theme.textStyles.bodyMedium}>{dateDeparture}</Text>
            </View>
            <LocalizedDateTime
              date={item.dateDeparture}
              showDate={false}
              showTime={true}
              options={{ hour: "2-digit", minute: "2-digit" }}
              style={{ color: theme.title }}
            />
          </View>
        </View>
        <View style={styles.timeSection}>
          <PlaneLanding size={16} color={Colors.primary_color} />
          <View style={{ alignItems: "center" }}>
            <View style={styles.dateSection}>
              <Text style={theme.textStyles.bodyMedium}>{dateArrival}</Text>
            </View>
            <LocalizedDateTime
              date={item.dateArrival}
              showDate={false}
              showTime={true}
              options={{ hour: "2-digit", minute: "2-digit" }}
              style={{ color: theme.title }}
            />
          </View>
        </View>
      </View>

      {/* Weight and Price */}
      {status !== TRANSACTION_STATUS.CONFIRMED &&
      status !== TRANSACTION_STATUS.COMPLETED ? (
        <>
          <View style={styles.weightPriceRow}>
            <View style={styles.weightSection}>
              <Scale size={16} color={Colors.success_color} />
              <Text style={theme.textStyles.cardTitle}>
                {item.weight}kg available
              </Text>
            </View>
            <View style={styles.priceSection}>
              <Text style={theme.textStyles.number}>${item.pricePerKg}/kg</Text>
            </View>
          </View>
        </>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    marginBottom: 20,
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(14, 165, 233, 0.10)",
    justifyContent: "center",
    alignItems: "center",
  },
  sellerInitials: {
    color: Colors.primary_color,
    fontSize: 16,
    fontWeight: "400",
  },
  sellerInfo: {
    flex: 1,
  },
  flightDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
  },
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
});

export default SellerInformationCard;
