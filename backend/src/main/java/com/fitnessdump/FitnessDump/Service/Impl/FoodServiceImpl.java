package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.Nutrition.FoodDTO;
import com.fitnessdump.FitnessDump.Model.Enum.FoodCategory;
import com.fitnessdump.FitnessDump.Model.Nutrition.Food;
import com.fitnessdump.FitnessDump.Repository.FoodRepository;
import com.fitnessdump.FitnessDump.Service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FoodServiceImpl implements FoodService {

    private final FoodRepository foodRepository;

    @Autowired
    public FoodServiceImpl(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    private FoodDTO convertToDTO(Food food) {
        return new FoodDTO(food.getId(), food.getName(), food.getDescription(), food.getKcal(),
                food.getProtein(), food.getFat(), food.getCarbs(), food.getCategory());
    }

    @Override
    public FoodDTO editFood(Long id, FoodDTO foodDTO) {

        Optional<Food> existingFoodOptional = foodRepository.findById(id);

        if (existingFoodOptional.isPresent()) {
            Food existingFood = existingFoodOptional.get();

            existingFood.setName(foodDTO.getName());
            existingFood.setDescription(foodDTO.getDescription());
            existingFood.setKcal(foodDTO.getKcal());
            existingFood.setProtein(foodDTO.getProtein());
            existingFood.setFat(foodDTO.getFat());
            existingFood.setCarbs(foodDTO.getCarbs());
            existingFood.setCategory(foodDTO.getCategory());

            Food updatedFood = foodRepository.save(existingFood);

            return convertToDTO(updatedFood);
        } else {
            throw new IllegalArgumentException("Food with id " + id + " not found.");
        }
    }

    @Override
    public List<FoodDTO> getAllFoods() {
        return foodRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<FoodDTO> getFoodById(Long foodId) {
        Optional<Food> food = foodRepository.findById(foodId);
        return food.map(this::convertToDTO);
    }

    @Override
    public List<FoodDTO> searchFoodsByName(String query) {
        return foodRepository.findByNameContainingIgnoreCase(query).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FoodDTO createFood(FoodDTO foodDTO) {
        Food newFood = new Food();
        newFood.setName(foodDTO.getName());
        newFood.setDescription(foodDTO.getDescription());
        newFood.setKcal(foodDTO.getKcal());
        newFood.setProtein(foodDTO.getProtein());
        newFood.setFat(foodDTO.getFat());
        newFood.setCarbs(foodDTO.getCarbs());
        newFood.setCategory(foodDTO.getCategory());

        Food savedFood = foodRepository.save(newFood);

        return convertToDTO(savedFood);
    }

    @Override
    public void deletingFoodById(Long id) {
        if (foodRepository.existsById(id)) {
            foodRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Food with id " + id + " not found.");
        }
    }

    @Override
    public List<FoodDTO> getFoodsByCategory(FoodCategory category) {
        return foodRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
