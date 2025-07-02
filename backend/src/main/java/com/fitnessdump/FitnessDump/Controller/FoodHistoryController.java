package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.Nutrition.FoodHistoryDTO;
import com.fitnessdump.FitnessDump.Service.FoodHistoryService;
import com.fitnessdump.FitnessDump.Security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/food-history")
@CrossOrigin(origins = "*")
public class FoodHistoryController {
    private final FoodHistoryService foodHistoryService;

    public FoodHistoryController(FoodHistoryService foodHistoryService) {
        this.foodHistoryService = foodHistoryService;
    }

    @PostMapping
    public ResponseEntity<FoodHistoryDTO> saveFoodHistory(@RequestBody FoodHistoryDTO foodHistoryDTO) {
        Long userId = getAuthenticatedUserId();
        foodHistoryDTO.setUserId(userId);
        FoodHistoryDTO savedHistory = foodHistoryService.saveFoodHistory(foodHistoryDTO);
        return ResponseEntity.status(201).body(savedHistory);
    }

    @GetMapping
    public ResponseEntity<List<FoodHistoryDTO>> getUserFoodHistory() {
        Long userId = getAuthenticatedUserId();
        List<FoodHistoryDTO> history = foodHistoryService.getFoodHistoryByUserId(userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodHistoryDTO> getFoodHistoryById(@PathVariable Long id) {
        Long userId = getAuthenticatedUserId();
        Optional<FoodHistoryDTO> history = foodHistoryService.getFoodHistoryById(id);

        if (history.isPresent() && history.get().getUserId().equals(userId)) {
            return ResponseEntity.ok(history.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFoodHistory(@PathVariable Long id) {
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
