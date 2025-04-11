package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.WorkoutProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface WorkoutProgressRepository extends JpaRepository<WorkoutProgress, Long> {
    List<WorkoutProgress> findByUserId(Long userId);
    List<WorkoutProgress> findByUserIdAndProgramId(Long userId, Long programId);
    List<WorkoutProgress> findByUserIdAndCompletedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);

    List<WorkoutProgress> findByUserIdAndExerciseId(Long userId, Long exerciseId);
}
