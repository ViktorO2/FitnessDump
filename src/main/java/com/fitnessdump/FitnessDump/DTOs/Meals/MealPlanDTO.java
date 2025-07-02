package com.fitnessdump.FitnessDump.DTOs.Meals;

import com.fitnessdump.FitnessDump.Model.Enum.GoalType;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class MealPlanDTO {
    private Long id;
    private Long userId;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private GoalType goal;
    private Double targetCalories;
    private Double targetProtein;
    private Double targetFats;
    private Double targetCarbs;
    private List<MealPlanDayDTO> days = new ArrayList<>();

    public MealPlanDTO() {

    }

    public MealPlanDTO(Long id, Long userId, String name, String description, LocalDate startDate, LocalDate endDate,
            GoalType goal, Double targetCalories, Double targetProtein, Double targetFats, Double targetCarbs,
            List<MealPlanDayDTO> days) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.goal = goal;
        this.targetCalories = targetCalories;
        this.targetProtein = targetProtein;
        this.targetFats = targetFats;
        this.targetCarbs = targetCarbs;
        this.days = days != null ? days : new ArrayList<>();
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

    public GoalType getGoal() {
        return goal;
    }

    public void setGoal(GoalType goal) {
        this.goal = goal;
    }

    public Double getTargetCalories() {
        return targetCalories;
    }

    public void setTargetCalories(Double targetCalories) {
        this.targetCalories = targetCalories;
    }

    public Double getTargetProtein() {
        return targetProtein;
    }

    public void setTargetProtein(Double targetProtein) {
        this.targetProtein = targetProtein;
    }

    public Double getTargetFats() {
        return targetFats;
    }

    public void setTargetFats(Double targetFats) {
        this.targetFats = targetFats;
    }

    public Double getTargetCarbs() {
        return targetCarbs;
    }

    public void setTargetCarbs(Double targetCarbs) {
        this.targetCarbs = targetCarbs;
    }

    public List<MealPlanDayDTO> getDays() {
        return days;
    }

    public void setDays(List<MealPlanDayDTO> days) {
        this.days = days != null ? days : new ArrayList<>();
    }

}
