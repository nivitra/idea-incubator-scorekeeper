
import React from "react";
import UserCreditCard from "./UserCreditCard";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClubDashboardProps {
  user: {
    name: string;
    email: string;
    joinDate?: string;
    avatarUrl?: string;
    credits: number;
    minCredits: number;
  };
  onLogout: () => void;
}

const ClubDashboard: React.FC<ClubDashboardProps> = ({ user, onLogout }) => {
  const isDeactivated = user.credits < user.minCredits;

  return (
    <div className="w-full max-w-4xl mx-auto py-12">
      <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
        <div className="flex items-center gap-4">
          <div className="rounded-full border-2 border-primary/80 p-1 bg-white shadow">
            <img
              src={user.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.email)}`}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-1">{user.name}</h2>
            <div className="text-muted-foreground">{user.email}</div>
          </div>
        </div>
        <Button variant="outline" onClick={onLogout}>Log out</Button>
      </header>

      <main>
        <UserCreditCard credits={user.credits} minCredits={user.minCredits} />
        <Card className="max-w-2xl mx-auto mb-10">
          <CardContent className="py-7 px-5">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Joined At:</span>
              <span>{user.joinDate || "2024-06-15"}</span>
            </div>
            {!isDeactivated ? (
              <div className="mt-4 text-emerald-700 bg-emerald-50 rounded p-3 font-medium">
                You are an active member of <span className="text-primary font-bold">Idea Incubator MGIT</span>!
              </div>
            ) : (
              <div className="mt-4 flex items-center text-destructive bg-destructive/10 rounded p-3 font-bold gap-2">
                <AlertCircle size={17} className="mr-1" />
                Your account is deactivated. Please contact the club admin to reactivate.
              </div>
            )}
          </CardContent>
        </Card>
        {/* Add more dashboard widgets/info here */}
      </main>
    </div>
  );
};

export default ClubDashboard;
