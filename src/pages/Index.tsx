
// PROTOTYPE APP: Club credit dashboard with login
import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import ClubDashboard from "../components/ClubDashboard";

const MIN_CREDITS = 10;

const MOCK_USER_DATA = {
  // This will be swapped for real backend logic
  credits: 11,
  minCredits: MIN_CREDITS,
  joinDate: "2023-11-15",
  avatarUrl: undefined,
};

const Index = () => {
  const [user, setUser] = useState<null | { name: string; email: string }>(null);
  const [userCredits, setUserCredits] = useState<number>(MOCK_USER_DATA.credits);

  // Simple logout
  const handleLogout = () => {
    setUser(null);
    setUserCredits(MOCK_USER_DATA.credits);
  };

  // Example for demo: let user decrease their own credits!
  const handleSpendOneCredit = () => {
    setUserCredits((prev) => Math.max(0, prev - 1));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-tr from-blue-50 to-emerald-100">
        <LoginForm onLogin={(u) => setUser(u)} />
      </div>
    );
  }

  const userData = {
    ...user,
    ...MOCK_USER_DATA,
    credits: userCredits,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      <ClubDashboard user={userData} onLogout={handleLogout} />
      <div className="text-center mt-2 mb-7">
        <button
          className="px-4 py-2 text-xs border bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition inline-block"
          onClick={handleSpendOneCredit}
        >
          Spend 1 Credit (Simulate Club Actions)
        </button>
      </div>
    </div>
  );
};

export default Index;
