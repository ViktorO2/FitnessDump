package com.fitnessdump.FitnessDump.Model;

import com.fitnessdump.FitnessDump.Model.Enum.GoalType;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "recipes")
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeIngredient> ingredients;

    private Integer servings;
    private Integer preparationTime;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User creator;

    @Enumerated(EnumType.STRING)
    private GoalType recommendedFor;
    private Double caloriesPerServing;
    private Double proteinPerServing;
    private Double fatPerServing;
    private Double carbsPerServing;

    public Recipe() {
    }

    public Recipe(Long id, String name, String description, String instructions, List<RecipeIngredient> ingredients, Integer servings, Integer preparationTime, User creator, GoalType recommendedFor, Double caloriesPerServing, Double proteinPerServing, Double fatPerServing, Double carbsPerServing) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.instructions = instructions;
        this.ingredients = ingredients;
        this.servings = servings;
        this.preparationTime = preparationTime;
        this.creator = creator;
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

    public List<RecipeIngredient> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<RecipeIngredient> ingredients) {
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

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
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
