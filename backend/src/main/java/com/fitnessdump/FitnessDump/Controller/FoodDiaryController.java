package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.Nutrition.FoodHistoryDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.NutritionSummaryDTO;
import com.fitnessdump.FitnessDump.Service.FoodHistoryService;
import com.fitnessdump.FitnessDump.Security.CustomUserDetails;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/food-diary")
@CrossOrigin(origins = "*")
public class FoodDiaryController {
    private final FoodHistoryService foodHistoryService;

    public FoodDiaryController(FoodHistoryService foodHistoryService) {
        this.foodHistoryService = foodHistoryService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FoodHistoryDTO>> getUserFoodDiary(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Long authenticatedUserId = getAuthenticatedUserId();
        if (!authenticatedUserId.equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        List<FoodHistoryDTO> history = foodHistoryService.getFoodHistoryByUserId(userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/nutrition-summary")
    public ResponseEntity<NutritionSummaryDTO> getDailyNutritionSummary(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Long authenticatedUserId = getAuthenticatedUserId();
        if (!authenticatedUserId.equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        // За сега връщаме празен nutrition summary
        // може да се добави изчисляване на база food history
        NutritionSummaryDTO summary = new NutritionSummaryDTO();
        return ResponseEntity.ok(summary);
    }

    @PostMapping
    public ResponseEntity<FoodHistoryDTO> addFoodToDiary(@RequestBody FoodHistoryDTO foodHistoryDTO) {
        Long userId = getAuthenticatedUserId();
        foodHistoryDTO.setUserId(userId);
        FoodHistoryDTO savedHistory = foodHistoryService.saveFoodHistory(foodHistoryDTO);
        return ResponseEntity.status(201).body(savedHistory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFoodFromDiary(@PathVariable Long id) {
        Long userId = getAuthenticatedUserId();
        Optional<FoodHistoryDTO> history = foodHistoryService.getFoodHistoryById(id);

        if (history.isPresent() && history.get().getUserId().equals(userId)) {
            foodHistoryService.deleteFoodHistoryById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            return userDetails.getUserId();
        }
        throw new RuntimeException("User is not authenticated or invalid user details");
    }
}