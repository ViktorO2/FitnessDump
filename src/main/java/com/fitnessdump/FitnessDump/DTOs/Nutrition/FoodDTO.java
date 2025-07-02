package com.fitnessdump.FitnessDump.DTOs.Nutrition;

import com.fitnessdump.FitnessDump.Model.Enum.FoodCategory;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

public class FoodDTO {
    private Long id;
    private String name;
    private String description;
    private double kcal;
    private double protein;
    private double fat;
    private double carbs;
    private FoodCategory category;

    public FoodDTO(Long id, String name, String description, double kcal, double protein, double fat, double carbs,
            FoodCategory category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.kcal = kcal;
        this.protein = protein;
        this.fat = fat;
        this.carbs = carbs;
        this.category = category;
    }

    public FoodDTO() {
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

    public double getKcal() {
        return kcal;
    }

    public void setKcal(double kcal) {
        this.kcal = kcal;
    }

    public double getProtein() {
        return protein;
    }

    public void setProtein(double protein) {
        this.protein = protein;
    }

    public double getFat() {
        return fat;
    }

    public void setFat(double fat) {
        this.fat = fat;
    }

    public double getCarbs() {
        return carbs;
    }

    public void setCarbs(double carbs) {
        this.carbs = carbs;
    }

    public FoodCategory getCategory() {
        return category;
    }

    public void setCategory(FoodCategory category) {
        this.category = category;
    }
}
