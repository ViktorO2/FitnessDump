package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.ExerciseDTO;
import com.fitnessdump.FitnessDump.Model.Exercise;
import com.fitnessdump.FitnessDump.Model.ExerciseCategory;
import com.fitnessdump.FitnessDump.Repository.ExerciseCategoryRepository;
import com.fitnessdump.FitnessDump.Repository.ExerciseRepository;
import com.fitnessdump.FitnessDump.Service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExerciseServiceImpl implements ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseCategoryRepository categoryRepository;

    @Autowired
    public ExerciseServiceImpl(ExerciseRepository exerciseRepository, ExerciseCategoryRepository categoryRepository) {
        this.exerciseRepository = exerciseRepository;
        this.categoryRepository = categoryRepository;
    }

    private ExerciseDTO convertToDTO(Exercise exercise) {
        return new ExerciseDTO(
                exercise.getId(),
                exercise.getName(),
                exercise.getDescription(),
                exercise.getCategory().getId(),
                exercise.getVideoUrl(),
                exercise.getMediaType());
    }

    @Override
    public ExerciseDTO createExercise(ExerciseDTO exerciseDTO) {
        Optional<ExerciseCategory> categoryOptional = categoryRepository.findById(exerciseDTO.getCategoryId());
        if (categoryOptional.isEmpty()) {
            throw new RuntimeException("Category not found with ID: " + exerciseDTO.getCategoryId());
        }

        Exercise exercise = new Exercise();
        exercise.setName(exerciseDTO.getName());
        exercise.setDescription(exerciseDTO.getDescription());
        exercise.setCategory(categoryOptional.get());
        exercise.setVideoUrl(exerciseDTO.getVideoUrl());
        exercise.setMediaType(exerciseDTO.getMediaType());

        Exercise savedExercise = exerciseRepository.save(exercise);
        return convertToDTO(savedExercise);
    }

    @Override
    public ExerciseDTO updateExercise(Long id, ExerciseDTO exerciseDTO) {
        Optional<Exercise> exerciseOptional = exerciseRepository.findById(id);
        if (exerciseOptional.isEmpty()) {
            throw new RuntimeException("Exercise not found with ID: " + id);
        }

        Optional<ExerciseCategory> categoryOptional = categoryRepository.findById(exerciseDTO.getCategoryId());
        if (categoryOptional.isEmpty()) {
            throw new RuntimeException("Category not found with ID: " + exerciseDTO.getCategoryId());
        }

        Exercise exercise = exerciseOptional.get();
        exercise.setName(exerciseDTO.getName());
        exercise.setDescription(exerciseDTO.getDescription());
        exercise.setCategory(categoryOptional.get());
        exercise.setVideoUrl(exerciseDTO.getVideoUrl());
        exercise.setMediaType(exerciseDTO.getMediaType());

        Exercise updatedExercise = exerciseRepository.save(exercise);
        return convertToDTO(updatedExercise);
    }

    @Override
    public void deleteExercise(Long id) {
        exerciseRepository.deleteById(id);
    }

    @Override
    public Optional<ExerciseDTO> getExerciseById(Long id) {
        return exerciseRepository.findById(id).map(this::convertToDTO);
    }

    @Override
    public List<ExerciseDTO> getAllExercises() {
        return exerciseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ExerciseDTO> getExercisesByCategory(Long categoryId) {
        return exerciseRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ExerciseDTO> searchExercisesByName(String query) {
        return exerciseRepository.findByNameContainingIgnoreCase(query).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
