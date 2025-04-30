import React, { useState, useEffect } from "react";
import SyncLife from "../assets/images/SyncLife.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddASleep = () => {
  const token = localStorage.getItem("token");
  const [bedtime, setBedtime] = useState("");
  const [wakeuptime, setWakeuptime] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.log("token not available");
      navigate("/login");
      return;
    }
  }, [token, navigate]);

  const handleSleep = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found!");
        navigate("/login");
        return;
      }
      setError("");
      setSuccessMessage("");

      const response = await axios.post(
        "http://localhost:5001/sleep/add", 
        {
          bedtime,
          wakeuptime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setSuccessMessage("Sleep record added successfully!");
        setTimeout(() => setSuccessMessage(""), 6000); 
      }
    } catch (err) {
      console.error("Could not add sleep record:", err);
      setError("Failed to add sleep record.");
    }
  };

  // Back button navigation handler
  const goBack = () => {
    navigate("/dashboard"); 
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-blue-300">
      {/* Back button at the top-left */}
      <button
        onClick={goBack}
        className="absolute top-4 left-4 text-white text-2xl bg-transparent hover:bg-gray-600 p-2 rounded-full"
      >
        &#8592; {/* Left arrow symbol */}
      </button>

      <div className="bg-blue-200 p-10 rounded-lg shadow-lg w-96 text-center">
        <div className="flex justify-center mb-5">
          <img
            src={SyncLife}
            alt="SyncLife Logo"
            className="w-24 h-24 rounded-lg"
          />
        </div>
        <p className="mt-2 text-lg font-medium">Track Your Sleep</p>

        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>} {/* Success message */}

        <div className="mt-4 space-y-4">
          <input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:ring focus:ring-blue-500"
          />
          <input
            type="time"
            value={wakeuptime}
            onChange={(e) => setWakeuptime(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:ring focus:ring-blue-500"
          />
          <button
            onClick={handleSleep}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add Sleep Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddASleep;
