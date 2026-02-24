import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({
  show: false,
  message: "",
  type: "success", 
});

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const showToast = (message, type = "success") => {
  setToast({ show: true, message, type });

  setTimeout(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, 2000);
};

 const handleLogin = async () => {

  if (!email || !password) {
    showToast("Please enter email and password ⚠️", "error");
    return;
  }

  try {
    const res = await API.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    login(res.data.token);

    showToast("Login Successful ✅", "success");

    setTimeout(() => {
      navigate("/chat");
    }, 1000);

  } catch (err) {

    const message =
      err.response?.data?.message ||
      "Invalid email or password. Please register first.";

    showToast(message, "error");
  }
};

  return (
    <>
   <div className="min-h-screen flex items-center justify-center 
                  bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl 
                    border border-white/20 rounded-3xl 
                    shadow-2xl p-8 text-white">

      <h2 className="text-3xl font-bold text-center mb-2">
        Welcome Back
      </h2>

      <p className="text-center text-white/70 mb-8">
        Login to continue to your account
      </p>

      {/* EMAIL */}
      <div className="mb-5">
        <label className="block text-sm mb-2">Email</label>
        <input
          type="email"
          required
          className="w-full p-3 rounded-xl bg-white/20 
                     placeholder-white/60 text-white 
                     border border-white/30 
                     focus:ring-2 focus:ring-pink-300 
                     outline-none"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* PASSWORD */}
      <div className="mb-6 relative">
        <label className="block text-sm mb-2">Password</label>

        <input
          type={showPassword ? "text" : "password"}
          required
          minLength={6}
          className="w-full p-3 rounded-xl bg-white/20 
                     placeholder-white/60 text-white 
                     border border-white/30 
                     focus:ring-2 focus:ring-pink-300 
                     outline-none pr-12"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* SHOW / HIDE ICON */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[42px] text-white/70 hover:text-white"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* LOGIN BUTTON */}
      <button
        onClick={handleLogin}
  disabled={!email || !password}
        className="w-full py-3 rounded-xl 
                   bg-pink-500 hover:bg-pink-600 
                   transition font-semibold shadow-lg"
      >
        Login
      </button>

      {/* LINKS */}
      <div className="flex justify-between items-center mt-6 text-sm">

        <Link
          to="/forgot-password"
          className="text-white/80 hover:text-white underline"
        >
          Forgot Password?
        </Link>

        <button
          onClick={() => navigate("/register")}
          className="text-white/80 hover:text-white underline"
        >
          Create Account
        </button>

      </div>

    </div>
    

  
  </div>
  <div
  className={`fixed top-5 right-5 z-50 transform transition-all duration-500 ease-in-out
    ${toast.show ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}
  `}
>
  <div
    className={`mr-5 px-6 py-3 rounded-xl shadow-xl text-white min-w-[250px]
      ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}
    `}
  >
    {toast.message}
  </div>
</div>
  </>);
}
