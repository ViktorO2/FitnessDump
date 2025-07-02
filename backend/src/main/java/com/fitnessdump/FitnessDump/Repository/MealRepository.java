package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.Meal.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findByDayId(Long dayId);
}
