/**
 * Passerelle entre l'AuthContext (React) et le lien Apollo, qui vit hors de
 * l'arbre React et ne peut donc pas lire le contexte.
 *
 * AuthProvider y enregistre son `getValidAccessToken` : le lien obtient ainsi un
 * jeton rafraîchi si besoin, au lieu d'une copie figée au montage du client.
 */
type TokenProvider = () => Promise<string>;

let tokenProvider: TokenProvider | null = null;

export function setAccessTokenProvider(provider: TokenProvider | null): void {
  tokenProvider = provider;
}

/** Jeton courant, ou null hors session. Ne jette jamais : un appel anonyme vaut mieux qu'un écran cassé. */
export async function getAccessToken(): Promise<string | null> {
  if (!tokenProvider) return null;
  try {
    return await tokenProvider();
  } catch {
    // Refresh échoué : l'AuthContext a déjà déconnecté, la requête partira sans
    // jeton et le back répondra UNAUTHORIZED.
    return null;
  }
}
