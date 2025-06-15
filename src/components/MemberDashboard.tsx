import React from "react";
import CreditHistoryTable from "./CreditHistoryTable";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import UserProfileModal from "./UserProfileModal";
import { user as UserIcon } from "lucide-react";

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

interface MemberDashboardProps {
  user: User;
  disabled: boolean;
  minCredits: number;
  onLogout: () => void;
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({ user, disabled, minCredits, onLogout }) => {
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [localUser, setLocalUser] = React.useState(user);

  React.useEffect(() => {
    setLocalUser(user);
  }, [user]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-blue-50 to-emerald-50">
      <div className="w-full max-w-xl flex flex-col items-center gap-5 pt-8">
        <div className="flex flex-col items-center mb-2">
          <div className="rounded-full border-2 border-primary/80 p-1 bg-white shadow mb-2">
            <img
              src={localUser.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(localUser.email)}`}
              alt={localUser.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold">{localUser.name}</h2>
          <div className="text-muted-foreground text-sm">{localUser.email}</div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="mb-3"
            onClick={() => setProfileOpen(true)}
          >
            <UserIcon className="mr-1" size={16} />
            Profile
          </Button>
          <Button variant="outline" size="sm" className="mb-3" onClick={onLogout}>
            <LogIn className="mr-1" size={16} />
            Log out
          </Button>
        </div>
        {disabled && (
          <div className="bg-destructive/10 p-4 rounded-lg font-medium text-destructive shadow mb-4 w-full text-center">
            Your account is temporarily disabled (credits below {minCredits}). <br />
            Contact your club leader.
          </div>
        )}
        <div className="p-6 w-full rounded-xl bg-white border shadow text-center mb-4">
          <div className="text-lg font-semibold mb-2">Your Current Credits</div>
          <div className={localUser.credits >= minCredits ? "text-3xl font-bold text-emerald-700" : "text-3xl font-bold text-red-600"}>
            {localUser.credits}
          </div>
        </div>
        <div className="w-full">
          <CreditHistoryTable history={localUser.history} />
        </div>
        <UserProfileModal
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          user={localUser}
          onUpdate={(val) => {
            setProfileOpen(false);
            setLocalUser(prev => ({ ...prev, ...val }));
            // Bubble up update to parent via window event
            window.dispatchEvent(new CustomEvent("user-profile-updated", { detail: val }));
          }}
        />
      </div>
    </div>
  );
};

export default MemberDashboard;
