package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.PersonalSettingsDTO;
import com.fitnessdump.FitnessDump.Model.PersonalSettings;
import com.fitnessdump.FitnessDump.Model.User;
import com.fitnessdump.FitnessDump.Repository.PersonalSettingsRepository;
import com.fitnessdump.FitnessDump.Service.PersonalSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PersonalSettingsServiceImpl implements PersonalSettingsService {

    private final PersonalSettingsRepository personalSettingsRepository;

    @Autowired
    public PersonalSettingsServiceImpl(PersonalSettingsRepository personalSettingsRepository) {
        this.personalSettingsRepository = personalSettingsRepository;
    }

    @Override
    public Optional<PersonalSettingsDTO> getPersonalSettingsByUser(User user) {
        Optional<PersonalSettings> settings = personalSettingsRepository.findByUser(user);
        return settings.map(s -> new PersonalSettingsDTO(
                s.getCurrentWeight(),
                s.getTargetWeight(),
                s.getHeight(),
                s.getDailyCalories(),
                s.getProtein(),
                s.getFats(),
                s.getCarbs(),
                s.getGoal()
        ));
    }

    @Override
    public PersonalSettingsDTO updatePersonalSettings(User user, PersonalSettingsDTO personalSettingsDTO) {
        PersonalSettings settings = personalSettingsRepository.findByUser(user)
                .orElse(new PersonalSettings(user, 0, 0, 0, 0, 0, 0, 0, null));

        settings.setCurrentWeight(personalSettingsDTO.getCurrentWeight());
        settings.setTargetWeight(personalSettingsDTO.getTargetWeight());
        settings.setHeight(personalSettingsDTO.getHeight());
        settings.setDailyCalories(personalSettingsDTO.getDailyCalories());
        settings.setProtein(personalSettingsDTO.getProtein());
        settings.setFats(personalSettingsDTO.getFats());
        settings.setCarbs(personalSettingsDTO.getCarbs());
        settings.setGoal(personalSettingsDTO.getGoal());

        personalSettingsRepository.save(settings);
        return personalSettingsDTO;
    }

    @Override
    public boolean isPersonalSettingsComplete(User user) {
        Optional<PersonalSettings> settings = personalSettingsRepository.findByUser(user);
        return settings.isPresent() &&
                settings.get().getHeight() > 0 &&
                settings.get().getCurrentWeight() > 0 &&
                settings.get().getDailyCalories() > 0 &&
                settings.get().getGoal() != null;
    }
}
