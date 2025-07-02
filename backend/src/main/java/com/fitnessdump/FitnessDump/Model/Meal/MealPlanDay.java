package com.fitnessdump.FitnessDump.Model.Meal;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meal_plan_days")
public class MealPlanDay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "meal_plan_id", nullable = false)
    private MealPlan mealPlan;

    @Column(nullable = false)
    private Integer dayOfWeek;

    @OneToMany(mappedBy = "day", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Meal> meals = new ArrayList<>();

    public MealPlanDay() {
    }

    public MealPlanDay(Long id, MealPlan mealPlan, Integer dayOfWeek, List<Meal> meals) {
        this.id = id;
        this.mealPlan = mealPlan;
        this.dayOfWeek = dayOfWeek;
        this.meals = meals != null ? meals : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MealPlan getMealPlan() {
        return mealPlan;
    }

    public void setMealPlan(MealPlan mealPlan) {
        this.mealPlan = mealPlan;
    }

    public Integer getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(Integer dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public List<Meal> getMeals() {
        return meals;
    }

    public void setMeals(List<Meal> meals) {
        this.meals = meals != null ? meals : new ArrayList<>();
    }
}
