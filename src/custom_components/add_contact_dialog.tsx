"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, UserPlus } from "lucide-react";
import { addContact, searchUsers } from "@/helpers/chat";
import { getErrorMessage } from "@/lib/axios";
import type { SearchResult } from "@/lib/types/models";

interface AddContactDialogProps {
  onAdded: () => void;
}

export function AddContactDialog({ onAdded }: AddContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Debounced search so we aren't firing a request per keystroke.
  useEffect(() => {
    if (!open) return;

    const term = query.trim();
    if (term === "") {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        setResults(await searchUsers(term));
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err, "Search failed"));
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, open]);

  const handleAdd = async (userId: number) => {
    setAddingId(userId);
    try {
      await addContact(userId);
      setResults((prev) => prev.filter((result) => result.id !== userId));
      setQuery("");
      setOpen(false);
      onAdded();
    } catch (err) {
      setError(getErrorMessage(err, "Could not add contact"));
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setQuery("");
          setResults([]);
          setError(null);
        }
      }}
    >
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
          <DialogTitle className="text-xl font-bold">Add New Contact</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 mt-2">
          <Input
            autoFocus
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 text-base transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="mt-2 max-h-64 space-y-1 overflow-y-auto">
          {searching && (
            <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          )}

          {!searching && query.trim() !== "" && results.length === 0 && (
            <p className="p-2 text-sm text-muted-foreground">No users found.</p>
          )}

          {results.map((result) => (
            <div
              key={result.id}
              className="flex items-center gap-3 rounded-md p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Avatar className="h-9 w-9">
                {result.avatar_url && <AvatarImage src={result.avatar_url} alt={result.name} />}
                <AvatarFallback>{result.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{result.name}</div>
                <div className="truncate text-xs text-muted-foreground">{result.email}</div>
              </div>
              <Button
                variant="ghost"
                className="cursor-pointer text-blue-600 hover:bg-blue-100"
                disabled={addingId === result.id}
                onClick={() => handleAdd(result.id)}
              >
                {addingId === result.id ? "Adding..." : "Add"}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
