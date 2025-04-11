package com.fitnessdump.FitnessDump.Model.Enum;
 public enum DifficultyLevel {
        BEGINNER("Начинаещ"),
        INTERMEDIATE("Среднонапреднал"),
        ADVANCED("Напреднал");

        private final String displayName;

        DifficultyLevel(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
}
