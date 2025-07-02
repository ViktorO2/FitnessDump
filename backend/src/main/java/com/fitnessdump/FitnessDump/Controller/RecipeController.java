package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.Nutrition.RecipeDTO;
import com.fitnessdump.FitnessDump.Model.Enum.GoalType;
import com.fitnessdump.FitnessDump.Service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "*")
public class RecipeController {

    private final RecipeService recipeService;

    @Autowired
    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @PostMapping
    public ResponseEntity<?> createRecipe(@RequestBody RecipeDTO recipeDTO) {
        try {
            if (recipeDTO.getName() == null || recipeDTO.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Recipe name is required");
            }

            // Validate ingredients
            if (recipeDTO.getIngredients() != null) {
                for (int i = 0; i < recipeDTO.getIngredients().size(); i++) {
                    var ingredient = recipeDTO.getIngredients().get(i);
                    if (ingredient.getFoodId() == null || ingredient.getFoodId() <= 0) {
                        return ResponseEntity.badRequest().body("Invalid food ID for ingredient at index " + i);
                    }
                    if (ingredient.getAmount() == null || ingredient.getAmount() <= 0) {
                        return ResponseEntity.badRequest().body("Invalid amount for ingredient at index " + i);
                    }
                }
            }

            RecipeDTO createdRecipe = recipeService.createRecipe(recipeDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRecipe);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating recipe: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecipe(@PathVariable Long id, @RequestBody RecipeDTO recipeDTO) {
        try {
            if (recipeDTO.getName() == null || recipeDTO.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Recipe name is required");
            }

            // Validate ingredients
            if (recipeDTO.getIngredients() != null) {
                for (int i = 0; i < recipeDTO.getIngredients().size(); i++) {
                    var ingredient = recipeDTO.getIngredients().get(i);
                    if (ingredient.getFoodId() == null || ingredient.getFoodId() <= 0) {
                        return ResponseEntity.badRequest().body("Invalid food ID for ingredient at index " + i);
                    }
                    if (ingredient.getAmount() == null || ingredient.getAmount() <= 0) {
                        return ResponseEntity.badRequest().body("Invalid amount for ingredient at index " + i);
                    }
                }
            }

            RecipeDTO updatedRecipe = recipeService.updateRecipe(id, recipeDTO);
            return ResponseEntity.ok(updatedRecipe);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating recipe: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Long id) {
        try {
            recipeService.deleteRecipe(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting recipe: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable Long id) {
        try {
            return recipeService.getRecipeById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving recipe: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllRecipes() {
        try {
            List<RecipeDTO> recipes = recipeService.getAllRecipes();
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving recipes: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getRecipesByUser(@PathVariable Long userId) {
        try {
            List<RecipeDTO> recipes = recipeService.getRecipesByUser(userId);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user recipes: " + e.getMessage());
        }
    }

    @GetMapping("/goal/{goal}")
    public ResponseEntity<?> getRecipesByGoal(@PathVariable GoalType goal) {
        try {
            List<RecipeDTO> recipes = recipeService.getRecipesByGoal(goal);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving recipes by goal: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchRecipes(@RequestParam String query) {
        try {
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Search query is required");
            }

            List<RecipeDTO> recipes = recipeService.searchRecipes(query);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error searching recipes: " + e.getMessage());
        }
    }

    @GetMapping("/nutrition")
    public ResponseEntity<?> findRecipesByNutrition(
            @RequestParam(required = false) Double minCalories,
            @RequestParam(required = false) Double maxCalories,
            @RequestParam(required = false) Double minProtein) {
        try {
            minCalories = minCalories != null ? minCalories : 0.0;
            maxCalories = maxCalories != null ? maxCalories : Double.MAX_VALUE;
            minProtein = minProtein != null ? minProtein : 0.0;

            List<RecipeDTO> recipes = recipeService.findRecipesByNutrition(minCalories, maxCalories, minProtein);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error finding recipes by nutrition: " + e.getMessage());
        }
    }

    @GetMapping("/test/{id}")
    public ResponseEntity<?> testRecipe(@PathVariable Long id) {
        try {
            boolean exists = recipeService.existsById(id);
            if (exists) {
                RecipeDTO recipe = recipeService.getRecipeById(id).orElse(null);
                return ResponseEntity.ok(Map.of(
                        "exists", true,
                        "recipe", recipe));
            } else {
                return ResponseEntity.ok(Map.of("exists", false));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error testing recipe: " + e.getMessage());
        }
    }
}