import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { getAccessToken } from "@/lib/authToken";

/**
 * Le backend n'expose pas un schéma fédéré mais un schéma par service, chacun
 * servi sous son propre préfixe par la gateway : /trips/graphql,
 * /transactions/graphql, /reviews/graphql, /users/graphql, /stripe/graphql.
 *
 * Chaque opération déclare donc sa destination dans son contexte :
 *
 *   useQuery(SEARCH_TRIPS, { context: { endpoint: "trips" } })
 *
 * `withEndpoint()` construit cet objet, pour que le nom du service reste une
 * valeur vérifiable et non une chaîne recopiée à la main dans chaque écran.
 */
const ENDPOINTS = ["trips", "transactions", "reviews", "users", "stripe"] as const;

export type Endpoint = (typeof ENDPOINTS)[number];

// Un objet figé par endpoint : les écrans appellent withEndpoint() à chaque
// rendu, et une nouvelle référence à chaque fois ferait travailler les hooks
// Apollo pour rien.
const CONTEXTS = Object.freeze(
  Object.fromEntries(
    ENDPOINTS.map((endpoint) => [endpoint, Object.freeze({ endpoint })])
  )
);

export function withEndpoint(endpoint: Endpoint): { endpoint: Endpoint } {
  const context = (CONTEXTS as Record<string, { endpoint: Endpoint }>)[endpoint];
  if (!context) {
    throw new Error(`Endpoint GraphQL inconnu : ${endpoint}`);
  }
  return context;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const httpLink = new HttpLink({
  uri: (operation) => {
    const { endpoint } = operation.getContext();
    if (!endpoint) {
      // Sans destination, la requête partirait sur une URL invalide et
      // échouerait au réseau, loin de sa cause : mieux vaut le dire ici.
      throw new Error(
        `L'opération ${operation.operationName} n'a pas d'endpoint : ` +
          `ajoutez context: withEndpoint("trips") à l'appel.`
      );
    }
    return `${API_URL}/${endpoint}/graphql`;
  },
});

/**
 * Toutes les opérations exigent un jeton Keycloak, à deux exceptions près dans
 * le schéma users (register, mot de passe oublié) : hors session le lien
 * n'ajoute simplement pas d'en-tête, et ces deux-là passent sans.
 */
const authLink = new SetContextLink(async (prevContext) => {
  const token = await getAccessToken();
  if (!token) return prevContext;
  return {
    ...prevContext,
    headers: { ...prevContext.headers, Authorization: `Bearer ${token}` },
  };
});

/**
 * Un seul endroit où tracer les échecs. Apollo 4 n'accepte plus `onError` sur
 * `useQuery` : c'est aux écrans d'afficher `error`, et ici qu'on le journalise.
 */
const errorLink = new ErrorLink(({ error, operation }) => {
  if (__DEV__) {
    console.warn(`[GraphQL] ${operation.operationName} a échoué :`, error);
  }
});

const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      // Ces types n'ont pas d'id : sans cette précision, Apollo les
      // normaliserait par référence et deux instantanés distincts se
      // mélangeraient dans le cache.
      // Pas d'`id` mais un `sub` : sans cette clé, la réponse d'updateProfile
      // ne rafraîchirait pas le `me` déjà en cache.
      UserProfile: { keyFields: ["sub"] },
      UserInfoView: { keyFields: false },
      Party: { keyFields: false },
      ListingInfo: { keyFields: false },
    },
  }),
  defaultOptions: {
    // Les écrans relisent leurs données après chaque mutation ; servir le cache
    // puis rafraîchir évite un écran vide au retour sur un onglet déjà visité.
    watchQuery: { fetchPolicy: "cache-and-network" },
  },
});

export default client;
