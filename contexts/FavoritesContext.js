import React, { createContext, useContext, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  FAVORITE_LISTING_IDS,
  ADD_FAVORITE_LISTING,
  REMOVE_FAVORITE_LISTING,
} from "@/lib/graphql/users";
import { withEndpoint } from "@/lib/apolloClient";
import { AuthContext } from "@/contexts/AuthContext";

const FavoritesContext = createContext({
  favoriteIds: [],
  isFavorite: () => false,
  toggleFavorite: async () => {},
  refreshFavorites: () => {},
  loading: false,
});

/**
 * Le serveur ne garde que des identifiants d'annonces : une seule requête suffit
 * donc à savoir, pour toutes les cartes affichées, lesquelles sont mises de
 * côté. Les annonces elles-mêmes ne sont relues qu'à l'ouverture de l'écran des
 * favoris (tripsByIds).
 */
export const FavoritesProvider = ({ children }) => {
  const { state } = useContext(AuthContext);
  const signedIn = state.isSignedIn;

  const { data, loading, refetch } = useQuery(FAVORITE_LISTING_IDS, {
    context: withEndpoint("users"),
    skip: !signedIn,
  });

  const [addFavorite] = useMutation(ADD_FAVORITE_LISTING, {
    context: withEndpoint("users"),
  });
  const [removeFavorite] = useMutation(REMOVE_FAVORITE_LISTING, {
    context: withEndpoint("users"),
  });

  const favoriteIds = useMemo(
    () => (data?.favoriteListingIds ?? []).map(String),
    [data]
  );

  // Un ensemble plutôt qu'un parcours : `isFavorite` est appelé une fois par
  // carte, sur des pages de 50, à chaque rendu de la liste.
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const isFavorite = useCallback(
    (listingId) => favoriteSet.has(String(listingId)),
    [favoriteSet]
  );

  /**
   * Les deux mutations sont idempotentes côté serveur, ce qui rend un double
   * appui sans conséquence. On relit ensuite la liste plutôt que de la deviner :
   * elle est plafonnée à 200 entrées et le serveur peut refuser l'ajout.
   */
  const toggleFavorite = useCallback(
    async (listingId) => {
      const id = String(listingId);
      const wasFavorite = favoriteSet.has(id);
      try {
        if (wasFavorite) {
          await removeFavorite({ variables: { listingId: id } });
        } else {
          await addFavorite({ variables: { listingId: id } });
        }
        await refetch();
      } catch (error) {
        console.error("Error updating favorite:", error);
        throw error;
      }
    },
    [favoriteSet, addFavorite, removeFavorite, refetch]
  );

  const value = useMemo(
    () => ({
      favoriteIds,
      isFavorite,
      toggleFavorite,
      refreshFavorites: refetch,
      loading,
    }),
    [favoriteIds, isFavorite, toggleFavorite, refetch, loading]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);

export { FavoritesContext };
