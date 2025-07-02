package com.fitnessdump.FitnessDump.DTOs.Nutrition;

public class RecipeIngredientDTO {
    private Long id;
    private Long recipeId;
    private Long foodId;
    private String foodName;
    private Double amount;
    private String note;


    public RecipeIngredientDTO() {
    }

    public RecipeIngredientDTO(Long id, Long foodId, String foodName, Double amount, String note) {
        this.id = id;
        this.foodId = foodId;
        this.foodName = foodName;
        this.amount = amount;
        this.note = note;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(Long recipeId) {
        this.recipeId = recipeId;
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

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}