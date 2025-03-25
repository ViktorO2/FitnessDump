package com.fitnessdump.FitnessDump.DTOs;

import com.fitnessdump.FitnessDump.Model.Enum.GoalType;

public class PersonalSettingsDTO {
    private double currentWeight;
    private double targetWeight;
    private double height;
    private double dailyCalories;
    private double protein;
    private double fats;
    private double carbs;
    private GoalType goal;

    public PersonalSettingsDTO(double currentWeight, double targetWeight, double height, double dailyCalories, double protein, double fats, double carbs, GoalType goal) {
        this.currentWeight = currentWeight;
        this.targetWeight = targetWeight;
        this.height = height;
        this.dailyCalories = dailyCalories;
        this.protein = protein;
        this.fats = fats;
        this.carbs = carbs;
        this.goal = goal;
    }

    public PersonalSettingsDTO() {
    }

    public double getCurrentWeight() {
        return currentWeight;
    }

    public void setCurrentWeight(double currentWeight) {
        this.currentWeight = currentWeight;
    }

    public double getTargetWeight() {
        return targetWeight;
    }

    public void setTargetWeight(double targetWeight) {
        this.targetWeight = targetWeight;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public double getDailyCalories() {
        return dailyCalories;
    }

    public void setDailyCalories(double dailyCalories) {
        this.dailyCalories = dailyCalories;
    }

    public double getProtein() {
        return protein;
    }

    public void setProtein(double protein) {
        this.protein = protein;
    }

    public double getFats() {
        return fats;
    }

    public void setFats(double fats) {
        this.fats = fats;
    }

    public double getCarbs() {
        return carbs;
    }

    public void setCarbs(double carbs) {
        this.carbs = carbs;
    }

    public GoalType getGoal() {
        return goal;
    }

    public void setGoal(GoalType goal) {
        this.goal = goal;
    }
}
