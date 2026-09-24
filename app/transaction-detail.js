import { useContext, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Flag } from "lucide-react-native";
import Colors from "@/theme/Colors";
import StatusBadge from "@/components/StatusBadge";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import { useThemeContext } from "@/contexts/ThemeContext";
import { globalStyles } from "@/theme/Styles";
import { formatLocalizedDate } from "@/components/LocalizedDateTime";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@apollo/client/react";
import { TRIP_BY_ID } from "@/lib/graphql/trips";
import { TRANSACTION_BY_ID } from "@/lib/graphql/transactions";
import { REVIEWS_BY_TRANSACTION } from "@/lib/graphql/reviews";
import { withEndpoint } from "@/lib/apolloClient";
import { AuthContext } from "@/contexts/AuthContext";
import Content from "@/components/TransactionDetailComponents/Content";
import TransactionChat from "@/components/TransactionDetailComponents/TransactionChat";
import ReportMemberModal from "@/components/ReportMemberModal";
import ButtonIcon from "@/components/ButtonIcon";
import i18n from "@/i18n";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorState from "@/components/ErrorState";
import ScreenHeader from "@/components/ScreenHeader";

export default function TransactionDetailScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();
  const { language } = useLanguage();
  const { transactionId, listingId } = useLocalSearchParams();
  const { state } = useContext(AuthContext);
  const userInfo = state.userInfo;

  // L'écran sert deux cas : une annonce qu'on consulte avant de réserver
  // (listingId), ou une réservation existante (transactionId). Chacun lit son
  // service, l'autre requête reste en attente.
  const {
    data: tripData,
    error: tripError,
    loading: tripLoading,
    refetch: refetchTrip,
  } = useQuery(TRIP_BY_ID, {
    context: withEndpoint("trips"),
    variables: { id: listingId },
    skip: !listingId,
  });

  const {
    data: transactionData,
    error: transactionError,
    loading: transactionLoading,
    refetch: refetchTransaction,
  } = useQuery(
    TRANSACTION_BY_ID,
    {
      context: withEndpoint("transactions"),
      variables: { id: transactionId },
      skip: !transactionId,
    }
  );

  const transaction = transactionData?.transaction ?? null;

  // Les avis ne sont lus que si l'un des deux camps en a laissé un : c'est ce
  // que faisait déjà l'appel conditionnel à fetchReviews.
  // `hasReview` vaut déjà faux sans transaction : nul besoin de retester l'id.
  const hasReview = !!(transaction?.buyerReview || transaction?.sellerReview);
  const { data: reviewsData } = useQuery(REVIEWS_BY_TRANSACTION, {
    context: withEndpoint("reviews"),
    variables: { transactionId },
    skip: !hasReview,
  });

  const reviews = reviewsData?.reviewsByTransaction ?? [];
  const trip = tripData?.trip ?? null;

  // Une réservation porte l'instantané de l'annonce ; sans réservation, c'est
  // l'annonce elle-même qui est affichée.
  const listing = transaction?.listingInfo ?? trip;

  const isBuyer = transaction
    ? userInfo?.sub === transaction.buyerId
    : userInfo?.sub !== trip?.userId;
  const role = isBuyer ? "buyer" : "seller";

  const status = !transaction
    ? TRANSACTION_STATUS.BROWSE_LISTING
    : isBuyer
      ? transaction.buyerStatus
      : transaction.sellerStatus;

  // Une relecture après mutation ne doit pas remplacer l'écran par un spinner.
  const isLoading =
    (tripLoading && !tripData) || (transactionLoading && !transactionData);

  const [reportVisible, setReportVisible] = useState(false);
  // On signale l'autre partie, jamais soi-même : le serveur refuserait
  // (cannot_report_self).
  const otherPartySub = !transaction
    ? trip?.userId
    : isBuyer
      ? transaction.sellerId
      : transaction.buyerId;

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (!listing && (tripError || transactionError)) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScreenHeader title="" />
        <ErrorState
          onRetry={() => (transactionId ? refetchTransaction() : refetchTrip())}
        />
      </View>
    );
  }
  const handleGoBack = () => {
    router.back();
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
          <ButtonIcon
            onPress={handleGoBack}
            icon={<ArrowLeft size={20} color={theme.title} />}
            accessibilityLabel={i18n.t("a11y_back")}
            testID="detail-back"
          />

          <View style={styles.headerInfo}>
            <Text style={theme.textStyles.sectionTitle}>
              {listing?.departureAirport} → {listing?.arrivalAirport}
            </Text>
            <Text style={theme.textStyles.bodyMedium}>
              {formatLocalizedDate(listing?.createdAt, language)}
            </Text>
          </View>
          <StatusBadge status={status} />
          {otherPartySub && otherPartySub !== userInfo?.sub ? (
            <ButtonIcon
              onPress={() => setReportVisible(true)}
              icon={<Flag size={18} color={Colors.error_color} />}
              color="transparent"
              accessibilityLabel={i18n.t("report_member")}
            />
          ) : null}
        </View>
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Content
            role={role}
            status={status}
            transaction={transaction}
            listing={listing}
            reviews={reviews}
            userInfo={userInfo}
          />
          {/* Une réservation existe : ses deux participants peuvent se parler,
              quel que soit l'état. Une annonce simplement consultée, non. */}
          {transaction ? <TransactionChat transaction={transaction} /> : null}
        </View>
      </ScrollView>

      <ReportMemberModal
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        reportedSub={otherPartySub}
        transactionId={transaction?.id}
      />
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
});
