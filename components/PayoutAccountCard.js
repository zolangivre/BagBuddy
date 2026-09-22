import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Banknote, CheckCircle, AlertCircle } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import { useQuery, useMutation } from "@apollo/client/react";
import { PAYOUT_ACCOUNT, START_PAYOUT_ONBOARDING } from "@/lib/graphql/stripe";
import { withEndpoint } from "@/lib/apolloClient";
import Button from "@/components/Button";
import Colors from "@/theme/Colors";
import { globalStyles } from "@/theme/Styles";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";

/**
 * Le compte Stripe Connect qui permet au voyageur d'être payé.
 *
 * Le lien d'onboarding est à usage unique et de courte durée : il est ouvert
 * aussitôt obtenu, jamais conservé. Le compte est créé au premier appel ; les
 * suivants reprennent là où le membre s'était arrêté.
 *
 * `stripeConfig` étant éteint en développement, un échec de lecture n'est pas
 * une anomalie : la carte se retire simplement.
 */
export default function PayoutAccountCard() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const [pending, setPending] = useState(false);

  const { data, error, refetch } = useQuery(PAYOUT_ACCOUNT, {
    context: withEndpoint("stripe"),
    onError: (cause) => console.warn("Payouts unavailable:", cause),
  });

  const [startOnboarding] = useMutation(START_PAYOUT_ONBOARDING, {
    context: withEndpoint("stripe"),
  });

  // stripeservice injoignable (dev) : rien à proposer.
  if (error && !data) return null;

  const account = data?.payoutAccount;
  const ready = account?.payoutsEnabled && account?.transfersActive;

  const handleStart = async () => {
    setPending(true);
    try {
      const { data: onboarding } = await startOnboarding();
      const url = onboarding?.startPayoutOnboarding?.url;
      if (!url) throw new Error("No onboarding url");
      await WebBrowser.openBrowserAsync(url);
      // Au retour, Stripe a pu faire avancer le dossier : on relit l'état.
      await refetch();
    } catch (cause) {
      console.error("Error starting payout onboarding:", cause);
      Alert.alert(i18n.t("error"), i18n.t("payout_onboarding_error"));
    } finally {
      setPending(false);
    }
  };

  const statusLabel = () => {
    if (ready) return i18n.t("payout_status_ready");
    if (account?.detailsSubmitted) return i18n.t("payout_status_pending");
    if (account?.connected) return i18n.t("payout_status_incomplete");
    return i18n.t("payout_status_none");
  };

  return (
    <View
      style={[
        globalStyles.card,
        styles.card,
        { backgroundColor: theme.background_card },
      ]}
    >
      <View style={styles.headerRow}>
        <Banknote size={20} color={Colors.primary_color} />
        <Text style={[theme.textStyles.sectionTitle, { flex: 1 }]}>
          {i18n.t("payout_account")}
        </Text>
        {ready ? (
          <CheckCircle size={20} color={Colors.success_color} />
        ) : (
          <AlertCircle size={20} color={Colors.light_yellow} />
        )}
      </View>

      <Text style={theme.textStyles.bodyMedium}>{statusLabel()}</Text>

      {ready ? null : (
        <Button
          text={
            pending
              ? i18n.t("loading")
              : account?.connected
                ? i18n.t("payout_continue_setup")
                : i18n.t("payout_start_setup")
          }
          onPress={handleStart}
          disabled={pending}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
