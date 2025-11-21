package com.bagbuddy.transactionservice.model;

public class ListingInfo {
    private String id;
    private UserInfo userInfo; // infos du seller
    private String departureAirport;
    private String arrivalAirport;
    private String departureDate;
    private String arrivalDate;
    private double totalWeightAvailable;
    private double remainingWeight;
    private double pricePerKg;
    private String conditions;
    private String createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public UserInfo getUserInfo() { return userInfo; }
    public void setUserInfo(UserInfo userInfo) { this.userInfo = userInfo; }

    public String getDepartureAirport() { return departureAirport; }
    public void setDepartureAirport(String departureAirport) { this.departureAirport = departureAirport; }

    public String getArrivalAirport() { return arrivalAirport; }
    public void setArrivalAirport(String arrivalAirport) { this.arrivalAirport = arrivalAirport; }

    public String getDepartureDate() { return departureDate; }
    public void setDepartureDate(String departureDate) { this.departureDate = departureDate; }

    public String getArrivalDate() { return arrivalDate; }
    public void setArrivalDate(String arrivalDate) { this.arrivalDate = arrivalDate; }

    public double getTotalWeightAvailable() { return totalWeightAvailable; }
    public void setTotalWeightAvailable(double totalWeightAvailable) { this.totalWeightAvailable = totalWeightAvailable; }

    public double getRemainingWeight() { return remainingWeight; }
    public void setRemainingWeight(double remainingWeight) { this.remainingWeight = remainingWeight; }

    public double getPricePerKg() { return pricePerKg; }
    public void setPricePerKg(double pricePerKg) { this.pricePerKg = pricePerKg; }

    public String getConditions() { return conditions; }
    public void setConditions(String conditions) { this.conditions = conditions; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}