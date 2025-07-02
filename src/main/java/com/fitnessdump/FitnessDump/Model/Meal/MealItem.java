package com.fitnessdump.FitnessDump.Model.Meal;

import com.fitnessdump.FitnessDump.Model.Nutrition.Food;
import com.fitnessdump.FitnessDump.Model.Nutrition.Recipe;
import jakarta.persistence.*;

@Entity
@Table(name = "meal_items")
public class MealItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "meal_id", nullable = false)
    private Meal meal;

    @ManyToOne
    @JoinColumn(name = "food_id")
    private Food food;

    @ManyToOne
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;

    @Column(nullable = false)
    private Double amount;

    // Constructors
    public MealItem() {}

    public MealItem(Long id, Meal meal, Food food, Recipe recipe, Double amount) {
        this.id = id;
        this.meal = meal;
        this.food = food;
        this.recipe = recipe;
        this.amount = amount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Meal getMeal() {
        return meal;
    }

    public void setMeal(Meal meal) {
        this.meal = meal;
    }

    public Food getFood() {
        return food;
    }

    public void setFood(Food food) {
        this.food = food;
    }

    public Recipe getRecipe() {
        return recipe;
    }

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
