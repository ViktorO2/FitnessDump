package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.WorkoutProgressDTO;
import com.fitnessdump.FitnessDump.Service.WorkoutProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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

    // Взема целия прогрес на потребител
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkoutProgressDTO>> getUserProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(workoutProgressService.getUserProgress(userId));
    }

    // Взема прогрес на потребител по exerciseId
    @GetMapping("/user/{userId}/exercise/{exerciseId}")
    public ResponseEntity<List<WorkoutProgressDTO>> getUserExerciseProgress(
            @PathVariable Long userId,
            @PathVariable Long exerciseId) {
        return ResponseEntity.ok(workoutProgressService.getUserExerciseProgress(userId, exerciseId));
    }

    // Взема прогрес на потребител по програма
    @GetMapping("/user/{userId}/program/{programId}")
    public ResponseEntity<List<WorkoutProgressDTO>> getUserProgressByProgram(
            @PathVariable Long userId,
            @PathVariable Long programId) {
        return ResponseEntity.ok(workoutProgressService.getUserProgressByProgram(userId, programId));
    }

    // Взема прогрес по диапазон от дати
    @GetMapping("/user/{userId}/range")
    public ResponseEntity<List<WorkoutProgressDTO>> getUserProgressByDateRange(
            @PathVariable Long userId,
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(workoutProgressService.getUserProgressByDateRange(userId, start, end));
    }

    // Създаване на нов запис
    @PostMapping
    public ResponseEntity<WorkoutProgressDTO> saveProgress(@RequestBody WorkoutProgressDTO progressDTO) {
        return ResponseEntity.ok(workoutProgressService.saveProgress(progressDTO));
    }

    // Актуализация на запис
    @PutMapping("/{id}")
    public ResponseEntity<WorkoutProgressDTO> updateProgress(
            @PathVariable Long id,
            @RequestBody WorkoutProgressDTO progressDTO) {
        return ResponseEntity.ok(workoutProgressService.updateProgress(id, progressDTO));
    }

    // Изтриване на запис
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable Long id) {
        workoutProgressService.deleteProgress(id);
        return ResponseEntity.noContent().build();
    }
}
