package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByCategoryId(Long categoryId);

    List<Exercise> findByNameContainingIgnoreCase(String name);
}