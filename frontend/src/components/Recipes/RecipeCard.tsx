import React from "react";
import {
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  Typography,
  Box,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  AccessTime as TimeIcon,
  Restaurant as ServingIcon,
  LocalFireDepartment as CaloriesIcon,
  MenuBook as RecipeIcon,
  FitnessCenter as ProteinIcon,
  Grain as CarbsIcon,
  Opacity as FatsIcon,
  Science as TestIcon,
} from "@mui/icons-material";
import { RecipeDTO } from "../../types/nutrition.types";

interface RecipeCardProps {
  recipe: RecipeDTO;
  onEdit: (recipe: RecipeDTO) => void;
  onDelete: (recipe: RecipeDTO) => void;
  onView: (recipe: RecipeDTO) => void;
  onTest?: (recipe: RecipeDTO) => void;
  onAddToDiary?: (recipe: RecipeDTO) => void;
  showActions?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onEdit,
  onDelete,
  onView,
  onTest,
  onAddToDiary,
  showActions = true,
}) => {
  const getGoalLabel = (goal: string) => {
    const labels = {
      LOSE_WEIGHT: "Загуба на тегло",
      MAINTAIN_WEIGHT: "Поддържане на тегло",
      GAIN_WEIGHT: "Качване на тегло",
    };
    return labels[goal as keyof typeof labels] || goal;
  };

  const getGoalColor = (
    goal: string
  ): "error" | "primary" | "success" | "default" => {
    const colors = {
      LOSE_WEIGHT: "error",
      MAINTAIN_WEIGHT: "primary",
      GAIN_WEIGHT: "success",
    };
    return (
      (colors[goal as keyof typeof colors] as
        | "error"
        | "primary"
        | "success") || "default"
    );
  };

  const totalMacros =
    recipe.proteinPerServing + recipe.fatPerServing + recipe.carbsPerServing;
  const proteinPercentage =
    totalMacros > 0 ? (recipe.proteinPerServing / totalMacros) * 100 : 0;
  const fatPercentage =
    totalMacros > 0 ? (recipe.fatPerServing / totalMacros) * 100 : 0;
  const carbsPercentage =
    totalMacros > 0 ? (recipe.carbsPerServing / totalMacros) * 100 : 0;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        },
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        border: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
          color: "white",
          p: 2,
          borderRadius: "12px 12px 0 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                width: 40,
                height: 40,
              }}
            >
              <RecipeIcon />
            </Avatar>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
              {recipe.name}
            </Typography>
          </Box>
          {showActions && (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => onView(recipe)}
                sx={{
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <ViewIcon fontSize="small" />
              </IconButton>
              {onTest && (
                <IconButton
                  size="small"
                  onClick={() => onTest(recipe)}
                  sx={{
                    color: "white",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  <TestIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={() => onEdit(recipe)}
                sx={{
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete(recipe)}
                sx={{
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255,0,0,0.2)" },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{
            flexGrow: 1,
            fontStyle: "italic",
            mb: 2,
            lineHeight: 1.5,
          }}
        >
          {recipe.description}
        </Typography>

        {/* Recipe Stats */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              p: 1,
              borderRadius: 1,
              bgcolor: "rgba(255, 152, 0, 0.1)",
            }}
          >
            <TimeIcon fontSize="small" color="warning" />
            <Typography variant="caption" fontWeight={600}>
              {recipe.preparationTime} мин
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              p: 1,
              borderRadius: 1,
              bgcolor: "rgba(76, 175, 80, 0.1)",
            }}
          >
            <ServingIcon fontSize="small" color="success" />
            <Typography variant="caption" fontWeight={600}>
              {recipe.servings} порции
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              p: 1,
              borderRadius: 1,
              bgcolor: "rgba(244, 67, 54, 0.1)",
            }}
          >
            <CaloriesIcon fontSize="small" color="error" />
            <Typography variant="caption" fontWeight={600}>
              {recipe.caloriesPerServing} ккал
            </Typography>
          </Box>
        </Box>

        {/* Goal Chip */}
        <Box sx={{ mb: 3 }}>
          <Chip
            label={getGoalLabel(recipe.recommendedFor)}
            color={getGoalColor(recipe.recommendedFor)}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Macro Distribution */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Разпределение на макронутриенти
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <Box
              sx={{
                flex: proteinPercentage,
                height: 8,
                bgcolor: "primary.main",
                borderRadius: 1,
              }}
            />
            <Box
              sx={{
                flex: fatPercentage,
                height: 8,
                bgcolor: "warning.main",
                borderRadius: 1,
              }}
            />
            <Box
              sx={{
                flex: carbsPercentage,
                height: 8,
                bgcolor: "success.main",
                borderRadius: 1,
              }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ProteinIcon fontSize="small" color="primary" />
              <Typography variant="caption" fontWeight={600}>
                {recipe.proteinPerServing}g
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <FatsIcon fontSize="small" color="warning" />
              <Typography variant="caption" fontWeight={600}>
                {recipe.fatPerServing}g
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CarbsIcon fontSize="small" color="success" />
              <Typography variant="caption" fontWeight={600}>
                {recipe.carbsPerServing}g
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
          {onAddToDiary && (
            <Button
              variant="contained"
              size="small"
              onClick={() => onAddToDiary(recipe)}
              sx={{
                flex: 1,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Добави в дневника
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
