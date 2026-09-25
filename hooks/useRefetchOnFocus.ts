import { useCallback, useRef } from "react";
import { useFocusEffect } from "expo-router";
import { quietly } from "@/utils/quietly";

/**
 * Relit une requête quand l'écran reprend le focus (retour depuis un écran
 * poussé par-dessus, où une mutation a pu changer les données).
 *
 * Le premier focus est ignoré : la requête vient d'être lancée par son propre
 * montage, et la relancer aussitôt doublerait chaque ouverture d'écran.
 */
export default function useRefetchOnFocus(
  refetch: () => unknown,
  enabled = true
): void {
  const firstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }
      if (enabled) quietly(refetch);
    }, [refetch, enabled])
  );
}
