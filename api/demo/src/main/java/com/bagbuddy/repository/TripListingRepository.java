package com.bagbuddy.repository;

import com.bagbuddy.model.TripListing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface TripListingRepository extends JpaRepository<TripListing, Long> {
    List<TripListing> findByArrivalAirportContainingIgnoreCase(String arrivalAirport);
    List<TripListing> findByDepartureAirportContainingIgnoreCase(String departureAirport);
    List<TripListing> findByDepartureDateBetween(LocalDate start, LocalDate end);
    List<TripListing> findByAvailableWeightGreaterThanEqual(Double minWeight);
}
