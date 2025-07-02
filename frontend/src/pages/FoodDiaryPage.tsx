import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { useFoodDiary } from "../hooks/useFoodDiary";
import foodService from "../services/food.service";
import recipeService from "../services/recipe.service";
import { FoodDTO, RecipeDTO, RecipeCategory } from "../types/nutrition.types";
import { format } from "date-fns";
import { useAuth } from "../contexts/auth.context";

const FoodDiaryPage: React.FC = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const {
    diaryEntries,
    loading,
    error,
    addDiaryEntry,
    deleteDiaryEntry,
    loadDayData,
  } = useFoodDiary();
  const [date, setDate] = useState(today);
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [foodNames, setFoodNames] = useState<{ [id: number]: string }>({});
  const [allFoods, setAllFoods] = useState<any[]>([]);
  const [foods, setFoods] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<any[]>([]);
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsFood, setDetailsFood] = useState<any | null>(null);
  const { user } = useAuth();
  const storageKey = user ? `savedFoods_user_${user.id}` : "savedFoods";
  const [savedFoods, setSavedFoods] = useState<any[][]>([]);

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchFoodsAndRecipes = async () => {
      try {
        const [foodsData, recipesData] = await Promise.all([
          foodService.getAllFoods(),
          recipeService.getAllRecipes(),
        ]);
        setFoods(foodsData.map((f) => ({ ...f, type: "Храна" })));
        setRecipes(
          recipesData.map((r) => ({
            ...r,
            type: "Рецепта",
            kcal: r.caloriesPerServing,
            protein: r.proteinPerServing,
            fat: r.fatPerServing,
            carbs: r.carbsPerServing,
          }))
        );
      } catch (err) {
        setSearchError("Грешка при зареждане на храните или рецептите.");
      }
    };
    fetchFoodsAndRecipes();
    // Зареждане на запазени комбинации от localStorage
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setSavedFoods(JSON.parse(saved));
    }
  }, [storageKey]);

  // Записване на savedFoods в localStorage при промяна
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(savedFoods));
  }, [savedFoods, storageKey]);

  const totals = selectedFoods.reduce(
    (acc, food) => ({
      kcal: acc.kcal + (food.kcal || 0),
      protein: acc.protein + (food.protein || 0),
      fat: acc.fat + (food.fat || 0),
      carbs: acc.carbs + (food.carbs || 0),
    }),
    { kcal: 0, protein: 0, fat: 0, carbs: 0 }
  );

  // Търсене на храни и рецепти
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (!value) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    try {
      const [foods, recipes] = await Promise.all([
        foodService.searchFoods(value),
        recipeService.searchRecipes(value),
      ]);
      setSearchResults([
        ...foods.map((f: any) => ({ ...f, type: "food" })),
        ...recipes.map((r: any) => ({ ...r, type: "recipe" })),
      ]);
    } catch (err) {
      setSearchError("Грешка при търсене.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAdd = async (item: any) => {
    let entry;
    if (item.type === "food") {
      entry = {
        mealType: RecipeCategory.LUNCH,
        recipeId: item.id,
        quantity: 1,
        notes: "",
      };
    } else {
      entry = {
        mealType: RecipeCategory.LUNCH,
        recipeId: item.id,
        quantity: 1,
        notes: "",
      };
    }
    await addDiaryEntry(entry);
    loadDayData(date);
  };

  const handleDelete = async (id: number) => {
    await deleteDiaryEntry(id);
    loadDayData(date);
  };

  // Добавяне на храна/рецепта
  const handleSelect = (item: any) => {
    if (!selectedFoods.find((f) => f.id === item.id && f.type === item.type)) {
      setSelectedFoods([...selectedFoods, item]);
    }
  };

  // Премахване на храна/рецепта
  const handleRemove = (id: any, type: string) => {
    setSelectedFoods(
      selectedFoods.filter((f) => !(f.id === id && f.type === type))
    );
  };

  // Показване на детайли
  const handleShowDetails = (item: any) => {
    setDetailsFood(item);
    setOpenDetails(true);
  };
  const handleCloseDetails = () => {
    setOpenDetails(false);
    setDetailsFood(null);
  };

  // Филтриране на всички храни и рецепти
  const allItems = [...foods, ...recipes];
  const filteredItems = allItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Изчистване на всички избрани
  const handleClearAll = () => {
    setSelectedFoods([]);
  };

  // Запазване на избраните
  const handleSaveSelected = () => {
    if (selectedFoods.length > 0) {
      setSavedFoods([...savedFoods, selectedFoods]);
      setSelectedFoods([]); // по желание, може да се махне ако не искаш да се чисти
    }
  };

  // Зареждане на комбинация
  const handleLoadCombo = (combo: any[]) => {
    setSelectedFoods(combo);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
      <Typography variant="h4" mb={3} align="center">
        Дневник на храненето
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      {/* Избрани храни/рецепти */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Избрани храни/рецепти
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Име</TableCell>
                  <TableCell>Тип</TableCell>
                  <TableCell>Калории</TableCell>
                  <TableCell>Протеин</TableCell>
                  <TableCell>Мазнини</TableCell>
                  <TableCell>Въглехидрати</TableCell>
                  <TableCell align="center">Опции</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedFoods.map((item) => (
                  <TableRow key={item.id + item.type} hover>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.kcal}</TableCell>
                    <TableCell>{item.protein}</TableCell>
                    <TableCell>{item.fat}</TableCell>
                    <TableCell>{item.carbs}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleShowDetails(item)}
                      >
                        <InfoIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleRemove(item.id, item.type)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <tfoot>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Total:</TableCell>
                  <TableCell></TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {totals.kcal}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {totals.protein}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {totals.fat}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {totals.carbs}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </tfoot>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleClearAll}
              disabled={selectedFoods.length === 0}
            >
              ИЗЧИСТИ ИЗБРАНИТЕ
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveSelected}
              disabled={selectedFoods.length === 0}
            >
              Запази избраните
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Всички храни и рецепти */}
      <Typography variant="h6" mb={1}>
        Всички храни и рецепти
      </Typography>
      <TextField
        fullWidth
        placeholder="Търсене на храна или рецепта..."
        value={search}
        onChange={handleSearch}
        sx={{ mb: 1 }}
      />
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 400, overflowY: "auto", mb: 4 }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Име</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>KCAL</TableCell>
              <TableCell>Протеин</TableCell>
              <TableCell>Мазнини</TableCell>
              <TableCell>Въглехидрати</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" style={{ color: "#888" }}>
                  Няма намерени храни или рецепти
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow
                  key={item.id + item.type}
                  onClick={() => handleSelect(item)}
                  style={{ cursor: "pointer" }}
                  hover
                >
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.kcal}</TableCell>
                  <TableCell>{item.protein}</TableCell>
                  <TableCell>{item.fat}</TableCell>
                  <TableCell>{item.carbs}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог за детайли */}
      <Dialog
        open={openDetails}
        onClose={handleCloseDetails}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Детайли</DialogTitle>
        <DialogContent>
          {detailsFood && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                {detailsFood.name}
              </Typography>
              <Typography>
                Тип: <b>{detailsFood.type}</b>
              </Typography>
              <Typography>
                Калории: <b>{detailsFood.kcal}</b>
              </Typography>
              <Typography>
                Протеин: <b>{detailsFood.protein} г</b>
              </Typography>
              <Typography>
                Мазнини: <b>{detailsFood.fat} г</b>
              </Typography>
              <Typography>
                Въглехидрати: <b>{detailsFood.carbs} г</b>
              </Typography>
              {detailsFood.description && (
                <Box mt={2}>
                  <Typography variant="subtitle2">Описание:</Typography>
                  <Typography color="text.secondary">
                    {detailsFood.description}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">
            Затвори
          </Button>
        </DialogActions>
      </Dialog>

      {/* Секция със запазени комбинации */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" mb={1}>
          Запазени комбинации
        </Typography>
        {savedFoods.length === 0 ? (
          <Typography color="text.secondary">
            Няма запазени комбинации.
          </Typography>
        ) : (
          savedFoods.map((combo, idx) => (
            <Card key={idx} sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle2" mb={1}>
                    Комбинация #{idx + 1}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleLoadCombo(combo)}
                  >
                    Зареди
                  </Button>
                </Box>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {combo.map((item) => (
                    <li key={item.id + item.type}>
                      {item.name} ({item.type})
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
};

export default FoodDiaryPage;
