package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.PredefinedProgramDTO;
import com.fitnessdump.FitnessDump.DTOs.TrainingProgramDTO;
import com.fitnessdump.FitnessDump.Model.Enum.DifficultyLevel;
import com.fitnessdump.FitnessDump.Model.Enum.ProgramGoal;

import java.util.List;
import java.util.Optional;

public interface PredefinedProgramService {
    List<PredefinedProgramDTO> getAllPrograms();

    Optional<PredefinedProgramDTO> getProgramById(Long id);

    List<PredefinedProgramDTO> getProgramsByGoal(ProgramGoal goal);

    List<PredefinedProgramDTO> getProgramsByDifficulty(DifficultyLevel difficultyLevel);

    TrainingProgramDTO copyProgramToUser(Long userId, Long programId);

}
