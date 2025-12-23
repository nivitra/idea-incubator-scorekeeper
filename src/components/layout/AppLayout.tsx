import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Newspaper, 
  Users, 
  Trophy, 
  Shield,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/feed", icon: Newspaper, label: "Feed" },
  { to: "/tribes", icon: Users, label: "Tribes" },
  { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, isLeader } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const allNavItems = isLeader 
    ? [...navItems, { to: "/admin", icon: Shield, label: "Admin" }]
    : navItems;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-sidebar p-4 fixed h-full">
        {/* Logo */}
        <div className="mb-8 px-2">
          <h1 className="font-display text-xl font-bold gradient-text">
            IDEA INCUBATOR
          </h1>
          <p className="text-xs text-muted-foreground mt-1">MGIT Credit Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {allNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn("nav-item", isActive && "active")
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-3 px-2 mb-4">
            <img
              src={currentUser?.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${currentUser?.email}`}
              alt={currentUser?.name}
              className="h-10 w-10 rounded-full border-2 border-primary/30"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{currentUser?.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUser?.position}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-lg font-bold gradient-text">
              IDEA INCUBATOR
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-30 bg-background/95 backdrop-blur-lg pt-16"
            >
              <nav className="p-4 space-y-2">
                {allNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn("nav-item text-lg", isActive && "active")
                    }
                  >
                    <item.icon className="h-6 w-6" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
                <div className="pt-4 border-t border-border mt-4">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full justify-start text-destructive"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <div className="p-4 lg:p-8 pb-24 lg:pb-8">
          {children}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden bottom-nav">
          <div className="flex justify-around">
            {allNavItems.slice(0, 5).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn("bottom-nav-item flex-1", isActive && "active")
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </main>
    </div>
  );
}
