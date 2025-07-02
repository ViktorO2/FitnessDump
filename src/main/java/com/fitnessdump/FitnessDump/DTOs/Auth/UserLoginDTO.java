package com.fitnessdump.FitnessDump.DTOs.Auth;

public class UserLoginDTO {
    private String token;
    private Long userId;

    public UserLoginDTO(String token, Long userId) {
        this.token = token;
        this.userId = userId;
    }

    public UserLoginDTO() {
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
