package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, Long> {
    List<TrainingProgram> findByUserId(Long userId);
}