package com.bagbuddy.repository;

import com.bagbuddy.model.Review;
import com.bagbuddy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTarget(User target);
    List<Review> findByAuthor(User author);
}
