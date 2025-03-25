package com.fitnessdump.FitnessDump.Controller;

import com.fitnessdump.FitnessDump.Exception.UserNotFoundException;
import com.fitnessdump.FitnessDump.Model.User;
import com.fitnessdump.FitnessDump.Repository.UserRepository;
import com.fitnessdump.FitnessDump.Service.PersonalSettingsService;
import com.fitnessdump.FitnessDump.DTOs.PersonalSettingsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/personal-settings")
public class PersonalSettingsController {

    private final UserRepository userRepository;
    private final PersonalSettingsService personalSettingsService;

    @Autowired
    public PersonalSettingsController(UserRepository userRepository, PersonalSettingsService personalSettingsService) {
        this.userRepository = userRepository;
        this.personalSettingsService = personalSettingsService;
    }

    // Извлича личните настройки на потребител по ID
    @GetMapping("/getUser")
    public ResponseEntity<User> getUser(@RequestParam Long userId){
    {
        try {
            User user = findUserById(userId);
            return ResponseEntity.ok(user);
        } catch (UserNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    }

    // Проверява дали личните настройки на потребителя са попълнени
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

    // Извлича личните настройки на потребителя
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

    // Метод за намиране на потребител по ID
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
            return Long.parseLong(authentication.getName()); // Тук предполага се, че ID-то на потребителя е в `authentication.getName()`
        }
        throw new RuntimeException("User is not authenticated");
    }
}
