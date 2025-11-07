-- V1 : schéma initial pour Trip Service
CREATE TABLE IF NOT EXISTS trips (
  trip_id BIGSERIAL PRIMARY KEY,

  user_id INTEGER NOT NULL,
  flight_number TEXT,

  departure_airport TEXT NOT NULL,
  arrival_airport   TEXT NOT NULL,

  departure_date TIMESTAMP NOT NULL,
  arrival_date   TIMESTAMP NOT NULL,

  total_weight_available NUMERIC(10,2) NOT NULL,
  remaining_weight       NUMERIC(10,2),

  price_per_kg NUMERIC(10,2) NOT NULL,

  conditions TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_departure_date ON trips(departure_date);
CREATE INDEX IF NOT EXISTS idx_trips_route ON trips(departure_airport, arrival_airport);
