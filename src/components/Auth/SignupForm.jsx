import React, { useState, useCallback } from "react";
import { FaGoogle, FaApple } from "react-icons/fa";
import PasswordInput from "./PasswordInput";
import { useNavigate } from "react-router-dom";
import SignupOverlay from "./SignupOverlay";
import { auth } from "../../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupForm = ({ switchToLogin }) => {
  const [countryCode, setCountryCode] = useState("+91");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };
  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const simulateProgress = () => {
    let percent = 0;
    const interval = setInterval(() => {
      percent += 10;
      setProgress(percent);
      if (percent >= 90) clearInterval(interval); // Stop at 90% until API response
    }, 300);
    return interval;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setProgress(0);

    const interval = simulateProgress();

    try {
      const response = await fetch(
        "https://auth-service-tfl3.onrender.com/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setProgress(100); // Set to 100% on success
      toast.success("Login successful! 🎉");
      setTimeout(() => {
        // alert("Signup successful! Please log in.");
        navigate("/login");
      }, 500);
      // alert("Signup successful! Please log in.");
      // navigate("/login");
      setFormData({
        fullName: "",
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error(error.message || "Login failed ❌");
      setError(error.message);
      clearInterval(interval);
      setLoading(false);
    } finally {
      setLoading(false); // Ensure loading state resets
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // Send ID token to the backend for verification
      const response = await fetch(
        "https://auth-service-tfl3.onrender.com/api/verifyToken",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: idToken }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      // alert("Login successful!");
      // navigate("/login"); // Redirect to dashboard
      // setProgress(100); // Set to 100% on success
      toast.success("Login successful! 🎉");
      setTimeout(() => {
        // alert("Signup successful! Please log in.");
        navigate("/");
      }, 500);
    } catch (error) {
      toast.error(error.message || "Login failed ❌");
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center text-center space-y-0 mt-0">
      <ToastContainer position="top-right" autoClose={7000} />
      {loading && <SignupOverlay progress={progress} />}
      <div
        className="rounded-full px-2 md:px-4 py-1 md:py-[-3]"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        <p className="font-primary font-secondary text-sm md:text-lg text-gray-300">
          Welcome to HL city
        </p>
      </div>
      <h1 className="font-primary font-secondary text-lg md:text-4xl font-thin mt-2">
        Sign up account
      </h1>
      <p className="hidden md:block md:mt-3 font-primary font-secondary text-gray-400 md:text-xs font-montserrat mb-2">
        Enter your personal data to create your account
      </p>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex space-x-2 md:space-x-4 my-3 mb-1 md:my-2">
        <button
          className="text-white px-3 md:px-4 py-1 md:py-2 rounded-[15px] border border-gray-600 transition-colors cursor-pointer flex items-center justify-center"
          style={{ backgroundColor: "#1a1a1a" }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#333";
            e.target.style.cursor = "pointer";
          }}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
          onClick={handleGoogleLogin}
        >
          <FaGoogle
            className="text-xs md:text-lg bg-transparent"
            style={{ background: "transparent" }}
          />
        </button>
        <button
          className="text-white px-3 md:px-4 py-1 md:py-2 rounded-[15px] border border-gray-600 transition-colors cursor-pointer flex items-center justify-center"
          style={{ backgroundColor: "#1a1a1a" }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#333";
            e.target.style.cursor = "pointer";
          }}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
        >
          <FaApple
            className="text-xs md:text-lg bg-transparent"
            style={{ background: "transparent" }}
          />
        </button>
      </div>

      <div className="flex items-center justify-center my-2  md:my-4 w-full">
        <div className="h-px bg-gray-600 w-48"></div>
        <span className="px-2 text-gray-500">or</span>
        <div className="h-px bg-gray-600 w-48"></div>
      </div>

      <form className="w-80 space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          name="fullName"
          className="w-full h-12 bg-gray-800 text-white border border-gray-600 rounded-[24px] px-4 focus:outline-none"
          style={{ backgroundColor: "#1a1a1a" }}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          className="w-full h-12 bg-gray-800 text-white border border-gray-600 rounded-[24px] px-4 focus:outline-none"
          style={{ backgroundColor: "#1a1a1a" }}
          onChange={handleChange}
        />
        {/* <input
          type="email"
          name="email"
          placeholder="Email address"
          className="w-full h-12 bg-[#1a1a1a] text-white border border-gray-600 rounded-[24px] px-4 focus:outline-none focus:bg-[#1a1a1a]"
          onChange={handleChange}
        /> */}

        <div
          className="flex items-center w-full h-12 bg-gray-800 text-white border border-gray-600 rounded-[24px] px-4 focus-within:border-blue-500"
          style={{ backgroundColor: "#1a1a1a" }}
        >
          {/* Country Code Selector */}
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="bg-gray-800 text-white border-none focus:outline-none cursor-pointer mr-2"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+91">🇮🇳 +91</option>
            <option value="+61">🇦🇺 +61</option>
            <option value="+81">🇯🇵 +81</option>
          </select>

          {/* Phone Number Input */}
          <input
            type="text"
            placeholder="Phone number"
            className="w-full bg-gray-800 text-white focus:outline-none"
            style={{ backgroundColor: "#1a1a1a" }}
          />
        </div>

        {/* Password Input Component */}

        <PasswordInput handleChange={handleChange} />

        <button
          type="submit"
          className="font-primary font-secondary w-full h-12 bg-black text-white hover:bg-white hover:text-black transition-colors mt-6 rounded-[24px] hover:cursor-pointer"
        >
          {loading ? "Signing up..." : "Sign up →"}
        </button>
      </form>

      <div className="login-foot mt-8 text-xs text-gray-400">
        <span className="mr-2 font-primary font-secondary">
          Already have an account?
        </span>
        <button
          onClick={switchToLogin}
          className="text-white  mt-3 md:mt-0 font-primary font-secondary cursor-pointer px-2 py-1 rounded-[8px] text-[0.85rem] border border-gray-600 transition-colors cursor-pointer bg-gray-700"
          style={{
            backgroundColor: "#333",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#555")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#333")}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
