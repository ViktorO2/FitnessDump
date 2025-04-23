package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.CalorieCalculatorRequestDTO;
import com.fitnessdump.FitnessDump.DTOs.CalorieCalculatorResponseDTO;
import com.fitnessdump.FitnessDump.DTOs.MealPlanDTO;

public interface CalorieCalculatorService {
    CalorieCalculatorResponseDTO calculateNutrition(CalorieCalculatorRequestDTO request);
    CalorieCalculatorResponseDTO calculateAndSaveToPersonalSettings(Long userId,CalorieCalculatorRequestDTO request);
    MealPlanDTO generateMealPlan(Long userId,CalorieCalculatorRequestDTO request);
}
