package com.bagbuddy.reviewservice.controller;

import com.bagbuddy.reviewservice.model.Review;
import com.bagbuddy.reviewservice.repository.ReviewRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    // GET all
    @GetMapping
    public List<Review> getAll() {
        return reviewRepository.findAll();
    }

    // GET by id
    @GetMapping("/{id}")
    public Review getOne(@PathVariable Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id " + id));
    }

    // GET filters
    @GetMapping("/reviewee/{revieweeId}")
    public List<Review> byReviewee(@PathVariable Integer revieweeId) {
        return reviewRepository.findByRevieweeId(revieweeId);
    }

    @GetMapping("/reviewer/{reviewerId}")
    public List<Review> byReviewer(@PathVariable Integer reviewerId) {
        return reviewRepository.findByReviewerId(reviewerId);
    }

    @GetMapping("/trip/{tripId}")
    public List<Review> byTrip(@PathVariable Long tripId) {
        return reviewRepository.findByTripId(tripId);
    }

    @GetMapping("/transaction/{transactionId}")
    public List<Review> byTransaction(@PathVariable Long transactionId) {
        return reviewRepository.findByTransactionId(transactionId);
    }

    @GetMapping("/reviewee/{revieweeId}/average")
    public Double averageForReviewee(@PathVariable Integer revieweeId) {
        return reviewRepository.averageRatingForReviewee(revieweeId);
    }

    // POST create
    @PostMapping
    public Review create(@RequestBody Review review) {
        return reviewRepository.save(review);
    }

    // PUT update
    @PutMapping("/{id}")
    public Review update(@PathVariable Long id, @RequestBody Review body) {
        Review existing = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id " + id));

        existing.setReviewerId(body.getReviewerId());
        existing.setRevieweeId(body.getRevieweeId());
        existing.setTripId(body.getTripId());
        existing.setTransactionId(body.getTransactionId());
        existing.setRating(body.getRating());
        existing.setComment(body.getComment());

        return reviewRepository.save(existing);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("Review not found with id " + id);
        }
        reviewRepository.deleteById(id);
    }
}
