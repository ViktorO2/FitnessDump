package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.WorkoutProgressDTO;
import com.fitnessdump.FitnessDump.Model.Exercise;
import com.fitnessdump.FitnessDump.Model.TrainingProgram;
import com.fitnessdump.FitnessDump.Model.User;
import com.fitnessdump.FitnessDump.Model.WorkoutProgress;
import com.fitnessdump.FitnessDump.Repository.ExerciseRepository;
import com.fitnessdump.FitnessDump.Repository.TrainingProgramRepository;
import com.fitnessdump.FitnessDump.Repository.UserRepository;
import com.fitnessdump.FitnessDump.Repository.WorkoutProgressRepository;
import com.fitnessdump.FitnessDump.Service.WorkoutProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
        User user = userRepository.findById(progressDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TrainingProgram program = programRepository.findById(progressDTO.getProgramId())
                .orElseThrow(() -> new RuntimeException("Program not found"));

        Exercise exercise = exerciseRepository.findById(progressDTO.getExerciseId())
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        // validateProgressData(progressDTO);

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
                .orElseThrow(() -> new RuntimeException("Progress not found"));

        // validateProgressData(progressDTO);

        if (progressDTO.getExerciseId() != null) {
            Exercise exercise = exerciseRepository.findById(progressDTO.getExerciseId())
                    .orElseThrow(() -> new RuntimeException("Exercise not found"));
            existingProgress.setExercise(exercise);
        }

        existingProgress.setCompletedSets(progressDTO.getCompletedSets());
        existingProgress.setCompletedReps(progressDTO.getCompletedReps());
        existingProgress.setWeightUsed(progressDTO.getWeightUsed());
        existingProgress.setNotes(progressDTO.getNotes());
        existingProgress.setDifficultyRating(progressDTO.getDifficultyRating());
        existingProgress.setCompleted(progressDTO.getCompleted());

        WorkoutProgress updatedProgress = progressRepository.save(existingProgress);
        return convertToDTO(updatedProgress);
    }

    @Override
    @Transactional
    public void deleteProgress(Long id) {
        progressRepository.deleteById(id);
    }

    @Override
    public List<WorkoutProgressDTO> getUserProgress(Long userId) {
        return progressRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<WorkoutProgressDTO> getUserExerciseProgress(Long userId, Long exerciseId) {
        return progressRepository.findByUserIdAndExerciseId(userId,exerciseId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<WorkoutProgressDTO> getUserProgressByProgram(Long userId, Long programId) {
        return progressRepository.findByUserIdAndProgramId(userId, programId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<WorkoutProgressDTO> getUserProgressByDateRange(Long userId, LocalDateTime start, LocalDateTime end) {
        return progressRepository.findByUserIdAndCompletedAtBetween(userId, start, end).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // private void validateProgressData(WorkoutProgressDTO progressDTO) {
    // if (progressDTO.getCompletedSets() != null && progressDTO.getCompletedSets()
    // < 0) {
    // throw new IllegalArgumentException("Completed sets cannot be negative");
    // }
    // if (progressDTO.getCompletedReps() != null && progressDTO.getCompletedReps()
    // < 0) {
    // throw new IllegalArgumentException("Completed reps cannot be negative");
    // }
    // if (progressDTO.getWeightUsed() != null && progressDTO.getWeightUsed() < 0) {
    // throw new IllegalArgumentException("Weight cannot be negative");
    // }
    // if (progressDTO.getDifficultyRating() != null &&
    // (progressDTO.getDifficultyRating() < 1 || progressDTO.getDifficultyRating() >
    // 5)) {
    // throw new IllegalArgumentException("Difficulty rating must be between 1 and
    // 5");
    // }
    // }

    private WorkoutProgressDTO convertToDTO(WorkoutProgress progress) {
        WorkoutProgressDTO dto = new WorkoutProgressDTO();
        dto.setId(progress.getId());
        dto.setUserId(progress.getUser().getId());
        dto.setProgramId(progress.getProgram().getId());
        dto.setExerciseId(progress.getExercise().getId());
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
