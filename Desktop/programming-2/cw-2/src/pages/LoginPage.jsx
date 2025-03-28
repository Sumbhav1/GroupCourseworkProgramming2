import React from "react";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-blue-300">
      <div className="bg-blue-200 p-10 rounded-lg shadow-lg w-96 text-center">
        <div className="flex justify-center mb-5">
          <img
            src="" 
            alt="SyncLife Logo"
            className="w-24 h-24 rounded-lg"
          />
        </div>
        <p className="mt-2 text-lg font-medium">Login</p>

        <form className="mt-4 space-y-4">
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm">
          New user?{" "}
          <a href="#" className="text-blue-600 font-semibold underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
