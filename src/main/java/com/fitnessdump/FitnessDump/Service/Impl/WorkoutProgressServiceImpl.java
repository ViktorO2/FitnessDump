package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.Training.WorkoutProgressDTO;
import com.fitnessdump.FitnessDump.Exception.ResourceNotFoundException;
import com.fitnessdump.FitnessDump.Model.Exercise.Exercise;
import com.fitnessdump.FitnessDump.Model.Training.TrainingProgram;
import com.fitnessdump.FitnessDump.Model.Users.User;
import com.fitnessdump.FitnessDump.Model.Training.WorkoutProgress;
import com.fitnessdump.FitnessDump.Repository.ExerciseRepository;
import com.fitnessdump.FitnessDump.Repository.TrainingProgramRepository;
import com.fitnessdump.FitnessDump.Repository.UserRepository;
import com.fitnessdump.FitnessDump.Repository.WorkoutProgressRepository;
import com.fitnessdump.FitnessDump.Service.WorkoutProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutProgressServiceImpl implements WorkoutProgressService {

    private final WorkoutProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final TrainingProgramRepository programRepository;
    private final ExerciseRepository exerciseRepository;

    @Autowired
    public WorkoutProgressServiceImpl(
            WorkoutProgressRepository progressRepository,
            UserRepository userRepository,
            TrainingProgramRepository programRepository,
            ExerciseRepository exerciseRepository) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
        this.programRepository = programRepository;
        this.exerciseRepository = exerciseRepository;
    }

    @Override
    @Transactional
    public WorkoutProgressDTO saveProgress(WorkoutProgressDTO progressDTO) {
        validateProgressData(progressDTO);

        User user = userRepository.findById(progressDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + progressDTO.getUserId()));

        TrainingProgram program = programRepository.findById(progressDTO.getProgramId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Training program not found with id: " + progressDTO.getProgramId()));

        Exercise exercise = exerciseRepository.findById(progressDTO.getExerciseId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Exercise not found with id: " + progressDTO.getExerciseId()));

        if (progressDTO.getCompletedAt() == null) {
            progressDTO.setCompletedAt(LocalDateTime.now());
        }

        if (progressDTO.getCompleted() == null) {
            progressDTO.setCompleted(true);
        }

        WorkoutProgress progress = new WorkoutProgress();
        progress.setUser(user);
        progress.setProgram(program);
        progress.setExercise(exercise);
        progress.setCompletedAt(progressDTO.getCompletedAt());
        progress.setCompletedSets(progressDTO.getCompletedSets());
        progress.setCompletedReps(progressDTO.getCompletedReps());
        progress.setWeightUsed(progressDTO.getWeightUsed());
        progress.setNotes(progressDTO.getNotes());
        progress.setDifficultyRating(progressDTO.getDifficultyRating());
        progress.setCompleted(progressDTO.getCompleted());

        WorkoutProgress savedProgress = progressRepository.save(progress);
        return convertToDTO(savedProgress);
    }

    @Override
    @Transactional
    public WorkoutProgressDTO updateProgress(Long id, WorkoutProgressDTO progressDTO) {
        WorkoutProgress existingProgress = progressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found with id: " + id));

        validateProgressData(progressDTO);

        if (progressDTO.getExerciseId() != null) {
            Exercise exercise = exerciseRepository.findById(progressDTO.getExerciseId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Exercise not found with id: " + progressDTO.getExerciseId()));
            existingProgress.setExercise(exercise);
        }

        if (progressDTO.getCompletedSets() != null) {
            existingProgress.setCompletedSets(progressDTO.getCompletedSets());
        }
        if (progressDTO.getCompletedReps() != null) {
            existingProgress.setCompletedReps(progressDTO.getCompletedReps());
        }
        if (progressDTO.getWeightUsed() != null) {
            existingProgress.setWeightUsed(progressDTO.getWeightUsed());
        }
        if (progressDTO.getNotes() != null) {
            existingProgress.setNotes(progressDTO.getNotes());
        }
        if (progressDTO.getDifficultyRating() != null) {
            existingProgress.setDifficultyRating(progressDTO.getDifficultyRating());
        }
        if (progressDTO.getCompleted() != null) {
            existingProgress.setCompleted(progressDTO.getCompleted());
        }
        if (progressDTO.getCompletedAt() != null) {
            existingProgress.setCompletedAt(progressDTO.getCompletedAt());
        }

        WorkoutProgress updatedProgress = progressRepository.save(existingProgress);
        return convertToDTO(updatedProgress);
    }

    @Override
    @Transactional
    public void deleteProgress(Long id) {
        if (!progressRepository.existsById(id)) {
            throw new ResourceNotFoundException("Progress not found with id: " + id);
        }
        progressRepository.deleteById(id);
    }

    @Override
    public List<WorkoutProgressDTO> getUserProgress(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        return progressRepository.findByUserId(userId).stream()
                .sorted(Comparator.comparing(WorkoutProgress::getCompletedAt).reversed())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<WorkoutProgressDTO> getUserExerciseProgress(Long userId, Long exerciseId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        if (!exerciseRepository.existsById(exerciseId)) {
            throw new ResourceNotFoundException("Exercise not found with id: " + exerciseId);
        }

        return progressRepository.findByUserIdAndExerciseId(userId, exerciseId).stream()
                .sorted(Comparator.comparing(WorkoutProgress::getCompletedAt).reversed())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<WorkoutProgressDTO> getUserProgressByProgram(Long userId, Long programId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        if (!programRepository.existsById(programId)) {
            throw new ResourceNotFoundException("Training program not found with id: " + programId);
        }

        return progressRepository.findByUserIdAndProgramId(userId, programId).stream()
                .sorted(Comparator.comparing(WorkoutProgress::getCompletedAt).reversed())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<WorkoutProgressDTO> getUserProgressByDateRange(Long userId, LocalDateTime start, LocalDateTime end) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        if (start.isAfter(end)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }

        return progressRepository.findByUserIdAndCompletedAtBetween(userId, start, end).stream()
                .sorted(Comparator.comparing(WorkoutProgress::getCompletedAt).reversed())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WorkoutProgressDTO getProgressById(Long id) {
        WorkoutProgress progress = progressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found with id: " + id));
        return convertToDTO(progress);
    }

    @Override
    public List<WorkoutProgressDTO> getLatestProgress(Long userId, int limit) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        if (limit <= 0) {
            throw new IllegalArgumentException("Limit must be positive");
        }

        Pageable pageable = PageRequest.of(0, limit);
        return progressRepository.findByUserIdOrderByCompletedAtDesc(userId, pageable).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<WorkoutProgressDTO> getProgressByExercise(Long exerciseId) {
        if (!exerciseRepository.existsById(exerciseId)) {
            throw new ResourceNotFoundException("Exercise not found with id: " + exerciseId);
        }

        return progressRepository.findByExerciseId(exerciseId).stream()
                .sorted(Comparator.comparing(WorkoutProgress::getCompletedAt).reversed())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Double getAverageWeightForExercise(Long userId, Long exerciseId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        if (!exerciseRepository.existsById(exerciseId)) {
            throw new ResourceNotFoundException("Exercise not found with id: " + exerciseId);
        }

        return progressRepository.getAverageWeightForExercise(userId, exerciseId);
    }

    @Override
    public Integer getMaxWeightForExercise(Long userId, Long exerciseId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        if (!exerciseRepository.existsById(exerciseId)) {
            throw new ResourceNotFoundException("Exercise not found with id: " + exerciseId);
        }

        Double maxWeight = progressRepository.getMaxWeightForExercise(userId, exerciseId);
        return maxWeight != null ? maxWeight.intValue() : null;
    }

    @Override
    public Integer getAverageRepsForExercise(Long userId, Long exerciseId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        if (!exerciseRepository.existsById(exerciseId)) {
            throw new ResourceNotFoundException("Exercise not found with id: " + exerciseId);
        }

        Double avgReps = progressRepository.getAverageRepsForExercise(userId, exerciseId);
        return avgReps != null ? avgReps.intValue() : null;
    }

    @Override
    public Integer getMaxRepsForExercise(Long userId, Long exerciseId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        if (!exerciseRepository.existsById(exerciseId)) {
            throw new ResourceNotFoundException("Exercise not found with id: " + exerciseId);
        }

        return progressRepository.getMaxRepsForExercise(userId, exerciseId);
    }

    private void validateProgressData(WorkoutProgressDTO progressDTO) {
        if (progressDTO.getCompletedSets() != null && progressDTO.getCompletedSets() < 0) {
            throw new IllegalArgumentException("Completed sets cannot be negative");
        }
        if (progressDTO.getCompletedReps() != null && progressDTO.getCompletedReps() < 0) {
            throw new IllegalArgumentException("Completed reps cannot be negative");
        }
        if (progressDTO.getWeightUsed() != null && progressDTO.getWeightUsed() < 0) {
            throw new IllegalArgumentException("Weight cannot be negative");
        }
        if (progressDTO.getDifficultyRating() != null &&
                (progressDTO.getDifficultyRating() < 1 || progressDTO.getDifficultyRating() > 5)) {
            throw new IllegalArgumentException("Difficulty rating must be between 1 and 5");
        }
        if (progressDTO.getCompletedAt() != null && progressDTO.getCompletedAt().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Completed date cannot be in the future");
        }
    }

    private WorkoutProgressDTO convertToDTO(WorkoutProgress progress) {
        WorkoutProgressDTO dto = new WorkoutProgressDTO();
        dto.setId(progress.getId());
        dto.setUserId(progress.getUser().getId());
        dto.setProgramId(progress.getProgram().getId());
        dto.setExerciseId(progress.getExercise().getId());
        dto.setExerciseName(progress.getExercise().getName());
        dto.setProgramName(progress.getProgram().getName());
        dto.setCompletedAt(progress.getCompletedAt());
        dto.setCompletedSets(progress.getCompletedSets());
        dto.setCompletedReps(progress.getCompletedReps());
        dto.setWeightUsed(progress.getWeightUsed());
        dto.setNotes(progress.getNotes());
        dto.setDifficultyRating(progress.getDifficultyRating());
        dto.setCompleted(progress.getCompleted());
        return dto;
    }
}
