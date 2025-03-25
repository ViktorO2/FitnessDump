package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.FoodHistoryDTO;
import com.fitnessdump.FitnessDump.Model.Food;
import com.fitnessdump.FitnessDump.Model.FoodHistory;
import com.fitnessdump.FitnessDump.Model.User;
import com.fitnessdump.FitnessDump.Repository.FoodHistoryRepository;
import com.fitnessdump.FitnessDump.Repository.FoodRepository;
import com.fitnessdump.FitnessDump.Repository.UserRepository;
import com.fitnessdump.FitnessDump.Service.FoodHistoryService;
import com.fitnessdump.FitnessDump.Service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FoodHistoryServiceImpl implements FoodHistoryService {

    private final FoodHistoryRepository foodHistoryRepository;
    private final FoodRepository foodRepository;
    private final UserRepository userRepository;

    @Autowired
    public FoodHistoryServiceImpl(FoodHistoryRepository foodHistoryRepository, FoodRepository foodRepository, UserRepository userRepository) {
        this.foodHistoryRepository = foodHistoryRepository;
        this.foodRepository = foodRepository;
        this.userRepository = userRepository;
    }

    private FoodHistoryDTO convertToDTO(FoodHistory foodHistory) {
        List<Long> foodIds = foodHistory.getFoods().stream()
                .map(Food::getId)
                .collect(Collectors.toList());

        return new FoodHistoryDTO(foodHistory.getId(), foodHistory.getUser().getId(),
                foodHistory.getDate(), foodIds);
    }

    @Override
    public FoodHistoryDTO saveFoodHistory(FoodHistoryDTO foodHistoryDTO) {
        FoodHistory foodHistory = new FoodHistory();

        Optional<User> userOptional = userRepository.findById(foodHistoryDTO.getUserId());
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + foodHistoryDTO.getUserId());
        }

        foodHistory.setUser(userOptional.get());
        foodHistory.setDate(foodHistoryDTO.getDate());


        List<Food> foods = foodRepository.findAllById(foodHistoryDTO.getFoodIds());
        foodHistory.setFoods(foods);


        FoodHistory savedFoodHistory = foodHistoryRepository.save(foodHistory);
        return convertToDTO(savedFoodHistory);
    }

    @Override
    public List<FoodHistoryDTO> getFoodHistoryByUserId(Long userId) {
        return foodHistoryRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<FoodHistoryDTO> getFoodHistoryById(Long id) {
        Optional<FoodHistory> foodHistory = foodHistoryRepository.findById(id);
        return foodHistory.map(this::convertToDTO);
    }

    @Override
    public void deleteFoodHistoryById(Long id) {
        foodHistoryRepository.deleteById(id);
    }
}
