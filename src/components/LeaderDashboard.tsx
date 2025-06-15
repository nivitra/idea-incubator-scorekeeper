import React, { useState, useEffect } from "react";
import UserListTable from "./UserListTable";
import CreditHistoryTable from "./CreditHistoryTable";
import AddCreditForm from "./AddCreditForm";
import BulkCreditAddForm from "./BulkCreditAddForm";
import { Button } from "@/components/ui/button";
import { LogIn, User, Edit, Info, Users, Search, Plus } from "lucide-react";
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
  minThreshold?: number;
  position?: string;
  softDisabled?: boolean;
  thresholdLogs?: any[];
  suspensionReason?: string;
  approvalState?: string;
};

interface LeaderDashboardProps {
  users: User[];
  currentLeader: User;
  minCredits: number;
  buffer: number;
  setBuffer: (v: number) => void;
  globalThreshold: number;
  setGlobalThreshold: (n: number) => void;
  onCreditUpdate: (params: any) => void;
  onLogout: () => void;
  setThresholdPanelVisible: (val: boolean) => void;
  setAnalyticsVisible: (val: boolean) => void;
  setUserThreshold: (id: string, value: number | undefined) => void;
  resetAllThresholds: () => void;
  handleManualDisable: ({ userId, reason }: { userId: string; reason: string }) => void;
  handleManualReactivate: ({ userId, reason }: { userId: string; reason: string }) => void;
}

const LeaderDashboard: React.FC<LeaderDashboardProps> = ({
  users,
  currentLeader,
  minCredits,
  buffer,
  setBuffer,
  globalThreshold,
  setGlobalThreshold,
  onCreditUpdate,
  onLogout,
  setThresholdPanelVisible,
  setAnalyticsVisible,
  setUserThreshold,
  resetAllThresholds,
  handleManualDisable,
  handleManualReactivate,
}) => {
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "soft-disabled" | "disabled">("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Derived filtered list
  const filteredUsers = users.filter((u) => {
    if (u.role === "leader") return false;
    if (statusFilter === "active" && u.status !== "active") return false;
    if (statusFilter === "soft-disabled" && u.status !== "soft-disabled") return false;
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

  // Manual disable/reactivate UI state
  const [manualEnable, setManualEnable] = useState(false);
  const [manualDisable, setManualDisable] = useState(false);
  const [reason, setReason] = useState("");

  // Bulk Credit Modal state
  const [bulkOpen, setBulkOpen] = React.useState(false);

  // Bulk credit handler
  const handleBulkCreditUpdate = ({
    userIds,
    amount,
    reason,
    issuer,
  }: {
    userIds: string[];
    amount: number;
    reason: string;
    issuer: string;
  }) => {
    userIds.forEach((userId) => {
      onCreditUpdate({
        userId,
        amount,
        reason,
        issuer,
      });
    });
  };

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
          <Button variant="secondary" size="sm" onClick={() => setThresholdPanelVisible(true)}>
            <Edit className="mr-1" size={16} />
            Threshold Settings
          </Button>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogIn className="mr-1" size={16} />
            Log out
          </Button>
        </div>
      </div>

      <div className="flex gap-3 mb-3 justify-end">
        <Button
          onClick={() => setAnalyticsVisible(true)}
          variant="outline"
          size="sm"
        >
          <Users size={16} className="mr-2" />
          Analytics
        </Button>
        <Button
          onClick={() => setBulkOpen(true)}
          variant="default"
          size="sm"
        >
          <Plus size={16} className="mr-2" />
          Bulk Credit Add
        </Button>
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
              <option value="soft-disabled">Soft Disabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>
        <UserListTable
          users={filteredUsers}
          selectedId={selectedUserId}
          setSelectedId={setSelectedUserId}
          minCredits={globalThreshold}
          showThreshold
          setUserThreshold={setUserThreshold}
        />
      </div>

      {selectedUser && (
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="">
            <div className="mb-4">
              <AddCreditForm
                user={selectedUser}
                currentLeaderName={currentLeader.name}
                minCredits={selectedUser.minThreshold !== undefined ? selectedUser.minThreshold : globalThreshold}
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
                      : selectedUser.status === "soft-disabled"
                      ? "text-orange-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {selectedUser.status.charAt(0).toUpperCase() +
                    selectedUser.status.slice(1)}
                  {selectedUser.softDisabled && (
                    <span className="ml-2 px-2 py-1 bg-orange-200/80 rounded text-xs text-orange-800 font-semibold">
                      Soft-disabled
                    </span>
                  )}
                </span>
              </div>
              <div className="my-1">
                <span className="font-semibold">Credits: </span>
                <span
                  className={
                    selectedUser.credits >= (selectedUser.minThreshold ?? globalThreshold)
                      ? "text-emerald-700 font-bold"
                      : selectedUser.status === "soft-disabled"
                        ? "text-orange-600 font-bold"
                        : "text-red-600 font-bold"
                  }
                >
                  {selectedUser.credits}
                </span>
              </div>
              <div>
                <span className="font-semibold">Threshold: </span>
                <span>
                  {selectedUser.minThreshold !== undefined
                    ? `${selectedUser.minThreshold} (User)`
                    : `${globalThreshold} (Global)`}
                </span>
              </div>
              <div>
                <span className="font-semibold">Joined: </span>
                <span>{selectedUser.joinDate}</span>
              </div>
              {selectedUser.suspensionReason && selectedUser.status === "disabled" && (
                <div className="mt-3 text-sm text-red-700 font-medium">
                  Suspension Reason: {selectedUser.suspensionReason}
                </div>
              )}
              {(selectedUser.status === "disabled" || selectedUser.softDisabled) && (
                <div className="flex gap-2 mt-3">
                  {selectedUser.status === "disabled" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setManualEnable(true)}
                    >
                      Reactivate
                    </Button>
                  )}
                  {selectedUser.status !== "disabled" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setManualDisable(true)}
                    >
                      Suspend
                    </Button>
                  )}
                </div>
              )}
              {(manualEnable || manualDisable) && (
                <div className="mt-3 flex flex-col gap-2">
                  <label className="text-sm font-semibold">{manualEnable ? "Reason for reactivation:" : "Reason for suspension:"}</label>
                  <textarea className="border rounded p-2" value={reason} onChange={e => setReason(e.target.value)} />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={!reason}
                      onClick={() => {
                        if (manualEnable) {
                          handleManualReactivate({ userId: selectedUser.id, reason });
                          setManualEnable(false);
                        } else {
                          handleManualDisable({ userId: selectedUser.id, reason });
                          setManualDisable(false);
                        }
                        setReason("");
                      }}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setManualEnable(false);
                        setManualDisable(false);
                        setReason("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              {selectedUser.thresholdLogs?.length > 0 && (
                <div className="mt-5 bg-white rounded border p-3 text-xs">
                  <b>Status Logs</b>
                  <ul>
                    {selectedUser.thresholdLogs.slice(-6).reverse().map((l, i) => (
                      <li key={i} className="mb-1">
                        <span className="text-muted-foreground">{new Date(l.ts).toLocaleString()}</span>{" "}
                        &ndash; <span className="font-semibold capitalize">{l.action.replace("-", " ")}</span>
                        {l.note && " — " + l.note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div>
            <CreditHistoryTable history={selectedUser.history} />
          </div>
        </div>
      )}

      <BulkCreditAddForm
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        users={users}
        leader={currentLeader}
        onBulkCreditUpdate={handleBulkCreditUpdate}
      />

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

// NOTE: This file is now large (>230 lines). You may want to refactor it for maintainability!
