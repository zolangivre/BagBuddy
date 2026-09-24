import { useContext } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { useThemeContext } from "@/contexts/ThemeContext";
import Colors from "@/theme/Colors";
import ButtonIcon from "@/components/ButtonIcon";
import ScreenHeader from "@/components/ScreenHeader";
import { PlusCircle } from "lucide-react-native";
import { useQuery } from "@apollo/client/react";
import { TRIPS_BY_USER } from "@/lib/graphql/trips";
import { withEndpoint } from "@/lib/apolloClient";
import { useRouter } from "expo-router";
import i18n from "@/i18n";
import ListingCard from "@/components/ListingCard";
import { AuthContext } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorState from "@/components/ErrorState";
import useRefetchOnFocus from "@/hooks/useRefetchOnFocus";

export default function AllListingsScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();
  const { state } = useContext(AuthContext);
  const userInfo = state.userInfo;
  const handleNewListing = () => {
    router.push("edit-listing");
  };

  const { data, error, loading, networkStatus, refetch } = useQuery(TRIPS_BY_USER, {
    context: withEndpoint("trips"),
    variables: { userId: userInfo?.sub },
    skip: !userInfo?.sub,
  });

  const listings = data?.tripsByUser ?? [];
  // La requête est mise en attente tant que le profil Keycloak n'est pas lu :
  // sans ce garde l'écran afficherait « aucune annonce » pendant ce temps.
  // Un refetch garde les annonces déjà affichées au lieu du spinner plein écran.
  const isLoading = (loading && !data) || !userInfo?.sub;

  useRefetchOnFocus(refetch, Boolean(userInfo?.sub));

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <ScreenHeader
        title={i18n.t("all_listings")}
        right={
          <ButtonIcon
            onPress={handleNewListing}
            icon={<PlusCircle size={24} color={Colors.primary_color} />}
            accessibilityLabel={i18n.t("new_listing")}
          />
        }
      />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.content}
        data={listings}
        keyExtractor={(listing) => listing.id}
        renderItem={({ item }) => <ListingCard item={item} />}
        ListEmptyComponent={
          error && !data ? (
            <ErrorState onRetry={refetch} />
          ) : (
            <View style={styles.empty}>
              <Text
                style={[
                  theme.textStyles.bodyLarge,
                  { fontStyle: "italic", textAlign: "center" },
                ]}
              >
                {i18n.t("no_active_listings")}
              </Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={networkStatus === 4}
            onRefresh={refetch}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 15,
    paddingBottom: 46,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 100,
  },
});
