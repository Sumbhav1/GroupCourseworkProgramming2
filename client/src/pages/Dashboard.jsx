import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
   const { user } = useContext(AuthContext);
   const token = localStorage.getItem("token");  // Fixed token retrieval
   const navigate = useNavigate(); // Add navigate hook here
   const [error, setError] = useState('');
   const [wakeupTime, setWakeupTime] = useState('');
   const [bedTime, setbedTime] = useState('');
   const [caloriesNeeded, setCaloriesNeeded ] = useState('');
   const [mealsNeeded, setMealsNeeded] = useState("");
   const [mood, setMood] = useState("");
   const [caloriesConsumed, setCaloriesConsumed] = useState('');
   const [mealsConsumed, setMealsConsumed ] = useState('');

   useEffect(() => {
    if (!token) {
        console.log("token not available");
        navigate("/login");
        return;
    }
    
    const fetchDashBoardData = async () => {  // Fixed 'async' function definition
       try {
            const response = await axios.get("http://localhost:5000/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Handle the response here
            console.log(response.data);
        } catch (err) {
            setError("Couldn't fetch data: " + err.message); // Handle error
        }
    };

    fetchDashBoardData();
   }, [token, navigate]);

   return (
        <>
        <div className="align-items-center bg-blue-600">
            <p className="weight-700">
                DASHBOARD
            </p>
        </div>
        </>
    );
}

export default Dashboard;
