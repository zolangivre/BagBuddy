package bagbuddy.backend.services;

import bagbuddy.backend.models.Review;
import bagbuddy.backend.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    public List<Review> getReviewsByAuthorId(Integer authorId) {
        return reviewRepository.findByAuthor_id(authorId);
    }

    public List<Review> getReviewsByTargetId(Integer targetId) {
        return reviewRepository.findByTarget_id(targetId);
    }

    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }
}
