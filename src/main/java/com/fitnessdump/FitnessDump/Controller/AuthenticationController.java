package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.LoginDTO;
import com.fitnessdump.FitnessDump.DTOs.UserCreateDTO;
import com.fitnessdump.FitnessDump.Model.User;
import com.fitnessdump.FitnessDump.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private UserService userService;

    // Регистрация на потребител
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody UserCreateDTO userCreateDTO) {
        try {
            User user = userService.registerUser(userCreateDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (IllegalArgumentException e) {
            // Връщаме статус 409 (Conflict), ако потребителското име или имейл вече
            // съществуват
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    // Логин на потребител
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        String token = userService.login(loginDTO.getUsername(), loginDTO.getPassword());
        if (token != null) {
            return ResponseEntity.ok(token);
        }
        // Връщаме статус 401 (Unauthorized), ако логинът не е успешен
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}
