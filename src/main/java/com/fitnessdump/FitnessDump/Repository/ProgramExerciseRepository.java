package com.fitnessdump.FitnessDump.Repository;

import com.fitnessdump.FitnessDump.Model.ProgramExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramExerciseRepository extends JpaRepository<ProgramExercise, Long> {
    List<ProgramExercise> findByTrainingProgramId(Long programId);

    void deleteByTrainingProgramId(Long programId);
}