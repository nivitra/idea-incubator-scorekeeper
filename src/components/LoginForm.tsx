
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  onLogin: (user: {
    name: string;
    email: string;
    role: string;
    password: string;
    avatarUrl?: string;
    position?: string;
    mode?: "signIn" | "signUp";
    passwordResetRequest?: boolean;
  }) => void;
  showRoleOption?: boolean;
  requireExtraFields?: boolean;
  leaderAuthRequired?: boolean;
  leaderPassword?: string;
  onPasswordResetRequest?: (email: string) => void;
  passwordResetPending?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  showRoleOption,
  requireExtraFields,
  leaderAuthRequired,
  leaderPassword = "",
  onPasswordResetRequest,
  passwordResetPending,
  error,
}) => {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("member");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [position, setPosition] = useState("");
  const [password, setPassword] = useState("");
  const [leaderPassInput, setLeaderPassInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);

  const canSign = !!email && !!name && !!password;

  const leaderMode =
    showRoleOption && role === "leader" && (mode === "signUp" || mode === "signIn");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (leaderMode && leaderAuthRequired && leaderPassInput !== leaderPassword) {
        setLoading(false);
        alert("Incorrect leader password! Cannot proceed as leader.");
        return;
      }
      onLogin({
        name: name.trim() || "Student",
        email: email.trim().toLowerCase(),
        role,
        avatarUrl: avatarUrl.trim(),
        position: position.trim(),
        password: password,
        mode,
      });
      setLoading(false);
    }, 600);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setResetRequested(true);
      onPasswordResetRequest?.(email.trim().toLowerCase());
      setLoading(false);
    }, 600);
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">
            {requireExtraFields
              ? mode === "signUp"
                ? "Sign up for Idea Incubator MGIT"
                : "Sign in to Idea Incubator MGIT"
              : mode === "signUp"
              ? "Sign up"
              : "Sign in"}
          </CardTitle>
          <div className="flex gap-2 mt-2">
            <Button
              variant={mode === "signIn" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("signIn")}
              disabled={loading}
            >
              Sign In
            </Button>
            <Button
              variant={mode === "signUp" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("signUp")}
              disabled={loading}
            >
              Sign Up
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForgot ? (
            <form className="space-y-5" onSubmit={handleForgot}>
              <div>
                <Label htmlFor="forgot-email">Enter your registered email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="College Email"
                  required
                  value={email}
                  disabled={loading || resetRequested}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                disabled={loading || !email || resetRequested}
                type="submit"
              >
                {resetRequested
                  ? "Reset Requested"
                  : loading
                  ? "Requesting..."
                  : "Request Password Reset"}
              </Button>
              <div className="mt-2 text-center">
                <Button variant="link" type="button" onClick={() => setShowForgot(false)}>
                  Back to Sign In
                </Button>
              </div>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="flex flex-col items-center gap-2">
                {/* Only show extra fields if mode is signUp and requireExtraFields is true */}
                {requireExtraFields && mode === "signUp" && (
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
                <Input
                  type="password"
                  placeholder={
                    mode === "signIn"
                      ? "Password"
                      : "Create Password (min 6 chars)"
                  }
                  value={password}
                  required
                  minLength={6}
                  maxLength={64}
                  disabled={loading}
                  onChange={e => setPassword(e.target.value)}
                />
                {leaderMode && (
                  <Input
                    type="password"
                    placeholder="Leader Auth Password"
                    value={leaderPassInput}
                    minLength={4}
                    maxLength={64}
                    disabled={loading}
                    onChange={e => setLeaderPassInput(e.target.value)}
                  />
                )}
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
                  {leaderMode && leaderAuthRequired && (
                    <span className="text-xs text-muted-foreground ml-2">
                      (Leader pass required)
                    </span>
                  )}
                </div>
              )}
              <Button
                className="w-full"
                disabled={
                  loading ||
                  !canSign ||
                  (leaderMode && leaderAuthRequired && !leaderPassInput)
                }
                type="submit"
              >
                {loading
                  ? (mode === "signUp"
                    ? "Signing up..."
                    : "Signing in...")
                  : mode === "signUp"
                  ? "Sign Up"
                  : "Sign In"}
              </Button>
              <div className="flex justify-between mt-2 text-xs">
                {mode === "signIn" && (
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    type="button"
                    onClick={() => {
                      setShowForgot(true);
                      setResetRequested(false);
                    }}
                  >
                    Forgot password?
                  </Button>
                )}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  type="button"
                  onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
                >
                  {mode === "signIn"
                    ? "Don't have an account? Sign Up"
                    : "Already have an account? Sign In"}
                </Button>
              </div>
              {error && (
                <div className="mt-2 text-red-600 text-sm text-center">{error}</div>
              )}
              {passwordResetPending && (
                <div className="mt-2 text-amber-600 text-sm text-center">
                  Your reset request is pending leader approval.
                </div>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;

