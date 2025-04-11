package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.ProgramExerciseDTO;
import com.fitnessdump.FitnessDump.DTOs.TrainingProgramDTO;
import com.fitnessdump.FitnessDump.Model.Exercise;
import com.fitnessdump.FitnessDump.Model.ProgramExercise;
import com.fitnessdump.FitnessDump.Model.TrainingProgram;
import com.fitnessdump.FitnessDump.Model.User;
import com.fitnessdump.FitnessDump.Repository.ExerciseRepository;
import com.fitnessdump.FitnessDump.Repository.ProgramExerciseRepository;
import com.fitnessdump.FitnessDump.Repository.TrainingProgramRepository;
import com.fitnessdump.FitnessDump.Repository.UserRepository;
import com.fitnessdump.FitnessDump.Service.TrainingProgramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TrainingProgramServiceImpl implements TrainingProgramService {

    private final TrainingProgramRepository programRepository;
    private final ProgramExerciseRepository programExerciseRepository;
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;

    @Autowired
    public TrainingProgramServiceImpl(
            TrainingProgramRepository programRepository,
            ProgramExerciseRepository programExerciseRepository,
            UserRepository userRepository,
            ExerciseRepository exerciseRepository) {
        this.programRepository = programRepository;
        this.programExerciseRepository = programExerciseRepository;
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
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
        Optional<User> userOptional = userRepository.findById(programDTO.getUserId());
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + programDTO.getUserId());
        }

        TrainingProgram program = new TrainingProgram();
        program.setName(programDTO.getName());
        program.setDescription(programDTO.getDescription());
        program.setUser(userOptional.get());
        program.setExercises(new ArrayList<>());

        TrainingProgram savedProgram = programRepository.save(program);

        if (programDTO.getExercises() != null && !programDTO.getExercises().isEmpty()) {
            List<ProgramExercise> programExercises = new ArrayList<>();

            for (ProgramExerciseDTO exerciseDTO : programDTO.getExercises()) {
                Optional<Exercise> exerciseOptional = exerciseRepository.findById(exerciseDTO.getExerciseId());
                if (exerciseOptional.isEmpty()) {
                    throw new RuntimeException("Exercise not found with ID: " + exerciseDTO.getExerciseId());
                }

                ProgramExercise programExercise = new ProgramExercise();
                programExercise.setTrainingProgram(savedProgram);
                programExercise.setExercise(exerciseOptional.get());
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
        Optional<TrainingProgram> programOptional = programRepository.findById(id);
        if (programOptional.isEmpty()) {
            throw new RuntimeException("Training program not found with ID: " + id);
        }

        TrainingProgram program = programOptional.get();
        program.setName(programDTO.getName());
        program.setDescription(programDTO.getDescription());

        // Remove existing program exercises
        programExerciseRepository.deleteByTrainingProgramId(program.getId());
        program.getExercises().clear();

        // Add updated program exercises
        if (programDTO.getExercises() != null && !programDTO.getExercises().isEmpty()) {
            List<ProgramExercise> programExercises = new ArrayList<>();

            for (ProgramExerciseDTO exerciseDTO : programDTO.getExercises()) {
                Optional<Exercise> exerciseOptional = exerciseRepository.findById(exerciseDTO.getExerciseId());
                if (exerciseOptional.isEmpty()) {
                    throw new RuntimeException("Exercise not found with ID: " + exerciseDTO.getExerciseId());
                }

                ProgramExercise programExercise = new ProgramExercise();
                programExercise.setTrainingProgram(program);
                programExercise.setExercise(exerciseOptional.get());
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
        programExerciseRepository.deleteByTrainingProgramId(id);
        programRepository.deleteById(id);
    }

    @Override
    public Optional<TrainingProgramDTO> getProgramById(Long id) {
        return programRepository.findById(id).map(this::convertToDTO);
    }

    @Override
    public List<TrainingProgramDTO> getUserPrograms(Long userId) {
        return programRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
