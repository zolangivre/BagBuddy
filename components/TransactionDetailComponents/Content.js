import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import BrowseListingContent from "./BrowseListingContent";
import WaitingForResponseContent from "./WaitingForResponseContent";
import RequestRejectedContent from "./RequestRejectedContent";
import PaymentRequiredContent from "./PaymentRequiredContent";
import CancelledContent from "./CancelledContent";
import ReservationReceivedContent from "./ReservationReceivedContent";
import AwaitingPaymentContent from "./AwaitingPaymentContent";
import CompletedContent from "./CompletedContent";
import ConfirmedContent from "./ConfirmedContent";

export default function Content({
  transaction,
  listing,
  status,
  role,
  userInfo,
  reviews,
}) {
  switch (status) {
    case TRANSACTION_STATUS.BROWSE_LISTING:
      return (
        <BrowseListingContent
          listing={listing}
          role={role}
          userInfo={userInfo}
          status={status}
        />
      );
    case TRANSACTION_STATUS.WAITING_FOR_RESPONSE_BUYER:
    case TRANSACTION_STATUS.WAITING_FOR_RESPONSE_SELLER:
      return (
        <WaitingForResponseContent
          transaction={transaction}
          role={role}
          status={status}
        />
      );
    case TRANSACTION_STATUS.REQUEST_REJECTED:
      return (
        <RequestRejectedContent
          transaction={transaction}
          role={role}
          status={status}
        />
      );
    case TRANSACTION_STATUS.PAYMENT_REQUIRED:
      return (
        <PaymentRequiredContent
          transaction={transaction}
          role={role}
          status={status}
        />
      );
    case TRANSACTION_STATUS.CANCELLED:
      return <CancelledContent transaction={transaction} status={status} />;
    case TRANSACTION_STATUS.RESERVATION_RECEIVED:
      return (
        <ReservationReceivedContent
          transaction={transaction}
          role={role}
          status={status}
        />
      );
    case TRANSACTION_STATUS.AWAITING_PAYMENT:
      return (
        <AwaitingPaymentContent
          transaction={transaction}
          role={role}
          status={status}
        />
      );
    case TRANSACTION_STATUS.COMPLETED:
      return (
        <CompletedContent
          transaction={transaction}
          role={role}
          userInfo={userInfo}
          reviews={reviews}
          status={status}
        />
      );
    case TRANSACTION_STATUS.CONFIRMED:
      return (
        <ConfirmedContent
          transaction={transaction}
          role={role}
          status={status}
        />
      );
    default:
      return null;
  }
}
