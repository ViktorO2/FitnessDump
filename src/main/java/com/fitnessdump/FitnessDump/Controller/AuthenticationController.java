package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.LoginDTO;
import com.fitnessdump.FitnessDump.DTOs.UserCreateDTO;
import com.fitnessdump.FitnessDump.Model.User;
import com.fitnessdump.FitnessDump.Service.UserService;
import com.fitnessdump.FitnessDump.Util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        User user = userService.authenticateUser(loginDTO);

        if (user != null) {
            String token = jwtTokenUtil.generateToken(user.getId());

            // Връщаме JSON обект с token и userId
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "userId", user.getId()
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}
