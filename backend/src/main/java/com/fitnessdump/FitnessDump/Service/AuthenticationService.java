package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.Auth.*;
import com.fitnessdump.FitnessDump.DTOs.User.UserDTO;
import com.fitnessdump.FitnessDump.Model.Users.User;
import com.fitnessdump.FitnessDump.Repository.UserRepository;
import com.fitnessdump.FitnessDump.Util.JwtTokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    public AuthResponseDTO login(LoginDTO loginDTO) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDTO.getUsername(),
                            loginDTO.getPassword()));

            User user = userRepository.findByUsername(loginDTO.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtTokenUtil.generateToken(user.getId());

            logger.info("Generated token for user: {}", user.getUsername());

            return new AuthResponseDTO(
                    user.getId(),
                    token,
                    convertToUserDTO(user));
        } catch (Exception e) {
            logger.error("Authentication failed", e);
            throw e;
        }
    }

    public UserDTO register(UserCreateDTO userCreateDTO) {
        if (userRepository.findByUsername(userCreateDTO.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.findByEmail(userCreateDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setUsername(userCreateDTO.getUsername());
        user.setFirstName(userCreateDTO.getFirstName());
        user.setLastName(userCreateDTO.getLastName());
        user.setEmail(userCreateDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userCreateDTO.getPassword()));
        user.setRole(userCreateDTO.getRole());

        User savedUser = userRepository.save(user);
        return convertToUserDTO(savedUser);
    }

    public String refreshToken(String oldToken) {
        try {
            if (oldToken == null || oldToken.trim().isEmpty()) {
                logger.warn("Refresh token is null or empty");
                throw new IllegalArgumentException("Token is required");
            }

            if (jwtTokenUtil.validateToken(oldToken)) {
                Long userId = jwtTokenUtil.getUserIdFromToken(oldToken);
                String newToken = jwtTokenUtil.generateToken(userId);
                logger.info("Token refreshed successfully for user ID: {}", userId);
                return newToken;
            } else {
                logger.warn("Invalid refresh token provided");
                throw new IllegalArgumentException("Invalid or expired token");
            }
        } catch (Exception e) {
            logger.error("Token refresh failed: {}", e.getMessage());
            throw new IllegalArgumentException("Token refresh failed: " + e.getMessage());
        }
    }

    public boolean validateToken(String token) {
        try {
            if (token == null || token.trim().isEmpty()) {
                return false;
            }
            return jwtTokenUtil.validateToken(token);
        } catch (Exception e) {
            logger.error("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    public UserDTO updateProfile(Long userId, UpdateProfileDTO updateProfileDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getEmail().equals(updateProfileDTO.getEmail())) {
            if (userRepository.findByEmail(updateProfileDTO.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email already exists");
            }
        }

        user.setFirstName(updateProfileDTO.getFirstName());
        user.setLastName(updateProfileDTO.getLastName());
        user.setEmail(updateProfileDTO.getEmail());

        User updatedUser = userRepository.save(user);
        logger.info("Profile updated for user: {}", user.getUsername());

        return convertToUserDTO(updatedUser);
    }

    public void changePassword(Long userId, ChangePasswordDTO changePasswordDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(changePasswordDTO.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        if (!changePasswordDTO.isNewPasswordMatching()) {
            throw new IllegalArgumentException("New passwords do not match");
        }

        if (passwordEncoder.matches(changePasswordDTO.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }

        user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        userRepository.save(user);

        logger.info("Password changed for user: {}", user.getUsername());
    }

    private UserDTO convertToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }
}