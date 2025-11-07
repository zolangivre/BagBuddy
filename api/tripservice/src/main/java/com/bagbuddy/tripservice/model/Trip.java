package com.bagbuddy.tripservice.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trip")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Keep domain fields; use camelCase like booking
    private Integer userId;
    private String flightNumber;

    private String departureAirport;
    private String arrivalAirport;

    private LocalDateTime departureDate;
    private LocalDateTime arrivalDate;

    private BigDecimal totalWeightAvailable;
    private BigDecimal remainingWeight;
    private BigDecimal pricePerKg;

    @Column(columnDefinition = "TEXT")
    private String conditions;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    // Getters / Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }

    public String getDepartureAirport() { return departureAirport; }
    public void setDepartureAirport(String departureAirport) { this.departureAirport = departureAirport; }

    public String getArrivalAirport() { return arrivalAirport; }
    public void setArrivalAirport(String arrivalAirport) { this.arrivalAirport = arrivalAirport; }

    public LocalDateTime getDepartureDate() { return departureDate; }
    public void setDepartureDate(LocalDateTime departureDate) { this.departureDate = departureDate; }

    public LocalDateTime getArrivalDate() { return arrivalDate; }
    public void setArrivalDate(LocalDateTime arrivalDate) { this.arrivalDate = arrivalDate; }

    public BigDecimal getTotalWeightAvailable() { return totalWeightAvailable; }
    public void setTotalWeightAvailable(BigDecimal totalWeightAvailable) { this.totalWeightAvailable = totalWeightAvailable; }

    public BigDecimal getRemainingWeight() { return remainingWeight; }
    public void setRemainingWeight(BigDecimal remainingWeight) { this.remainingWeight = remainingWeight; }

    public BigDecimal getPricePerKg() { return pricePerKg; }
    public void setPricePerKg(BigDecimal pricePerKg) { this.pricePerKg = pricePerKg; }

    public String getConditions() { return conditions; }
    public void setConditions(String conditions) { this.conditions = conditions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}