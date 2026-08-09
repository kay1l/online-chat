"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bell, Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { acceptContactRequest, declineContactRequest } from "@/helpers/chat";
import { getErrorMessage } from "@/lib/axios";
import { relativeTime } from "@/lib/format";
import type { ContactRequest } from "@/lib/types/models";

interface NotificationBellProps {
  requests: ContactRequest[];
  /** Refetch requests and contacts after a request is answered. */
  onAnswered: () => void;
}

export function NotificationBell({ requests, onAnswered }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const answer = async (request: ContactRequest, accept: boolean) => {
    setBusyId(request.id);
    try {
      if (accept) {
        await acceptContactRequest(request.id);
        toast.success(`You and ${request.user.name} are now connected`);
      } else {
        await declineContactRequest(request.id);
        toast(`Request from ${request.user.name} declined`);
      }
      onAnswered();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not answer that request"));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative cursor-pointer hover:bg-brand-muted"
          aria-label={
            requests.length > 0
              ? `${requests.length} pending contact requests`
              : "No pending contact requests"
          }
        >
          <Bell className="h-5 w-5" />
          {requests.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-brand-foreground">
              {requests.length > 9 ? "9+" : requests.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold">Contact requests</p>
        </div>

        {requests.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            You&apos;re all caught up.
          </p>
        ) : (
          <ul className="max-h-80 divide-y overflow-y-auto">
            {requests.map((request) => (
              <li key={request.id} className="flex items-center gap-3 px-4 py-3">
                <Avatar className="h-9 w-9">
                  {request.user.avatar_url && (
                    <AvatarImage src={request.user.avatar_url} alt={request.user.name} />
                  )}
                  <AvatarFallback>
                    {request.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{request.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {relativeTime(request.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {busyId === request.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <Button
                        size="icon"
                        className="h-8 w-8 cursor-pointer bg-brand text-brand-foreground hover:bg-brand/90"
                        onClick={() => answer(request, true)}
                        aria-label={`Accept request from ${request.user.name}`}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 cursor-pointer text-muted-foreground"
                        onClick={() => answer(request, false)}
                        aria-label={`Decline request from ${request.user.name}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
