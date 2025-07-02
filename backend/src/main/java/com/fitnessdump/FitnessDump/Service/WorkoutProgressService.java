package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.Training.WorkoutProgressDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface WorkoutProgressService {
    WorkoutProgressDTO saveProgress(WorkoutProgressDTO progressDTO);

    WorkoutProgressDTO updateProgress(Long id, WorkoutProgressDTO progressDTO);

    void deleteProgress(Long id);

    List<WorkoutProgressDTO> getUserProgress(Long userId);

    List<WorkoutProgressDTO> getUserExerciseProgress(Long userId, Long exerciseId);

    List<WorkoutProgressDTO> getUserProgressByProgram(Long userId, Long programId);

    List<WorkoutProgressDTO> getUserProgressByDateRange(Long userId, LocalDateTime start, LocalDateTime end);

    // Нови полезни методи
    WorkoutProgressDTO getProgressById(Long id);

    List<WorkoutProgressDTO> getLatestProgress(Long userId, int limit);

    List<WorkoutProgressDTO> getProgressByExercise(Long exerciseId);

    Double getAverageWeightForExercise(Long userId, Long exerciseId);

    Integer getMaxWeightForExercise(Long userId, Long exerciseId);

    Integer getAverageRepsForExercise(Long userId, Long exerciseId);

    Integer getMaxRepsForExercise(Long userId, Long exerciseId);
}
