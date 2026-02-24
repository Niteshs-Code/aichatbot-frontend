import { useState, useEffect } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import  Navbar from "../components/Navbar";
import Dashboard from "./Dashboard";
import { MdArrowBack } from "react-icons/md";


export default function Profile() {

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    profilePic: ""
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);


  const handleEditImage = () => {
  document.getElementById("imageInput").click();
};


const handleRemoveImage = async () => {
  try {
    await API.put("/auth/profile", {
      profilePic: ""
    });

    loadProfile(); // reload data
  } catch (error) {
    console.log(error);
  }
};


  const loadProfile = async () => {
    const res = await API.get("/auth/me");
    setUser(res.data);
    setForm({
      name: res.data.name || "",
      email: res.data.email || "",
      profilePic: res.data.profilePic || ""
    });
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, profilePic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const updateProfile = async () => {
  try {
    await API.put("/auth/profile", form);

    setToast("Profile Updated Successfully ✅");
    setIsEditing(false);
    loadProfile();

    setTimeout(() => {
      setToast(null);
    }, 2000);

  } catch (err) {
    setToast("Something went wrong ❌");

    setTimeout(() => {
      setToast(null);
    }, 2000);
  }
};

 const changePassword = async () => {

  if (!passwords.oldPassword || !passwords.newPassword) {
    setToast("Please fill all fields ⚠️");
    setTimeout(() => setToast(null), 3000);
    return;
  }

  try {

    await API.put("/auth/change-password", passwords);

    setToast("Password Changed Successfully ✅");
    setPasswords({ oldPassword: "", newPassword: "" });

    setTimeout(() => setToast(null), 3000);

  } catch (error) {

    setToast(error.response?.data?.message || "Something went wrong ❌");

    setTimeout(() => setToast(null), 3000);
  }
};


  if (!user) return  <div className="flex items-center justify-center min-h-screen bg-black">
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
    </div>;

  return (
   <>
   
  <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x text-white">

    <div className="backdrop-blur-lg bg-white/10 min-h-screen px-6 py-10">

      {/* NAVBAR COMPONENT */}
          <Link to="/chat">
  <div className="absolute top-4 left-5 flex justify-center items-center text-xl text-white bg-black p-2 rounded-md cursor-pointer"><MdArrowBack  className="inline text-xl mx-1"/> Back</div>
</Link> <div className="absolute top-4 right-5"><Navbar /></div>

      {/* PROFILE SECTION */}
      <div className="max-w-4xl mx-auto text-center mt-10">

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 group">

            {form.profilePic ? (
              <img
                src={form.profilePic}
                className="w-32 h-32 rounded-full object-cover 
                           border-4 border-white shadow-2xl 
                           transition duration-500 group-hover:scale-105"
                alt="profile"
              />
            ) : (
              <div className="w-32 h-32 rounded-full 
                              bg-gradient-to-r from-yellow-400 to-orange-500 
                              flex items-center justify-center 
                              text-5xl font-bold shadow-2xl">
                {getInitial(form.name)}

                {isEditing && (
      <>
        <input
          type="file"
          id="imageInput"
          hidden
          onChange={handlePhoto}
        />

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 
                        flex gap-3 bg-black/60 backdrop-blur-md 
                        px-4 py-1 rounded-full shadow-lg">

          <button
            onClick={handleEditImage}
            className="text-sm text-white hover:text-green-300 transition"
          >
            Edit
          </button>

          <button
            onClick={handleRemoveImage}
            className="text-sm text-red-300 hover:text-red-500 transition"
          >
            Remove
          </button>

        </div>
      </>
    )}
              </div>
            )}
          </div>

          <h2 className="mt-6 text-2xl font-semibold">{form.name}</h2>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-6 py-2 rounded-full 
                         bg-white/20 hover:bg-white/30 
                         transition shadow-lg"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* EDIT SECTION */}
        {isEditing && (
          <div className="space-y-4 max-w-md mx-auto mb-10">

            <input
              className="w-full p-3 rounded-xl bg-white/20 
                         placeholder-white/70 text-white 
                         backdrop-blur-md border border-white/30 
                         focus:ring-2 focus:ring-white outline-none"
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <div className="flex gap-4 justify-center">
              <button
                onClick={updateProfile}
                className="px-6 py-2 rounded-full 
                           bg-green-400 hover:bg-green-500 
                           text-black font-semibold 
                           transition shadow-lg"
              >
                Save
              </button>

              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 rounded-full 
                           bg-white/20 hover:bg-white/30 
                           transition"
              >
                Cancel
              </button>
            </div>

          </div>
        )}

        {/* PASSWORD SECTION */}
        <div className="mt-16 border-t border-white/30 pt-10 max-w-xl mx-auto">

          <h3 className="text-xl font-semibold mb-6">
            Change Password
          </h3>

          <div className="space-y-4">

            <input
              type="password"
              placeholder="Old Password"
              className="w-full p-3 rounded-xl bg-white/20 
                         placeholder-white/70 text-white 
                         backdrop-blur-md border border-white/30 
                         focus:ring-2 focus:ring-pink-300 outline-none"
              value={passwords.oldPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, oldPassword: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full p-3 rounded-xl bg-white/20 
                         placeholder-white/70 text-white 
                         backdrop-blur-md border border-white/30 
                         focus:ring-2 focus:ring-pink-300 outline-none"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
            />

            <button
              onClick={changePassword}
              className="px-6 py-2 rounded-full 
                         bg-pink-400 hover:bg-pink-500 
                         text-black font-semibold 
                         transition shadow-lg"
            >
              Update Password
            </button>

          </div>
        </div>

        {/* DASHBOARD COMPONENT */}
        <div className="mt-20">
          <Dashboard />
        </div>

      </div>

    </div>
  </div>

  {/* notificaton modal */}
{toast && (
  <div className={`fixed top-5 right-150 px-6 py-3 rounded-lg shadow-lg
   bg-gray-800 text-white
    animate-bounce`}
  >
    {toast}
  </div>
)}
   </>
  );
}
