package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.Training.WorkoutProgressDTO;
import com.fitnessdump.FitnessDump.Exception.ResourceNotFoundException;
import com.fitnessdump.FitnessDump.Service.WorkoutProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/workout-progress")
@CrossOrigin(origins = "*")
public class WorkoutProgressController {

    private final WorkoutProgressService workoutProgressService;

    @Autowired
    public WorkoutProgressController(WorkoutProgressService workoutProgressService) {
        this.workoutProgressService = workoutProgressService;
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserProgress(@PathVariable Long userId) {
        try {
            List<WorkoutProgressDTO> progress = workoutProgressService.getUserProgress(userId);
            return ResponseEntity.ok(progress);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user progress: " + e.getMessage());
        }
    }

    // Взема прогрес на потребител по exerciseId
    @GetMapping("/user/{userId}/exercise/{exerciseId}")
    public ResponseEntity<?> getUserExerciseProgress(
            @PathVariable Long userId,
            @PathVariable Long exerciseId) {
        try {
            List<WorkoutProgressDTO> progress = workoutProgressService.getUserExerciseProgress(userId, exerciseId);
            return ResponseEntity.ok(progress);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving exercise progress: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/program/{programId}")
    public ResponseEntity<?> getUserProgressByProgram(
            @PathVariable Long userId,
            @PathVariable Long programId) {
        try {
            List<WorkoutProgressDTO> progress = workoutProgressService.getUserProgressByProgram(userId, programId);
            return ResponseEntity.ok(progress);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving program progress: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/range")
    public ResponseEntity<?> getUserProgressByDateRange(
            @PathVariable Long userId,
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        try {
            List<WorkoutProgressDTO> progress = workoutProgressService.getUserProgressByDateRange(userId, start, end);
            return ResponseEntity.ok(progress);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving date range progress: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> saveProgress(@RequestBody WorkoutProgressDTO progressDTO) {
        try {
            WorkoutProgressDTO savedProgress = workoutProgressService.saveProgress(progressDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProgress);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving progress: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProgress(
            @PathVariable Long id,
            @RequestBody WorkoutProgressDTO progressDTO) {
        try {
            WorkoutProgressDTO updatedProgress = workoutProgressService.updateProgress(id, progressDTO);
            return ResponseEntity.ok(updatedProgress);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating progress: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProgress(@PathVariable Long id) {
        try {
            workoutProgressService.deleteProgress(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting progress: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProgressById(@PathVariable Long id) {
        try {
            WorkoutProgressDTO progress = workoutProgressService.getProgressById(id);
            return ResponseEntity.ok(progress);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving progress: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/latest")
    public ResponseEntity<?> getLatestProgress(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<WorkoutProgressDTO> progress = workoutProgressService.getLatestProgress(userId, limit);
            return ResponseEntity.ok(progress);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving latest progress: " + e.getMessage());
        }
    }

    @GetMapping("/exercise/{exerciseId}")
    public ResponseEntity<?> getProgressByExercise(@PathVariable Long exerciseId) {
        try {
            List<WorkoutProgressDTO> progress = workoutProgressService.getProgressByExercise(exerciseId);
            return ResponseEntity.ok(progress);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving exercise progress: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/exercise/{exerciseId}/stats")
    public ResponseEntity<?> getExerciseStats(@PathVariable Long userId, @PathVariable Long exerciseId) {
        try {
            Double avgWeight = workoutProgressService.getAverageWeightForExercise(userId, exerciseId);
            Integer maxWeight = workoutProgressService.getMaxWeightForExercise(userId, exerciseId);
            Integer avgReps = workoutProgressService.getAverageRepsForExercise(userId, exerciseId);
            Integer maxReps = workoutProgressService.getMaxRepsForExercise(userId, exerciseId);

            var stats = new java.util.HashMap<String, Object>();
            stats.put("averageWeight", avgWeight);
            stats.put("maxWeight", maxWeight);
            stats.put("averageReps", avgReps);
            stats.put("maxReps", maxReps);

            return ResponseEntity.ok(stats);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving exercise stats: " + e.getMessage());
        }
    }
}
