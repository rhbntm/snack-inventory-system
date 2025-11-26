import React, { createContext, useContext, useState, useEffect } from "react";
import { storage } from "@/utils/storage";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage for existing auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = storage.get<User>("user");
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const register = async (email: string, password: string, name: string) => {
    try {
      // For demo purposes, we'll just create a mock user
      // In a real app, this would be an API call to create a new user
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9), // Generate random ID
        email: email,
        name: name,
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      // Save to localStorage
      storage.set("user", mockUser);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // For development, we'll use a mock user
      // In a real app, this would be an API call
      if (email === "test@example.com" && password === "password") {
        const mockUser = {
          id: "1",
          email: email,
          name: "Test User",
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        // Save to localStorage
        storage.set("user", mockUser);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Remove from localStorage
    storage.remove("user");
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
