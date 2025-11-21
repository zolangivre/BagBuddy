package com.bagbuddy.transactionservice.repository;

import com.bagbuddy.transactionservice.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByBuyerId(Integer buyerId);
    List<Transaction> findBySellerId(Integer sellerId);
    List<Transaction> findByStatus(String status);
}
