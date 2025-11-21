package com.bagbuddy.tripservice.controller;

import com.bagbuddy.tripservice.model.Trip;
import com.bagbuddy.tripservice.repository.TripRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/trips")
public class TripController {

    @Autowired
    private TripRepository tripRepository;

    @GetMapping
    public List<Trip> getAllTrips() {
        System.out.println(tripRepository.findAllByOrderByCreatedAtDesc());
        return tripRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/{id}")
    public Trip getTripById(@PathVariable Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found with id " + id));
    }

    // GET by sub
    @GetMapping("/user/{userId}")
    public List<Trip> getTripsByUserId(@PathVariable String userId) {
        return tripRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
    }

    @PostMapping
    public Trip createTrip(@RequestBody Trip trip) {
        if (trip.getUserInfo() != null) {
            trip.setUserId(trip.getUserInfo().getSub());
        }
        return tripRepository.save(trip);
    }

    //DELETE trip
    @DeleteMapping("/{id}")
    public void deleteTrip(@PathVariable Long id) {
        tripRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Trip updateTrip(@PathVariable Long id, @RequestBody Trip tripDetails) {
        Optional<Trip> optionalTrip = tripRepository.findById(id);
        if (optionalTrip.isEmpty()) {
            throw new RuntimeException("Trip not found with id " + id);
        }

        Trip existingTrip = optionalTrip.get();
        existingTrip.setDepartureAirport(tripDetails.getDepartureAirport());
        existingTrip.setArrivalAirport(tripDetails.getArrivalAirport());
        existingTrip.setDepartureDate(tripDetails.getDepartureDate());
        existingTrip.setArrivalDate(tripDetails.getArrivalDate());
        existingTrip.setTotalWeightAvailable(tripDetails.getTotalWeightAvailable());
        existingTrip.setRemainingWeight(tripDetails.getRemainingWeight());
        existingTrip.setPricePerKg(tripDetails.getPricePerKg());
        existingTrip.setConditions(tripDetails.getConditions());

        return tripRepository.save(existingTrip);
    }
}