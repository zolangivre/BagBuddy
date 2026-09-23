import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Colors from "@/theme/Colors";
import { globalStyles } from "@/theme/Styles";
import ButtonIcon from "@/components/ButtonIcon";
import ScreenHeader from "@/components/ScreenHeader";
import { Bell, Trash2 } from "lucide-react-native";
import { useQuery, useMutation } from "@apollo/client/react";
import { MY_TRIP_ALERTS, DELETE_TRIP_ALERT } from "@/lib/graphql/trips";
import { withEndpoint } from "@/lib/apolloClient";
import i18n from "@/i18n";
import Currency from "@/components/Currency";
import { formatLocalizedDate } from "@/components/LocalizedDateTime";
import { SafeActivityIndicator } from "@/components/SafeActivityIndicator";

export default function TripAlertsScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { language } = useLanguage();

  const { data, loading, refetch } = useQuery(MY_TRIP_ALERTS, {
    context: withEndpoint("trips"),
    onError: (error) => console.error("Error fetching trip alerts:", error),
  });

  const [deleteTripAlert] = useMutation(DELETE_TRIP_ALERT, {
    context: withEndpoint("trips"),
  });

  const alerts = data?.myTripAlerts ?? [];

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleDelete = (alert) => {
    Alert.alert(
      i18n.t("delete_alert_title"),
      i18n.t("delete_alert_message"),
      [
        { text: i18n.t("cancel"), style: "cancel" },
        {
          text: i18n.t("delete_listing_action"),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTripAlert({ variables: { id: alert.id } });
              await refetch();
            } catch (error) {
              console.error("Error deleting alert:", error);
              Alert.alert(i18n.t("error"), i18n.t("delete_alert_error"));
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title={i18n.t("trip_alerts")} />

      {loading && !data ? (
        <View style={globalStyles.centered}>
          <SafeActivityIndicator />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={[theme.textStyles.bodyMedium, styles.intro]}>
              {i18n.t("trip_alerts_intro")}
            </Text>

            {alerts.length === 0 ? (
              <View style={[globalStyles.centered, { minHeight: 100, padding: 20 }]}>
                <Text
                  style={[
                    theme.textStyles.bodyLarge,
                    { fontStyle: "italic", textAlign: "center" },
                  ]}
                >
                  {i18n.t("no_trip_alerts")}
                </Text>
              </View>
            ) : (
              alerts.map((alert) => (
                <View
                  key={alert.id}
                  style={[
                    globalStyles.card,
                    styles.alertCard,
                    { backgroundColor: theme.background_card },
                  ]}
                >
                  <Bell size={20} color={Colors.primary_color} />
                  <View style={{ flex: 1 }}>
                    <Text style={theme.textStyles.sectionTitle}>
                      {alert.departureAirport} → {alert.arrivalAirport}
                    </Text>
                    <Text style={theme.textStyles.bodyMedium}>
                      {alert.date
                        ? `${formatLocalizedDate(alert.date, language)}${
                            alert.flexDays
                              ? ` (± ${alert.flexDays} ${i18n.t("days")})`
                              : ""
                          }`
                        : i18n.t("any_date")}
                    </Text>
                    {alert.maxPricePerKg != null ? (
                      <Text style={theme.textStyles.bodyMedium}>
                        {i18n.t("max_price_per_kg")}:{" "}
                        <Currency amount={alert.maxPricePerKg} />
                      </Text>
                    ) : null}
                    {alert.minWeight != null ? (
                      <Text style={theme.textStyles.bodyMedium}>
                        {i18n.t("min_weight")}: {alert.minWeight} kg
                      </Text>
                    ) : null}
                  </View>
                  <ButtonIcon
                    onPress={() => handleDelete(alert)}
                    icon={<Trash2 size={20} color={Colors.error_color} />}
                  />
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  intro: {
    marginBottom: 4,
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  content: {
    padding: 16,
    gap: 15,
    marginBottom: 30,
  },
});
