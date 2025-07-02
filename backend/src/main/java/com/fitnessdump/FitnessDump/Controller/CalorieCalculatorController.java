package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.Meals.MealPlanDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.CalorieCalculatorRequestDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.CalorieCalculatorResponseDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.MealPlanGenerationConfigDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.MealPlanGenerationRequestDTO;
import com.fitnessdump.FitnessDump.DTOs.Training.TrainingProgramDTO;
import com.fitnessdump.FitnessDump.Service.CalorieCalculatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calorie-calculator")
@CrossOrigin(origins = "*")
public class CalorieCalculatorController {

    private final CalorieCalculatorService calorieCalculatorService;

    @Autowired
    public CalorieCalculatorController(CalorieCalculatorService calorieCalculatorService) {
        this.calorieCalculatorService = calorieCalculatorService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<?> calculateNutrition(@RequestBody CalorieCalculatorRequestDTO request) {
        try {
            CalorieCalculatorResponseDTO response = calorieCalculatorService.calculateNutrition(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error calculating nutrition: " + e.getMessage());
        }
    }

    @PostMapping("/calculate-and-save/{userId}")
    public ResponseEntity<?> calculateAndSaveToPersonalSettings(
            @PathVariable Long userId,
            @RequestBody CalorieCalculatorRequestDTO request) {
        try {
            CalorieCalculatorResponseDTO response = calorieCalculatorService.calculateAndSaveToPersonalSettings(userId,
                    request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error calculating and saving nutrition: " + e.getMessage());
        }
    }

    @PostMapping("/generate-meal-plan/{userId}")
    public ResponseEntity<?> generateMealPlan(
            @PathVariable Long userId,
            @RequestBody CalorieCalculatorRequestDTO request) {
        try {
            MealPlanDTO mealPlan = calorieCalculatorService.generateMealPlan(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(mealPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating meal plan: " + e.getMessage());
        }
    }

    @PostMapping("/generate-smart-meal-plan/{userId}")
    public ResponseEntity<?> generateSmartMealPlan(
            @PathVariable Long userId,
            @RequestBody CalorieCalculatorRequestDTO request,
            @RequestParam(defaultValue = "true") boolean includeWorkoutDays) {
        try {
            MealPlanDTO mealPlan = calorieCalculatorService.generateSmartMealPlan(userId, request, includeWorkoutDays);
            return ResponseEntity.status(HttpStatus.CREATED).body(mealPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating smart meal plan: " + e.getMessage());
        }
    }

    @PostMapping("/generate-meal-plan-with-config/{userId}")
    public ResponseEntity<?> generateMealPlanWithConfig(
            @PathVariable Long userId,
            @RequestBody MealPlanGenerationRequestDTO request) {
        try {
            MealPlanDTO mealPlan = calorieCalculatorService.generateMealPlanWithConfig(userId, request.getRequest(),
                    request.getConfig());
            return ResponseEntity.status(HttpStatus.CREATED).body(mealPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating meal plan with config: " + e.getMessage());
        }
    }

    @PostMapping("/generate-smart-meal-plan-with-config/{userId}")
    public ResponseEntity<?> generateSmartMealPlanWithConfig(
            @PathVariable Long userId,
            @RequestBody MealPlanGenerationRequestDTO request) {
        try {
            MealPlanDTO mealPlan = calorieCalculatorService.generateSmartMealPlanWithConfig(userId,
                    request.getRequest(), request.getConfig());
            return ResponseEntity.status(HttpStatus.CREATED).body(mealPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating smart meal plan with config: " + e.getMessage());
        }
    }

    @PostMapping("/generate-training-program/{userId}")
    public ResponseEntity<?> generateTrainingProgram(
            @PathVariable Long userId,
            @RequestBody CalorieCalculatorRequestDTO request) {
        try {
            TrainingProgramDTO trainingProgram = calorieCalculatorService.generateTrainingProgram(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(trainingProgram);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating training program: " + e.getMessage());
        }
    }

    @PostMapping("/generate-daily-plan/{userId}")
    public ResponseEntity<?> generateDailyPlan(
            @PathVariable Long userId,
            @RequestBody CalorieCalculatorRequestDTO request) {
        try {
            calorieCalculatorService.generateDailyPlan(userId, request);
            return ResponseEntity.ok().body("Daily plan generated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating daily plan: " + e.getMessage());
        }
    }
}