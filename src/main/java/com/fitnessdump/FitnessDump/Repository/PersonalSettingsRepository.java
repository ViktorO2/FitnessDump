package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.Users.PersonalSettings;
import com.fitnessdump.FitnessDump.Model.Users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface PersonalSettingsRepository extends JpaRepository<PersonalSettings, Long> {
    Optional<PersonalSettings> findByUser(User user);
    void deleteByUser(User user);


    Optional<PersonalSettings> findByUserId(Long userId);
}
