package bagbuddy.backend.repository;

import bagbuddy.backend.models.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUser_id(Integer user_id);
}
