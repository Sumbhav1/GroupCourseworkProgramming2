import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import SyncLife from "../assets/images/SyncLife.png";
import SleepCard from "../components/Dashboard/sleepCard";
import MealCard from "../components/Dashboard/MealCard";
import CombinedStreakBadge from "../components/Dashboard/Streak";
import MoodSelector from "../components/Dashboard/MoodSelector";
import CalorieGraph from "../components/Dashboard/CalorieGraph";
import SleepVsCalories from "../components/Dashboard/Correlation";

function getGreeting(name) {
  const hour = new Date().getHours();
  let greeting = "";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";
  return `${greeting}, ${name}`;
}

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [wakeupTime, setWakeupTime] = useState("");
  const [bedTime, setBedTime] = useState("");
  const [caloriesNeeded, setCaloriesNeeded] = useState("");
  const [mealsNeeded, setMealsNeeded] = useState("");
  const [mood, setMood] = useState("");
  const [caloriesConsumed, setCaloriesConsumed] = useState("");
  const [mealsConsumed, setMealsConsumed] = useState("");
  const [streak, setStreak] = useState(0);
  const [greeting] = useState(getGreeting(user.name));
  const [recentLogs, setRecentLogs] = useState([]);


  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/dashboard/fetch",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { settings, dailyLog, recentLogs } = response.data.payload;
        console.log("settings from server:", settings);
        setWakeupTime(settings.wakeupTime);
        setBedTime(settings.bedtime);
        setCaloriesNeeded(settings.caloriesNeeded);
        setMealsNeeded(settings.mealsNeeded);
        setCaloriesConsumed(dailyLog.total_calories);
        setMealsConsumed(dailyLog.meals_count);
        setStreak(dailyLog.streak);
        setMood(dailyLog.mood);
        setRecentLogs(recentLogs);
      } catch (err) {
        console.error(err);
        setError("Couldn't fetch data: " + err.message);
      }
    };
    fetchDashboardData();
  }, [token, navigate]);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-500 text-white p-4 shadow rounded-b-lg">
        <div className="flex items-center">
          <img src={SyncLife} alt="SyncLife logo" className="h-10 w-10 mr-4" />
          <div>
            <h1 className="text-lg font-semibold">{greeting}</h1>
            <p className="text-sm opacity-90">
              Here's your progress for the day.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/settings-logged-in")}
          className="bg-white text-blue-500 font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Settings
        </button>
      </div>

      {/* First row of cards */}
      <div className="flex flex-wrap justify-start items-start p-4 gap-4">
        <div className="flex-1 min-w-[240px]">
          <SleepCard bedtime={bedTime} wakeupTime={wakeupTime} />
        </div>
        <div className="flex-1 min-w-[240px]">
          <MealCard
            mealsConsumed={mealsConsumed}
            mealsNeeded={mealsNeeded}
            caloriesConsumed={caloriesConsumed}
            caloriesNeeded={caloriesNeeded}
          />
        </div>
        <div className="flex-none">
          <CombinedStreakBadge days={streak} />
        </div>
        <div className="flex-1 min-w-[240px]">
          <MoodSelector initialMood={mood} email={user.email} />
        </div>
      </div>

      {/* Graph below the first row */}
      {recentLogs.length > 0 && (
        <div className="px-4 pt-6 pl-6">
          <CalorieGraph data={recentLogs} />
        </div>
      )}

      {recentLogs.length > 0 && (
        <div className="px-4 pt-6">
          <SleepVsCalories data={recentLogs} />
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-red-500 text-center font-medium">{error}</p>}
    </>
  );
};

export default Dashboard;
