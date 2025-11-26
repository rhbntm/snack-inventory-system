import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { InventoryProvider } from "@/contexts/InventoryContext";
import Layout from "@/components/layout/Layout";
import Home from "@/components/home";
import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import Inventory from "@/components/inventory/Inventory";
import PrivateRoute from "./components/auth/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<AnalyticsDashboard />} />
            <Route path="/inventory" element={<Inventory />} />
          </Route>
        </Routes>
        <Toaster />
      </InventoryProvider>
    </AuthProvider>
  );
}

export default App;
