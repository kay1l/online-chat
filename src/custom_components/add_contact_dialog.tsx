"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Search, UserPlus } from "lucide-react";
import { addContact, searchUsers } from "@/helpers/chat";
import { getErrorMessage } from "@/lib/axios";
import type { SearchResult } from "@/lib/types/models";

interface AddContactDialogProps {
  /** Refetch contacts and requests once something changes server-side. */
  onChanged: () => void;
}

export function AddContactDialog({ onChanged }: AddContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

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
      } catch (err) {
        toast.error(getErrorMessage(err, "Search failed"));
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, open]);

  const handleAdd = async (result: SearchResult) => {
    setBusyId(result.id);
    try {
      const { status } = await addContact(result.id);

      // Requesting someone who already asked us connects both sides immediately.
      if (status === "accepted") {
        toast.success(`You and ${result.name} are now connected`);
        setResults((prev) => prev.filter((item) => item.id !== result.id));
      } else {
        toast.success(`Request sent to ${result.name}`);
        setResults((prev) =>
          prev.map((item) =>
            item.id === result.id ? { ...item, request_status: "sent" } : item
          )
        );
      }

      onChanged();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not send that request"));
    } finally {
      setBusyId(null);
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
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer hover:bg-brand-muted"
          aria-label="Add new contact"
        >
          <UserPlus className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a contact</DialogTitle>
          <DialogDescription>
            Search by name or email. They&apos;ll need to accept before you can chat.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Search people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 pl-9"
          />
        </div>

        <div className="min-h-[8rem] max-h-72 overflow-y-auto">
          {searching && results.length === 0 && (
            <div className="space-y-3 py-2">
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-44" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!searching && query.trim() === "" && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Start typing to find people.
            </p>
          )}

          {!searching && query.trim() !== "" && results.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No one matches &ldquo;{query.trim()}&rdquo;.
            </p>
          )}

          <ul className="divide-y">
            {results.map((result) => (
              <li key={result.id} className="flex items-center gap-3 py-2.5">
                <Avatar className="h-9 w-9">
                  {result.avatar_url && (
                    <AvatarImage src={result.avatar_url} alt={result.name} />
                  )}
                  <AvatarFallback>{result.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{result.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{result.email}</p>
                </div>

                {busyId === result.id ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : result.request_status === "sent" ? (
                  <span className="rounded-md px-2 py-1 text-xs text-muted-foreground">
                    Requested
                  </span>
                ) : (
                  <Button
                    size="sm"
                    className="cursor-pointer bg-brand text-brand-foreground hover:bg-brand/90"
                    onClick={() => handleAdd(result)}
                  >
                    {result.request_status === "incoming" ? "Accept" : "Add"}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
