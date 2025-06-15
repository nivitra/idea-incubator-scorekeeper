
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  onLogin: (user: { name: string; email: string; role: string; avatarUrl?: string; position?: string }) => void;
  showRoleOption?: boolean;
  requireExtraFields?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, showRoleOption, requireExtraFields }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("member");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({
        name: name.trim() || "Student",
        email: email.trim(),
        role,
        avatarUrl: avatarUrl.trim(),
        position: position.trim(),
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">
            {requireExtraFields
              ? "Sign up for Idea Incubator MGIT"
              : "Sign in to Idea Incubator MGIT"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="flex flex-col items-center gap-2">
              {requireExtraFields && (
                <>
                  <div className="relative mb-2">
                    <img
                      src={
                        avatarUrl ||
                        `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`
                      }
                      alt={name}
                      className="w-16 h-16 rounded-full border object-cover bg-white"
                    />
                  </div>
                  <Input
                    placeholder="Profile Image URL (optional)"
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                    disabled={loading}
                    maxLength={250}
                  />
                  <Input
                    placeholder="Position/Title (e.g. President, Senior Member)"
                    value={position}
                    onChange={e => setPosition(e.target.value)}
                    disabled={loading}
                    maxLength={60}
                  />
                </>
              )}
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
            </div>
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
              {loading ? "Signing in..." : requireExtraFields ? "Sign up" : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
