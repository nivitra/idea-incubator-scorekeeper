import { Trophy, Star, Zap, Shield, Award, Flame, Crown, Target, Rocket, Heart } from "lucide-react";

export type BadgeId = 
  | "early_adopter"
  | "first_credit"
  | "credit_champion"
  | "consistent_contributor"
  | "crisis_survivor"
  | "top_earner"
  | "helping_hand"
  | "perfect_attendance"
  | "rising_star"
  | "legend";

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: typeof Trophy;
  color: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const BADGES: Record<BadgeId, Badge> = {
  early_adopter: {
    id: "early_adopter",
    name: "Early Adopter",
    description: "Joined the club in its first month",
    icon: Rocket,
    color: "text-blue-500",
    rarity: "rare",
  },
  first_credit: {
    id: "first_credit",
    name: "First Steps",
    description: "Earned your first credit",
    icon: Star,
    color: "text-yellow-500",
    rarity: "common",
  },
  credit_champion: {
    id: "credit_champion",
    name: "Credit Champion",
    description: "Accumulated 50+ credits",
    icon: Trophy,
    color: "text-amber-500",
    rarity: "epic",
  },
  consistent_contributor: {
    id: "consistent_contributor",
    name: "Consistent Contributor",
    description: "Earned credits 5 times in a row",
    icon: Target,
    color: "text-green-500",
    rarity: "rare",
  },
  crisis_survivor: {
    id: "crisis_survivor",
    name: "Crisis Survivor",
    description: "Recovered from disabled status",
    icon: Shield,
    color: "text-red-500",
    rarity: "epic",
  },
  top_earner: {
    id: "top_earner",
    name: "Top Earner",
    description: "Ranked #1 on the leaderboard",
    icon: Crown,
    color: "text-yellow-400",
    rarity: "legendary",
  },
  helping_hand: {
    id: "helping_hand",
    name: "Helping Hand",
    description: "Helped organize 3+ events",
    icon: Heart,
    color: "text-pink-500",
    rarity: "rare",
  },
  perfect_attendance: {
    id: "perfect_attendance",
    name: "Perfect Attendance",
    description: "Attended all events in a month",
    icon: Award,
    color: "text-purple-500",
    rarity: "epic",
  },
  rising_star: {
    id: "rising_star",
    name: "Rising Star",
    description: "Gained 20+ credits in one month",
    icon: Zap,
    color: "text-cyan-500",
    rarity: "rare",
  },
  legend: {
    id: "legend",
    name: "Legend",
    description: "100+ total credits earned",
    icon: Flame,
    color: "text-orange-500",
    rarity: "legendary",
  },
};

export function getRarityColor(rarity: Badge["rarity"]): string {
  switch (rarity) {
    case "common": return "bg-muted border-muted-foreground/20";
    case "rare": return "bg-blue-500/10 border-blue-500/30";
    case "epic": return "bg-purple-500/10 border-purple-500/30";
    case "legendary": return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50";
  }
}

export function calculateBadges(user: {
  credits: number;
  history: { amount: number; ts: string }[];
  joinDate: string;
  status: string;
  recoveryLogs?: { action: string }[];
}): BadgeId[] {
  const badges: BadgeId[] = [];

  // Early adopter - joined before 2024
  const joinYear = new Date(user.joinDate).getFullYear();
  if (joinYear <= 2023) {
    badges.push("early_adopter");
  }

  // First credit - has at least one positive credit in history
  if (user.history.some(h => h.amount > 0)) {
    badges.push("first_credit");
  }

  // Credit champion - 50+ credits
  if (user.credits >= 50) {
    badges.push("credit_champion");
  }

  // Crisis survivor - recovered from disabled
  if (user.recoveryLogs?.some(l => l.action === "above-threshold")) {
    badges.push("crisis_survivor");
  }

  // Rising star - 20+ in history
  const totalEarned = user.history
    .filter(h => h.amount > 0)
    .reduce((sum, h) => sum + h.amount, 0);
  if (totalEarned >= 20) {
    badges.push("rising_star");
  }

  // Legend - 100+ total
  if (totalEarned >= 100) {
    badges.push("legend");
  }

  return badges;
}
