package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.Exercise.ProgramExerciseDTO;
import com.fitnessdump.FitnessDump.DTOs.Training.TrainingProgramDTO;
import com.fitnessdump.FitnessDump.Exception.ResourceNotFoundException;
import com.fitnessdump.FitnessDump.Model.Exercise.Exercise;
import com.fitnessdump.FitnessDump.Model.Training.ProgramExercise;
import com.fitnessdump.FitnessDump.Model.Training.TrainingProgram;
import com.fitnessdump.FitnessDump.Model.Training.WorkoutProgress;
import com.fitnessdump.FitnessDump.Model.Users.User;
import com.fitnessdump.FitnessDump.Repository.DailyPlanRepository;
import com.fitnessdump.FitnessDump.Repository.ExerciseRepository;
import com.fitnessdump.FitnessDump.Repository.ProgramExerciseRepository;
import com.fitnessdump.FitnessDump.Repository.TrainingProgramRepository;
import com.fitnessdump.FitnessDump.Repository.UserRepository;
import com.fitnessdump.FitnessDump.Repository.WorkoutProgressRepository;
import com.fitnessdump.FitnessDump.Service.TrainingProgramService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TrainingProgramServiceImpl implements TrainingProgramService {

    private static final Logger logger = LoggerFactory.getLogger(TrainingProgramServiceImpl.class);

    private final TrainingProgramRepository programRepository;
    private final ProgramExerciseRepository programExerciseRepository;
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final WorkoutProgressRepository workoutProgressRepository;
    private final DailyPlanRepository dailyPlanRepository;

    @Autowired
    public TrainingProgramServiceImpl(
            TrainingProgramRepository programRepository,
            ProgramExerciseRepository programExerciseRepository,
            UserRepository userRepository,
            ExerciseRepository exerciseRepository,
            WorkoutProgressRepository workoutProgressRepository,
            DailyPlanRepository dailyPlanRepository) {
        this.programRepository = programRepository;
        this.programExerciseRepository = programExerciseRepository;
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
        this.workoutProgressRepository = workoutProgressRepository;
        this.dailyPlanRepository = dailyPlanRepository;
    }

    private ProgramExerciseDTO convertToDTO(ProgramExercise programExercise) {
        return new ProgramExerciseDTO(
                programExercise.getId(),
                programExercise.getExercise().getId(),
                programExercise.getDayOfWeek(),
                programExercise.getSets(),
                programExercise.getReps(),
                programExercise.getWeight(),
                programExercise.getOrderInDay());
    }

    private TrainingProgramDTO convertToDTO(TrainingProgram program) {
        List<ProgramExerciseDTO> exerciseDTOs = program.getExercises().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new TrainingProgramDTO(
                program.getId(),
                program.getName(),
                program.getDescription(),
                program.getUser().getId(),
                exerciseDTOs);
    }

    @Override
    @Transactional
    public TrainingProgramDTO createProgram(TrainingProgramDTO programDTO) {
        User user = userRepository.findById(programDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + programDTO.getUserId()));

        TrainingProgram program = new TrainingProgram();
        program.setName(programDTO.getName());
        program.setDescription(programDTO.getDescription());
        program.setUser(user);
        program.setExercises(new ArrayList<>());

        TrainingProgram savedProgram = programRepository.save(program);

        if (programDTO.getExercises() != null && !programDTO.getExercises().isEmpty()) {
            List<ProgramExercise> programExercises = new ArrayList<>();

            for (ProgramExerciseDTO exerciseDTO : programDTO.getExercises()) {
                Exercise exercise = exerciseRepository.findById(exerciseDTO.getExerciseId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Exercise not found with ID: " + exerciseDTO.getExerciseId()));

                ProgramExercise programExercise = new ProgramExercise();
                programExercise.setTrainingProgram(savedProgram);
                programExercise.setExercise(exercise);
                programExercise.setDayOfWeek(exerciseDTO.getDayOfWeek());
                programExercise.setSets(exerciseDTO.getSets());
                programExercise.setReps(exerciseDTO.getReps());
                programExercise.setWeight(exerciseDTO.getWeight());
                programExercise.setOrderInDay(exerciseDTO.getOrderInDay());

                programExercises.add(programExerciseRepository.save(programExercise));
            }

            savedProgram.setExercises(programExercises);
        }

        return convertToDTO(savedProgram);
    }

    @Override
    @Transactional
    public TrainingProgramDTO updateProgram(Long id, TrainingProgramDTO programDTO) {
        TrainingProgram program = programRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training program not found with ID: " + id));

        program.setName(programDTO.getName());
        program.setDescription(programDTO.getDescription());

        // Remove existing program exercises
        programExerciseRepository.deleteByTrainingProgramId(program.getId());
        program.getExercises().clear();

        // Add updated program exercises
        if (programDTO.getExercises() != null && !programDTO.getExercises().isEmpty()) {
            List<ProgramExercise> programExercises = new ArrayList<>();

            for (ProgramExerciseDTO exerciseDTO : programDTO.getExercises()) {
                Exercise exercise = exerciseRepository.findById(exerciseDTO.getExerciseId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Exercise not found with ID: " + exerciseDTO.getExerciseId()));

                ProgramExercise programExercise = new ProgramExercise();
                programExercise.setTrainingProgram(program);
                programExercise.setExercise(exercise);
                programExercise.setDayOfWeek(exerciseDTO.getDayOfWeek());
                programExercise.setSets(exerciseDTO.getSets());
                programExercise.setReps(exerciseDTO.getReps());
                programExercise.setWeight(exerciseDTO.getWeight());
                programExercise.setOrderInDay(exerciseDTO.getOrderInDay());

                programExercises.add(programExerciseRepository.save(programExercise));
            }

            program.setExercises(programExercises);
        }

        TrainingProgram updatedProgram = programRepository.save(program);
        return convertToDTO(updatedProgram);
    }

    @Override
    @Transactional
    public void deleteProgram(Long id) {
        logger.info("Starting deletion of training program with ID: {}", id);

        // Проверяваме дали програмата съществува
        if (!programRepository.existsById(id)) {
            logger.error("Training program not found with ID: {}", id);
            throw new ResourceNotFoundException("Training program not found with ID: " + id);
        }

        try {
            // Изтриваме всички DailyPlan записи, свързани с тази програма
            logger.info("Deleting daily plans for training program ID: {}", id);
            dailyPlanRepository.deleteByTrainingProgramId(id);

            // Изтриваме всички WorkoutProgress записи, свързани с тази програма
            logger.info("Deleting workout progress for training program ID: {}", id);
            workoutProgressRepository.deleteByProgramId(id);

            // Изтриваме всички ProgramExercise записи
            logger.info("Deleting program exercises for training program ID: {}", id);
            programExerciseRepository.deleteByTrainingProgramId(id);

            // Накрая изтриваме самата програма
            logger.info("Deleting training program with ID: {}", id);
            programRepository.deleteById(id);

            logger.info("Successfully deleted training program with ID: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting training program with ID: {}", id, e);
            throw e;
        }
    }

    @Override
    public Optional<TrainingProgramDTO> getProgramById(Long id) {
        return programRepository.findById(id).map(this::convertToDTO);
    }

    @Override
    public List<TrainingProgramDTO> getUserPrograms(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }

        return programRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
