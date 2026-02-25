import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";

export default function CompleteProfile() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
   const [showPassword, setShowPassword] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const isStrong = passwordRegex.test(password);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/set-password`,
      { name, password },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    navigate("/Chat");
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">
      
      <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-md border border-gray-200 animate-fadeIn">

        {/* Greeting */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome 🎉
          </h2>
          <p className="text-gray-500 mt-2">
            You're almost there! Complete your profile to start chatting securely.
          </p>
        </div>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Your Full Name"
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Password Input */}
        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create Strong Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="absolute right-4 top-3 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Password Strength Indicator */}
        <div className="mb-6 text-sm">
          {password.length > 0 && (
            <p className={`${isStrong ? "text-green-600" : "text-red-500"}`}>
              {isStrong ? (
                <>
                  <FaCheckCircle className="inline mr-1" />
                  Strong Password
                </>
              ) : (
                "Must be 8+ chars with upper, lower, number & special character"
              )}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={() => {
            if (!isStrong) return alert("Please set a strong password");
            handleSubmit(name, password);
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition duration-300"
        >
          Continue Securely
        </button>

      </div>
    </div>
  );
}
