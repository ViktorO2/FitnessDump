package com.fitnessdump.FitnessDump.Model.Enum;

public enum ProgramGoal {
    MUSCLE_GAIN("Мускулна маса"),
    WEIGHT_LOSS("Отслабване"),
    ENDURANCE("Издръжливост"),
    STRENGTH("Сила"),
    FLEXIBILITY("Гъвкавост");

    private final String displayName;

    ProgramGoal(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}