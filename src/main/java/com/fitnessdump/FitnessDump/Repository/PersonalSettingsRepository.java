package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.PersonalSettings;
import com.fitnessdump.FitnessDump.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface PersonalSettingsRepository extends JpaRepository<PersonalSettings, Long> {
    Optional<PersonalSettings> findByUser(User user);
    void deleteByUser(User user);


    Optional<PersonalSettings> findByUserId(Long userId);
}
