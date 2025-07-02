package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.Exercise.ExerciseCategoryDTO;

import java.util.List;
import java.util.Optional;

public interface ExerciseCategoryService {
    ExerciseCategoryDTO createCategory(ExerciseCategoryDTO exerciseCategoryDTO);

    ExerciseCategoryDTO updateCategory(Long id, ExerciseCategoryDTO exerciseCategoryDTO);

    void deleteCategory(Long id);

    Optional<ExerciseCategoryDTO> getCategoryById(Long id);

    List<ExerciseCategoryDTO> getAllCategories();
}
