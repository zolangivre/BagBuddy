package bagbuddy.backend.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trip_id;

    @Column(nullable = false)
    private Integer user_id; // Référence vers User

    private String flight_number;

    @Column(nullable = false)
    private String departure_airport;

    @Column(nullable = false)
    private String arrival_airport;

    @Column(nullable = false)
    private LocalDateTime departure_date;

    @Column(nullable = false)
    private LocalDateTime arrival_date;

    @Column(nullable = false)
    private BigDecimal total_weight_available;

    private BigDecimal remaining_weight;

    @Column(nullable = false)
    private BigDecimal price_per_kg;

    private String conditions;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime created_at;

    // Getters & Setters

    public Long getTrip_id() { return trip_id; }
    public void setTrip_id(Long trip_id) { this.trip_id = trip_id; }

    public Integer getUser_id() { return user_id; }
    public void setUser_id(Integer user_id) { this.user_id = user_id; }

    public String getFlight_number() { return flight_number; }
    public void setFlight_number(String flight_number) { this.flight_number = flight_number; }

    public String getDeparture_airport() { return departure_airport; }
    public void setDeparture_airport(String departure_airport) { this.departure_airport = departure_airport; }

    public String getArrival_airport() { return arrival_airport; }
    public void setArrival_airport(String arrival_airport) { this.arrival_airport = arrival_airport; }

    public LocalDateTime getDeparture_date() { return departure_date; }
    public void setDeparture_date(LocalDateTime departure_date) { this.departure_date = departure_date; }

    public LocalDateTime getArrival_date() { return arrival_date; }
    public void setArrival_date(LocalDateTime arrival_date) { this.arrival_date = arrival_date; }

    public BigDecimal getTotal_weight_available() { return total_weight_available; }
    public void setTotal_weight_available(BigDecimal total_weight_available) { this.total_weight_available = total_weight_available; }

    public BigDecimal getRemaining_weight() { return remaining_weight; }
    public void setRemaining_weight(BigDecimal remaining_weight) { this.remaining_weight = remaining_weight; }

    public BigDecimal getPrice_per_kg() { return price_per_kg; }
    public void setPrice_per_kg(BigDecimal price_per_kg) { this.price_per_kg = price_per_kg; }

    public String getConditions() { return conditions; }
    public void setConditions(String conditions) { this.conditions = conditions; }

    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }
}
