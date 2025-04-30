import { AuthContext } from "../components/AuthContext";
import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const SettingsLoggedIn = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [calories, setCalories] = useState("");
  const [sleep, setSleep] = useState("");
  const [bedtime, setBedtime] = useState("");
  const [wakeupTime, setWakeupTime] = useState("");
  const [meals, setMeals] = useState("");
  const [notificationsSleep, setNotificationsSleep] = useState("No");
  const [notificationsMeals, setNotificationsMeals] = useState("No");
  const navigate = useNavigate();

  const { user, setUser } = useContext(AuthContext);

  const token = localStorage.getItem("token");
  const goBack = () => {
    navigate("/dashboard"); 
  };

  useEffect(() => {
    if (!token) {
      console.log("token not available");
      navigate("/login");
      return;
    }

    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/settings/fetch",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        setCalories(data.calories);
        setSleep(data.sleep);
        setBedtime(data.bedtime);
        setWakeupTime(data.wakeupTime);
        setMeals(data.meals);
        setNotificationsSleep(data.notificationsSleep);
        setNotificationsMeals(data.notificationsMeals);
      } catch (err) {
        console.error("Could not fetch settings");
      }
    };
    console.log(user);

    fetchSettings();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!calories || !sleep || !bedtime || !wakeupTime || !meals) {
      setError("All fields must be filled out");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/settings/set",
        {
          calories,
          bedtime,
          wakeupTime,
          sleep,
          meals,
          notificationsSleep: notificationsSleep === "Yes",
          notificationsMeals: notificationsMeals === "Yes",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUser(response.data.user);
        alert("Settings saved successfully!");
        if (response.data.user.settings_finished) {
          navigate("/dashboard");
        } else {
          navigate("/settings-logged-in");
        }
      }
    } catch (err) {
      console.error("API request failed", err);
      setError("Unable to save settings. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-300">
      <button
        onClick={goBack}
        className="absolute top-4 left-4 text-white text-2xl bg-transparent hover:bg-gray-600 p-2 rounded-full"
      >
        &#8592;
      </button>
      <div className="bg-blue-200 p-10 rounded-lg shadow-lg w-96 text-center max-h-screen overflow-auto">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="block font-medium">Calories per day:</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="text-left">
            <label className="block font-medium">Bedtime (hh:mm):</label>
            <input
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="text-left">
            <label className="block font-medium">Wake-up time (hh:mm):</label>
            <input
              type="time"
              value={wakeupTime}
              onChange={(e) => setWakeupTime(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="text-left">
            <label className="block font-medium">Hours of sleep:</label>
            <input
              type="number"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="text-left">
            <label className="block font-medium">
              How many meals do you (typically) eat per day?
            </label>
            <input
              type="number"
              value={meals}
              onChange={(e) => setMeals(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:ring focus:ring-blue-500"
            />
          </div>

          {/* Notifications for sleep */}
          <div className="text-left">
            <label className="block font-medium">
              Receive reminders to log sleep?
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="notificationsSleep"
                  value="Yes"
                  checked={notificationsSleep === "Yes"}
                  onChange={() => setNotificationsSleep("Yes")}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="notificationsSleep"
                  value="No"
                  checked={notificationsSleep === "No"}
                  onChange={() => setNotificationsSleep("No")}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          {/* Notifications for meals */}
          <div className="text-left">
            <label className="block font-medium">
              Receive reminders to log meals?
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="notificationsMeals"
                  value="Yes"
                  checked={notificationsMeals === "Yes"}
                  onChange={() => setNotificationsMeals("Yes")}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="notificationsMeals"
                  value="No"
                  checked={notificationsMeals === "No"}
                  onChange={() => setNotificationsMeals("No")}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Save Settings
          </button>
        </form>

        <p className="mt-4 text-sm">
          Unsure about how many calories you need?{" "}
          <a
            href="https://www.calculator.net/calorie-calculator.html"
            target="_blank"
            className="text-blue-600 font-semibold underline"
            rel="noopener noreferrer"
          >
            Here's a calorie calculator
          </a>{" "}
          (Please be aware these are just estimates and not official advice)
        </p>
      </div>
    </div>
  );
};

export default SettingsLoggedIn;
