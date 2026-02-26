import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPassword() {


const isValidEmail = (email) => {
   return /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email);
};
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
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

useEffect(() => {

  const savedTime = localStorage.getItem("resetCooldown");

  if (savedTime) {
    const remaining = Math.floor((savedTime - Date.now()) / 1000);
    if (remaining > 0) setCooldown(remaining);
  }

}, []);

useEffect(() => {
  if (cooldown <= 0) return;

  const interval = setInterval(() => {
    setCooldown((prev) => {
      if (prev <= 1) {
        localStorage.removeItem("resetCooldown");
        clearInterval(interval);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);

}, [cooldown]);

  const handleSubmit = async () => {

  if (cooldown > 0) return;

  if (!email) {
    showToast("Please enter your email ⚠️", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showToast("Please enter a valid email ❌", "error");
    toast.error("Only Gmail addresses are allowed");
    return;
  }

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
      { email }
    );

    showToast("Email has been sent please check your inbox or spam ✅", "success");

    const time = 15 * 60; // 15 minutes
    setCooldown(time);
    localStorage.setItem("resetCooldown", Date.now() + time * 1000);

  } catch (err) {
    showToast("Something went wrong ❌", "error");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center 
                  bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-gradient-x px-4">

    <div className="w-full max-w-md 
                    bg-white/10 backdrop-blur-xl 
                    border border-white/20 
                    rounded-3xl shadow-2xl 
                    p-8 text-white 
                    animate-fadeIn">

      <h2 className="text-3xl font-bold text-center mb-3">
        Forgot Password?
      </h2>

      <p className="text-center text-white/70 mb-8 text-sm">
        Enter your registered email address and we'll send you a reset link.
      </p>

      <div className="space-y-5">

        <input
          type="email"
          required
          className="w-full p-3 rounded-xl 
                     bg-white/20 placeholder-white/60 
                     text-white border border-white/30 
                     focus:ring-2 focus:ring-pink-300 
                     outline-none transition"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
  onClick={handleSubmit}
  disabled={cooldown > 0}
  className={`w-full py-3 rounded-xl font-semibold shadow-lg transition duration-300
    ${cooldown > 0
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-pink-500 hover:bg-pink-600 hover:scale-[1.02]"}
  `}
>
  {cooldown > 0
    ? `Resend in ${Math.floor(cooldown / 60)}:${String(cooldown % 60).padStart(2, "0")}`
    : "Send Reset Link"}
</button>

      </div>

      <div className="text-center mt-6 text-sm">
        <span className="text-white/70">Remember your password? </span>
        <Link
            to='/login'
          className="underline hover:text-white cursor-pointer"
        >
          Back to Login
        </Link>
      </div>

    </div>
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
