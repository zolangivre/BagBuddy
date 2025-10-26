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
  DollarSign,
  Clock,
  Users,
  Scale,
} from "lucide-react-native";
import Colors from "@/theme/Colors";
import Button from "@/components/Button";
import ButtonIcon from "@/components/ButtonIcon";
import AirportInputModal from "@/components/AirportInputModal";
import DateInputModal from "@/components/DateInputModal";
import NumberInput from "@/components/NumberInput";
import Input from "@/components/Input";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";

export default function EditListingScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background_card,
            borderBottomColor: theme.navTopBorder,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <ButtonIcon
            onPress={handleGoBack}
            icon={<ArrowLeft size={20} color={theme.title} />}
          />
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, { color: theme.title }]}>
              {i18n.t("edit_listing")}
            </Text>
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
          <View
            style={[styles.card, { backgroundColor: theme.background_card }]}
          >
            <View style={styles.cardHeader}>
              <Plane size={20} color={Colors.primary_color} />
              <Text style={[styles.cardTitle, { color: theme.title }]}>
                {i18n.t("flight_information")}
              </Text>
            </View>

            <View style={styles.cardContent}>
              {/* Flight Number */}
              <Input
                label={i18n.t("flight_number")}
                value={flightNumber}
                onChangeText={setFlightNumber}
                placeholder={i18n.t("flight_number_placeholder")}
              />

              {/* Departure and Arrival */}
              <View style={styles.rowInputGroup}>
                <AirportInputModal
                  label={i18n.t("departure")}
                  value={departure}
                  onChangeText={setDeparture}
                  placeholder="JFK"
                />
                <AirportInputModal
                  label={i18n.t("arrival")}
                  value={arrival}
                  onChangeText={setArrival}
                  placeholder="CDG"
                />
              </View>

              {/* Flight Date */}
              <DateInputModal
                label={i18n.t("flight_date")}
                value={flightDate}
                onChangeText={setFlightDate}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>

          {/* Weight & Pricing Card */}
          <View
            style={[styles.card, { backgroundColor: theme.background_card }]}
          >
            <View style={styles.cardHeader}>
              <Weight size={20} color={Colors.primary_color} />
              <Text style={[styles.cardTitle, { color: theme.title }]}>
                {i18n.t("weight_and_pricing")}
              </Text>
            </View>

            <View style={styles.cardContent}>
              {/* Available Kilos and Price per Kilo */}
              <View style={styles.rowInputGroup}>
                <NumberInput
                  label={i18n.t("available_weight")}
                  value={availableKilos}
                  onChangeText={setAvailableKilos}
                  placeholder="0"
                  icon={<Scale size={16} color={theme.text} />}
                />
                <NumberInput
                  label={i18n.t("price_per_kilo")}
                  value={pricePerKilo}
                  onChangeText={setPricePerKilo}
                  placeholder="0"
                  icon={<DollarSign size={16} color={theme.text} />}
                />
              </View>

              {/* Total Calculation */}
              <View
                style={[
                  styles.totalContainer,
                  { backgroundColor: theme.flightCard },
                ]}
              >
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: theme.title }]}>
                    {i18n.t("total_value")}
                  </Text>
                  <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                </View>
                <View style={styles.feeRow}>
                  <Text style={[styles.text, { color: theme.text }]}>
                    {availableKilos}kg × ${pricePerKilo}/kg
                  </Text>
                  <Text style={[styles.text, { color: theme.text }]}>
                    {i18n.t("bagbuddy_fee")}: ${fee.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Conditions & Notes Card */}
          <View
            style={[styles.card, { backgroundColor: theme.background_card }]}
          >
            <View style={styles.cardHeader}>
              <FileText size={20} color={Colors.primary_color} />
              <Text style={[styles.cardTitle, { color: theme.title }]}>
                {i18n.t("conditions_and_notes")}
              </Text>
            </View>

            <View style={styles.cardContent}>
              <Input
                label={i18n.t("special_conditions_optional")}
                value={specialConditions}
                onChangeText={setSpecialConditions}
                placeholder={i18n.t("special_conditions_optional_placeholder")}
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
              <Text style={styles.tipsTitle}>{i18n.t("listing_tips")}</Text>
            </View>

            <View style={styles.tipsContent}>
              <View style={styles.tipItem}>
                <Clock size={20} color={Colors.primary_color} />
                <Text style={[styles.tipText, { color: theme.text }]}>
                  {i18n.t("listing_tips_1")}
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Users size={20} color={Colors.primary_color} />
                <Text style={[styles.tipText, { color: theme.text }]}>
                  {i18n.t("listing_tips_2")}
                </Text>
              </View>
              <View style={styles.tipItem}>
                <DollarSign size={20} color={Colors.primary_color} />
                <Text style={[styles.tipText, { color: theme.text }]}>
                  {i18n.t("listing_tips_3")}
                </Text>
              </View>
            </View>
          </View>

          {/* Update Button */}
          <Button
            text={i18n.t("update_listing")}
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
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
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
    fontSize: 16,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  card: {
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
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  cardContent: {
    padding: 24,
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
    fontSize: 14,
    fontWeight: "400",
  },
  totalValue: {
    color: Colors.primary_color,
    fontSize: 18,
    fontWeight: "700",
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "400",
  },
  tipsCard: {
    backgroundColor: Colors.dark_cyan_translucent,
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
  },
  tipsContent: {
    padding: 24,
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
  },
});
