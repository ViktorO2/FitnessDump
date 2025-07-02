package com.fitnessdump.FitnessDump.DTOs.Meals;

import java.util.ArrayList;
import java.util.List;

public class MealPlanDayDTO {
    private Long id;
    private Integer dayOfWeek;
    private List<MealDTO> meals = new ArrayList<>();

    public MealPlanDayDTO() {
    }

    public MealPlanDayDTO(Long id, Integer dayOfWeek, List<MealDTO> meals) {
        this.id = id;
        this.dayOfWeek = dayOfWeek;
        this.meals = meals != null ? meals : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(Integer dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public List<MealDTO> getMeals() {
        return meals;
    }

    public void setMeals(List<MealDTO> meals) {
        this.meals = meals != null ? meals : new ArrayList<>();
    }
}
