package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.Nutrition.CalorieCalculatorResponseDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.MacroDistributionDTO;
import com.fitnessdump.FitnessDump.DTOs.User.PersonalSettingsDTO;
import com.fitnessdump.FitnessDump.Exception.ResourceNotFoundException;
import com.fitnessdump.FitnessDump.Exception.UserNotFoundException;
import com.fitnessdump.FitnessDump.Model.Users.PersonalSettings;
import com.fitnessdump.FitnessDump.Model.Users.User;
import com.fitnessdump.FitnessDump.Repository.PersonalSettingsRepository;
import com.fitnessdump.FitnessDump.Repository.UserRepository;
import com.fitnessdump.FitnessDump.Service.PersonalSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PersonalSettingsServiceImpl implements PersonalSettingsService {

    private final PersonalSettingsRepository personalSettingsRepository;
    private final UserRepository userRepository;

    @Autowired
    public PersonalSettingsServiceImpl(
            PersonalSettingsRepository personalSettingsRepository,
            UserRepository userRepository) {
        this.personalSettingsRepository = personalSettingsRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Optional<PersonalSettingsDTO> getPersonalSettingsByUser(User user) {
        Optional<PersonalSettings> settings = personalSettingsRepository.findByUser(user);
        return settings.map(this::convertToDTO);
    }

    @Override
    @Transactional
    public PersonalSettingsDTO updatePersonalSettings(User user, PersonalSettingsDTO personalSettingsDTO) {
        PersonalSettings settings = personalSettingsRepository.findByUser(user)
                .orElseGet(() -> {
                    PersonalSettings newSettings = new PersonalSettings();
                    newSettings.setUser(user);
                    return newSettings;
                });

        updateSettingsFromDTO(settings, personalSettingsDTO);
        PersonalSettings savedSettings = personalSettingsRepository.save(settings);
        return convertToDTO(savedSettings);
    }

    @Override
    @Transactional
    public PersonalSettingsDTO updatePersonalSettings(Long userId, PersonalSettingsDTO settingsDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return updatePersonalSettings(user, settingsDTO);
    }

    @Override
    public PersonalSettingsDTO getOrCreatePersonalSettings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        PersonalSettings settings = personalSettingsRepository.findByUser(user)
                .orElseGet(() -> {
                    PersonalSettings newSettings = new PersonalSettings();
                    newSettings.setUser(user);
                    return personalSettingsRepository.save(newSettings);
                });

        return convertToDTO(settings);
    }

    @Override
    @Transactional
    public void deletePersonalSettings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        personalSettingsRepository.deleteByUser(user);
    }

    @Override
    public boolean isPersonalSettingsComplete(User user) {
        Optional<PersonalSettings> settings = personalSettingsRepository.findByUser(user);
        return settings.isPresent() &&
                settings.get().getHeight() > 0 &&
                settings.get().getCurrentWeight() > 0 &&
                settings.get().getDailyCalories() > 0 &&
                settings.get().getGoal() != null &&
                settings.get().getGender() != null &&
                settings.get().getAge() != null &&
                settings.get().getActivityLevel() != null;
    }

    @Override
    @Transactional
    public PersonalSettingsDTO updateFromCalculator(Long userId, CalorieCalculatorResponseDTO calculation) {
        PersonalSettings settings = personalSettingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
                    PersonalSettings newSettings = new PersonalSettings();
                    newSettings.setUser(user);
                    return newSettings;
                });

        settings.setBmr(calculation.getBmr());
        settings.setTdee(calculation.getTdee());
        settings.setDailyCalories(calculation.getDailyCalories());

        MacroDistributionDTO macros = calculation.getMacroDistribution();
        settings.setProtein(macros.getProteinGrams());
        settings.setFats(macros.getFatsGrams());
        settings.setCarbs(macros.getCarbsGrams());

        settings.setLastCalculation(calculation.getCalculationDate());

        PersonalSettings updatedSettings = personalSettingsRepository.save(settings);

        return convertToDTO(updatedSettings);
    }

    private PersonalSettingsDTO convertToDTO(PersonalSettings settings) {
        return new PersonalSettingsDTO(
                settings.getId(),
                settings.getUser().getId(),
                settings.getCurrentWeight(),
                settings.getTargetWeight(),
                settings.getHeight(),
                settings.getDailyCalories(),
                settings.getProtein(),
                settings.getFats(),
                settings.getCarbs(),
                settings.getGoal(),
                settings.getGender(),
                settings.getAge(),
                settings.getActivityLevel(),
                settings.getBmr(),
                settings.getTdee(),
                settings.getLastCalculation());
    }

    private void updateSettingsFromDTO(PersonalSettings settings, PersonalSettingsDTO dto) {
        settings.setCurrentWeight(dto.getCurrentWeight());
        settings.setTargetWeight(dto.getTargetWeight());
        settings.setHeight(dto.getHeight());
        settings.setDailyCalories(dto.getDailyCalories());
        settings.setProtein(dto.getProtein());
        settings.setFats(dto.getFats());
        settings.setCarbs(dto.getCarbs());
        settings.setGoal(dto.getGoal());
        settings.setGender(dto.getGender());
        settings.setAge(dto.getAge());
        settings.setActivityLevel(dto.getActivityLevel());
        settings.setBmr(dto.getBmr());
        settings.setTdee(dto.getTdee());
        settings.setLastCalculation(
                dto.getLastCalculation() != null ? dto.getLastCalculation() : LocalDateTime.now());
    }
}