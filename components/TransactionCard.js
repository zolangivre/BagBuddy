import Colors from "../theme/Colors";
import { View, Text, StyleSheet } from "react-native";
import { ArrowRight, Weight } from "lucide-react-native";
import Avatar from "./Avatar";
import UserBadge from "./UserBadge";
import StatusBadge from "./StatusBadge";
import FlightInfoCard from "./FlightInfoCard";

const TransactionCard = ({ transaction }) => {
  return (
    <View style={transactionCardStyles.container}>
      {/* User Info Row */}
      <View style={transactionCardStyles.userRow}>
        <View style={transactionCardStyles.userInfo}>
          <Avatar initials={transaction.userInitials} />
          <View style={transactionCardStyles.userDetails}>
            <Text style={transactionCardStyles.userName}>
              {transaction.userName}
            </Text>
            <UserBadge type={transaction.type} />
          </View>
        </View>
        <View style={transactionCardStyles.statusContainer}>
          <StatusBadge
            status={transaction.status}
            text={transaction.statusText}
          />
          <ArrowRight size={16} color={Colors.tertiary_color} />
        </View>
      </View>

      {/* Flight Info */}
      {/* <View style={transactionCardStyles.flightInfo}>
        <View style={transactionCardStyles.flightHeader}>
          <View style={transactionCardStyles.flightNumberContainer}>
            <View style={transactionCardStyles.flightIcon}>
              <Plane size={16} color={Colors.primary_color} />
            </View>
            <Text style={transactionCardStyles.flightNumber}>
              {transaction.flightNumber}
            </Text>
          </View>
          <View style={transactionCardStyles.dateBadge}>
            <Text style={transactionCardStyles.dateText}>
              {transaction.date}
            </Text>
          </View>
        </View>

        <View style={transactionCardStyles.routeContainer}>
          <View style={transactionCardStyles.routeInfo}>
            <View style={transactionCardStyles.airportContainer}>
              <Text style={transactionCardStyles.airportCode}>
                {transaction.departure}
              </Text>
              <Text style={transactionCardStyles.routeLabel}>Departure</Text>
            </View>
            <View style={transactionCardStyles.arrowContainer}>
              <ArrowRight size={20} color={Colors.primary_color} />
              <View style={transactionCardStyles.routeLine} />
            </View>
            <View style={transactionCardStyles.airportContainer}>
              <Text style={transactionCardStyles.airportCode}>
                {transaction.arrival}
              </Text>
              <Text style={transactionCardStyles.routeLabel}>Arrival</Text>
            </View>
          </View>
          <View style={transactionCardStyles.timeContainer}>
            <Clock size={16} color={Colors.tertiary_color} />
            <Text style={transactionCardStyles.timeText}>
              {transaction.time}
            </Text>
          </View>
        </View>
      </View> */}
      <FlightInfoCard item={transaction} />

      {/* Weight and Price Info */}
      <View style={transactionCardStyles.priceRow}>
        <View style={transactionCardStyles.weightContainer}>
          <Weight size={20} color={Colors.primary_color} />
          <Text style={transactionCardStyles.weightText}>
            {transaction.weight}
          </Text>
        </View>
        <View style={transactionCardStyles.rateContainer}>
          <Text style={transactionCardStyles.rateLabel}>Rate</Text>
          <Text style={transactionCardStyles.rateValue}>
            {transaction.rate}
          </Text>
        </View>
        <View style={transactionCardStyles.totalContainer}>
          <Text style={transactionCardStyles.totalLabel}>Total</Text>
          <Text style={transactionCardStyles.totalValue}>
            {transaction.total}
          </Text>
        </View>
      </View>
    </View>
  );
};

const transactionCardStyles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    gap: 20,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userDetails: {
    marginLeft: 10,
    flex: 1,
  },
  userName: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    letterSpacing: -0.312,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
//   flightInfo: {
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     backgroundColor: "rgba(224, 242, 254, 0.20)",
//     borderRadius: 16,
//     borderWidth: 0.612,
//     borderColor: "rgba(224, 242, 254, 0.20)",
//     gap: 12,
//   },
//   flightHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   flightNumberContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   flightIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "rgba(14, 165, 233, 0.10)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   flightNumber: {
//     color: Colors.secondary_color,
//     fontSize: 16,
//     fontWeight: "700",
//     lineHeight: 24,
//     letterSpacing: -0.312,
//   },
//   dateBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     backgroundColor: "rgba(255, 255, 255, 0.50)",
//     borderRadius: 10,
//     borderWidth: 0.612,
//     borderColor: "#E2E8F0",
//   },
//   dateText: {
//     color: Colors.secondary_color,
//     fontSize: 12,
//     fontWeight: "500",
//     lineHeight: 16,
//   },
//   routeContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   routeInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   airportContainer: {
//     alignItems: "center",
//   },
//   airportCode: {
//     color: Colors.secondary_color,
//     fontSize: 18,
//     fontWeight: "700",
//     lineHeight: 28,
//     letterSpacing: -0.439,
//   },
//   routeLabel: {
//     color: Colors.tertiary_color,
//     fontSize: 12,
//     fontWeight: "400",
//     lineHeight: 16,
//   },
//   arrowContainer: {
//     alignItems: "center",
//     gap: 4,
//   },
//   routeLine: {
//     width: 32,
//     height: 1,
//     backgroundColor: "rgba(14, 165, 233, 0.30)",
//   },
//   timeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   timeText: {
//     color: Colors.tertiary_color,
//     fontSize: 14,
//     fontWeight: "400",
//     lineHeight: 20,
//     letterSpacing: -0.15,
//   },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  weightText: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  rateContainer: {
    alignItems: "center",
    flex: 1,
  },
  rateLabel: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
    marginBottom: 4,
  },
  rateValue: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  totalContainer: {
    alignItems: "flex-end",
    flex: 1,
  },
  totalLabel: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
    marginBottom: 4,
  },
  totalValue: {
    color: Colors.primary_color,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    letterSpacing: -0.449,
  },
});

export default TransactionCard;
