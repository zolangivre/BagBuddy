import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useThemeContext } from "@/contexts/ThemeContext";
import Colors from "@/theme/Colors";
import { globalStyles } from "@/theme/Styles";
import ButtonIcon from "@/components/ButtonIcon";
import { ArrowLeft } from "lucide-react-native";
import { useQuery } from "@apollo/client/react";
import { TRIPS_BY_IDS } from "@/lib/graphql/trips";
import { withEndpoint } from "@/lib/apolloClient";
import { useRouter } from "expo-router";
import i18n from "@/i18n";
import HomeCard from "@/components/HomeCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { SafeActivityIndicator } from "@/components/SafeActivityIndicator";

export default function FavoritesScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();
  const {
    favoriteIds,
    loading: favoritesLoading,
    refreshFavorites,
  } = useFavorites();

  // Le serveur ne stocke que des identifiants : les annonces se relisent dans
  // tripservice, qui les rend dans l'ordre demandé et ignore celles qui ont été
  // supprimées depuis.
  const { data, loading: tripsLoading } = useQuery(TRIPS_BY_IDS, {
    context: withEndpoint("trips"),
    variables: { ids: favoriteIds },
    skip: favoriteIds.length === 0,
    onError: (error) => console.error("Error fetching favorites:", error),
  });

  const listings = favoriteIds.length === 0 ? [] : data?.tripsByIds ?? [];
  const isLoading =
    favoritesLoading || (favoriteIds.length > 0 && tripsLoading && !data);

  useFocusEffect(
    useCallback(() => {
      refreshFavorites();
    }, [refreshFavorites])
  );

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
              {i18n.t("favorites")}
            </Text>
          </View>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <SafeActivityIndicator />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {listings.length === 0 ? (
              <View style={[styles.centered, { minHeight: 100, padding: 20 }]}>
                <Text
                  style={[
                    theme.textStyles.bodyLarge,
                    { fontStyle: "italic", textAlign: "center" },
                  ]}
                >
                  {i18n.t("no_favorites")}
                </Text>
              </View>
            ) : (
              listings.map((listing) => (
                <HomeCard key={listing.id} item={listing} />
              ))
            )}
          </View>
        </ScrollView>
      )}
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
  titleContainer: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
    gap: 15,
    marginBottom: 30,
  },
});
