import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import Colors from "@/theme/Colors";
import StatusBadge from "@/components/StatusBadge";
import { TRANSACTION_STATUS } from "@/constants/transaction-status";
import { useThemeContext } from "@/contexts/ThemeContext";
import { globalStyles } from "@/theme/Styles";
import { formatLocalizedDate } from "@/components/LocalizedDateTime";
import { useLanguage } from "@/contexts/LanguageContext";
import axios from "axios";
import { AuthContext } from "@/contexts/AuthContext";
import Content from "@/components/TransactionDetailComponents/Content";
import ButtonIcon from "@/components/ButtonIcon";

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
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const reviewRes = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/reviews/transaction/${transactionId}`
      );
      setReviews(reviewRes.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [listingId, transactionId]);

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
        <ActivityIndicator size="medium" color={theme.primary} />
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
