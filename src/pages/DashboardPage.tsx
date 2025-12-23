import React from "react";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown,
  Zap,
  Calendar,
  Award,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import BadgeDisplay from "@/components/BadgeDisplay";
import { getUserBadges } from "@/lib/badges";

export default function DashboardPage() {
  const { currentUser, globalThreshold, warnBuffer } = useApp();

  if (!currentUser) return null;

  const credits = currentUser.credits;
  const threshold = currentUser.minThreshold ?? globalThreshold;
  const progressPercent = Math.min(Math.max((credits / threshold) * 100, 0), 150);

  const getStatusConfig = () => {
    if (credits < 0) {
      return {
        label: "Disabled",
        color: "status-disabled",
        icon: AlertTriangle,
        message: "Your account is disabled. Contact a leader to restore access.",
        glow: "glow-destructive",
      };
    }
    if (credits < threshold) {
      return {
        label: "Soft Disabled",
        color: "status-soft-disabled",
        icon: AlertTriangle,
        message: "Warning: Your credits are below the minimum threshold.",
        glow: "glow-warning",
      };
    }
    return {
      label: "Active",
      color: "status-active",
      icon: Zap,
      message: "You're in good standing! Keep earning credits.",
      glow: "glow-success",
    };
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  // Calculate recent trend
  const recentTransactions = currentUser.history.slice(0, 5);
  const recentTotal = recentTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Get earned badges
  const earnedBadges = getUserBadges({
    ...currentUser,
    totalCredits: credits,
    recoveryCount: currentUser.history.filter(h => h.reason.includes("Recovery")).length,
    activityDays: 30,
    topRank: false,
    referralCount: 0,
    eventCount: currentUser.history.filter(h => h.reason.toLowerCase().includes("event")).length,
    streakDays: 7,
    perfectMonth: false,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold"
          >
            Welcome back, {currentUser.name.split(" ")[0]}
          </motion.h1>
          <p className="text-muted-foreground">
            Here's your credit overview
          </p>
        </div>
        <Badge className={cn("px-4 py-2 text-sm", status.color)}>
          <StatusIcon className="h-4 w-4 mr-2" />
          {status.label}
        </Badge>
      </div>

      {/* Main Credit Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className={cn("glass-card overflow-hidden", status.glow)}>
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Credit Display */}
              <div className="text-center lg:text-left flex-1">
                <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">
                  Credit Balance
                </p>
                <div className="credit-display text-6xl lg:text-7xl text-primary">
                  {credits}
                </div>
                <div className="flex items-center gap-2 mt-4 justify-center lg:justify-start">
                  {recentTotal >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-success" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                  <span className={cn(
                    "font-medium",
                    recentTotal >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {recentTotal >= 0 ? "+" : ""}{recentTotal} this week
                  </span>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="relative">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="12"
                  />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={440}
                    initial={{ strokeDashoffset: 440 }}
                    animate={{ strokeDashoffset: 440 - (440 * Math.min(progressPercent, 100)) / 100 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{Math.round(progressPercent)}%</span>
                  <span className="text-xs text-muted-foreground">of threshold</span>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className={cn(
              "mt-6 p-4 rounded-lg border text-sm",
              status.color
            )}>
              <StatusIcon className="h-4 w-4 inline mr-2" />
              {status.message}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="stat-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Member Since
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {new Date(currentUser.joinDate).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="stat-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{currentUser.history.length}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="stat-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award className="h-4 w-4" />
                Badges Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{earnedBadges.length}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Badges Section */}
      {earnedBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BadgeDisplay badges={earnedBadges} />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentUser.history.slice(0, 10).map((tx, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm",
                      tx.amount > 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                    )}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tx.reason}</p>
                      <p className="text-xs text-muted-foreground">by {tx.by}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(tx.ts).toLocaleDateString()}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
