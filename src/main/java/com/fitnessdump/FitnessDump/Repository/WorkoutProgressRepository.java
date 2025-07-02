package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.Training.WorkoutProgress;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WorkoutProgressRepository extends JpaRepository<WorkoutProgress, Long> {
    List<WorkoutProgress> findByUserId(Long userId);

    List<WorkoutProgress> findByUserIdAndProgramId(Long userId, Long programId);

    List<WorkoutProgress> findByUserIdAndCompletedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);

    List<WorkoutProgress> findByUserIdAndExerciseId(Long userId, Long exerciseId);

    List<WorkoutProgress> findByExerciseId(Long exerciseId);

    void deleteByExerciseId(Long exerciseId);

    List<WorkoutProgress> findByUserIdOrderByCompletedAtDesc(Long userId, Pageable pageable);

    void deleteByProgramId(Long programId);

    @Query("SELECT AVG(wp.weightUsed) FROM WorkoutProgress wp WHERE wp.user.id = :userId AND wp.exercise.id = :exerciseId AND wp.weightUsed IS NOT NULL")
    Double getAverageWeightForExercise(@Param("userId") Long userId, @Param("exerciseId") Long exerciseId);

    @Query("SELECT MAX(wp.weightUsed) FROM WorkoutProgress wp WHERE wp.user.id = :userId AND wp.exercise.id = :exerciseId AND wp.weightUsed IS NOT NULL")
    Double getMaxWeightForExercise(@Param("userId") Long userId, @Param("exerciseId") Long exerciseId);

    @Query("SELECT AVG(wp.completedReps) FROM WorkoutProgress wp WHERE wp.user.id = :userId AND wp.exercise.id = :exerciseId AND wp.completedReps IS NOT NULL")
    Double getAverageRepsForExercise(@Param("userId") Long userId, @Param("exerciseId") Long exerciseId);

    @Query("SELECT MAX(wp.completedReps) FROM WorkoutProgress wp WHERE wp.user.id = :userId AND wp.exercise.id = :exerciseId AND wp.completedReps IS NOT NULL")
    Integer getMaxRepsForExercise(@Param("userId") Long userId, @Param("exerciseId") Long exerciseId);
}
