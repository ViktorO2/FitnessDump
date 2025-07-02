package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.Auth.*;
import com.fitnessdump.FitnessDump.DTOs.User.UserDTO;
import com.fitnessdump.FitnessDump.Service.AuthenticationService;
import com.fitnessdump.FitnessDump.Service.UserService;
import com.fitnessdump.FitnessDump.Security.CustomUserDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            logger.info("Attempting login for user: {}", loginDTO.getUsername());
            AuthResponseDTO response = authenticationService.login(loginDTO);
            logger.info("Login successful for user: {}", loginDTO.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed for user: {}", loginDTO.getUsername(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserCreateDTO userCreateDTO) {
        try {
            UserDTO user = authenticationService.register(userCreateDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        try {
          
            logger.info("User logged out successfully");
            return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
        } catch (Exception e) {
            logger.error("Logout failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Logout failed"));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            if (token == null || token.trim().isEmpty()) {
                logger.warn("Refresh request received without token");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "error", "Token is required",
                                "code", "TOKEN_MISSING",
                                "shouldLogout", true));
            }

            String newToken = authenticationService.refreshToken(token);
            logger.info("Token refreshed successfully");
            return ResponseEntity.ok(Map.of("token", newToken));
        } catch (IllegalArgumentException e) {
            logger.warn("Token refresh failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "error", e.getMessage(),
                            "code", "TOKEN_INVALID",
                            "shouldLogout", true));
        } catch (Exception e) {
            logger.error("Unexpected error during token refresh", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Internal server error",
                            "code", "INTERNAL_ERROR",
                            "shouldLogout", false));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileDTO updateProfileDTO) {
        try {
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            Long userId = userDetails.getUserId();

            logger.info("Updating profile for user ID: {}", userId);
            UserDTO updatedUser = authenticationService.updateProfile(userId, updateProfileDTO);

            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            logger.error("Profile update failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Profile update failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update profile"));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO changePasswordDTO) {
        try {

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            Long userId = userDetails.getUserId();

            logger.info("Changing password for user ID: {}", userId);
            authenticationService.changePassword(userId, changePasswordDTO);

            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (IllegalArgumentException e) {
            logger.error("Password change failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Password change failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to change password"));
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("valid", false, "error", "Token is required"));
            }

            boolean isValid = authenticationService.validateToken(token);
            if (isValid) {
                return ResponseEntity.ok(Map.of("valid", true));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("valid", false, "error", "Invalid or expired token"));
            }
        } catch (Exception e) {
            logger.error("Token validation failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("valid", false, "error", "Validation failed"));
        }
    }
}