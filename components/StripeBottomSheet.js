import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Easing,
  Alert,
} from "react-native";
import {
  StripeProvider,
  CardField,
  useConfirmPayment,
} from "@stripe/stripe-react-native";
import { useQuery, useMutation } from "@apollo/client/react";
import { STRIPE_CONFIG, CREATE_PAYMENT_INTENT } from "@/lib/graphql/stripe";
import { withEndpoint } from "@/lib/apolloClient";
import Colors from "@/theme/Colors";
import { useCurrency } from "@/contexts/CurrencyContext";
import i18n from "@/i18n";
import { useThemeContext } from "@/contexts/ThemeContext";
import { SafeActivityIndicator } from "@/components/SafeActivityIndicator";

const StripeBottomSheet = ({
  visible,
  onClose,
  amount,
  transactionId,
  onPaymentSuccess,
}) => {
  const [internalVisible, setInternalVisible] = useState(visible);
  const [translateY] = useState(() => new Animated.Value(400));
  const { confirmPayment, loading: stripeLoading } = useConfirmPayment();
  const [loading, setLoading] = useState(false);
  const { format, formatBase, isConverted } = useCurrency();
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const [cardDetails, setCardDetails] = useState(null);

  // La clé publiable vient du serveur : c'est aussi ce qui signale que
  // stripeservice tourne (il est éteint en développement).
  const { data: stripeConfigData, error: stripeConfigError } = useQuery(STRIPE_CONFIG, {
    context: withEndpoint("stripe"),
    // Clé immuable, et inutile tant que la feuille est fermée : sans cela la
    // valeur par défaut cache-and-network la relirait à chaque montage.
    skip: !visible,
    fetchPolicy: "cache-first",
  });
  const [createPaymentIntent] = useMutation(CREATE_PAYMENT_INTENT, {
    context: withEndpoint("stripe"),
  });

  const publishableKey = stripeConfigData?.stripeConfig?.publishableKey;
  // Sans clé la feuille n'a rien à montrer : on le dit et on la referme, plutôt
  // que de laisser le bouton « payer » sans effet.
  const configFailed = visible && !publishableKey && Boolean(stripeConfigError);
  useEffect(() => {
    if (!configFailed) return;
    Alert.alert(i18n.t("error"), i18n.t("payment_unavailable"));
    onClose();
    // onClose change à chaque rendu du parent : seul l'échec doit déclencher.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configFailed]);

  // Affichage seulement : le montant et la devise du paiement sont décidés par
  // le serveur, à partir de la transaction. On montre donc ce qui sera débité
  // (en EUR), et l'équivalent dans la devise choisie à titre indicatif.
  const chargedAmount = formatBase(amount);

  // Monte le Modal dès que `visible` passe à true ; le démontage attend la
  // fin de l'animation de fermeture, dans l'effet ci-dessous.
  if (visible && !internalVisible) setInternalVisible(true);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 400,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        setInternalVisible(false);
      });
    }
  }, [visible, translateY]);

  const handlePayPress = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert(i18n.t("error"), i18n.t("invalid_amount"));
      return;
    }

    // Vérification de la présence des informations de la carte
    if (!cardDetails?.complete) {
      Alert.alert(i18n.t("error"), i18n.t("please_fill_card_details"));
      return;
    }

    setLoading(true);

    try {
      // Ni montant ni devise : le serveur lit la transaction, vérifie qu'on en
      // est bien l'acheteur et calcule la somme à partir de l'annonce. C'est ce
      // qui empêche de payer un prix choisi côté client.
      const { data } = await createPaymentIntent({
        variables: { transactionId },
      });

      const clientSecret = data?.createPaymentIntent?.clientSecret;

      if (!clientSecret) {
        throw new Error("No client secret received");
      }

      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
      });

      if (error) {
        // Erreurs Stripe détaillées
        switch (error.code) {
          case "InvalidRequestError":
            Alert.alert(i18n.t("error"), i18n.t("invalid_payment_request"));
            break;
          case "card_declined":
            Alert.alert(
              i18n.t("error_payment_declined_title"),
              i18n.t("error_payment_declined_message")
            );
            break;
          default:
            Alert.alert(
              i18n.t("error"),
              error.message || i18n.t("payment_failed")
            );
        }
      } else if (paymentIntent) {
        onPaymentSuccess?.(paymentIntent);
        onClose();
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert(i18n.t("error"), i18n.t("error_payment_processing_message"));
    } finally {
      setLoading(false);
    }
  };

  if (!internalVisible) return null;
  if (!publishableKey) {
    // Clé en cours de lecture : un voile d'attente plutôt qu'un appui sans effet.
    return visible && !stripeConfigError ? (
      <Modal visible transparent animationType="fade" onRequestClose={onClose}>
        <View style={[styles.overlay, styles.waiting]}>
          <SafeActivityIndicator />
        </View>
      </Modal>
    ) : null;
  }

  return (
    <StripeProvider publishableKey={publishableKey}>
      <Modal visible={internalVisible} transparent animationType="none">
        {/* Overlay */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
          disabled={loading || stripeLoading}
        />

        {/* Panel */}
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY }],
              backgroundColor: theme.title_inverse,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.title }]}>
            {i18n.t("secure_payment")}
          </Text>

          <Text style={[styles.label, { color: theme.text }]}>
            {i18n.t("amount_to_pay")}
          </Text>
          <Text style={styles.amount}>{chargedAmount}</Text>
          {isConverted ? (
            <Text style={[styles.label, { color: theme.text }]}>
              {i18n.t("approx_amount", { amount: format(amount) })}
            </Text>
          ) : null}

          <Text style={[styles.label, { color: theme.text }]}>
            {i18n.t("card_details")}
          </Text>
          <CardField
            postalCodeEnabled={false}
            placeholders={{ number: "4242 4242 4242 4242" }}
            cardStyle={{
              backgroundColor: theme.title_inverse,
              textColor: theme.title,
            }}
            style={styles.cardField}
            onCardChange={setCardDetails}
          />

          <TouchableOpacity
            style={[
              styles.payButton,
              (loading || stripeLoading) && styles.payButtonDisabled,
            ]}
            onPress={handlePayPress}
            disabled={loading || stripeLoading}
          >
            {loading || stripeLoading ? (
              <SafeActivityIndicator size="small" />
            ) : (
              <Text style={[styles.payButtonText, { color: Colors.white }]}>
                {i18n.t("pay")} {chargedAmount}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            disabled={loading || stripeLoading}
          >
            <Text style={[styles.closeButtonText, { color: theme.text }]}>
              {i18n.t("cancel")}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  waiting: {
    justifyContent: "center",
    alignItems: "center",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.primary_color,
  },
  cardField: {
    height: 50,
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: Colors.primary_color,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontWeight: "600",
    fontSize: 16,
  },
  closeButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  closeButtonText: {
    fontSize: 16,
  },
});

export default StripeBottomSheet;
