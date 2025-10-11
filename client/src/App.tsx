import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import Bookmarks from "./pages/Bookmarks";
import Profile from "./pages/Profile";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import GroupsDashboard from "./pages/GroupsDashboard";


const queryClient = new QueryClient();

import { useEffect } from "react";
import axios from "axios";

const App = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`http://localhost:8000/api/users/${token}`)
        .then((res) => {
          if (res.data.user) {
            console.log(res.data)
            localStorage.setItem("user", JSON.stringify(res.data.user));
          }
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/groups" element={<GroupsDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
