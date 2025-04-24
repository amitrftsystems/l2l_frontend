// src/components/LoginForm.jsx
import React, { useState, useCallback } from "react";
import { FaGoogle, FaApple } from "react-icons/fa";
import PasswordInput from "./PasswordInput";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginOverlay from "./LoginOverlay";

const LoginForm = ({ switchToSignup }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const togglePassword = () => setShowPassword(!showPassword);

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
      if (percent >= 90) clearInterval(interval);
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
        "https://auth-service-tfl3.onrender.com/api/login",
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
        throw new Error(data.message || "Login failed");
      }

      // alert("Login successful!");
      // navigate("/signup"); // Redirect to dashboard
      toast.success("Login successful! 🎉");
      setTimeout(() => {
        // alert("Login successful!");
        navigate("/");
      }, 500);
    } catch (error) {
      toast.error(error.message || "Login failed");
      setError(error.message);
    } finally {
      setLoading(false);
      setFormData({
        email: "",
        password: "",
      });
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
    } finally {
      setFormData({
        fullName: "",
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <ToastContainer position="top-right" autoClose={7000} />
      {loading && <LoginOverlay progress={progress} />}
      {/* Top Badge */}
      <div
        className="rounded-full px-4 py-[-3]"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        <p className="font-primary font-secondary text-lg text-gray-300">
          Welcome to HL city
        </p>
      </div>
      <h1 className="font-primary font-secondary text-4xl font-thin mt-1">
        Sign In
      </h1>
      <p className="font-primary font-secondary text-gray-400 text-base font-montserrat mb-2">
        Hey, let's sign in to your account
      </p>
      {/* Social Buttons */}
      <div className="flex space-x-4 my-2">
        <button
          className="text-white px-4 py-2 rounded-[15px] border border-gray-600 transition-colors cursor-pointer flex items-center justify-center"
          style={{ backgroundColor: "#1a1a1a" }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#333";
            e.target.style.cursor = "pointer";
          }}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
          onClick={handleGoogleLogin}
        >
          <FaGoogle
            className="text-l bg-transparent"
            style={{ background: "transparent" }}
          />
        </button>
        <button
          className="text-white px-4 py-2 rounded-[15px] border border-gray-600 transition-colors cursor-pointer flex items-center justify-center"
          style={{ backgroundColor: "#1a1a1a" }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#333";
            e.target.style.cursor = "pointer";
          }}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
        >
          <FaApple
            className="text-l bg-transparent"
            style={{ background: "transparent" }}
          />
        </button>
      </div>

      {/* OR Separator */}
      <div className="flex items-center justify-center my-2 w-full">
        <div className="h-px bg-gray-600" style={{ width: "200px" }}></div>
        <span className="px-2 text-gray-500">or</span>
        <div className="h-px bg-gray-600" style={{ width: "200px" }}></div>
      </div>

      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          className="w-full h-12 bg-gray-800 text-white border border-gray-600 rounded-[24px] px-4 focus:outline-none"
          style={{ backgroundColor: "#1a1a1a" }}
          onChange={handleChange}
        />
        {/* Password Input Component */}
        <PasswordInput handleChange={handleChange} />

        <div className="text-right">
          <a
            href="#"
            className="font-primary font-secondary text-gray-400 text-sm underline"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="font-primary font-secondary w-full h-12 bg-black text-white hover:bg-white cursor-pointer hover:text-black hover:border-gray-600 transition-colors mt-2 rounded-[24px] border border-gray-600"
        >
          Sign In →
        </button>
      </form>

      {/* Footer: Link to Signup */}
      <div className="login-foot mt-4 text-xs text-gray-400">
        <span className="mr-2 font-primary font-secondary">
          Don't have an account?
        </span>
        <a
          onClick={switchToSignup}
          className="text-white font-primary font-secondary px-2 py-1 rounded-[8px] text-[0.85rem] border border-gray-600 transition-colors cursor-pointer"
          style={{
            backgroundColor: "#333",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#555")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#333")}
        >
          Sign up
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
