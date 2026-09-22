import {
  CheckCircle,
  Clock,
  Plane,
  XCircle,
  AlertCircle,
  CreditCard,
} from "lucide-react-native";
import Label from "@/components/Label";
import Colors from "@/theme/Colors";
import {
  TRANSACTION_STATUS,
} from "@/constants/transaction-status";
import i18n from "@/i18n";

const StatusBadge = ({ status }) => {
  switch (status) {
    case TRANSACTION_STATUS.BROWSE_LISTING:
      return (
        <Label
          text={i18n.t(`browse_listings`)}
          borderColor={Colors.browse_listing_badge_border}
          backgroundColor={Colors.browse_listing_badge_background}
          icon={<Plane size={16} color={Colors.tertiary_color} />}
          colorText={Colors.tertiary_color}
        />
      );
    case TRANSACTION_STATUS.WAITING_FOR_RESPONSE_BUYER:
      return (
        <Label
          text={i18n.t(`waiting_for_response`)}
          borderColor={Colors.waiting_for_response_badge_border}
          backgroundColor={Colors.waiting_for_response_badge_background}
          icon={<Clock size={16} color={Colors.dark_cyan} />}
          colorText={Colors.dark_cyan}
        />
      );
    case TRANSACTION_STATUS.WAITING_FOR_RESPONSE_SELLER:
      return (
        <Label
          text={i18n.t(`waiting_for_response`)}
          borderColor={Colors.waiting_for_response_seller_badge_border}
          backgroundColor={Colors.waiting_for_response_seller_badge_background}
          icon={<XCircle size={16} color={Colors.red} />}
          colorText={Colors.red}
        />
      );
    case TRANSACTION_STATUS.REQUEST_REJECTED:
      return (
        <Label
          text={i18n.t(`request_rejected`)}
          borderColor={Colors.request_rejected_badge_border}
          backgroundColor={Colors.request_rejected_badge_background}
          icon={<XCircle size={16} color={Colors.red} />}
          colorText={Colors.red}
        />
      );
    case TRANSACTION_STATUS.PAYMENT_REQUIRED:
      return (
        <Label
          text={i18n.t(`payment_required`)}
          borderColor={Colors.payment_required_badge_border}
          backgroundColor={Colors.payment_required_badge_background}
          icon={<CreditCard size={16} color={Colors.dark_cyan} />}
          colorText={Colors.dark_cyan}
        />
      );
    case TRANSACTION_STATUS.CONFIRMED:
      return (
        <Label
          text={i18n.t(`confirmed`)}
          borderColor={Colors.confirmed_badge_border}
          backgroundColor={Colors.confirmed_badge_background}
          icon={<CheckCircle size={16} color={Colors.light_green} />}
          colorText={Colors.light_green}
        />
      );
    case TRANSACTION_STATUS.COMPLETED:
      return (
        <Label
          text={i18n.t(`completed`)}
          borderColor={Colors.completed_badge_border}
          backgroundColor={Colors.completed_badge_background}
          icon={<CheckCircle size={16} color={Colors.background_color} />}
          colorText={Colors.background_color}
        />
      );
    case TRANSACTION_STATUS.CANCELLED:
      return (
        <Label
          text={i18n.t(`cancelled`)}
          borderColor={Colors.cancelled_badge_border}
          backgroundColor={Colors.cancelled_badge_background}
          icon={<XCircle size={16} color={Colors.red} />}
          colorText={Colors.red}
        />
      );
    case TRANSACTION_STATUS.RESERVATION_RECEIVED:
      return (
        <Label
          text={i18n.t(`reservation_received`)}
          borderColor={Colors.reservation_received_badge_border}
          backgroundColor={Colors.reservation_received_badge_background}
          icon={<AlertCircle size={16} color={Colors.light_yellow} />}
          colorText={Colors.light_yellow}
        />
      );
    case TRANSACTION_STATUS.AWAITING_PAYMENT:
      return (
        <Label
          text={i18n.t(`awaiting_payment`)}
          borderColor={Colors.awaiting_payment_badge_border}
          backgroundColor={Colors.awaiting_payment_badge_background}
          icon={<Clock size={16} color={Colors.dark_cyan} />}
          colorText={Colors.dark_cyan}
        />
      );
  }
};

export default StatusBadge;
