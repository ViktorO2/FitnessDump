package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.PersonalSettingsDTO;
import com.fitnessdump.FitnessDump.Model.User;
import com.fitnessdump.FitnessDump.Service.Impl.PersonalSettingsServiceImpl;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface PersonalSettingsService{
    Optional<PersonalSettingsDTO> getPersonalSettingsByUser(User user);
    PersonalSettingsDTO updatePersonalSettings(User user, PersonalSettingsDTO personalSettingsDTO);
    boolean isPersonalSettingsComplete(User user);


}
