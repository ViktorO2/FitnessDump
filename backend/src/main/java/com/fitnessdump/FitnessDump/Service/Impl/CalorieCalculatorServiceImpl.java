package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.Meals.MealDTO;
import com.fitnessdump.FitnessDump.DTOs.Meals.MealPlanDTO;
import com.fitnessdump.FitnessDump.DTOs.Meals.MealPlanDayDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.CalorieCalculatorRequestDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.CalorieCalculatorResponseDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.MacroDistributionDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.MealPlanGenerationConfigDTO;
import com.fitnessdump.FitnessDump.DTOs.User.PersonalSettingsDTO;
import com.fitnessdump.FitnessDump.DTOs.Exercise.ProgramExerciseDTO;
import com.fitnessdump.FitnessDump.DTOs.Training.TrainingProgramDTO;
import com.fitnessdump.FitnessDump.Exception.ResourceNotFoundException;
import com.fitnessdump.FitnessDump.Model.Enum.ActivityLevel;
import com.fitnessdump.FitnessDump.Model.Enum.Gender;
import com.fitnessdump.FitnessDump.Model.Enum.GoalType;
import com.fitnessdump.FitnessDump.Model.Enum.MealType;
import com.fitnessdump.FitnessDump.Model.Enum.ProgramGoal;
import com.fitnessdump.FitnessDump.Model.Enum.DifficultyLevel;
import com.fitnessdump.FitnessDump.Model.Exercise.Exercise;
import com.fitnessdump.FitnessDump.Model.Users.User;
import com.fitnessdump.FitnessDump.Repository.FoodRepository;
import com.fitnessdump.FitnessDump.Repository.RecipeRepository;
import com.fitnessdump.FitnessDump.Repository.UserRepository;
import com.fitnessdump.FitnessDump.Repository.ExerciseRepository;
import com.fitnessdump.FitnessDump.Repository.ExerciseCategoryRepository;
import com.fitnessdump.FitnessDump.Service.CalorieCalculatorService;
import com.fitnessdump.FitnessDump.Service.MealPlanService;
import com.fitnessdump.FitnessDump.Service.PersonalSettingsService;
import com.fitnessdump.FitnessDump.Service.TrainingProgramService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class CalorieCalculatorServiceImpl implements CalorieCalculatorService {

    private final UserRepository userRepository;
    private final PersonalSettingsService personalSettingsService;
    private final MealPlanService mealPlanService;
    private final TrainingProgramService trainingProgramService;
    private final FoodRepository foodRepository;
    private final RecipeRepository recipeRepository;
    private final ExerciseRepository exerciseRepository;
    private final ExerciseCategoryRepository exerciseCategoryRepository;

    @Autowired
    public CalorieCalculatorServiceImpl(UserRepository userRepository,
            PersonalSettingsService personalSettingsService,
            MealPlanService mealPlanService,
            TrainingProgramService trainingProgramService,
            FoodRepository foodRepository,
            RecipeRepository recipeRepository,
            ExerciseRepository exerciseRepository,
            ExerciseCategoryRepository exerciseCategoryRepository) {
        this.userRepository = userRepository;
        this.personalSettingsService = personalSettingsService;
        this.mealPlanService = mealPlanService;
        this.trainingProgramService = trainingProgramService;
        this.foodRepository = foodRepository;
        this.recipeRepository = recipeRepository;
        this.exerciseRepository = exerciseRepository;
        this.exerciseCategoryRepository = exerciseCategoryRepository;
    }

    @Override
    public CalorieCalculatorResponseDTO calculateNutrition(CalorieCalculatorRequestDTO request) {
        validateRequest(request);
        double bmr = calculateBMR(request);
        double tdee = calculateTDEE(bmr, request.getActivityLevel());
        double dailyCalories = adjustCaloriesForGoal(tdee, request.getGoal());
        MacroDistributionDTO macros = calculateMacroDistribution(dailyCalories, request.getWeight(), request.getGoal());

        return new CalorieCalculatorResponseDTO(bmr, tdee, dailyCalories, macros);
    }

    @Override
    public CalorieCalculatorResponseDTO calculateAndSaveToPersonalSettings(Long userId,
            CalorieCalculatorRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CalorieCalculatorResponseDTO calculation = calculateNutrition(request);
        PersonalSettingsDTO settings = personalSettingsService.getOrCreatePersonalSettings(userId);
        updatePersonalSettings(settings, request, calculation);
        personalSettingsService.updatePersonalSettings(userId, settings);

        return calculation;
    }

    @Override
    @Transactional
    public MealPlanDTO generateMealPlan(Long userId, CalorieCalculatorRequestDTO request) {
        CalorieCalculatorResponseDTO calculation = calculateNutrition(request);
        MealPlanDTO mealPlanDTO = new MealPlanDTO();
        mealPlanDTO.setUserId(userId);
        mealPlanDTO.setName("Generated Meal Plan");
        mealPlanDTO.setDescription("Automatically generated based on your goals");
        mealPlanDTO.setStartDate(LocalDate.now());
        mealPlanDTO.setEndDate(LocalDate.now().plusWeeks(1));
        mealPlanDTO.setGoal(request.getGoal());
        mealPlanDTO.setTargetCalories(calculation.getDailyCalories());
        mealPlanDTO.setTargetProtein(calculation.getMacroDistribution().getProteinGrams());
        mealPlanDTO.setTargetFats(calculation.getMacroDistribution().getFatsGrams());
        mealPlanDTO.setTargetCarbs(calculation.getMacroDistribution().getCarbsGrams());

        List<MealPlanDayDTO> days = generateMealPlanDays(calculation);
        mealPlanDTO.setDays(days);
        return mealPlanService.createMealPlan(mealPlanDTO);
    }

    @Override
    @Transactional
    public TrainingProgramDTO generateTrainingProgram(Long userId, CalorieCalculatorRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TrainingProgramDTO programDTO = new TrainingProgramDTO();
        programDTO.setUserId(userId);
        programDTO.setName("Generated Training Program");
        programDTO.setDescription("Automatically generated based on your goals and fitness level");

        ProgramGoal programGoal = mapNutritionGoalToProgramGoal(request.getGoal());

        List<ProgramExerciseDTO> exercises = generateExercisesForGoal(programGoal, request);
        programDTO.setExercises(exercises);

        return trainingProgramService.createProgram(programDTO);
    }

    @Override
    @Transactional
    public void generateDailyPlan(Long userId, CalorieCalculatorRequestDTO request) {

        MealPlanDTO mealPlan = generateSmartMealPlan(userId, request, true);

        TrainingProgramDTO trainingProgram = generateTrainingProgram(userId, request);

        // TODO: Тук бихме могли да създадем DailyPlan обект

    }

    @Override
    @Transactional
    public MealPlanDTO generateSmartMealPlan(Long userId, CalorieCalculatorRequestDTO request,
            boolean includeWorkoutDays) {
        CalorieCalculatorResponseDTO calculation = calculateNutrition(request);
        MealPlanDTO mealPlanDTO = new MealPlanDTO();
        mealPlanDTO.setUserId(userId);
        mealPlanDTO.setName("Smart Meal Plan");
        mealPlanDTO.setDescription("Intelligently generated meal plan considering workout days");
        mealPlanDTO.setStartDate(LocalDate.now());
        mealPlanDTO.setEndDate(LocalDate.now().plusWeeks(1));
        mealPlanDTO.setGoal(request.getGoal());

        if (includeWorkoutDays) {
            double workoutDayCalories = calculation.getDailyCalories() * 1.1; // 10% повече за тренировъчни дни
            mealPlanDTO.setTargetCalories(workoutDayCalories);
        } else {
            mealPlanDTO.setTargetCalories(calculation.getDailyCalories());
        }

        mealPlanDTO.setTargetProtein(calculation.getMacroDistribution().getProteinGrams());
        mealPlanDTO.setTargetFats(calculation.getMacroDistribution().getFatsGrams());
        mealPlanDTO.setTargetCarbs(calculation.getMacroDistribution().getCarbsGrams());

        List<MealPlanDayDTO> days = generateSmartMealPlanDays(calculation, includeWorkoutDays);
        mealPlanDTO.setDays(days);
        return mealPlanService.createMealPlan(mealPlanDTO);
    }


    private void validateRequest(CalorieCalculatorRequestDTO requestDTO) {
        if (requestDTO.getWeight() <= 0 || requestDTO.getHeight() <= 0 || requestDTO.getAge() <= 0) {
            throw new IllegalArgumentException("Invalid measurements provided");
        }
    }
    private double calculateBMR(CalorieCalculatorRequestDTO requestDTO) {
        if (requestDTO.getGender() == Gender.MALE) {
            return (10 * requestDTO.getWeight()) + (6.25 * requestDTO.getHeight()) - (5 * requestDTO.getAge()) + 5;
        } else {
            return (10 * requestDTO.getWeight()) + (6.25 * requestDTO.getHeight()) - (5 * requestDTO.getAge()) - 161;
        }
    }

    private double adjustCaloriesForGoal(double tdee, GoalType goal) {
        return tdee + goal.getCalorieAdjustment();
    }

    private double calculateTDEE(double bmr, ActivityLevel activityLevel) {
        return bmr * activityLevel.getMultiplier();
    }

    private MacroDistributionDTO calculateMacroDistribution(double dailyCalories, Double weight, GoalType goal) {
        MacroDistributionDTO macros = new MacroDistributionDTO();

        double proteinGrams = weight * goal.getProteinMultiplier();
        double fatGrams = (dailyCalories * goal.getFatRatio()) / 9;
        double proteinCalories = proteinGrams * 4;
        double fatCalories = fatGrams * 9;
        double carbsCalories = dailyCalories - proteinCalories - fatCalories;
        double carbsGrams = carbsCalories / 4;

        // Grams
        macros.setTotalCalories(dailyCalories);
        macros.setProteinGrams(proteinGrams);
        macros.setFatsGrams(fatGrams);
        macros.setCarbsGrams(carbsGrams);

        // Percentage
        macros.setProteinPercentage((proteinCalories / dailyCalories) * 100);
        macros.setFatsPercentage((fatCalories / dailyCalories) * 100);
        macros.setCarbsPercentage((carbsCalories / dailyCalories) * 100);

        // Calories
        macros.setProteinCalories(proteinCalories);
        macros.setFatsCalories(fatCalories);
        macros.setCarbsCalories(carbsCalories);

        return macros;
    }


    private void updatePersonalSettings(
            PersonalSettingsDTO settings,
            CalorieCalculatorRequestDTO request,
            CalorieCalculatorResponseDTO calculation) {
        settings.setCurrentWeight(request.getWeight());
        settings.setHeight(request.getHeight());
        settings.setAge(request.getAge());
        settings.setGender(request.getGender());
        settings.setActivityLevel(request.getActivityLevel());
        settings.setGoal(request.getGoal());
        settings.setBmr(calculation.getBmr());
        settings.setTdee(calculation.getTdee());
        settings.setDailyCalories(calculation.getDailyCalories());
        settings.setProtein(calculation.getMacroDistribution().getProteinGrams());
        settings.setFats(calculation.getMacroDistribution().getFatsGrams());
        settings.setCarbs(calculation.getMacroDistribution().getCarbsGrams());
    }

    private List<MealPlanDayDTO> generateMealPlanDays(CalorieCalculatorResponseDTO calculation) {
        List<MealPlanDayDTO> days = new ArrayList<>();

        for (int dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
            MealPlanDayDTO day = new MealPlanDayDTO();
            day.setDayOfWeek(dayOfWeek);

            List<MealDTO> meals = generateMealsForDay(calculation);
            day.setMeals(meals);

            days.add(day);
        }

        return days;
    }

    private List<MealPlanDayDTO> generateSmartMealPlanDays(CalorieCalculatorResponseDTO calculation,
            boolean includeWorkoutDays) {
        List<MealPlanDayDTO> days = new ArrayList<>();

        for (int dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
            MealPlanDayDTO day = new MealPlanDayDTO();
            day.setDayOfWeek(dayOfWeek);

            boolean isWorkoutDay = isWorkoutDay(dayOfWeek);

            List<MealDTO> meals = generateSmartMealsForDay(calculation, isWorkoutDay && includeWorkoutDays);
            day.setMeals(meals);

            days.add(day);
        }

        return days;
    }

    private List<MealDTO> generateMealsForDay(CalorieCalculatorResponseDTO calculation) {
        List<MealDTO> meals = new ArrayList<>();
        double dailyCalories = calculation.getDailyCalories();

        // Разпределяме калориите за деня
        meals.add(createMeal(MealType.BREAKFAST, dailyCalories * 0.3));
        meals.add(createMeal(MealType.LUNCH, dailyCalories * 0.4));
        meals.add(createMeal(MealType.DINNER, dailyCalories * 0.3));

        return meals;
    }

    private List<MealDTO> generateSmartMealsForDay(CalorieCalculatorResponseDTO calculation, boolean isWorkoutDay) {
        List<MealDTO> meals = new ArrayList<>();
        double dailyCalories = calculation.getDailyCalories();

        if (isWorkoutDay) {

            meals.add(createMeal(MealType.BREAKFAST, dailyCalories * 0.25));
            meals.add(createMeal(MealType.LUNCH, dailyCalories * 0.35));
            meals.add(createMeal(MealType.DINNER, dailyCalories * 0.4));
        } else {

            meals.add(createMeal(MealType.BREAKFAST, dailyCalories * 0.3));
            meals.add(createMeal(MealType.LUNCH, dailyCalories * 0.4));
            meals.add(createMeal(MealType.DINNER, dailyCalories * 0.3));
        }

        return meals;
    }

    private MealDTO createMeal(MealType type, double targetCalories) {
        MealDTO meal = new MealDTO();
        meal.setType(type);
        meal.setTotalCalories(targetCalories);

        // TODO: логика за избор на конкретни храни и рецепти
        // които отговарят на целевите калории и макроси
        // Например: foodRepository.findByCaloriesBetween(targetCalories * 0.8,
        // targetCalories * 1.2)

        return meal;
    }

    private ProgramGoal mapNutritionGoalToProgramGoal(GoalType nutritionGoal) {
        switch (nutritionGoal) {
            case LOSE_WEIGHT:
                return ProgramGoal.ENDURANCE;
            case GAIN_WEIGHT:
                return ProgramGoal.MUSCLE_GAIN;
            case MAINTAIN_WEIGHT:
                return ProgramGoal.STRENGTH;
            default:
                return ProgramGoal.STRENGTH;
        }
    }

    private List<ProgramExerciseDTO> generateExercisesForGoal(ProgramGoal goal, CalorieCalculatorRequestDTO request) {
        List<ProgramExerciseDTO> exercises = new ArrayList<>();

        int workoutDays = determineWorkoutDays(goal);

        for (int day = 1; day <= workoutDays; day++) {
            List<Exercise> dayExercises = selectExercisesForGoal(goal, day);

            for (int i = 0; i < dayExercises.size(); i++) {
                Exercise exercise = dayExercises.get(i);
                ProgramExerciseDTO exerciseDTO = new ProgramExerciseDTO();
                exerciseDTO.setExerciseId(exercise.getId());
                exerciseDTO.setDayOfWeek(day);
                exerciseDTO.setOrderInDay(i + 1);

                setSetsAndReps(exerciseDTO, goal);

                exercises.add(exerciseDTO);
            }
        }

        return exercises;
    }

    private int determineWorkoutDays(ProgramGoal goal) {
        switch (goal) {
            case MUSCLE_GAIN:
                return 5; // 5 дни тренировка за мускулна маса
            case WEIGHT_LOSS:
                return 4; // 4 дни тренировка за отслабване
            case ENDURANCE:
                return 6; // 6 дни тренировка за издръжливост
            case STRENGTH:
                return 4; // 4 дни тренировка за сила
            case FLEXIBILITY:
                return 3; // 3 дни тренировка за гъвкавост
            default:
                return 4;
        }
    }

    private List<Exercise> selectExercisesForGoal(ProgramGoal goal, int dayOfWeek) {
        List<Exercise> exercises = new ArrayList<>();

        int exerciseCount = determineExerciseCount(goal);

        switch (goal) {
            case MUSCLE_GAIN:
                exercises = selectMuscleGainExercises(dayOfWeek, exerciseCount);
                break;
            case WEIGHT_LOSS:
                exercises = selectWeightLossExercises(dayOfWeek, exerciseCount);
                break;
            case ENDURANCE:
                exercises = selectEnduranceExercises(dayOfWeek, exerciseCount);
                break;
            case STRENGTH:
                exercises = selectStrengthExercises(dayOfWeek, exerciseCount);
                break;
            case FLEXIBILITY:
                exercises = selectFlexibilityExercises(dayOfWeek, exerciseCount);
                break;
        }

        return exercises;
    }

    private int determineExerciseCount(ProgramGoal goal) {
        switch (goal) {
            case MUSCLE_GAIN:
                return 6; // 6 упражнения за мускулна маса
            case WEIGHT_LOSS:
                return 8; // 8 упражнения за отслабване (повече кардио)
            case ENDURANCE:
                return 5; // 5 упражнения за издръжливост
            case STRENGTH:
                return 4; // 4 упражнения за сила (фокус върху тежести)
            case FLEXIBILITY:
                return 6; // 6 упражнения за гъвкавост
            default:
                return 5;
        }
    }

    private List<Exercise> selectMuscleGainExercises(int dayOfWeek, int count) {
        List<Exercise> exercises = new ArrayList<>();

        switch (dayOfWeek) {
            case 1: // Понеделник - Гърди и трицепси
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("chest").stream().limit(3).toList());
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("triceps").stream().limit(2)
                        .toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("abs").stream().limit(1).toList());
                break;
            case 2: // Вторник - Гърб и бицепси
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("back").stream().limit(3).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("biceps").stream().limit(2).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("abs").stream().limit(1).toList());
                break;
            case 3: // Сряда - Крака
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("legs").stream().limit(4).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("calves").stream().limit(2).toList());
                break;
            case 4: // Четвъртък - Рамене
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("shoulders").stream()
                        .limit(4).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("abs").stream().limit(2).toList());
                break;
            case 5: // Петък - Пълно тяло
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("compound").stream().limit(3)
                        .toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("cardio").stream().limit(3).toList());
                break;
        }

        if (exercises.size() < count) {
            List<Exercise> allExercises = exerciseRepository.findAll();
            while (exercises.size() < count && !allExercises.isEmpty()) {
                exercises.add(allExercises.remove(0));
            }
        }

        return exercises.stream().limit(count).toList();
    }

    private List<Exercise> selectWeightLossExercises(int dayOfWeek, int count) {
        List<Exercise> exercises = new ArrayList<>();

        switch (dayOfWeek) {
            case 1:
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("cardio").stream().limit(3).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("chest").stream().limit(2).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("back").stream().limit(2).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("abs").stream().limit(1).toList());
                break;
            case 2: // Вторник - Кардио + Крака
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("cardio").stream().limit(3).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("legs").stream().limit(3).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("calves").stream().limit(2).toList());
                break;
            case 3: // Сряда - Интервална тренировка
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("hiit").stream().limit(4).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("cardio").stream().limit(2).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("abs").stream().limit(2).toList());
                break;
            case 4: // Четвъртък - Силова тренировка
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("compound").stream().limit(4)
                        .toList());
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("shoulders").stream()
                        .limit(2).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("arms").stream().limit(2).toList());
                break;
        }

        if (exercises.size() < count) {
            List<Exercise> allExercises = exerciseRepository.findAll();
            while (exercises.size() < count && !allExercises.isEmpty()) {
                exercises.add(allExercises.remove(0));
            }
        }

        return exercises.stream().limit(count).toList();
    }

    private List<Exercise> selectEnduranceExercises(int dayOfWeek, int count) {
        List<Exercise> exercises = new ArrayList<>();

        switch (dayOfWeek) {
            case 1: // Понеделник - Дълго кардио
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("cardio").stream().limit(3).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("legs").stream().limit(2).toList());
                break;
            case 2: // Вторник - Горна част с високи повторения
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("chest").stream().limit(2).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("back").stream().limit(2).toList());
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("shoulders").stream()
                        .limit(1).toList());
                break;
            case 3: // Сряда - Крака с високи повторения
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("legs").stream().limit(3).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("calves").stream().limit(2).toList());
                break;
            case 4: // Четвъртък - Кръгова тренировка
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("compound").stream().limit(3)
                        .toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("cardio").stream().limit(2).toList());
                break;
            case 5: // Петък - Дълго кардио
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("cardio").stream().limit(4).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("abs").stream().limit(1).toList());
                break;
            case 6: // Събота - Лека тренировка
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("cardio").stream().limit(2).toList());
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("flexibility").stream()
                        .limit(3).toList());
                break;
        }

        if (exercises.size() < count) {
            List<Exercise> allExercises = exerciseRepository.findAll();
            while (exercises.size() < count && !allExercises.isEmpty()) {
                exercises.add(allExercises.remove(0));
            }
        }

        return exercises.stream().limit(count).toList();
    }

    private List<Exercise> selectStrengthExercises(int dayOfWeek, int count) {
        List<Exercise> exercises = new ArrayList<>();

        switch (dayOfWeek) {
            case 1: // Понеделник - Гърди и трицепси
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("chest").stream().limit(2).toList());
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("triceps").stream().limit(1)
                        .toList());
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("compound").stream().limit(1)
                        .toList());
                break;
            case 2: // Вторник - Гърб и бицепси
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("back").stream().limit(2).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("biceps").stream().limit(1).toList());
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("compound").stream().limit(1)
                        .toList());
                break;
            case 3: // Сряда - Крака
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("legs").stream().limit(3).toList());
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("compound").stream().limit(1)
                        .toList());
                break;
            case 4: // Четвъртък - Рамене
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("shoulders").stream()
                        .limit(3).toList());
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("compound").stream().limit(1)
                        .toList());
                break;
        }

        if (exercises.size() < count) {
            List<Exercise> allExercises = exerciseRepository.findAll();
            while (exercises.size() < count && !allExercises.isEmpty()) {
                exercises.add(allExercises.remove(0));
            }
        }

        return exercises.stream().limit(count).toList();
    }

    private List<Exercise> selectFlexibilityExercises(int dayOfWeek, int count) {
        List<Exercise> exercises = new ArrayList<>();

        switch (dayOfWeek) {
            case 1: // Понеделник - Горна част
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("flexibility").stream()
                        .limit(3).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("yoga").stream().limit(2).toList());
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("stretching").stream()
                        .limit(1).toList());
                break;
            case 2: // Вторник - Долна част
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("flexibility").stream()
                        .limit(2).toList());
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("yoga").stream().limit(2).toList());
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("stretching").stream()
                        .limit(2).toList());
                break;
            case 3: // Сряда - Пълно тяло
                exercises.addAll(
                        exerciseRepository.findByCategoryNameContainingIgnoreCase("yoga").stream().limit(3).toList());
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("flexibility").stream()
                        .limit(2).toList());
                exercises.addAll(exerciseRepository.findByCategoryNameContainingIgnoreCase("pilates").stream().limit(1)
                        .toList());
                break;
        }

        if (exercises.size() < count) {
            List<Exercise> allExercises = exerciseRepository.findAll();
            while (exercises.size() < count && !allExercises.isEmpty()) {
                exercises.add(allExercises.remove(0));
            }
        }

        return exercises.stream().limit(count).toList();
    }

    private void setSetsAndReps(ProgramExerciseDTO exerciseDTO, ProgramGoal goal) {
        switch (goal) {
            case MUSCLE_GAIN:
                exerciseDTO.setSets(4);
                exerciseDTO.setReps(8);
                break;
            case WEIGHT_LOSS:
                exerciseDTO.setSets(3);
                exerciseDTO.setReps(15);
                break;
            case ENDURANCE:
                exerciseDTO.setSets(3);
                exerciseDTO.setReps(20);
                break;
            case STRENGTH:
                exerciseDTO.setSets(5);
                exerciseDTO.setReps(5);
                break;
            case FLEXIBILITY:
                exerciseDTO.setSets(1);
                exerciseDTO.setReps(1);
                break;
        }
    }

    private boolean isWorkoutDay(int dayOfWeek) {
        return dayOfWeek == 1 || dayOfWeek == 3 || dayOfWeek == 5;
    }

    @Override
    @Transactional
    public MealPlanDTO generateMealPlanWithConfig(Long userId, CalorieCalculatorRequestDTO request,
            MealPlanGenerationConfigDTO config) {
        CalorieCalculatorResponseDTO calculation = calculateNutrition(request);

        if (config.getProteinPercentage() != null && config.getCarbsPercentage() != null
                && config.getFatsPercentage() != null) {
            calculation.setMacroDistribution(
                    calculateMacroDistributionWithConfig(calculation.getDailyCalories(), request.getWeight(), config));
        }

        MealPlanDTO mealPlanDTO = new MealPlanDTO();
        mealPlanDTO.setUserId(userId);
        mealPlanDTO.setName(config.getPlanName());
        mealPlanDTO.setDescription(config.getPlanDescription());
        mealPlanDTO.setStartDate(config.getStartDate());
        mealPlanDTO.setEndDate(config.getStartDate().plusWeeks(config.getDurationWeeks()));
        mealPlanDTO.setGoal(config.getGoal() != null ? config.getGoal() : request.getGoal());
        mealPlanDTO.setTargetCalories(calculation.getDailyCalories());
        mealPlanDTO.setTargetProtein(calculation.getMacroDistribution().getProteinGrams());
        mealPlanDTO.setTargetFats(calculation.getMacroDistribution().getFatsGrams());
        mealPlanDTO.setTargetCarbs(calculation.getMacroDistribution().getCarbsGrams());

        List<MealPlanDayDTO> days = generateMealPlanDaysWithConfig(calculation, config);
        mealPlanDTO.setDays(days);
        return mealPlanService.createMealPlan(mealPlanDTO);
    }

    @Override
    @Transactional
    public MealPlanDTO generateSmartMealPlanWithConfig(Long userId, CalorieCalculatorRequestDTO request,
            MealPlanGenerationConfigDTO config) {
        CalorieCalculatorResponseDTO calculation = calculateNutrition(request);

        if (config.getProteinPercentage() != null && config.getCarbsPercentage() != null
                && config.getFatsPercentage() != null) {
            calculation.setMacroDistribution(
                    calculateMacroDistributionWithConfig(calculation.getDailyCalories(), request.getWeight(), config));
        }

        MealPlanDTO mealPlanDTO = new MealPlanDTO();
        mealPlanDTO.setUserId(userId);
        mealPlanDTO.setName(config.getPlanName());
        mealPlanDTO.setDescription(config.getPlanDescription());
        mealPlanDTO.setStartDate(config.getStartDate());
        mealPlanDTO.setEndDate(config.getStartDate().plusWeeks(config.getDurationWeeks()));
        mealPlanDTO.setGoal(config.getGoal() != null ? config.getGoal() : request.getGoal());

        if (config.getIncludeWorkoutDays() && config.getWorkoutDayCalorieMultiplier() != null) {
            double workoutDayCalories = calculation.getDailyCalories() * config.getWorkoutDayCalorieMultiplier();
            mealPlanDTO.setTargetCalories(workoutDayCalories);
        } else {
            mealPlanDTO.setTargetCalories(calculation.getDailyCalories());
        }

        mealPlanDTO.setTargetProtein(calculation.getMacroDistribution().getProteinGrams());
        mealPlanDTO.setTargetFats(calculation.getMacroDistribution().getFatsGrams());
        mealPlanDTO.setTargetCarbs(calculation.getMacroDistribution().getCarbsGrams());

        List<MealPlanDayDTO> days = generateSmartMealPlanDaysWithConfig(calculation, config);
        mealPlanDTO.setDays(days);
        return mealPlanService.createMealPlan(mealPlanDTO);
    }

    private MacroDistributionDTO calculateMacroDistributionWithConfig(double dailyCalories, Double weight,
            MealPlanGenerationConfigDTO config) {
        MacroDistributionDTO macros = new MacroDistributionDTO();

        double proteinGrams = weight * (config.getProteinPercentage() / 100.0) * 4; // Convert percentage to grams
        double fatGrams = (dailyCalories * config.getFatsPercentage()) / 9;
        double carbsGrams = (dailyCalories * config.getCarbsPercentage()) / 4;

        double proteinCalories = proteinGrams * 4;
        double fatCalories = fatGrams * 9;
        double carbsCalories = carbsGrams * 4;

        // Grams
        macros.setTotalCalories(dailyCalories);
        macros.setProteinGrams(proteinGrams);
        macros.setFatsGrams(fatGrams);
        macros.setCarbsGrams(carbsGrams);

        // Percentage
        macros.setProteinPercentage(config.getProteinPercentage() * 100);
        macros.setFatsPercentage(config.getFatsPercentage() * 100);
        macros.setCarbsPercentage(config.getCarbsPercentage() * 100);

        // Calories
        macros.setProteinCalories(proteinCalories);
        macros.setFatsCalories(fatCalories);
        macros.setCarbsCalories(carbsCalories);

        return macros;
    }

    private List<MealPlanDayDTO> generateMealPlanDaysWithConfig(CalorieCalculatorResponseDTO calculation,
            MealPlanGenerationConfigDTO config) {
        List<MealPlanDayDTO> days = new ArrayList<>();
        int totalDays = config.getDurationWeeks() * 7;

        for (int dayOfWeek = 1; dayOfWeek <= totalDays; dayOfWeek++) {
            MealPlanDayDTO day = new MealPlanDayDTO();
            day.setDayOfWeek(dayOfWeek);

            List<MealDTO> meals = generateMealsForDayWithConfig(calculation, config);
            day.setMeals(meals);

            days.add(day);
        }

        return days;
    }

    private List<MealPlanDayDTO> generateSmartMealPlanDaysWithConfig(CalorieCalculatorResponseDTO calculation,
            MealPlanGenerationConfigDTO config) {
        List<MealPlanDayDTO> days = new ArrayList<>();
        int totalDays = config.getDurationWeeks() * 7;

        for (int dayOfWeek = 1; dayOfWeek <= totalDays; dayOfWeek++) {
            MealPlanDayDTO day = new MealPlanDayDTO();
            day.setDayOfWeek(dayOfWeek);

            boolean isWorkoutDay = isWorkoutDay(dayOfWeek);
            List<MealDTO> meals = generateSmartMealsForDayWithConfig(calculation,
                    isWorkoutDay && config.getIncludeWorkoutDays(), config);
            day.setMeals(meals);

            days.add(day);
        }

        return days;
    }

    private List<MealDTO> generateMealsForDayWithConfig(CalorieCalculatorResponseDTO calculation,
            MealPlanGenerationConfigDTO config) {
        List<MealDTO> meals = new ArrayList<>();
        double dailyCalories = calculation.getDailyCalories();

        // Use configured meal distribution
        for (Map.Entry<MealType, Double> entry : config.getMealDistribution().entrySet()) {
            meals.add(createMeal(entry.getKey(), dailyCalories * entry.getValue()));
        }

        return meals;
    }

    private List<MealDTO> generateSmartMealsForDayWithConfig(CalorieCalculatorResponseDTO calculation,
            boolean isWorkoutDay, MealPlanGenerationConfigDTO config) {
        List<MealDTO> meals = new ArrayList<>();
        double dailyCalories = calculation.getDailyCalories();

        Map<MealType, Double> distribution = isWorkoutDay ? config.getWorkoutDayMealDistribution()
                : config.getMealDistribution();

        for (Map.Entry<MealType, Double> entry : distribution.entrySet()) {
            meals.add(createMeal(entry.getKey(), dailyCalories * entry.getValue()));
        }

        return meals;
    }
}
