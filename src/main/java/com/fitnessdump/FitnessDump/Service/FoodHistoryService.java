package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.FoodHistoryDTO;
import com.fitnessdump.FitnessDump.Model.FoodHistory;

import java.util.List;
import java.util.Optional;

public interface FoodHistoryService {
    FoodHistoryDTO saveFoodHistory(FoodHistoryDTO foodHistoryDTO);
    List<FoodHistoryDTO> getFoodHistoryByUserId(Long userId);
    Optional<FoodHistoryDTO> getFoodHistoryById(Long id);
    void deleteFoodHistoryById(Long id);

}
