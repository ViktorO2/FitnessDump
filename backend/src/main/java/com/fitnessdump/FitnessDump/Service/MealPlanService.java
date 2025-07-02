package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.Meals.MealDTO;
import com.fitnessdump.FitnessDump.DTOs.Meals.MealPlanDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.NutritionSummaryDTO;
import com.fitnessdump.FitnessDump.Model.Enum.GoalType;

import java.util.List;

public interface MealPlanService {

    MealPlanDTO createMealPlan(MealPlanDTO mealPlanDTO);
    MealPlanDTO updateMealPlan(Long id,MealPlanDTO mealPlanDTO);
    void deleteMealPlan(Long id);
    MealPlanDTO getMealPlanById(Long id);
    List<MealPlanDTO> getMealPlansByUser(Long userId);
    List<MealPlanDTO> getMealPlansByUserAndGoal(Long userId, GoalType goal);
    void addMealToDay(Long mealPlanId, Integer dayOfWeek, MealDTO mealDTO);
    void removeMealFromDay(Long mealPlanId, Integer dayOfWeek, Long mealId);
    void updateMealInDay(Long mealPlanId, Integer dayOfWeek, Long mealId, MealDTO mealDTO);
    Double calculateDayTotalCalories(Long mealPlanId, Integer dayOfWeek);
    NutritionSummaryDTO calculateMealPlanNutrition(Long mealPlanId);
}
