package com.fitnessdump.FitnessDump.DTOs.Training;

import java.time.LocalDateTime;

public class WorkoutProgressDTO {
    private Long id;
    private Long userId;
    private Long programId;
    private Long exerciseId;
    private String exerciseName;
    private String programName;
    private LocalDateTime completedAt;
    private Integer completedSets;
    private Integer completedReps;
    private Double weightUsed;
    private String notes;
    private Integer difficultyRating;
    private Boolean completed;

    public WorkoutProgressDTO(Long id, Long userId, Long programId, Long exerciseId, String exerciseName,
            String programName, LocalDateTime completedAt, Integer completedSets, Integer completedReps,
            Double weightUsed, String notes, Integer difficultyRating, Boolean completed) {
        this.id = id;
        this.userId = userId;
        this.programId = programId;
        this.exerciseId = exerciseId;
        this.exerciseName = exerciseName;
        this.programName = programName;
        this.completedAt = completedAt;
        this.completedSets = completedSets;
        this.completedReps = completedReps;
        this.weightUsed = weightUsed;
        this.notes = notes;
        this.difficultyRating = difficultyRating;
        this.completed = completed;
    }

    public WorkoutProgressDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getProgramId() {
        return programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public Long getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(Long exerciseId) {
        this.exerciseId = exerciseId;
    }

    public String getExerciseName() {
        return exerciseName;
    }

    public void setExerciseName(String exerciseName) {
        this.exerciseName = exerciseName;
    }

    public String getProgramName() {
        return programName;
    }

    public void setProgramName(String programName) {
        this.programName = programName;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public Integer getCompletedSets() {
        return completedSets;
    }

    public void setCompletedSets(Integer completedSets) {
        this.completedSets = completedSets;
    }

    public Integer getCompletedReps() {
        return completedReps;
    }

    public void setCompletedReps(Integer completedReps) {
        this.completedReps = completedReps;
    }

    public Double getWeightUsed() {
        return weightUsed;
    }

    public void setWeightUsed(Double weightUsed) {
        this.weightUsed = weightUsed;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Integer getDifficultyRating() {
        return difficultyRating;
    }

    public void setDifficultyRating(Integer difficultyRating) {
        this.difficultyRating = difficultyRating;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }
}