import React from "react";
import SyncLife from "../assets/images/SyncLife.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddAMeal = () => {
  const { token } = localStorage.getItem("token");
  const [ingredientInput, setIngredientInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mealIngredients, setMealIngredients] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [weight, setWeight] = useState(100);
  const [error, setError] = useState("");
  const apiKey = import.meta.env.SPOONACULAR_KEY;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.log("token not available");
      navigate("/login");
      return;
    }
  });

  const searchIngredient = async () => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/food/ingredients/search`,
        {
          params: {
            query: ingredientInput,
            number: 5,
            apiKey: apiKey,
          },
        }
      );
      setSearchResults(response.data.results);
    } catch (err) {
      console.error(err);
      setError("Failed to search ingredients.");
    }
  };

  const addIngredientToMeal = async (ingredient) => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/food/ingredients/${ingredient.id}/information`,
        {
          params: {
            amount: weight, // User-provided weight
            unit: "g",
            apiKey: import.meta.env.VITE_SPOONACULAR_API_KEY,
          },
        }
      );

      const ingredientWithCalories = {
        name: ingredient.name,
        calories:
          response.data.nutrition.nutrients.find((n) => n.name === "Calories")
            ?.amount || 0,
      };

      setMealIngredients((prev) => [...prev, ingredientWithCalories]);
      setTotalCalories((prev) => prev + ingredientWithCalories.calories);
      setSearchResults([]);
      setIngredientInput("");
      setWeight(100); 
    } catch (err) {
      console.error(err);
      setError("Failed to fetch ingredient information.");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-300">
      <div className="bg-blue-200 p-10 rounded-lg shadow-lg w-96 text-center">
        <div className="flex justify-center mb-5">
          <img
            src={SyncLife}
            alt="SyncLife Logo"
            className="w-24 h-24 rounded-lg"
          />
        </div>
        <p className="mt-2 text-lg font-medium">Add a Meal</p>

        {error && <p className="text-red-500">{error}</p>}

        <div className="mt-4 space-y-4">
          <input
            type="text"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            placeholder="Search for an ingredient..."
            className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:ring focus:ring-blue-500"
          />
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight (g)"
            className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:ring focus:ring-blue-500"
          />
          <button
            onClick={searchIngredient}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Search Ingredient
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-4">
            <p className="font-medium">Results:</p>
            <ul className="mt-2 space-y-2">
              {searchResults.map((ingredient) => (
                <li key={ingredient.id}>
                  <button
                    onClick={() => addIngredientToMeal(ingredient)}
                    className="bg-white border border-gray-300 px-3 py-1 rounded-lg hover:bg-blue-100 transition w-full"
                  >
                    {ingredient.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-semibold">Meal Ingredients:</h3>
          <ul className="mt-2 space-y-1">
            {mealIngredients.map((item, index) => (
              <li key={index} className="text-sm">
                {item.name} - {item.calories.toFixed(0)} kcal
              </li>
            ))}
          </ul>

          <div className="mt-4 font-bold">
            Total Calories: {totalCalories.toFixed(0)} kcal
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAMeal;
