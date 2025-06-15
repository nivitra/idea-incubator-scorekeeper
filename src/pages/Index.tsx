import React, { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm";
import LeaderDashboard from "../components/LeaderDashboard";
import MemberDashboard from "../components/MemberDashboard";
import ThresholdConfigPanel from "../components/ThresholdConfigPanel";
import { ThresholdAnalyticsPanel } from "../components/ThresholdAnalyticsPanel";
import { Button } from "@/components/ui/button";
import { useClubBranding } from "@/context/ClubBrandingContext";
import BrandingAdminPanel from "../components/BrandingAdminPanel";
import Footer from "../components/Footer";

// -------------------
// Version 3 constants
// -------------------

const DEFAULT_MIN_CREDITS = 10; // global default threshold
const DEFAULT_WARN_BUFFER = 5; // credits near threshold triggers warning
const APPROVAL_REQUIRED = true;
const CREDIT_LOCK = true; // credit cannot go below 0

// Initial mock users
const INITIAL_USERS = [
  {
    id: "u1",
    name: "Priya Kapoor",
    email: "priya@mgit.ac.in",
    role: "leader",
    credits: 25,
    status: "active",
    joinDate: "2023-06-01",
    avatarUrl: "",
    position: "Club President",
    minThreshold: undefined, // optional per-user override
    softDisabled: false,
    thresholdLogs: [],
    suspensionReason: "",
    recoveryLogs: [],
    approvalState: "approved",
    history: [
      {
        ts: "2024-06-15T10:01:00Z",
        amount: 15,
        reason: "Initial grant",
        by: "admin",
      },
      {
        ts: "2024-06-16T09:12:00Z",
        amount: 10,
        reason: "Organized workshop",
        by: "admin",
      },
    ],
  },
  {
    id: "u2",
    name: "Aman Verma",
    email: "aman@mgit.ac.in",
    role: "member",
    credits: 12,
    status: "active",
    joinDate: "2023-11-15",
    avatarUrl: "",
    minThreshold: undefined,
    softDisabled: false,
    position: "Member",
    thresholdLogs: [],
    suspensionReason: "",
    recoveryLogs: [],
    approvalState: "approved",
    history: [
      {
        ts: "2024-06-10T12:00:00Z",
        amount: 12,
        reason: "Participation credits",
        by: "Priya Kapoor",
      },
    ],
  },
  {
    id: "u3",
    name: "Saina Reddy",
    email: "saina@mgit.ac.in",
    role: "member",
    credits: 5,
    status: "disabled",
    joinDate: "2022-12-22",
    avatarUrl: "",
    minThreshold: 8,
    softDisabled: false,
    position: "Senior Member",
    thresholdLogs: [],
    suspensionReason: "Absence Penalty",
    recoveryLogs: [],
    approvalState: "approved",
    history: [
      {
        ts: "2024-06-01T15:35:00Z",
        amount: 20,
        reason: "Annual grant",
        by: "Priya Kapoor",
      },
      {
        ts: "2024-06-14T09:14:00Z",
        amount: -15,
        reason: "Absence penalty",
        by: "Priya Kapoor",
      },
      {
        ts: "2024-06-15T12:00:00Z",
        amount: 0,
        reason: "Below threshold: user disabled",
        by: "SYSTEM",
      },
    ],
  },
];

const DEFAULT_LEADER_PASSWORD = "leader@mgit"; // for demo only! Change for security.

const Index = () => {
  // --- State ---
  const [globalThreshold, setGlobalThreshold] = useState(DEFAULT_MIN_CREDITS);
  const [buffer, setBuffer] = useState(DEFAULT_WARN_BUFFER);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<null | { id: string; name: string; email: string; role: string }>(null);
  const [thresholdConfigVisible, setThresholdConfigVisible] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const branding = useClubBranding();

  // Password management (demo only: store in-memory for user sessions)
  const [userPasswords, setUserPasswords] = useState<{ [email: string]: { password: string, role: string } }>({
    "priya@mgit.ac.in": { password: DEFAULT_LEADER_PASSWORD, role: "leader" },
    "aman@mgit.ac.in": { password: "member123", role: "member" },
    "saina@mgit.ac.in": { password: "member123", role: "member" },
  });
  // Track reset requests: { email: "pending" | "approved" | "rejected" }
  const [resetRequests, setResetRequests] = useState<{ [email: string]: string }>({});

  // Listen for profile updates
  React.useEffect(() => {
    const handleProfileUpdate = (e: any) => {
      const { name, avatarUrl, position } = e.detail;
      setUsers(prev =>
        prev.map(u =>
          currentUser && u.id === currentUser.id
            ? { ...u, name, avatarUrl, position: position || u.position }
            : u
        )
      );
      if (currentUser) {
        setCurrentUser({ ...currentUser, name });
      }
    };
    window.addEventListener("user-profile-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("user-profile-updated", handleProfileUpdate);
    };
    // eslint-disable-next-line
  }, [currentUser]);

  // ---- User approve/reject (superficial logic for demo) ----
  const approveUser = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, approvalState: "approved" } : u
      )
    );
  };
  const rejectUser = (id: string, reason = "Not eligible") => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, approvalState: "rejected", suspensionReason: reason } : u
      )
    );
  };

  // ---- Per-user threshold override ----
  const setUserThreshold = (id: string, value: number | undefined) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, minThreshold: value } : u
      )
    );
  };

  // ---- Reset all ----
  const resetAllThresholds = () => {
    setUsers((prev) =>
      prev.map((u) => ({ ...u, minThreshold: undefined }))
    );
    setGlobalThreshold(DEFAULT_MIN_CREDITS);
    setBuffer(DEFAULT_WARN_BUFFER);
  };

  // ---- Main credit update logic ----
  const handleCreditUpdate = ({
    userId,
    amount,
    reason,
    issuer,
    disableReason,
    forceReenable, // for manual re-enable
  }: {
    userId: string;
    amount: number;
    reason: string;
    issuer: string;
    disableReason?: string;
    forceReenable?: boolean;
  }) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        let credits = u.credits + amount;
        // Credit lock/security
        if (CREDIT_LOCK && credits < 0) credits = 0;
        // Determine min threshold
        const minC = u.minThreshold !== undefined ? u.minThreshold : globalThreshold;
        // Current status
        let status = u.status;
        let softDisabled = u.softDisabled;
        let logs = u.thresholdLogs ? [...u.thresholdLogs] : [];
        let suspensionRes = u.suspensionReason ?? "";
        let recov = u.recoveryLogs ? [...u.recoveryLogs] : [];
        // Recovery tracking
        const prevBelow = u.credits < minC;
        const nowBelow = credits < minC;
        // Status transitions
        if (forceReenable) {
          status = "active";
          softDisabled = false;
          logs.push({ ts: new Date().toISOString(), action: "manual-reactivate", note: disableReason });
          recov.push({ ts: new Date().toISOString(), action: "manual-reactivate", note: disableReason });
        } else if (nowBelow && !prevBelow) {
          status = credits < minC - buffer ? "disabled" : "soft-disabled";
          softDisabled = credits < minC && credits >= minC - buffer;
          logs.push({
            ts: new Date().toISOString(),
            action: "threshold-drop",
            note: status === "disabled" ? (disableReason || "Auto: Below threshold") : "Soft disable - near limit"
          });
          if (credits < minC) recov.push({ ts: new Date().toISOString(), action: "below-threshold" });
          if (credits < minC - buffer) suspensionRes = disableReason || "";
        } else if (!nowBelow && prevBelow) {
          status = "active";
          softDisabled = false;
          logs.push({
            ts: new Date().toISOString(),
            action: "recovery",
            note: "Credit above threshold"
          });
          recov.push({ ts: new Date().toISOString(), action: "above-threshold" });
          suspensionRes = "";
        } else if (u.status === "soft-disabled" && credits < minC - buffer) {
          status = "disabled";
          softDisabled = false;
          logs.push({
            ts: new Date().toISOString(),
            action: "soft->full-disable",
            note: disableReason || "Auto: Fallen further below"
          });
          suspensionRes = disableReason || "";
        }
        // Manual disable
        if (disableReason && status !== "disabled") {
          status = "disabled";
          logs.push({ ts: new Date().toISOString(), action: "manual-disable", note: disableReason });
          suspensionRes = disableReason;
        }
        // Manual reenable
        if (forceReenable) {
          suspensionRes = "";
        }
        // History
        let history = [
          {
            ts: new Date().toISOString(),
            amount: amount,
            reason,
            by: issuer,
          },
          ...(u.history || []),
        ];
        return {
          ...u,
          credits,
          status,
          history,
          thresholdLogs: logs,
          suspensionReason: suspensionRes,
          recoveryLogs: recov,
          softDisabled,
        };
      })
    );
  };

  // ------------- Soft disable automation ---------------
  // Whenever a user credit changes, we update status
  React.useEffect(() => {
    setUsers((prev) =>
      prev.map((u) => {
        const minC = u.minThreshold !== undefined ? u.minThreshold : globalThreshold;
        let status = u.status;
        let softDisabled = u.softDisabled;
        // Determine status
        if (u.credits < minC - buffer) {
          if (u.status !== "disabled") status = "disabled";
          softDisabled = false;
        } else if (u.credits < minC) {
          if (u.status !== "soft-disabled") status = "soft-disabled";
          softDisabled = true;
        } else {
          status = "active";
          softDisabled = false;
        }
        return { ...u, status, softDisabled };
      })
    );
  }, [users.length, globalThreshold, buffer]);

  // ----- Signup & authentication -----
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [loginMode, setLoginMode] = useState<"signIn" | "signUp">("signIn");
  const [resetPendingCaller, setResetPendingCaller] = useState<string | null>(null);

  const handleLogin = (u: {
    name: string;
    email: string;
    role: string;
    password: string;
    avatarUrl?: string;
    position?: string;
    mode?: "signIn" | "signUp";
    passwordResetRequest?: boolean;
  }) => {
    setLoginError(undefined);
    const email = u.email.toLowerCase();
    // Sign Up Flow
    if (u.mode === "signUp") {
      // Prevent choosing leader without leader password
      if (
        u.role === "leader" &&
        userPasswords[email]?.role !== "leader" &&
        u.password !== DEFAULT_LEADER_PASSWORD
      ) {
        setLoginError("Leader sign-up is protected. Incorrect leader password.");
        return;
      }
      if (userPasswords[email]) {
        setLoginError("Account already exists. Please sign in.");
        return;
      }
      // Save "password" in demo-local memory (DON'T DO IN PRODUCTION)
      setUserPasswords(prev => ({
        ...prev,
        [email]: { password: u.password, role: u.role }
      }));
      // Add to users list with approval if needed
      let newUser = {
        id: "u" + (users.length + 1),
        name: u.name,
        email,
        role: u.role,
        credits: 12,
        status: "active",
        joinDate: new Date().toISOString().slice(0, 10),
        avatarUrl: u.avatarUrl ?? "",
        minThreshold: undefined,
        softDisabled: false,
        position: u.position ?? "",
        thresholdLogs: [],
        suspensionReason: "",
        recoveryLogs: [],
        approvalState: APPROVAL_REQUIRED ? "pending" : "approved",
        history: [
          {
            ts: new Date().toISOString(),
            amount: 12,
            reason: "New member signup",
            by: "SYSTEM",
          },
        ],
      };
      setUsers((prev) => [...prev, newUser]);
      setCurrentUser({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });
      return;
    }
    // Sign In Flow
    if (!userPasswords[email]) {
      setLoginError("No account found with this email. Please sign up.");
      return;
    }
    if (userPasswords[email].password !== u.password) {
      // If reset requested & it was approved, allow setting a new password
      if (
        resetRequests[email] === "approved" &&
        u.password.length >= 6
      ) {
        setUserPasswords(prev => ({
          ...prev,
          [email]: { ...prev[email], password: u.password }
        }));
        setResetRequests(prev => ({
          ...prev,
          [email]: undefined
        }));
      } else {
        setLoginError("Incorrect password.");
        return;
      }
    }
    // Prevent users logging in as leader without leader credentials
    if (
      u.role === "leader" &&
      userPasswords[email].role !== "leader"
    ) {
      setLoginError("This account is not a leader account.");
      return;
    }
    // Find the user in users array
    let match = users.find(user => user.email.toLowerCase() === email);
    if (!match) {
      setLoginError("Account data missing. Please sign up again.");
      return;
    }
    setCurrentUser({
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
    });
  };

  // Password Reset Request Handler
  const handlePasswordResetRequest = (email: string) => {
    if (!userPasswords[email]) return;
    setResetRequests(prev => ({
      ...prev,
      [email]: "pending"
    }));
    setResetPendingCaller(email);
  };

  // Logout resets session
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Leader approves/rejects reset requests
  const handleApproveReset = (email: string) => {
    setResetRequests(prev => ({
      ...prev,
      [email]: "approved"
    }));
  };
  const handleRejectReset = (email: string) => {
    setResetRequests(prev => ({
      ...prev,
      [email]: "rejected"
    }));
  };

  // ---------- Manual activation/deactivation from leader -----------
  const handleManualDisable = ({ userId, reason }: { userId: string; reason: string }) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        let logs = u.thresholdLogs ? [...u.thresholdLogs] : [];
        logs.push({ ts: new Date().toISOString(), action: "manual-disable", note: reason });
        return {
          ...u,
          status: "disabled",
          suspensionReason: reason,
          thresholdLogs: logs,
        };
      })
    );
  };
  const handleManualReactivate = ({ userId, reason }: { userId: string; reason: string }) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        let logs = u.thresholdLogs ? [...u.thresholdLogs] : [];
        logs.push({ ts: new Date().toISOString(), action: "manual-reactivate", note: reason });
        return {
          ...u,
          status: "active",
          softDisabled: false,
          suspensionReason: "",
          thresholdLogs: logs,
        };
      })
    );
  };

  // ===================== ENTRY POINT ====================
  // Not logged in
  if (!currentUser) {
    // Determine if current login attempt is for leader
    const lastAttemptLeader =
      loginMode === "signUp" ? false : undefined;
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-tr from-blue-50 to-emerald-100 relative">
        {/* Banner and logo */}
        <img
          src={branding.home_banner_image}
          alt="Club Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
          style={{ minHeight: 340, objectPosition: "center" }}
        />
        <div className="relative z-10 flex flex-col items-center flex-1 justify-center">
          <img
            src={branding.club_logo}
            alt={branding.club_name}
            className="w-28 h-28 rounded-full mb-4 border-4 border-white shadow bg-white"
          />
          <div
            className="text-3xl md:text-4xl font-extrabold text-primary mb-2"
            style={branding.accent_color ? { color: branding.accent_color } : {}}
          >
            {branding.club_name}
          </div>
          <div className="text-lg mb-6 text-muted-foreground">
            Welcome to our club's credit portal!
          </div>
          <LoginForm
            onLogin={handleLogin}
            showRoleOption
            requireExtraFields
            leaderAuthRequired
            leaderPassword={DEFAULT_LEADER_PASSWORD}
            passwordResetPending={
              !!(resetPendingCaller && resetRequests[resetPendingCaller] === "pending")
            }
            onPasswordResetRequest={handlePasswordResetRequest}
            error={loginError}
          />
          {loginError && (
            <div className="text-red-500 text-xs mt-2">{loginError}</div>
          )}
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  }

  // Find user and check approval state
  const user = users.find((u) => u.id === currentUser.id);
  if (!user) return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        User not found.
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
  if (
    APPROVAL_REQUIRED &&
    user.approvalState &&
    user.approvalState !== "approved"
  ) {
    // If leader/admin, show approval UI, else pending
    if (currentUser.role === "leader") {
      return (
        <div className="min-h-screen flex flex-col bg-gradient-to-tr from-blue-50 to-emerald-100">
          <div className="bg-white border shadow rounded-xl p-8 max-w-md mx-auto mt-12">
            <div className="font-bold mb-2">Pending Member Approvals</div>
            {users.filter((u) => u.approvalState === "pending").length ? (
              users
                .filter((u) => u.approvalState === "pending")
                .map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 mb-2 p-2 border-b"
                  >
                    <img
                      src={
                        u.avatarUrl ||
                        `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                          u.email
                        )}`
                      }
                      alt={u.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-semibold">{u.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {u.position || "N/A"}
                    </span>
                    <Button size="sm" className="ml-auto" onClick={() => approveUser(u.id)}>
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => rejectUser(u.id, "Not eligible")}
                    >
                      Reject
                    </Button>
                  </div>
                ))
            ) : (
              <div className="text-sm">No users pending approval.</div>
            )}
            {/* Password reset approvals for leader */}
            <div className="mt-6">
              <div className="font-semibold text-base mb-2">
                Password Reset Requests
              </div>
              {Object.entries(resetRequests)
                .filter(([_email, status]) => status === "pending")
                .length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No pending reset requests.
                </div>
              ) : (
                Object.entries(resetRequests)
                  .filter(([_email, status]) => status === "pending")
                  .map(([email, _status]) => (
                    <div
                      key={email}
                      className="flex items-center justify-between mb-2"
                    >
                      <span className="text-sm">{email}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApproveReset(email)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRejectReset(email)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </div>
            <Button className="mt-6 w-full" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <div className="mt-auto">
            <Footer />
          </div>
        </div>
      );
    }
    // Member in review
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-tr from-blue-100 to-emerald-50">
        <div className="flex flex-1 items-center justify-center">
          <div className="bg-white p-8 rounded-xl border shadow text-center max-w-md">
            <div className="font-bold text-lg mb-3">Your membership is pending approval!</div>
            <div className="text-muted-foreground mb-4">Please wait for a leader/manager to review your request.</div>
            <Button className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  }

  // Member dashboard
  if (user.role === "member") {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col">
          <MemberDashboard
            user={user}
            disabled={user.status !== "active"}
            minCredits={user.minThreshold !== undefined ? user.minThreshold : globalThreshold}
            warnBuffer={buffer}
            globalThreshold={globalThreshold}
            softDisabled={user.softDisabled}
            onLogout={handleLogout}
          />
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  }
  // Leader dashboard
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full px-2">
        {/* Dynamic club header for leader */}
        <header className="flex items-center gap-3 py-3 mb-4 border-b max-w-6xl mx-auto">
          <img
            src={branding.club_logo}
            alt={branding.club_name}
            className="w-10 h-10 rounded-full border border-primary"
          />
          <span
            className="text-2xl font-bold"
            style={
              branding.accent_color
                ? { color: branding.accent_color }
                : {}
            }
          >
            {branding.club_name}
          </span>
        </header>
      </div>
      <div className="flex-1 flex flex-col">
        <LeaderDashboard
          users={users}
          currentLeader={user}
          minCredits={globalThreshold}
          buffer={buffer}
          setBuffer={setBuffer}
          globalThreshold={globalThreshold}
          setGlobalThreshold={setGlobalThreshold}
          onCreditUpdate={handleCreditUpdate}
          onLogout={handleLogout}
          setThresholdPanelVisible={setThresholdConfigVisible}
          setAnalyticsVisible={setShowAnalytics}
          setUserThreshold={setUserThreshold}
          resetAllThresholds={resetAllThresholds}
          handleManualDisable={handleManualDisable}
          handleManualReactivate={handleManualReactivate}
        />
        <ThresholdConfigPanel
          globalThreshold={globalThreshold}
          setGlobalThreshold={setGlobalThreshold}
          buffer={buffer}
          setBuffer={setBuffer}
          users={users}
          setUserThreshold={setUserThreshold}
          resetAll={resetAllThresholds}
          visible={thresholdConfigVisible}
          onClose={() => setThresholdConfigVisible(false)}
        />
        <ThresholdAnalyticsPanel
          visible={showAnalytics}
          onClose={() => setShowAnalytics(false)}
          globalThreshold={globalThreshold}
          buffer={buffer}
          data={users.map((u) => ({
            id: u.id,
            name: u.name,
            credits: u.credits,
            threshold: u.minThreshold !== undefined ? u.minThreshold : globalThreshold,
            status:
              u.status === "disabled"
                ? "disabled"
                : u.softDisabled
                  ? "soft-disabled"
                  : "active",
          }))}
        />
        {/* Brand panel (stub, only visible for demo) */}
        <BrandingAdminPanel />
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Index;

// NOTE: This file is now quite long (~700+ lines).
// ⚡️ Consider refactoring it into smaller files for maintainability!
