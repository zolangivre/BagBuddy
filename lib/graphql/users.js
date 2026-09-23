import { gql } from "@apollo/client";
import { PROFILE_FIELDS } from "@/lib/graphql/fragments";

/**
 * Profil applicatif de l'appelant (bio, localisation, téléphone, compte de
 * versement). Il est créé à la volée à la première visite, à partir des claims
 * du jeton : l'app le lit en complément du /userinfo de Keycloak, qui ne porte
 * que l'identité.
 */
export const ME = gql`
  query Me {
    me {
      ...ProfileFields
    }
  }
  ${PROFILE_FIELDS}
`;

/**
 * Inscription, sans jeton : crée le compte dans Keycloak. Le profil applicatif
 * apparaît ensuite à la première requête `me`. Codes : email_already_used,
 * password_rejected.
 */
export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input)
  }
`;

/**
 * Mot de passe oublié, sans jeton. Répond true dans tous les cas : la réponse
 * ne dit pas si l'adresse correspond à un compte.
 */
export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
    requestPasswordReset(input: $input)
  }
`;

/** Seuls bio, location et phone sont modifiables : l'identité reste à Keycloak. */
export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ...ProfileFields
    }
  }
  ${PROFILE_FIELDS}
`;

/**
 * Nom et email, portés par Keycloak. `currentPassword` n'est exigé que si
 * l'email change, puisqu'il sert aussi à se connecter. Codes :
 * invalid_current_password, email_already_used.
 */
export const UPDATE_IDENTITY = gql`
  mutation UpdateIdentity($input: UpdateIdentityInput!) {
    updateIdentity(input: $input) {
      ...ProfileFields
    }
  }
  ${PROFILE_FIELDS}
`;

/**
 * Le mot de passe actuel est exigé : une session ouverte ne suffit pas à en
 * changer. Codes : invalid_current_password, password_rejected.
 */
export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

/**
 * Profil public d'un autre membre, à jour — là où l'annonce n'en porte qu'un
 * instantané pris à la publication. Ni email, ni téléphone.
 */
export const PUBLIC_USER = gql`
  query PublicUser($sub: String!) {
    user(sub: $sub) {
      sub
      name
      givenName
      emailVerified
      bio
      location
    }
  }
`;

/** Identifiants des annonces mises de côté. Les annonces elles-mêmes se lisent ensuite via tripsByIds. */
export const FAVORITE_LISTING_IDS = gql`
  query FavoriteListingIds {
    favoriteListingIds
  }
`;

/** Idempotent. Code too_many_favorites au-delà de 200. */
export const ADD_FAVORITE_LISTING = gql`
  mutation AddFavoriteListing($listingId: ID!) {
    addFavoriteListing(listingId: $listingId)
  }
`;

/** Idempotent : retirer une annonce absente n'est pas une erreur. */
export const REMOVE_FAVORITE_LISTING = gql`
  mutation RemoveFavoriteListing($listingId: ID!) {
    removeFavoriteListing(listingId: $listingId)
  }
`;

/**
 * Signale un membre à la modération. L'auteur est toujours l'appelant.
 * Codes : cannot_report_self, too_many_reports (10 par 24 h).
 */
export const REPORT_MEMBER = gql`
  mutation ReportMember($input: ReportMemberInput!) {
    reportMember(input: $input)
  }
`;

/**
 * Envoie un lien de vérification à l'adresse du compte. Rend false si elle est
 * déjà vérifiée. Au plus un email par minute : code
 * verification_email_throttled au-delà.
 */
export const SEND_VERIFICATION_EMAIL = gql`
  mutation SendVerificationEmail($language: String) {
    sendVerificationEmail(language: $language)
  }
`;

/** Motifs de signalement, mêmes valeurs que l'enum ReportReason du schéma. */
export const REPORT_REASONS = [
  "PROHIBITED_ITEMS",
  "NO_SHOW",
  "FRAUD",
  "HARASSMENT",
  "OTHER",
];
