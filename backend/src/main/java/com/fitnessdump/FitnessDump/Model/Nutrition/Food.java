package com.fitnessdump.FitnessDump.Model.Nutrition;

import com.fitnessdump.FitnessDump.Model.Enum.FoodCategory;
import jakarta.persistence.*;

@Entity
@Table(name = "foods")
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private double kcal;

    @Column(nullable = false)
    private double protein;

    @Column(nullable = false)
    private double fat;

    @Column(nullable = false)
    private double carbs;

    @Enumerated(EnumType.STRING)
    private FoodCategory category;

    public Food(Long id, String name, String description, double kcal, double protein, double fat, double carbs,
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

    public Food() {
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
