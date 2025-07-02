import React from "react";
import {
  Card,
  CardContent,
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
  Restaurant as FoodIcon,
  LocalFireDepartment as CaloriesIcon,
  FitnessCenter as ProteinIcon,
  Grain as CarbsIcon,
  Opacity as FatsIcon,
} from "@mui/icons-material";
import { FoodDTO } from "../../services/food.service";

interface FoodCardProps {
  food: FoodDTO;
  onEdit: (food: FoodDTO) => void;
  onDelete: (food: FoodDTO) => void;
  onView: (food: FoodDTO) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({
  food,
  onEdit,
  onDelete,
  onView,
}) => {
  const totalMacros = food.protein + food.fat + food.carbs;
  const proteinPercentage =
    totalMacros > 0 ? (food.protein / totalMacros) * 100 : 0;
  const fatPercentage = totalMacros > 0 ? (food.fat / totalMacros) * 100 : 0;
  const carbsPercentage =
    totalMacros > 0 ? (food.carbs / totalMacros) * 100 : 0;

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
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
              <FoodIcon />
            </Avatar>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
              {food.name}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => onView(food)}
              sx={{
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onEdit(food)}
              sx={{
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(food)}
              sx={{
                color: "white",
                "&:hover": { bgcolor: "rgba(255,0,0,0.2)" },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {food.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            paragraph
            sx={{
              fontStyle: "italic",
              mb: 2,
              lineHeight: 1.5,
            }}
          >
            {food.description}
          </Typography>
        )}

        {/* Calories Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 3,
            p: 2,
            borderRadius: 2,
            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
            color: "white",
          }}
        >
          <CaloriesIcon fontSize="medium" />
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {food.kcal} ккал
          </Typography>
        </Box>

        {/* Macronutrients Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{
              mb: 2,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Макронутриенти (100g)
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Protein */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ProteinIcon fontSize="small" color="primary" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Протеини
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {food.protein}g
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={proteinPercentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "rgba(25, 118, 210, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#1976d2",
                    borderRadius: 3,
                  },
                }}
              />
            </Box>

            {/* Fats */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FatsIcon fontSize="small" color="secondary" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Мазнини
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {food.fat}g
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={fatPercentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "rgba(156, 39, 176, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#9c27b0",
                    borderRadius: 3,
                  },
                }}
              />
            </Box>

            {/* Carbs */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CarbsIcon fontSize="small" color="warning" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Въглехидрати
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {food.carbs}g
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={carbsPercentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "rgba(255, 152, 0, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#ff9800",
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            icon={<ProteinIcon />}
            label={`${food.protein}g`}
            size="small"
            variant="outlined"
            color="primary"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              "& .MuiChip-icon": { fontSize: 16 },
            }}
          />
          <Chip
            icon={<FatsIcon />}
            label={`${food.fat}g`}
            size="small"
            variant="outlined"
            color="secondary"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              "& .MuiChip-icon": { fontSize: 16 },
            }}
          />
          <Chip
            icon={<CarbsIcon />}
            label={`${food.carbs}g`}
            size="small"
            variant="outlined"
            color="warning"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              "& .MuiChip-icon": { fontSize: 16 },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default FoodCard;
