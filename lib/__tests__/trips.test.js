import { toTripInput, toTripSearchInput } from "@/lib/graphql/trips";

describe("toTripInput", () => {
  const listing = {
    id: "t1",
    userId: "u1",
    active: true,
    remainingWeight: 3,
    departureAirport: "CDG",
    arrivalAirport: "JFK",
    departureDate: "2026-10-01T10:00:00",
    arrivalDate: "2026-10-01T18:00:00",
    totalWeightAvailable: 10,
    pricePerKg: 8,
    conditions: "Pas de liquide",
    stripeAccountId: "acct_1",
    userInfo: { sub: "u1", name: "Zolan", bio: "Hi", location: "Paris", phone: "0600000000" },
  };

  it("ne garde que les champs déclarés par TripInput", () => {
    expect(toTripInput(listing)).toEqual({
      departureAirport: "CDG",
      arrivalAirport: "JFK",
      departureDate: "2026-10-01T10:00:00",
      arrivalDate: "2026-10-01T18:00:00",
      totalWeightAvailable: 10,
      pricePerKg: 8,
      conditions: "Pas de liquide",
      stripeAccountId: "acct_1",
      profile: { bio: "Hi", location: "Paris", phone: "0600000000" },
    });
  });

  it("envoie un profil nul sans userInfo", () => {
    expect(toTripInput({ ...listing, userInfo: undefined }).profile).toBeNull();
  });
});

describe("toTripSearchInput", () => {
  it("rend un filtre vide sans filtres", () => {
    expect(toTripSearchInput(null)).toEqual({});
  });

  it("traduit les clés du front vers celles du schéma", () => {
    expect(
      toTripSearchInput({
        from: "CDG",
        to: "JFK",
        date: "2026-10-01",
        flexDays: 3,
        minPrice: 5,
        maxWeight: 20,
        sort: "price_low",
      })
    ).toEqual({
      departureAirport: "CDG",
      arrivalAirport: "JFK",
      date: "2026-10-01",
      flexDays: 3,
      minPricePerKg: 5,
      maxPricePerKg: undefined,
      minWeight: undefined,
      maxWeight: 20,
      sort: "PRICE_LOW",
    });
  });

  it("ignore flexDays sans date", () => {
    expect(toTripSearchInput({ flexDays: 3 }).flexDays).toBeUndefined();
  });
});
