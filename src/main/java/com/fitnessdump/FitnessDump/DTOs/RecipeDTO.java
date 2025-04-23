package com.fitnessdump.FitnessDump.DTOs;

import com.fitnessdump.FitnessDump.Model.Enum.GoalType;
import java.util.List;

public class RecipeDTO {
    private Long id;
    private String name;
    private String description;
    private String instructions;
    private List<RecipeIngredientDTO> ingredients;
    private Integer servings;
    private Integer preparationTime;
    private Long creatorId;
    private GoalType recommendedFor;
    private Double caloriesPerServing;
    private Double proteinPerServing;
    private Double fatPerServing;
    private Double carbsPerServing;

    public RecipeDTO() {

    }

    public RecipeDTO(Long id, String name, String description, String instructions, List<RecipeIngredientDTO> ingredients, Integer servings, Integer preparationTime, Long creatorId, GoalType recommendedFor, Double caloriesPerServing, Double proteinPerServing, Double fatPerServing, Double carbsPerServing) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.instructions = instructions;
        this.ingredients = ingredients;
        this.servings = servings;
        this.preparationTime = preparationTime;
        this.creatorId = creatorId;
        this.recommendedFor = recommendedFor;
        this.caloriesPerServing = caloriesPerServing;
        this.proteinPerServing = proteinPerServing;
        this.fatPerServing = fatPerServing;
        this.carbsPerServing = carbsPerServing;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public List<RecipeIngredientDTO> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<RecipeIngredientDTO> ingredients) {
        this.ingredients = ingredients;
    }

    public Integer getServings() {
        return servings;
    }

    public void setServings(Integer servings) {
        this.servings = servings;
    }

    public Integer getPreparationTime() {
        return preparationTime;
    }

    public void setPreparationTime(Integer preparationTime) {
        this.preparationTime = preparationTime;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public GoalType getRecommendedFor() {
        return recommendedFor;
    }

    public void setRecommendedFor(GoalType recommendedFor) {
        this.recommendedFor = recommendedFor;
    }

    public Double getCaloriesPerServing() {
        return caloriesPerServing;
    }

    public void setCaloriesPerServing(Double caloriesPerServing) {
        this.caloriesPerServing = caloriesPerServing;
    }

    public Double getProteinPerServing() {
        return proteinPerServing;
    }

    public void setProteinPerServing(Double proteinPerServing) {
        this.proteinPerServing = proteinPerServing;
    }

    public Double getFatPerServing() {
        return fatPerServing;
    }

    public void setFatPerServing(Double fatPerServing) {
        this.fatPerServing = fatPerServing;
    }

    public Double getCarbsPerServing() {
        return carbsPerServing;
    }

    public void setCarbsPerServing(Double carbsPerServing) {
        this.carbsPerServing = carbsPerServing;
    }
}