package bagbuddy.backend.repository;

import bagbuddy.backend.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByAuthor_id(Integer authorId);
    List<Review> findByTarget_id(Integer targetId);
}
