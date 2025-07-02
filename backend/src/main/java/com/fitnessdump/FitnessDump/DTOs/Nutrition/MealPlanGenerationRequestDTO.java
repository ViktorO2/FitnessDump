package com.fitnessdump.FitnessDump.DTOs.Nutrition;

public class MealPlanGenerationRequestDTO {
    private CalorieCalculatorRequestDTO request;
    private MealPlanGenerationConfigDTO config;

    public MealPlanGenerationRequestDTO() {
    }

    public MealPlanGenerationRequestDTO(CalorieCalculatorRequestDTO request, MealPlanGenerationConfigDTO config) {
        this.request = request;
        this.config = config;
    }

    public CalorieCalculatorRequestDTO getRequest() {
        return request;
    }

    public void setRequest(CalorieCalculatorRequestDTO request) {
        this.request = request;
    }

    public MealPlanGenerationConfigDTO getConfig() {
        return config;
    }

    public void setConfig(MealPlanGenerationConfigDTO config) {
        this.config = config;
    }
}