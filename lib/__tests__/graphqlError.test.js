import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { graphqlErrorCode, graphqlErrorMessage } from "@/lib/graphqlError";

jest.mock("@/i18n", () => ({ t: (key) => `t:${key}` }));

const serverError = (code) =>
  new CombinedGraphQLErrors({
    errors: [{ message: "boom", extensions: { code } }],
  });

describe("graphqlErrorCode", () => {
  it("lit le code métier d'une erreur serveur", () => {
    expect(graphqlErrorCode(serverError("too_many_favorites"))).toBe("too_many_favorites");
  });

  it("ne rend rien pour une erreur réseau", () => {
    expect(graphqlErrorCode(new Error("Network request failed"))).toBeUndefined();
  });
});

describe("graphqlErrorMessage", () => {
  it("traduit un code prévu sous son propre nom", () => {
    expect(graphqlErrorMessage(serverError("handover_locked"), ["handover_locked"], "fallback")).toBe(
      "t:handover_locked"
    );
  });

  it("accepte une table de renommage", () => {
    expect(
      graphqlErrorMessage(serverError("too_long"), { too_long: "chat_too_long" }, "fallback")
    ).toBe("t:chat_too_long");
  });

  it("retombe sur la clé de repli pour un code inattendu", () => {
    expect(graphqlErrorMessage(serverError("other"), ["handover_locked"], "fallback")).toBe(
      "t:fallback"
    );
  });
});
