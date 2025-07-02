package com.fitnessdump.FitnessDump.Model.Enum;

public enum GoalType {
    LOSE_WEIGHT(-500, 2.2, 0.25, "Weight Loss"),
    MAINTAIN_WEIGHT(0, 2.0, 0.25, "Maintenance"),
    GAIN_WEIGHT(300, 2.4, 0.25, "Muscle Gain");

    private final double calorieAdjustment;
    private final double proteinMultiplier;
    private final double fatRatio;
    private final String displayName;

    GoalType(double calorieAdjustment, double proteinMultiplier,
             double fatRatio, String displayName) {
        this.calorieAdjustment = calorieAdjustment;
        this.proteinMultiplier = proteinMultiplier;
        this.fatRatio = fatRatio;
        this.displayName = displayName;
    }

    public double getCalorieAdjustment() {
        return calorieAdjustment;
    }

    public double getProteinMultiplier() {
        return proteinMultiplier;
    }

    public double getFatRatio() {
        return fatRatio;
    }

    public String getDisplayName() {
        return displayName;
    }
}
