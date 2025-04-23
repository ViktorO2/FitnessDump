package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.RecipeIngredientDTO;
import com.fitnessdump.FitnessDump.Service.RecipeIngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipe-ingredients")
public class RecipeIngredientController {

    private final RecipeIngredientService recipeIngredientService;

    @Autowired
    public RecipeIngredientController(RecipeIngredientService recipeIngredientService) {
        this.recipeIngredientService = recipeIngredientService;
    }

    @PostMapping
    public ResponseEntity<RecipeIngredientDTO> createRecipeIngredient(@RequestBody RecipeIngredientDTO ingredientDTO) {
        RecipeIngredientDTO created = recipeIngredientService.createRecipeIngredient(ingredientDTO);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeIngredientDTO> updateRecipeIngredient(
            @PathVariable Long id,
            @RequestBody RecipeIngredientDTO ingredientDTO) {
        RecipeIngredientDTO updated = recipeIngredientService.updateRecipeIngredient(id, ingredientDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipeIngredient(@PathVariable Long id) {
        recipeIngredientService.deleteRecipeIngredient(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeIngredientDTO> getRecipeIngredientById(@PathVariable Long id) {
        return recipeIngredientService.getRecipeIngredientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<List<RecipeIngredientDTO>> getIngredientsByRecipeId(@PathVariable Long recipeId) {
        List<RecipeIngredientDTO> ingredients = recipeIngredientService.getIngredientsByRecipeId(recipeId);
        return ResponseEntity.ok(ingredients);
    }
}