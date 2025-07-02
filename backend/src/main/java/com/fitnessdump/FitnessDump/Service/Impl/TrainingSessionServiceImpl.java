package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.Training.TrainingSessionDTO;
import com.fitnessdump.FitnessDump.Model.Training.TrainingSession;
import com.fitnessdump.FitnessDump.Model.Users.User;
import com.fitnessdump.FitnessDump.Repository.TrainingSessionRepository;
import com.fitnessdump.FitnessDump.Repository.UserRepository;
import com.fitnessdump.FitnessDump.Service.TrainingSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TrainingSessionServiceImpl implements TrainingSessionService {

    private final TrainingSessionRepository trainingSessionRepository;
    private final UserRepository userRepository;

    @Autowired
    public TrainingSessionServiceImpl(TrainingSessionRepository trainingSessionRepository, UserRepository userRepository) {
        this.trainingSessionRepository = trainingSessionRepository;
        this.userRepository = userRepository;
    }

    private TrainingSessionDTO convertToDTO(TrainingSession trainingSession) {
        return new TrainingSessionDTO(
                trainingSession.getUser().getId(),
                trainingSession.getName(),
                trainingSession.getDescription(),
                trainingSession.getDate(),
                trainingSession.getDurationMinutes()
        );
    }

    @Override
    public TrainingSessionDTO createTrainingSession(TrainingSessionDTO trainingSessionDTO) {
        Optional<User> userOptional = userRepository.findById(trainingSessionDTO.getUserId());
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + trainingSessionDTO.getUserId());
        }

        TrainingSession trainingSession = new TrainingSession();
        trainingSession.setUser(userOptional.get());
        trainingSession.setName(trainingSessionDTO.getName());
        trainingSession.setDescription(trainingSessionDTO.getDescription());
        trainingSession.setDate(trainingSessionDTO.getDate());
        trainingSession.setDurationMinutes(trainingSessionDTO.getDurationMinutes());


        TrainingSession savedTrainingSession = trainingSessionRepository.save(trainingSession);
        return convertToDTO(savedTrainingSession);
    }

    @Override
    public List<TrainingSessionDTO> getTrainingSessionsByUserId(Long userId) {
        return trainingSessionRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<TrainingSessionDTO> getTrainingSessionById(Long id) {
        Optional<TrainingSession> trainingSession = trainingSessionRepository.findById(id);
        return trainingSession.map(this::convertToDTO);
    }

    @Override
    public void deleteTrainingSessionById(Long id) {
        trainingSessionRepository.deleteById(id);
    }
}
