import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/Chat");
    } else {
      navigate("/");
    }
  }, [navigate, params]);
  
  useEffect(() => {
  const token = params.get("token");

  if (token) {
    const decoded = JSON.parse(atob(token.split(".")[1]));

    localStorage.setItem("token", token);

    if (!decoded.hasPassword) {
      navigate("/complete-profile");
    } else {
      navigate("/Chat");
    }
  } else {
    navigate("/");
  }
}, []);


  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col items-center gap-6">
        
        {/* Spinner */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-gray-700"></div>
          <div className="w-20 h-20 rounded-full border-4 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent animate-spin absolute top-0 left-0 shadow-[0_0_25px_#22d3ee]"></div>
        </div>

        {/* Text */}
        <p className="text-cyan-400 text-lg tracking-widest animate-pulse">
          Loading...
        </p>

      </div>
    </div>
  );
}
