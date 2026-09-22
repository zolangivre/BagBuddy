import { useContext } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
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
import ButtonIcon from "@/components/ButtonIcon";
import { SafeActivityIndicator } from "@/components/SafeActivityIndicator";

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
  const { data: tripData, loading: tripLoading } = useQuery(TRIP_BY_ID, {
    context: withEndpoint("trips"),
    variables: { id: listingId },
    skip: !listingId,
    onError: (error) => console.error("Error fetching listing:", error),
  });

  const { data: transactionData, loading: transactionLoading } = useQuery(
    TRANSACTION_BY_ID,
    {
      context: withEndpoint("transactions"),
      variables: { id: transactionId },
      skip: !transactionId,
      onError: (error) => console.error("Error fetching transaction:", error),
    }
  );

  const transaction = transactionData?.transaction ?? null;

  // Les avis ne sont lus que si l'un des deux camps en a laissé un : c'est ce
  // que faisait déjà l'appel conditionnel à fetchReviews.
  const hasReview = !!(transaction?.buyerReview || transaction?.sellerReview);
  const { data: reviewsData } = useQuery(REVIEWS_BY_TRANSACTION, {
    context: withEndpoint("reviews"),
    variables: { transactionId },
    skip: !transactionId || !hasReview,
    onError: (error) => console.error("Error fetching reviews:", error),
  });

  const reviews = reviewsData?.reviewsByTransaction ?? [];

  // Une réservation porte l'instantané de l'annonce ; sans réservation, c'est
  // l'annonce elle-même qui est affichée.
  const listing = transaction ? transaction.listingInfo : tripData?.trip ?? null;

  const isBuyer = transaction
    ? userInfo?.sub === transaction.buyerId
    : userInfo?.sub !== tripData?.trip?.userId;
  const role = isBuyer ? "buyer" : "seller";

  const status = transaction
    ? isBuyer
      ? transaction.buyerStatus
      : transaction.sellerStatus
    : TRANSACTION_STATUS.BROWSE_LISTING;

  const isLoading = tripLoading || transactionLoading;

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <SafeActivityIndicator />
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
});
