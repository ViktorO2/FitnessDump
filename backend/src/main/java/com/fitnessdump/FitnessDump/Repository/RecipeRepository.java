package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.Enum.GoalType;
import com.fitnessdump.FitnessDump.Model.Nutrition.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {

        List<Recipe> findByCreatorId(Long creatorId);

        List<Recipe> findByNameContainingIgnoreCase(String name);

        List<Recipe> findByRecommendedFor(GoalType goal);

        @Query("SELECT r FROM Recipe r WHERE " +
                        "r.caloriesPerServing BETWEEN :minCalories AND :maxCalories AND " +
                        "r.proteinPerServing >= :minProtein")
        List<Recipe> findByNutritionCriteria(
                        @Param("minCalories") Double minCalories,
                        @Param("maxCalories") Double maxCalories,
                        @Param("minProtein") Double minProtein);
}
