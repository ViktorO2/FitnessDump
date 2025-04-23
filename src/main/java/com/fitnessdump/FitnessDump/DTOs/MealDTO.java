package com.fitnessdump.FitnessDump.DTOs;

import com.fitnessdump.FitnessDump.Model.Enum.MealType;

import java.util.List;

public class MealDTO {
    private Long id;
    private MealType type;
    private List<MealItemDTO> items;
    private Double totalCalories;
    private Double totalProtein;
    private Double totalFats;
    private Double totalCarbs;

    public MealDTO() {
    }

    public MealDTO(Long id, MealType type, List<MealItemDTO> items, Double totalCalories, Double totalProtein, Double totalFats, Double totalCarbs) {
        this.id = id;
        this.type = type;
        this.items = items;
        this.totalCalories = totalCalories;
        this.totalProtein = totalProtein;
        this.totalFats = totalFats;
        this.totalCarbs = totalCarbs;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MealType getType() {
        return type;
    }

    public void setType(MealType type) {
        this.type = type;
    }

    public List<MealItemDTO> getItems() {
        return items;
    }

    public void setItems(List<MealItemDTO> items) {
        this.items = items;
    }

    public Double getTotalCalories() {
        return totalCalories;
    }

    public void setTotalCalories(Double totalCalories) {
        this.totalCalories = totalCalories;
    }

    public Double getTotalProtein() {
        return totalProtein;
    }

    public void setTotalProtein(Double totalProtein) {
        this.totalProtein = totalProtein;
    }

    public Double getTotalFats() {
        return totalFats;
    }

    public void setTotalFats(Double totalFats) {
        this.totalFats = totalFats;
    }

    public Double getTotalCarbs() {
        return totalCarbs;
    }

    public void setTotalCarbs(Double totalCarbs) {
        this.totalCarbs = totalCarbs;
    }
}
