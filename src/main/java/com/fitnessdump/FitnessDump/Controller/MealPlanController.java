package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.MealDTO;
import com.fitnessdump.FitnessDump.DTOs.MealPlanDTO;
import com.fitnessdump.FitnessDump.DTOs.NutritionSummaryDTO;
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
public class MealPlanController {

    private final MealPlanService mealPlanService;

    @Autowired
    public MealPlanController(MealPlanService mealPlanService) {
        this.mealPlanService = mealPlanService;
    }

    @PostMapping
    public ResponseEntity<MealPlanDTO> createMealPlan(@RequestBody MealPlanDTO mealPlanDTO) {
        try {
            MealPlanDTO createdPlan = mealPlanService.createMealPlan(mealPlanDTO);
            return ResponseEntity.ok(createdPlan);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MealPlanDTO> updateMealPlan(
            @PathVariable Long id,
            @RequestBody MealPlanDTO mealPlanDTO) {
        try {
            MealPlanDTO updatedPlan = mealPlanService.updateMealPlan(id, mealPlanDTO);
            return ResponseEntity.ok(updatedPlan);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMealPlan(@PathVariable Long id) {
        try {
            mealPlanService.deleteMealPlan(id);
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<MealPlanDTO> getMealPlan(@PathVariable Long id) {
        try {
            MealPlanDTO mealPlan = mealPlanService.getMealPlanById(id);
            return ResponseEntity.ok(mealPlan);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MealPlanDTO>> getUserMealPlans(@PathVariable Long userId) {
        List<MealPlanDTO> mealPlans = mealPlanService.getMealPlansByUser(userId);
        return ResponseEntity.ok(mealPlans);
    }

    @GetMapping("/user/{userId}/goal/{goal}")
    public ResponseEntity<List<MealPlanDTO>> getUserMealPlansByGoal(
            @PathVariable Long userId,
            @PathVariable GoalType goal) {
        List<MealPlanDTO> mealPlans = mealPlanService.getMealPlansByUserAndGoal(userId, goal);
        return ResponseEntity.ok(mealPlans);
    }

    @PostMapping("/{id}/days/{dayOfWeek}/meals")
    public ResponseEntity<Void> addMealToDay(
            @PathVariable Long id,
            @PathVariable Integer dayOfWeek,
            @RequestBody MealDTO mealDTO) {
        if (dayOfWeek < 1 || dayOfWeek > 7) {
            return ResponseEntity.badRequest().build();
        }
        try {
            mealPlanService.addMealToDay(id, dayOfWeek, mealDTO);
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}/days/{dayOfWeek}/meals/{mealId}")
    public ResponseEntity<Void> removeMealFromDay(
            @PathVariable Long id,
            @PathVariable Integer dayOfWeek,
            @PathVariable Long mealId) {
        if (dayOfWeek < 1 || dayOfWeek > 7) {
            return ResponseEntity.badRequest().build();
        }
        try {
            mealPlanService.removeMealFromDay(id, dayOfWeek, mealId);
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/days/{dayOfWeek}/meals/{mealId}")
    public ResponseEntity<Void> updateMealInDay(
            @PathVariable Long id,
            @PathVariable Integer dayOfWeek,
            @PathVariable Long mealId,
            @RequestBody MealDTO mealDTO) {
        if (dayOfWeek < 1 || dayOfWeek > 7) {
            return ResponseEntity.badRequest().build();
        }
        try {
            mealPlanService.updateMealInDay(id, dayOfWeek, mealId, mealDTO);
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}/days/{dayOfWeek}/calories")
    public ResponseEntity<Double> getDayTotalCalories(
            @PathVariable Long id,
            @PathVariable Integer dayOfWeek) {
        if (dayOfWeek < 1 || dayOfWeek > 7) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Double calories = mealPlanService.calculateDayTotalCalories(id, dayOfWeek);
            return ResponseEntity.ok(calories);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/nutrition-summary")
    public ResponseEntity<NutritionSummaryDTO> getMealPlanNutrition(@PathVariable Long id) {
        try {
            NutritionSummaryDTO summary = mealPlanService.calculateMealPlanNutrition(id);
            return ResponseEntity.ok(summary);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
