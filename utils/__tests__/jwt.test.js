import { isTokenExpired } from "@/utils/jwt";

/** JWT non signé : jwt-decode ne lit que la charge utile. */
function tokenExpiringIn(seconds) {
  const payload = { exp: Math.floor(Date.now() / 1000) + seconds };
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "none" })}.${encode(payload)}.`;
}

describe("isTokenExpired", () => {
  beforeEach(() => jest.spyOn(console, "warn").mockImplementation(() => {}));
  afterEach(() => jest.restoreAllMocks());

  it("garde un jeton valide encore longtemps", () => {
    expect(isTokenExpired(tokenExpiringIn(300))).toBe(false);
  });

  it("considère expiré un jeton qui expire dans la marge", () => {
    expect(isTokenExpired(tokenExpiringIn(10))).toBe(true);
    expect(isTokenExpired(tokenExpiringIn(10), 0)).toBe(false);
  });

  it("considère expiré un jeton absent ou illisible", () => {
    expect(isTokenExpired(null)).toBe(true);
    expect(isTokenExpired("pas-un-jwt")).toBe(true);
  });
});
