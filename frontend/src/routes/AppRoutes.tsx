import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import HomePage from "../pages/HomePage";
import WorkoutsPage from "../pages/WorkoutsPage";
import NutritionPage from "../pages/NutritionPage";
import ProfilePage from "../pages/ProfilePage";
import ExercisesPage from "../pages/ExercisesPage";
import CategoriesPage from "../pages/CategoriesPage";
import ProgramsPage from "../pages/ProgramsPage";
import PredefinedProgramsPage from "../pages/PredefinedProgramsPage";
import ProgressPage from "../pages/ProgressPage";
import HistoryPage from "../pages/HistoryPage";
import ProtectedRoute from "../pages/auth/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import RecipePage from "../pages/RecipePage";
import MealPlanPage from "../pages/MealPlanPage";
import FoodDiaryPage from "../pages/FoodDiaryPage";
import FoodDatabasePage from "../pages/FoodDatabasePage";
import CalorieCalculatorPage from "../pages/CalorieCalculatorPage";
import DailyPlansPage from "../pages/DailyPlansPage";
import RecipeIngredientsPage from "../pages/RecipeIngredientsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HomePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/workouts"
        element={
          <ProtectedRoute>
            <MainLayout>
              <WorkoutsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/nutrition"
        element={
          <ProtectedRoute>
            <MainLayout>
              <NutritionPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/exercises"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ExercisesPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CategoriesPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/programs"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProgramsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/predefined-programs"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PredefinedProgramsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProgressPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HistoryPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/recipes"
        element={
          <ProtectedRoute>
            <MainLayout>
              <RecipePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/meal-plans"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MealPlanPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/food-diary"
        element={
          <ProtectedRoute>
            <MainLayout>
              <FoodDiaryPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/foods"
        element={
          <ProtectedRoute>
            <MainLayout>
              <FoodDatabasePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/calorie-calculator"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CalorieCalculatorPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/daily-plans"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DailyPlansPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/recipe-ingredients"
        element={
          <ProtectedRoute>
            <MainLayout>
              <RecipeIngredientsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
