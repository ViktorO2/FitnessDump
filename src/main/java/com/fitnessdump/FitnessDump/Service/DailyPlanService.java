package com.fitnessdump.FitnessDump.Service;

import com.fitnessdump.FitnessDump.DTOs.Training.DailyPlanDTO;
import com.fitnessdump.FitnessDump.DTOs.Training.DailyPlanGenerationConfigDTO;

import java.util.List;
import java.util.Optional;

public interface DailyPlanService {

    DailyPlanDTO createDailyPlan(DailyPlanDTO dailyPlanDTO);

    DailyPlanDTO updateDailyPlan(Long id, DailyPlanDTO dailyPlanDTO);

    void deleteDailyPlan(Long id);

    DailyPlanDTO getDailyPlanById(Long id);

    List<DailyPlanDTO> getUserDailyPlans(Long userId);

    DailyPlanDTO getActiveDailyPlan(Long userId);

    void deactivateAllUserPlans(Long userId);

    DailyPlanDTO generateAutomaticDailyPlan(Long userId);

    DailyPlanDTO generateAutomaticDailyPlanWithConfig(Long userId, DailyPlanGenerationConfigDTO config);
}