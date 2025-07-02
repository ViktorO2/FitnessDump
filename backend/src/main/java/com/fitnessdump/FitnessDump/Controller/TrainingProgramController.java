package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.Training.TrainingProgramDTO;
import com.fitnessdump.FitnessDump.Exception.ResourceNotFoundException;
import com.fitnessdump.FitnessDump.Service.TrainingProgramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training-programs")
@CrossOrigin(origins = "*")
public class TrainingProgramController {

    private final TrainingProgramService programService;

    @Autowired
    public TrainingProgramController(TrainingProgramService programService) {
        this.programService = programService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> createProgram(@PathVariable Long userId, @RequestBody TrainingProgramDTO programDTO) {
        try {
            programDTO.setUserId(userId);
            TrainingProgramDTO createdProgram = programService.createProgram(programDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProgram);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating program: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProgram(@PathVariable Long id, @RequestBody TrainingProgramDTO programDTO) {
        try {
            TrainingProgramDTO updatedProgram = programService.updateProgram(id, programDTO);
            return ResponseEntity.ok(updatedProgram);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating program: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProgram(@PathVariable Long id) {
        try {
            programService.deleteProgram(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting program: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProgramById(@PathVariable Long id) {
        try {
            return programService.getProgramById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving program: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserPrograms(@PathVariable Long userId) {
        try {
            List<TrainingProgramDTO> programs = programService.getUserPrograms(userId);
            return ResponseEntity.ok(programs);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user programs: " + e.getMessage());
        }
    }
}