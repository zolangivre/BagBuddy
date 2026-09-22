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

/**
 * Profil public d'un autre membre. `PublicUserProfile` ne porte ni email, ni
 * téléphone, ni compte Stripe : les demander est une ValidationError, pas un
 * champ nul.
 */
export const PUBLIC_PROFILE = gql`
  query PublicProfile($sub: String!) {
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
