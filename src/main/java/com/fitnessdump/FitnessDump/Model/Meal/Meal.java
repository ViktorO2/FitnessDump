package com.fitnessdump.FitnessDump.Model.Meal;

import com.fitnessdump.FitnessDump.Model.Enum.MealType;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "meals")
public class Meal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "meal_plan_day_id", nullable = false)
    private MealPlanDay day;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MealType type;

    @OneToMany(mappedBy = "meal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MealItem> items;

    // Constructors
    public Meal() {}

    public Meal(Long id, MealPlanDay day, MealType type, List<MealItem> items) {
        this.id = id;
        this.day = day;
        this.type = type;
        this.items = items;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MealPlanDay getDay() {
        return day;
    }

    public void setDay(MealPlanDay day) {
        this.day = day;
    }

    public MealType getType() {
        return type;
    }

    public void setType(MealType type) {
        this.type = type;
    }

    public List<MealItem> getItems() {
        return items;
    }

    public void setItems(List<MealItem> items) {
        this.items = items;
    }
}
