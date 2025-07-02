package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.Nutrition.RecipeIngredientDTO;
import com.fitnessdump.FitnessDump.Model.Nutrition.Food;
import com.fitnessdump.FitnessDump.Model.Nutrition.Recipe;
import com.fitnessdump.FitnessDump.Model.Nutrition.RecipeIngredient;
import com.fitnessdump.FitnessDump.Repository.FoodRepository;
import com.fitnessdump.FitnessDump.Repository.RecipeIngredientRepository;
import com.fitnessdump.FitnessDump.Repository.RecipeRepository;
import com.fitnessdump.FitnessDump.Service.RecipeIngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecipeIngredientServiceImpl implements RecipeIngredientService {

    private final RecipeIngredientRepository recipeIngredientRepository;
    private final RecipeRepository recipeRepository;
    private final FoodRepository foodRepository;

    @Autowired
    public RecipeIngredientServiceImpl(
            RecipeIngredientRepository recipeIngredientRepository,
            RecipeRepository recipeRepository,
            FoodRepository foodRepository) {
        this.recipeIngredientRepository = recipeIngredientRepository;
        this.recipeRepository = recipeRepository;
        this.foodRepository = foodRepository;
    }

    private RecipeIngredientDTO convertToDTO(RecipeIngredient ingredient) {
        return new RecipeIngredientDTO(
                ingredient.getId(),
                ingredient.getFood().getId(),
                ingredient.getFood().getName(),
                ingredient.getAmount(),
                ingredient.getNote()
        );
    }

    private RecipeIngredient convertToEntity(RecipeIngredientDTO dto, Recipe recipe) {
        Food food = foodRepository.findById(dto.getFoodId())
                .orElseThrow(() -> new IllegalArgumentException("Food not found with ID: " + dto.getFoodId()));

        RecipeIngredient ingredient = new RecipeIngredient();
        ingredient.setId(dto.getId());
        ingredient.setRecipe(recipe);
        ingredient.setFood(food);
        ingredient.setAmount(dto.getAmount());
        ingredient.setNote(dto.getNote());
        return ingredient;
    }

    @Override
    @Transactional
    public RecipeIngredientDTO createRecipeIngredient(RecipeIngredientDTO ingredientDTO) {
        Recipe recipe = recipeRepository.findById(ingredientDTO.getRecipeId())
                .orElseThrow(() -> new IllegalArgumentException("Recipe not found with ID: " + ingredientDTO.getRecipeId()));

        RecipeIngredient ingredient = convertToEntity(ingredientDTO, recipe);
        RecipeIngredient savedIngredient = recipeIngredientRepository.save(ingredient);

        updateRecipeNutritionValues(recipe);

        return convertToDTO(savedIngredient);
    }

    @Override
    @Transactional
    public RecipeIngredientDTO updateRecipeIngredient(Long id, RecipeIngredientDTO ingredientDTO) {
        RecipeIngredient existingIngredient = recipeIngredientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recipe ingredient not found with ID: " + id));

        Food food = foodRepository.findById(ingredientDTO.getFoodId())
                .orElseThrow(() -> new IllegalArgumentException("Food not found with ID: " + ingredientDTO.getFoodId()));

        existingIngredient.setFood(food);
        existingIngredient.setAmount(ingredientDTO.getAmount());
        existingIngredient.setNote(ingredientDTO.getNote());

        RecipeIngredient updatedIngredient = recipeIngredientRepository.save(existingIngredient);

        updateRecipeNutritionValues(existingIngredient.getRecipe());

        return convertToDTO(updatedIngredient);
    }

    @Override
    @Transactional
    public void deleteRecipeIngredient(Long id) {
        RecipeIngredient ingredient = recipeIngredientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recipe ingredient not found with ID: " + id));

        Recipe recipe = ingredient.getRecipe();
        recipeIngredientRepository.deleteById(id);

        // Преизчисляване на хранителните стойности на рецептата
        updateRecipeNutritionValues(recipe);
    }

    @Override
    public Optional<RecipeIngredientDTO> getRecipeIngredientById(Long id) {
        return recipeIngredientRepository.findById(id).map(this::convertToDTO);
    }

    @Override
    public List<RecipeIngredientDTO> getIngredientsByRecipeId(Long recipeId) {
        return recipeIngredientRepository.findByRecipeId(recipeId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private void updateRecipeNutritionValues(Recipe recipe) {
        double totalCalories = 0;
        double totalProtein = 0;
        double totalFat = 0;
        double totalCarbs = 0;

        for (RecipeIngredient ingredient : recipe.getIngredients()) {
            double multiplier = ingredient.getAmount() / 100.0;
            totalCalories += ingredient.getFood().getKcal() * multiplier;
            totalProtein += ingredient.getFood().getProtein() * multiplier;
            totalFat += ingredient.getFood().getFat() * multiplier;
            totalCarbs += ingredient.getFood().getCarbs() * multiplier;
        }

        int servings = recipe.getServings() > 0 ? recipe.getServings() : 1;
        recipe.setCaloriesPerServing(totalCalories / servings);
        recipe.setProteinPerServing(totalProtein / servings);
        recipe.setFatPerServing(totalFat / servings);
        recipe.setCarbsPerServing(totalCarbs / servings);

        recipeRepository.save(recipe);
    }
}