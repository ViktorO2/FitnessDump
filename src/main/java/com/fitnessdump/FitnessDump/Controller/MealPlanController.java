package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.Meals.MealDTO;
import com.fitnessdump.FitnessDump.DTOs.Meals.MealPlanDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.NutritionSummaryDTO;
import com.fitnessdump.FitnessDump.Exception.ResourceNotFoundException;
import com.fitnessdump.FitnessDump.Model.Enum.GoalType;
import com.fitnessdump.FitnessDump.Service.MealPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meal-plans")
@CrossOrigin(origins = "*")
public class MealPlanController {

    private final MealPlanService mealPlanService;

    @Autowired
    public MealPlanController(MealPlanService mealPlanService) {
        this.mealPlanService = mealPlanService;
    }

    @PostMapping
    public ResponseEntity<?> createMealPlan(@RequestBody MealPlanDTO mealPlanDTO) {
        try {
            if (mealPlanDTO.getName() == null || mealPlanDTO.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Meal plan name is required");
            }
            if (mealPlanDTO.getUserId() == null) {
                return ResponseEntity.badRequest().body("User ID is required");
            }
            if (mealPlanDTO.getStartDate() == null) {
                return ResponseEntity.badRequest().body("Start date is required");
            }
            if (mealPlanDTO.getEndDate() == null) {
                return ResponseEntity.badRequest().body("End date is required");
            }
            if (mealPlanDTO.getGoal() == null) {
                return ResponseEntity.badRequest().body("Goal is required");
            }

            MealPlanDTO createdPlan = mealPlanService.createMealPlan(mealPlanDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPlan);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating meal plan: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMealPlan(
            @PathVariable Long id,
            @RequestBody MealPlanDTO mealPlanDTO) {
        try {
            MealPlanDTO updatedPlan = mealPlanService.updateMealPlan(id, mealPlanDTO);
            return ResponseEntity.ok(updatedPlan);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating meal plan: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMealPlan(@PathVariable Long id) {
        try {
            mealPlanService.deleteMealPlan(id);
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting meal plan: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMealPlan(@PathVariable Long id) {
        try {
            MealPlanDTO mealPlan = mealPlanService.getMealPlanById(id);
            return ResponseEntity.ok(mealPlan);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving meal plan: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserMealPlans(@PathVariable Long userId) {
        try {
            List<MealPlanDTO> mealPlans = mealPlanService.getMealPlansByUser(userId);
            return ResponseEntity.ok(mealPlans);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user meal plans: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/goal/{goal}")
    public ResponseEntity<?> getUserMealPlansByGoal(
            @PathVariable Long userId,
            @PathVariable GoalType goal) {
        try {
            List<MealPlanDTO> mealPlans = mealPlanService.getMealPlansByUserAndGoal(userId, goal);
            return ResponseEntity.ok(mealPlans);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving meal plans by goal: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/days/{dayOfWeek}/meals")
    public ResponseEntity<?> addMealToDay(
            @PathVariable Long id,
            @PathVariable Integer dayOfWeek,
            @RequestBody MealDTO mealDTO) {
        if (dayOfWeek < 1 || dayOfWeek > 7) {
            return ResponseEntity.badRequest().body("Day of week must be between 1 and 7");
        }
        try {
            mealPlanService.addMealToDay(id, dayOfWeek, mealDTO);
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding meal to day: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}/days/{dayOfWeek}/meals/{mealId}")
    public ResponseEntity<?> removeMealFromDay(
            @PathVariable Long id,
            @PathVariable Integer dayOfWeek,
            @PathVariable Long mealId) {
        if (dayOfWeek < 1 || dayOfWeek > 7) {
            return ResponseEntity.badRequest().body("Day of week must be between 1 and 7");
        }
        try {
            mealPlanService.removeMealFromDay(id, dayOfWeek, mealId);
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error removing meal from day: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/days/{dayOfWeek}/meals/{mealId}")
    public ResponseEntity<?> updateMealInDay(
            @PathVariable Long id,
            @PathVariable Integer dayOfWeek,
            @PathVariable Long mealId,
            @RequestBody MealDTO mealDTO) {
        if (dayOfWeek < 1 || dayOfWeek > 7) {
            return ResponseEntity.badRequest().body("Day of week must be between 1 and 7");
        }
        try {
            mealPlanService.updateMealInDay(id, dayOfWeek, mealId, mealDTO);
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating meal in day: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/days/{dayOfWeek}/calories")
    public ResponseEntity<?> getDayTotalCalories(
            @PathVariable Long id,
            @PathVariable Integer dayOfWeek) {
        if (dayOfWeek < 1 || dayOfWeek > 7) {
            return ResponseEntity.badRequest().body("Day of week must be between 1 and 7");
        }
        try {
            Double calories = mealPlanService.calculateDayTotalCalories(id, dayOfWeek);
            return ResponseEntity.ok(calories);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error calculating day calories: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/nutrition-summary")
    public ResponseEntity<?> getMealPlanNutrition(@PathVariable Long id) {
        try {
            NutritionSummaryDTO summary = mealPlanService.calculateMealPlanNutrition(id);
            return ResponseEntity.ok(summary);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error calculating nutrition summary: " + e.getMessage());
        }
    }
}
