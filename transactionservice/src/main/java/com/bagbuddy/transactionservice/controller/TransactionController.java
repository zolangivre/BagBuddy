package com.bagbuddy.transactionservice.controller;

import com.bagbuddy.transactionservice.model.Transaction;
import com.bagbuddy.transactionservice.repository.TransactionRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    // GET all
    @GetMapping
    public List<Transaction> getAll() {
        return transactionRepository.findAllByOrderByCreatedAtDesc();
    }

    // GET by seller
    @GetMapping("/seller/{sellerId}")
    @Transactional(readOnly = true)
    public List<Transaction> getBySeller(@PathVariable String sellerId) {
        return transactionRepository.findBySellerId(sellerId);
    }

    // GET by buyer
    @GetMapping("/buyer/{buyerId}")
    @Transactional(readOnly = true)
    public List<Transaction> getByBuyer(@PathVariable String buyerId) {
        return transactionRepository.findByBuyerId(buyerId);
    }

    // GET all transactions pour un user (buyer OU seller)
    @GetMapping("/user/{userId}")
    public List<Transaction> getByUser(@PathVariable String userId) {
        return transactionRepository.findByBuyerIdOrSellerIdOrderByCreatedAtDesc(userId, userId);
    }

    //GET number of transactions for a user
    @GetMapping("/user/{userId}/count")
    public Long countByUser(@PathVariable String userId) {
        return transactionRepository.countByBuyerIdOrSellerId(userId, userId);
    }

    //GET total earned by a seller
    @GetMapping("/seller/{sellerId}/total-earned")
    public Double getTotalEarnedBySeller(@PathVariable String sellerId) {
        List<Transaction> transactions = transactionRepository.findBySellerId(sellerId);
        return transactions.stream()
                .mapToDouble(tx -> tx.getTotal().doubleValue())
                .sum();
    }

    //GET total spent by a buyer
    @GetMapping("/buyer/{buyerId}/total-spent")
    public Double getTotalSpentByBuyer(@PathVariable String buyerId) {
        List<Transaction> transactions = transactionRepository.findByBuyerId(buyerId);
        return transactions.stream()
                .mapToDouble(tx -> tx.getTotal().doubleValue())
                .sum();
    }

    // GET by id
    @GetMapping("/{id}")
    public Transaction getOne(@PathVariable Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));
    }

    // POST create
    @PostMapping
    public Transaction create(@RequestBody Transaction tx) {
        if (tx.getBuyerInfo() != null) {
            tx.setBuyerId(tx.getBuyerInfo().getSub());
        }
        return transactionRepository.save(tx);
    }

    // PUT update
    @PutMapping("/{id}")
    public Transaction update(@PathVariable Long id, @RequestBody Transaction body) {
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));

        existing.setSellerStatus(body.getSellerStatus());
        existing.setBuyerStatus(body.getBuyerStatus());
        existing.setWeight(body.getWeight());
        existing.setTotal(body.getTotal());
        existing.setListingInfo(body.getListingInfo());
        existing.setBuyerReview(body.getBuyerReview());
        existing.setSellerReview(body.getSellerReview());

        return transactionRepository.save(existing);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new RuntimeException("Transaction not found with id " + id);
        }
        transactionRepository.deleteById(id);
    }
}
