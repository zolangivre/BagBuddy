import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Colors from "@/theme/Colors";
import SellerInformationCard from "./SellerInformationCard";
import StatusCard from "@/components/StatusCard";
import WeightSelectorCard from "@/components/WeightSelectorCard";
import TransactionProgressCard from "@/components/TransactionProgressCard";
import Button from "@/components/Button";
import Input from "@/components/Input";
import i18n from "@/i18n";
import { router } from "expo-router";
import { Check, Send } from "lucide-react-native";
import { useMutation } from "@apollo/client/react";
import { CREATE_TRANSACTION } from "@/lib/graphql/transactions";
import { withEndpoint } from "@/lib/apolloClient";
import { useThemeContext } from "@/contexts/ThemeContext";
import { globalStyles } from "@/theme/Styles";

export default function BrowseListingContent({ listing, role, status }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const [selectedWeight, setSelectedWeight] = useState(1);
  // Deux déclarations désormais exigées par le serveur à la réservation.
  const [contentDescription, setContentDescription] = useState("");
  const [prohibitedItemsAccepted, setProhibitedItemsAccepted] = useState(false);
  const [createTransactionMutation, { loading: creating }] = useMutation(CREATE_TRANSACTION, {
    context: withEndpoint("transactions"),
  });

  const handleCreateTransaction = () => {
    if (!contentDescription.trim()) {
      Alert.alert(i18n.t("error"), i18n.t("content_description_required"));
      return;
    }
    if (!prohibitedItemsAccepted) {
      Alert.alert(i18n.t("error"), i18n.t("prohibited_items_required"));
      return;
    }

    Alert.alert(
      i18n.t("confirm_reservation_title"),
      i18n.t("confirm_reservation_message"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("confirm"),
          onPress: () => createTransaction(),
        },
      ]
    );
  };

  const createTransaction = async () => {
    try {
      // L'instantané de l'annonce, les identités des parties, les statuts de
      // départ et le total sont tous construits par le serveur : il ne reste
      // que l'annonce, le poids et ce que l'acheteur déclare confier.
      const { data } = await createTransactionMutation({
        variables: {
          input: {
            listingId: listing.id,
            weight: selectedWeight,
            contentDescription: contentDescription.trim(),
            prohibitedItemsAccepted,
          },
        },
      });
      Alert.alert(
        i18n.t("reservation_request_sent_title"),
        i18n.t("reservation_request_sent_message")
      );
      router.replace(
        `/transaction-detail?transactionId=${data.createTransaction.id}`
      );
    } catch (error) {
      console.error("Error creating transaction:", error);
      Alert.alert(i18n.t("error"), i18n.t("reservation_request_error_message"));
    }
  };
  const listingInfo = {
    listingInfo: { ...listing },
  };

  return (
    <>
      {role === "buyer" ? (
        <>
          <TransactionProgressCard step={0} buyer={true} />
          <SellerInformationCard item={listingInfo} />
          <StatusCard status={status} />
          <WeightSelectorCard
            item={listing}
            onWeightChange={(value) => {
              setSelectedWeight(value);
            }}
          />
          <View
            style={[
              globalStyles.card,
              { backgroundColor: theme.background_card },
            ]}
          >
            <Input
              label={i18n.t("content_description_label")}
              value={contentDescription}
              onChangeText={setContentDescription}
              placeholder={i18n.t("content_description_placeholder")}
              multiline
              numberOfLines={3}
              maxLength={500}
              testID="reservation-description"
            />
            <Pressable
              style={styles.checkboxRow}
              onPress={() => setProhibitedItemsAccepted((value) => !value)}
              accessibilityRole="checkbox"
              testID="reservation-prohibited"
              accessibilityState={{ checked: prohibitedItemsAccepted }}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: Colors.primary_color,
                    backgroundColor: prohibitedItemsAccepted
                      ? Colors.primary_color
                      : "transparent",
                  },
                ]}
              >
                {prohibitedItemsAccepted ? (
                  <Check size={16} color={Colors.white} />
                ) : null}
              </View>
              <Text style={[theme.textStyles.bodyMedium, styles.checkboxLabel]}>
                {i18n.t("prohibited_items_label")}
              </Text>
            </Pressable>
          </View>
          <Button
            onPress={handleCreateTransaction}
            loading={creating}
            text={i18n.t("send_reservation_request")}
            testID="reservation-submit"
            rightIcon={<Send size={24} color={Colors.white} />}
          />
        </>
      ) : (
        <>
          <SellerInformationCard item={listingInfo} />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 12,
  },
});
