package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.WorkoutProgressDTO;

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
}
