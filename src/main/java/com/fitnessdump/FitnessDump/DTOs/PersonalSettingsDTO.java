package com.fitnessdump.FitnessDump.DTOs;

import com.fitnessdump.FitnessDump.Model.Enum.ActivityLevel;
import com.fitnessdump.FitnessDump.Model.Enum.Gender;
import com.fitnessdump.FitnessDump.Model.Enum.GoalType;
import java.time.LocalDateTime;

public class PersonalSettingsDTO {
    private Long id;
    private Long userId;
    private double currentWeight;
    private double targetWeight;
    private double height;
    private double dailyCalories;
    private double protein;
    private double fats;
    private double carbs;
    private GoalType goal;
    private Gender gender;
    private Integer age;
    private ActivityLevel activityLevel;
    private Double bmr;
    private Double tdee;
    private LocalDateTime lastCalculation;

    public PersonalSettingsDTO() {
    }

    // Конструктор с всички полета
    public PersonalSettingsDTO(Long id, Long userId, double currentWeight, double targetWeight,
                               double height, double dailyCalories, double protein, double fats,
                               double carbs, GoalType goal, Gender gender, Integer age,
                               ActivityLevel activityLevel, Double bmr, Double tdee,
                               LocalDateTime lastCalculation) {
        this.id = id;
        this.userId = userId;
        this.currentWeight = currentWeight;
        this.targetWeight = targetWeight;
        this.height = height;
        this.dailyCalories = dailyCalories;
        this.protein = protein;
        this.fats = fats;
        this.carbs = carbs;
        this.goal = goal;
        this.gender = gender;
        this.age = age;
        this.activityLevel = activityLevel;
        this.bmr = bmr;
        this.tdee = tdee;
        this.lastCalculation = lastCalculation;
    }

    // Добавяме getters и setters за новите полета
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

    // Съществуващи getters и setters
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

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public ActivityLevel getActivityLevel() {
        return activityLevel;
    }

    public void setActivityLevel(ActivityLevel activityLevel) {
        this.activityLevel = activityLevel;
    }

    public Double getBmr() {
        return bmr;
    }

    public void setBmr(Double bmr) {
        this.bmr = bmr;
    }

    public Double getTdee() {
        return tdee;
    }

    public void setTdee(Double tdee) {
        this.tdee = tdee;
    }

    public LocalDateTime getLastCalculation() {
        return lastCalculation;
    }

    public void setLastCalculation(LocalDateTime lastCalculation) {
        this.lastCalculation = lastCalculation;
    }
}