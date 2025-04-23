package com.fitnessdump.FitnessDump.DTOs;

import com.fitnessdump.FitnessDump.Model.Enum.ActivityLevel;
import com.fitnessdump.FitnessDump.Model.Enum.Gender;
import com.fitnessdump.FitnessDump.Model.Enum.GoalType;
import jakarta.validation.constraints.*;

public class CalorieCalculatorRequestDTO {
    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be positive")
    @Max(value = 300, message = "Weight cannot exceed 300 kg")
    private Double weight;

    @NotNull(message = "Height is required")
    @Positive(message = "Height must be positive")
    @Max(value = 250, message = "Height cannot exceed 250 cm")
    private Double height;

    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 100, message = "Age cannot exceed 100")
    private Integer age;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Activity level is required")
    private ActivityLevel activityLevel;

    @NotNull(message = "Goal is required")
    private GoalType goal;


    public CalorieCalculatorRequestDTO() {}

    public CalorieCalculatorRequestDTO(Double weight, Double height, Integer age,
                                       Gender gender, ActivityLevel activityLevel, GoalType goal) {
        this.weight = weight;
        this.height = height;
        this.age = age;
        this.gender = gender;
        this.activityLevel = activityLevel;
        this.goal = goal;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public ActivityLevel getActivityLevel() {
        return activityLevel;
    }

    public void setActivityLevel(ActivityLevel activityLevel) {
        this.activityLevel = activityLevel;
    }

    public GoalType getGoal() {
        return goal;
    }

    public void setGoal(GoalType goal) {
        this.goal = goal;
    }
}