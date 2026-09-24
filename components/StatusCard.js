import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/theme/Colors";
import {
  Luggage,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react-native";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
// import StripePaymentModal from "./StripePaymentModal";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";
import Currency from "@/components/Currency";

const StatusCard = ({ status, role, transaction }) => {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  let name = transaction?.listingInfo?.sellerUserInfo?.name;
  // Lus une fois ici plutôt que dans les fonctions render* : le React Compiler
  // perd le premier `?.` dans les dépendances qu'il mémoïse pour ces closures
  // (`transaction.listingInfo`), ce qui plante tant que la transaction n'existe pas.
  const total = transaction?.total;
  const weight = transaction?.weight;
  const pricePerKg = transaction?.listingInfo?.pricePerKg;
  const buyerName = transaction?.buyerInfo?.name;

  const renderBottomContentConfirmedCompleted = ({ role, status }) => (
    <View
      style={[
        styles.bottomContainer,
        { alignItems: "center", backgroundColor: theme.title_inverse },
      ]}
    >
      <View style={styles.bottomInfo}>
        {role === "buyer" && status === TRANSACTION_STATUS.CONFIRMED && (
          <Text style={theme.textStyles.bodyLarge}>{i18n.t("total_paid")}</Text>
        )}
        {role === "seller" && status === TRANSACTION_STATUS.CONFIRMED && (
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
        <Currency
          amount={total}
          style={[theme.textStyles.number, { color: Colors.success_color }]}
        />
      </View>
      <View style={styles.bottomInfo}>
        <Text style={[theme.textStyles.bodyLarge]}>
          {weight}kg -{" "}
          <Currency amount={pricePerKg} />
          /kg
        </Text>
      </View>
    </View>
  );

  const renderBottomContentPaymentReservation = ({ status }) => (
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
          {weight}kg
        </Text>
      </View>
      <View style={styles.bottomInfo}>
        <Text style={[theme.textStyles.bodyLarge, { color: theme.title }]}>
          {i18n.t("price_per_kg")}:
        </Text>
        <Currency
          amount={pricePerKg}
          style={[theme.textStyles.bodyLarge, { color: theme.title }]}
        />
      </View>
      <View style={styles.routeLine} />
      <View style={styles.bottomInfo}>
        <Text style={theme.textStyles.titleSmall}>
          {status === TRANSACTION_STATUS.AWAITING_PAYMENT
            ? i18n.t("expected_payment")
            : i18n.t("total_amount")}
        </Text>
        <Currency amount={total} style={theme.textStyles.number} />
      </View>
    </View>
  );

  const renderBrowseListingStatus = () => {
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

  const renderWaitingForResponseStatus = () => {
    if (status === TRANSACTION_STATUS.WAITING_FOR_RESPONSE_BUYER) {
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
              seller: name,
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
            <Text style={theme.textStyles.number}>{weight}kg</Text>
          </View>
        </>
      );
    } else {
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
            {i18n.t("waiting_for_response_title")}
          </Text>
          <Text style={[theme.textStyles.bodyLarge, { textAlign: "center" }]}>
            {i18n.t("waiting_for_response_description", {
              seller: name,
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
              {weight}kg
            </Text>
          </View>
        </>
      );
    }
  };

  const renderRequestRejectedStatus = () => {
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
          {i18n.t("request_rejected_title")}
        </Text>
        <Text style={[theme.textStyles.bodyLarge, { textAlign: "center" }]}>
          {i18n.t("request_rejected_description", {
            seller: name,
            weight: weight + "kg",
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
            {weight}kg
          </Text>
        </View>
      </>
    );
  };

  const renderPaymentRequiredStatus = () => {
    // const [showPaymentModal, setShowPaymentModal] = useState(false);
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
            seller: name,
            weight: weight + "kg",
          })}
        </Text>
        {renderBottomContentPaymentReservation({
          status: TRANSACTION_STATUS.PAYMENT_REQUIRED,
        })}
        {/* <StripePaymentModal
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        /> */}
      </>
    );
  };

  const renderConfirmedStatus = ({ role }) => {
    return (
      <>
        {role === "buyer" ? (
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
            {renderBottomContentConfirmedCompleted({
              role,
              status: TRANSACTION_STATUS.CONFIRMED,
            })}
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
            {renderBottomContentConfirmedCompleted({
              role,
              status: TRANSACTION_STATUS.CONFIRMED,
            })}
          </>
        )}
      </>
    );
  };

  const renderCompletedStatus = () => {
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
        {renderBottomContentConfirmedCompleted({
          status: TRANSACTION_STATUS.COMPLETED,
        })}
      </>
    );
  };

  const renderCancelledStatus = () => {
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

  const renderReservationReceivedStatus = () => {
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
            buyer: buyerName,
            weight: weight + "kg",
          })}
        </Text>
        {renderBottomContentPaymentReservation({
          status: TRANSACTION_STATUS.RESERVATION_RECEIVED,
        })}
      </>
    );
  };

  const renderAwaitingPaymentStatus = () => {
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
        {renderBottomContentPaymentReservation({
          status: TRANSACTION_STATUS.AWAITING_PAYMENT,
        })}
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
          : status === TRANSACTION_STATUS.WAITING_FOR_RESPONSE_BUYER
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
          : status === TRANSACTION_STATUS.WAITING_FOR_RESPONSE_SELLER
          ? [styles.reserveCard, { backgroundColor: Colors.red_translucent_3 }]
          : styles.reserveCard
      }
    >
      {status === TRANSACTION_STATUS.BROWSE_LISTING && (
        renderBrowseListingStatus()
      )}
      {status === TRANSACTION_STATUS.WAITING_FOR_RESPONSE_BUYER && (
        renderWaitingForResponseStatus()
      )}
      {status === TRANSACTION_STATUS.WAITING_FOR_RESPONSE_SELLER && (
        renderWaitingForResponseStatus()
      )}
      {status === TRANSACTION_STATUS.REQUEST_REJECTED && (
        renderRequestRejectedStatus()
      )}
      {status === TRANSACTION_STATUS.PAYMENT_REQUIRED && (
        renderPaymentRequiredStatus()
      )}
      {status === TRANSACTION_STATUS.CONFIRMED && (
        renderConfirmedStatus({ role })
      )}
      {status === TRANSACTION_STATUS.COMPLETED && renderCompletedStatus()}
      {status === TRANSACTION_STATUS.CANCELLED && renderCancelledStatus()}
      {status === TRANSACTION_STATUS.RESERVATION_RECEIVED && (
        renderReservationReceivedStatus()
      )}
      {status === TRANSACTION_STATUS.AWAITING_PAYMENT && (
        renderAwaitingPaymentStatus()
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
