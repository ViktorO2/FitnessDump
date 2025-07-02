package com.fitnessdump.FitnessDump.DTOs.Training;

import com.fitnessdump.FitnessDump.DTOs.Nutrition.MealPlanGenerationConfigDTO;

import java.time.LocalDate;

public class DailyPlanGenerationConfigDTO {
    private String planName;
    private String planDescription;
    private LocalDate startDate;
    private Integer durationWeeks;
    private Boolean includeMealPlan;
    private Boolean includeTrainingProgram;
    private Boolean activatePlan;
    private MealPlanGenerationConfigDTO mealPlanConfig;
    private Boolean usePersonalSettingsForMacros;
    private Boolean deactivateExistingPlans;

    public DailyPlanGenerationConfigDTO() {
        // Default values
        this.planName = "Automatic Daily Plan";
        this.planDescription = "Automatically generated daily plan based on your goals and preferences";
        this.startDate = LocalDate.now();
        this.durationWeeks = 4;
        this.includeMealPlan = true;
        this.includeTrainingProgram = true;
        this.activatePlan = true;
        this.usePersonalSettingsForMacros = true;
        this.deactivateExistingPlans = true;
        this.mealPlanConfig = new MealPlanGenerationConfigDTO();
    }

    // Getters and Setters
    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getPlanDescription() {
        return planDescription;
    }

    public void setPlanDescription(String planDescription) {
        this.planDescription = planDescription;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public Integer getDurationWeeks() {
        return durationWeeks;
    }

    public void setDurationWeeks(Integer durationWeeks) {
        this.durationWeeks = durationWeeks;
    }

    public Boolean getIncludeMealPlan() {
        return includeMealPlan;
    }

    public void setIncludeMealPlan(Boolean includeMealPlan) {
        this.includeMealPlan = includeMealPlan;
    }

    public Boolean getIncludeTrainingProgram() {
        return includeTrainingProgram;
    }

    public void setIncludeTrainingProgram(Boolean includeTrainingProgram) {
        this.includeTrainingProgram = includeTrainingProgram;
    }

    public Boolean getActivatePlan() {
        return activatePlan;
    }

    public void setActivatePlan(Boolean activatePlan) {
        this.activatePlan = activatePlan;
    }

    public MealPlanGenerationConfigDTO getMealPlanConfig() {
        return mealPlanConfig;
    }

    public void setMealPlanConfig(MealPlanGenerationConfigDTO mealPlanConfig) {
        this.mealPlanConfig = mealPlanConfig;
    }

    public Boolean getUsePersonalSettingsForMacros() {
        return usePersonalSettingsForMacros;
    }

    public void setUsePersonalSettingsForMacros(Boolean usePersonalSettingsForMacros) {
        this.usePersonalSettingsForMacros = usePersonalSettingsForMacros;
    }

    public Boolean getDeactivateExistingPlans() {
        return deactivateExistingPlans;
    }

    public void setDeactivateExistingPlans(Boolean deactivateExistingPlans) {
        this.deactivateExistingPlans = deactivateExistingPlans;
    }
}