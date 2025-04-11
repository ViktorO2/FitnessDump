package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.ExerciseDTO;

import java.util.List;
import java.util.Optional;

public interface ExerciseService {
    ExerciseDTO createExercise(ExerciseDTO exerciseDTO);
    ExerciseDTO updateExercise(Long id,ExerciseDTO exerciseDTO);
    void deleteExercise(Long id);
    Optional<ExerciseDTO> getExerciseById(Long id);
    List<ExerciseDTO> getAllExercises();
    List<ExerciseDTO> getExercisesByCategory(Long categoryId);
    List<ExerciseDTO> searchExercisesByName(String query);

}
