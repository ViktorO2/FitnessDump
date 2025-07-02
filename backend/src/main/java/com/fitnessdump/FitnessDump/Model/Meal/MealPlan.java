package com.fitnessdump.FitnessDump.Model.Meal;

import com.fitnessdump.FitnessDump.Model.Enum.GoalType;
import com.fitnessdump.FitnessDump.Model.Users.User;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meal_plans")
public class MealPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GoalType goal;

    private Double targetCalories;
    private Double targetProtein;
    private Double targetFats;
    private Double targetCarbs;

    @OneToMany(mappedBy = "mealPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MealPlanDay> days = new ArrayList<>();

    public MealPlan() {
    }

    public MealPlan(Long id, User user, String name, String description, LocalDate startDate, LocalDate endDate,
            GoalType goal, Double targetCalories, Double targetProtein, Double targetFats, Double targetCarbs,
            List<MealPlanDay> days) {
        this.id = id;
        this.user = user;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.goal = goal;
        this.targetCalories = targetCalories;
        this.targetProtein = targetProtein;
        this.targetFats = targetFats;
        this.targetCarbs = targetCarbs;
        this.days = days != null ? days : new ArrayList<>();
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

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public GoalType getGoal() {
        return goal;
    }

    public void setGoal(GoalType goal) {
        this.goal = goal;
    }

    public Double getTargetCalories() {
        return targetCalories;
    }

    public void setTargetCalories(Double targetCalories) {
        this.targetCalories = targetCalories;
    }

    public Double getTargetProtein() {
        return targetProtein;
    }

    public void setTargetProtein(Double targetProtein) {
        this.targetProtein = targetProtein;
    }

    public Double getTargetFats() {
        return targetFats;
    }

    public void setTargetFats(Double targetFats) {
        this.targetFats = targetFats;
    }

    public Double getTargetCarbs() {
        return targetCarbs;
    }

    public void setTargetCarbs(Double targetCarbs) {
        this.targetCarbs = targetCarbs;
    }

    public List<MealPlanDay> getDays() {
        return days;
    }

    public void setDays(List<MealPlanDay> days) {
        this.days = days != null ? days : new ArrayList<>();
    }
}