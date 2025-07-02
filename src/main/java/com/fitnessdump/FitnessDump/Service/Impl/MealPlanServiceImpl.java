package com.fitnessdump.FitnessDump.Service.Impl;

import com.fitnessdump.FitnessDump.DTOs.Meals.MealDTO;
import com.fitnessdump.FitnessDump.DTOs.Meals.MealItemDTO;
import com.fitnessdump.FitnessDump.DTOs.Meals.MealPlanDTO;
import com.fitnessdump.FitnessDump.DTOs.Meals.MealPlanDayDTO;
import com.fitnessdump.FitnessDump.DTOs.Nutrition.NutritionSummaryDTO;
import com.fitnessdump.FitnessDump.Exception.ResourceNotFoundException;
import com.fitnessdump.FitnessDump.Model.Enum.GoalType;
import com.fitnessdump.FitnessDump.Model.Nutrition.Food;
import com.fitnessdump.FitnessDump.Model.Meal.Meal;
import com.fitnessdump.FitnessDump.Model.Meal.MealItem;
import com.fitnessdump.FitnessDump.Model.Meal.MealPlan;
import com.fitnessdump.FitnessDump.Model.Meal.MealPlanDay;
import com.fitnessdump.FitnessDump.Model.Nutrition.Recipe;
import com.fitnessdump.FitnessDump.Model.Users.User;
import com.fitnessdump.FitnessDump.Repository.*;
import com.fitnessdump.FitnessDump.Service.MealPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MealPlanServiceImpl implements MealPlanService {
    private final MealPlanRepository mealPlanRepository;
    private final MealPlanDayRepository mealPlanDayRepository;
    private final MealRepository mealRepository;
    private final MealItemRepository mealItemRepository;
    private final UserRepository userRepository;
    private final FoodRepository foodRepository;
    private final RecipeRepository recipeRepository;

    @Autowired
    public MealPlanServiceImpl(MealPlanRepository mealPlanRepository, MealPlanDayRepository mealPlanDayRepository,
            MealRepository mealRepository, MealItemRepository mealItemRepository, UserRepository userRepository,
            FoodRepository foodRepository, RecipeRepository recipeRepository) {
        this.mealPlanRepository = mealPlanRepository;
        this.mealPlanDayRepository = mealPlanDayRepository;
        this.mealRepository = mealRepository;
        this.mealItemRepository = mealItemRepository;
        this.userRepository = userRepository;
        this.foodRepository = foodRepository;
        this.recipeRepository = recipeRepository;
    }

    @Override
    public MealPlanDTO createMealPlan(MealPlanDTO mealPlanDTO) {
        User user = userRepository.findById(mealPlanDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        MealPlan mealPlan = new MealPlan();
        updateMealPlanFromDTO(mealPlan, mealPlanDTO);
        mealPlan.setUser(user);

        if (mealPlanDTO.getDays() != null) {
            for (MealPlanDayDTO dayDTO : mealPlanDTO.getDays()) {
                if (dayDTO != null) {
                    MealPlanDay day = new MealPlanDay();
                    day.setDayOfWeek(dayDTO.getDayOfWeek());
                    day.setMealPlan(mealPlan);

                    // Create meals for each day
                    if (dayDTO.getMeals() != null) {
                        for (MealDTO mealDTO : dayDTO.getMeals()) {
                            if (mealDTO != null) {
                                Meal meal = createMealFromDTO(mealDTO);
                                meal.setDay(day);
                                day.getMeals().add(meal);
                            }
                        }
                    }

                    mealPlan.getDays().add(day);
                }
            }
        }

        MealPlan savedMealPlan = mealPlanRepository.save(mealPlan);
        return convertToDTO(savedMealPlan);
    }

    @Override
    public MealPlanDTO updateMealPlan(Long id, MealPlanDTO mealPlanDTO) {
        MealPlan existingMeatPlan = mealPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meal plan not found"));

        updateMealPlanFromDTO(existingMeatPlan, mealPlanDTO);
        existingMeatPlan.getDays().clear();

        if (mealPlanDTO.getDays() != null) {
            for (MealPlanDayDTO dayDTO : mealPlanDTO.getDays()) {
                if (dayDTO != null) {
                    MealPlanDay day = new MealPlanDay();
                    day.setDayOfWeek(dayDTO.getDayOfWeek());
                    day.setMealPlan(existingMeatPlan);

                    if (dayDTO.getMeals() != null) {
                        for (MealDTO mealDTO : dayDTO.getMeals()) {
                            if (mealDTO != null) {
                                Meal meal = createMealFromDTO(mealDTO);
                                meal.setDay(day);
                                day.getMeals().add(meal);
                            }
                        }
                    }
                    existingMeatPlan.getDays().add(day);
                }
            }
        }
        MealPlan updateMealPlan = mealPlanRepository.save(existingMeatPlan);
        return convertToDTO(updateMealPlan);
    }

    @Override
    public void deleteMealPlan(Long id) {
        if (!mealPlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Meal plan not found");

        }
        mealPlanRepository.deleteById(id);
    }

    @Override
    public MealPlanDTO getMealPlanById(Long id) {
        MealPlan mealPlan = mealPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meal plan not found"));

        return convertToDTO(mealPlan);
    }

    @Override
    public List<MealPlanDTO> getMealPlansByUser(Long userId) {
        return mealPlanRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MealPlanDTO> getMealPlansByUserAndGoal(Long userId, GoalType goal) {
        return mealPlanRepository.findByUserIdAndGoal(userId, goal).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void addMealToDay(Long mealPlanId, Integer dayOfWeek, MealDTO mealDTO) {
        MealPlanDay day = mealPlanDayRepository.findByMealPlanIdAndDayOfWeek(mealPlanId, dayOfWeek);
        if (day == null) {
            throw new ResourceNotFoundException("Day not found in meal plan");
        }

        Meal meal = createMealFromDTO(mealDTO);
        meal.setDay(day);
        day.getMeals().add(meal);
        mealPlanDayRepository.save(day);
    }

    @Override
    public void removeMealFromDay(Long mealPlanId, Integer dayOfWeek, Long mealId) {
        MealPlanDay day = mealPlanDayRepository.findByMealPlanIdAndDayOfWeek(mealPlanId, dayOfWeek);
        if (day == null) {
            throw new ResourceNotFoundException("Day not found in meal plan");
        }

        day.getMeals().removeIf(meal -> meal.getId().equals(mealId));
        mealPlanDayRepository.save(day);
    }

    @Override
    public void updateMealInDay(Long mealPlanId, Integer dayOfWeek, Long mealId, MealDTO mealDTO) {
        Meal existingMeal = mealRepository.findById(mealId)
                .orElseThrow(() -> new ResourceNotFoundException("Meal not found"));

        updateMealFromDTO(existingMeal, mealDTO);
        mealRepository.save(existingMeal);
    }

    @Override
    public Double calculateDayTotalCalories(Long mealPlanId, Integer dayOfWeek) {
        MealPlanDay day = mealPlanDayRepository.findByMealPlanIdAndDayOfWeek(mealPlanId, dayOfWeek);
        if (day == null) {
            throw new ResourceNotFoundException("Day not found in meal plan");
        }

        return day.getMeals().stream()
                .flatMap(meal -> meal.getItems().stream())
                .mapToDouble(this::calculateItemCalories)
                .sum();
    }

    @Override
    public NutritionSummaryDTO calculateMealPlanNutrition(Long mealPlanId) {
        MealPlan mealPlan = mealPlanRepository.findById(mealPlanId)
                .orElseThrow(() -> new ResourceNotFoundException("Meal plan not found"));

        NutritionSummaryDTO summary = new NutritionSummaryDTO();
        summary.setTotalCalories(0.0);
        summary.setTotalProtein(0.0);
        summary.setTotalFats(0.0);
        summary.setTotalCarbs(0.0);

        for (MealPlanDay day : mealPlan.getDays()) {
            for (Meal meal : day.getMeals()) {
                for (MealItem item : meal.getItems()) {
                    updateNutritionSummary(summary, item);
                }
            }
        }
        return summary;

    }

    private Meal createMealFromDTO(MealDTO dto) {
        Meal meal = new Meal();
        meal.setType(dto.getType());

        if (dto.getItems() != null) {
            for (MealItemDTO itemDTO : dto.getItems()) {
                if (itemDTO != null) {
                    MealItem item = new MealItem();
                    item.setAmount(itemDTO.getAmount());

                    if (itemDTO.getFoodId() != null) {
                        Food food = foodRepository.findById(itemDTO.getFoodId())
                                .orElseThrow(() -> new ResourceNotFoundException("Food not found"));
                        item.setFood(food);
                    }

                    if (itemDTO.getRecipeId() != null) {
                        Recipe recipe = recipeRepository.findById(itemDTO.getRecipeId())
                                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));
                        item.setRecipe(recipe);
                    }

                    item.setMeal(meal);
                    meal.getItems().add(item);
                }
            }
        }

        return meal;
    }

    private void updateMealPlanFromDTO(MealPlan mealPlan, MealPlanDTO dto) {
        mealPlan.setName(dto.getName());
        mealPlan.setDescription(dto.getDescription());
        mealPlan.setStartDate(dto.getStartDate());
        mealPlan.setEndDate(dto.getEndDate());
        mealPlan.setGoal(dto.getGoal());
        mealPlan.setTargetCalories(dto.getTargetCalories());
        mealPlan.setTargetProtein(dto.getTargetProtein());
        mealPlan.setTargetFats(dto.getTargetFats());
        mealPlan.setTargetCarbs(dto.getTargetCarbs());
    }

    private void updateMealFromDTO(Meal meal, MealDTO dto) {
        meal.setType(dto.getType());
        meal.getItems().clear();

        if (dto.getItems() != null) {
            for (MealItemDTO itemDTO : dto.getItems()) {
                if (itemDTO != null) {
                    MealItem item = new MealItem();
                    item.setAmount(itemDTO.getAmount());

                    if (itemDTO.getFoodId() != null) {
                        Food food = foodRepository.findById(itemDTO.getFoodId())
                                .orElseThrow(() -> new ResourceNotFoundException("Food not found"));
                        item.setFood(food);
                    }

                    if (itemDTO.getRecipeId() != null) {
                        Recipe recipe = recipeRepository.findById(itemDTO.getRecipeId())
                                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));
                        item.setRecipe(recipe);
                    }

                    item.setMeal(meal);
                    meal.getItems().add(item);
                }
            }
        }
    }

    private Double calculateItemCalories(MealItem item) {
        if (item.getFood() != null) {
            return (item.getFood().getKcal() * item.getAmount()) / 100;
        } else if (item.getRecipe() != null) {
            return item.getRecipe().getCaloriesPerServing() * item.getAmount();
        }
        return 0.0;
    }

    private void updateNutritionSummary(NutritionSummaryDTO summary, MealItem item) {
        if (item.getFood() != null) {
            double multiplier = item.getAmount() / 100;
            summary.setTotalCalories(summary.getTotalCalories() + item.getFood().getKcal() * multiplier);
            summary.setTotalProtein(summary.getTotalProtein() + item.getFood().getProtein() * multiplier);
            summary.setTotalFats(summary.getTotalFats() + item.getFood().getFat() * multiplier);
            summary.setTotalCarbs(summary.getTotalCarbs() + item.getFood().getCarbs() * multiplier);
        } else if (item.getRecipe() != null) {
            summary.setTotalCalories(summary.getTotalCalories() +
                    item.getRecipe().getCaloriesPerServing() * item.getAmount());
            summary.setTotalProtein(summary.getTotalProtein() +
                    item.getRecipe().getProteinPerServing() * item.getAmount());
            summary.setTotalFats(summary.getTotalFats() +
                    item.getRecipe().getFatPerServing() * item.getAmount());
            summary.setTotalCarbs(summary.getTotalCarbs() +
                    item.getRecipe().getCarbsPerServing() * item.getAmount());
        }
    }

    private MealPlanDTO convertToDTO(MealPlan mealPlan) {
        MealPlanDTO dto = new MealPlanDTO();
        dto.setId(mealPlan.getId());
        dto.setUserId(mealPlan.getUser().getId());
        dto.setName(mealPlan.getName());
        dto.setDescription(mealPlan.getDescription());
        dto.setStartDate(mealPlan.getStartDate());
        dto.setEndDate(mealPlan.getEndDate());
        dto.setGoal(mealPlan.getGoal());
        dto.setTargetCalories(mealPlan.getTargetCalories());
        dto.setTargetProtein(mealPlan.getTargetProtein());
        dto.setTargetFats(mealPlan.getTargetFats());
        dto.setTargetCarbs(mealPlan.getTargetCarbs());

        List<MealPlanDayDTO> dayDTOs = new ArrayList<>();
        for (MealPlanDay day : mealPlan.getDays()) {
            MealPlanDayDTO dayDTO = new MealPlanDayDTO();
            dayDTO.setId(day.getId());
            dayDTO.setDayOfWeek(day.getDayOfWeek());

            List<MealDTO> mealDTOs = new ArrayList<>();
            for (Meal meal : day.getMeals()) {
                MealDTO mealDTO = convertMealToDTO(meal);
                mealDTOs.add(mealDTO);
            }
            dayDTO.setMeals(mealDTOs);
            dayDTOs.add(dayDTO);
        }
        dto.setDays(dayDTOs);

        return dto;
    }

    private MealDTO convertMealToDTO(Meal meal) {
        MealDTO dto = new MealDTO();
        dto.setId(meal.getId());
        dto.setType(meal.getType());

        List<MealItemDTO> itemDTOs = new ArrayList<>();
        double totalCalories = 0;
        double totalProtein = 0;
        double totalFats = 0;
        double totalCarbs = 0;

        for (MealItem item : meal.getItems()) {
            MealItemDTO itemDTO = new MealItemDTO();
            itemDTO.setId(item.getId());
            itemDTO.setAmount(item.getAmount());

            if (item.getFood() != null) {
                itemDTO.setFoodId(item.getFood().getId());
                itemDTO.setFoodName(item.getFood().getName());
                double multiplier = item.getAmount() / 100;
                itemDTO.setCalories(item.getFood().getKcal() * multiplier);
                itemDTO.setProtein(item.getFood().getProtein() * multiplier);
                itemDTO.setFats(item.getFood().getFat() * multiplier);
                itemDTO.setCarbs(item.getFood().getCarbs() * multiplier);
            } else if (item.getRecipe() != null) {
                itemDTO.setRecipeId(item.getRecipe().getId());
                itemDTO.setRecipeName(item.getRecipe().getName());
                itemDTO.setCalories(item.getRecipe().getCaloriesPerServing() * item.getAmount());
                itemDTO.setProtein(item.getRecipe().getProteinPerServing() * item.getAmount());
                itemDTO.setFats(item.getRecipe().getFatPerServing() * item.getAmount());
                itemDTO.setCarbs(item.getRecipe().getCarbsPerServing() * item.getAmount());
            }

            totalCalories += itemDTO.getCalories();
            totalProtein += itemDTO.getProtein();
            totalFats += itemDTO.getFats();
            totalCarbs += itemDTO.getCarbs();

            itemDTOs.add(itemDTO);
        }

        dto.setItems(itemDTOs);
        dto.setTotalCalories(totalCalories);
        dto.setTotalProtein(totalProtein);
        dto.setTotalFats(totalFats);
        dto.setTotalCarbs(totalCarbs);

        return dto;
    }
}
