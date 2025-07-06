"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface AddContactDialogProps {
  onAdd: (name: string) => void;
}

export function AddContactDialog({ onAdd }: AddContactDialogProps) {
  const [newContactName, setNewContactName] = useState("");

  const handleAddContact = () => {
    if (newContactName.trim() === "") return;
    onAdd(newContactName.trim());
    setNewContactName("");
    // Optionally close the dialog (you can control this with a state if desired)
    // or let parent handle re-render
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-blue-100 cursor-pointer dark:hover:bg-blue-900/30"
        >
          <UserPlus className="h-6 w-6" />
          <span className="sr-only">Add New Contact</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm rounded-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold">
            Add New Contact
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 mt-2">
          <Input
            placeholder="Contact username"
            value={newContactName}
            onChange={(e) => setNewContactName(e.target.value)}
            className="h-15 text-base transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2 border-t pt-3">
          <Button
            variant="ghost"
            className="w-24 cursor-pointer rounded-md hover:bg-blue-200 dark:hover:bg-gray-800"
            onClick={() => setNewContactName("")}
          >
            Cancel
          </Button>
          <Button
            variant="ghost"
            className="w-24 rounded-md text-black hover:bg-blue-200 cursor-pointer"
            onClick={handleAddContact}
          >
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
