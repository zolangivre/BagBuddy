import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Trash2,
  Plane,
  Weight,
  FileText,
  Luggage,
  Calendar,
  DollarSign,
  Clock,
  Users,
} from "lucide-react-native";
import Colors from "../theme/Colors";
import Button from "../components/Button";
import ButtonIcon from "../components/ButtonIcon";
import Input from "../components/Input";

export default function EditListingScreen() {
  const router = useRouter();
  const [flightNumber, setFlightNumber] = useState("AF345");
  const [departure, setDeparture] = useState("JFK");
  const [arrival, setArrival] = useState("CDG");
  const [flightDate, setFlightDate] = useState("Friday, December 20, 2024");
  const [availableKilos, setAvailableKilos] = useState("12");
  const [pricePerKilo, setPricePerKilo] = useState("10");
  const [specialConditions, setSpecialConditions] = useState("");

  const calculateTotal = () => {
    const kilos = parseFloat(availableKilos) || 0;
    const price = parseFloat(pricePerKilo) || 0;
    const subtotal = kilos * price;
    const fee = subtotal * 0.05; // 5% BagBuddy fee
    return {
      subtotal,
      fee,
      total: subtotal + fee,
    };
  };

  const { subtotal, fee, total } = calculateTotal();

  const handleGoBack = () => {
    router.back();
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete listing");
  };

  const handleUpdateListing = () => {
    // TODO: Implement update functionality
    console.log("Update listing");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <ButtonIcon
            onPress={handleGoBack}
            icon={<ArrowLeft size={20} color={Colors.secondary_color} />}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Edit Listing</Text>
          </View>
        </View>
        <ButtonIcon
          onPress={handleDelete}
          icon={<Trash2 size={24} color={Colors.error_color} />}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Flight Information Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Plane size={20} color={Colors.primary_color} />
              <Text style={styles.cardTitle}>Flight Information</Text>
            </View>

            <View style={styles.cardContent}>
              {/* Flight Number */}
              <Input
                label="Flight Number"
                value={flightNumber}
                onChangeText={setFlightNumber}
                placeholder="Enter flight number"
              />

              {/* Departure and Arrival */}
              <View style={styles.rowInputGroup}>
                <Input
                  label="Departure"
                  value={departure}
                  onChangeText={setDeparture}
                  placeholder="JFK"
                  // style={styles.halfInput}
                />
                <Input
                  label="Arrival"
                  value={arrival}
                  onChangeText={setArrival}
                  placeholder="CDG"
                  // style={styles.halfInput}
                />
              </View>

              {/* Flight Date */}
              <Input
                label="Flight Date"
                value={flightDate}
                onChangeText={setFlightDate}
                placeholder="Select flight date"
                leftIcon={<Calendar size={20} color={Colors.tertiary_color} />}
              />
            </View>
          </View>

          {/* Weight & Pricing Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Weight size={20} color={Colors.primary_color} />
              <Text style={styles.cardTitle}>Weight & Pricing</Text>
            </View>

            <View style={styles.cardContent}>
              {/* Available Kilos and Price per Kilo */}
              <View style={styles.rowInputGroup}>
                <Input
                  label="Available Kilos"
                  value={availableKilos}
                  onChangeText={setAvailableKilos}
                  placeholder="12"
                  keyboardType="numeric"
                />
                <Input
                  label="Price per Kilo"
                  value={pricePerKilo}
                  onChangeText={setPricePerKilo}
                  placeholder="10"
                  keyboardType="numeric"
                  // leftIcon={<DollarSign size={20} color={Colors.tertiary_color} />}
                />
              </View>

              {/* Total Calculation */}
              <View style={styles.totalContainer}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Value</Text>
                  <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                </View>
                <View style={styles.feeRow}>
                  <Text style={styles.feeText}>
                    {availableKilos}kg × ${pricePerKilo}/kg
                  </Text>
                  <Text style={styles.feeText}>
                    BagBuddy fee: ${fee.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Conditions & Notes Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <FileText size={20} color={Colors.primary_color} />
              <Text style={styles.cardTitle}>Conditions & Notes</Text>
            </View>

            <View style={styles.cardContent}>
              <Input
                label="Special Conditions (Optional)"
                value={specialConditions}
                onChangeText={setSpecialConditions}
                placeholder="e.g., Meet at check-in counter, no fragile items, cash payment preferred..."
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Listing Tips Card */}
          <View style={styles.tipsCard}>
            <View style={styles.cardHeader}>
              <Luggage size={20} color={Colors.primary_color} />
              <Text style={styles.tipsTitle}>Listing Tips</Text>
            </View>

            <View style={styles.tipsContent}>
              <View style={styles.tipItem}>
                <Clock size={20} color={Colors.tertiary_color} />
                <Text style={styles.tipText}>
                  List your weight at least 24 hours before your flight
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Users size={20} color={Colors.tertiary_color} />
                <Text style={styles.tipText}>
                  Be specific about meeting location and payment method
                </Text>
              </View>
              <View style={styles.tipItem}>
                <DollarSign size={20} color={Colors.tertiary_color} />
                <Text style={styles.tipText}>
                  Check current market rates for your route
                </Text>
              </View>
            </View>
          </View>

          {/* Update Button */}
          <Button
            text="Update listing"
            onPress={handleUpdateListing}
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
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 0.612,
    borderBottomColor: Colors.very_light_grey,
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
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  headerTitle: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
  },
  cardTitle: {
    color: Colors.secondary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  cardContent: {
    padding: 24,
    paddingTop: 16,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  rowInputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  totalContainer: {
    backgroundColor: "rgba(224, 242, 254, 0.20)",
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  totalValue: {
    color: Colors.primary_color,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 28,
    letterSpacing: -0.439,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feeText: {
    color: Colors.tertiary_color,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  textArea: {
    backgroundColor: Colors.very_light_blue,
    borderRadius: 16,
    padding: 15,
    fontSize: 16,
    fontWeight: "400",
    color: Colors.secondary_color,
    minHeight: 95,
  },
  helperText: {
    color: Colors.tertiary_color,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  tipsCard: {
    backgroundColor: "rgba(14, 165, 233, 0.05)",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tipsTitle: {
    color: Colors.primary_color,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: -0.312,
  },
  tipsContent: {
    padding: 24,
    paddingTop: 16,
    gap: 10,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  tipText: {
    flex: 1,
    color: Colors.tertiary_color,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.15,
  },
});
