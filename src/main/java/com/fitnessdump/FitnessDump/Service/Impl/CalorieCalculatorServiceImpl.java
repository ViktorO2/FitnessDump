package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.*;
import com.fitnessdump.FitnessDump.Exception.ResourceNotFoundException;
import com.fitnessdump.FitnessDump.Model.Enum.ActivityLevel;
import com.fitnessdump.FitnessDump.Model.Enum.Gender;
import com.fitnessdump.FitnessDump.Model.Enum.GoalType;
import com.fitnessdump.FitnessDump.Model.Enum.MealType;
import com.fitnessdump.FitnessDump.Model.User;
import com.fitnessdump.FitnessDump.Repository.FoodRepository;
import com.fitnessdump.FitnessDump.Repository.RecipeRepository;
import com.fitnessdump.FitnessDump.Repository.UserRepository;
import com.fitnessdump.FitnessDump.Service.CalorieCalculatorService;
import com.fitnessdump.FitnessDump.Service.MealPlanService;
import com.fitnessdump.FitnessDump.Service.PersonalSettingsService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class CalorieCalculatorServiceImpl implements CalorieCalculatorService {

    private final UserRepository userRepository;
    private final PersonalSettingsService personalSettingsService;
    private final MealPlanService mealPlanService;
    private final FoodRepository foodRepository;
    private final RecipeRepository recipeRepository;

    @Autowired
    public CalorieCalculatorServiceImpl(UserRepository userRepository, PersonalSettingsService personalSettingsService, MealPlanService mealPlanService, FoodRepository foodRepository, RecipeRepository recipeRepository) {
        this.userRepository = userRepository;
        this.personalSettingsService = personalSettingsService;
        this.mealPlanService = mealPlanService;
        this.foodRepository = foodRepository;
        this.recipeRepository = recipeRepository;
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
    public CalorieCalculatorResponseDTO calculateAndSaveToPersonalSettings(Long userId, CalorieCalculatorRequestDTO request) {
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

    private void validateRequest(CalorieCalculatorRequestDTO requestDTO) {
        if (requestDTO.getWeight() <= 0 || requestDTO.getHeight() <= 0 || requestDTO.getAge() <= 0) {
            throw new IllegalArgumentException("Invalid measurements provided");
        }
    }

    private double calculateBMR(CalorieCalculatorRequestDTO requestDTO) {
        //Формула на Миффлин-Сан Джеор
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

        //Grams
        macros.setTotalCalories(dailyCalories);
        macros.setProteinGrams(proteinGrams);
        macros.setFatsGrams(fatGrams);
        macros.setCarbsGrams(carbsGrams);

        //Percentage
        macros.setProteinPercentage((proteinCalories / dailyCalories) * 100);
        macros.setFatsPercentage((fatCalories / dailyCalories) * 100);
        macros.setCarbsPercentage((carbsCalories / dailyCalories) * 100);

        //Calories
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

        // Създаваме план за 7 дни
        for (int dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
            MealPlanDayDTO day = new MealPlanDayDTO();
            day.setDayOfWeek(dayOfWeek);

            List<MealDTO> meals = generateMealsForDay(calculation);
            day.setMeals(meals);

            days.add(day);
        }

        return days;
    }

    private List<MealDTO> generateMealsForDay(CalorieCalculatorResponseDTO calculation) {
        List<MealDTO> meals = new ArrayList<>();
        double dailyCalories = calculation.getDailyCalories();

        // Разпределяме калориите за деня
        meals.add(createMeal(MealType.BREAKFAST, dailyCalories * 0.3)); // 30% за закуска
        meals.add(createMeal(MealType.LUNCH, dailyCalories * 0.4));     // 40% за обяд
        meals.add(createMeal(MealType.DINNER, dailyCalories * 0.3));    // 30% за вечеря

        return meals;
    }

    private MealDTO createMeal(MealType type, double targetCalories) {
        MealDTO meal = new MealDTO();
        meal.setType(type);

        // логика за избор на храни и рецепти,
        // които отговарят на целевите калории и макроси

        return meal;
    }
}
