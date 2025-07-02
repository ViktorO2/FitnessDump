package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.Training.WorkoutProgressDTO;
import com.fitnessdump.FitnessDump.DTOs.User.PersonalSettingsDTO;
import com.fitnessdump.FitnessDump.DTOs.User.UserDTO;
import com.fitnessdump.FitnessDump.Exception.ResourceNotFoundException;
import com.fitnessdump.FitnessDump.Service.PersonalSettingsService;
import com.fitnessdump.FitnessDump.Service.UserService;
import com.fitnessdump.FitnessDump.Service.WorkoutProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final UserService userService;
    private final PersonalSettingsService personalSettingsService;
    private final WorkoutProgressService workoutProgressService;

    @Autowired
    public DashboardController(
            UserService userService,
            PersonalSettingsService personalSettingsService,
            WorkoutProgressService workoutProgressService) {
        this.userService = userService;
        this.personalSettingsService = personalSettingsService;
        this.workoutProgressService = workoutProgressService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            // За сега връщаме mock данни, тъй като нямаме authentication
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", 1L);
            profile.put("username", "ivan123");
            profile.put("email", "ivan@mail.com");
            profile.put("firstName", "Ivan");
            profile.put("lastName", "Petrov");
            profile.put("role", "USER");

            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving profile: " + e.getMessage());
        }
    }

    @GetMapping("/stats/{userId}")
    public ResponseEntity<?> getUserStats(@PathVariable Long userId) {
        try {
            Map<String, Object> stats = new HashMap<>();

            List<WorkoutProgressDTO> allProgress = workoutProgressService.getUserProgress(userId);
            stats.put("totalWorkouts", allProgress.size());

            LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime endOfMonth = LocalDateTime.now()
                    .withDayOfMonth(LocalDateTime.now().toLocalDate().lengthOfMonth()).withHour(23).withMinute(59)
                    .withSecond(59);
            List<WorkoutProgressDTO> monthlyProgress = workoutProgressService.getUserProgressByDateRange(userId,
                    startOfMonth, endOfMonth);
            stats.put("workoutsThisMonth", monthlyProgress.size());

            double avgDifficulty = allProgress.stream()
                    .filter(p -> p.getDifficultyRating() != null)
                    .mapToInt(WorkoutProgressDTO::getDifficultyRating)
                    .average()
                    .orElse(0.0);
            stats.put("averageDifficulty", Math.round(avgDifficulty * 10.0) / 10.0);

            int totalCalories = allProgress.size() * 300; // Приблизително 300 калории на тренировка
            stats.put("totalCaloriesBurned", totalCalories);

            // Най-често използвано упражнение
            Map<Long, Long> exerciseCount = new HashMap<>();
            allProgress.forEach(p -> {
                exerciseCount.merge(p.getExerciseId(), 1L, Long::sum);
            });

            Long mostUsedExerciseId = exerciseCount.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(null);

            if (mostUsedExerciseId != null) {
                WorkoutProgressDTO mostUsed = allProgress.stream()
                        .filter(p -> p.getExerciseId().equals(mostUsedExerciseId))
                        .findFirst()
                        .orElse(null);
                stats.put("mostUsedExercise", mostUsed != null ? mostUsed.getExerciseName() : "Unknown");
            } else {
                stats.put("mostUsedExercise", "No exercises yet");
            }

            return ResponseEntity.ok(stats);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user stats: " + e.getMessage());
        }
    }

    @GetMapping("/progress/{userId}")
    public ResponseEntity<?> getProgressData(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "month") String period) {
        try {
            LocalDateTime start;
            LocalDateTime end = LocalDateTime.now();

            switch (period.toLowerCase()) {
                case "week":
                    start = end.minusWeeks(1);
                    break;
                case "month":
                    start = end.minusMonths(1);
                    break;
                case "year":
                    start = end.minusYears(1);
                    break;
                default:
                    start = end.minusMonths(1);
            }

            List<WorkoutProgressDTO> progress = workoutProgressService.getUserProgressByDateRange(userId, start, end);

            Map<String, List<WorkoutProgressDTO>> groupedProgress = new HashMap<>();
            progress.forEach(p -> {
                String date = p.getCompletedAt().toLocalDate().toString();
                groupedProgress.computeIfAbsent(date, k -> new java.util.ArrayList<>()).add(p);
            });

            return ResponseEntity.ok(groupedProgress);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving progress data: " + e.getMessage());
        }
    }

    @GetMapping("/activities/{userId}")
    public ResponseEntity<?> getRecentActivities(@PathVariable Long userId) {
        try {
            List<WorkoutProgressDTO> recentProgress = workoutProgressService.getLatestProgress(userId, 10);

            List<Map<String, Object>> activities = recentProgress.stream()
                    .map(p -> {
                        Map<String, Object> activity = new HashMap<>();
                        activity.put("id", p.getId());
                        activity.put("type", "workout");
                        activity.put("title", "Completed " + p.getExerciseName());
                        activity.put("description", p.getCompletedSets() + " sets x " + p.getCompletedReps() + " reps");
                        if (p.getWeightUsed() != null && p.getWeightUsed() > 0) {
                            activity.put("description", activity.get("description") + " @ " + p.getWeightUsed() + "kg");
                        }
                        activity.put("date", p.getCompletedAt());
                        activity.put("difficulty", p.getDifficultyRating());
                        return activity;
                    })
                    .toList();

            return ResponseEntity.ok(activities);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving recent activities: " + e.getMessage());
        }
    }

    @GetMapping("/nutrition/{userId}")
    public ResponseEntity<?> getNutritionSummary(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Map<String, Object> nutrition = new HashMap<>();
            nutrition.put("date", date.toString());
            nutrition.put("totalCalories", 1850);
            nutrition.put("targetCalories", 2000);
            nutrition.put("protein", 120);
            nutrition.put("targetProtein", 150);
            nutrition.put("carbs", 200);
            nutrition.put("targetCarbs", 250);
            nutrition.put("fat", 65);
            nutrition.put("targetFat", 60);
            nutrition.put("meals", List.of(
                    Map.of("type", "breakfast", "calories", 450, "protein", 25, "carbs", 45, "fat", 20),
                    Map.of("type", "lunch", "calories", 650, "protein", 40, "carbs", 70, "fat", 25),
                    Map.of("type", "dinner", "calories", 750, "protein", 55, "carbs", 85, "fat", 20)));

            return ResponseEntity.ok(nutrition);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving nutrition summary: " + e.getMessage());
        }
    }

    @GetMapping("/goals/{userId}")
    public ResponseEntity<?> getUserGoals(@PathVariable Long userId) {
        try {
            PersonalSettingsDTO settings = personalSettingsService.getOrCreatePersonalSettings(userId);

            Map<String, Object> goals = new HashMap<>();
            goals.put("currentWeight", settings.getCurrentWeight());
            goals.put("targetWeight", settings.getTargetWeight());
            goals.put("goal", settings.getGoal() != null ? settings.getGoal().toString() : null);
            goals.put("dailyCalories", settings.getDailyCalories());
            goals.put("targetProtein", settings.getProtein());
            goals.put("targetCarbs", settings.getCarbs());
            goals.put("targetFat", settings.getFats());

            double currentWeight = settings.getCurrentWeight();
            double targetWeight = settings.getTargetWeight();
            if (currentWeight > 0 && targetWeight > 0) {
                double progress = 0.0;
                if ("LOSE_WEIGHT".equals(settings.getGoal() != null ? settings.getGoal().toString() : null)) {
                    double totalToLose = currentWeight - targetWeight;
                    if (totalToLose > 0) {
                        progress = Math.min(100.0, (totalToLose / totalToLose) * 100);
                    }
                } else if ("GAIN_WEIGHT".equals(settings.getGoal() != null ? settings.getGoal().toString() : null)) {
                    double totalToGain = targetWeight - currentWeight;
                    if (totalToGain > 0) {
                        progress = Math.min(100.0, (totalToGain / totalToGain) * 100);
                    }
                }
                goals.put("weightProgress", Math.round(progress * 10.0) / 10.0);
            }

            return ResponseEntity.ok(goals);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user goals: " + e.getMessage());
        }
    }
}