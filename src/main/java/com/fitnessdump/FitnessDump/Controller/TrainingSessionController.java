package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.TrainingSessionDTO;
import com.fitnessdump.FitnessDump.Service.TrainingSessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/training-sessions")
public class TrainingSessionController {
    private final TrainingSessionService trainingSessionService;

    public TrainingSessionController(TrainingSessionService trainingSessionService) {
        this.trainingSessionService = trainingSessionService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<TrainingSessionDTO> saveTrainingSession(@PathVariable Long userId, @RequestBody TrainingSessionDTO trainingSessionDTO) {
        trainingSessionDTO.setUserId(userId);
        TrainingSessionDTO savedSession = trainingSessionService.createTrainingSession(trainingSessionDTO);
        return ResponseEntity.status(201).body(savedSession);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TrainingSessionDTO>> getUserTrainingSessions(@PathVariable Long userId) {
        List<TrainingSessionDTO> sessions = trainingSessionService.getTrainingSessionsByUserId(userId);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingSessionDTO> getTrainingSessionById(@PathVariable Long id) {
        Optional<TrainingSessionDTO> session = trainingSessionService.getTrainingSessionById(id);
        return session.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrainingSession(@PathVariable Long id) {
        trainingSessionService.deleteTrainingSessionById(id);
        return ResponseEntity.noContent().build();
    }
}
