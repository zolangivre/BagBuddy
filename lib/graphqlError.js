import { CombinedGraphQLErrors } from "@apollo/client/errors";
import i18n from "@/i18n";

/**
 * Le code métier stable porté par une erreur GraphQL (`too_many_favorites`,
 * `handover_locked`…), ou undefined si l'échec n'en porte pas — coupure réseau,
 * requête malformée, panne serveur.
 *
 * Apollo v4 ne rend plus `error.graphQLErrors` : les erreurs renvoyées par le
 * serveur arrivent sous forme de `CombinedGraphQLErrors`, dont le tableau
 * s'appelle `errors`. C'est la seule fonction du front qui connaisse cette
 * forme, pour n'avoir qu'un endroit à corriger à la prochaine version.
 */
export function graphqlErrorCode(error) {
  if (!CombinedGraphQLErrors.is(error)) return undefined;
  return error.errors[0]?.extensions?.code;
}

/**
 * Message à montrer pour une erreur GraphQL.
 *
 * Les clés de traduction reprennent volontairement les codes du serveur : dans
 * le cas courant, `handled` liste simplement les codes que l'opération peut
 * lever et chacun se traduit sous son propre nom. Passer un objet permet de
 * nommer autrement (le fil de discussion préfixe les siens par `chat_`).
 * Tout autre échec retombe sur `fallbackKey`.
 */
export function graphqlErrorMessage(error, handled, fallbackKey) {
  const code = graphqlErrorCode(error);
  const key = Array.isArray(handled)
    ? handled.includes(code)
      ? code
      : null
    : (handled?.[code] ?? null);
  return i18n.t(key ?? fallbackKey);
}
