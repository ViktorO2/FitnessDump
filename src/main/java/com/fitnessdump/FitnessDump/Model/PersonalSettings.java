package com.fitnessdump.FitnessDump.Model;

import com.fitnessdump.FitnessDump.Model.Enum.GoalType;
import jakarta.persistence.*;

@Entity
@Table(name = "personal_settings")
public class PersonalSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    public User user;

    private double currentWeight;
    private double targetWeight;
    private double height;
    private double dailyCalories;
    private double protein;
    private double fats;
    private double carbs;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GoalType goal;

    public PersonalSettings(User user, double currentWeight, double targetWeight, double height,
                            double dailyCalories, double protein, double fats, double carbs, GoalType goal) {

        this.user = user;
        this.currentWeight = currentWeight;
        this.targetWeight = targetWeight;
        this.height = height;
        this.dailyCalories = dailyCalories;
        this.protein = protein;
        this.fats = fats;
        this.carbs = carbs;
        this.goal = goal;
    }

    public PersonalSettings() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public double getCurrentWeight() {
        return currentWeight;
    }

    public void setCurrentWeight(double currentWeight) {
        this.currentWeight = currentWeight;
    }

    public double getTargetWeight() {
        return targetWeight;
    }

    public void setTargetWeight(double targetWeight) {
        this.targetWeight = targetWeight;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public double getDailyCalories() {
        return dailyCalories;
    }

    public void setDailyCalories(double dailyCalories) {
        this.dailyCalories = dailyCalories;
    }

    public double getProtein() {
        return protein;
    }

    public void setProtein(double protein) {
        this.protein = protein;
    }

    public double getFats() {
        return fats;
    }

    public void setFats(double fats) {
        this.fats = fats;
    }

    public double getCarbs() {
        return carbs;
    }

    public void setCarbs(double carbs) {
        this.carbs = carbs;
    }

    public GoalType getGoal() {
        return goal;
    }

    public void setGoal(GoalType goal) {
        this.goal = goal;
    }
}
