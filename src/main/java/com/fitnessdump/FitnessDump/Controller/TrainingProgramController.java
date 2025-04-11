package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.TrainingProgramDTO;
import com.fitnessdump.FitnessDump.Service.TrainingProgramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training-programs")
public class TrainingProgramController {

    private final TrainingProgramService programService;

    @Autowired
    public TrainingProgramController(TrainingProgramService programService) {
        this.programService = programService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<TrainingProgramDTO> createProgram(@PathVariable Long userId, @RequestBody TrainingProgramDTO programDTO) {
        programDTO.setUserId(userId);
        TrainingProgramDTO createdProgram = programService.createProgram(programDTO);
        return ResponseEntity.status(201).body(createdProgram);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingProgramDTO> updateProgram(@PathVariable Long id,
            @RequestBody TrainingProgramDTO programDTO) {
        TrainingProgramDTO updatedProgram = programService.updateProgram(id, programDTO);
        return ResponseEntity.ok(updatedProgram);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgram(@PathVariable Long id) {
        programService.deleteProgram(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingProgramDTO> getProgramById(@PathVariable Long id) {
        return programService.getProgramById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TrainingProgramDTO>> getUserPrograms(@PathVariable Long userId) {
        List<TrainingProgramDTO> programs = programService.getUserPrograms(userId);
        return ResponseEntity.ok(programs);
    }
}