package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.Training.DailyPlanDTO;
import com.fitnessdump.FitnessDump.DTOs.Training.DailyPlanGenerationConfigDTO;
import com.fitnessdump.FitnessDump.Exception.ResourceNotFoundException;
import com.fitnessdump.FitnessDump.Service.DailyPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/daily-plans")
@CrossOrigin(origins = "*")
public class DailyPlanController {

    private final DailyPlanService dailyPlanService;

    @Autowired
    public DailyPlanController(DailyPlanService dailyPlanService) {
        this.dailyPlanService = dailyPlanService;
    }

    @PostMapping
    public ResponseEntity<?> createDailyPlan(@RequestBody DailyPlanDTO dailyPlanDTO) {
        try {
            DailyPlanDTO createdPlan = dailyPlanService.createDailyPlan(dailyPlanDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating daily plan: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDailyPlan(@PathVariable Long id, @RequestBody DailyPlanDTO dailyPlanDTO) {
        try {
            DailyPlanDTO updatedPlan = dailyPlanService.updateDailyPlan(id, dailyPlanDTO);
            return ResponseEntity.ok(updatedPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating daily plan: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDailyPlan(@PathVariable Long id) {
        try {
            dailyPlanService.deleteDailyPlan(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting daily plan: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDailyPlan(@PathVariable Long id) {
        try {
            DailyPlanDTO dailyPlan = dailyPlanService.getDailyPlanById(id);
            return ResponseEntity.ok(dailyPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving daily plan: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserDailyPlans(@PathVariable Long userId) {
        try {
            List<DailyPlanDTO> dailyPlans = dailyPlanService.getUserDailyPlans(userId);
            return ResponseEntity.ok(dailyPlans);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user daily plans: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<?> getActiveDailyPlan(@PathVariable Long userId) {
        try {
            DailyPlanDTO activePlan = dailyPlanService.getActiveDailyPlan(userId);
            return ResponseEntity.ok(activePlan);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No active daily plan found for user " + userId);
        } catch (Exception e) {
            System.err.println("Error in getActiveDailyPlan controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving active daily plan: " + e.getMessage());
        }
    }

    @PostMapping("/user/{userId}/generate")
    public ResponseEntity<?> generateAutomaticDailyPlan(@PathVariable Long userId) {
        try {
            DailyPlanDTO generatedPlan = dailyPlanService.generateAutomaticDailyPlan(userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(generatedPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating automatic daily plan: " + e.getMessage());
        }
    }

    @PostMapping("/user/{userId}/generate-with-config")
    public ResponseEntity<?> generateAutomaticDailyPlanWithConfig(
            @PathVariable Long userId,
            @RequestBody DailyPlanGenerationConfigDTO config) {
        try {
            DailyPlanDTO generatedPlan = dailyPlanService.generateAutomaticDailyPlanWithConfig(userId, config);
            return ResponseEntity.status(HttpStatus.CREATED).body(generatedPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating automatic daily plan with config: " + e.getMessage());
        }
    }

    @PostMapping("/user/{userId}/deactivate-all")
    public ResponseEntity<?> deactivateAllUserPlans(@PathVariable Long userId) {
        try {
            dailyPlanService.deactivateAllUserPlans(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deactivating user plans: " + e.getMessage());
        }
    }
}