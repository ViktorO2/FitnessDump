package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.Exercise.ExerciseCategoryDTO;
import com.fitnessdump.FitnessDump.Model.Exercise.Exercise;
import com.fitnessdump.FitnessDump.Model.Exercise.ExerciseCategory;
import com.fitnessdump.FitnessDump.Repository.ExerciseCategoryRepository;
import com.fitnessdump.FitnessDump.Repository.ExerciseRepository;
import com.fitnessdump.FitnessDump.Service.ExerciseCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExerciseCategoryServiceImpl implements ExerciseCategoryService {

    private final ExerciseCategoryRepository categoryRepository;
    private final ExerciseRepository exerciseRepository;

    @Autowired
    public ExerciseCategoryServiceImpl(ExerciseCategoryRepository categoryRepository,
            ExerciseRepository exerciseRepository) {
        this.categoryRepository = categoryRepository;
        this.exerciseRepository = exerciseRepository;
    }

    private ExerciseCategoryDTO convertToDTO(ExerciseCategory category) {
        return new ExerciseCategoryDTO(
                category.getId(),
                category.getName(),
                category.getDescription());
    }

    @Override
    public ExerciseCategoryDTO createCategory(ExerciseCategoryDTO categoryDTO) {
        ExerciseCategory category = new ExerciseCategory();
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());

        ExerciseCategory savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }

    @Override
    public ExerciseCategoryDTO updateCategory(Long id, ExerciseCategoryDTO categoryDTO) {
        Optional<ExerciseCategory> categoryOptional = categoryRepository.findById(id);
        if (categoryOptional.isEmpty()) {
            throw new RuntimeException("Category not found with ID: " + id);
        }

        ExerciseCategory category = categoryOptional.get();
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());

        ExerciseCategory updatedCategory = categoryRepository.save(category);
        return convertToDTO(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Optional<ExerciseCategory> categoryOptional = categoryRepository.findById(id);
        if (categoryOptional.isEmpty()) {
            throw new RuntimeException("Category not found with ID: " + id);
        }

        ExerciseCategory category = categoryOptional.get();

        List<Exercise> exercisesInCategory = exerciseRepository.findByCategoryId(id);

        if (!exercisesInCategory.isEmpty()) {
            exerciseRepository.deleteAll(exercisesInCategory);
        }

        categoryRepository.deleteById(id);
    }

    @Override
    public Optional<ExerciseCategoryDTO> getCategoryById(Long id) {
        return categoryRepository.findById(id).map(this::convertToDTO);
    }

    @Override
    public List<ExerciseCategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
