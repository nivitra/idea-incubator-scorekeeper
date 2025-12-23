import { motion } from "framer-motion";
import { Trophy, Medal, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  credits: number;
  avatarUrl?: string;
  position?: string;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
  currentUserId?: string;
  title?: string;
  limit?: number;
}

export function Leaderboard({ users, currentUserId, title = "Leaderboard", limit = 10 }: LeaderboardProps) {
  const sortedUsers = [...users]
    .sort((a, b) => b.credits - a.credits)
    .slice(0, limit);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 text-center text-muted-foreground font-mono">{rank}</span>;
  };

  const getRankClass = (rank: number) => {
    if (rank === 1) return "leaderboard-row rank-1";
    if (rank === 2) return "leaderboard-row rank-2";
    if (rank === 3) return "leaderboard-row rank-3";
    return "leaderboard-row";
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold">{title}</h3>
      </div>

      <div className="space-y-2">
        {sortedUsers.map((user, index) => {
          const rank = index + 1;
          const isCurrentUser = user.id === currentUserId;

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`${getRankClass(rank)} ${isCurrentUser ? "ring-2 ring-primary" : ""}`}
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(rank)}
              </div>
              
              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarImage 
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.email)}`} 
                  alt={user.name} 
                />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {user.name}
                  {isCurrentUser && (
                    <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                  )}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.position || "Member"}</p>
              </div>

              <div className="text-right">
                <motion.p 
                  className="font-display font-bold text-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
                >
                  {user.credits}
                </motion.p>
                <p className="text-xs text-muted-foreground">credits</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {users.length > limit && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          +{users.length - limit} more members
        </p>
      )}
    </div>
  );
}
