import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import {
  UserProtectedRoute,
  AdminProtectedRoute,
} from "./routes/ProtectedRoute";

import GeminiBlogHero from "./components/GeminiBlogHero";
import UserAuth from "./pages/UserAuth";
import AdminLogin from "./pages/AdminLogin";
import CreateBlog from "./pages/CreateBlog";
import AdminDashboard from "./pages/AdminDashboard";
import AllBlog from "./pages/AllBlog";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element ={<GeminiBlogHero/>}/>
          <Route path="/welcome" element={<UserAuth />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected user route */}
          <Route
            path="/create-blog"
            element={
              // <UserProtectedRoute>
              <CreateBlog />
              // </UserProtectedRoute>
            }
          />

          <Route path="/all-blog" element={<AllBlog />} />

          {/* Protected admin route */}
          <Route
            path="/admin-dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
