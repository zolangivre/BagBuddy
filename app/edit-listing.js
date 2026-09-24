import React, { useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
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
import { useQuery, useMutation } from "@apollo/client/react";
import {
  TRIP_BY_ID,
  CREATE_TRIP,
  UPDATE_TRIP,
  DELETE_TRIP,
  toTripInput,
} from "@/lib/graphql/trips";
import { withEndpoint } from "@/lib/apolloClient";
import { AuthContext } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorState from "@/components/ErrorState";
import ScreenHeader from "@/components/ScreenHeader";

export default function EditListingScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { state } = useContext(AuthContext);
  const userInfo = state.userInfo;
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [flightDateDeparture, setFlightDateDeparture] = useState("");
  const [flightDateArrival, setFlightDateArrival] = useState("");
  const [availableKilos, setAvailableKilos] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");
  const [specialConditions, setSpecialConditions] = useState("");

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

  const {
    data: tripData,
    error: tripError,
    loading: tripLoading,
    refetch: refetchTrip,
  } = useQuery(TRIP_BY_ID, {
    context: withEndpoint("trips"),
    variables: { id },
    skip: !id,
  });

  const [createTrip] = useMutation(CREATE_TRIP, { context: withEndpoint("trips") });
  const [updateTrip] = useMutation(UPDATE_TRIP, { context: withEndpoint("trips") });
  const [deleteTrip] = useMutation(DELETE_TRIP, { context: withEndpoint("trips") });

  // Le formulaire reste piloté par ses propres états : la réponse ne fait que
  // les préremplir, une fois, à l'ouverture d'une annonce existante.
  const listing = tripData?.trip;
  const [prefilledFrom, setPrefilledFrom] = useState(null);
  if (listing && listing !== prefilledFrom) {
    setPrefilledFrom(listing);
    setDeparture(listing.departureAirport);
    setArrival(listing.arrivalAirport);
    setFlightDateDeparture(listing.departureDate);
    setFlightDateArrival(listing.arrivalDate);
    setAvailableKilos(listing.remainingWeight.toString());
    setPricePerKg(listing.pricePerKg.toString());
    setSpecialConditions(listing.conditions);
  }

  // Efface l'erreur du champ modifié et revérifie l'ordre des deux dates.
  const updateDateErrors = (field, departureDate, arrivalDate) => {
    setErrors((prevErrors) => {
      const next = { ...prevErrors, [field]: null };
      if (departureDate?.trim() && arrivalDate?.trim()) {
        next.flightDateArrival =
          new Date(arrivalDate) < new Date(departureDate)
            ? i18n.t("error_arrival_before_departure")
            : null;
      }
      return next;
    });
  };

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
            await deleteTrip({ variables: { id } });
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
    // Le champ saisi est la capacité encore disponible ; le total envoyé lui
    // rajoute ce qui est déjà réservé. Le serveur reporte sur la capacité
    // restante la variation du total, ce qui redonne exactement la saisie.
    const soldWeight =
      Number(listing?.totalWeightAvailable ?? 0) -
      Number(listing?.remainingWeight ?? 0);
    const newTotal = soldWeight + Number(availableKilos);
    await updateTrip({
      variables: {
        id,
        input: toTripInput({
          departureAirport: departure,
          arrivalAirport: arrival,
          departureDate: flightDateDeparture,
          arrivalDate: flightDateArrival,
          totalWeightAvailable: newTotal,
          pricePerKg: parseFloat(pricePerKg),
          conditions: specialConditions,
        }),
      },
    });

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
      // L'identité du voyageur n'est plus envoyée : le serveur la prend dans le
      // jeton. Seuls les champs libres du profil passent, sous `profile`. La
      // capacité restante vaut le total à la création, décidé côté serveur.
      await createTrip({
        variables: {
          input: toTripInput({
            userInfo,
            departureAirport: departure,
            arrivalAirport: arrival,
            departureDate: flightDateDeparture,
            arrivalDate: flightDateArrival,
            totalWeightAvailable: parseFloat(availableKilos),
            pricePerKg: parseFloat(pricePerKg),
            conditions: specialConditions,
          }),
        },
      });

      Alert.alert(i18n.t("success"), i18n.t("listing_created_successfully"));
      router.back();
    } catch (error) {
      console.error("Erreur création trip :", error);
      Alert.alert(i18n.t("error"), i18n.t("error_creating_trip"));
    }
  };

  if (tripLoading) {
    return <LoadingScreen />;
  }
  // Annonce existante illisible : un formulaire vide enregistré par-dessus
  // écraserait l'annonce, mieux vaut ne rien proposer d'autre que réessayer.
  if (id && tripError && !tripData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScreenHeader title="" />
        <ErrorState onRetry={refetchTrip} />
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
            accessibilityLabel={i18n.t("a11y_back")}
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
            accessibilityLabel={i18n.t("delete_listing_action")}
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
                  testID="listing-departure"
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
                  testID="listing-arrival"
                  error={errors.arrival}
                />
              </View>

              {/* Flight Date */}
              <DateInputModal
                label={i18n.t("flight_date_departure")}
                value={flightDateDeparture}
                onChangeText={(text) => {
                  setFlightDateDeparture(text);
                  updateDateErrors("flightDateDeparture", text, flightDateArrival);
                }}
                placeholder={i18n.t("flight_date_placeholder_departure")}
                testID="listing-date-departure"
                error={errors.flightDateDeparture}
              />
              <DateInputModal
                label={i18n.t("flight_date_arrival")}
                value={flightDateArrival}
                onChangeText={(text) => {
                  setFlightDateArrival(text);
                  updateDateErrors("flightDateArrival", flightDateDeparture, text);
                }}
                placeholder={i18n.t("flight_date_placeholder_arrival")}
                testID="listing-date-arrival"
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
                  testID="listing-kilos"
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
                  testID="listing-price"
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
                testID="listing-conditions"
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
              {
                backgroundColor: Colors.dark_cyan_translucent,
                flex: 1,
                borderRadius: 16,
                padding: 24,
              },
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
            testID="listing-submit"
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
