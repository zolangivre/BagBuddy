package bagbuddy.backend.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transaction_id;

    @Column(nullable = false)
    private Integer listing_id; // Référence vers Trip

    @Column(nullable = false)
    private Integer seller_id; // Référence vers User (transporteur)

    @Column(nullable = false)
    private Integer buyer_id; // Référence vers User (expéditeur)

    @Column(nullable = false)
    private BigDecimal weight_purchased;

    @Column(nullable = false)
    private BigDecimal total_amount;

    @Column(nullable = false)
    private String st
