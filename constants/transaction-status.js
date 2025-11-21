export const TRANSACTION_STATUS = {
  //BUYER STATUSES
  BROWSE_LISTING: "browse_listing",
  WAITING_FOR_RESPONSE_BUYER: "waiting_for_response",
  REQUEST_REJECTED: "request_rejected",
  PAYMENT_REQUIRED: "payment_required",
  //SELLER STATUSES
  RESERVATION_RECEIVED: "reservation_received",
  AWAITING_PAYMENT: "awaiting_payment",
  WAITING_FOR_RESPONSE_SELLER: "waiting_for_response_seller",

  //BOTH STATUSES
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const TRANSACTION_STATUS_LABELS = {
  //BUYER STATUSES
  [TRANSACTION_STATUS.BROWSE_LISTING]: "Browse listing",
  [TRANSACTION_STATUS.WAITING_FOR_RESPONSE_BUYER]: "Waiting for response",
  [TRANSACTION_STATUS.REQUEST_REJECTED]: "Request rejected",
  [TRANSACTION_STATUS.PAYMENT_REQUIRED]: "Payment required",
  //SELLER STATUSES
  [TRANSACTION_STATUS.RESERVATION_RECEIVED]: "Reservation received",
  [TRANSACTION_STATUS.AWAITING_PAYMENT]: "Awaiting payment",
  [TRANSACTION_STATUS.WAITING_FOR_RESPONSE_SELLER]: "Waiting for response",

  //BOTH STATUSES
  [TRANSACTION_STATUS.CONFIRMED]: "Confirmed",
  [TRANSACTION_STATUS.COMPLETED]: "Completed",
  [TRANSACTION_STATUS.CANCELLED]: "Cancelled",
};
