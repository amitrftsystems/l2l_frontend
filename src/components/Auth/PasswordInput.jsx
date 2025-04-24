import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const PasswordInput = ({ handleChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validatePassword = (e) => {
    const password = e.target.value;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;

    if (password.length === 0) {
      setError(""); // ✅ Clear error if input is empty
    } else if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 special character (#@$!%*?&)."
      );
    } else {
      setError(""); // ✅ Remove error when valid
    }

    handleChange(e);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          name="password"
          className="w-full h-12 bg-gray-800 text-white border border-gray-600 rounded-[24px] px-4 pr-12 focus:outline-none"
          style={{
            backgroundColor: "#1a1a1a",
            lineHeight: "normal",
            height: "48px",
          }}
          onChange={validatePassword}
        />
        <span
          onClick={togglePassword}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 flex items-center justify-center"
          style={{
            height: "48px",
            width: "24px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {showPassword ? (
            <AiOutlineEye size={22} />
          ) : (
            <AiOutlineEyeInvisible size={22} />
          )}
        </span>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default PasswordInput;
