package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.Nutrition.RecipeDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.RecipeIngredientDTO;
import com.fitnessdump.FitnessDump.Model.Enum.GoalType;
import com.fitnessdump.FitnessDump.Model.Nutrition.Food;
import com.fitnessdump.FitnessDump.Model.Nutrition.Recipe;
import com.fitnessdump.FitnessDump.Model.Nutrition.RecipeIngredient;
import com.fitnessdump.FitnessDump.Model.Users.User;
import com.fitnessdump.FitnessDump.Repository.FoodRepository;
import com.fitnessdump.FitnessDump.Repository.RecipeIngredientRepository;
import com.fitnessdump.FitnessDump.Repository.RecipeRepository;
import com.fitnessdump.FitnessDump.Repository.UserRepository;
import com.fitnessdump.FitnessDump.Service.RecipeService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecipeServiceImpl implements RecipeService {

    private static final Logger logger = LoggerFactory.getLogger(RecipeServiceImpl.class);

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final FoodRepository foodRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;

    @Autowired
    public RecipeServiceImpl(RecipeRepository recipeRepository, UserRepository userRepository,
            FoodRepository foodRepository, RecipeIngredientRepository recipeIngredientRepository) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
        this.foodRepository = foodRepository;
        this.recipeIngredientRepository = recipeIngredientRepository;
    }

    private RecipeDTO convertToDTO(Recipe recipe) {
        List<RecipeIngredientDTO> ingredientDTOs = recipe.getIngredients().stream()
                .filter(ingredient -> ingredient.getFood() != null)
                .map(ingredient -> new RecipeIngredientDTO(
                        ingredient.getId(),
                        ingredient.getFood().getId(),
                        ingredient.getFood().getName(),
                        ingredient.getAmount(),
                        ingredient.getNote()))
                .collect(Collectors.toList());

        return new RecipeDTO(
                recipe.getId(),
                recipe.getName(),
                recipe.getDescription(),
                recipe.getInstructions(),
                ingredientDTOs,
                recipe.getServings(),
                recipe.getPreparationTime(),
                recipe.getCreator() != null ? recipe.getCreator().getId() : null,
                recipe.getRecommendedFor(),
                recipe.getCaloriesPerServing(),
                recipe.getProteinPerServing(),
                recipe.getFatPerServing(),
                recipe.getCarbsPerServing());
    }

    private Recipe convertToEntity(RecipeDTO dto) {
        Recipe recipe = new Recipe();
        if (dto.getId() != null && dto.getId() > 0) {
            recipe.setId(dto.getId());
        }
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

    private void processIngredients(Recipe recipe, List<RecipeIngredientDTO> ingredientDTOs) {
        if (ingredientDTOs == null || ingredientDTOs.isEmpty()) {
            return;
        }

        List<RecipeIngredient> ingredients = new ArrayList<>();

        for (RecipeIngredientDTO ingredientDTO : ingredientDTOs) {
            if (ingredientDTO.getFoodId() != null && ingredientDTO.getFoodId() > 0
                    && ingredientDTO.getAmount() != null) {
                Food food = foodRepository.findById(ingredientDTO.getFoodId())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Food not found with ID: " + ingredientDTO.getFoodId()));

                RecipeIngredient ingredient = new RecipeIngredient();
                ingredient.setRecipe(recipe);
                ingredient.setFood(food);
                ingredient.setAmount(ingredientDTO.getAmount());
                ingredient.setNote(ingredientDTO.getNote());

                ingredients.add(ingredient);
            }
        }

        recipe.setIngredients(ingredients);
    }

    @Override
    @Transactional
    public RecipeDTO createRecipe(RecipeDTO recipeDTO) {
        Recipe recipe = convertToEntity(recipeDTO);

        processIngredients(recipe, recipeDTO.getIngredients());

        Recipe savedRecipe = recipeRepository.save(recipe);

        if (savedRecipe.getIngredients() != null && !savedRecipe.getIngredients().isEmpty()
                && savedRecipe.getServings() != null && savedRecipe.getServings() > 0) {
            calculateNutritionalValues(savedRecipe);
            savedRecipe = recipeRepository.save(savedRecipe);
        }

        return convertToDTO(savedRecipe);
    }

    private void calculateNutritionalValues(Recipe recipe) {
        logger.info("Calculating nutritional values for recipe: {}", recipe.getName());
        logger.info("Ingredients count: {}, Servings: {}",
                recipe.getIngredients() != null ? recipe.getIngredients().size() : 0,
                recipe.getServings());

        if (recipe.getIngredients() != null && !recipe.getIngredients().isEmpty() &&
                recipe.getServings() != null && recipe.getServings() > 0) {

            double totalCalories = 0;
            double totalProtein = 0;
            double totalFat = 0;
            double totalCarbs = 0;

            for (var ingredient : recipe.getIngredients()) {
                if (ingredient.getFood() != null && ingredient.getAmount() != null) {
                    double multiplier = ingredient.getAmount() / 100.0;
                    double ingredientCalories = ingredient.getFood().getKcal() * multiplier;
                    double ingredientProtein = ingredient.getFood().getProtein() * multiplier;
                    double ingredientFat = ingredient.getFood().getFat() * multiplier;
                    double ingredientCarbs = ingredient.getFood().getCarbs() * multiplier;

                    totalCalories += ingredientCalories;
                    totalProtein += ingredientProtein;
                    totalFat += ingredientFat;
                    totalCarbs += ingredientCarbs;

                    logger.info("Ingredient: {} ({}g) - Calories: {:.2f}, Protein: {:.2f}, Fat: {:.2f}, Carbs: {:.2f}",
                            ingredient.getFood().getName(), ingredient.getAmount(),
                            ingredientCalories, ingredientProtein, ingredientFat, ingredientCarbs);
                }
            }

            int servings = recipe.getServings();
            double caloriesPerServing = totalCalories / servings;
            double proteinPerServing = totalProtein / servings;
            double fatPerServing = totalFat / servings;
            double carbsPerServing = totalCarbs / servings;

            recipe.setCaloriesPerServing(caloriesPerServing);
            recipe.setProteinPerServing(proteinPerServing);
            recipe.setFatPerServing(fatPerServing);
            recipe.setCarbsPerServing(carbsPerServing);

            logger.info("Total - Calories: {:.2f}, Protein: {:.2f}, Fat: {:.2f}, Carbs: {:.2f}",
                    totalCalories, totalProtein, totalFat, totalCarbs);
            logger.info("Per serving - Calories: {:.2f}, Protein: {:.2f}, Fat: {:.2f}, Carbs: {:.2f}",
                    caloriesPerServing, proteinPerServing, fatPerServing, carbsPerServing);
        } else {
            logger.warn("Cannot calculate nutritional values - missing ingredients or servings");
        }
    }

    @Override
    @Transactional
    public RecipeDTO updateRecipe(Long id, RecipeDTO recipeDTO) {
        logger.info("Starting update for recipe ID: {}", id);
        logger.info("Update data: name={}, ingredients count={}", recipeDTO.getName(),
                recipeDTO.getIngredients() != null ? recipeDTO.getIngredients().size() : 0);

        Recipe existingRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recipe not found with ID: " + id));

        logger.info("Found existing recipe: {}", existingRecipe.getName());

        existingRecipe.setName(recipeDTO.getName());
        existingRecipe.setDescription(recipeDTO.getDescription());
        existingRecipe.setInstructions(recipeDTO.getInstructions());
        existingRecipe.setServings(recipeDTO.getServings());
        existingRecipe.setPreparationTime(recipeDTO.getPreparationTime());
        existingRecipe.setRecommendedFor(recipeDTO.getRecommendedFor());

        logger.info("Updated basic fields, now processing ingredients");

        List<RecipeIngredient> existingIngredients = recipeIngredientRepository.findByRecipeId(id);
        logger.info("Found {} existing ingredients to delete", existingIngredients.size());
        for (RecipeIngredient ingredient : existingIngredients) {
            recipeIngredientRepository.delete(ingredient);
            logger.info("Deleted ingredient: {}", ingredient.getId());
        }

        List<RecipeIngredient> newIngredients = new ArrayList<>();
        if (recipeDTO.getIngredients() != null && !recipeDTO.getIngredients().isEmpty()) {
            logger.info("Processing {} ingredients", recipeDTO.getIngredients().size());
            for (RecipeIngredientDTO ingredientDTO : recipeDTO.getIngredients()) {
                if (ingredientDTO.getFoodId() != null && ingredientDTO.getFoodId() > 0
                        && ingredientDTO.getAmount() != null) {
                    Food food = foodRepository.findById(ingredientDTO.getFoodId())
                            .orElseThrow(() -> new IllegalArgumentException(
                                    "Food not found with ID: " + ingredientDTO.getFoodId()));

                    RecipeIngredient ingredient = new RecipeIngredient();
                    ingredient.setRecipe(existingRecipe);
                    ingredient.setFood(food);
                    ingredient.setAmount(ingredientDTO.getAmount());
                    ingredient.setNote(ingredientDTO.getNote());

                    newIngredients.add(ingredient);
                    logger.info("Added ingredient: food={}, amount={}", food.getName(), ingredientDTO.getAmount());
                }
            }
        }

        existingRecipe.setIngredients(newIngredients);

        logger.info("Calculating nutritional values");
        calculateNutritionalValues(existingRecipe);

        logger.info("Saving updated recipe");
        Recipe updatedRecipe = recipeRepository.save(existingRecipe);
        logger.info("Recipe updated successfully: {}", updatedRecipe.getName());

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
    public boolean existsById(Long id) {
        return recipeRepository.existsById(id);
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
