import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface RecoveryRequestFormProps {
  userId: string;
  userName: string;
  onSubmit: (userId: string, plan: string) => void;
  existingRequest?: { status: "pending" | "approved" | "rejected"; plan: string };
}

export function RecoveryRequestForm({ userId, userName, onSubmit, existingRequest }: RecoveryRequestFormProps) {
  const [plan, setPlan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!plan.trim() || plan.length < 20) {
      toast({
        title: "Plan too short",
        description: "Please describe how you plan to recover credits (at least 20 characters)",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onSubmit(userId, plan);
    setIsSubmitting(false);
    toast({
      title: "Recovery request submitted",
      description: "A leader will review your request shortly.",
    });
  };

  if (existingRequest) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          {existingRequest.status === "pending" && (
            <AlertTriangle className="w-5 h-5 text-warning" />
          )}
          {existingRequest.status === "approved" && (
            <CheckCircle className="w-5 h-5 text-success" />
          )}
          <h3 className="font-bold">Recovery Request Status</h3>
        </div>
        
        <div className={`p-4 rounded-lg mb-4 ${
          existingRequest.status === "pending" ? "bg-warning/10 border border-warning/30" :
          existingRequest.status === "approved" ? "bg-success/10 border border-success/30" :
          "bg-destructive/10 border border-destructive/30"
        }`}>
          <p className="text-sm font-semibold capitalize mb-2">
            Status: {existingRequest.status}
          </p>
          <p className="text-sm text-muted-foreground">{existingRequest.plan}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        <h3 className="font-bold">Submit Recovery Request</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Your account is currently disabled. Submit a recovery plan explaining how you'll earn credits back to regain access.
      </p>

      <Textarea
        placeholder="Describe your plan to recover credits (e.g., attend upcoming events, help organize workshops, etc.)"
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        className="min-h-[120px] mb-4"
        maxLength={500}
      />

      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{plan.length}/500</span>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || plan.length < 20}
          className="gap-2"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </motion.div>
  );
}
