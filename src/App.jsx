import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import VerificationSuccess from "./pages/VerificationSuccess";
import OAuthSuccess from "./pages/OAuthSuccess";
import CompleteProfile from "./pages/CompleteProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SharedConversation from './pages/SharedConversation';
import Home from "./pages/Home";



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verification-success" element={<VerificationSuccess />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/complete-profile" element={<PrivateRoute><CompleteProfile /></PrivateRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/share/:shareId" element={<SharedConversation />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/" element={<Home/>}/>
          <Route
  path="/chat"
  element={
    <PrivateRoute>
      <Chat />
    </PrivateRoute>
  }
/>



        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
