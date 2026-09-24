import { router } from "expo-router";

/** Même règle que le realm Keycloak (passwordPolicy length(8)) et que RegisterInput. */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const NAME_MAX_LENGTH = 60;

/** Bornes d'UpdateProfileInput côté userservice. */
export const BIO_MAX_LENGTH = 2000;
export const LOCATION_MAX_LENGTH = 120;
const PHONE_PATTERN = /^[+0-9 ().-]{6,32}$/;

/** Même règle que le serveur : vide, ou 6 à 32 chiffres, espaces et + ( ) . - */
export function isValidPhone(value: string): boolean {
  const phone = value.trim();
  return phone === "" || PHONE_PATTERN.test(phone);
}

/** Deux initiales tirées du prénom et du nom, ou du nom complet à défaut. */
export function initialsOf({
  givenName,
  familyName,
  name,
}: { givenName?: string | null; familyName?: string | null; name?: string | null } = {}): string {
  const first = givenName?.trim()?.[0];
  const last = familyName?.trim()?.[0];
  if (first || last) return `${first ?? ""}${last ?? ""}`.toUpperCase();
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

// Volontairement permissive : c'est Keycloak qui tranche, on n'attrape ici que
// les fautes de frappe évidentes avant un aller-retour réseau.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
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
