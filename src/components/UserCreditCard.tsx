
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ShieldX } from "lucide-react";

interface UserCreditCardProps {
  credits: number;
  minCredits: number;
}

const UserCreditCard: React.FC<UserCreditCardProps> = ({
  credits,
  minCredits,
}) => {
  const isLow = credits < minCredits;
  const creditPercent = Math.min((credits / minCredits) * 100, 100);

  return (
    <div className="rounded-xl bg-card p-6 shadow md:flex items-center gap-8 mb-8 border max-w-2xl mx-auto">
      <div className="flex flex-col grow">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-medium text-lg">Your Credits</span>
          {isLow ? (
            <Badge variant="destructive" className="flex gap-1 items-center">
              <ShieldX size={16} />
              <span>In Danger!</span>
            </Badge>
          ) : (
            <Badge className="bg-emerald-500/20 text-emerald-600">
              All Good
            </Badge>
          )}
        </div>
        <div className="flex items-end gap-2">
          <span className={`text-4xl font-extrabold ${isLow ? "text-red-600" : "text-emerald-700"}`}>
            {credits}
          </span>
          <span className="text-md text-muted-foreground pb-1">credits</span>
        </div>
        <Progress value={creditPercent} className="h-3 mt-4 bg-muted" />
        <div className="text-xs text-muted-foreground mt-2">
          {isLow ? (
            <>
              <AlertCircle size={14} className="inline mr-1 text-destructive align-text-bottom" />
              You need at least {minCredits} credits to stay active.
            </>
          ) : (
            <>
              Minimum required: {minCredits} credits.
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCreditCard;
