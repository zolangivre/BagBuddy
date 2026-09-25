import { authErrorCode } from "@/contexts/AuthContext";

jest.mock("@/lib/apolloClient", () => ({ __esModule: true, default: {} }));

describe("authErrorCode", () => {
  it("distingue un compte désactivé d'un mauvais mot de passe", () => {
    expect(authErrorCode("invalid_grant", "Account disabled")).toBe("account_disabled");
    expect(authErrorCode("invalid_grant", "Account is not fully set up")).toBe(
      "account_disabled"
    );
    expect(authErrorCode("invalid_grant", "Account temporarily disabled")).toBe(
      "account_disabled"
    );
    expect(authErrorCode("invalid_grant", "Invalid user credentials")).toBe(
      "invalid_credentials"
    );
  });

  it("traite un refresh token mort comme des identifiants invalides", () => {
    expect(authErrorCode("invalid_grant", "Token is not active")).toBe(
      "invalid_credentials"
    );
    expect(authErrorCode("invalid_grant", "Offline session not active")).toBe(
      "invalid_credentials"
    );
  });

  it("ne prend pas une erreur de configuration pour un mauvais mot de passe", () => {
    expect(authErrorCode("invalid_scope", "Invalid scopes: offline_access")).toBe(
      "unavailable"
    );
    expect(authErrorCode("unauthorized_client", undefined)).toBe("unavailable");
    expect(authErrorCode("invalid_client", "Invalid client credentials")).toBe(
      "unavailable"
    );
  });

  it("classe une réponse sans erreur OAuth comme une panne", () => {
    expect(authErrorCode(undefined, undefined)).toBe("unavailable");
  });
});
