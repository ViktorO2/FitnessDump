package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.Training.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface TrainingSessionRepository extends JpaRepository<TrainingSession,Long> {
    List<TrainingSession> findByUserId(Long userId);
}
