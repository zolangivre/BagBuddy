import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
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
  CreditCard,
  Star,
} from "lucide-react-native";
import Colors from "@/theme/Colors";
import Button from "@/components/Button";
import TransactionProgressCard from "@/components/TransactionProgressCard";
import SellerInformationCard from "@/components/SellerInformationCard";
import WeightSelectorCard from "@/components/WeightSelectorCard";
// import AlertModal from "@/components/AlertModal";
import StatusBadge from "@/components/StatusBadge";
import StatusCard from "@/components/StatusCard";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import { useThemeContext } from "@/contexts/ThemeContext";
import i18n from "@/i18n";
import { globalStyles } from "@/theme/Styles";
import { formatLocalizedDate } from "@/components/LocalizedDateTime";
import { useLanguage } from "@/contexts/LanguageContext";
import Currency from "@/components/Currency";
import axios from "axios";
import { AuthContext } from "@/contexts/AuthContext";
import ReviewModal from "@/components/ReviewModal";
import ReviewCard from "@/components/ReviewCard";

export default function TransactionDetailScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();
  const { language } = useLanguage();
  const { transactionId, listingId } = useLocalSearchParams();
  const [listing, setListing] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const { state } = useContext(AuthContext);
  const userInfo = state.userInfo;
  const [status, setStatus] = useState(TRANSACTION_STATUS.BROWSE_LISTING);
  const [role, setRole] = useState("buyer");
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const reviewRes = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/reviews/transaction/${transactionId}`
      );
      setReviews(reviewRes.data);
      console.log("fetched reviews:", reviewRes.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchData = async () => {
    try {
      if (listingId) {
        const listingRes = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/trips/${listingId}`
        );
        setListing(listingRes.data);
        if (userInfo.sub === listingRes.data.userId) {
          setRole("seller");
        } else {
          setRole("buyer");
        }
      }

      if (transactionId) {
        const transactionRes = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/transactions/${transactionId}`
        );
        setTransaction(transactionRes.data);
        setListing(transactionRes.data.listingInfo);
        if (userInfo.sub === transactionRes.data.buyerId) {
          setStatus(transactionRes.data.buyerStatus);
          setRole("buyer");
        } else {
          setStatus(transactionRes.data.sellerStatus);
          setRole("seller");
        }
        if (
          transactionRes.data.buyerReview ||
          transactionRes.data.sellerReview
        ) {
          fetchReviews();
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [listingId, transactionId]);

  const dateDeparture = formatLocalizedDate(listing?.departureDate, language);

  const CancelTransaction = () => {
    const handleCancelTransaction = () => {
      if (!transactionId) return;

      Alert.alert(
        i18n.t("confirm_cancel_transaction_title"),
        i18n.t("confirm_cancel_transaction_message"),
        [
          {
            text: i18n.t("cancel"),
            style: "cancel",
          },
          {
            text: i18n.t("confirm"),
            onPress: () => cancelTransaction(),
          },
        ]
      );
    };

    const cancelTransaction = async () => {
      if (!transactionId) return;
      try {
        const payload = {
          ...transaction,
          sellerStatus: TRANSACTION_STATUS.CANCELLED,
          buyerStatus: TRANSACTION_STATUS.CANCELLED,
        };

        const response = await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/transactions/${transaction.id}`,
          payload
        );
        await updateListing();
        Alert.alert(
          i18n.t("cancel_transaction_title"),
          i18n.t("cancel_transaction_message")
        );
        router.replace(`/transaction-detail?transactionId=${response.data.id}`);
      } catch (error) {
        console.error("Error updating transaction:", error);
        Alert.alert(
          i18n.t("error"),
          i18n.t("cancel_transaction_error_message")
        );
      }
    };
    const updateListing = async () => {
      if (!transactionId) return;
      try {
        const payload = {
          ...listing,
          remainingWeight: listing.remainingWeight,
        };
        await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/trips/${listing.id}`,
          payload
        );
      } catch (error) {
        console.error("Error updating listing:", error);
      }
    };
    return (
      <>
        <Button
          text={i18n.t("cancel_transaction")}
          rightIcon={<X size={24} color={Colors.white} />}
          color={Colors.error_color}
          onPress={handleCancelTransaction}
        />
      </>
    );
  };

  const MeetingDetailsCard = () => {
    return (
      <View
        style={[globalStyles.card, { backgroundColor: theme.background_card }]}
      >
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
                <Text style={theme.textStyles.bodyMedium}>
                  Emirates - EK 203
                </Text>
              </View>
            </View>
            <View style={styles.contentRow}>
              <Calendar size={16} color={Colors.primary_color} />
              <View style={styles.contentColumn}>
                <Text style={theme.textStyles.cardTitle}>{dateDeparture}</Text>
                <Text style={theme.textStyles.bodyMedium}>
                  {i18n.t("meeting_details_step_two_description", {
                    time: "14:30",
                  })}
                </Text>
              </View>
            </View>
            <View style={styles.contentRow}>
              <Weight size={16} color={Colors.primary_color} />
              <View style={styles.contentColumn}>
                <Text style={theme.textStyles.cardTitle}>
                  {i18n.t("meeting_details_step_three", { weight: "8kg" })}
                </Text>
                <Currency
                  amount={transaction?.total}
                  style={theme.textStyles.bodyMedium}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const BrowseListingContent = () => {
    const [selectedWeight, setSelectedWeight] = useState(1);

    const handleCreateTransaction = () => {
      if (!listingId) return;

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
      if (!listingId) return;
      try {
        const payload = {
          listingId: listing.id,
          listingInfo: listing,
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
        Alert.alert(
          i18n.t("error"),
          i18n.t("reservation_request_error_message")
        );
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

  const WaitingForResponseContent = () => {
    return (
      <>
        <TransactionProgressCard step={1} role={role} />
        <SellerInformationCard item={transaction} />
        <StatusCard status={status} transaction={transaction} />
      </>
    );
  };

  const RequestRejectedContent = () => {
    const [selectedWeight, setSelectedWeight] = useState(1);

    const handleNewRequest = () => {
      if (!transactionId) return;

      Alert.alert(
        i18n.t("confirm_new_request_title"),
        i18n.t("confirm_new_request_message"),
        [
          {
            text: i18n.t("cancel"),
            style: "cancel",
          },
          {
            text: i18n.t("confirm"),
            onPress: () => newRequest(),
          },
        ]
      );
    };

    const newRequest = async () => {
      if (!transactionId) return;
      try {
        const payload = {
          ...transaction,
          sellerStatus: TRANSACTION_STATUS.RESERVATION_RECEIVED,
          buyerStatus: TRANSACTION_STATUS.WAITING_FOR_RESPONSE_BUYER,
          weight: selectedWeight,
          total: selectedWeight * listing.pricePerKg,
        };

        const response = await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/transactions/${transaction.id}`,
          payload
        );
        Alert.alert(
          i18n.t("reservation_request_sent_title"),
          i18n.t("reservation_request_sent_message")
        );
        router.replace(`/transaction-detail?transactionId=${response.data.id}`);
      } catch (error) {
        console.error("Error updating transaction:", error);
        Alert.alert(
          i18n.t("error"),
          i18n.t("reservation_request_error_message")
        );
      }
    };
    //TODO: get seller name
    let name = transaction?.listingInfo?.userInfo?.name;
    return (
      <>
        <TransactionProgressCard step={1} role={role} />
        <SellerInformationCard item={transaction} />
        <StatusCard status={status} transaction={transaction} />
        <Text
          style={[theme.textStyles.cardStatusTitle, { textAlign: "center" }]}
        >
          {i18n.t("try_a_different_amount")}
        </Text>
        <Text style={[theme.textStyles.bodyLarge, { textAlign: "center" }]}>
          {i18n.t("try_a_different_amount_description", {
            seller: { name },
          })}
        </Text>
        <WeightSelectorCard
          item={listing}
          onWeightChange={(value) => {
            setSelectedWeight(value);
          }}
        />
        <Button
          onPress={handleNewRequest}
          text={i18n.t("send_new_request")}
          rightIcon={<Send size={24} color={Colors.white} />}
        />
      </>
    );
  };

  const PaymentRequiredContent = () => {
    const handleCompletePayment = () => {
      if (!transactionId) return;

      Alert.alert(
        i18n.t("confirm_payment_title"),
        i18n.t("confirm_payment_message"),
        [
          {
            text: i18n.t("cancel"),
            style: "cancel",
          },
          {
            text: i18n.t("confirm"),
            onPress: () => completePayment(),
          },
        ]
      );
    };

    const completePayment = async () => {
      if (!transactionId) return;
      try {
        const payload = {
          ...transaction,
          sellerStatus: TRANSACTION_STATUS.CONFIRMED,
          buyerStatus: TRANSACTION_STATUS.CONFIRMED,
        };

        const response = await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/transactions/${transaction.id}`,
          payload
        );
        Alert.alert(
          i18n.t("payment_completed_title"),
          i18n.t("payment_completed_message")
        );
        router.replace(`/transaction-detail?transactionId=${response.data.id}`);
      } catch (error) {
        console.error("Error updating transaction:", error);
        Alert.alert(i18n.t("error"), i18n.t("payment_completed_error_message"));
      }
    };
    return (
      <>
        <TransactionProgressCard step={2} role={role} />
        <SellerInformationCard item={transaction} />
        <StatusCard status={status} transaction={transaction} />
        <Button
          text={i18n.t("complete_payment")}
          color={Colors.primary_color}
          leftIcon={<CreditCard size={24} color={Colors.white} />}
          onPress={handleCompletePayment}
        />
        <CancelTransaction />
      </>
    );
  };

  const CancelledContent = () => {
    return (
      <>
        <SellerInformationCard item={transaction} />
        <StatusCard status={status} />
      </>
    );
  };

  const ReservationReceivedContent = () => {
    const handleAcceptRequest = () => {
      if (!transactionId) return;

      Alert.alert(
        i18n.t("confirm_accept_request_title"),
        i18n.t("confirm_accept_request_message"),
        [
          {
            text: i18n.t("cancel"),
            style: "cancel",
          },
          {
            text: i18n.t("confirm"),
            onPress: () => acceptRequest(),
          },
        ]
      );
    };
    const acceptRequest = async () => {
      if (!transactionId) return;
      try {
        const payload = {
          ...transaction,
          sellerStatus: TRANSACTION_STATUS.AWAITING_PAYMENT,
          buyerStatus: TRANSACTION_STATUS.PAYMENT_REQUIRED,
        };
        const response = await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/transactions/${transaction.id}`,
          payload
        );
        await updateListing();
        Alert.alert(
          i18n.t("request_accepted_title"),
          i18n.t("request_accepted_message")
        );
        router.replace(`/transaction-detail?transactionId=${response.data.id}`);
      } catch (error) {
        console.error("Error updating transaction:", error);
        Alert.alert(i18n.t("error"), i18n.t("request_accepted_error_message"));
      }
    };
    const handleDeclineRequest = () => {
      if (!transactionId) return;

      Alert.alert(
        i18n.t("confirm_decline_request_title"),
        i18n.t("confirm_decline_request_message"),
        [
          {
            text: i18n.t("cancel"),
            style: "cancel",
          },
          {
            text: i18n.t("confirm"),
            onPress: () => declineRequest(),
          },
        ]
      );
    };
    const declineRequest = async () => {
      if (!transactionId) return;
      try {
        const payload = {
          ...transaction,
          sellerStatus: TRANSACTION_STATUS.WAITING_FOR_RESPONSE_SELLER,
          buyerStatus: TRANSACTION_STATUS.REQUEST_REJECTED,
        };

        const response = await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/transactions/${transaction.id}`,
          payload
        );
        Alert.alert(
          i18n.t("request_declined_title"),
          i18n.t("request_declined_message")
        );
        router.replace(`/transaction-detail?transactionId=${response.data.id}`);
      } catch (error) {
        console.error("Error updating transaction:", error);
        Alert.alert(i18n.t("error"), i18n.t("request_declined_error_message"));
      }
    };
    const updateListing = async () => {
      if (!transactionId) return;
      try {
        const payload = {
          ...listing,
          remainingWeight: listing.remainingWeight - transaction.weight,
        };
        await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/trips/${listing.id}`,
          payload
        );
      } catch (error) {
        console.error("Error updating listing:", error);
      }
    };
    return (
      <>
        <TransactionProgressCard step={0} role={role} />
        <SellerInformationCard item={transaction} />
        <StatusCard status={status} transaction={transaction} />
        <Button
          onPress={handleAcceptRequest}
          text={i18n.t("accept_request")}
          leftIcon={<CheckCircle size={24} color={Colors.white} />}
        />
        <Button
          onPress={handleDeclineRequest}
          text={i18n.t("decline_request")}
          leftIcon={<XCircle size={24} color={Colors.white} />}
          color={Colors.error_color}
        />
      </>
    );
  };

  const AwaitingPaymentContent = () => {
    return (
      <>
        <TransactionProgressCard step={1} role={role} />
        <SellerInformationCard item={transaction} />
        <StatusCard status={status} transaction={transaction} />
        <CancelTransaction />
      </>
    );
  };

  const CompletedContent = ({ role }) => {
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const handleOnSubmit = async ({ rating, comment }) => {
      try {
        const payload = {
          transactionId: transaction.id,
          reviewerId: userInfo.sub,
          reviewerName: userInfo.name,
          revieweeId:
            role === "buyer" ? transaction.sellerId : transaction.buyerId,
          revieweeName:
            role === "buyer"
              ? listing.userInfo.name
              : transaction.buyerInfo.name,
          rating,
          comment,
        };

        await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/reviews`, payload);
        await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/transactions/${transaction.id}`,
          {
            ...transaction,
            sellerReview: role === "seller" ? true : transaction.sellerReview,
            buyerReview: role === "buyer" ? true : transaction.buyerReview,
          }
        );
        router.replace(`/transaction-detail?transactionId=${transaction.id}`);
        Alert.alert(
          i18n.t("review_submitted_title"),
          i18n.t("review_submitted_message")
        );
      } catch (error) {
        console.error("Error submitting review:", error);
        Alert.alert(i18n.t("error"), i18n.t("review_submitted_error_message"));
      }
    };
    console.log(
      "reviews:",
      transaction.buyerReview,
      transaction.sellerReview,
      role
    );
    return (
      <>
        {role === "buyer" ? (
          <TransactionProgressCard step={4} role={role} />
        ) : (
          <TransactionProgressCard step={3} role={role} />
        )}
        <SellerInformationCard item={transaction} />
        <StatusCard status={status} role={role} transaction={transaction} />
        {reviews.map((review) => (
          <View
            style={[
              globalStyles.card,
              { backgroundColor: theme.background_card },
            ]}
            key={review.id}
          >
            <ReviewCard review={review} />
          </View>
        ))}
        {((role === "buyer" && !transaction.buyerReview) ||
          (role === "seller" && !transaction.sellerReview)) && (
          <Button
            text={i18n.t("put_in_review")}
            color={Colors.light_yellow}
            leftIcon={<Star size={24} color={Colors.white} />}
            onPress={() => setReviewModalVisible(true)}
          />
        )}
        <ReviewModal
          visible={reviewModalVisible}
          onClose={() => setReviewModalVisible(false)}
          onSubmit={handleOnSubmit}
        />
      </>
    );
  };

  const ConfirmedContent = ({ role }) => {
    const handleConfirmed = () => {
      if (!transactionId) return;

      Alert.alert(
        i18n.t("confirm_mark_as_completed_title"),
        i18n.t("confirm_mark_as_completed_message"),
        [
          {
            text: i18n.t("cancel"),
            style: "cancel",
          },
          {
            text: i18n.t("confirm"),
            onPress: () => confirmedTransaction(),
          },
        ]
      );
    };
    const confirmedTransaction = async () => {
      if (!transactionId) return;
      try {
        const payload = {
          ...transaction,
          sellerStatus: TRANSACTION_STATUS.COMPLETED,
          buyerStatus: TRANSACTION_STATUS.COMPLETED,
        };

        const response = await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/transactions/${transaction.id}`,
          payload
        );
        Alert.alert(
          i18n.t("confirmed_completed_title"),
          i18n.t("confirmed_completed_message")
        );
        router.replace(`/transaction-detail?transactionId=${response.data.id}`);
      } catch (error) {
        console.error("Error updating transaction:", error);
        Alert.alert(
          i18n.t("error"),
          i18n.t("confirmed_completed_error_message")
        );
      }
    };
    return (
      <>
        {role === "buyer" ? (
          <TransactionProgressCard step={3} role={role} />
        ) : (
          <TransactionProgressCard step={2} role={role} />
        )}
        <SellerInformationCard item={transaction} />
        <StatusCard status={status} role={role} transaction={transaction} />
        <MeetingDetailsCard />
        {role === "buyer" && (
          <Button
            onPress={handleConfirmed}
            text={i18n.t("mark_as_completed")}
            color={Colors.success_color}
          />
        )}
      </>
    );
  };

  const Content = () => {
    switch (status) {
      case TRANSACTION_STATUS.BROWSE_LISTING:
        return <BrowseListingContent />;
      case TRANSACTION_STATUS.WAITING_FOR_RESPONSE_BUYER:
        return <WaitingForResponseContent role="buyer" />;
      case TRANSACTION_STATUS.WAITING_FOR_RESPONSE_SELLER:
        return <WaitingForResponseContent role="seller" />;
      case TRANSACTION_STATUS.REQUEST_REJECTED:
        return <RequestRejectedContent />;
      case TRANSACTION_STATUS.PAYMENT_REQUIRED:
        return <PaymentRequiredContent />;
      case TRANSACTION_STATUS.CANCELLED:
        return <CancelledContent />;
      case TRANSACTION_STATUS.RESERVATION_RECEIVED:
        return <ReservationReceivedContent />;
      case TRANSACTION_STATUS.AWAITING_PAYMENT:
        return <AwaitingPaymentContent />;
      case TRANSACTION_STATUS.COMPLETED:
        return <CompletedContent role={role} />;
      case TRANSACTION_STATUS.CONFIRMED:
        return <ConfirmedContent role={role} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View
        style={[
          globalStyles.header,
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
              {listing?.departureAirport} → {listing?.arrivalAirport}
            </Text>
            <Text style={theme.textStyles.bodyMedium}>
              {formatLocalizedDate(listing?.createdAt, language)}
            </Text>
          </View>
          <StatusBadge status={status} />
        </View>
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Content />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
    marginBottom: 30,
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
