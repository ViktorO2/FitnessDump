package com.fitnessdump.FitnessDump.Model;

import com.fitnessdump.FitnessDump.Model.Enum.DifficultyLevel;
import com.fitnessdump.FitnessDump.Model.Enum.ProgramGoal;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "predefined_programs")
public class PredefinedProgram {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProgramGoal goal;
    private int durationWeeks;
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficulty;
    @OneToMany(mappedBy = "predefinedProgram", cascade = CascadeType.ALL)
    private List<PredefinedProgramExercise> exercises;

    public PredefinedProgram(Long id, String name, String description, ProgramGoal goal, int durationWeeks, DifficultyLevel difficulty, List<PredefinedProgramExercise> exercises) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.goal = goal;
        this.durationWeeks = durationWeeks;
        this.difficulty = difficulty;
        this.exercises = exercises;
    }

    public PredefinedProgram() {
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

    public ProgramGoal getGoal() {
        return goal;
    }

    public void setGoal(ProgramGoal goal) {
        this.goal = goal;
    }

    public int getDurationWeeks() {
        return durationWeeks;
    }

    public void setDurationWeeks(int durationWeeks) {
        this.durationWeeks = durationWeeks;
    }

    public DifficultyLevel getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(DifficultyLevel difficulty) {
        this.difficulty = difficulty;
    }

    public List<PredefinedProgramExercise> getExercises() {
        return exercises;
    }

    public void setExercises(List<PredefinedProgramExercise> exercises) {
        this.exercises = exercises;
    }
}
