package bagbuddy.backend.repository;

import bagbuddy.backend.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySeller_id(Integer sellerId);
    List<Transaction> findByBuyer_id(Integer buyerId);
    List<Transaction> findByListing_id(Integer listingId);
}
