import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../theme/Colors";
import {
  Luggage,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
} from "lucide-react-native";
import Button from "./Button";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import StripePaymentModal from "./StripePaymentModal";
import { useThemeContext } from "../contexts/ThemeContext";
import i18n from "@/i18n";

const StatusCard = ({ status, buyer }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;

  const BottomContentConfirmedCompleted = ({ buyer, status }) => (
    <View
      style={[
        styles.bottomContainer,
        { alignItems: "center", backgroundColor: theme.title_inverse },
      ]}
    >
      <View style={styles.bottomInfo}>
        {buyer && status === TRANSACTION_STATUS.CONFIRMED && (
          <Text style={theme.textStyles.bodyLarge}>
            {i18n.t("total_paid")}
          </Text>
        )}
        {!buyer && status === TRANSACTION_STATUS.CONFIRMED && (
          <Text style={theme.textStyles.bodyLarge}>
            {i18n.t("amount_received")}
          </Text>
        )}
        {status === TRANSACTION_STATUS.COMPLETED && (
          <Text style={theme.textStyles.bodyLarge}>
            {i18n.t("transaction_total")}
          </Text>
        )}
      </View>
      <View style={styles.bottomInfo}>
        <Text
          style={[theme.textStyles.number, { color: Colors.success_color }]}
        >
          $96
        </Text>
      </View>
      <View style={styles.bottomInfo}>
        <Text style={[theme.textStyles.bodyLarge]}>
          8kg - $12/kg
        </Text>
      </View>
    </View>
  );

  const BottomContentPaymentReservation = ({ status }) => (
    <View
      style={[styles.bottomContainer, { backgroundColor: theme.title_inverse }]}
    >
      <View style={styles.bottomInfo}>
        <Text style={[theme.textStyles.bodyLarge, { color: theme.title }]}>
          {status === TRANSACTION_STATUS.RESERVATION_RECEIVED
            ? i18n.t("requested_weight")
            : i18n.t("approved_weight")}
        </Text>
        <Text style={[theme.textStyles.bodyLarge, { color: theme.title }]}>
          8kg
        </Text>
      </View>
      <View style={styles.bottomInfo}>
        <Text style={[theme.textStyles.bodyLarge, { color: theme.title }]}>
          {i18n.t("price_per_kg")}:
        </Text>
        <Text style={[theme.textStyles.bodyLarge, { color: theme.title }]}>
          $12
        </Text>
      </View>
      <View style={styles.routeLine} />
      <View style={styles.bottomInfo}>
        <Text style={theme.textStyles.titleSmall}>
          {status === TRANSACTION_STATUS.AWAITING_PAYMENT
            ? i18n.t("expected_payment")
            : i18n.t("total_amount")}
        </Text>
        <Text style={theme.textStyles.number}>$96.00</Text>
      </View>
    </View>
  );

  const BrowseListingStatus = () => {
    return (
      <>
        <View style={styles.reserveIcon}>
          <Luggage size={60} color={Colors.primary_color} />
        </View>
        <Text
          style={[
            theme.textStyles.cardStatusTitle,
            { color: Colors.primary_color },
          ]}
        >
          {i18n.t("browse_listings_title")}
        </Text>
        <Text style={[theme.textStyles.bodyLarge, { textAlign: "center" }]}>
          {i18n.t("browse_listings_description")}
        </Text>
      </>
    );
  };

  const WaitingForResponseStatus = () => {
    return (
      <>
        <View style={styles.reserveIcon}>
          <Clock size={60} color={Colors.primary_color} />
        </View>
        <Text
          style={[
            theme.textStyles.cardStatusTitle,
            { color: Colors.primary_color },
          ]}
        >
          {i18n.t("waiting_for_response_title")}
        </Text>
        <Text style={[theme.textStyles.bodyLarge, { textAlign: "center" }]}>
          {i18n.t("waiting_for_response_description", {
            seller: "Karim Benzema",
          })}
        </Text>
        <View
          style={[
            styles.bottomContainer,
            {
              flexDirection: "row",
              backgroundColor: theme.title_inverse,
              alignItems: "center",
            },
          ]}
        >
          <Text style={[theme.textStyles.bodyLarge, { color: theme.title }]}>
            {i18n.t("requested_weight")}:
          </Text>
          <Text style={theme.textStyles.number}>8kg</Text>
        </View>
      </>
    );
  };

  const RequestRejectedStatus = () => {
    return (
      <>
        <View style={styles.reserveIcon}>
          <Clock size={60} color={Colors.error_color} />
        </View>
        <Text
          style={[
            theme.textStyles.cardStatusTitle,
            { color: Colors.error_color },
          ]}
        >
          {i18n.t("waiting_for_response_title")}
        </Text>
        <Text style={[theme.textStyles.bodyLarge, { textAlign: "center" }]}>
          {i18n.t("request_rejected_description", {
            seller: "Karim Benzema",
            weight: "8kg",
          })}
        </Text>
        <View
          style={[
            styles.bottomContainer,
            {
              flexDirection: "row",
              backgroundColor: theme.title_inverse,
              alignItems: "center",
            },
          ]}
        >
          <Text style={[theme.textStyles.bodyLarge, { color: theme.title }]}>
            {i18n.t("reject_request")}:
          </Text>
          <Text
            style={[theme.textStyles.number, { color: Colors.error_color }]}
          >
            8kg
          </Text>
        </View>
      </>
    );
  };

  const PaymentRequiredStatus = () => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    return (
      <>
        <View style={styles.reserveIcon}>
          <CheckCircle size={60} color={Colors.success_color} />
        </View>
        <Text
          style={[
            theme.textStyles.cardStatusTitle,
            { color: Colors.success_color },
          ]}
        >
          {i18n.t("payment_required_title")}
        </Text>
        <Text style={[theme.textStyles.bodyLarge, { textAlign: "center" }]}>
          {i18n.t("payment_required_description", {
            seller: "Karim Benzema",
            weight: "8kg",
          })}
        </Text>
        <BottomContentPaymentReservation
          status={TRANSACTION_STATUS.PAYMENT_REQUIRED}
        />
        <Button
          text={i18n.t("complete_payment")}
          color={Colors.primary_color}
          leftIcon={<CreditCard size={24} color="#FFFFFF" />}
          onPress={() => setShowPaymentModal(true)}
        />
        <StripePaymentModal
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        />
      </>
    );
  };

  const ConfirmedStatus = ({ buyer }) => {
    return (
      <>
        {buyer ? (
          <>
            <View style={styles.reserveIcon}>
              <CheckCircle size={60} color={Colors.success_color} />
            </View>
            <Text
              style={[
                theme.textStyles.cardStatusTitle,
                { color: Colors.success_color },
              ]}
            >
              {i18n.t("confirmed_title_buyer")}
            </Text>
            <Text style={[theme.textStyles.bodyLarge, { textAlign: "center" }]}>
              {i18n.t("confirmed_description_buyer")}
            </Text>
            <BottomContentConfirmedCompleted
              buyer={buyer}
              status={TRANSACTION_STATUS.CONFIRMED}
            />
          </>
        ) : (
          <>
            <View style={styles.reserveIcon}>
              <CheckCircle size={60} color={Colors.success_color} />
            </View>
            <Text
              style={[
                theme.textStyles.cardStatusTitle,
                { color: Colors.success_color },
              ]}
            >
              {i18n.t("confirmed_title_seller")}
            </Text>
            <Text style={[theme.textStyles.bodyLarge, { textAlign: "center" }]}>
              {i18n.t("confirmed_description_seller")}
            </Text>
            <BottomContentConfirmedCompleted
              buyer={buyer}
              status={TRANSACTION_STATUS.CONFIRMED}
            />
          </>
        )}
      </>
    );
  };

  const CompletedStatus = () => {
    return (
      <>
        <View style={styles.reserveIcon}>
          <CheckCircle size={60} color={Colors.success_color} />
        </View>
        <Text
          style={[
            theme.textStyles.cardStatusTitle,
            { color: Colors.success_color },
          ]}
        >
          {i18n.t("completed_title")}
        </Text>
        <Text style={[theme.textStyles.bodyLarge, { textAlign: "center" }]}>
          {i18n.t("completed_description")}
        </Text>
        <BottomContentConfirmedCompleted
          status={TRANSACTION_STATUS.COMPLETED}
        />
      </>
    );
  };

  const CancelledStatus = () => {
    return (
      <>
        <View style={styles.reserveIcon}>
          <XCircle size={60} color={Colors.error_color} />
        </View>
        <Text
          style={[
            theme.textStyles.cardStatusTitle,
            { color: Colors.error_color },
          ]}
        >
          {i18n.t("cancelled_title")}
        </Text>
        <Text style={[theme.textStyles.bodyLarge, { textAlign: "center" }]}>
          {i18n.t("cancelled_description")}
        </Text>
      </>
    );
  };

  const ReservationReceivedStatus = () => {
    return (
      <>
        <View style={styles.reserveIcon}>
          <AlertCircle size={60} color={Colors.light_yellow} />
        </View>
        <Text
          style={[
            theme.textStyles.cardStatusTitle,
            { color: Colors.light_yellow },
          ]}
        >
          {i18n.t("reservation_received_title")}
        </Text>
        <Text style={[theme.textStyles.bodyLarge, { textAlign: "center" }]}>
          {i18n.t("reservation_received_description", {
            buyer: "Vin Diesel",
            weight: "8kg",
          })}
        </Text>
        <BottomContentPaymentReservation
          status={TRANSACTION_STATUS.RESERVATION_RECEIVED}
        />
      </>
    );
  };

  const AwaitingPaymentStatus = () => {
    return (
      <>
        <View style={styles.reserveIcon}>
          <Clock size={60} color={Colors.primary_color} />
        </View>
        <Text
          style={[
            theme.textStyles.cardStatusTitle,
            { color: Colors.primary_color },
          ]}
        >
          {i18n.t("awaiting_payment_title")}
        </Text>
        <Text style={[theme.textStyles.bodyLarge, { textAlign: "center" }]}>
          {i18n.t("awaiting_payment_description", { buyer: "Vin Diesel" })}
        </Text>
        <BottomContentPaymentReservation
          status={TRANSACTION_STATUS.AWAITING_PAYMENT}
        />
      </>
    );
  };

  return (
    <View
      style={
        status === TRANSACTION_STATUS.BROWSE_LISTING
          ? [
              styles.reserveCard,
              { backgroundColor: Colors.dark_cyan_translucent_3 },
            ]
          : status === TRANSACTION_STATUS.WAITING_FOR_RESPONSE
          ? [
              styles.reserveCard,
              { backgroundColor: Colors.dark_cyan_translucent_3 },
            ]
          : status === TRANSACTION_STATUS.REQUEST_REJECTED
          ? [styles.reserveCard, { backgroundColor: Colors.red_translucent_3 }]
          : status === TRANSACTION_STATUS.PAYMENT_REQUIRED
          ? [
              styles.reserveCard,
              { backgroundColor: Colors.light_green_translucent_3 },
            ]
          : status === TRANSACTION_STATUS.CONFIRMED
          ? [
              styles.reserveCard,
              { backgroundColor: Colors.light_green_translucent_3 },
            ]
          : status === TRANSACTION_STATUS.COMPLETED
          ? [
              styles.reserveCard,
              { backgroundColor: Colors.light_green_translucent_3 },
            ]
          : status === TRANSACTION_STATUS.CANCELLED
          ? [styles.reserveCard, { backgroundColor: Colors.red_translucent_3 }]
          : status === TRANSACTION_STATUS.RESERVATION_RECEIVED
          ? [
              styles.reserveCard,
              { backgroundColor: Colors.light_yellow_translucent_3 },
            ]
          : status === TRANSACTION_STATUS.AWAITING_PAYMENT
          ? [
              styles.reserveCard,
              { backgroundColor: Colors.dark_cyan_translucent_3 },
            ]
          : styles.reserveCard
      }
    >
      {status === TRANSACTION_STATUS.BROWSE_LISTING && <BrowseListingStatus />}
      {status === TRANSACTION_STATUS.WAITING_FOR_RESPONSE && (
        <WaitingForResponseStatus />
      )}
      {status === TRANSACTION_STATUS.REQUEST_REJECTED && (
        <RequestRejectedStatus />
      )}
      {status === TRANSACTION_STATUS.PAYMENT_REQUIRED && (
        <PaymentRequiredStatus />
      )}
      {status === TRANSACTION_STATUS.CONFIRMED && (
        <ConfirmedStatus buyer={buyer} />
      )}
      {status === TRANSACTION_STATUS.COMPLETED && <CompletedStatus />}
      {status === TRANSACTION_STATUS.CANCELLED && <CancelledStatus />}
      {status === TRANSACTION_STATUS.RESERVATION_RECEIVED && (
        <ReservationReceivedStatus />
      )}
      {status === TRANSACTION_STATUS.AWAITING_PAYMENT && (
        <AwaitingPaymentStatus />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  reserveCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    gap: 17,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  reserveIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    borderRadius: 12,
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
    gap: 5,
  },
  bottomInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },
  routeLine: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.very_light_grey,
  },
});

export default StatusCard;
