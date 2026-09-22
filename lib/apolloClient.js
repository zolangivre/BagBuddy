import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { SetContextLink } from "@apollo/client/link/context";
import { getAccessToken } from "@/lib/authToken";

/**
 * Le backend n'expose pas un schéma fédéré mais un schéma par service, chacun
 * servi sous son propre préfixe par la gateway : /trips/graphql,
 * /transactions/graphql, /reviews/graphql, /users/graphql, /stripe/graphql.
 *
 * Chaque opération déclare donc sa destination dans son contexte :
 *
 *   useQuery(ACTIVE_TRIPS, { context: { endpoint: "trips" } })
 *
 * `withEndpoint()` construit cet objet, pour que le nom du service reste une
 * valeur vérifiable et non une chaîne recopiée à la main dans chaque écran.
 */
export const ENDPOINTS = ["trips", "transactions", "reviews", "users", "stripe"];

// Un objet figé par endpoint : les écrans appellent withEndpoint() à chaque
// rendu, et une nouvelle référence à chaque fois ferait travailler les hooks
// Apollo pour rien.
const CONTEXTS = Object.freeze(
  Object.fromEntries(
    ENDPOINTS.map((endpoint) => [endpoint, Object.freeze({ endpoint })])
  )
);

export function withEndpoint(endpoint) {
  const context = CONTEXTS[endpoint];
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
 * le schéma users (register, mot de passe oublié) que l'app mobile n'utilise pas
 * — l'inscription passe par la page hébergée Keycloak.
 */
const authLink = new SetContextLink(async (prevContext) => {
  const token = await getAccessToken();
  if (!token) return prevContext;
  return {
    ...prevContext,
    headers: { ...prevContext.headers, Authorization: `Bearer ${token}` },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      // Ces types n'ont pas d'id : sans cette précision, Apollo les
      // normaliserait par référence et deux instantanés distincts se
      // mélangeraient dans le cache.
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
