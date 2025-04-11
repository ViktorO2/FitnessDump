package com.fitnessdump.FitnessDump.DTOs;

import java.util.List;

public class PredefinedProgramDTO {
    private Long id;
    private String name;

    private String description;

    private String goal;

    private Integer durationWeeks;

    private String difficultyLevel;

    private List<PredefinedProgramExerciseDTO> exercises;

    public PredefinedProgramDTO(Long id, String name, String description, String goal, Integer durationWeeks, String difficultyLevel, List<PredefinedProgramExerciseDTO> exercises) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.goal = goal;
        this.durationWeeks = durationWeeks;
        this.difficultyLevel = difficultyLevel;
        this.exercises = exercises;
    }

    public PredefinedProgramDTO() {
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

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public Integer getDurationWeeks() {
        return durationWeeks;
    }

    public void setDurationWeeks(Integer durationWeeks) {
        this.durationWeeks = durationWeeks;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public List<PredefinedProgramExerciseDTO> getExercises() {
        return exercises;
    }

    public void setExercises(List<PredefinedProgramExerciseDTO> exercises) {
        this.exercises = exercises;
    }
}
