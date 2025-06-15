import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image, Images } from "lucide-react";
import { Label } from "@/components/ui/label";

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    position?: string;
  };
  onUpdate: (updated: { name: string; avatarUrl?: string; position?: string }) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ open, onClose, user, onUpdate }) => {
  const [name, setName] = useState(user.name || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [position, setPosition] = useState(user.position || "");
  const [saving, setSaving] = useState(false);
  const [avatarFileUrl, setAvatarFileUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setName(user.name || "");
    setAvatarUrl(user.avatarUrl || "");
    setPosition(user.position || "");
    setAvatarFileUrl(undefined);
  }, [user, open]);

  // When both avatarUrl and a selected file are present, show the file first to avoid confusion
  const avatarPreviewUrl =
    avatarFileUrl 
      ? avatarFileUrl
      : avatarUrl 
        ? avatarUrl 
        : `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.email)}`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setAvatarFileUrl(url);
      setAvatarUrl(""); // clear URL input since the file takes precedence
    }
  };

  const handleImageGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      // If the user picked a local file, keep its object url in avatarUrl for now (simulate media upload)
      onUpdate({ 
        name: name.trim() || "Student", 
        avatarUrl: avatarFileUrl || avatarUrl.trim(), 
        position: position.trim(),
      });
      setSaving(false);
      onClose();
    }, 350);
  };

  return (
    <Dialog open={open} onOpenChange={v => !saving && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your visible profile details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2 items-center">
            <div className="relative mb-2 group">
              <img
                src={avatarPreviewUrl}
                alt={name}
                className="w-16 h-16 rounded-full border object-cover bg-white"
              />
              <label
                htmlFor="avatar-url"
                className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer"
                title="Edit avatar url"
                style={{ lineHeight: 0 }}>
                <Image size={16} />
              </label>
              <button
                type="button"
                className="absolute bottom-0 left-0 bg-background border border-gray-200 text-gray-600 rounded-full p-1 cursor-pointer shadow transition hover:bg-blue-100"
                title="Add from gallery"
                onClick={handleImageGalleryClick}
                tabIndex={-1}
                style={{ lineHeight: 0 }}
              >
                <Images size={16} />
              </button>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
            <Input
              id="avatar-url"
              placeholder="Avatar URL (optional)"
              className="w-full"
              value={avatarUrl}
              onChange={e => {
                setAvatarUrl(e.target.value);
                setAvatarFileUrl(undefined); // clear file image if a url is entered
              }}
              autoComplete="off"
              maxLength={250}
              disabled={saving}
            />
            <div className="flex w-full justify-between">
              <span className="text-xs text-muted-foreground">Paste image URL, or use gallery <Images size={13} className="inline" /></span>
              {avatarFileUrl && (
                <button
                  type="button"
                  className="text-xs text-blue-600 underline ml-2"
                  onClick={() => setAvatarFileUrl(undefined)}
                  tabIndex={-1}
                >
                  Remove selected photo
                </button>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="name-input">Name</Label>
            <Input
              id="name-input"
              placeholder="Your Name"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={60}
              required
              disabled={saving}
            />
          </div>
          <div>
            <Label htmlFor="position-input">Position/Title</Label>
            <Input
              id="position-input"
              placeholder="e.g. President, Member"
              value={position}
              onChange={e => setPosition(e.target.value)}
              maxLength={60}
              disabled={saving}
            />
          </div>
          <div>
            <Label htmlFor="email-input">Email</Label>
            <Input
              id="email-input"
              value={user.email}
              disabled
              className="bg-gray-100"
            />
          </div>
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
