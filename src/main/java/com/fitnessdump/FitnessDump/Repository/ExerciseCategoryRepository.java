package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.ExerciseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExerciseCategoryRepository extends JpaRepository<ExerciseCategory, Long> {
}