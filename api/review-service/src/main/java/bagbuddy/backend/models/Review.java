package bagbuddy.backend.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long review_id;

    @Column(nullable = false)
    private Integer author_id;

    @Column(nullable = false)
    private Integer target_id;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime review_date;

    // Getters & Setters
    public Long getReview_id() { return review_id; }
    public void setReview_id(Long review_id) { this.review_id = review_id; }

    public Integer getAuthor_id() { return author_id; }
    public void setAuthor_id(Integer author_id) { this.author_id = author_id; }

    public Integer getTarget_id() { return target_id; }
    public void setTarget_id(Integer target_id) { this.target_id = target_id; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getReview_date() { return review_date; }
    public void setReview_date(LocalDateTime review_date) { this.review_date = review_date; }
}
