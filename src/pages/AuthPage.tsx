import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Zap, Shield, Users } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useApp();
  
  const [loginData, setLoginData] = useState({ email: "", password: "", isLeader: false });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", position: "" });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const success = login(
        loginData.email, 
        loginData.password, 
        loginData.isLeader ? "leader" : "member"
      );
      
      if (success) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
      setLoading(false);
    }, 500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const success = signup(
        signupData.name,
        signupData.email,
        signupData.password,
        signupData.position
      );
      
      if (success) {
        toast.success("Account created! Pending approval.");
        navigate("/dashboard");
      } else {
        toast.error("Email already registered");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Branding */}
      <div className="lg:w-1/2 bg-card p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-accent/20 rounded-full blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          <h1 className="font-display text-4xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">IDEA</span>
            <br />
            <span className="text-foreground">INCUBATOR</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            MGIT's Gamified Community Credit System
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Earn Credits</p>
                <p className="text-muted-foreground">Participate in events & activities</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Join Tribes</p>
                <p className="text-muted-foreground">Connect with like-minded peers</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="h-10 w-10 rounded-lg bg-success/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium">Climb Ranks</p>
                <p className="text-muted-foreground">Compete on the leaderboard</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md"
        >
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@mgit.ac.in"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is-leader"
                    checked={loginData.isLeader}
                    onChange={(e) => setLoginData({ ...loginData, isLeader: e.target.checked })}
                    className="rounded border-border"
                  />
                  <Label htmlFor="is-leader" className="text-sm text-muted-foreground">
                    Sign in as Leader/Admin
                  </Label>
                </div>
                <Button type="submit" className="w-full glow-primary" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Demo: priya@mgit.ac.in / leader123 (Leader)<br />
                  aman@mgit.ac.in / member123 (Member)
                </p>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="John Doe"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@mgit.ac.in"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-position">Position/Role</Label>
                  <Input
                    id="signup-position"
                    placeholder="Developer, Designer, etc."
                    value={signupData.position}
                    onChange={(e) => setSignupData({ ...signupData, position: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
