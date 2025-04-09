import React, { useState } from "react";
import SyncLife from "../assets/images/SyncLife.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); 

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: email,
        password: password,
      });
      console.log(response.data)

      if (response.status === 200) {
        console.log("Login successful");
        const user = response.data.user;

        alert(response.data.message) // test line, should actually redirect to dashboard
        localStorage.setItem("user", JSON.stringify(response.data.user)); 
        localStorage.setItem("token", response.data.token); //session token

        setTimeout(() => {
          if (user.settings_finished){
            navigate('/dashboard');
          }else {
            navigate('/settings');
          };
        }, 100); 
        
      } else {
        setError("Unexpected error occurred. Please try again.");
      }
    } catch (err) {
      setError("Invalid email or password."); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-300">
      <div className="bg-blue-200 p-10 rounded-lg shadow-lg w-96 text-center">
        <div className="flex justify-center mb-5">
          <img
            src={SyncLife}
            alt="SyncLife Logo"
            className="w-24 h-24 rounded-lg"
          />
        </div>
        <p className="mt-2 text-lg font-medium">Login</p>

        {error && <p className="text-red-500">{error}</p>} 

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="text-left">
            <label className="block font-medium">Email:</label>
            <input
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="text-left">
            <label className="block font-medium">Password:</label>
            <input
              type="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:ring focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={loading} 
          >
            {loading ? "Logging in..." : "Login"} 
          </button>
        </form>

        <p className="mt-4 text-sm">
          New user?{" "}
          <a href="/sign-up" className="text-blue-600 font-semibold underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

