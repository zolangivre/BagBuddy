import { useState } from "react";
import { Alert } from "react-native";
import Colors from "@/theme/Colors";
import SellerInformationCard from "./SellerInformationCard";
import StatusCard from "@/components/StatusCard";
import WeightSelectorCard from "@/components/WeightSelectorCard";
import TransactionProgressCard from "@/components/TransactionProgressCard";
import Button from "@/components/Button";
import { Send } from "lucide-react-native";
import i18n from "@/i18n";
import { router } from "expo-router";
import axios from "axios";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";

export default function BrowseListingContent({ listing, role, userInfo, status }) {
  const [selectedWeight, setSelectedWeight] = useState(1);

  const handleCreateTransaction = () => {
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
      const payload = {
        listingId: listing.id,
        listingInfo: {
          sellerUserInfo: {
            email: listing.userInfo.email,
            email_verified: listing.userInfo.email_verified,
            family_name: listing.userInfo.family_name,
            given_name: listing.userInfo.given_name,
            name: listing.userInfo.name,
            username: listing.userInfo.username,
            sub: listing.userInfo.sub,
            bio: listing.userInfo.bio,
            location: listing.userInfo.location,
            phone: listing.userInfo.phone,
          },
          departureAirport: listing.departureAirport,
          arrivalAirport: listing.arrivalAirport,
          departureDate: listing.departureDate,
          arrivalDate: listing.arrivalDate,
          totalWeightAvailable: listing.totalWeightAvailable,
          remainingWeight: listing.remainingWeight,
          pricePerKg: listing.pricePerKg,
          conditions: listing.conditions,
          createdAt: listing.createdAt,
        },
        sellerId: listing.userId,
        buyerId: userInfo.sub,
        buyerInfo: userInfo,
        weight: selectedWeight,
        sellerStatus: TRANSACTION_STATUS.RESERVATION_RECEIVED,
        buyerStatus: TRANSACTION_STATUS.WAITING_FOR_RESPONSE_BUYER,
        total: selectedWeight * listing.pricePerKg,
      };

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/transactions`,
        payload
      );
      Alert.alert(
        i18n.t("reservation_request_sent_title"),
        i18n.t("reservation_request_sent_message")
      );
      router.replace(`/transaction-detail?transactionId=${response.data.id}`);
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
          <Button
            onPress={handleCreateTransaction}
            text={i18n.t("send_reservation_request")}
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
