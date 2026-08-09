"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { updateProfile } from "@/helpers/auth";
import { getErrorMessage } from "@/lib/axios";
import type { User } from "@/lib/types/models";

interface EditProfileDialogProps {
  user: User;
  onSaved: (user: User) => void;
  /** Trigger element. Omit when driving the dialog with `open`/`onOpenChange`. */
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const FALLBACK_AVATAR = "/images/avatar.jpeg";

export function EditProfileDialog({
  user,
  onSaved,
  children,
  open: controlledOpen,
  onOpenChange,
}: EditProfileDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  // Controlled when a parent passes `open`, self-managed otherwise.
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar_url ?? FALLBACK_AVATAR);
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset to the current profile whenever the dialog is (re)opened.
  useEffect(() => {
    if (!open) return;
    setName(user.name);
    setEmail(user.email);
    setAvatarPreview(user.avatar_url ?? FALLBACK_AVATAR);
    setAvatarFile(undefined);
    setError(null);
  }, [open, user]);

  // Object URLs for the local preview have to be released manually.
  useEffect(() => {
    if (!avatarFile) return;
    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarFile(file);
  };

  const handleSave = async () => {
    if (name.trim() === "" || email.trim() === "") {
      setError("Name and email are required");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateProfile({
        name: name.trim(),
        email: email.trim(),
        avatar: avatarFile,
      });
      onSaved(updated);
      setOpen(false);
    } catch (err) {
      setError(getErrorMessage(err, "Could not save profile"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="sm:max-w-sm rounded-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-3 mt-2">
          <div
            className="relative cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {/* Plain <img>: the source is a blob: URL or an API-hosted file. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarPreview}
              alt="Avatar preview"
              className="h-28 w-28 rounded-full object-cover border"
            />
            <span className="absolute bottom-0 right-0 rounded-full bg-brand p-1">
              <Pencil className="h-3 w-3 text-white" />
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleAvatarChange}
          />
        </div>

        {error && <p className="text-center text-sm text-destructive">{error}</p>}

        <div className="space-y-2 mt-4">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 text-base"
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 text-base"
          />
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2 border-t pt-3">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="w-24 rounded-md hover:bg-accent cursor-pointer"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="ghost"
            className="w-24 rounded-md text-brand hover:bg-accent cursor-pointer"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
