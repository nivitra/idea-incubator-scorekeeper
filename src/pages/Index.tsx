import React, { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm";
import LeaderDashboard from "../components/LeaderDashboard";
import MemberDashboard from "../components/MemberDashboard";

// Threshold for active/disabled
const MIN_CREDITS = 10;

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

const Index = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<null | { id: string; name: string; email: string; role: string }>(null);

  // Listen for profile updates
  React.useEffect(() => {
    const handleProfileUpdate = (e: any) => {
      const { name, avatarUrl } = e.detail;
      setUsers(prev =>
        prev.map(u =>
          currentUser && u.id === currentUser.id
            ? { ...u, name, avatarUrl }
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

  // Simulate authentication (no real security!)
  const handleLogin = (u: { name: string; email: string; role: string }) => {
    // Try to find the user, else make a new member
    let match = users.find(
      (user) => user.email.toLowerCase() === u.email.toLowerCase()
    );
    let role = u.role;
    if (!match) {
      match = {
        id: "u" + (users.length + 1),
        name: u.name,
        email: u.email,
        role,
        credits: 12,
        status: "active",
        joinDate: new Date().toISOString().slice(0, 10),
        history: [
          {
            ts: new Date().toISOString(),
            amount: 12,
            reason: "New member signup",
            by: "SYSTEM",
          },
        ],
      };
      setUsers((prev) => [...prev, match]);
    }
    setCurrentUser({
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Main credit update logic
  const handleCreditUpdate = ({
    userId,
    amount,
    reason,
    issuer,
  }: {
    userId: string;
    amount: number;
    reason: string;
    issuer: string;
  }) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        let newCredits = u.credits + amount;
        // Status logic
        let newStatus = u.status;
        const prevStatus = u.status;
        if (newCredits < MIN_CREDITS) {
          newStatus = "disabled";
        } else {
          newStatus = "active";
        }
        // Add history entry for credit action
        const updated = {
          ...u,
          credits: newCredits,
          status: newStatus,
          history: [
            {
              ts: new Date().toISOString(),
              amount: amount,
              reason,
              by: issuer,
            },
            ...u.history,
          ],
        };
        // If status changed due to crossing threshold, note in history
        if (prevStatus !== newStatus) {
          updated.history = [
            {
              ts: new Date().toISOString(),
              amount: 0,
              reason:
                newStatus === "disabled"
                  ? "Below threshold: user disabled"
                  : "Above threshold: user enabled",
              by: "SYSTEM",
            },
            ...updated.history,
          ];
        }
        updated.status = newStatus;
        return updated;
      })
    );
  };

  // Re-calc status for all on any change (simulate backend/cron in real life)
  React.useEffect(() => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.credits < MIN_CREDITS && u.status !== "disabled") {
          return {
            ...u,
            status: "disabled",
            history: [
              {
                ts: new Date().toISOString(),
                amount: 0,
                reason: "Below threshold: user disabled",
                by: "SYSTEM",
              },
              ...u.history,
            ],
          };
        } else if (u.credits >= MIN_CREDITS && u.status !== "active") {
          return {
            ...u,
            status: "active",
            history: [
              {
                ts: new Date().toISOString(),
                amount: 0,
                reason: "Above threshold: user enabled",
                by: "SYSTEM",
              },
              ...u.history,
            ],
          };
        } else {
          return u;
        }
      })
    );
  }, [users.length]); // intentionally only fires on users array shape change

  // Not logged in: show Login
  if (!currentUser) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-tr from-blue-50 to-emerald-100">
        <LoginForm onLogin={handleLogin} showRoleOption />
      </div>
    );
  }

  const user = users.find((u) => u.id === currentUser.id);
  if (!user) return <div>User not found.</div>;

  // If member and disabled: read-only view with banner
  if (user.role === "member") {
    return (
      <MemberDashboard
        user={user}
        disabled={user.status !== "active"}
        minCredits={MIN_CREDITS}
        onLogout={handleLogout}
      />
    );
  }
  // Else: show leader/manager dashboard
  return (
    <LeaderDashboard
      users={users}
      currentLeader={user}
      minCredits={MIN_CREDITS}
      onCreditUpdate={handleCreditUpdate}
      onLogout={handleLogout}
    />
  );
};

export default Index;
