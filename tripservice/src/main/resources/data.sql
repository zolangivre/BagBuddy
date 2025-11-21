INSERT INTO trip (
    user_id, flight_number, departure_airport, arrival_airport,
    departure_date, arrival_date, total_weight_available, remaining_weight,
    price_per_kg, conditions
)
VALUES (
    10, 'AF1234', 'CDG', 'JFK',
    '2025-11-01 10:00:00', '2025-11-01 18:00:00',
    30.0, 30.0, 15.0,
    'Pas de produits liquides, colis bien emballés.'
);
