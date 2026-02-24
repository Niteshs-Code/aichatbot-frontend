import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import API from "../services/api";
import { FcGoogle } from "react-icons/fc";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

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

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (form.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format ";
    }

    //  Strong Password Validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(form.password)) {
      newErrors.password =
        "Min 8 chars, 1 upper, 1 lower, 1 number & 1 special char";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {

  if (!validate()) {
    showToast("Please fix the errors in form ⚠️", "error");
    return;
  }

  try {
    await API.post("/auth/register", form);

    showToast(
      "Registration successful! Please verify your email 📩",
      "success"
    );

    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch (err) {

    const message =
      err.response?.data?.message || "Registration failed ❌";

    showToast(message, "error");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-gradient-x px-4">

      <div className="w-full max-w-md 
                      bg-white/10 backdrop-blur-xl 
                      border border-white/20 
                      rounded-3xl shadow-2xl 
                      p-8 text-white animate-fadeIn">

        <h2 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h2>

        <p className="text-center text-white/70 mb-8 text-sm">
          Register with your credentials to continue
        </p>

        {/* NAME */}
        <input
          className="w-full p-3 rounded-xl bg-black/20 
                     border border-white/30 mb-2 
                     placeholder-white/60 outline-none"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
        {errors.name && (
          <p className="text-white text-lg mb-3">
            {errors.name}
          </p>
        )}

        {/* EMAIL */}
        <input
          type="email"
          className="w-full p-3 rounded-xl bg-black/20 
                     border border-white/30 mb-2 
                     placeholder-white/60 outline-none"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        {errors.email && (
          <p className="text-white text-lg mb-3">
            {errors.email}
          </p>
        )}

        {/* PASSWORD */}
        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-3 rounded-xl bg-black/20 
                       border border-white/30 
                       placeholder-white/60 outline-none pr-12"
            placeholder="Strong Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-white/50 hover:text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {errors.password && (
          <p className="text-white text-lg mb-3">
            {errors.password}
          </p>
        )}

        {/* REGISTER BUTTON */}
        <button
          onClick={handleRegister}
          className="w-full py-3 rounded-xl 
                     bg-pink-500 hover:bg-pink-600 cursor-pointer
                     transition font-semibold shadow-lg mt-2"
        >
          Register
        </button>

        {/* Divider */}
        <div className="text-center my-4 text-white">
          OR
        </div>

        {/* GOOGLE LOGIN */}
        <button
          onClick={() =>``
            (window.location.href =
              `${import.meta.env.VITE_API_URL}/api/auth/google`)
          }
          className="w-full py-3 rounded-xl 
                     bg-white hover:bg-white/80 text-black cursor-pointer
                     transition font-semibold shadow-lg"
        >
          <FcGoogle  className="inline text-2xl mx-2"/>Sign in with Google
        </button>

        {/* LOGIN NAV */}
        <div className="text-center mt-6 text-lg">
          <span className="text-white/70 ">
            Already have an account?
          </span>
          <button
            onClick={() => navigate("/login")}
            className="ml-2  hover:underline cursor-pointer text-white "
          >
            Login
          </button>
        </div>

      </div>
      <div
  className={`fixed top-5 right-5 z-50 transform transition-all duration-500 ease-in-out
    ${toast.show ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}
  `}
>
  <div
    className={`px-6 py-3 rounded-xl shadow-xl text-white min-w-[260px]
      ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}
    `}
  >
    {toast.message}
  </div>
</div>
    </div>
  );
}
