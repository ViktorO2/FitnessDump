package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.Meals.MealPlanDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.CalorieCalculatorRequestDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.CalorieCalculatorResponseDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.MealPlanGenerationConfigDTO;
import com.fitnessdump.FitnessDump.DTOs.Training.TrainingProgramDTO;

public interface CalorieCalculatorService {

    CalorieCalculatorResponseDTO calculateNutrition(CalorieCalculatorRequestDTO request);

    CalorieCalculatorResponseDTO calculateAndSaveToPersonalSettings(Long userId, CalorieCalculatorRequestDTO request);

    MealPlanDTO generateMealPlan(Long userId, CalorieCalculatorRequestDTO request);

    TrainingProgramDTO generateTrainingProgram(Long userId, CalorieCalculatorRequestDTO request);

    void generateDailyPlan(Long userId, CalorieCalculatorRequestDTO request);

    MealPlanDTO generateSmartMealPlan(Long userId, CalorieCalculatorRequestDTO request, boolean includeWorkoutDays);

    // New configurable methods
    MealPlanDTO generateMealPlanWithConfig(Long userId, CalorieCalculatorRequestDTO request,
            MealPlanGenerationConfigDTO config);

    MealPlanDTO generateSmartMealPlanWithConfig(Long userId, CalorieCalculatorRequestDTO request,
            MealPlanGenerationConfigDTO config);
}
