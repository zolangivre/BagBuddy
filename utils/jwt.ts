import { jwtDecode } from "jwt-decode";

/**
 * Vrai si le jeton est expiré ou le sera dans `leewaySeconds`. La marge couvre
 * le temps de trajet de la requête et un léger décalage d'horloge : un jeton
 * valide au départ mais expiré à l'arrivée ferait échouer l'appel.
 */
export const isTokenExpired = (
  token: string | null | undefined,
  leewaySeconds = 30
): boolean => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    // Sans `exp`, le jeton n'expire pas (Keycloak en met toujours un).
    if (decoded.exp === undefined) return false;
    return decoded.exp - leewaySeconds < now;
  } catch (e) {
    console.warn("Invalid token", e);
    return true;
  }
};
