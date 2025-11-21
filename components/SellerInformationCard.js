import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/theme/Colors";
import {
  MessageCircle,
  Phone,
  ArrowRight,
  Scale,
  PlaneTakeoff,
  PlaneLanding,
} from "lucide-react-native";
import ButtonIcon from "@/components/ButtonIcon";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import { useThemeContext } from "@/contexts/ThemeContext";
import { AIRPORT } from "@/constants/airports";
import {
  formatLocalizedDate,
  formatLocalizedTime,
} from "@/components/LocalizedDateTime";
import { useLanguage } from "@/contexts/LanguageContext";
import { globalStyles } from "@/theme/Styles";
import i18n from "@/i18n";
import Currency from "@/components/Currency";
import { AuthContext } from "@/contexts/AuthContext";

const SellerInformationCard = ({ item }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { language } = useLanguage();
  const { state } = useContext(AuthContext);
  const userInfo = state.userInfo;
  let departureAirportName;
  let timeDeparture;
  let arrivalAirportName;
  let timeArrival;
  let dateDeparture;
  let dateArrival;
  let sellerName;
  let buyerName;
  let role;
  let status;

  if (item) {
    departureAirportName =
      AIRPORT.find(
        (airport) => airport.value === item?.listingInfo?.departureAirport
      )?.name || "???";
    arrivalAirportName =
      AIRPORT.find(
        (airport) => airport.value === item?.listingInfo?.arrivalAirport
      )?.name || "???";
    dateDeparture = formatLocalizedDate(
      item?.listingInfo?.departureDate,
      language
    );
    timeDeparture = formatLocalizedTime(
      item?.listingInfo?.departureDate,
      language
    );
    dateArrival = formatLocalizedDate(item?.listingInfo?.arrivalDate, language);
    timeArrival = formatLocalizedTime(item?.listingInfo?.arrivalDate, language);
    sellerName = item?.listingInfo?.userInfo?.name || "???";
    buyerName = item?.buyerInfo?.name || "???";
    role = item.sellerId === userInfo.sub ? "seller" : "buyer";
    if (role === "seller") {
      status = item?.sellerStatus;
    } else {
      status = item?.buyerStatus;
    }
  }
  return (
    <View
      style={[globalStyles.card, { backgroundColor: theme.background_card }]}
    >
      <View style={[styles.sellerCard, { backgroundColor: theme.flightCard }]}>
        <View style={styles.sellerAvatar}>
          <Text style={styles.sellerInitials}>{role === "seller" ? buyerName?.charAt(0) : sellerName?.charAt(0)}</Text>
        </View>
        <View style={styles.sellerInfo}>
          {role === "seller" ? (
            <Text style={theme.textStyles.cardTitle}>{buyerName}</Text>
          ) : (
            <Text style={theme.textStyles.cardTitle}>{sellerName}</Text>
          )}
          <Text style={theme.textStyles.bodyMedium}>★ 4.9 • {role === "seller" ? i18n.t("buyer") : i18n.t("seller")}</Text>
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

      {/* Route Information */}
      <View style={styles.routeContainer}>
        <View style={styles.airportSection}>
          <Text style={theme.textStyles.cardTitle}>
            {item?.listingInfo?.departureAirport}
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
            {item?.listingInfo?.arrivalAirport}
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

      {/* Weight and Price */}
      {status !== TRANSACTION_STATUS.CONFIRMED &&
      status !== TRANSACTION_STATUS.COMPLETED ? (
        <>
          <View style={styles.weightPriceRow}>
            <View style={styles.weightSection}>
              <Scale size={16} color={Colors.success_color} />
              <Text style={theme.textStyles.cardTitle}>
                {item?.listingInfo?.remainingWeight}kg {i18n.t("available")}
              </Text>
            </View>
            <View style={styles.priceSection}>
              <Text style={theme.textStyles.number}>
                <Currency amount={item?.listingInfo?.pricePerKg} />
                /kg
              </Text>
            </View>
          </View>
        </>
      ) : null}
    </View>
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
