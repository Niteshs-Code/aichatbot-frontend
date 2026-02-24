import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
      <button
        onClick={logout}
        className="bg-red-500 px-4 py-2 rounded cursor-pointer "
      >
        Logout
      </button>
  );
}
