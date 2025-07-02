package com.fitnessdump.FitnessDump.Model.Training;

import com.fitnessdump.FitnessDump.Model.Exercise.Exercise;
import com.fitnessdump.FitnessDump.Model.Users.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workout_progress")
public class WorkoutProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "program_id", nullable = false)
    private TrainingProgram program;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    private LocalDateTime completedAt;

    private Integer completedSets;

    private Integer completedReps;

    private Double weightUsed;

    private String notes;

    private Integer difficultyRating; // 1-5 scale

    private Boolean completed;

    public WorkoutProgress() {
    }

    public WorkoutProgress(Long id, User user, TrainingProgram program, Exercise exercise, LocalDateTime completedAt, Integer completedSets, Integer completedReps, Double weightUsed, String notes, Integer difficultyRating, Boolean completed) {
        this.id = id;
        this.user = user;
        this.program = program;
        this.exercise = exercise;
        this.completedAt = completedAt;
        this.completedSets = completedSets;
        this.completedReps = completedReps;
        this.weightUsed = weightUsed;
        this.notes = notes;
        this.difficultyRating = difficultyRating;
        this.completed = completed;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public TrainingProgram getProgram() {
        return program;
    }

    public void setProgram(TrainingProgram program) {
        this.program = program;
    }

    public Exercise getExercise() {
        return exercise;
    }

    public void setExercise(Exercise exercise) {
        this.exercise = exercise;
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