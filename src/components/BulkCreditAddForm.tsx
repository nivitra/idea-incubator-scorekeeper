
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type User = {
  id: string;
  name: string;
  email: string;
  credits: number;
  status: string;
  role: string;
  avatarUrl: string;
};

interface BulkCreditAddFormProps {
  open: boolean;
  onClose: () => void;
  users: User[];
  onBulkCreditUpdate: ({
    userIds,
    amount,
    reason,
    issuer,
  }: {
    userIds: string[];
    amount: number;
    reason: string;
    issuer: string;
  }) => void;
  leader: User;
}

const BulkCreditAddForm: React.FC<BulkCreditAddFormProps> = ({
  open,
  onClose,
  users,
  onBulkCreditUpdate,
  leader,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((uid) => uid !== id)
        : [...prev, id]
    );
  };

  const handleAll = () => {
    const allIds = users.filter(u => u.role !== "leader").map(u => u.id);
    setSelected(
      selected.length === allIds.length ? [] : allIds
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount === 0 || !reason || selected.length === 0) return;
    setSubmitting(true);
    onBulkCreditUpdate({
      userIds: selected,
      amount,
      reason,
      issuer: leader.name,
    });
    toast({
      title: "Bulk credit updated",
      description: `Added ${amount > 0 ? "+" : ""}${amount} to ${selected.length} users.`,
    });
    setTimeout(() => {
      setSelected([]);
      setAmount(0);
      setReason("");
      setSubmitting(false);
      onClose();
    }, 350);
  };

  React.useEffect(() => {
    if (open) {
      setSelected([]);
      setAmount(0);
      setReason("");
      setSubmitting(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Bulk Credit Add</DialogTitle>
          <DialogDescription>
            Select club members and add (or deduct) credits for all at once.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="font-semibold text-sm mb-2 block">Members</label>
            <div className="max-h-44 overflow-y-auto border rounded p-2 space-y-1 bg-muted/50">
              <div>
                <button
                  type="button"
                  onClick={handleAll}
                  className="text-xs text-blue-600 underline mb-1"
                >
                  {selected.length === users.filter(u => u.role !== "leader").length ? "Deselect All" : "Select All"}
                </button>
              </div>
              {users
                .filter((u) => u.role !== "leader")
                .map((u) => (
                  <label key={u.id} className="flex items-center cursor-pointer gap-2 p-1 hover:bg-white/60 rounded">
                    <input
                      type="checkbox"
                      checked={selected.includes(u.id)}
                      onChange={() => toggleSelect(u.id)}
                      className="accent-blue-500"
                    />
                    <img
                      src={
                        u.avatarUrl ||
                        `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(u.email)}`
                      }
                      alt={u.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-sm">{u.name}</span>
                    <span className="text-xs text-muted-foreground ml-1">{u.email}</span>
                    <span className="ml-auto text-xs text-slate-500">Credits: {u.credits}</span>
                  </label>
                ))}
              {users.filter((u) => u.role !== "leader").length === 0 && (
                <div className="text-xs text-muted-foreground italic">No members.</div>
              )}
            </div>
          </div>

          <div className="mb-3 flex gap-2">
            <div className="flex-1">
              <label className="font-semibold text-sm mb-1 block">Amount</label>
              <input
                type="number"
                value={amount}
                min={-100}
                max={100}
                step={1}
                onChange={e => setAmount(Number(e.target.value))}
                className="border rounded px-2 py-1 w-full"
                placeholder="e.g. 5"
              />
            </div>
            <div className="flex-1">
              <label className="font-semibold text-sm mb-1 block">Reason</label>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="border rounded px-2 py-1 w-full"
                placeholder="Participation, event, etc."
                maxLength={80}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={selected.length === 0 || !reason || amount === 0 || submitting}
              className="w-full"
            >
              Add Credits to Selected
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BulkCreditAddForm;

