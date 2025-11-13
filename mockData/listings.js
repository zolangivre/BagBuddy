const mockListings = [
  {
    id: 1,
    name: "Sarah Chen",
    initials: "SC",
    flightNumber: "UA 847",
    date: "2025-12-15T23:30:00Z", // ISO 8601 UTC
    departure: "LAX",
    arrival: "NRT",
    weight: 8, // en kg
    pricePerKg: 12, // en $
    total: 96, // calcul automatique
  },
  {
    id: 2,
    name: "Marco Silva",
    initials: "MS",
    flightNumber: "LH 441",
    date: "2025-12-16T14:15:00Z",
    departure: "FRA",
    arrival: "JFK",
    weight: 15,
    pricePerKg: 8,
    total: 120,
  },
  {
    id: 3,
    name: "Emma Watson",
    initials: "EW",
    flightNumber: "BA 179",
    date: "2025-12-17T21:45:00Z",
    departure: "LHR",
    arrival: "JFK",
    weight: 12,
    pricePerKg: 10,
    total: 120,
  },
];

export default mockListings;
