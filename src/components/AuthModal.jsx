import React, { useState } from "react";
import axios from "axios";

const AuthModal = ({ onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate passwords match for signup
      if (!isLoginMode && formData.password !== formData.confirmPassword) {
        throw new Error("Passwords don't match!");
      }

      const authData = isLoginMode
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          };

      const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/register";

      const response = await axios.post(endpoint, authData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle successful authentication
      if (isLoginMode && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        // You might want to add global auth state management here
      }

      onClose(); // Close modal on success
    } catch (err) {
      let errorMessage = "Authentication failed";

      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      } else if (err.request) {
        errorMessage = "Network error. Please try again.";
      } else {
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur">
      <div className="w-[320px] bg-white p-6 rounded-2xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          ✕
        </button>

        <div className="flex justify-center mb-4">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            {isLoginMode ? "Login" : "Create Account"}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* Tab Controls */}

        <div className="relative flex h-8 mb-3 border border-gray-300 rounded-full overflow-hidden">
          <button
            className={`w-1/2 text-xs font-medium transition-all z-10 ${
              isLoginMode ? "text-white" : "text-gray-500"
            }`}
            onClick={() => setIsLoginMode(true)}
            disabled={isLoading}
          >
            Login
          </button>
          <button
            className={`w-1/2 text-xs font-medium transition-all z-10 ${
              !isLoginMode ? "text-white" : "text-gray-500"
            }`}
            onClick={() => setIsLoginMode(false)}
            disabled={isLoading}
          >
            Sign Up
          </button>

          {/* Animated background */}

          <div
            className={`absolute top-0 h-full bg-blue-600 rounded-full transition-all duration-300 ${
              isLoginMode ? "left-0 w-1/2" : "left-1/2 w-1/2"
            }`}
          ></div>
        </div>

        {/* Form Content */}

        <form onSubmit={handleSubmit} className="space-y-1">
          {!isLoginMode && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                placeholder="John Doe"
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
              placeholder="your@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
              placeholder="••••••••"
              required
              minLength={6}
              disabled={isLoading}
            />
            {/* {!isLoginMode && (
            //   <p className="text-xxs text-gray-500 mt-1">
            //     Minimum 6 characters
            //   </p>
            )} */}
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                placeholder="••••••••"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
          )}

          {isLoginMode && (
            <div className="text-right">
              <a href="#" className="text-xs text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors font-medium ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isLoginMode ? "Logging in..." : "Creating account..."}
              </span>
            ) : isLoginMode ? (
              "Login"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          {isLoginMode ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline font-medium"
                onClick={() => setIsLoginMode(false)}
                disabled={isLoading}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline font-medium"
                onClick={() => setIsLoginMode(true)}
                disabled={isLoading}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
