package com.bagbuddy.transactionservice.config;

import com.bagbuddy.transactionservice.model.ListingInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ListingInfoConverter implements AttributeConverter<ListingInfo, String> {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(ListingInfo listingInfo) {
        try {
            return objectMapper.writeValueAsString(listingInfo);
        } catch (Exception e) {
            throw new RuntimeException("Could not convert ListingInfo to JSON", e);
        }
    }

    @Override
    public ListingInfo convertToEntityAttribute(String dbData) {
        try {
            return objectMapper.readValue(dbData, ListingInfo.class);
        } catch (Exception e) {
            throw new RuntimeException("Could not convert JSON to ListingInfo", e);
        }
    }
}