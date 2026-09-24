import { authErrorCode } from "@/contexts/AuthContext";

jest.mock("@/lib/apolloClient", () => ({ __esModule: true, default: {} }));

describe("authErrorCode", () => {
  it("distingue un compte désactivé d'un mauvais mot de passe", () => {
    expect(authErrorCode(400, "Account disabled")).toBe("account_disabled");
    expect(authErrorCode(400, "Account is not fully set up")).toBe("account_disabled");
    expect(authErrorCode(400, "Account temporarily disabled")).toBe("account_disabled");
    expect(authErrorCode(401, "Invalid user credentials")).toBe("invalid_credentials");
  });

  it("classe les autres statuts comme une panne", () => {
    expect(authErrorCode(500, undefined)).toBe("unavailable");
    expect(authErrorCode(503, "Service Unavailable")).toBe("unavailable");
  });
});
