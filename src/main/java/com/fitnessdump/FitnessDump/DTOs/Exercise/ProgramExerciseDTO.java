package com.fitnessdump.FitnessDump.DTOs.Exercise;

public class ProgramExerciseDTO {
    private Long id;
    private Long exerciseId;
    private int dayOfWeek;
    private int sets;
    private int reps;
    private double weight;
    private int orderInDay;

    public ProgramExerciseDTO() {
    }

    public ProgramExerciseDTO(Long id, Long exerciseId, int dayOfWeek, int sets, int reps, double weight, int orderInDay) {
        this.id = id;
        this.exerciseId = exerciseId;
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

    public Long getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(Long exerciseId) {
        this.exerciseId = exerciseId;
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
