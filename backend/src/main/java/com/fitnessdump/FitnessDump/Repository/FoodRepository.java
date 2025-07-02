package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.Enum.FoodCategory;
import com.fitnessdump.FitnessDump.Model.Nutrition.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    List<Food> findByNameContainingIgnoreCase(String name);

    List<Food> findByCategory(FoodCategory category);
}
