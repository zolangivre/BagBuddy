package com.bagbuddy.tripservice.config;

import com.bagbuddy.tripservice.model.UserInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;


@Converter(autoApply = false)
public class UserInfoConverter implements AttributeConverter<UserInfo, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(UserInfo userInfo) {
        try {
            return objectMapper.writeValueAsString(userInfo);
        } catch (Exception e) {
            throw new RuntimeException("Could not convert UserInfo to JSON", e);
        }
    }

    @Override
    public UserInfo convertToEntityAttribute(String dbData) {
        try {
            return objectMapper.readValue(dbData, UserInfo.class);
        } catch (Exception e) {
            throw new RuntimeException("Could not convert JSON to UserInfo", e);
        }
    }
}