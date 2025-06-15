
import React from "react";
import CreditHistoryTable from "./CreditHistoryTable";
import { Button } from "@/components/ui/button";
import { LogIn, User, Info } from "lucide-react";
import UserProfileModal from "./UserProfileModal";

type UserType = {
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
  softDisabled?: boolean;
  position?: string;
  suspensionReason?: string;
};

interface MemberDashboardProps {
  user: UserType;
  disabled: boolean;
  minCredits: number;
  warnBuffer: number;
  globalThreshold: number;
  softDisabled?: boolean;
  onLogout: () => void;
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({
  user,
  disabled,
  minCredits,
  warnBuffer,
  globalThreshold,
  softDisabled,
  onLogout,
}) => {
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [localUser, setLocalUser] = React.useState(user);

  React.useEffect(() => {
    setLocalUser(user);
  }, [user]);

  const credits = localUser.credits;
  const threshold = localUser.minThreshold !== undefined ? localUser.minThreshold : globalThreshold;

  const isWarn = credits >= threshold && credits < threshold + warnBuffer;
  const isSoftDisabled = localUser.softDisabled || softDisabled;
  const isDisabled = localUser.status === "disabled";
  const statusText = isDisabled
    ? "Disabled"
    : isSoftDisabled
    ? "Soft-disabled"
    : "Active";

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-blue-50 to-emerald-50">
      <div className="w-full max-w-xl flex flex-col items-center gap-5 pt-8">
        <div className="flex flex-col items-center mb-2">
          <div className="rounded-full border-2 border-primary/80 p-1 bg-white shadow mb-2">
            <img
              src={
                localUser.avatarUrl ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(localUser.email)}`
              }
              alt={localUser.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold">{localUser.name}</h2>
          <div className="text-muted-foreground text-sm">{localUser.email}</div>
          <div className="text-xs text-muted-foreground font-semibold">
            {localUser.position}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="mb-3"
            onClick={() => setProfileOpen(true)}
          >
            <User className="mr-1" size={16} />
            Profile
          </Button>
          <Button variant="outline" size="sm" className="mb-3" onClick={onLogout}>
            <LogIn className="mr-1" size={16} />
            Log out
          </Button>
        </div>
        {/* Status banners */}
        {isWarn && !isSoftDisabled && !isDisabled && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded font-medium text-yellow-800 flex gap-2 items-center shadow mb-4 w-full text-center">
            <Info className="inline text-yellow-500" size={17} />
            Warning: You are close to your minimum credits threshold ({threshold}). Activity may be restricted.
          </div>
        )}
        {isSoftDisabled && !isDisabled && (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded font-medium text-orange-900 flex gap-2 items-center shadow mb-4 w-full text-center">
            <Info className="inline text-orange-500" size={17} />
            Your account is in a <b>soft-disabled</b> state. Some features are limited. Contact your club leader!
          </div>
        )}
        {isDisabled && (
          <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-lg font-medium text-destructive shadow mb-4 w-full text-center">
            Your account is <b>temporarily disabled</b> (credits below {threshold}). Contact your club leader.
            {localUser.suspensionReason && (
              <div className="mt-2 font-bold">Reason: {localUser.suspensionReason}</div>
            )}
          </div>
        )}
        <div className="p-6 w-full rounded-xl bg-white border shadow text-center mb-4">
          <div className="text-lg font-semibold mb-2">Your Current Credits</div>
          <div
            className={
              credits >= threshold
                ? "text-3xl font-bold text-emerald-700"
                : softDisabled
                ? "text-3xl font-bold text-orange-600"
                : "text-3xl font-bold text-red-600"
            }
          >
            {credits}
          </div>
          <div className="mt-2 text-xs font-bold text-muted-foreground">
            <span>
              Status: {statusText} &mdash; Min Threshold: {threshold}
            </span>
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
