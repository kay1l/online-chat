"use client";

import { useState, useRef } from "react";
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

interface EditProfileDialogProps {
  initialUsername: string;
  initialEmail: string;
  initialAvatar?: string;
  onSave: (data: {
    username: string;
    email: string;
    avatarFile?: File;
  }) => void;
  children: React.ReactNode;
}

export function EditProfileDialog({
  initialUsername,
  initialEmail,
  initialAvatar,
  onSave,
  children,
}: EditProfileDialogProps) {
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [avatarPreview, setAvatarPreview] = useState(
    initialAvatar || "/images/default-avatar.png"
  );
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    if (username.trim() === "" || email.trim() === "") return;
    onSave({ username: username.trim(), email: email.trim(), avatarFile });
  };

  const handleCancel = () => {
    setUsername(initialUsername);
    setEmail(initialEmail);
    setAvatarPreview(initialAvatar || "/images/default-avatar.png");
    setAvatarFile(undefined);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-sm rounded-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-3 mt-2">
          <div
            className="relative cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="h-30 w-30 rounded-full object-cover border"
            />
            <span className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-1">
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

        <div className="space-y-2 mt-4">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-10 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2 border-t pt-3">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="w-24 rounded-md hover:bg-blue-200 dark:hover:bg-gray-800 cursor-pointer"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="ghost"
            className="w-24 rounded-md text-black hover:bg-blue-200 cursor-pointer"
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
