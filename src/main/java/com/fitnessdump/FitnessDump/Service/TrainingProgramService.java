package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.ExerciseCategoryDTO;
import com.fitnessdump.FitnessDump.DTOs.TrainingProgramDTO;

import java.util.List;
import java.util.Optional;

public interface TrainingProgramService {

    TrainingProgramDTO createProgram(TrainingProgramDTO trainingProgramDTO);
    TrainingProgramDTO updateProgram(Long id,TrainingProgramDTO trainingProgramDTO);
    void deleteProgram(Long id);
    Optional<TrainingProgramDTO> getProgramById(Long id);
    List<TrainingProgramDTO> getUserPrograms(Long userId);
}
