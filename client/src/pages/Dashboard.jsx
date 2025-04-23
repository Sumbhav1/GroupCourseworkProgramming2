import React from "react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
   // const { user } = useContext(AuthContext);
   // const { token } = localStorage.getItem("token");
   // const [error, setError] = useState('');
   // const [wakeupTime, setWakeupTime] = useState('');
   // const [bedTime, setbedTime] = useState('');
   // const []
//
   // useEffect(()=>{
   //     if (!token){
   //         console.log("token not available");
   //         navigate("/login");
   //         return;
   //     }
   //     const fetchDashBoardData = aync() => {
   //         try {
   //             const reponse = await axios.get("http://localhost:5000/dashboard",{
   //                 headers: {
   //                     Authorization: `Bearer ${token}`,
   //                   },
   //             });
//
   //         }catch (err){
   //             setError("couldnt fecth data", err);
//
//
   //         }
   //     };
   //     fetchDashBoardData();
   // }, [token, navigate]);

    return (
        <>
        <div className="align-items-center bg-blue-600">
            <p className="weight-700">
                DASHBOARD
            </p>
        </div>
        </>
    )
}

export default Dashboard;