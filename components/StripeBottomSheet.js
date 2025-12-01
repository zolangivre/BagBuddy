import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Easing,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  StripeProvider,
  CardField,
  useConfirmPayment,
} from "@stripe/stripe-react-native";
import axios from "axios";
import Colors from "@/theme/Colors";
import { useCurrency } from "@/contexts/CurrencyContext";
import i18n from "@/i18n";
import { useThemeContext } from "@/contexts/ThemeContext";

const StripeBottomSheet = ({
  visible,
  onClose,
  amountUSD,
  onPaymentSuccess,
}) => {
  const [internalVisible, setInternalVisible] = useState(visible);
  const translateY = useRef(new Animated.Value(400)).current;
  const { confirmPayment, loading: stripeLoading } = useConfirmPayment();
  const [loading, setLoading] = useState(false);
  const { currency, format, rates } = useCurrency();
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const [cardDetails, setCardDetails] = useState(null);

  const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const apiUrl = process.env.EXPO_PUBLIC_STRIPE_API_URL;

  const getAmountInCurrency = () => {
    if (currency === "EUR" && rates.quotes?.USDEUR) {
      return amountUSD * rates.quotes.USDEUR;
    }
    return amountUSD;
  };

  const displayAmount = getAmountInCurrency();
  const displayCurrency = currency === "EUR" ? "eur" : "usd";

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
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
    if (
      !displayAmount ||
      isNaN(displayAmount) ||
      parseFloat(displayAmount) <= 0
    ) {
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
      const response = await axios.post(
        `${apiUrl}/stripe/create-payment-intent`,
        {
          amount: Math.round(parseFloat(displayAmount) * 100),
          currency: displayCurrency, // "eur" ou "usd"
          metadata: {
            type: "transaction_payment",
            originalAmountUSD: amountUSD,
            displayCurrency: currency,
          },
        }
      );

      const { clientSecret } = response.data;

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

  if (!internalVisible || !publishableKey) return null;

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
          <Text style={styles.amount}>{format(displayAmount)}</Text>

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
              <ActivityIndicator size="medium" color={theme.primary} />
            ) : (
              <Text style={[styles.payButtonText, { color: Colors.white }]}>
                {i18n.t("pay")} {format(displayAmount)}
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
