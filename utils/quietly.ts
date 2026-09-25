/**
 * Lance `fn` sans attendre son résultat et sans laisser son échec finir en
 * « Possible Unhandled Promise Rejection ». Fait pour les refetch Apollo, dont
 * la promesse rejette en cas d'erreur réseau ou GraphQL : l'erreur est déjà
 * journalisée par l'ErrorLink et affichée par l'écran via `error`.
 */
export function quietly(fn: () => unknown): void {
  Promise.resolve(fn()).catch(() => {});
}
