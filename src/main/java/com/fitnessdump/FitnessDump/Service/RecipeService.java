package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.Nutrition.RecipeDTO;
import com.fitnessdump.FitnessDump.Model.Enum.GoalType;

import java.util.List;
import java.util.Optional;

public interface RecipeService {
    RecipeDTO createRecipe(RecipeDTO recipeDTO);

    RecipeDTO updateRecipe(Long id, RecipeDTO recipeDTO);

    void deleteRecipe(Long id);

    Optional<RecipeDTO> getRecipeById(Long id);

    boolean existsById(Long id);

    List<RecipeDTO> getAllRecipes();

    List<RecipeDTO> getRecipesByUser(Long userId);

    List<RecipeDTO> getRecipesByGoal(GoalType goal);

    List<RecipeDTO> searchRecipes(String query);

    List<RecipeDTO> findRecipesByNutrition(
            Double minCalories,
            Double maxCalories,
            Double minProtein);
}
