package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.Auth.LoginDTO;
import com.fitnessdump.FitnessDump.Model.Users.User;
import com.fitnessdump.FitnessDump.DTOs.Auth.UserCreateDTO;
import java.util.Optional;

public interface UserService {
    User registerUser(UserCreateDTO userCreateDTO);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    String login(String username, String password);
    Optional<User> findById(Long userId);
    User authenticateUser(LoginDTO loginDTO);

    User getUserById(Long userId);
}