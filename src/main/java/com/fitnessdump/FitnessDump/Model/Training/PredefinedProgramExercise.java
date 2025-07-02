package com.fitnessdump.FitnessDump.Model.Training;

import com.fitnessdump.FitnessDump.Model.Exercise.Exercise;
import jakarta.persistence.*;

@Entity
@Table(name = "predefined_program_exercises")
public class PredefinedProgramExercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "predefined_program_id", nullable = false)
    private PredefinedProgram predefinedProgram;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise; // Тук използваме съществуващия Exercise клас

    @Column(nullable = false)
    private Integer dayOfWeek; // 1-7 за дните от седмицата

    @Column(nullable = false)
    private Integer sets;

    @Column(nullable = false)
    private Integer reps;

    private Double suggestedWeight;

    private Integer restSeconds;

    @Column(nullable = false)
    private Integer orderInDay;

    public PredefinedProgramExercise(Long id, PredefinedProgram predefinedProgram, Exercise exercise, Integer dayOfWeek,
            Integer sets, Integer reps, Double suggestedWeight, Integer restSeconds, Integer orderInDay) {
        this.id = id;
        this.predefinedProgram = predefinedProgram;
        this.exercise = exercise;
        this.dayOfWeek = dayOfWeek;
        this.sets = sets;
        this.reps = reps;
        this.suggestedWeight = suggestedWeight;
        this.restSeconds = restSeconds;
        this.orderInDay = orderInDay;
    }

    public PredefinedProgramExercise() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PredefinedProgram getPredefinedProgram() {
        return predefinedProgram;
    }

    public void setPredefinedProgram(PredefinedProgram predefinedProgram) {
        this.predefinedProgram = predefinedProgram;
    }

    public Exercise getExercise() {
        return exercise;
    }

    public void setExercise(Exercise exercise) {
        this.exercise = exercise;
    }

    public Integer getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(Integer dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public Integer getSets() {
        return sets;
    }

    public void setSets(Integer sets) {
        this.sets = sets;
    }

    public Integer getReps() {
        return reps;
    }

    public void setReps(Integer reps) {
        this.reps = reps;
    }

    public Double getSuggestedWeight() {
        return suggestedWeight;
    }

    public void setSuggestedWeight(Double suggestedWeight) {
        this.suggestedWeight = suggestedWeight;
    }

    public Integer getRestSeconds() {
        return restSeconds;
    }

    public void setRestSeconds(Integer restSeconds) {
        this.restSeconds = restSeconds;
    }

    public Integer getOrderInDay() {
        return orderInDay;
    }

    public void setOrderInDay(Integer orderInDay) {
        this.orderInDay = orderInDay;
    }
}