package com.bagbuddy.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "trip_listings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String flightNumber;
    private String departureAirport;
    private String arrivalAirport;

    private LocalDate departureDate;
    private LocalDate arrivalDate;

    private double availableWeight;
    private double pricePerKg;

    private String conditions;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "tripListing", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions;
}
