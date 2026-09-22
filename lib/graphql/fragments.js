import { gql } from "@apollo/client";

/**
 * Sélections partagées par les écrans. Elles reprennent champ pour champ ce que
 * les anciennes réponses REST contenaient : en GraphQL un champ non demandé est
 * absent, et c'est la cause la plus probable d'un `undefined` après migration.
 */

/**
 * Instantané du voyageur porté par une annonce. username, email et phone ne sont
 * renseignés que pour le propriétaire de l'annonce — pour les autres membres le
 * serveur renvoie null, ce n'est pas une erreur.
 */
export const USER_INFO_FIELDS = gql`
  fragment UserInfoFields on UserInfoView {
    sub
    name
    givenName
    familyName
    username
    emailVerified
    bio
    location
    email
    phone
  }
`;

export const TRIP_FIELDS = gql`
  fragment TripFields on Trip {
    id
    userId
    departureAirport
    arrivalAirport
    departureDate
    arrivalDate
    totalWeightAvailable
    remainingWeight
    pricePerKg
    conditions
    active
    createdAt
    stripeAccountId
    userInfo {
      ...UserInfoFields
    }
  }
  ${USER_INFO_FIELDS}
`;

/** Partie à une transaction. Visible des seuls participants. */
export const PARTY_FIELDS = gql`
  fragment PartyFields on Party {
    sub
    name
    givenName
    familyName
    username
    emailVerified
    bio
    location
    email
    phone
  }
`;

/**
 * Ce que la liste des transactions affiche et filtre, et rien de plus. La
 * sélection complète porte une trentaine de champs par ligne — coordonnées des
 * deux parties, règlement, versements, code de remise — dont aucun n'est lu
 * avant l'ouverture du détail.
 */
export const TRANSACTION_CARD_FIELDS = gql`
  fragment TransactionCardFields on Transaction {
    id
    buyerId
    sellerId
    sellerStatus
    buyerStatus
    weight
    total
    createdAt
    buyerInfo {
      name
    }
    listingInfo {
      departureAirport
      arrivalAirport
      departureDate
      arrivalDate
      pricePerKg
      sellerUserInfo {
        name
      }
    }
  }
`;

export const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on Transaction {
    id
    listingId
    buyerId
    sellerId
    sellerStatus
    buyerStatus
    weight
    total
    sellerReview
    buyerReview
    stripePaymentIntentId
    stripeCurrency
    stripeAmount
    paidAt
    createdAt
    contentDescription
    prohibitedItemsAccepted
    handoverCode
    handoverLocked
    platformFee
    refundAmount
    refundStatus
    refundedAt
    payoutAmount
    payoutStatus
    paidOutAt
    buyerInfo {
      ...PartyFields
    }
    listingInfo {
      departureAirport
      arrivalAirport
      departureDate
      arrivalDate
      totalWeightAvailable
      remainingWeight
      pricePerKg
      conditions
      createdAt
      sellerUserInfo {
        ...PartyFields
      }
    }
  }
  ${PARTY_FIELDS}
`;

export const REVIEW_FIELDS = gql`
  fragment ReviewFields on Review {
    id
    transactionId
    reviewerId
    reviewerName
    revieweeId
    revieweeName
    rating
    comment
    createdAt
  }
`;

/** Profil complet : n'est jamais renvoyé qu'à son propriétaire. */
export const PROFILE_FIELDS = gql`
  fragment ProfileFields on UserProfile {
    sub
    email
    emailVerified
    username
    name
    givenName
    familyName
    bio
    location
    phone
    stripeAccountId
  }
`;
