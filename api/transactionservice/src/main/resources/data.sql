INSERT INTO transaction_record (
  seller_id, seller_name, buyer_id, buyer_name, initials, type, status, status_text,
  flight_number, departure_airport, arrival_airport, date_departure, date_arrival,
  weight, price_per_kg, total, conditions, created_at
) VALUES (
  1, 'Sarah Chen', 2, 'John Doe', 'SC', 'buying', 'confirmed', 'Confirmed',
  'UA 847', 'LAX', 'NRT', '2025-12-15T23:30:00', '2025-12-16T14:15:00',
  6, 12, 72, 'No special conditions', NOW()
);
