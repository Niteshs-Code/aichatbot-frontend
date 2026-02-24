import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VerificationSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login"); // login page
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      
      <div className="bg-white shadow-2xl rounded-2xl p-10 text-center max-w-md w-full">
        
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-100">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Email Verified Successfully 🎉
        </h2>

        <p className="text-gray-500 mb-6">
          Your account has been activated.  
          You will be redirected to the login page shortly.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition duration-300"
        >
          Go to Login
        </button>

      </div>
    </div>
  );
}
