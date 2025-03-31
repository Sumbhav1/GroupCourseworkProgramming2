import React from "react";
import SyncLife from "../assets/images/SyncLife.png";

const SignUp = () => {
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
        <p className="mt-2 text-lg font-medium">Sign up</p>

        <form className="mt-4 space-y-4">
        <div className="text-left">
            <label className="block font-medium">Name:</label>
            <input
              type="name"
              className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="text-left">
            <label className="block font-medium">Email:</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="text-left">
            <label className="block font-medium">Password:</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="text-left">
            <label className="block font-medium">Confirm password:</label>
            <input
              type="ConfirmPassword"
              className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:ring focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-sm">
          Back to login?{" "}
          <a href="#" className="text-blue-600 font-semibold underline">
            Go Back
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;