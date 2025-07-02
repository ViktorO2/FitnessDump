package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.Enum.GoalType;
import com.fitnessdump.FitnessDump.Model.Meal.MealPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {
    List<MealPlan> findByUserId(Long userId);
    List<MealPlan> findByUserIdAndGoal(Long userId, GoalType goal);
}
