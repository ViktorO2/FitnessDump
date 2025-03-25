package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.Food;
import com.fitnessdump.FitnessDump.Model.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    List<Food> findByNameContainingIgnoreCase(String name);

}
