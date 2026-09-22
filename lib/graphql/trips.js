import { gql } from "@apollo/client";
import { TRIP_FIELDS } from "@/lib/graphql/fragments";

/** Remplace GET /trips/active. */
export const ACTIVE_TRIPS = gql`
  query ActiveTrips($limit: Int, $offset: Int) {
    activeTrips(limit: $limit, offset: $offset) {
      ...TripFields
    }
  }
  ${TRIP_FIELDS}
`;

/** Remplace GET /trips/user/{sub}. */
export const TRIPS_BY_USER = gql`
  query TripsByUser($userId: String!, $limit: Int, $offset: Int) {
    tripsByUser(userId: $userId, limit: $limit, offset: $offset) {
      ...TripFields
    }
  }
  ${TRIP_FIELDS}
`;

/** Remplace GET /trips/{id}. */
export const TRIP_BY_ID = gql`
  query Trip($id: ID!) {
    trip(id: $id) {
      ...TripFields
    }
  }
  ${TRIP_FIELDS}
`;

/**
 * Remplace POST /trips. L'identité du voyageur vient du jeton : `TripInput`
 * n'accepte ni userId ni userInfo, seulement les champs libres du profil sous
 * `profile`. Envoyer autre chose est refusé par le schéma.
 */
export const CREATE_TRIP = gql`
  mutation CreateTrip($input: TripInput!) {
    createTrip(input: $input) {
      ...TripFields
    }
  }
  ${TRIP_FIELDS}
`;

/**
 * Remplace PUT /trips/{id}. `remainingWeight` n'est pas modifiable : le serveur
 * la fait suivre la variation du total, bornée entre 0 et le nouveau total.
 */
export const UPDATE_TRIP = gql`
  mutation UpdateTrip($id: ID!, $input: TripInput!) {
    updateTrip(id: $id, input: $input) {
      ...TripFields
    }
  }
  ${TRIP_FIELDS}
`;

/** Remplace DELETE /trips/{id} ; rend un booléen là où DELETE ne rendait rien. */
export const DELETE_TRIP = gql`
  mutation DeleteTrip($id: ID!) {
    deleteTrip(id: $id)
  }
`;

/**
 * Construit un `TripInput` à partir de l'objet manipulé par les écrans.
 * Le filtrage est explicite : le schéma rejette tout champ qu'il ne connaît pas,
 * et les écrans travaillent sur des annonces complètes (id, userId, active...).
 */
export function toTripInput(listing) {
  const profile = listing.userInfo;
  return {
    departureAirport: listing.departureAirport,
    arrivalAirport: listing.arrivalAirport,
    departureDate: listing.departureDate,
    arrivalDate: listing.arrivalDate,
    totalWeightAvailable: listing.totalWeightAvailable,
    pricePerKg: listing.pricePerKg,
    conditions: listing.conditions,
    stripeAccountId: listing.stripeAccountId,
    profile: profile
      ? { bio: profile.bio, location: profile.location, phone: profile.phone }
      : null,
  };
}
