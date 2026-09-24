import {
  compactFilters,
  countActiveFilters,
  currencySymbol,
  departsAround,
  filterChips,
  fromDayString,
  parseAmount,
  searchSummary,
  toDayString,
} from "@/utils/filters";

const i18n = { t: (key) => key };

describe("compactFilters", () => {
  it("retire les valeurs vides", () => {
    expect(compactFilters({ from: "CDG", to: "", minPrice: null, maxPrice: undefined })).toEqual({
      from: "CDG",
    });
  });

  it("ignore flexDays sans date", () => {
    expect(compactFilters({ flexDays: 3 })).toEqual({});
    expect(compactFilters({ date: "2026-10-01", flexDays: 3 })).toEqual({
      date: "2026-10-01",
      flexDays: 3,
    });
  });

  it("accepte null", () => {
    expect(compactFilters(null)).toEqual({});
  });
});

describe("countActiveFilters", () => {
  it("compte un trajet et une fourchette comme un filtre chacun", () => {
    expect(
      countActiveFilters({ from: "CDG", to: "JFK", minPrice: 5, maxPrice: 10 })
    ).toBe(2);
  });

  it("ne compte pas le tri", () => {
    expect(countActiveFilters({ sort: "price_low" })).toBe(0);
  });

  it("compte un prix minimum de 0", () => {
    expect(countActiveFilters({ minPrice: 0 })).toBe(1);
  });
});

describe("toDayString / fromDayString", () => {
  it("font l'aller-retour en heure locale", () => {
    expect(toDayString(fromDayString("2026-02-28"))).toBe("2026-02-28");
  });

  it("complète les zéros", () => {
    expect(toDayString(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("departsAround", () => {
  it("laisse tout passer sans date", () => {
    expect(departsAround("2026-10-01T10:00:00", undefined)).toBe(true);
  });

  it("compare des jours calendaires, pas des heures", () => {
    expect(departsAround("2026-10-01T23:30:00", "2026-10-01")).toBe(true);
    expect(departsAround("2026-10-02T00:30:00", "2026-10-01")).toBe(false);
  });

  it("tolère flexDays jours de part et d'autre", () => {
    expect(departsAround("2026-10-04T08:00:00", "2026-10-01", 3)).toBe(true);
    expect(departsAround("2026-09-28T08:00:00", "2026-10-01", 3)).toBe(true);
    expect(departsAround("2026-10-05T08:00:00", "2026-10-01", 3)).toBe(false);
  });

  it("rejette une date de départ illisible", () => {
    expect(departsAround(null, "2026-10-01")).toBe(false);
  });
});

describe("parseAmount", () => {
  it.each([
    ["12", 12],
    ["12,5", 12.5],
    [" 12.5 ", 12.5],
    ["0", 0],
  ])("lit %p comme %p", (text, expected) => {
    expect(parseAmount(text)).toBe(expected);
  });

  it.each(["", "abc", "-3", null, undefined])("rejette %p", (text) => {
    expect(parseAmount(text)).toBeUndefined();
  });
});

describe("filterChips", () => {
  const options = { i18n, language: "fr", currencySymbol: "€" };

  it("rend une puce par groupe de filtres, dans l'ordre de la feuille", () => {
    const chips = filterChips(
      { from: "CDG", minWeight: 2, maxPrice: 10, status: "CONFIRMED" },
      options
    );
    expect(chips.map((chip) => chip.key)).toEqual(["route", "price", "weight", "status"]);
    expect(chips[0].label).toBe("CDG → filter_anywhere");
    expect(chips[1].label).toBe("≤ 10 €/kg");
    expect(chips[2].label).toBe("≥ 2 kg");
  });

  it("chaque puce sait se retirer sans toucher aux autres", () => {
    const filters = { from: "CDG", to: "JFK", minPrice: 5, sort: "price_low" };
    const [route] = filterChips(filters, options);
    expect(compactFilters(route.remove(filters))).toEqual({
      minPrice: 5,
      sort: "price_low",
    });
  });
});

describe("searchSummary", () => {
  it("met le trajet en titre et le reste en sous-titre", () => {
    const summary = searchSummary(
      [
        { key: "route", label: "CDG → JFK" },
        { key: "price", label: "≤ 10 €/kg" },
        { key: "weight", label: "≥ 2 kg" },
      ],
      i18n
    );
    expect(summary).toEqual({ title: "CDG → JFK", subtitle: "≤ 10 €/kg · ≥ 2 kg" });
  });

  it("invite à chercher sans filtre", () => {
    expect(searchSummary([], i18n)).toEqual({
      title: "filter_where_to",
      subtitle: "filter_search_hint",
    });
  });
});

describe("currencySymbol", () => {
  it("connaît EUR et USD, et rend le code sinon", () => {
    expect(currencySymbol("EUR")).toBe("€");
    expect(currencySymbol("USD")).toBe("$");
    expect(currencySymbol("GBP")).toBe("GBP");
    expect(currencySymbol(undefined)).toBe("€");
  });
});
