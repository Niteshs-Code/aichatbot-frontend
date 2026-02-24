import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isStrongPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
};
const [toast, setToast] = useState({
  show: false,
  message: "",
  type: "success",
});

const showToast = (message, type = "success") => {
  setToast({ show: true, message, type });

  setTimeout(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, 2500);
};

  const handleSubmit = async () => {

  if (!password) {
    showToast("Please enter a password ⚠️", "error");
    return;
  }

  if (!isStrongPassword(password)) {
    showToast(
      "Password must be 8+ chars with upper, lower, number & special char ❌",
      "error"
    );
    return;
  }

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`,
      { password }
    );

    showToast(res.data.message || "Password reset successful ✅", "success");

    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch (err) {
    showToast(err.response?.data?.message || "Error ❌", "error");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center 
                bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

  <div className="w-full max-w-md bg-white/10 backdrop-blur-xl 
                  border border-white/20 rounded-3xl 
                  shadow-2xl p-8 text-white">

    <h2 className="text-3xl font-bold text-center mb-2">
      Reset Password
    </h2>

    <p className="text-center text-white/70 mb-8 text-sm">
      Create a strong new password
    </p>

    <div className="mb-6 relative">

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter new password"
    className="w-full p-3 pr-12 rounded-xl 
               bg-white/20 placeholder-white/60 
               text-white border border-white/30 
               focus:ring-2 focus:ring-pink-300 
               outline-none transition"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  {/* SHOW / HIDE BUTTON */}
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 
               text-white/70 hover:text-white transition"
  >
    {showPassword ? "Hide" : "Show"}
  </button>

</div>

    <button
      onClick={handleSubmit}
      className="w-full py-3 rounded-xl 
                 bg-green-500 hover:bg-green-600 
                 transition font-semibold shadow-lg"
    >
      Reset Password
    </button>

  </div>

  {/* TOAST */}
  <div
    className={`fixed top-5 right-5 z-50 transform transition-all duration-500 ease-in-out
      ${toast.show ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}
    `}
  >
    <div
      className={`px-6 py-3 rounded-xl shadow-xl text-white min-w-[250px]
        ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}
      `}
    >
      {toast.message}
    </div>
  </div>

</div>
  );
}
