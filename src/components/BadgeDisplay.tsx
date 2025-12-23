import { motion } from "framer-motion";
import { BADGES, BadgeId, getRarityColor } from "@/lib/badges";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface BadgeDisplayProps {
  badges: BadgeId[];
  size?: "sm" | "md" | "lg";
  showAll?: boolean;
}

export function BadgeDisplay({ badges, size = "md", showAll = false }: BadgeDisplayProps) {
  const displayBadges = showAll ? Object.keys(BADGES) as BadgeId[] : badges;
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const iconSizes = {
    sm: 14,
    md: 20,
    lg: 28,
  };

  return (
    <div className="flex flex-wrap gap-2">
      {displayBadges.map((badgeId, index) => {
        const badge = BADGES[badgeId];
        const isEarned = badges.includes(badgeId);

        return (
          <Tooltip key={badgeId}>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                className={`
                  ${sizeClasses[size]} 
                  ${isEarned ? getRarityColor(badge.rarity) : "bg-muted/30 border-muted"} 
                  ${isEarned ? "" : "opacity-40 grayscale"}
                  rounded-full border-2 flex items-center justify-center
                  transition-all duration-300 hover:scale-110 cursor-pointer
                  ${isEarned && badge.rarity === "legendary" ? "animate-pulse-glow" : ""}
                `}
              >
                <badge.icon 
                  size={iconSizes[size]} 
                  className={isEarned ? badge.color : "text-muted-foreground"} 
                />
              </motion.div>
            </TooltipTrigger>
            <TooltipContent className="glass-card">
              <div className="text-center">
                <p className="font-bold">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
                <p className={`text-xs font-semibold capitalize ${
                  badge.rarity === "legendary" ? "text-yellow-500" :
                  badge.rarity === "epic" ? "text-purple-500" :
                  badge.rarity === "rare" ? "text-blue-500" :
                  "text-muted-foreground"
                }`}>
                  {badge.rarity}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
