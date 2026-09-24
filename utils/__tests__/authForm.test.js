import { initialsOf, isValidEmail, isValidPhone } from "@/utils/authForm";

describe("initialsOf", () => {
  it("prend le prénom et le nom", () => {
    expect(initialsOf({ givenName: "zolan", familyName: "givre" })).toBe("ZG");
  });

  it("retombe sur le nom complet", () => {
    expect(initialsOf({ name: "Ada  Lovelace King" })).toBe("AL");
  });

  it("rend une chaîne vide sans rien", () => {
    expect(initialsOf()).toBe("");
    expect(initialsOf({ givenName: "  " })).toBe("");
  });
});

describe("isValidEmail", () => {
  it.each(["a@b.co", "  first.last@example.com "])("accepte %p", (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each(["", "a@b", "a b@c.d", "@example.com"])("rejette %p", (email) => {
    expect(isValidEmail(email)).toBe(false);
  });
});

describe("isValidPhone", () => {
  it("accepte un champ vide : le téléphone est facultatif", () => {
    expect(isValidPhone("   ")).toBe(true);
  });

  it.each(["+33 6 12 34 56 78", "(555) 123-4567"])("accepte %p", (phone) => {
    expect(isValidPhone(phone)).toBe(true);
  });

  it.each(["12345", "06 12 ab 56 78"])("rejette %p", (phone) => {
    expect(isValidPhone(phone)).toBe(false);
  });
});
