package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.DTOs.Nutrition.CalorieCalculatorRequestDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.CalorieCalculatorResponseDTO;
import com.fitnessdump.FitnessDump.Exception.UserNotFoundException;
import com.fitnessdump.FitnessDump.Model.Users.User;
import com.fitnessdump.FitnessDump.Repository.UserRepository;
import com.fitnessdump.FitnessDump.Service.CalorieCalculatorService;
import com.fitnessdump.FitnessDump.Service.PersonalSettingsService;
import com.fitnessdump.FitnessDump.DTOs.User.PersonalSettingsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/personal-settings")
@CrossOrigin(origins = "*")
public class PersonalSettingsController {

    private final UserRepository userRepository;
    private final PersonalSettingsService personalSettingsService;
    @Autowired
    private final CalorieCalculatorService calorieCalculatorService;

    @Autowired
    public PersonalSettingsController(UserRepository userRepository, PersonalSettingsService personalSettingsService,
            CalorieCalculatorService calorieCalculatorService) {
        this.userRepository = userRepository;
        this.personalSettingsService = personalSettingsService;

        this.calorieCalculatorService = calorieCalculatorService;
    }

    @GetMapping("/getUser")
    public ResponseEntity<User> getUser(@RequestParam Long userId) {
        {
            try {
                User user = findUserById(userId);
                return ResponseEntity.ok(user);
            } catch (UserNotFoundException ex) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkPersonalSettings(@RequestParam Long userId) {
        try {
            User user = findUserById(userId);
            boolean isComplete = personalSettingsService.isPersonalSettingsComplete(user);
            return ResponseEntity.ok(isComplete);
        } catch (UserNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<PersonalSettingsDTO> getPersonalSettings(@RequestParam Long userId) {
        try {
            User user = findUserById(userId);
            Optional<PersonalSettingsDTO> settings = personalSettingsService.getPersonalSettingsByUser(user);
            return settings.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (UserNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/calculate")
    public ResponseEntity<CalorieCalculatorResponseDTO> calculateMacros(
            @RequestBody CalorieCalculatorRequestDTO request) {
        CalorieCalculatorResponseDTO response = calorieCalculatorService.calculateNutrition(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Void> savePersonalSettings(@RequestBody PersonalSettingsDTO dto) {
        try {
            User user = findUserById(dto.getUserId());
            personalSettingsService.updatePersonalSettings(user, dto);
            return ResponseEntity.ok().build();
        } catch (UserNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    private User findUserById(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Невалидно ID на потребител.");
        }

        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Потребител с ID " + userId + " не беше намерен."));
    }

    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return Long.parseLong(authentication.getName());
        }
        throw new RuntimeException("User is not authenticated");
    }
}
