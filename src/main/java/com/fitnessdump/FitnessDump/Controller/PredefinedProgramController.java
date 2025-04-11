package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.PredefinedProgramDTO;
import com.fitnessdump.FitnessDump.DTOs.TrainingProgramDTO;
import com.fitnessdump.FitnessDump.Model.Enum.DifficultyLevel;
import com.fitnessdump.FitnessDump.Model.Enum.ProgramGoal;
import com.fitnessdump.FitnessDump.Service.PredefinedProgramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/predefined-programs")
@CrossOrigin(origins = "*")
public class PredefinedProgramController {

    private final PredefinedProgramService predefinedProgramService;

    @Autowired
    public PredefinedProgramController(PredefinedProgramService predefinedProgramService) {
        this.predefinedProgramService = predefinedProgramService;
    }

    @GetMapping
    public ResponseEntity<List<PredefinedProgramDTO>> getAllPrograms() {
        try {
            List<PredefinedProgramDTO> programs = predefinedProgramService.getAllPrograms();
            return ResponseEntity.ok(programs);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error retrieving predefined programs", e);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PredefinedProgramDTO> getProgramById(@PathVariable Long id) {
        try {
            return predefinedProgramService.getProgramById(id)
                    .map(ResponseEntity::ok)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Predefined program not found with id: " + id));
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error retrieving predefined program", e);
        }
    }

    @GetMapping("/by-goal/{goal}")
    public ResponseEntity<List<PredefinedProgramDTO>> getProgramsByGoal(
            @PathVariable ProgramGoal goal) {
        try {
            List<PredefinedProgramDTO> programs = predefinedProgramService.getProgramsByGoal(goal);
            return ResponseEntity.ok(programs);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid program goal: " + goal, e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error retrieving programs by goal", e);
        }
    }

    @GetMapping("/by-difficulty/{difficultyLevel}")
    public ResponseEntity<List<PredefinedProgramDTO>> getProgramsByDifficulty(
            @PathVariable DifficultyLevel difficultyLevel) {
        try {
            List<PredefinedProgramDTO> programs =
                    predefinedProgramService.getProgramsByDifficulty(difficultyLevel);
            return ResponseEntity.ok(programs);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid difficulty level: " + difficultyLevel, e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error retrieving programs by difficulty", e);
        }
    }

    @PostMapping("/copy/{programId}/to-user/{userId}")
    public ResponseEntity<TrainingProgramDTO> copyProgramToUser(
            @PathVariable Long userId,
            @PathVariable Long programId) {
        try {
            TrainingProgramDTO copiedProgram =
                    predefinedProgramService.copyProgramToUser(userId, programId);
            return ResponseEntity.status(HttpStatus.CREATED).body(copiedProgram);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error copying program to user", e);
        }
    }

    // Exception handler for general validation errors
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(e.getMessage());
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handleResponseStatusException(ResponseStatusException e) {
        return ResponseEntity
                .status(e.getStatusCode())
                .body(e.getReason());
    }
}