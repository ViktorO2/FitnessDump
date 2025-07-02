package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.Training.DailyPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DailyPlanRepository extends JpaRepository<DailyPlan, Long> {

    List<DailyPlan> findByUserId(Long userId);

    Optional<DailyPlan> findByUserIdAndActiveTrue(Long userId);

    List<DailyPlan> findByUserIdAndActive(Long userId, boolean active);

    @Query("SELECT dp FROM DailyPlan dp WHERE dp.user.id = :userId " +
            "AND dp.startDate >= :startDate AND dp.endDate <= :endDate")
    List<DailyPlan> findByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") java.time.LocalDate startDate,
            @Param("endDate") java.time.LocalDate endDate);

    @Modifying
    @Query("UPDATE DailyPlan dp SET dp.active = false WHERE dp.user.id = :userId")
    void deactivateAllUserPlans(@Param("userId") Long userId);

    boolean existsByUserIdAndActiveTrue(Long userId);

    long countByUserIdAndActiveTrue(Long userId);

    void deleteByTrainingProgramId(Long trainingProgramId);
}