import { motion } from "framer-motion";
import { Users, TrendingUp, AlertTriangle, Trophy, Zap, Shield } from "lucide-react";

interface StatsCardsProps {
  totalUsers: number;
  activeUsers: number;
  atRiskUsers: number;
  disabledUsers: number;
  totalCredits: number;
  averageCredits: number;
}

export function StatsCards({ 
  totalUsers, 
  activeUsers, 
  atRiskUsers, 
  disabledUsers,
  totalCredits,
  averageCredits 
}: StatsCardsProps) {
  const stats = [
    {
      label: "Total Members",
      value: totalUsers,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Active",
      value: activeUsers,
      icon: Shield,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "At Risk",
      value: atRiskUsers,
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Disabled",
      value: disabledUsers,
      icon: Zap,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Total Credits",
      value: totalCredits,
      icon: Trophy,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Avg Credits",
      value: Math.round(averageCredits),
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="stat-card"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <motion.p
                className="text-2xl font-display font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
              >
                {stat.value}
              </motion.p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
