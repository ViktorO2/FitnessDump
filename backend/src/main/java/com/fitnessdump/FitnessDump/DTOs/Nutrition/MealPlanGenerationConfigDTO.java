package com.fitnessdump.FitnessDump.DTOs.Nutrition;

import com.fitnessdump.FitnessDump.Model.Enum.GoalType;
import com.fitnessdump.FitnessDump.Model.Enum.MealType;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

public class MealPlanGenerationConfigDTO {
    private String planName;
    private String planDescription;
    private LocalDate startDate;
    private LocalDate endDate;
    private GoalType goal;
    private Integer durationWeeks;
    private Boolean includeWorkoutDays;
    private Double workoutDayCalorieMultiplier;
    private Map<MealType, Double> mealDistribution;
    private Map<MealType, Double> workoutDayMealDistribution;
    private Boolean useSmartGeneration;
    private Boolean includeSnacks;
    private Integer mealsPerDay;
    private Double proteinPercentage;
    private Double carbsPercentage;
    private Double fatsPercentage;

    public MealPlanGenerationConfigDTO() {
        // Default values
        this.planName = "Generated Meal Plan";
        this.planDescription = "Automatically generated based on your goals";
        this.startDate = LocalDate.now();
        this.durationWeeks = 1;
        this.includeWorkoutDays = true;
        this.workoutDayCalorieMultiplier = 1.1; // 10% more calories on workout days
        this.useSmartGeneration = true;
        this.includeSnacks = false;
        this.mealsPerDay = 3;
        this.proteinPercentage = 0.25; // 25% protein
        this.carbsPercentage = 0.45; // 45% carbs
        this.fatsPercentage = 0.30; // 30% fats

        // Default meal distribution for regular days
        this.mealDistribution = new HashMap<>();
        this.mealDistribution.put(MealType.BREAKFAST, 0.30); // 30% for breakfast
        this.mealDistribution.put(MealType.LUNCH, 0.40); // 40% for lunch
        this.mealDistribution.put(MealType.DINNER, 0.30); // 30% for dinner

        // Default meal distribution for workout days
        this.workoutDayMealDistribution = new HashMap<>();
        this.workoutDayMealDistribution.put(MealType.BREAKFAST, 0.25); // 25% for breakfast
        this.workoutDayMealDistribution.put(MealType.LUNCH, 0.35); // 35% for lunch
        this.workoutDayMealDistribution.put(MealType.DINNER, 0.40); // 40% for dinner (after workout)
    }

    // Getters and Setters
    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getPlanDescription() {
        return planDescription;
    }

    public void setPlanDescription(String planDescription) {
        this.planDescription = planDescription;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public GoalType getGoal() {
        return goal;
    }

    public void setGoal(GoalType goal) {
        this.goal = goal;
    }

    public Integer getDurationWeeks() {
        return durationWeeks;
    }

    public void setDurationWeeks(Integer durationWeeks) {
        this.durationWeeks = durationWeeks;
    }

    public Boolean getIncludeWorkoutDays() {
        return includeWorkoutDays;
    }

    public void setIncludeWorkoutDays(Boolean includeWorkoutDays) {
        this.includeWorkoutDays = includeWorkoutDays;
    }

    public Double getWorkoutDayCalorieMultiplier() {
        return workoutDayCalorieMultiplier;
    }

    public void setWorkoutDayCalorieMultiplier(Double workoutDayCalorieMultiplier) {
        this.workoutDayCalorieMultiplier = workoutDayCalorieMultiplier;
    }

    public Map<MealType, Double> getMealDistribution() {
        return mealDistribution;
    }

    public void setMealDistribution(Map<MealType, Double> mealDistribution) {
        this.mealDistribution = mealDistribution;
    }

    public Map<MealType, Double> getWorkoutDayMealDistribution() {
        return workoutDayMealDistribution;
    }

    public void setWorkoutDayMealDistribution(Map<MealType, Double> workoutDayMealDistribution) {
        this.workoutDayMealDistribution = workoutDayMealDistribution;
    }

    public Boolean getUseSmartGeneration() {
        return useSmartGeneration;
    }

    public void setUseSmartGeneration(Boolean useSmartGeneration) {
        this.useSmartGeneration = useSmartGeneration;
    }

    public Boolean getIncludeSnacks() {
        return includeSnacks;
    }

    public void setIncludeSnacks(Boolean includeSnacks) {
        this.includeSnacks = includeSnacks;
    }

    public Integer getMealsPerDay() {
        return mealsPerDay;
    }

    public void setMealsPerDay(Integer mealsPerDay) {
        this.mealsPerDay = mealsPerDay;
    }

    public Double getProteinPercentage() {
        return proteinPercentage;
    }

    public void setProteinPercentage(Double proteinPercentage) {
        this.proteinPercentage = proteinPercentage;
    }

    public Double getCarbsPercentage() {
        return carbsPercentage;
    }

    public void setCarbsPercentage(Double carbsPercentage) {
        this.carbsPercentage = carbsPercentage;
    }

    public Double getFatsPercentage() {
        return fatsPercentage;
    }

    public void setFatsPercentage(Double fatsPercentage) {
        this.fatsPercentage = fatsPercentage;
    }
}