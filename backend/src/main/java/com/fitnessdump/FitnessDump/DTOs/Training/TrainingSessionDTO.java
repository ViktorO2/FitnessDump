package com.fitnessdump.FitnessDump.DTOs.Training;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

public class TrainingSessionDTO {

    private Long userId;
    private String name;
    private String description;
    private LocalDate date;
    private Integer durationMinutes;

    public TrainingSessionDTO(Long userId, String name, String description, LocalDate date, Integer durationMinutes) {
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.date = date;
        this.durationMinutes = durationMinutes;
    }

    public TrainingSessionDTO() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
}
