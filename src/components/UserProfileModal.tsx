
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { user as UserIcon, image as ImageIcon } from "lucide-react";

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onUpdate: (updated: { name: string; avatarUrl?: string }) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ open, onClose, user, onUpdate }) => {
  const [name, setName] = useState(user.name || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setName(user.name || "");
    setAvatarUrl(user.avatarUrl || "");
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      onUpdate({ name: name.trim() || "Student", avatarUrl: avatarUrl.trim() });
      setSaving(false);
      onClose();
    }, 350);
  };

  return (
    <Dialog open={open} onOpenChange={v => !saving && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2 items-center">
            <div className="relative mb-2">
              <img
                src={avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.email)}`}
                alt={name}
                className="w-16 h-16 rounded-full border object-cover bg-white"
              />
              <label
                htmlFor="avatar-url"
                className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer"
                title="Change avatar url"
                style={{ lineHeight: 0 }}>
                <ImageIcon size={16} />
              </label>
            </div>
            <Input
              id="avatar-url"
              placeholder="Avatar URL (optional)"
              className="w-full"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              autoComplete="off"
              maxLength={250}
              disabled={saving}
            />
          </div>
          <Input
            label="Name"
            placeholder="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={60}
            required
            disabled={saving}
          />
          <Input
            label="Email"
            value={user.email}
            disabled
            className="bg-gray-100"
          />
          <DialogFooter className="gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !name}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
