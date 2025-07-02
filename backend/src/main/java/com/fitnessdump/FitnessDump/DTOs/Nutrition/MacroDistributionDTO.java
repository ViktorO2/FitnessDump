package com.fitnessdump.FitnessDump.DTOs.Nutrition;

public class MacroDistributionDTO {
    private double totalCalories;
    private double proteinGrams;
    private double fatsGrams;
    private double carbsGrams;
    private double proteinPercentage;
    private double fatsPercentage;
    private double carbsPercentage;
    private double proteinCalories;
    private double fatsCalories;
    private double carbsCalories;

    public MacroDistributionDTO() {
    }

    public MacroDistributionDTO(double totalCalories, double proteinGrams, double fatsGrams, double carbsGrams, double proteinPercentage, double fatsPercentage, double carbsPercentage, double proteinCalories, double fatsCalories, double carbsCalories) {
        this.totalCalories = totalCalories;
        this.proteinGrams = proteinGrams;
        this.fatsGrams = fatsGrams;
        this.carbsGrams = carbsGrams;
        this.proteinPercentage = proteinPercentage;
        this.fatsPercentage = fatsPercentage;
        this.carbsPercentage = carbsPercentage;
        this.proteinCalories = proteinCalories;
        this.fatsCalories = fatsCalories;
        this.carbsCalories = carbsCalories;
    }

    public double getTotalCalories() {
        return totalCalories;
    }

    public void setTotalCalories(double totalCalories) {
        this.totalCalories = totalCalories;
    }

    public double getProteinGrams() {
        return proteinGrams;
    }

    public void setProteinGrams(double proteinGrams) {
        this.proteinGrams = proteinGrams;
    }

    public double getFatsGrams() {
        return fatsGrams;
    }

    public void setFatsGrams(double fatsGrams) {
        this.fatsGrams = fatsGrams;
    }

    public double getCarbsGrams() {
        return carbsGrams;
    }

    public void setCarbsGrams(double carbsGrams) {
        this.carbsGrams = carbsGrams;
    }

    public double getProteinPercentage() {
        return proteinPercentage;
    }

    public void setProteinPercentage(double proteinPercentage) {
        this.proteinPercentage = proteinPercentage;
    }

    public double getFatsPercentage() {
        return fatsPercentage;
    }

    public void setFatsPercentage(double fatsPercentage) {
        this.fatsPercentage = fatsPercentage;
    }

    public double getCarbsPercentage() {
        return carbsPercentage;
    }

    public void setCarbsPercentage(double carbsPercentage) {
        this.carbsPercentage = carbsPercentage;
    }

    public double getProteinCalories() {
        return proteinCalories;
    }

    public void setProteinCalories(double proteinCalories) {
        this.proteinCalories = proteinCalories;
    }

    public double getFatsCalories() {
        return fatsCalories;
    }

    public void setFatsCalories(double fatsCalories) {
        this.fatsCalories = fatsCalories;
    }

    public double getCarbsCalories() {
        return carbsCalories;
    }

    public void setCarbsCalories(double carbsCalories) {
        this.carbsCalories = carbsCalories;
    }
}
