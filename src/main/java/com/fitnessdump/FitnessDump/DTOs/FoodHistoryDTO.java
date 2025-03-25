package com.fitnessdump.FitnessDump.DTOs;

import java.time.LocalDate;
import java.util.List;

public class FoodHistoryDTO {
    private Long id;
    private Long userId;
    private LocalDate date;
    private List<Long> foodIds;

    public FoodHistoryDTO(Long id, Long userId, LocalDate date, List<Long> foodIds) {
        this.id = id;
        this.userId = userId;
        this.date = date;
        this.foodIds = foodIds;
    }

    public FoodHistoryDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public List<Long> getFoodIds() {
        return foodIds;
    }

    public void setFoodIds(List<Long> foodIds) {
        this.foodIds = foodIds;
    }
}
