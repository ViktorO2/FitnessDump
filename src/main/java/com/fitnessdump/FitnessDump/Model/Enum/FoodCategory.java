package com.fitnessdump.FitnessDump.Model.Enum;

public enum FoodCategory {
    FRUITS("Fruits"),
    VEGETABLES("Vegetables"),
    GRAINS("Grains"),
    PROTEIN("Protein"),
    DAIRY("Dairy"),
    FATS("Fats"),
    SWEETS("Sweets"),
    BEVERAGES("Beverages"),
    NUTS_SEEDS("Nuts & Seeds"),
    LEGUMES("Legumes"),
    OTHER("Other");

    private final String displayName;

    FoodCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}