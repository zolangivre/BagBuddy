package com.bagbuddy.transactionservice.model;

import com.bagbuddy.transactionservice.config.ListingInfoConverter;
import com.bagbuddy.transactionservice.config.UserInfoConverter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_record")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Convert(converter = ListingInfoConverter.class)
    @Column(columnDefinition = "jsonb")
    private ListingInfo listingInfo;

    private Long listingId;

    @Convert(converter = UserInfoConverter.class)
    @Column(columnDefinition = "jsonb")
    private UserInfo buyerInfo;

    private String buyerId;
    private String sellerId;

    // UI helpers
    private String sellerStatus;
    private String buyerStatus;

    // Tarification/poids
    private BigDecimal weight;        // kg
    private BigDecimal total;         // total = weight * pricePerKg

    private Boolean sellerReview = false;
    private Boolean buyerReview = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters/Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getListingId() {
        return listingId;
    }

    public void setListingId(Long listingId) {
        this.listingId = listingId;
    }

    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public String getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(String buyerId) {
        this.buyerId = buyerId;
    }

    public UserInfo getBuyerInfo() {
        return buyerInfo;
    }

    public void setBuyerInfo(UserInfo buyerInfo) {
        this.buyerInfo = buyerInfo;
    }

    public String getSellerStatus() {
        return sellerStatus;
    }

    public void setSellerStatus(String sellerStatus) {
        this.sellerStatus = sellerStatus;
    }

    public String getBuyerStatus() {
        return buyerStatus;
    }

    public void setBuyerStatus(String buyerStatus) {
        this.buyerStatus = buyerStatus;
    }

    public BigDecimal getWeight() {
        return weight;
    }

    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ListingInfo getListingInfo() {
        return listingInfo;
    }

    public void setListingInfo(ListingInfo listingInfo) {
        this.listingInfo = listingInfo;
    }

    public Boolean getSellerReview() {
        return sellerReview;
    }

    public void setSellerReview(Boolean sellerReview) {
        this.sellerReview = sellerReview;
    }

    public Boolean getBuyerReview() {
        return buyerReview;
    }

    public void setBuyerReview(Boolean buyerReview) {
        this.buyerReview = buyerReview;
    }
}
