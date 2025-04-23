package com.fitnessdump.FitnessDump.DTOs;

public class MealItemDTO {
    private Long id;
    private Long foodId;
    private String foodName;
    private Long recipeId;
    private String recipeName;
    private Double amount;
    private Double calories;
    private Double protein;
    private Double fats;
    private Double carbs;

    public MealItemDTO(Long id, Long foodId, String foodName, Long recipeId, String recipeName, Double amount, Double calories, Double protein, Double fats, Double carbs) {
        this.id = id;
        this.foodId = foodId;
        this.foodName = foodName;
        this.recipeId = recipeId;
        this.recipeName = recipeName;
        this.amount = amount;
        this.calories = calories;
        this.protein = protein;
        this.fats = fats;
        this.carbs = carbs;
    }

    public MealItemDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFoodId() {
        return foodId;
    }

    public void setFoodId(Long foodId) {
        this.foodId = foodId;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public Long getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(Long recipeId) {
        this.recipeId = recipeId;
    }

    public String getRecipeName() {
        return recipeName;
    }

    public void setRecipeName(String recipeName) {
        this.recipeName = recipeName;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getCalories() {
        return calories;
    }

    public void setCalories(Double calories) {
        this.calories = calories;
    }

    public Double getProtein() {
        return protein;
    }

    public void setProtein(Double protein) {
        this.protein = protein;
    }

    public Double getFats() {
        return fats;
    }

    public void setFats(Double fats) {
        this.fats = fats;
    }

    public Double getCarbs() {
        return carbs;
    }

    public void setCarbs(Double carbs) {
        this.carbs = carbs;
    }
}
