package bagbuddy.backend.services;

import bagbuddy.backend.models.Transaction;
import bagbuddy.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    public List<Transaction> getTransactionsBySellerId(Integer sellerId) {
        return transactionRepository.findBySeller_id(sellerId);
    }

    public List<Transaction> getTransactionsByBuyerId(Integer buyerId) {
        return transactionRepository.findByBuyer_id(buyerId);
    }

    public List<Transaction> getTransactionsByListingId(Integer listingId) {
        return transactionRepository.findByListing_id(listingId);
    }

    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
