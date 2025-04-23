package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.RecipeDTO;
import com.fitnessdump.FitnessDump.DTOs.RecipeIngredientDTO;
import com.fitnessdump.FitnessDump.Model.Enum.GoalType;
import com.fitnessdump.FitnessDump.Model.Recipe;
import com.fitnessdump.FitnessDump.Model.User;
import com.fitnessdump.FitnessDump.Repository.RecipeRepository;
import com.fitnessdump.FitnessDump.Repository.UserRepository;
import com.fitnessdump.FitnessDump.Service.RecipeService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecipeServiceImpl implements RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    @Autowired
    public RecipeServiceImpl(RecipeRepository recipeRepository, UserRepository userRepository) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
    }


    private RecipeDTO convertToDTO(Recipe recipe) {
        List<RecipeIngredientDTO> ingredientDTOs = recipe.getIngredients().stream()
                .map(ingredient -> new RecipeIngredientDTO(
                        ingredient.getId(),
                        ingredient.getFood().getId(),
                        ingredient.getFood().getName(),
                        ingredient.getAmount(),
                        ingredient.getNote()
                ))
                .collect(Collectors.toList());


        return new RecipeDTO(
                recipe.getId(),
                recipe.getName(),
                recipe.getDescription(),
                recipe.getInstructions(),
                ingredientDTOs,
                recipe.getServings(),
                recipe.getPreparationTime(),
                recipe.getCreator().getId(),
                recipe.getRecommendedFor(),
                recipe.getCaloriesPerServing(),
                recipe.getProteinPerServing(),
                recipe.getFatPerServing(),
                recipe.getCarbsPerServing());
    }

    private Recipe convertToEntity(RecipeDTO dto) {
        Recipe recipe = new Recipe();
        recipe.setId(dto.getId());
        recipe.setName(dto.getName());
        recipe.setDescription(dto.getDescription());
        recipe.setInstructions(dto.getInstructions());
        recipe.setServings(dto.getServings());
        recipe.setPreparationTime(dto.getPreparationTime());
        recipe.setRecommendedFor(dto.getRecommendedFor());
        recipe.setCaloriesPerServing(dto.getCaloriesPerServing());
        recipe.setProteinPerServing(dto.getProteinPerServing());
        recipe.setFatPerServing(dto.getFatPerServing());
        recipe.setCarbsPerServing(dto.getCarbsPerServing());

        if (dto.getCreatorId() != null) {
            User creator = userRepository.findById(dto.getCreatorId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + dto.getCreatorId()));
            recipe.setCreator(creator);
        }

        return recipe;
    }

    @Override
    @Transactional
    public RecipeDTO createRecipe(RecipeDTO recipeDTO) {
        Recipe recipe = convertToEntity(recipeDTO);
        calculateNutritionalValues(recipe);
        Recipe savedRecipe = recipeRepository.save(recipe);
        return convertToDTO(savedRecipe);
    }

    private void calculateNutritionalValues(Recipe recipe) {
        if (recipe.getIngredients() != null && !recipe.getIngredients().isEmpty() && recipe.getServings() > 0) {
            double totalCalories = 0;
            double totalProtein = 0;
            double totalFat = 0;
            double totalCarbs = 0;

            for (var ingredient : recipe.getIngredients()) {
                double multiplier = ingredient.getAmount() / 100.0;
                totalCalories += ingredient.getFood().getKcal() * multiplier;
                totalProtein += ingredient.getFood().getProtein() * multiplier;
                totalFat += ingredient.getFood().getFat() * multiplier;
                totalCarbs += ingredient.getFood().getCarbs() * multiplier;
            }
            int servings = recipe.getServings();
            recipe.setCaloriesPerServing(totalCalories / servings);
            recipe.setProteinPerServing(totalProtein / servings);
            recipe.setFatPerServing(totalFat / servings);
            recipe.setCarbsPerServing(totalCarbs / servings);

        }
    }

    @Override
    @Transactional
    public RecipeDTO updateRecipe(Long id, RecipeDTO recipeDTO) {
        Recipe existingRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recipe not found with ID: " + id));

        existingRecipe.setName(recipeDTO.getName());
        existingRecipe.setDescription(recipeDTO.getDescription());
        existingRecipe.setInstructions(recipeDTO.getInstructions());
        existingRecipe.setServings(recipeDTO.getServings());
        existingRecipe.setPreparationTime(recipeDTO.getPreparationTime());
        existingRecipe.setRecommendedFor(recipeDTO.getRecommendedFor());

        calculateNutritionalValues(existingRecipe);
        Recipe updatedRecipe = recipeRepository.save(existingRecipe);
        return convertToDTO(updatedRecipe);

    }

    @Override
    @Transactional
    public void deleteRecipe(Long id) {
        if (!recipeRepository.existsById(id)) {
            throw new IllegalArgumentException("Recipe not found with ID: " + id);
        }
        recipeRepository.deleteById(id);
    }

    @Override
    public Optional<RecipeDTO> getRecipeById(Long id) {
        return recipeRepository.findById(id).map(this::convertToDTO);
    }

    @Override
    public List<RecipeDTO> getAllRecipes() {
        return recipeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RecipeDTO> getRecipesByUser(Long userId) {
        return recipeRepository.findByCreatorId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RecipeDTO> getRecipesByGoal(GoalType goal) {
        return recipeRepository.findByRecommendedFor(goal).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RecipeDTO> searchRecipes(String query) {
        return recipeRepository.findByNameContainingIgnoreCase(query).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RecipeDTO> findRecipesByNutrition(Double minCalories, Double maxCalories, Double minProtein) {
        return recipeRepository.findByNutritionCriteria(minCalories, maxCalories, minProtein).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
