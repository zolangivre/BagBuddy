package com.bagbuddy.transactionservice.controller;

import com.bagbuddy.transactionservice.model.Transaction;
import com.bagbuddy.transactionservice.repository.TransactionRepository;
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
        return transactionRepository.findAll();
    }

    // GET by id
    @GetMapping("/{id}")
    public Transaction getOne(@PathVariable Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));
    }

    // GET by buyer
    @GetMapping("/buyer/{buyerId}")
    public List<Transaction> getByBuyer(@PathVariable Integer buyerId) {
        return transactionRepository.findByBuyerId(buyerId);
    }

    // GET by seller
    @GetMapping("/seller/{sellerId}")
    public List<Transaction> getBySeller(@PathVariable Integer sellerId) {
        return transactionRepository.findBySellerId(sellerId);
    }

    // POST create
    @PostMapping
    public Transaction create(@RequestBody Transaction tx) {
        return transactionRepository.save(tx);
    }

    // PUT update
    @PutMapping("/{id}")
    public Transaction update(@PathVariable Long id, @RequestBody Transaction body) {
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));

        existing.setSellerId(body.getSellerId());
        existing.setSellerName(body.getSellerName());
        existing.setBuyerId(body.getBuyerId());
        existing.setBuyerName(body.getBuyerName());
        existing.setInitials(body.getInitials());
        existing.setType(body.getType());
        existing.setStatus(body.getStatus());
        existing.setStatusText(body.getStatusText());
        existing.setFlightNumber(body.getFlightNumber());
        existing.setDepartureAirport(body.getDepartureAirport());
        existing.setArrivalAirport(body.getArrivalAirport());
        existing.setDateDeparture(body.getDateDeparture());
        existing.setDateArrival(body.getDateArrival());
        existing.setWeight(body.getWeight());
        existing.setPricePerKg(body.getPricePerKg());
        existing.setTotal(body.getTotal());
        existing.setConditions(body.getConditions());

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
