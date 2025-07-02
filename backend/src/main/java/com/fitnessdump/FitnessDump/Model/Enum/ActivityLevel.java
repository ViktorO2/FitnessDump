package com.fitnessdump.FitnessDump.Model.Enum;

public enum ActivityLevel {
    SEDENTARY(1.2, "Little or no exercise"),
    LIGHTLY_ACTIVE(1.375, "Light exercise/sports 1-3 days/week"),
    MODERATELY_ACTIVE(1.55, "Moderate exercise/sports 3-5 days/week"),
    VERY_ACTIVE(1.725, "Hard exercise/sports 6-7 days/week"),
    EXTRA_ACTIVE(1.9, "Very hard exercise/sports & physical job");

    private final double multiplier;
    private final String description;

    ActivityLevel(double multiplier, String description) {
        this.multiplier = multiplier;
        this.description = description;
    }

    public double getMultiplier() {
        return multiplier;
    }

    public String getDescription() {
        return description;
    }
}
