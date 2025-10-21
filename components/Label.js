import { Text, StyleSheet, View } from "react-native";
import Colors from "../theme/Colors";
import {
  Plane,
  Clock,
  XCircle,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react-native";

const Label = ({ name }) => {
  return (
    <View
      style={
        name === "Browse listing"
          ? [styles.browseListingBadge, styles.badge]
          : name === "Waiting for response"
          ? [styles.waitingForResponseBadge, styles.badge]
          : name === "Request rejected"
          ? [styles.requestRejectedBadge, styles.badge]
          : name === "Payment required"
          ? [styles.paymentRequiredBadge, styles.badge]
          : name === "Confirmed"
          ? [styles.confirmedBadge, styles.badge]
          : name === "Completed"
          ? [styles.completedBadge, styles.badge]
          : name === "Cancelled"
          ? [styles.cancelledBadge, styles.badge]
          : name === "Reservation received"
          ? [styles.reservationReceivedBadge, styles.badge]
          : name === "Awaiting payment"
          ? [styles.awaitingPaymentBadge, styles.badge]
          : styles.badge
      }
    >
      {name === "Browse listing" && (
        <Plane size={16} color={Colors.tertiary_color} />
      )}
      {name === "Waiting for response" && (
        <Clock size={16} color={Colors.dark_cyan} />
      )}
      {name === "Request rejected" && <XCircle size={16} color={Colors.red} />}
      {name === "Payment required" && (
        <CreditCard size={16} color={Colors.dark_cyan} />
      )}
      {name === "Confirmed" && (
        <CheckCircle size={16} color={Colors.light_green} />
      )}
      {name === "Completed" && (
        <Plane size={16} color={Colors.background_color} />
      )}
      {name === "Cancelled" && <XCircle size={16} color={Colors.red} />}
      {name === "Reservation received" && (
        <AlertCircle size={16} color={Colors.light_yellow} />
      )}
      {name === "Awaiting payment" && (
        <Clock size={16} color={Colors.dark_cyan} />
      )}

      <Text
        style={
          name === "Browse listing"
            ? styles.browseListingText
            : name === "Waiting for response"
            ? styles.darkCyanText
            : name === "Request rejected"
            ? styles.redText
            : name === "Payment required"
            ? styles.darkCyanText
            : name === "Confirmed"
            ? styles.confirmedText
            : name === "Completed"
            ? styles.completedText
            : name === "Cancelled"
            ? styles.redText
            : name === "Reservation received"
            ? styles.reservationReceivedText
            : name === "Awaiting payment"
            ? styles.darkCyanText
            : styles.badgeText
        }
      >
        {name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  browseListingBadge: {
    borderColor: Colors.browse_listing_badge_border,
    backgroundColor: Colors.browse_listing_badge_background,
  },
  waitingForResponseBadge: {
    borderColor: Colors.waiting_for_response_badge_border,
    backgroundColor: Colors.waiting_for_response_badge_background,
  },
  requestRejectedBadge: {
    borderColor: Colors.request_rejected_badge_border,
    backgroundColor: Colors.request_rejected_badge_background,
  },
  paymentRequiredBadge: {
    borderColor: Colors.payment_required_badge_border,
    backgroundColor: Colors.payment_required_badge_background,
  },
  confirmedBadge: {
    borderColor: Colors.confirmed_badge_border,
    backgroundColor: Colors.confirmed_badge_background,
  },
  completedBadge: {
    borderColor: Colors.completed_badge_border,
    backgroundColor: Colors.completed_badge_background,
  },
  cancelledBadge: {
    borderColor: Colors.cancelled_badge_border,
    backgroundColor: Colors.cancelled_badge_background,
  },
  reservationReceivedBadge: {
    borderColor: Colors.reservation_received_badge_border,
    backgroundColor: Colors.reservation_received_badge_background,
  },
  awaitingPaymentBadge: {
    borderColor: Colors.awaiting_payment_badge_border,
    backgroundColor: Colors.awaiting_payment_badge_background,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  browseListingText: {
    color: Colors.tertiary_color,
  },
  redText: {
    color: Colors.red,
  },
  confirmedText: {
    color: Colors.light_green,
  },
  completedText: {
    color: Colors.background_color,
  },
  reservationReceivedText: {
    color: Colors.light_yellow,
  },
  darkCyanText: {
    color: Colors.dark_cyan,
  },
});

export default Label;
