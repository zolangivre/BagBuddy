import { router } from "expo-router";

/** Même règle que le realm Keycloak (passwordPolicy length(8)) et que RegisterInput. */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const NAME_MAX_LENGTH = 60;

// Volontairement permissive : c'est Keycloak qui tranche, on n'attrape ici que
// les fautes de frappe évidentes avant un aller-retour réseau.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(value.trim());
}

/**
 * Entre dans l'app une fois la session ouverte : on vide la pile des écrans de
 * connexion pour qu'un retour arrière ne ramène pas au formulaire.
 */
export function enterApp() {
  if (router.canDismiss()) router.dismissAll();
  router.replace("/(tabs)/home");
}
