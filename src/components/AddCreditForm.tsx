
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

type User = {
  id: string;
  name: string;
  credits: number;
  status: string;
};

interface Props {
  user: User;
  currentLeaderName: string;
  minCredits: number;
  onCreditUpdate: ({
    userId,
    amount,
    reason,
    issuer,
  }: {
    userId: string;
    amount: number;
    reason: string;
    issuer: string;
  }) => void;
}

const AddCreditForm: React.FC<Props> = ({ user, currentLeaderName, minCredits, onCreditUpdate }) => {
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = (type: "add" | "subtract") => {
    if (!amount || !reason) return;
    setLoading(true);
    setTimeout(() => {
      onCreditUpdate({
        userId: user.id,
        amount: type === "add" ? amount : -amount,
        reason,
        issuer: currentLeaderName,
      });
      setAmount(0);
      setReason("");
      setLoading(false);
    }, 450);
  };

  return (
    <div className="p-4 border rounded-xl bg-muted mb-2">
      <div className="font-semibold mb-2">Manage Credits</div>
      <div className="flex gap-3 mb-3 items-center">
        <input
          type="number"
          min={1}
          max={100}
          placeholder="Amount"
          className="border px-2 py-1 rounded w-20"
          value={amount ? amount : ""}
          onChange={(e) => setAmount(Number(e.target.value))}
          disabled={loading}
        />
        <input
          type="text"
          maxLength={80}
          placeholder="Reason"
          className="border px-2 py-1 rounded grow"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={loading}
        />
        <Button
          size="sm"
          disabled={loading || !amount || !reason}
          onClick={() => handleUpdate("add")}
        >
          Add
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={loading || !amount || !reason}
          onClick={() => handleUpdate("subtract")}
        >
          Subtract
        </Button>
      </div>
    </div>
  );
};

export default AddCreditForm;
