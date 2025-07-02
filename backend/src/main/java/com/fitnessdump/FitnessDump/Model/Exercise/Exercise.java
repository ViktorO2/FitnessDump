package com.fitnessdump.FitnessDump.Model.Exercise;

import com.fitnessdump.FitnessDump.Model.Training.ProgramExercise;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exercises")
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description",columnDefinition = "TEXT")
    private String description;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "media_type")
    private String mediaType;

    @ManyToOne
    private ExerciseCategory category;

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProgramExercise> programExercises = new ArrayList<>();

    public Exercise() {
    }

    public Exercise(String name, String description, String videoUrl, String mediaType, ExerciseCategory category) {
        this.name = name;
        this.description = description;
        this.videoUrl = videoUrl;
        this.mediaType = mediaType;
        this.category = category;
    }

    public void addProgramExercise(ProgramExercise programExercise) {
        programExercises.add(programExercise);
        programExercise.setExercise(this);
    }

    public void removeProgramExercise(ProgramExercise programExercise) {
        programExercises.remove(programExercise);
        programExercise.setExercise(null);
    }

    public List<ProgramExercise> getProgramExercises() {
        return programExercises;
    }

    public void setProgramExercises(List<ProgramExercise> programExercises) {
        this.programExercises = programExercises;
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

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public ExerciseCategory getCategory() {
        return category;
    }

    public void setCategory(ExerciseCategory category) {
        this.category = category;
    }
}