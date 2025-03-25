package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.TrainingSessionDTO;

import java.util.List;
import java.util.Optional;

public interface TrainingSessionService {
    TrainingSessionDTO createTrainingSession(TrainingSessionDTO trainingSessionDTO);
    List<TrainingSessionDTO> getTrainingSessionsByUserId(Long userId);
    Optional<TrainingSessionDTO> getTrainingSessionById(Long id);
    void deleteTrainingSessionById(Long id);
}
