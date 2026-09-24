import {
  convertFromBase,
  isStale,
  parseFrankfurterRates,
} from "@/lib/exchangeRates";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(() => Promise.resolve()),
}));

describe("parseFrankfurterRates", () => {
  it("lit la réponse v2 de Frankfurter", () => {
    expect(
      parseFrankfurterRates([
        { date: "2026-09-24", base: "EUR", quote: "USD", rate: 1.1438 },
      ])
    ).toEqual({ rates: { EUR: 1, USD: 1.1438 }, date: "2026-09-24" });
  });

  it("ignore les devises non proposées et les taux invalides", () => {
    expect(
      parseFrankfurterRates([
        { date: "2026-09-24", base: "EUR", quote: "GBP", rate: 0.87 },
        { date: "2026-09-24", base: "EUR", quote: "USD", rate: 0 },
      ])
    ).toBeNull();
  });

  it("rejette une réponse d'une autre base ou d'une autre forme", () => {
    expect(
      parseFrankfurterRates([{ date: "2026-09-24", base: "USD", quote: "USD", rate: 1 }])
    ).toBeNull();
    expect(parseFrankfurterRates({ rates: { USD: 1.14 } })).toBeNull();
    expect(parseFrankfurterRates(null)).toBeNull();
  });
});

describe("convertFromBase", () => {
  const rates = { EUR: 1, USD: 1.2 };

  it("laisse un montant EUR tel quel", () => {
    expect(convertFromBase(10, "EUR", rates)).toBe(10);
  });

  it("convertit vers une devise connue", () => {
    expect(convertFromBase(10, "USD", rates)).toBeCloseTo(12);
  });

  it("rend null sans taux, pour ne pas afficher un faux montant", () => {
    expect(convertFromBase(10, "USD", { EUR: 1 })).toBeNull();
  });
});

describe("isStale", () => {
  const now = Date.UTC(2026, 8, 24, 12);

  it("relit sans cache", () => {
    expect(isStale(null, now)).toBe(true);
  });

  it("garde un cache de moins de 12 heures", () => {
    expect(isStale({ rates: {}, date: null, fetchedAt: now - 11 * 3600e3 }, now)).toBe(false);
    expect(isStale({ rates: {}, date: null, fetchedAt: now - 13 * 3600e3 }, now)).toBe(true);
  });
});
