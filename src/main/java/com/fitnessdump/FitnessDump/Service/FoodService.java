package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.FoodDTO;
import com.fitnessdump.FitnessDump.Model.Food;

import java.util.List;
import java.util.Optional;

public interface FoodService {
    FoodDTO editFood(Long id, FoodDTO foodDTO);
    List<FoodDTO> getAllFoods();
    Optional<FoodDTO> getFoodById(Long foodId);
    List<FoodDTO> searchFoodsByName(String query);
    FoodDTO createFood(FoodDTO foodDTO);
    void deletingFoodById(Long id);
}
