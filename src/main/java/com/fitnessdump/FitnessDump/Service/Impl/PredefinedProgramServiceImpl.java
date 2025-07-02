package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.Training.PredefinedProgramDTO;
import com.fitnessdump.FitnessDump.DTOs.Training.TrainingProgramDTO;
import com.fitnessdump.FitnessDump.Model.Enum.DifficultyLevel;
import com.fitnessdump.FitnessDump.Model.Enum.ProgramGoal;
import com.fitnessdump.FitnessDump.Model.Training.PredefinedProgram;
import com.fitnessdump.FitnessDump.Model.Training.ProgramExercise;
import com.fitnessdump.FitnessDump.Model.Training.TrainingProgram;
import com.fitnessdump.FitnessDump.Model.Users.User;
import com.fitnessdump.FitnessDump.Repository.PredefinedProgramRepository;
import com.fitnessdump.FitnessDump.Repository.UserRepository;
import com.fitnessdump.FitnessDump.Repository.TrainingProgramRepository;
import com.fitnessdump.FitnessDump.Repository.ProgramExerciseRepository;
import com.fitnessdump.FitnessDump.Service.PredefinedProgramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PredefinedProgramServiceImpl implements PredefinedProgramService {

    private final PredefinedProgramRepository predefinedProgramRepository;
    private final UserRepository userRepository;
    private final TrainingProgramRepository trainingProgramRepository;
    private final ProgramExerciseRepository programExerciseRepository;

    @Autowired
    public PredefinedProgramServiceImpl(
            PredefinedProgramRepository predefinedProgramRepository,
            UserRepository userRepository,
            TrainingProgramRepository trainingProgramRepository,
            ProgramExerciseRepository programExerciseRepository) {
        this.predefinedProgramRepository = predefinedProgramRepository;
        this.userRepository = userRepository;
        this.trainingProgramRepository = trainingProgramRepository;
        this.programExerciseRepository = programExerciseRepository;
    }

    @Override
    public List<PredefinedProgramDTO> getAllPrograms() {
        return predefinedProgramRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<PredefinedProgramDTO> getProgramById(Long id) {
        return predefinedProgramRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public List<PredefinedProgramDTO> getProgramsByGoal(ProgramGoal goal) {
        return predefinedProgramRepository.findByGoal(goal).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PredefinedProgramDTO> getProgramsByDifficulty(DifficultyLevel difficultyLevel) {
        return predefinedProgramRepository.findByDifficulty(difficultyLevel).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TrainingProgramDTO copyProgramToUser(Long userId, Long programId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PredefinedProgram predefinedProgram = predefinedProgramRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Predefined program not found"));

        TrainingProgram userProgram = new TrainingProgram();
        userProgram.setName(predefinedProgram.getName() + " (Copy)");
        userProgram.setDescription(predefinedProgram.getDescription());
        userProgram.setUser(user);

        trainingProgramRepository.save(userProgram);

        List<ProgramExercise> exercises = predefinedProgram.getExercises().stream()
                .map(predefinedExercise -> {
                    ProgramExercise exercise = new ProgramExercise();
                    exercise.setTrainingProgram(userProgram);
                    exercise.setExercise(predefinedExercise.getExercise());
                    exercise.setDayOfWeek(predefinedExercise.getDayOfWeek());
                    exercise.setSets(predefinedExercise.getSets());
                    exercise.setReps(predefinedExercise.getReps());
                    exercise.setWeight(predefinedExercise.getSuggestedWeight());
                    exercise.setOrderInDay(predefinedExercise.getOrderInDay());
                    return exercise;
                })
                .collect(Collectors.toList());

        programExerciseRepository.saveAll(exercises);
        userProgram.setExercises(exercises);

        return convertToTrainingProgramDTO(userProgram);
    }

    private PredefinedProgramDTO convertToDTO(PredefinedProgram program) {
        PredefinedProgramDTO dto = new PredefinedProgramDTO();
        dto.setId(program.getId());
        dto.setName(program.getName());
        dto.setDescription(program.getDescription());
        dto.setGoal(program.getGoal().name());
        dto.setDurationWeeks(program.getDurationWeeks());
        dto.setDifficultyLevel(program.getDifficulty().name());

        return dto;
    }

    private TrainingProgramDTO convertToTrainingProgramDTO(TrainingProgram program) {
        TrainingProgramDTO dto = new TrainingProgramDTO();
        dto.setId(program.getId());
        dto.setName(program.getName());
        dto.setDescription(program.getDescription());
        dto.setUserId(program.getUser().getId());

        return dto;
    }
}
