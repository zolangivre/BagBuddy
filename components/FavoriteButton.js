import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { Heart } from "lucide-react-native";
import Colors from "@/theme/Colors";
import { useFavorites } from "@/contexts/FavoritesContext";
import { graphqlErrorMessage } from "@/lib/graphqlError";
import i18n from "@/i18n";

/**
 * Met une annonce de côté. Le serveur plafonne les favoris à 200 et répond
 * alors `too_many_favorites` : l'appui n'est donc pas supposé réussir, et le
 * cœur ne bascule qu'une fois la liste relue.
 */
export default function FavoriteButton({ listingId, size = 24 }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [pending, setPending] = useState(false);
  const active = isFavorite(listingId);

  const handlePress = async () => {
    if (pending) return;
    setPending(true);
    try {
      await toggleFavorite(listingId);
    } catch (error) {
      Alert.alert(
        i18n.t("error"),
        graphqlErrorMessage(error, ["too_many_favorites"], "favorite_error")
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={pending}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled: pending }}
      accessibilityLabel={
        active ? i18n.t("remove_from_favorites") : i18n.t("add_to_favorites")
      }
      style={{ opacity: pending ? 0.5 : 1 }}
    >
      <Heart
        size={size}
        color={active ? Colors.error_color : Colors.tertiary_color}
        fill={active ? Colors.error_color : "transparent"}
      />
    </TouchableOpacity>
  );
}
