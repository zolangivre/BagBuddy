import { useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useThemeContext } from "@/contexts/ThemeContext";
import Colors from "@/theme/Colors";
import { globalStyles } from "@/theme/Styles";
import ButtonIcon from "@/components/ButtonIcon";
import { ArrowLeft, PlusCircle } from "lucide-react-native";
import { useQuery } from "@apollo/client/react";
import { TRIPS_BY_USER } from "@/lib/graphql/trips";
import { withEndpoint } from "@/lib/apolloClient";
import { useRouter } from "expo-router";
import i18n from "@/i18n";
import ListingCard from "@/components/ListingCard";
import { AuthContext } from "@/contexts/AuthContext";
import { SafeActivityIndicator } from "@/components/SafeActivityIndicator";

export default function AllListingsScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();
  const { state } = useContext(AuthContext);
  const userInfo = state.userInfo;
  const handleNewListing = () => {
    router.push("edit-listing");
  };

  const { data, loading, refetch } = useQuery(TRIPS_BY_USER, {
    context: withEndpoint("trips"),
    variables: { userId: userInfo?.sub },
    skip: !userInfo?.sub,
    onError: (error) => console.error("Error fetching listings:", error),
  });

  const listings = data?.tripsByUser ?? [];
  // La requête est mise en attente tant que le profil Keycloak n'est pas lu :
  // sans ce garde l'écran afficherait « aucune annonce » pendant ce temps.
  const isLoading = loading || !userInfo?.sub;

  useFocusEffect(
    useCallback(() => {
      if (userInfo?.sub) refetch();
    }, [refetch, userInfo?.sub])
  );

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
          <View style={styles.titleContainer}>
            <Text style={theme.textStyles.sectionTitle}>
              {i18n.t("all_listings")}
            </Text>
          </View>
        </View>
        <ButtonIcon
          onPress={handleNewListing}
          icon={<PlusCircle size={24} color={Colors.primary_color} />}
        />
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {listings.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
                minHeight: 100,
              }}
            >
              <Text
                style={[
                  theme.textStyles.bodyLarge,
                  { fontStyle: "italic", textAlign: "center" },
                ]}
              >
                {i18n.t("no_active_listings")}
              </Text>
            </View>
          ) : (
            listings.map((listing) => (
              <ListingCard key={listing.id} item={listing} />
            ))
          )}
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
