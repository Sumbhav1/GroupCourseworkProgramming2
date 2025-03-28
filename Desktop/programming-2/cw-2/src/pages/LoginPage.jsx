import React, { useState } from "react";
import SyncLife from "../assets/images/SyncLife.png";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        console.log("Login successful");
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
          <a href="/signup" className="text-blue-600 font-semibold underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

