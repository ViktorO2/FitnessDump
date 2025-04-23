package com.fitnessdump.FitnessDump.Repository;

import aj.org.objectweb.asm.commons.Remapper;
import com.fitnessdump.FitnessDump.Model.Enum.DifficultyLevel;
import com.fitnessdump.FitnessDump.Model.Enum.ProgramGoal;
import com.fitnessdump.FitnessDump.Model.PredefinedProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PredefinedProgramRepository extends JpaRepository<PredefinedProgram,Long> {
    List<PredefinedProgram> findByGoal(ProgramGoal programGoal);
    List<PredefinedProgram>findByDifficulty(DifficultyLevel difficultyLevel);

}
