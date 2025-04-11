package com.fitnessdump.FitnessDump.Model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "training_programs")
public class TrainingProgram {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "trainingProgram", cascade = CascadeType.ALL)
    private List<ProgramExercise> exercises;

    public TrainingProgram(Long id, String name, String description, User user, List<ProgramExercise> exercises) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.user = user;
        this.exercises = exercises;
    }

    public TrainingProgram() {
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<ProgramExercise> getExercises() {
        return exercises;
    }

    public void setExercises(List<ProgramExercise> exercises) {
        this.exercises = exercises;
    }
}