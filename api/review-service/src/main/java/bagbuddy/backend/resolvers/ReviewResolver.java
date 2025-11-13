package bagbuddy.backend.resolvers;

import bagbuddy.backend.models.Review;
import bagbuddy.backend.services.ReviewService;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReviewResolver implements GraphQLQueryResolver, GraphQLMutationResolver {

    private final ReviewService reviewService;

    public ReviewResolver(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Queries
    public List<Review> reviews() {
        return reviewService.getAllReviews();
    }

    public Review review(Long review_id) {
        return reviewService.getReviewById(review_id).orElse(null);
    }

    public List<Review> reviewsByAuthor(Integer author_id) {
        return reviewService.getReviewsByAuthorId(author_id);
    }

    public List<Review> reviewsByTarget(Integer target_id) {
        return reviewService.getReviewsByTargetId(target_id);
    }

    // Mutations
    public Review createReview(Integer author_id, Integer target_id, Integer rating, String comment) {
        Review review = new Review();
        review.setAuthor_id(author_id);
        review.setTarget_id(target_id);
        review.setRating(rating);
        review.setComment(comment);
        return reviewService.createReview(review);
    }
}
