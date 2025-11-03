import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  CheckCircle,
  Send,
  X,
  XCircle,
  MapPin,
  Calendar,
  Weight,
} from "lucide-react-native";
import Colors from "../theme/Colors";
import Button from "../components/Button";
import TransactionProgressCard from "../components/TransactionProgressCard";
import SellerInformationCard from "../components/SellerInformationCard";
import WeightSelectorCard from "../components/WeightSelectorCard";
import AlertModal from "@/components/AlertModal";
import StatusBadge from "@/components/StatusBadge";
import StatusCard from "../components/StatusCard";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import { useThemeContext } from "../contexts/ThemeContext";
import i18n from "@/i18n";
import mockTransactions from "@/mockData/transactions";
import mockListings from "@/mockData/listings";

export default function TransactionDetailScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();
  const { transactionId, listingId } = useLocalSearchParams();
  const listing = mockListings.find((l) => l.id.toString() === listingId);
  const transaction = mockTransactions.find(
    (t) => t.id.toString() === transactionId
  );
  const item = transaction || listing;
  const status = transaction?.status || TRANSACTION_STATUS.BROWSE_LISTING;
  const buyer = true;

  const CancelTransaction = () => {
    const [showCancelAlert, setShowCancelAlert] = useState(false);

    return (
      <>
        <Button
          text={i18n.t("cancel_transaction")}
          rightIcon={<X size={24} color="#FFFFFF" />}
          color={Colors.error_color}
          onPress={() => setShowCancelAlert(true)}
        />
        <AlertModal
          visible={showCancelAlert}
          onClose={() => setShowCancelAlert(false)}
          title={i18n.t("cancel_transaction_modal_title")}
          message={i18n.t("cancel_transaction_modal_message")}
          buttons={[
            {
              text: i18n.t("cancel_transaction_modal_cancel"),
              onPress: () => setShowCancelAlert(false),
              style: "cancel",
            },
            {
              text: i18n.t("cancel_transaction_modal_confirm"),
              onPress: () => {
                // action de suppression
                setShowCancelAlert(false);
              },
              style: "destructive",
            },
          ]}
        />
      </>
    );
  };

  const MeetingDetailsCard = () => {
    return (
      <View style={styles.containerMeetingDetails}>
        <View style={[styles.contentRow, { gap: 5 }]}>
          <MapPin size={24} color={Colors.primary_color} />
          <Text style={theme.textStyles.cardTitle}>
            {i18n.t("meeting_details")}
          </Text>
        </View>
        <View style={[styles.contentColumn, { gap: 10 }]}>
          <View style={styles.contentRow}>
            <MapPin size={16} color={Colors.primary_color} />
            <View style={styles.contentColumn}>
              <Text style={theme.textStyles.cardTitle}>
                {i18n.t("meeting_details_step_one")}
              </Text>
              <Text style={theme.textStyles.bodyMedium}>Emirates - EK 203</Text>
            </View>
          </View>
          <View style={styles.contentRow}>
            <Calendar size={16} color={Colors.primary_color} />
            <View style={styles.contentColumn}>
              <Text style={theme.textStyles.cardTitle}>Dec 25, 2024</Text>
              <Text style={theme.textStyles.bodyMedium}>Arrive by 14:30</Text>
            </View>
          </View>
          <View style={styles.contentRow}>
            <Weight size={16} color={Colors.primary_color} />
            <View style={styles.contentColumn}>
              <Text style={theme.textStyles.cardTitle}>8kg reserved</Text>
              <Text style={theme.textStyles.bodyMedium}>$96 total</Text>
            </View>
          </View>
        </View>
        <Button text="Mark as completed" color={Colors.success_color} />
      </View>
    );
  };

  const BrowseListingContent = () => {
    return (
      <>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <TransactionProgressCard step={0} buyer={true} />
        </View>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <SellerInformationCard item={item} />
        </View>
        <StatusCard status={status} />
        <View
          style={[
            styles.card,
            { backgroundColor: theme.background_card, gap: 20 },
          ]}
        >
          <WeightSelectorCard item={item} />
        </View>
        <Button
          text={i18n.t("send_reservation_request")}
          rightIcon={<Send size={24} color="#FFFFFF" />}
        />
      </>
    );
  };

  const WaitingForResponseContent = () => {
    return (
      <>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <TransactionProgressCard step={1} buyer={true} />
        </View>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <SellerInformationCard item={item} />
        </View>
        <StatusCard status={status} />
      </>
    );
  };

  const RequestRejectedContent = () => {
    return (
      <>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <TransactionProgressCard step={1} buyer={true} />
        </View>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <SellerInformationCard item={item} />
        </View>
        <StatusCard status={status} />
        <Text
          style={[theme.textStyles.cardStatusTitle, { textAlign: "center" }]}
        >
          {i18n.t("try_a_different_amount")}
        </Text>
        <Text style={[theme.textStyles.bodyLarge, { textAlign: "center" }]}>
          {i18n.t("try_a_different_amount_description", {
            seller: "Karim Benzema",
          })}
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.background_card, gap: 20 },
          ]}
        >
          <WeightSelectorCard item={item} />
        </View>
        <Button
          text={i18n.t("send_new_request")}
          rightIcon={<Send size={24} color="#FFFFFF" />}
        />
      </>
    );
  };

  const PaymentRequiredContent = () => {
    return (
      <>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <TransactionProgressCard step={2} buyer={true} />
        </View>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <SellerInformationCard item={item} />
        </View>
        <StatusCard status={status} />
        <CancelTransaction />
      </>
    );
  };

  const CancelledContent = () => {
    return (
      <>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <SellerInformationCard item={item} />
        </View>
        <StatusCard status={status} />
      </>
    );
  };

  const ReservationReceivedContent = () => {
    return (
      <>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <TransactionProgressCard step={0} buyer={false} />
        </View>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <SellerInformationCard item={item} />
        </View>
        <StatusCard status={status} />
        <Button
          text={i18n.t("accept_request")}
          leftIcon={<CheckCircle size={24} color="#FFFFFF" />}
        />
        <Button
          text={i18n.t("decline_request")}
          leftIcon={<XCircle size={24} color="#FFFFFF" />}
          color={Colors.error_color}
        />
      </>
    );
  };

  const AwaitingPaymentContent = () => {
    return (
      <>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <TransactionProgressCard step={1} buyer={false} />
        </View>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <SellerInformationCard item={item} />
        </View>
        <StatusCard status={status} />
        <CancelTransaction />
      </>
    );
  };

  const CompletedContent = ({ buyer }) => {
    return (
      <>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          {buyer === true ? (
            <TransactionProgressCard step={4} buyer={buyer} />
          ) : (
            <TransactionProgressCard step={3} buyer={buyer} />
          )}
        </View>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <SellerInformationCard item={item} />
        </View>
        <StatusCard status={status} buyer={buyer} />
      </>
    );
  };

  const ConfirmedContent = ({ buyer }) => {
    return (
      <>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          {buyer === true ? (
            <TransactionProgressCard step={3} buyer={buyer} />
          ) : (
            <TransactionProgressCard step={2} buyer={buyer} />
          )}
        </View>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <SellerInformationCard item={item} />
        </View>
        <StatusCard status={status} buyer={buyer} />
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <MeetingDetailsCard />
        </View>
        <CancelTransaction />
      </>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background_card,
            borderBottomColor: theme.navTopBorder,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color={theme.title} />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={theme.textStyles.sectionTitle}>
              {i18n.t("flight")} EK 203
            </Text>
            <Text style={theme.textStyles.bodyMedium}>{item?.departureAirport} → {item?.arrivalAirport}</Text>
          </View>
          <StatusBadge status={status} />
        </View>
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Content */}
        <View style={styles.content}>
          {status === TRANSACTION_STATUS.BROWSE_LISTING && (
            <BrowseListingContent />
          )}
          {status === TRANSACTION_STATUS.WAITING_FOR_RESPONSE && (
            <WaitingForResponseContent />
          )}
          {status === TRANSACTION_STATUS.REQUEST_REJECTED && (
            <RequestRejectedContent />
          )}
          {status === TRANSACTION_STATUS.PAYMENT_REQUIRED && (
            <PaymentRequiredContent />
          )}
          {status === TRANSACTION_STATUS.CANCELLED && <CancelledContent />}
          {status === TRANSACTION_STATUS.RESERVATION_RECEIVED && (
            <ReservationReceivedContent />
          )}
          {status === TRANSACTION_STATUS.AWAITING_PAYMENT && (
            <AwaitingPaymentContent />
          )}
          {status === TRANSACTION_STATUS.COMPLETED && (
            <CompletedContent buyer={buyer} />
          )}
          {status === TRANSACTION_STATUS.CONFIRMED && (
            <ConfirmedContent buyer={buyer} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 15,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  containerMeetingDetails: {
    gap: 20,
  },
  contentColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 4,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
