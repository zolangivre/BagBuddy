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

export default function TransactionDetailScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const router = useRouter();
  const { status } = useLocalSearchParams();
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
          <Text style={[styles.titleRow, { color: theme.title }]}>
            {i18n.t("meeting_details")}
          </Text>
        </View>
        <View style={[styles.contentColumn, { gap: 10 }]}>
          <View style={styles.contentRow}>
            <MapPin size={16} color={Colors.primary_color} />
            <View style={styles.contentColumn}>
              <Text style={[styles.titleRow, { color: theme.title }]}>
                {i18n.t("check_in_counter")}
              </Text>
              <Text style={[styles.flightNumber, { color: theme.text }]}>
                Emirates - EK 203
              </Text>
            </View>
          </View>
          <View style={styles.contentRow}>
            <Calendar size={16} color={Colors.primary_color} />
            <View style={styles.contentColumn}>
              <Text style={[styles.titleRow, { color: theme.title }]}>
                Dec 25, 2024
              </Text>
              <Text style={[styles.flightNumber, { color: theme.text }]}>
                Arrive by 14:30
              </Text>
            </View>
          </View>
          <View style={styles.contentRow}>
            <Weight size={16} color={Colors.primary_color} />
            <View style={styles.contentColumn}>
              <Text style={[styles.titleRow, { color: theme.title }]}>
                8kg reserved
              </Text>
              <Text style={[styles.flightNumber, { color: theme.text }]}>
                $96 total
              </Text>
            </View>
          </View>
        </View>
        <Button text="Mark as completed" color={Colors.success_color} />
      </View>
    );
  };

  const BrowseListingContent = () => {
    const status = TRANSACTION_STATUS.BROWSE_LISTING;
    return (
      <>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <TransactionProgressCard step={0} buyer={true} />
        </View>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <SellerInformationCard status={status} />
        </View>
        <StatusCard status={status} />
        <View
          style={[
            styles.weightSelectorCard,
            { backgroundColor: theme.background_card },
          ]}
        >
          <WeightSelectorCard />
        </View>
        <Button
          text={i18n.t("send_reservation_request")}
          rightIcon={<Send size={24} color="#FFFFFF" />}
        />
      </>
    );
  };

  const WaitingForResponseContent = () => {
    const status = TRANSACTION_STATUS.WAITING_FOR_RESPONSE;
    return (
      <>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <TransactionProgressCard step={1} buyer={true} />
        </View>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <SellerInformationCard status={status} />
        </View>
        <StatusCard status={status} />
      </>
    );
  };

  const RequestRejectedContent = () => {
    const status = TRANSACTION_STATUS.REQUEST_REJECTED;
    return (
      <>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <TransactionProgressCard step={1} buyer={true} />
        </View>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <SellerInformationCard status={status} />
        </View>
        <StatusCard status={status} />
        <Text style={[styles.text, { color: theme.title, fontWeight: "500" }]}>
          {i18n.t("try_different_amount")}
        </Text>
        <Text style={[styles.text, { color: theme.text }]}>
          {i18n.t("try_different_amount_description")}
        </Text>
        <View
          style={[
            styles.weightSelectorCard,
            { backgroundColor: theme.background_card },
          ]}
        >
          <WeightSelectorCard />
        </View>
        <Button
          text={i18n.t("send_new_request")}
          rightIcon={<Send size={24} color="#FFFFFF" />}
        />
      </>
    );
  };

  const PaymentRequiredContent = () => {
    const status = TRANSACTION_STATUS.PAYMENT_REQUIRED;
    return (
      <>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <TransactionProgressCard step={2} buyer={true} />
        </View>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <SellerInformationCard status={status} />
        </View>
        <StatusCard status={status} />
        <CancelTransaction />
      </>
    );
  };

  const CancelledContent = () => {
    const status = TRANSACTION_STATUS.CANCELLED;
    return (
      <>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <SellerInformationCard status={status} />
        </View>
        <StatusCard status={status} />
      </>
    );
  };

  const ReservationReceivedContent = () => {
    const status = TRANSACTION_STATUS.RESERVATION_RECEIVED;
    return (
      <>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <TransactionProgressCard step={0} buyer={false} />
        </View>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <SellerInformationCard status={status} />
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
    const status = TRANSACTION_STATUS.AWAITING_PAYMENT;
    return (
      <>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <TransactionProgressCard step={1} buyer={false} />
        </View>
        <View style={[styles.card, { backgroundColor: theme.background_card }]}>
          <SellerInformationCard status={status} />
        </View>
        <StatusCard status={status} />
        <CancelTransaction />
      </>
    );
  };

  const CompletedContent = ({ buyer }) => {
    const status = TRANSACTION_STATUS.COMPLETED;
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
          <SellerInformationCard status={status} />
        </View>
        <StatusCard status={status} buyer={buyer} />
      </>
    );
  };

  const ConfirmedContent = ({ buyer }) => {
    const status = TRANSACTION_STATUS.CONFIRMED;
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
          <SellerInformationCard status={status} />
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
            <Text style={[styles.flightTitle, { color: theme.title }]}>
              {i18n.t("flight")} EK 203
            </Text>
            <Text style={[styles.flightRoute, { color: theme.text }]}>
              DXB → JFK
            </Text>
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
  flightTitle: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  flightRoute: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  content: {
    padding: 16,
    gap: 15,
  },
  weightSelectorCard: {
    padding: 20,
    borderRadius: 16,
    gap: 20,
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
  text: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    textAlign: "center",
  },
  containerMeetingDetails: {
    gap: 20,
  },
  titleRow: {
    fontSize: 18,
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
  flightNumber: {
    fontSize: 14,
    color: Colors.tertiary_color,
  },
});
