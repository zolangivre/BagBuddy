import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useThemeContext } from "@/contexts/ThemeContext";
import Colors from "@/theme/Colors";
import { globalStyles } from "@/theme/Styles";
import ScreenHeader from "@/components/ScreenHeader";
import { useQuery } from "@apollo/client/react";
import { TRIPS_BY_IDS } from "@/lib/graphql/trips";
import { withEndpoint } from "@/lib/apolloClient";
import i18n from "@/i18n";
import HomeCard from "@/components/HomeCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { SafeActivityIndicator } from "@/components/SafeActivityIndicator";
import ErrorState from "@/components/ErrorState";

export default function FavoritesScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const {
    favoriteIds,
    loading: favoritesLoading,
    refreshFavorites,
  } = useFavorites();

  // Le serveur ne stocke que des identifiants : les annonces se relisent dans
  // tripservice, qui les rend dans l'ordre demandé et ignore celles qui ont été
  // supprimées depuis.
  const { data, error, loading: tripsLoading, refetch } = useQuery(TRIPS_BY_IDS, {
    context: withEndpoint("trips"),
    variables: { ids: favoriteIds },
    skip: favoriteIds.length === 0,
  });

  const listings = favoriteIds.length === 0 ? [] : (data?.tripsByIds ?? []);
  // Sans favori la requête est en attente, et une requête en attente ne se
  // déclare jamais chargeante : le test sur la longueur serait redondant.
  const isLoading = favoritesLoading || (tripsLoading && !data);

  useFocusEffect(
    useCallback(() => {
      refreshFavorites();
    }, [refreshFavorites])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title={i18n.t("favorites")} />

      {isLoading ? (
        <View style={globalStyles.centered}>
          <SafeActivityIndicator />
        </View>
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.content}
          data={listings}
          keyExtractor={(listing) => listing.id}
          renderItem={({ item }) => <HomeCard item={item} />}
          ListEmptyComponent={
            error && !data ? (
              <ErrorState onRetry={refetch} />
            ) : (
              <View style={[globalStyles.centered, { minHeight: 100, padding: 20 }]}>
                <Text
                  style={[
                    theme.textStyles.bodyLarge,
                    { fontStyle: "italic", textAlign: "center" },
                  ]}
                >
                  {i18n.t("no_favorites")}
                </Text>
              </View>
            )
          }
          showsVerticalScrollIndicator={false}
        />
      )}
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
});
