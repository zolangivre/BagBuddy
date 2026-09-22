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

/**
 * Annonces par identifiant, dans l'ordre demandé ; une annonce supprimée est
 * simplement absente de la réponse. 200 identifiants au plus. C'est ainsi que
 * les favoris, qui ne sont que des identifiants, deviennent des annonces.
 */
export const TRIPS_BY_IDS = gql`
  query TripsByIds($ids: [ID!]!) {
    tripsByIds(ids: $ids) {
      ...TripFields
    }
  }
  ${TRIP_FIELDS}
`;

/**
 * Recherche filtrée, triée et paginée par le serveur, avec le nombre total de
 * résultats et les agrégats portant sur le filtre entier — et non sur la seule
 * page rendue.
 *
 * Deux alias dans le même document : `overview` (sans filtre) donne les chiffres
 * du bandeau d'accueil, `results` la page courante du filtre. Un seul appel là
 * où le filtrage côté client imposait de tout télécharger pour compter.
 */
export const SEARCH_TRIPS = gql`
  query SearchTrips($filter: TripSearchInput, $limit: Int, $offset: Int) {
    overview: searchTrips(limit: 1) {
      totalCount
      totalRemainingWeight
      averagePricePerKg
    }
    results: searchTrips(filter: $filter, limit: $limit, offset: $offset) {
      totalCount
      totalRemainingWeight
      averagePricePerKg
      items {
        ...TripFields
      }
    }
  }
  ${TRIP_FIELDS}
`;

/** Taille de page de l'accueil. Le serveur plafonne à 200 par appel. */
export const TRIP_PAGE_SIZE = 50;

const TRIP_ALERT_FIELDS = gql`
  fragment TripAlertFields on TripAlert {
    id
    departureAirport
    arrivalAirport
    date
    flexDays
    maxPricePerKg
    minWeight
    createdAt
  }
`;

/** Alertes de l'appelant, les plus récentes d'abord. */
export const MY_TRIP_ALERTS = gql`
  query MyTripAlerts {
    myTripAlerts {
      ...TripAlertFields
    }
  }
  ${TRIP_ALERT_FIELDS}
`;

/**
 * Crée une alerte : un email à chaque annonce publiée qui correspond. L'adresse
 * est celle du jeton. Codes : alert_needs_email, alert_invalid_route,
 * alert_invalid_date, alert_invalid_flex, too_many_alerts (10 par membre).
 */
export const CREATE_TRIP_ALERT = gql`
  mutation CreateTripAlert($input: TripAlertInput!) {
    createTripAlert(input: $input) {
      ...TripAlertFields
    }
  }
  ${TRIP_ALERT_FIELDS}
`;

/** Vrai si l'alerte existait et appartenait à l'appelant. */
export const DELETE_TRIP_ALERT = gql`
  mutation DeleteTripAlert($id: ID!) {
    deleteTripAlert(id: $id)
  }
`;

/** Les tris acceptés par searchTrips, dans le vocabulaire des filtres du front. */
export const TRIP_SORTS = {
  recent: "RECENT",
  earliest_departure: "EARLIEST_DEPARTURE",
  price_low: "PRICE_LOW",
  price_high: "PRICE_HIGH",
  weight_high: "WEIGHT_HIGH",
  weight_low: "WEIGHT_LOW",
};

/**
 * Traduit les filtres de l'accueil en `TripSearchInput`. Un champ absent ne
 * filtre pas, ici comme côté serveur ; sans tri choisi, le serveur rend les
 * plus récentes d'abord, comme le faisait activeTrips.
 */
export function toTripSearchInput(filters) {
  if (!filters) return {};
  return {
    departureAirport: filters.from,
    arrivalAirport: filters.to,
    date: filters.date,
    flexDays: filters.date ? filters.flexDays : undefined,
    minPricePerKg: filters.minPrice,
    maxPricePerKg: filters.maxPrice,
    minWeight: filters.minWeight,
    maxWeight: filters.maxWeight,
    sort: filters.sort ? TRIP_SORTS[filters.sort] : undefined,
  };
}
