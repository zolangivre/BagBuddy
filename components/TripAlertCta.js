import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { Bell } from "lucide-react-native";
import { useMutation } from "@apollo/client/react";
import { CREATE_TRIP_ALERT } from "@/lib/graphql/trips";
import { withEndpoint } from "@/lib/apolloClient";
import { graphqlErrorMessage } from "@/lib/graphqlError";
import Button from "@/components/Button";
import Colors from "@/theme/Colors";
import { globalStyles } from "@/theme/Styles";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import i18n from "@/i18n";
import { router } from "expo-router";

/**
 * Propose de créer une alerte à partir du filtre en cours : un email à chaque
 * annonce publiée qui y correspond.
 *
 * Le trajet est obligatoire côté schéma (`departureAirport` et
 * `arrivalAirport` non nuls), donc rien ne s'affiche tant que les deux
 * aéroports ne sont pas renseignés.
 */
export default function TripAlertCta({ filters }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { language } = useLanguage();
  const [pending, setPending] = useState(false);

  const [createTripAlert] = useMutation(CREATE_TRIP_ALERT, {
    context: withEndpoint("trips"),
  });

  if (!filters?.from || !filters?.to) return null;

  const handleCreate = async () => {
    setPending(true);
    try {
      await createTripAlert({
        variables: {
          input: {
            departureAirport: filters.from,
            arrivalAirport: filters.to,
            maxPricePerKg: filters.maxPrice,
            minWeight: filters.minWeight,
            // L'email part dans la langue de l'app, pas celle du serveur.
            language,
          },
        },
      });
      Alert.alert(i18n.t("alert_created_title"), i18n.t("alert_created_message"), [
        { text: i18n.t("cancel"), style: "cancel" },
        {
          text: i18n.t("see_trip_alerts"),
          onPress: () => router.push("trip-alerts"),
        },
      ]);
    } catch (error) {
      console.error("Error creating trip alert:", error);
      Alert.alert(
        i18n.t("error"),
        graphqlErrorMessage(
          error,
          ["alert_needs_email", "too_many_alerts", "alert_invalid_route"],
          "alert_created_error"
        )
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <View
      style={[
        globalStyles.card,
        globalStyles.cardStack,
        { backgroundColor: theme.background_card },
      ]}
    >
      <View style={globalStyles.cardHeaderRow}>
        <Bell size={20} color={Colors.primary_color} />
        <Text style={[theme.textStyles.sectionTitle, { flex: 1 }]}>
          {i18n.t("alert_cta_title", {
            from: filters.from,
            to: filters.to,
          })}
        </Text>
      </View>
      <Text style={theme.textStyles.bodyMedium}>
        {i18n.t("alert_cta_message")}
      </Text>
      <Button
        text={i18n.t("create_trip_alert")}
        onPress={handleCreate}
        loading={pending}
        color={Colors.primary_color}
      />
    </View>
  );
}
