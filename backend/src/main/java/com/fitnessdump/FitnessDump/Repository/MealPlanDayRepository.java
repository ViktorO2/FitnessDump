package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.Meal.MealPlanDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealPlanDayRepository extends JpaRepository<MealPlanDay, Long> {
    List<MealPlanDay> findByMealPlanId(Long mealPlanId);
    MealPlanDay findByMealPlanIdAndDayOfWeek(Long mealPlanId, Integer dayOfWeek);
}