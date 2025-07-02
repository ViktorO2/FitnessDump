package com.fitnessdump.FitnessDump.DTOs.Nutrition;

public class NutritionSummaryDTO {
    private Double totalCalories;
    private Double totalProtein;
    private Double totalFats;
    private Double totalCarbs;

    public NutritionSummaryDTO() {
        this.totalCalories = 0.0;
        this.totalProtein = 0.0;
        this.totalFats = 0.0;
        this.totalCarbs = 0.0;
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
