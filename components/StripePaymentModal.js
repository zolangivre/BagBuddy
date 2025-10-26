import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Easing,
  Dimensions,
  Alert,
} from "react-native";
import {
  StripeProvider,
  CardField,
  useConfirmPayment,
} from "@stripe/stripe-react-native";
import Colors from "@/theme/Colors";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const StripeBottomSheet = ({ visible, onClose, defaultAmount = "10" }) => {
  const [internalVisible, setInternalVisible] = useState(visible);
  const translateY = useRef(new Animated.Value(400)).current; // initial offscreen
  const [amount, setAmount] = useState(defaultAmount);
  const { confirmPayment, loading } = useConfirmPayment();
  const [publishableKey, setPublishableKey] = useState("");

  useEffect(() => {
    // Clé de test Stripe
    setPublishableKey(
      "pk_test_51SMV8VCwao2kdcbBHPoqltFqIve7fYZY5bbsTZJb1VDMzsz2QfLj7619tsn210THIXyg4yQqRJaTdRx33rGHfsLb00gySEUieq"
    );
  }, []);

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
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert("Erreur", "Entrez un montant valide");
      return;
    }

    try {
      const clientSecret = "pi_XXXXXXXXXXXXXXXX_secret_XXXXXXXXXXXXXXXX";

      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        type: "Card",
        billingDetails: { name: "Test User" },
      });

      if (error) {
        Alert.alert("Erreur", error.message);
      } else if (paymentIntent) {
        Alert.alert("Succès", `Paiement effectué : ${paymentIntent.amount}`);
        onClose();
      }
    } catch {
      Alert.alert("Erreur", "Impossible de traiter le paiement");
    }
  };

  if (!internalVisible || !publishableKey) return null;

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.identifier"
      urlScheme="your-url-scheme"
    >
      <Modal visible={internalVisible} transparent animationType="none">
        {/* overlay fixe */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* panel animé */}
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <Text style={styles.title}>Paiement</Text>

          <Text style={styles.label}>Montant (€)</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Détails de la carte</Text>
          <CardField
            postalCodeEnabled={false}
            placeholders={{ number: "4242 4242 4242 4242" }}
            cardStyle={{
              backgroundColor: Colors.very_light_blue,
              textColor: Colors.dark_blue_grey,
            }}
            style={styles.cardField}
          />

          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayPress}
            disabled={loading}
          >
            <Text style={styles.payButtonText}>
              {loading ? "Processing..." : "Payer"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Annuler</Text>
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
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 6 },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: Colors.very_light_blue,
    marginBottom: 16,
  },
  cardField: { height: 50, marginBottom: 16 },
  payButton: {
    backgroundColor: Colors.primary_color,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  payButtonText: { color: "#FFF", fontWeight: "600", fontSize: 16 },
  closeButton: { alignItems: "center", paddingVertical: 12 },
  closeButtonText: { color: Colors.secondary_color, fontSize: 16 },
});

export default StripeBottomSheet;
