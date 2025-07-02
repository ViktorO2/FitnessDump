package com.fitnessdump.FitnessDump.Model.Training;

import com.fitnessdump.FitnessDump.Model.Users.User;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "training-session")
public class TrainingSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    private String name;
    private String description;
    private LocalDate date;
    private Integer durationMinutes;

    public TrainingSession(Long id, User user, String name, String description, LocalDate date, Integer durationMinutes) {
        this.id = id;
        this.user = user;
        this.name = name;
        this.description = description;
        this.date = date;
        this.durationMinutes = durationMinutes;
    }
    public TrainingSession(){

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
