package com.fitnessdump.FitnessDump.DTOs.Exercise;

public class PredefinedProgramExerciseDTO {
    private Long id;

    private Long exerciseId;
    private Integer dayOfWeek;

    private Integer sets;

    private Integer reps;

    private Double suggestedWeight;

    private Integer restSeconds;

    private Integer orderInDay;

    public PredefinedProgramExerciseDTO(Long id, Long exerciseId, Integer dayOfWeek, Integer sets, Integer reps, Double suggestedWeight, Integer restSeconds, Integer orderInDay) {
        this.id = id;
        this.exerciseId = exerciseId;
        this.dayOfWeek = dayOfWeek;
        this.sets = sets;
        this.reps = reps;
        this.suggestedWeight = suggestedWeight;
        this.restSeconds = restSeconds;
        this.orderInDay = orderInDay;
    }

    public PredefinedProgramExerciseDTO() {
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
