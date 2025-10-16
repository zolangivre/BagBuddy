package com.bagbuddy.repository;

import com.bagbuddy.model.Transaction;
import com.bagbuddy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySeller(User seller);
    List<Transaction> findByBuyer(User buyer);
    List<Transaction> findByStatus(String status);
}
