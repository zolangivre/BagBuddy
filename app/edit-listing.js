import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
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
import { globalStyles } from "@/theme/Styles";
import Currency from "@/components/Currency";
import axios from "axios";
import { AuthContext } from "@/contexts/AuthContext";

export default function EditListingScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { state } = useContext(AuthContext);
  const userInfo = state.userInfo;
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [flightDateDeparture, setFlightDateDeparture] = useState("");
  const [flightDateArrival, setFlightDateArrival] = useState("");
  const [availableKilos, setAvailableKilos] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");
  const [specialConditions, setSpecialConditions] = useState("");
  const [totalWeightAvailable, setTotalWeightAvailable] = useState(0);
  const [remainingWeight, setRemainingWeight] = useState(0);

  const [errors, setErrors] = useState({
    departure: null,
    arrival: null,
    flightDateDeparture: null,
    flightDateArrival: null,
    availableKilos: null,
    pricePerKg: null,
  });

  const clearError = (fieldName) => {
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: null }));
  };

  useEffect(() => {
    if (id) {
      const fetchListing = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/trips/${id}`
          );
          const listing = response.data;

          setDeparture(listing.departureAirport);
          setArrival(listing.arrivalAirport);
          setFlightDateDeparture(listing.departureDate);
          setFlightDateArrival(listing.arrivalDate);
          setTotalWeightAvailable(listing.totalWeightAvailable);
          setRemainingWeight(listing.remainingWeight);
          setAvailableKilos(listing.remainingWeight.toString());
          setPricePerKg(listing.pricePerKg.toString());
          setSpecialConditions(listing.conditions);
        } catch (error) {
          console.error("Error fetching listing:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchListing();
    }
  }, [id]);

  useEffect(() => {
    if (
      flightDateDeparture &&
      flightDateDeparture.trim() !== "" &&
      flightDateArrival &&
      flightDateArrival.trim() !== ""
    ) {
      const departureDate = new Date(flightDateDeparture);
      const arrivalDate = new Date(flightDateArrival);
      if (arrivalDate < departureDate) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          flightDateArrival: i18n.t("error_arrival_before_departure"),
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          flightDateArrival: null,
        }));
      }
    }
  }, [flightDateDeparture, flightDateArrival]);

  const calculateTotal = () => {
    const kilos = parseFloat(availableKilos) || 0;
    const price = parseFloat(pricePerKg) || 0;
    const subtotal = kilos * price;
    const fee = subtotal * 0.05; // 5% BagBuddy fee
    return {
      subtotal,
      fee,
      total: subtotal + fee,
    };
  };

  const { fee, total } = calculateTotal();

  const handleGoBack = () => {
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(i18n.t("confirm_delete_listing"), i18n.t("delete_warning"), [
      {
        text: i18n.t("cancel_listing_action"),
        style: "cancel",
      },
      {
        text: i18n.t("delete_listing_action"),
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(
              `${process.env.EXPO_PUBLIC_API_URL}/trips/${id}`
            );
            Alert.alert(
              i18n.t("success"),
              i18n.t("listing_deleted_successfully")
            );
            router.back();
          } catch (error) {
            console.error("Erreur suppression trip :", error);
            Alert.alert(i18n.t("error"), i18n.t("error_deleting_trip"));
          }
        },
      },
    ]);
  };

  const validateForm = () => {
    const newErrors = {
      departure: null,
      arrival: null,
      flightDateDeparture: null,
      flightDateArrival: null,
      availableKilos: null,
      pricePerKilo: null,
    };

    let isValid = true;

    // Validation du départ
    if (!departure || departure.trim() === "") {
      newErrors.departure = i18n.t("error_departure_required");
      isValid = false;
    }

    // Validation de l'arrivée
    if (!arrival || arrival.trim() === "") {
      newErrors.arrival = i18n.t("error_arrival_required");
      isValid = false;
    }

    // Validation de la date de départ
    if (!flightDateDeparture || flightDateDeparture.trim() === "") {
      newErrors.flightDateDeparture = i18n.t("error_departure_date_required");
      isValid = false;
    }

    // Validation de la date d'arrivée
    if (!flightDateArrival || flightDateArrival.trim() === "") {
      newErrors.flightDateArrival = i18n.t("error_arrival_date_required");
      isValid = false;
    }

    // Validation que la date d'arrivée n'est pas inférieure à la date de départ
    if (
      flightDateDeparture &&
      flightDateDeparture.trim() !== "" &&
      flightDateArrival &&
      flightDateArrival.trim() !== ""
    ) {
      const departureDate = new Date(flightDateDeparture);
      const arrivalDate = new Date(flightDateArrival);
      if (arrivalDate < departureDate) {
        newErrors.flightDateArrival = i18n.t("error_arrival_before_departure");
        isValid = false;
      }
    }

    // Validation du poids disponible
    if (
      !availableKilos ||
      availableKilos.trim() === "" ||
      parseFloat(availableKilos) <= 0
    ) {
      newErrors.availableKilos = i18n.t("error_weight_required");
      isValid = false;
    }

    // Validation du prix par kilo
    if (
      !pricePerKg ||
      pricePerKg.trim() === "" ||
      parseFloat(pricePerKg) <= 0
    ) {
      newErrors.pricePerKg = i18n.t("error_price_required");
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      Alert.alert(i18n.t("error"), i18n.t("error_fields_required"));
    }

    return isValid;
  };

  const handleUpdateListing = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        departureAirport: departure,
        arrivalAirport: arrival,
        departureDate: flightDateDeparture,
        arrivalDate: flightDateArrival,
        totalWeightAvailable:
          Number(totalWeightAvailable) + Number(availableKilos),
        remainingWeight: Number(remainingWeight) + Number(availableKilos),
        pricePerKg: parseFloat(pricePerKg),
        conditions: specialConditions,
      };

      await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/trips/${id}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      Alert.alert(i18n.t("success"), i18n.t("listing_updated_successfully"));
      router.back();
    } catch (error) {
      console.error("Erreur mise à jour trip :", error);
      Alert.alert(i18n.t("error"), i18n.t("error_updating_trip"));
    }
  };

  const handleCreateTrip = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        userInfo: userInfo,
        departureAirport: departure,
        arrivalAirport: arrival,
        departureDate: flightDateDeparture,
        arrivalDate: flightDateArrival,
        totalWeightAvailable: parseFloat(availableKilos),
        remainingWeight: parseFloat(availableKilos),
        pricePerKg: parseFloat(pricePerKg),
        conditions: specialConditions,
      };

      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/trips`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      Alert.alert(i18n.t("success"), i18n.t("listing_created_successfully"));
      router.back();
    } catch (error) {
      console.error("Erreur création trip :", error);
      Alert.alert(i18n.t("error"), i18n.t("error_creating_trip"));
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="medium" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View
        style={[
          globalStyles.header,
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
            <Text style={theme.textStyles.sectionTitle}>
              {id ? i18n.t("edit_listing") : i18n.t("create_new_listing")}
            </Text>
          </View>
        </View>
        {id && (
          <ButtonIcon
            onPress={handleDelete}
            icon={<Trash2 size={24} color={Colors.error_color} />}
          />
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Flight Information Card */}
          <View
            style={[
              globalStyles.card,
              { backgroundColor: theme.background_card },
            ]}
          >
            <View style={styles.cardHeader}>
              <Plane size={20} color={Colors.primary_color} />
              <Text style={theme.textStyles.cardTitle}>
                {i18n.t("flight_information")}
              </Text>
            </View>

            <View style={styles.cardContent}>
              {/* Departure and Arrival */}
              <View style={styles.rowInputGroup}>
                <AirportInputModal
                  label={i18n.t("departure")}
                  value={departure}
                  onChangeText={(text) => {
                    setDeparture(text);
                    clearError("departure");
                  }}
                  placeholder="JFK"
                  error={errors.departure}
                />
                <AirportInputModal
                  label={i18n.t("arrival")}
                  value={arrival}
                  onChangeText={(text) => {
                    setArrival(text);
                    clearError("arrival");
                  }}
                  placeholder="CDG"
                  error={errors.arrival}
                />
              </View>

              {/* Flight Date */}
              <DateInputModal
                label={i18n.t("flight_date_departure")}
                value={flightDateDeparture}
                onChangeText={(text) => {
                  setFlightDateDeparture(text);
                  clearError("flightDateDeparture");
                }}
                placeholder={i18n.t("flight_date_placeholder_departure")}
                error={errors.flightDateDeparture}
              />
              <DateInputModal
                label={i18n.t("flight_date_arrival")}
                value={flightDateArrival}
                onChangeText={(text) => {
                  setFlightDateArrival(text);
                  clearError("flightDateArrival");
                }}
                placeholder={i18n.t("flight_date_placeholder_arrival")}
                error={errors.flightDateArrival}
                minimumDate={
                  flightDateDeparture
                    ? new Date(flightDateDeparture)
                    : undefined
                }
              />
            </View>
          </View>

          {/* Weight & Pricing Card */}
          <View
            style={[
              globalStyles.card,
              { backgroundColor: theme.background_card },
            ]}
          >
            <View style={styles.cardHeader}>
              <Weight size={20} color={Colors.primary_color} />
              <Text style={theme.textStyles.cardTitle}>
                {i18n.t("weight_and_pricing")}
              </Text>
            </View>

            <View style={styles.cardContent}>
              {/* Available Kilos and Price per Kilo */}
              <View style={styles.rowInputGroup}>
                <NumberInput
                  label={i18n.t("available_kilos")}
                  value={availableKilos}
                  onChangeText={(text) => {
                    setAvailableKilos(text);
                    clearError("availableKilos");
                  }}
                  placeholder="0"
                  icon={<Scale size={20} color={theme.text} />}
                  error={errors.availableKilos}
                />
                <NumberInput
                  label={i18n.t("price_per_kg")}
                  value={pricePerKg}
                  onChangeText={(text) => {
                    setPricePerKg(text);
                    clearError("pricePerKg");
                  }}
                  placeholder="0"
                  icon={<DollarSign size={20} color={theme.text} />}
                  error={errors.pricePerKg}
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
                  <Text style={theme.textStyles.bodyLarge}>
                    {i18n.t("total_value")}
                  </Text>
                  <Text style={theme.textStyles.number}>
                    <Currency amount={total} />
                  </Text>
                </View>
                <View style={styles.feeRow}>
                  <Text style={theme.textStyles.bodyMedium}>
                    {availableKilos}kg × <Currency amount={pricePerKg} />
                    /kg
                  </Text>
                  <Text style={theme.textStyles.bodyMedium}>
                    {i18n.t("fee")}: <Currency amount={fee} />
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Conditions & Notes Card */}
          <View
            style={[
              globalStyles.card,
              { backgroundColor: theme.background_card },
            ]}
          >
            <View style={styles.cardHeader}>
              <FileText size={20} color={Colors.primary_color} />
              <Text style={theme.textStyles.cardTitle}>
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
          <View
            style={[
              globalStyles.card,
              { backgroundColor: Colors.dark_cyan_translucent },
            ]}
          >
            <View style={styles.cardHeader}>
              <Luggage size={20} color={Colors.primary_color} />
              <Text
                style={[
                  theme.textStyles.cardTitle,
                  { color: Colors.primary_color },
                ]}
              >
                {i18n.t("listing_tips")}
              </Text>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.tipItem}>
                <Clock size={20} color={Colors.primary_color} />
                <Text style={theme.textStyles.bodyMedium}>
                  {i18n.t("listing_tips_1")}
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Users size={20} color={Colors.primary_color} />
                <Text style={theme.textStyles.bodyMedium}>
                  {i18n.t("listing_tips_2")}
                </Text>
              </View>
              <View style={styles.tipItem}>
                <DollarSign size={20} color={Colors.primary_color} />
                <Text style={theme.textStyles.bodyMedium}>
                  {i18n.t("listing_tips_3")}
                </Text>
              </View>
            </View>
          </View>

          {/* Update Create Button */}
          <Button
            text={id ? i18n.t("update_listing") : i18n.t("create_listing")}
            onPress={id ? handleUpdateListing : handleCreateTrip}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
    marginBottom: 30,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 15,
  },
  cardContent: {
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
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingRight: 24,
  },
});
