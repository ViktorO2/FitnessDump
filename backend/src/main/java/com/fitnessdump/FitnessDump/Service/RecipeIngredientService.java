package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.Nutrition.RecipeIngredientDTO;

import java.util.List;
import java.util.Optional;

public interface RecipeIngredientService {
    RecipeIngredientDTO createRecipeIngredient(RecipeIngredientDTO ingredientDTO);
    RecipeIngredientDTO updateRecipeIngredient(Long id, RecipeIngredientDTO ingredientDTO);
    void deleteRecipeIngredient(Long id);
    Optional<RecipeIngredientDTO> getRecipeIngredientById(Long id);
    List<RecipeIngredientDTO> getIngredientsByRecipeId(Long recipeId);
}
