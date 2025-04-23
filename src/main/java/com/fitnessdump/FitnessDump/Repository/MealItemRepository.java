package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.Meal.MealItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealItemRepository extends JpaRepository<MealItem, Long> {
    List<MealItem> findByMealId(Long mealId);
}