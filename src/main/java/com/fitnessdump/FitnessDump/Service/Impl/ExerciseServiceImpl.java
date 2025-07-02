package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.Exercise.ExerciseDTO;
import com.fitnessdump.FitnessDump.Model.Exercise.Exercise;
import com.fitnessdump.FitnessDump.Model.Exercise.ExerciseCategory;
import com.fitnessdump.FitnessDump.Model.Training.ProgramExercise;
import com.fitnessdump.FitnessDump.Repository.ExerciseCategoryRepository;
import com.fitnessdump.FitnessDump.Repository.ExerciseRepository;
import com.fitnessdump.FitnessDump.Repository.ProgramExerciseRepository;
import com.fitnessdump.FitnessDump.Repository.WorkoutProgressRepository;
import com.fitnessdump.FitnessDump.Service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExerciseServiceImpl implements ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseCategoryRepository categoryRepository;
    private final ProgramExerciseRepository programExerciseRepository;
    private final WorkoutProgressRepository workoutProgressRepository;

    @Autowired
    public ExerciseServiceImpl(ExerciseRepository exerciseRepository,
            ExerciseCategoryRepository categoryRepository,
            ProgramExerciseRepository programExerciseRepository,
            WorkoutProgressRepository workoutProgressRepository) {
        this.exerciseRepository = exerciseRepository;
        this.categoryRepository = categoryRepository;
        this.programExerciseRepository = programExerciseRepository;
        this.workoutProgressRepository = workoutProgressRepository;
    }

    private ExerciseDTO convertToDTO(Exercise exercise) {
        return new ExerciseDTO(
                exercise.getId(),
                exercise.getName(),
                exercise.getDescription(),
                exercise.getCategory() != null ? exercise.getCategory().getId() : null,
                exercise.getVideoUrl(),
                exercise.getMediaType());
    }

    @Override
    public ExerciseDTO createExercise(ExerciseDTO exerciseDTO) {
        if (exerciseDTO.getCategoryId() == null || exerciseDTO.getCategoryId() <= 0) {
            throw new RuntimeException("Category ID is required and must be greater than 0");
        }
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

        if (exerciseDTO.getCategoryId() == null || exerciseDTO.getCategoryId() <= 0) {
            throw new RuntimeException("Category ID is required and must be greater than 0");
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
    @Transactional
    public void deleteExercise(Long id) {
        Optional<Exercise> exerciseOptional = exerciseRepository.findById(id);
        if (exerciseOptional.isEmpty()) {
            throw new RuntimeException("Exercise not found with ID: " + id);
        }

        Exercise exercise = exerciseOptional.get();

        workoutProgressRepository.deleteByExerciseId(id);

        programExerciseRepository.deleteByExerciseId(id);

        // Now delete the exercise
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
