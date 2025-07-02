export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL,
    ENDPOINTS: {
      AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        REFRESH: "/auth/refresh",
        LOGOUT: "/auth/logout",
        VALIDATE: "/auth/validate",
        PROFILE: "/auth/profile",
        CHANGE_PASSWORD: "/auth/change-password"
      },
      USERS: {
        GET_USER: (id: number) => `/users/${id}`,
        PROFILE: "/users/profile"
      },
      HISTORY: {
        WORKOUTS: '/history/workouts',
        NUTRITION: '/history/nutrition'
      },
      FOOD_DIARY: {
        GET_USER_DIARY: (userId: number) => `/food-diary/user/${userId}`,
        ADD_FOOD: "/food-diary",
        UPDATE_ENTRY: (id: number) => `/food-diary/${id}`,
        DELETE_ENTRY: (id: number) => `/food-diary/${id}`,
        GET_NUTRITION_SUMMARY: "/food-diary/nutrition-summary"
      },
      CALORIE_CALCULATOR: {
        CALCULATE: "/calorie-calculator/calculate",
        CALCULATE_AND_SAVE: (userId: number) => `/calorie-calculator/calculate-and-save/${userId}`,
        GENERATE_TRAINING_PROGRAM: (userId: number) => `/calorie-calculator/generate-training-program/${userId}`,
        GENERATE_MEAL_PLAN: (userId: number) => `/calorie-calculator/generate-meal-plan/${userId}`,
        GENERATE_SMART_MEAL_PLAN: (userId: number) => `/calorie-calculator/generate-smart-meal-plan/${userId}`,
        GENERATE_SMART_MEAL_PLAN_WITH_CONFIG: (userId: number) => `/calorie-calculator/generate-smart-meal-plan-with-config/${userId}`,
        GENERATE_MEAL_PLAN_WITH_CONFIG: (userId: number) => `/calorie-calculator/generate-meal-plan-with-config/${userId}`,
        GENERATE_DAILY_PLAN: (userId: number) => `/calorie-calculator/generate-daily-plan/${userId}`
      },
      DAILY_PLANS: {
        GET_USER_PLANS: (userId: number) => `/daily-plans/user/${userId}`,
        GET_ACTIVE_PLAN: (userId: number) => `/daily-plans/user/${userId}/active`,
        GET_PLAN: (id: number) => `/daily-plans/${id}`,
        CREATE: "/daily-plans",
        UPDATE: (id: number) => `/daily-plans/${id}`,
        DELETE: (id: number) => `/daily-plans/${id}`,
        GENERATE: (userId: number) => `/daily-plans/user/${userId}/generate`,
        GENERATE_WITH_CONFIG: (userId: number) => `/daily-plans/user/${userId}/generate-with-config`,
        DEACTIVATE_ALL: (userId: number) => `/daily-plans/user/${userId}/deactivate-all`
      },
      RECIPE_INGREDIENTS: {
        GET_BY_ID: (id: number) => `/recipe-ingredients/${id}`,
        GET_BY_RECIPE: (recipeId: number) => `/recipe-ingredients/recipe/${recipeId}`,
        CREATE: "/recipe-ingredients",
        UPDATE: (id: number) => `/recipe-ingredients/${id}`,
        DELETE: (id: number) => `/recipe-ingredients/${id}`
      },
      RECIPES: {
        GET_ALL: "/recipes",
        GET_BY_ID: (id: number) => `/recipes/${id}`,
        GET_BY_USER: (userId: number) => `/recipes/user/${userId}`,
        GET_TEST: (id: number) => `/recipes/test/${id}`,
        SEARCH: "/recipes/search",
        GET_BY_NUTRITION: "/recipes/nutrition",
        GET_BY_GOAL: (goal: string) => `/recipes/goal/${goal}`,
        CREATE: "/recipes",
        UPDATE: (id: number) => `/recipes/${id}`,
        DELETE: (id: number) => `/recipes/${id}`
      },
      FOODS: {
        GET_ALL: "/foods",
        GET_BY_ID: (id: number) => `/foods/${id}`,
        SEARCH: "/foods/search",
        GET_BY_CATEGORY: (category: string) => `/foods/category/${category}`,
        GET_CATEGORIES: "/foods/categories",
        CREATE: "/foods",
        CREATE_ALTERNATIVE: "/foods/add",
        UPDATE: (id: number) => `/foods/${id}`,
        UPDATE_ALTERNATIVE: (id: number) => `/foods/edit/${id}`,
        DELETE: (id: number) => `/foods/${id}`
      },
      FOOD_HISTORY: {
        GET_USER_HISTORY: "/food-history",
        GET_BY_ID: (id: number) => `/food-history/${id}`,
        SAVE: "/food-history",
        DELETE: (id: number) => `/food-history/${id}`
      },
      EXERCISES: {
        GET_ALL: "/exercise",
        GET_BY_ID: (id: number) => `/exercise/${id}`,
        SEARCH: "/exercise/search",
        GET_BY_CATEGORY: (categoryId: number) => `/exercise/category/${categoryId}`,
        CREATE: "/exercise/add",
        UPDATE: (id: number) => `/exercise/${id}`,
        DELETE: (id: number) => `/exercise/${id}`
      },
      EXERCISE_CATEGORIES: {
        GET_ALL: "/exercise-categories",
        GET_BY_ID: (id: number) => `/exercise-categories/${id}`,
        CREATE: "/exercise-categories",
        UPDATE: (id: number) => `/exercise-categories/${id}`,
        DELETE: (id: number) => `/exercise-categories/${id}`
      },
      TRAINING_PROGRAMS: {
        GET_BY_ID: (id: number) => `/training-programs/${id}`,
        GET_USER_PROGRAMS: (userId: number) => `/training-programs/user/${userId}`,
        CREATE: (userId: number) => `/training-programs/${userId}`,
        UPDATE: (id: number) => `/training-programs/${id}`,
        DELETE: (id: number) => `/training-programs/${id}`
      },
      TRAINING_SESSIONS: {
        GET_BY_ID: (id: number) => `/training-sessions/${id}`,
        GET_USER_SESSIONS: (userId: number) => `/training-sessions/user/${userId}`,
        CREATE: (userId: number) => `/training-sessions/${userId}`,
        DELETE: (id: number) => `/training-sessions/${id}`
      },
      WORKOUT_PROGRESS: {
        GET_USER_PROGRESS: (userId: number) => `/workout-progress/user/${userId}`,
        GET_USER_PROGRESS_BY_RANGE: (userId: number) => `/workout-progress/user/${userId}/range`,
        GET_USER_PROGRESS_BY_PROGRAM: (userId: number, programId: number) => `/workout-progress/user/${userId}/program/${programId}`,
        GET_USER_EXERCISE_PROGRESS: (userId: number, exerciseId: number) => `/workout-progress/user/${userId}/exercise/${exerciseId}`,
        GET_BY_ID: (id: number) => `/workout-progress/${id}`,
        SAVE: "/workout-progress",
        UPDATE: (id: number) => `/workout-progress/${id}`,
        DELETE: (id: number) => `/workout-progress/${id}`
      },
      MEAL_PLANS: {
        GET_BY_ID: (id: number) => `/meal-plans/${id}`,
        GET_USER_PLANS: (userId: number) => `/meal-plans/user/${userId}`,
        GET_USER_PLANS_BY_GOAL: (userId: number, goal: string) => `/meal-plans/user/${userId}/goal/${goal}`,
        GET_NUTRITION_SUMMARY: (id: number) => `/meal-plans/${id}/nutrition-summary`,
        GET_DAY_TOTAL_CALORIES: (id: number, dayOfWeek: number) => `/meal-plans/${id}/days/${dayOfWeek}/calories`,
        CREATE: "/meal-plans",
        UPDATE: (id: number) => `/meal-plans/${id}`,
        DELETE: (id: number) => `/meal-plans/${id}`,
        ADD_MEAL_TO_DAY: (id: number, dayOfWeek: number) => `/meal-plans/${id}/days/${dayOfWeek}/meals`,
        UPDATE_MEAL_IN_DAY: (id: number, dayOfWeek: number, mealId: number) => `/meal-plans/${id}/days/${dayOfWeek}/meals/${mealId}`,
        REMOVE_MEAL_FROM_DAY: (id: number, dayOfWeek: number, mealId: number) => `/meal-plans/${id}/days/${dayOfWeek}/meals/${mealId}`
      },
      PREDEFINED_PROGRAMS: {
        GET_ALL: "/predefined-programs",
        GET_BY_ID: (id: number) => `/predefined-programs/${id}`,
        GET_BY_GOAL: (goal: string) => `/predefined-programs/by-goal/${goal}`,
        GET_BY_DIFFICULTY: (difficultyLevel: string) => `/predefined-programs/by-difficulty/${difficultyLevel}`,
        COPY_TO_USER: (programId: number, userId: number) => `/predefined-programs/copy/${programId}/to-user/${userId}`
      },
      PERSONAL_SETTINGS: {
        GET: "/personal-settings",
        GET_USER: "/personal-settings/getUser",
        CHECK: "/personal-settings/check",
        SAVE: "/personal-settings",
        CALCULATE_MACROS: "/personal-settings/calculate"
      }
    }
  } as const;
  