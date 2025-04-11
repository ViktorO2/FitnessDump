package com.fitnessdump.FitnessDump.DTOs;

public class ExerciseDTO {
    private Long id;
    private String name;
    private String description;
    private Long categoryId;
    private String videoUrl;
    private String mediaType;

    public ExerciseDTO(Long id, String name, String description, Long categoryId, String videoUrl, String mediaType) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.categoryId = categoryId;
        this.videoUrl = videoUrl;
        this.mediaType = mediaType;
    }

    public ExerciseDTO() {
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

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
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
}
