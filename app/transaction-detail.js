import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Send } from "lucide-react-native";
import Colors from "../theme/Colors";
import Button from "../components/Button";
import TransactionProgressCard from "../components/TransactionProgressCard";
import SellerInformationCard from "../components/SellerInformationCard";
import WeightSelectorCard from "../components/WeightSelectorCard";
import Label from "../components/Label";
import StatusCard from "../components/StatusCard";

export default function TransactionDetailScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color={Colors.secondary_color} />
            </TouchableOpacity>

            <View style={styles.headerInfo}>
              <Text style={styles.flightTitle}>Flight EK 203</Text>
              <Text style={styles.flightRoute}>DXB → JFK</Text>
            </View>
            {/* <Label name="Browse listing" />
            <Label name="Waiting for response" /> */}
            {/* <Label name="Request rejected" /> */}
            {/* <Label name="Payment required" /> */}
            {/* <Label name="Confirmed" /> */}
            {/* <Label name="Completed" /> */}
            {/* <Label name="Cancelled" /> */}
            {/* <Label name="Reservation received" /> */}
            <Label name="Awaiting payment" />
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Transaction Progress Card */}
          <View style={styles.card}>
            <TransactionProgressCard step={0} />
          </View>

          {/* Seller Information Card */}
          <View style={styles.card}>
            <SellerInformationCard />
          </View>

          {/* Ready to Reserve Weight */}
          {/* <View style={styles.reserveCard}>
            <View style={styles.reserveIcon}>
              <Luggage size={60} color={Colors.primary_color} />
            </View>
            <Text style={styles.reserveTitle}>Ready to Reserve Weight?</Text>
            <Text style={styles.reserveDescription}>
              Send a reservation request to secure baggage weight for your
              flight.
            </Text>
          </View> */}
          <StatusCard />

          {/* Weight Selector */}
          <View style={styles.weightSelectorCard}>
            <WeightSelectorCard />
          </View>
          {/* Send Request Button */}
          <Button
            text="Send reservation request"
            rightIcon={<Send size={24} color="#FFFFFF" />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 0.612,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
  },
  flightTitle: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  flightRoute: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  content: {
    padding: 16,
    gap: 15,
  },
  // sellerCard: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   gap: 12,
  //   padding: 12,
  //   borderRadius: 16,
  //   backgroundColor: "rgba(224, 242, 254, 0.30)",
  //   marginBottom: 20,
  // },
  // sellerAvatar: {
  //   width: 40,
  //   height: 40,
  //   borderRadius: 20,
  //   backgroundColor: "rgba(14, 165, 233, 0.10)",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // sellerInitials: {
  //   color: Colors.primary_color,
  //   fontSize: 16,
  //   fontWeight: "400",
  //   lineHeight: 24,
  //   letterSpacing: -0.312,
  // },
  // sellerInfo: {
  //   flex: 1,
  // },
  // sellerName: {
  //   color: Colors.secondary_color,
  //   fontSize: 16,
  //   fontWeight: "500",
  //   lineHeight: 24,
  //   letterSpacing: -0.312,
  // },
  // sellerRating: {
  //   color: Colors.tertiary_color,
  //   fontSize: 14,
  //   fontWeight: "400",
  //   lineHeight: 20,
  //   letterSpacing: -0.15,
  // },
  // contactButton: {
  //   width: 36,
  //   height: 36,
  //   borderRadius: 10,
  //   borderWidth: 0.612,
  //   borderColor: "#E2E8F0",
  //   backgroundColor: "#FFFFFF",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // flightDetailsRow: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   gap: 5,
  //   marginBottom: 20,
  // },
  // airlineName: {
  //   color: Colors.secondary_color,
  //   fontSize: 16,
  //   fontWeight: "500",
  //   lineHeight: 24,
  //   letterSpacing: -0.312,
  // },
  // flightNumber: {
  //   color: Colors.tertiary_color,
  //   fontSize: 16,
  //   fontWeight: "400",
  //   lineHeight: 24,
  //   letterSpacing: -0.312,
  // },
  // routeContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   marginBottom: 20,
  // },
  // airportSection: {
  //   flex: 1,
  // },
  // arrowSection: {
  //   justifyContent: "center",
  //   alignItems: "center",
  //   flex: 1,
  // },
  // airportCode: {
  //   color: Colors.secondary_color,
  //   fontSize: 16,
  //   fontWeight: "500",
  //   lineHeight: 24,
  //   letterSpacing: -0.312,
  // },
  // airportCodeRight: {
  //   textAlign: "right",
  // },
  // airportName: {
  //   color: Colors.tertiary_color,
  //   fontSize: 14,
  //   fontWeight: "400",
  //   lineHeight: 20,
  //   letterSpacing: -0.15,
  //   width: 81,
  // },
  // airportNameRight: {
  //   textAlign: "right",
  //   width: 107,
  // },
  // timeRow: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginBottom: 20,
  // },
  // timeSection: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   gap: 4,
  //   flex: 1,
  // },
  // dateSection: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // timeText: {
  //   color: Colors.secondary_color,
  //   fontSize: 14,
  //   fontWeight: "500",
  //   lineHeight: 20,
  //   letterSpacing: -0.15,
  // },
  // dateText: {
  //   color: Colors.tertiary_color,
  //   fontSize: 14,
  //   fontWeight: "400",
  //   lineHeight: 20,
  //   letterSpacing: -0.15,
  // },
  // weightPriceRow: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   borderTopWidth: 0.612,
  //   borderTopColor: "#E2E8F0",
  //   paddingTop: 16,
  // },
  // weightSection: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   gap: 4,
  //   flex: 1,
  // },
  // weightText: {
  //   color: Colors.secondary_color,
  //   fontSize: 14,
  //   fontWeight: "500",
  //   lineHeight: 20,
  //   letterSpacing: -0.15,
  // },
  // priceSection: {
  //   flex: 1,
  //   alignItems: "flex-end",
  // },
  // priceText: {
  //   color: Colors.primary_color,
  //   fontSize: 16,
  //   fontWeight: "500",
  //   lineHeight: 24,
  //   letterSpacing: -0.312,
  // },
  // reserveCard: {
  //   padding: 20,
  //   backgroundColor: "rgba(14, 165, 233, 0.05)",
  //   borderRadius: 16,
  //   alignItems: "center",
  //   gap: 17,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 3,
  //   elevation: 3,
  // },
  // reserveIcon: {
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // reserveTitle: {
  //   color: Colors.primary_color,
  //   fontSize: 20,
  //   fontWeight: "500",
  //   lineHeight: 28,
  //   letterSpacing: -0.449,
  //   textAlign: "center",
  // },
  // reserveDescription: {
  //   color: Colors.tertiary_color,
  //   fontSize: 16,
  //   fontWeight: "400",
  //   lineHeight: 24,
  //   letterSpacing: -0.312,
  //   textAlign: "center",
  // },
  weightSelectorCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 0.612,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    gap: 20,
  },
  card: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});
