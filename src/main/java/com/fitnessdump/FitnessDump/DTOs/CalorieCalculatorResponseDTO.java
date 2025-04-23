package com.fitnessdump.FitnessDump.DTOs;

import java.time.LocalDateTime;

public class CalorieCalculatorResponseDTO {
    private double bmr;
    private double tdee;
    private double dailyCalories;
    private MacroDistributionDTO macroDistribution;
    private LocalDateTime calculationDate;

    public CalorieCalculatorResponseDTO() {
        this.calculationDate = LocalDateTime.now();
    }

    public CalorieCalculatorResponseDTO(double bmr, double tdee,
                                        double dailyCalories, MacroDistributionDTO macroDistribution) {
        this();
        this.bmr = bmr;
        this.tdee = tdee;
        this.dailyCalories = dailyCalories;
        this.macroDistribution = macroDistribution;
    }

    // Гетъри и сетъри
    public double getBmr() {
        return bmr;
    }

    public void setBmr(double bmr) {
        this.bmr = bmr;
    }

    public double getTdee() {
        return tdee;
    }

    public void setTdee(double tdee) {
        this.tdee = tdee;
    }

    public double getDailyCalories() {
        return dailyCalories;
    }

    public void setDailyCalories(double dailyCalories) {
        this.dailyCalories = dailyCalories;
    }

    public MacroDistributionDTO getMacroDistribution() {
        return macroDistribution;
    }

    public void setMacroDistribution(MacroDistributionDTO macroDistribution) {
        this.macroDistribution = macroDistribution;
    }

    public LocalDateTime getCalculationDate() {
        return calculationDate;
    }

    public void setCalculationDate(LocalDateTime calculationDate) {
        this.calculationDate = calculationDate;
    }
}