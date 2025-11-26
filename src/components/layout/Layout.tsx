import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleUserRound } from "lucide-react";

const Layout = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    // The PrivateRoute will handle the redirect to login after logout
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-border p-4 flex flex-col space-y-4">
          {/* Profile Icon and Logout Dropdown - placed at top */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="relative h-8 w-full justify-start px-2"
              >
                <CircleUserRound className="h-5 w-5 mr-2" />
                {user ? (
                  <span className="text-sm font-medium">
                    {user.name || user.email}
                  </span>
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Navigation */}
          <Navigation />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
