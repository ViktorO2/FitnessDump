package com.fitnessdump.FitnessDump.DTOs.Auth;

import com.fitnessdump.FitnessDump.DTOs.User.UserDTO;

public class AuthResponseDTO {
    private Long userId;
    private String token;
    private UserDTO user;

    public AuthResponseDTO() {
    }
    public AuthResponseDTO(Long userId, String token, UserDTO user) {
        this.userId = userId;
        this.token = token;
        this.user = user;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
}