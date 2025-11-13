package bagbuddy.backend.resolvers;

import bagbuddy.backend.models.Transaction;
import bagbuddy.backend.services.TransactionService;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TransactionResolver implements GraphQLQueryResolver, GraphQLMutationResolver {

    private final TransactionService transactionService;

    public TransactionResolver(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // Queries
    public List<Transaction> transactions() {
        return transactionService.getAllTransactions();
    }

    public Transaction transaction(Long transaction_id) {
        return transactionService.getTransactionById(transaction_id).orElse(null);
    }

    public List<Transaction> transactionsBySellerId(Integer seller_id) {
        return transactionService.getTransactionsBySellerId(seller_id);
    }

    public List<Transaction> transactionsByBuyerId(Integer buyer_id) {
        return transactionService.getTransactionsByBuyerId(buyer_id);
    }

    public List<Transaction> transactionsByListingId(Integer listing_id) {
        return transactionService.getTransactionsByListingId(listing_id);
    }

    // Mutation
    public Transaction createTransaction(Integer listing_id, Integer seller_id, Integer buyer_id,
                                         java.math.BigDecimal weight_purchased,
                                         java.math.BigDecimal total_amount,
                                         String status, String payment_method) {

        Transaction transaction = new Transaction();
        transaction.setListing_id(listing_id);
        transaction.setSeller_id(seller_id);
        transaction.setBuyer_id(buyer_id);
        transaction.setWeight_purchased(weight_purchased);
        transaction.setTotal_amount(total_amount);
        transaction.setStatus(status);
        transaction.setPayment_method(payment_method);

        return transactionService.createTransaction(transaction);
    }
}
