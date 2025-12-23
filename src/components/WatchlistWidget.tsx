import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface WatchlistUser {
  id: string;
  name: string;
  email: string;
  credits: number;
  threshold: number;
  avatarUrl?: string;
  status: string;
}

interface WatchlistWidgetProps {
  users: WatchlistUser[];
  onSelectUser?: (userId: string) => void;
}

export function WatchlistWidget({ users, onSelectUser }: WatchlistWidgetProps) {
  // Filter users approaching threshold (within 50% of threshold)
  const atRiskUsers = users
    .filter(u => u.credits < u.threshold * 1.5 && u.status !== "disabled")
    .sort((a, b) => (a.credits / a.threshold) - (b.credits / b.threshold))
    .slice(0, 5);

  const getHealthPercentage = (credits: number, threshold: number) => {
    return Math.min(100, Math.max(0, (credits / (threshold * 2)) * 100));
  };

  const getStatusColor = (credits: number, threshold: number) => {
    const ratio = credits / threshold;
    if (ratio < 1) return "bg-destructive";
    if (ratio < 1.3) return "bg-warning";
    return "bg-success";
  };

  if (atRiskUsers.length === 0) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-bold">Risk Watchlist</h3>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>No members at risk</p>
          <p className="text-xs">All members are above safe threshold levels</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-warning animate-pulse" />
        <h3 className="font-bold">Risk Watchlist</h3>
        <Badge variant="secondary" className="ml-auto">
          {atRiskUsers.length} at risk
        </Badge>
      </div>

      <div className="space-y-4">
        {atRiskUsers.map((user, index) => {
          const healthPct = getHealthPercentage(user.credits, user.threshold);
          const isCritical = user.credits < user.threshold;

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectUser?.(user.id)}
              className={`
                p-3 rounded-lg border cursor-pointer transition-all
                ${isCritical 
                  ? "bg-destructive/10 border-destructive/30 hover:bg-destructive/20" 
                  : "bg-warning/10 border-warning/30 hover:bg-warning/20"
                }
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`} 
                  />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.credits} / {user.threshold} credits
                  </p>
                </div>
                {isCritical && (
                  <Badge variant="destructive" className="text-xs">Critical</Badge>
                )}
              </div>
              
              <div className="space-y-1">
                <Progress 
                  value={healthPct} 
                  className={`h-2 ${getStatusColor(user.credits, user.threshold)}`}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {user.credits < user.threshold 
                    ? `${user.threshold - user.credits} below threshold` 
                    : `${user.credits - user.threshold} above threshold`
                  }
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
