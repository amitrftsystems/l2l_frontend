import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [greeting, setGreeting] = useState("");

  // Function to determine the greeting based on the current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good Morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  React.useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => setGreeting(getGreeting()), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      try {
        await axios.get("http://localhost:5000/health");
      } catch (error) {
        console.error("Server connection error:", error);
        setError(
          "Cannot connect to server. Please make sure the backend server is running on port 5000."
        );
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      switch (response.data.user.role) {
        case "SUPERADMIN":
          navigate("/superadmin");
          break;
        case "ADMIN":
          navigate("/admin");
          break;
        case "EMPLOYEE":
          navigate("/employee");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to server. Please make sure the backend server is running on port 5000."
        );
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-screen flex">
      {/* Left Side - Gradient with Shapes */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-white to-gray-500 items-center justify-center">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-20 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white opacity-20 rounded-full"></div>
        <div className="text-center">
          <span className="text-5xl font-bold text-[#272727]">Welcome to </span>
          <span>
            <img
              src="./hl-group-logo.png"
              alt="HL Group Logo"
              className="inline h-30"
            />
          </span>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Greeting Text */}
          <p className="text-red-500 text-4xl font-semibold mb-2 text-left">
            Hello!{" "}
            <span className="uppercase">
              <br />
              {greeting.split(" ")[0]}{" "}
              <span className="text-black">{greeting.split(" ")[1]}</span>
            </span>
          </p>

          {/* Form Title */}
          <br></br>
          <h2 className="text-2xl font-bold text-red-500 mb-8 text-center">
            <span className="mr-2">Login</span>
            <span className="text-[#333333]">to Your Account</span>
          </h2>
          {error && (
            <p className="text-red-600 text-sm text-center mb-4">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User ID Field */}
            <div>
              <label
                htmlFor="userId"
                className="block text-[#666666] text-sm font-semibold mb-2"
              >
                User ID
              </label>
              <input
                type="text"
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="w-full py-3 px-4 border border-gray-300 rounded-md text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                placeholder="Enter your user ID"
                required
                aria-required="true"
                disabled={loading}
              />
            </div>

            {/* Password Field with Toggle */}
            <div>
              <label
                htmlFor="password"
                className="block text-[#666666] text-sm font-semibold mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full py-3 px-4 border border-gray-300 rounded-md text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                  placeholder="Enter your password"
                  required
                  aria-required="true"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#666666] hover:text-[#4A90E2]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gray-500 to-black text-white py-3 rounded-lg hover:from-black hover:to-gray-500 transition duration-300 font-semibold disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "SUBMIT"
              )}
            </button>
          </form>
        </div>
      </div>
        {/* <div className="text-center mt-10 text-sm">
          <div>
            <p>superadmin</p>
            <p>SUPER001</p>
            <p>superadmin123</p>
          </div>
          <div>
            <p>admin</p>
            <p>ADMIN001</p>
            <p>admin123</p>
          </div>
          <div>
            <p>employee</p>
            <p>EMP001</p>
            <p>employee123</p>
          </div>
        </div> */}
    </div>
  );
};

export default Login;
