
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
  onLogin: (user: { name: string; email: string; role: string }) => void;
  showRoleOption?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, showRoleOption }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({
        name: name.trim() || "Student",
        email: email.trim(),
        role,
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">
            Sign in to <span className="text-primary">Idea Incubator MGIT</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleLogin}>
            <Input
              placeholder="Your Name"
              required
              value={name}
              disabled={loading}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="College Email"
              required
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
            />
            {showRoleOption && (
              <div className="flex gap-3 mt-1 items-center">
                <input
                  type="radio"
                  id="role-member"
                  checked={role === "member"}
                  onChange={() => setRole("member")}
                  disabled={loading}
                  className="mr-1"
                />
                <label htmlFor="role-member" className="text-sm">
                  Member
                </label>
                <input
                  type="radio"
                  id="role-leader"
                  checked={role === "leader"}
                  onChange={() => setRole("leader")}
                  disabled={loading}
                  className="ml-4 mr-1"
                />
                <label htmlFor="role-leader" className="text-sm">
                  Leader/Manager
                </label>
              </div>
            )}
            <Button
              className="w-full"
              disabled={loading || !email || !name}
              type="submit"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
