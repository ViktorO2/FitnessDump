package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.Nutrition.FoodDTO;
import com.fitnessdump.FitnessDump.Model.Enum.FoodCategory;
import com.fitnessdump.FitnessDump.Service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "*")
public class FoodController {
    private final FoodService foodService;

    @Autowired
    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @PostMapping
    public ResponseEntity<FoodDTO> createFood(@RequestBody FoodDTO foodDTO) {
        FoodDTO createdFood = foodService.createFood(foodDTO);
        return ResponseEntity.status(201).body(createdFood);
    }

    @PostMapping("/add")
    public ResponseEntity<FoodDTO> createFoodAlternative(@RequestBody FoodDTO foodDTO) {
        FoodDTO createdFood = foodService.createFood(foodDTO);
        return ResponseEntity.status(201).body(createdFood);
    }

    @GetMapping
    public ResponseEntity<List<FoodDTO>> getAllFoods() {
        List<FoodDTO> foods = foodService.getAllFoods();
        return ResponseEntity.ok(foods);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodDTO> getFoodById(@PathVariable String id) {
        if (id == null || "undefined".equals(id) || "null".equals(id)) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Long foodId = Long.parseLong(id);
            Optional<FoodDTO> food = foodService.getFoodById(foodId);
            return food.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodDTO> editFood(@PathVariable Long id, @RequestBody FoodDTO foodDTO) {
        FoodDTO updatedFood = foodService.editFood(id, foodDTO);
        return updatedFood != null ? ResponseEntity.ok(updatedFood) : ResponseEntity.notFound().build();
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<FoodDTO> editFoodAlternative(@PathVariable Long id, @RequestBody FoodDTO foodDTO) {
        FoodDTO updatedFood = foodService.editFood(id, foodDTO);
        return updatedFood != null ? ResponseEntity.ok(updatedFood) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable Long id) {
        foodService.deletingFoodById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<FoodDTO>> searchFoods(@RequestParam String query) {
        return ResponseEntity.ok(foodService.searchFoodsByName(query));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<FoodCategory>> getCategories() {
        List<FoodCategory> categories = Arrays.asList(FoodCategory.values());
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FoodDTO>> getFoodsByCategory(@PathVariable FoodCategory category) {
        List<FoodDTO> foods = foodService.getFoodsByCategory(category);
        return ResponseEntity.ok(foods);
    }
}
