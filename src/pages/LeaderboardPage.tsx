import React from "react";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, Trophy, TrendingUp, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
  const { users } = useApp();

  // Sort users by credits
  const rankedUsers = [...users]
    .filter(u => u.approvalState === "approved")
    .sort((a, b) => b.credits - a.credits);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="w-6 text-center font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "rank-1";
      case 2:
        return "rank-2";
      case 3:
        return "rank-3";
      default:
        return "";
    }
  };

  // Top 3 for podium
  const topThree = rankedUsers.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="h-8 w-8 text-primary" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground">Top performers in the community</p>
      </div>

      {/* Podium for Top 3 */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        {/* 2nd Place */}
        {topThree[1] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-1"
          >
            <Card className="glass-card text-center pt-8">
              <CardContent>
                <div className="relative mx-auto w-16 h-16 mb-4">
                  <img
                    src={topThree[1].avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${topThree[1].email}`}
                    alt={topThree[1].name}
                    className="w-full h-full rounded-full border-4 border-gray-400"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-gray-400 rounded-full p-1">
                    <Medal className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className="font-bold truncate">{topThree[1].name}</p>
                <p className="text-2xl font-display font-bold text-gray-400">
                  {topThree[1].credits}
                </p>
                <p className="text-xs text-muted-foreground">credits</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="order-2 -mt-4"
          >
            <Card className="glass-card text-center pt-8 neon-border glow-primary">
              <CardContent>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Crown className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="relative mx-auto w-20 h-20 mb-4">
                  <img
                    src={topThree[0].avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${topThree[0].email}`}
                    alt={topThree[0].name}
                    className="w-full h-full rounded-full border-4 border-yellow-500"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-yellow-500 rounded-full p-1.5">
                    <Crown className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className="font-bold truncate">{topThree[0].name}</p>
                <p className="text-3xl font-display font-bold text-primary">
                  {topThree[0].credits}
                </p>
                <p className="text-xs text-muted-foreground">credits</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="order-3"
          >
            <Card className="glass-card text-center pt-8">
              <CardContent>
                <div className="relative mx-auto w-16 h-16 mb-4">
                  <img
                    src={topThree[2].avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${topThree[2].email}`}
                    alt={topThree[2].name}
                    className="w-full h-full rounded-full border-4 border-amber-600"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-amber-600 rounded-full p-1">
                    <Medal className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className="font-bold truncate">{topThree[2].name}</p>
                <p className="text-2xl font-display font-bold text-amber-600">
                  {topThree[2].credits}
                </p>
                <p className="text-xs text-muted-foreground">credits</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Full Leaderboard */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            All Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {rankedUsers.map((user, index) => {
              const rank = index + 1;
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn("leaderboard-row", getRankClass(rank))}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-8 flex justify-center">
                      {getRankIcon(rank)}
                    </div>
                    <img
                      src={user.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`}
                      alt={user.name}
                      className="h-10 w-10 rounded-full border-2 border-muted"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={user.status === "active" ? "default" : "secondary"}
                      className={cn(
                        user.status === "active" && "bg-success/20 text-success",
                        user.status === "soft-disabled" && "bg-warning/20 text-warning",
                        user.status === "disabled" && "bg-destructive/20 text-destructive"
                      )}
                    >
                      {user.status}
                    </Badge>
                    <div className="text-right min-w-[80px]">
                      <p className="font-display font-bold text-xl text-primary">
                        {user.credits}
                      </p>
                      <p className="text-xs text-muted-foreground">credits</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
