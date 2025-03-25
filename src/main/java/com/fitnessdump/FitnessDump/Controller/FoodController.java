package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.FoodDTO;
import com.fitnessdump.FitnessDump.Service.FoodService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/foods")
public class FoodController {
    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @PostMapping("/add")
    public ResponseEntity<FoodDTO> createFood(@RequestBody FoodDTO foodDTO) {
        FoodDTO createdFood = foodService.createFood(foodDTO);
        return ResponseEntity.status(201).body(createdFood);
    }

    @GetMapping
    public ResponseEntity<List<FoodDTO>> getAllFoods() {
        List<FoodDTO> foods = foodService.getAllFoods();
        return ResponseEntity.ok(foods);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodDTO> getFoodById(@PathVariable Long id) {
        Optional<FoodDTO> food = foodService.getFoodById(id);
        return food.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<FoodDTO> editFood(@PathVariable Long id, @RequestBody FoodDTO foodDTO) {
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
}
