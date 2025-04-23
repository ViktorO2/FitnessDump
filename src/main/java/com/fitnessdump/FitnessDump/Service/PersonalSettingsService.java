package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.CalorieCalculatorRequestDTO;
import com.fitnessdump.FitnessDump.DTOs.CalorieCalculatorResponseDTO;
import com.fitnessdump.FitnessDump.DTOs.PersonalSettingsDTO;
import com.fitnessdump.FitnessDump.Model.User;


import java.util.Optional;

public interface PersonalSettingsService{
    Optional<PersonalSettingsDTO> getPersonalSettingsByUser(User user);
    PersonalSettingsDTO updatePersonalSettings(User user, PersonalSettingsDTO personalSettingsDTO);
    PersonalSettingsDTO updatePersonalSettings(Long userId, PersonalSettingsDTO settingsDTO);
    PersonalSettingsDTO getOrCreatePersonalSettings(Long userId);
    void deletePersonalSettings(Long userId);
    boolean isPersonalSettingsComplete(User user);
    PersonalSettingsDTO updateFromCalculator(Long userId, CalorieCalculatorResponseDTO calculation);

}
