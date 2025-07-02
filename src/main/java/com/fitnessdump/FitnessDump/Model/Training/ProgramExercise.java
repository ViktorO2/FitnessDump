package com.fitnessdump.FitnessDump.Model.Training;

import com.fitnessdump.FitnessDump.Model.Exercise.Exercise;
import jakarta.persistence.*;

@Entity
@Table(name = "program_exercises")
public class ProgramExercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "program_id", nullable = false)
    private TrainingProgram trainingProgram;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    private int dayOfWeek;

    private int sets;

    private int reps;

    private double weight;

    private int orderInDay;

    public ProgramExercise() {
    }

    public ProgramExercise(Long id, TrainingProgram trainingProgram, Exercise exercise, int dayOfWeek, int sets, int reps, double weight, int orderInDay) {
        this.id = id;
        this.trainingProgram = trainingProgram;
        this.exercise = exercise;
        this.dayOfWeek = dayOfWeek;
        this.sets = sets;
        this.reps = reps;
        this.weight = weight;
        this.orderInDay = orderInDay;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TrainingProgram getTrainingProgram() {
        return trainingProgram;
    }

    public void setTrainingProgram(TrainingProgram trainingProgram) {
        this.trainingProgram = trainingProgram;
    }

    public Exercise getExercise() {
        return exercise;
    }

    public void setExercise(Exercise exercise) {
        this.exercise = exercise;
    }

    public int getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(int dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public int getSets() {
        return sets;
    }

    public void setSets(int sets) {
        this.sets = sets;
    }

    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public int getOrderInDay() {
        return orderInDay;
    }

    public void setOrderInDay(int orderInDay) {
        this.orderInDay = orderInDay;
    }
}
