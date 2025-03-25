package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.FoodHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface FoodHistoryRepository extends JpaRepository<FoodHistory,Long> {
    List<FoodHistory> findByUserId(Long userId);
}
