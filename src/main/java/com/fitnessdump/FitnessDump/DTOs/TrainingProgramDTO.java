package com.fitnessdump.FitnessDump.DTOs;

import java.util.List;

public class TrainingProgramDTO {
    private Long id;
    private String name;
    private String description;
    private Long userId;
    private List<ProgramExerciseDTO> exercises;

    public TrainingProgramDTO(Long id, String name, String description, Long userId, List<ProgramExerciseDTO> exercises) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.userId = userId;
        this.exercises = exercises;
    }

    public TrainingProgramDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<ProgramExerciseDTO> getExercises() {
        return exercises;
    }

    public void setExercises(List<ProgramExerciseDTO> exercises) {
        this.exercises = exercises;
    }
}