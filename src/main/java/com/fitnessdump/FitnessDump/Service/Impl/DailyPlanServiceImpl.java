package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.Exercise.ExerciseCategoryDTO;
import com.fitnessdump.FitnessDump.DTOs.Meals.MealPlanDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.CalorieCalculatorRequestDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.MealPlanGenerationConfigDTO;
import com.fitnessdump.FitnessDump.DTOs.Training.DailyPlanDTO;
import com.fitnessdump.FitnessDump.DTOs.Training.DailyPlanGenerationConfigDTO;
import com.fitnessdump.FitnessDump.DTOs.Training.TrainingProgramDTO;
import com.fitnessdump.FitnessDump.DTOs.User.PersonalSettingsDTO;
import com.fitnessdump.FitnessDump.Exception.ResourceNotFoundException;
import com.fitnessdump.FitnessDump.Model.Exercise.Exercise;
import com.fitnessdump.FitnessDump.Model.Exercise.ExerciseCategory;
import com.fitnessdump.FitnessDump.Model.Training.DailyPlan;
import com.fitnessdump.FitnessDump.Model.Meal.MealPlan;
import com.fitnessdump.FitnessDump.Model.Training.TrainingProgram;
import com.fitnessdump.FitnessDump.Model.Users.User;
import com.fitnessdump.FitnessDump.Repository.DailyPlanRepository;
import com.fitnessdump.FitnessDump.Repository.MealPlanRepository;
import com.fitnessdump.FitnessDump.Repository.TrainingProgramRepository;
import com.fitnessdump.FitnessDump.Repository.UserRepository;
import com.fitnessdump.FitnessDump.Service.CalorieCalculatorService;
import com.fitnessdump.FitnessDump.Service.DailyPlanService;
import com.fitnessdump.FitnessDump.Service.MealPlanService;
import com.fitnessdump.FitnessDump.Service.PersonalSettingsService;
import com.fitnessdump.FitnessDump.Service.TrainingProgramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DailyPlanServiceImpl implements DailyPlanService {

    private final DailyPlanRepository dailyPlanRepository;
    private final UserRepository userRepository;
    private final MealPlanRepository mealPlanRepository;
    private final TrainingProgramRepository trainingProgramRepository;
    private final CalorieCalculatorService calorieCalculatorService;
    private final PersonalSettingsService personalSettingsService;
    private final MealPlanService mealPlanService;
    private final TrainingProgramService trainingProgramService;

    @Autowired
    public DailyPlanServiceImpl(DailyPlanRepository dailyPlanRepository,
            UserRepository userRepository,
            MealPlanRepository mealPlanRepository,
            TrainingProgramRepository trainingProgramRepository,
            CalorieCalculatorService calorieCalculatorService,
            PersonalSettingsService personalSettingsService,
            MealPlanService mealPlanService,
            TrainingProgramService trainingProgramService) {
        this.dailyPlanRepository = dailyPlanRepository;
        this.userRepository = userRepository;
        this.mealPlanRepository = mealPlanRepository;
        this.trainingProgramRepository = trainingProgramRepository;
        this.calorieCalculatorService = calorieCalculatorService;
        this.personalSettingsService = personalSettingsService;
        this.mealPlanService = mealPlanService;
        this.trainingProgramService = trainingProgramService;
    }

    @Override
    @Transactional
    public DailyPlanDTO createDailyPlan(DailyPlanDTO dailyPlanDTO) {
        User user = userRepository.findById(dailyPlanDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        DailyPlan dailyPlan = new DailyPlan();
        dailyPlan.setUser(user);
        dailyPlan.setName(dailyPlanDTO.getName());
        dailyPlan.setDescription(dailyPlanDTO.getDescription());
        dailyPlan.setStartDate(dailyPlanDTO.getStartDate());
        dailyPlan.setEndDate(dailyPlanDTO.getEndDate());
        dailyPlan.setActive(dailyPlanDTO.isActive());

        if (dailyPlanDTO.getMealPlan() != null && dailyPlanDTO.getMealPlan().getId() != null) {
            MealPlan mealPlan = mealPlanRepository.findById(dailyPlanDTO.getMealPlan().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Meal plan not found"));
            dailyPlan.setMealPlan(mealPlan);
        }

        if (dailyPlanDTO.getTrainingProgram() != null && dailyPlanDTO.getTrainingProgram().getId() != null) {
            TrainingProgram trainingProgram = trainingProgramRepository
                    .findById(dailyPlanDTO.getTrainingProgram().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Training program not found"));
            dailyPlan.setTrainingProgram(trainingProgram);
        }

        DailyPlan savedDailyPlan = dailyPlanRepository.save(dailyPlan);
        return convertToDTO(savedDailyPlan);
    }

    @Override
    @Transactional
    public DailyPlanDTO updateDailyPlan(Long id, DailyPlanDTO dailyPlanDTO) {
        DailyPlan dailyPlan = dailyPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Daily plan not found"));

        dailyPlan.setName(dailyPlanDTO.getName());
        dailyPlan.setDescription(dailyPlanDTO.getDescription());
        dailyPlan.setStartDate(dailyPlanDTO.getStartDate());
        dailyPlan.setEndDate(dailyPlanDTO.getEndDate());
        dailyPlan.setActive(dailyPlanDTO.isActive());

        if (dailyPlanDTO.getMealPlan() != null && dailyPlanDTO.getMealPlan().getId() != null) {
            MealPlan mealPlan = mealPlanRepository.findById(dailyPlanDTO.getMealPlan().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Meal plan not found"));
            dailyPlan.setMealPlan(mealPlan);
        }

        if (dailyPlanDTO.getTrainingProgram() != null && dailyPlanDTO.getTrainingProgram().getId() != null) {
            TrainingProgram trainingProgram = trainingProgramRepository
                    .findById(dailyPlanDTO.getTrainingProgram().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Training program not found"));
            dailyPlan.setTrainingProgram(trainingProgram);
        }

        DailyPlan updatedDailyPlan = dailyPlanRepository.save(dailyPlan);
        return convertToDTO(updatedDailyPlan);
    }

    @Override
    @Transactional
    public void deleteDailyPlan(Long id) {
        if (!dailyPlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Daily plan not found");
        }
        dailyPlanRepository.deleteById(id);
    }

    @Override
    public DailyPlanDTO getDailyPlanById(Long id) {
        DailyPlan dailyPlan = dailyPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Daily plan not found"));
        return convertToDTO(dailyPlan);
    }

    @Override
    public List<DailyPlanDTO> getUserDailyPlans(Long userId) {
        List<DailyPlan> dailyPlans = dailyPlanRepository.findByUserId(userId);
        return dailyPlans.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DailyPlanDTO getActiveDailyPlan(Long userId) {
        try {
            DailyPlan dailyPlan = dailyPlanRepository.findByUserIdAndActiveTrue(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("No active daily plan found for user " + userId));
            return convertToDTO(dailyPlan);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Error getting active daily plan for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error retrieving active daily plan: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void deactivateAllUserPlans(Long userId) {
        dailyPlanRepository.deactivateAllUserPlans(userId);
    }

    @Override
    @Transactional
    public DailyPlanDTO generateAutomaticDailyPlan(Long userId) {
        PersonalSettingsDTO personalSettings = personalSettingsService.getOrCreatePersonalSettings(userId);
        CalorieCalculatorRequestDTO request = createRequestFromPersonalSettings(personalSettings);

        MealPlanGenerationConfigDTO mealPlanConfig = new MealPlanGenerationConfigDTO();
        mealPlanConfig.setPlanName("Smart Daily Plan");
        mealPlanConfig.setPlanDescription("Intelligently generated daily plan based on your goals and preferences");
        mealPlanConfig.setStartDate(LocalDate.now());
        mealPlanConfig.setDurationWeeks(4);
        mealPlanConfig.setIncludeWorkoutDays(true);
        mealPlanConfig.setWorkoutDayCalorieMultiplier(1.1);
        mealPlanConfig.setUseSmartGeneration(true);
        mealPlanConfig.setGoal(personalSettings.getGoal());

        double totalGrams = personalSettings.getProtein() + personalSettings.getCarbs() + personalSettings.getFats();
        if (totalGrams > 0) {
            mealPlanConfig.setProteinPercentage(personalSettings.getProtein() / totalGrams);
            mealPlanConfig.setCarbsPercentage(personalSettings.getCarbs() / totalGrams);
            mealPlanConfig.setFatsPercentage(personalSettings.getFats() / totalGrams);
        }

        MealPlanDTO mealPlan = calorieCalculatorService.generateSmartMealPlanWithConfig(userId, request,
                mealPlanConfig);

        TrainingProgramDTO trainingProgram = calorieCalculatorService.generateTrainingProgram(userId, request);

        DailyPlanDTO dailyPlanDTO = new DailyPlanDTO();
        dailyPlanDTO.setUserId(userId);
        dailyPlanDTO.setName("Automatic Daily Plan");
        dailyPlanDTO.setDescription("Automatically generated daily plan based on your goals and preferences");
        dailyPlanDTO.setStartDate(LocalDate.now());
        dailyPlanDTO.setEndDate(LocalDate.now().plusWeeks(mealPlanConfig.getDurationWeeks()));
        dailyPlanDTO.setMealPlan(mealPlan);
        dailyPlanDTO.setTrainingProgram(trainingProgram);
        dailyPlanDTO.setActive(true);

        deactivateAllUserPlans(userId);

        return createDailyPlan(dailyPlanDTO);
    }

    @Override
    @Transactional
    public DailyPlanDTO generateAutomaticDailyPlanWithConfig(Long userId, DailyPlanGenerationConfigDTO config) {

        PersonalSettingsDTO personalSettings = personalSettingsService.getOrCreatePersonalSettings(userId);
        CalorieCalculatorRequestDTO request = createRequestFromPersonalSettings(personalSettings);

        MealPlanDTO mealPlan = null;
        TrainingProgramDTO trainingProgram = null;

        if (config.getIncludeMealPlan()) {
            MealPlanGenerationConfigDTO mealPlanConfig = config.getMealPlanConfig();
            if (mealPlanConfig == null) {
                mealPlanConfig = new MealPlanGenerationConfigDTO();
            }

            mealPlanConfig.setPlanName(config.getPlanName() + " - Meal Plan");
            mealPlanConfig.setStartDate(config.getStartDate());
            mealPlanConfig.setDurationWeeks(config.getDurationWeeks());
            mealPlanConfig.setGoal(personalSettings.getGoal());

            if (config.getUsePersonalSettingsForMacros()) {
                double totalGrams = personalSettings.getProtein() + personalSettings.getCarbs()
                        + personalSettings.getFats();
                if (totalGrams > 0) {
                    mealPlanConfig.setProteinPercentage(personalSettings.getProtein() / totalGrams);
                    mealPlanConfig.setCarbsPercentage(personalSettings.getCarbs() / totalGrams);
                    mealPlanConfig.setFatsPercentage(personalSettings.getFats() / totalGrams);
                }
            }
            mealPlan = calorieCalculatorService.generateSmartMealPlanWithConfig(userId, request, mealPlanConfig);
        }
        if (config.getIncludeTrainingProgram()) {
            trainingProgram = calorieCalculatorService.generateTrainingProgram(userId, request);
        }
        DailyPlanDTO dailyPlanDTO = new DailyPlanDTO();
        dailyPlanDTO.setUserId(userId);
        dailyPlanDTO.setName(config.getPlanName());
        dailyPlanDTO.setDescription(config.getPlanDescription());
        dailyPlanDTO.setStartDate(config.getStartDate());
        dailyPlanDTO.setEndDate(config.getStartDate().plusWeeks(config.getDurationWeeks()));
        dailyPlanDTO.setMealPlan(mealPlan);
        dailyPlanDTO.setTrainingProgram(trainingProgram);
        dailyPlanDTO.setActive(config.getActivatePlan());

        if (config.getDeactivateExistingPlans()) {
            deactivateAllUserPlans(userId);
        }

        return createDailyPlan(dailyPlanDTO);
    }

    private DailyPlanDTO convertToDTO(DailyPlan dailyPlan) {
        DailyPlanDTO dto = new DailyPlanDTO();
        dto.setId(dailyPlan.getId());
        dto.setUserId(dailyPlan.getUser().getId());
        dto.setName(dailyPlan.getName());
        dto.setDescription(dailyPlan.getDescription());
        dto.setStartDate(dailyPlan.getStartDate());
        dto.setEndDate(dailyPlan.getEndDate());
        dto.setActive(dailyPlan.isActive());

        if (dailyPlan.getMealPlan() != null) {
            try {
                MealPlanDTO mealPlanDTO = mealPlanService.getMealPlanById(dailyPlan.getMealPlan().getId());
                dto.setMealPlan(mealPlanDTO);
            } catch (Exception e) {
                System.err.println("Error fetching meal plan: " + e.getMessage());
                dto.setMealPlan(null);
            }
        }

        if (dailyPlan.getTrainingProgram() != null) {
            try {
                TrainingProgramDTO trainingProgramDTO = trainingProgramService
                        .getProgramById(dailyPlan.getTrainingProgram().getId()).orElse(null);
                dto.setTrainingProgram(trainingProgramDTO);
            } catch (Exception e) {
                System.err.println("Error fetching training program: " + e.getMessage());
                dto.setTrainingProgram(null);
            }
        }

        return dto;
    }

    private CalorieCalculatorRequestDTO createRequestFromPersonalSettings(PersonalSettingsDTO settings) {
        CalorieCalculatorRequestDTO request = new CalorieCalculatorRequestDTO();
        request.setWeight(settings.getCurrentWeight());
        request.setHeight(settings.getHeight());
        request.setAge(settings.getAge());
        request.setGender(settings.getGender());
        request.setActivityLevel(settings.getActivityLevel());
        request.setGoal(settings.getGoal());
        return request;
    }
}