package com.fitnessdump.FitnessDump.DTOs.Training;

import com.fitnessdump.FitnessDump.DTOs.Meals.MealPlanDTO;
import com.fitnessdump.FitnessDump.DTOs.Training.TrainingProgramDTO;

import java.time.LocalDate;

public class DailyPlanDTO {
    private Long id;
    private Long userId;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean active;
    private MealPlanDTO mealPlan;
    private TrainingProgramDTO trainingProgram;

    public DailyPlanDTO() {
    }

    public DailyPlanDTO(Long userId, String name, String description, LocalDate startDate, LocalDate endDate) {
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = true;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public MealPlanDTO getMealPlan() {
        return mealPlan;
    }

    public void setMealPlan(MealPlanDTO mealPlan) {
        this.mealPlan = mealPlan;
    }

    public TrainingProgramDTO getTrainingProgram() {
        return trainingProgram;
    }

    public void setTrainingProgram(TrainingProgramDTO trainingProgram) {
        this.trainingProgram = trainingProgram;
    }

    @Override
    public String toString() {
        return "DailyPlanDTO{" +
                "id=" + id +
                ", userId=" + userId +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", active=" + active +
                ", mealPlanId=" + (mealPlan != null ? mealPlan.getId() : null) +
                ", trainingProgramId=" + (trainingProgram != null ? trainingProgram.getId() : null) +
                '}';
    }
}