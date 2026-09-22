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

/** Seuls bio, location et phone sont modifiables : l'identité reste à Keycloak. */
export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ...ProfileFields
    }
  }
  ${PROFILE_FIELDS}
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
