package bagbuddy.backend.resolvers;

import bagbuddy.backend.models.Trip;
import bagbuddy.backend.services.TripService;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TripResolver implements GraphQLQueryResolver, GraphQLMutationResolver {

    private final TripService tripService;

    public TripResolver(TripService tripService) {
        this.tripService = tripService;
    }

    // Queries
    public List<Trip> trips() {
        return tripService.getAllTrips();
    }

    public Trip trip(Long trip_id) {
        return tripService.getTripById(trip_id).orElse(null);
    }

    public List<Trip> tripsByUserId(Integer user_id) {
        return tripService.getTripsByUserId(user_id);
    }

    // Mutations
    public Trip createTrip(Integer user_id, String flight_number, String departure_airport,
                           String arrival_airport, java.time.LocalDateTime departure_date,
                           java.time.LocalDateTime arrival_date, java.math.BigDecimal total_weight_available,
                           java.math.BigDecimal remaining_weight, java.math.BigDecimal price_per_kg,
                           String conditions) {

        Trip trip = new Trip();
        trip.setUser_id(user_id);
        trip.setFlight_number(flight_number);
        trip.setDeparture_airport(departure_airport);
        trip.setArrival_airport(arrival_airport);
        trip.setDeparture_date(departure_date);
        trip.setArrival_date(arrival_date);
        trip.setTotal_weight_available(total_weight_available);
        trip.setRemaining_weight(remaining_weight);
        trip.setPrice_per_kg(price_per_kg);
        trip.setConditions(conditions);

        return tripService.createTrip(trip);
    }
}
