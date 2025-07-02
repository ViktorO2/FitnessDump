package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.Exercise.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByCategoryId(Long categoryId);

    List<Exercise> findByNameContainingIgnoreCase(String name);

    @Query("SELECT e FROM Exercise e JOIN e.category c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :categoryName, '%'))")
    List<Exercise> findByCategoryNameContainingIgnoreCase(@Param("categoryName") String categoryName);
}