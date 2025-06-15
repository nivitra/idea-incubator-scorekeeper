import React, { useState, useEffect } from "react";
import UserListTable from "./UserListTable";
import CreditHistoryTable from "./CreditHistoryTable";
import AddCreditForm from "./AddCreditForm";
import { Button } from "@/components/ui/button";
import { LogIn, User } from "lucide-react";
import UserProfileModal from "./UserProfileModal";

// user type
type User = {
  id: string;
  name: string;
  email: string;
  credits: number;
  status: string;
  role: string;
  joinDate: string;
  history: {
    ts: string;
    amount: number;
    reason: string;
    by: string;
  }[];
  avatarUrl: string;
};

interface LeaderDashboardProps {
  users: User[];
  currentLeader: User;
  minCredits: number;
  onCreditUpdate: ({
    userId,
    amount,
    reason,
    issuer,
  }: {
    userId: string;
    amount: number;
    reason: string;
    issuer: string;
  }) => void;
  onLogout: () => void;
}

const LeaderDashboard: React.FC<LeaderDashboardProps> = ({
  users,
  currentLeader,
  minCredits,
  onCreditUpdate,
  onLogout,
}) => {
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Derived filtered list
  const filteredUsers = users.filter((u) => {
    if (u.role === "leader") return false; // don't show leaders in member list
    if (statusFilter === "active" && u.status !== "active") return false;
    if (statusFilter === "disabled" && u.status !== "disabled") return false;
    if (
      search &&
      !(
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      )
    )
      return false;
    return true;
  });

  const selectedUser =
    users.find((u) => u.id === selectedUserId) ||
    (filteredUsers.length > 0 ? filteredUsers[0] : null);

  React.useEffect(() => {
    if (!selectedUserId && filteredUsers.length) {
      setSelectedUserId(filteredUsers[0].id);
    }
  }, [filteredUsers, selectedUserId]);

  const [profileOpen, setProfileOpen] = React.useState(false);
  const [localLeader, setLocalLeader] = React.useState(currentLeader);

  React.useEffect(() => {
    setLocalLeader(currentLeader);
  }, [currentLeader]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-emerald-50 px-2 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b pb-4 mb-8">
        <div className="flex gap-4 items-center">
          <div className="rounded-full border-2 border-primary/80 p-1 bg-white shadow">
            <img
              src={localLeader.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(localLeader.email)}`}
              alt={localLeader.name}
              className="w-14 h-14 rounded-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-0">{localLeader.name}</h2>
            <div className="text-muted-foreground text-sm">
              {localLeader.email} <span className="mx-1">&mdash;</span>{" "}
              <span className="font-semibold text-blue-700">Leader/Manager</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setProfileOpen(true)}>
            <User className="mr-1" size={16} />
            Profile
          </Button>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogIn className="mr-1" size={16} />
            Log out
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 mb-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 mb-5">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1">
              Search Member
            </label>
            <input
              type="text"
              placeholder="Name or Email"
              value={search}
              className="border px-3 py-2 rounded-md w-56"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              className="border px-3 py-2 rounded-md w-40"
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>
        <UserListTable
          users={filteredUsers}
          selectedId={selectedUserId}
          setSelectedId={setSelectedUserId}
          minCredits={minCredits}
        />
      </div>

      {selectedUser && (
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="">
            <div className="mb-4">
              <AddCreditForm
                user={selectedUser}
                currentLeaderName={currentLeader.name}
                minCredits={minCredits}
                onCreditUpdate={onCreditUpdate}
              />
            </div>
            <div className="p-4 rounded-xl border bg-muted">
              <div>
                <span className="font-semibold">Current Status: </span>
                <span
                  className={
                    selectedUser.status === "active"
                      ? "text-emerald-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {selectedUser.status.charAt(0).toUpperCase() +
                    selectedUser.status.slice(1)}
                </span>
              </div>
              <div>
                <span className="font-semibold">Credits: </span>
                <span
                  className={
                    selectedUser.credits >= minCredits
                      ? "text-emerald-700 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {selectedUser.credits}
                </span>
              </div>
              <div>
                <span className="font-semibold">Joined: </span>
                <span>{selectedUser.joinDate}</span>
              </div>
            </div>
          </div>
          <div>
            <CreditHistoryTable history={selectedUser.history} />
          </div>
        </div>
      )}

      <UserProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={localLeader}
        onUpdate={(val) => {
          setProfileOpen(false);
          setLocalLeader(prev => ({ ...prev, ...val }));
          window.dispatchEvent(new CustomEvent("user-profile-updated", { detail: val }));
        }}
      />
    </div>
  );
};

export default LeaderDashboard;
