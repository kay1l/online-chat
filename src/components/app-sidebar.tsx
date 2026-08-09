"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { AddContactDialog } from "@/custom_components/add_contact_dialog";
import { cn } from "@/lib/utils";
import { listTime } from "@/lib/format";
import type { Contact } from "@/lib/types/models";

interface SidebarProps {
  contacts: Contact[];
  loading: boolean;
  activeContactId: number | null;
  onSelectChat: (id: number) => void;
  onContactAdded: () => void;
  /** Drawer state on small screens; the navbar owns the trigger. */
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({
  contacts,
  loading,
  activeContactId,
  onSelectChat,
  onContactAdded,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const [filter, setFilter] = useState("");

  const visibleContacts = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return contacts;
    return contacts.filter((contact) => contact.name.toLowerCase().includes(term));
  }, [contacts, filter]);

  const content = (
    <>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Chats
        </h2>
        <AddContactDialog onChanged={onContactAdded} />
      </div>

      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search chats..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-10 pl-9 text-sm"
        />
      </div>

      <nav className="-mx-1 flex-1 space-y-0.5 overflow-y-auto px-1">
        {loading ? (
          <div className="space-y-3 p-2">
            {[0, 1, 2, 3, 4].map((row) => (
              <div key={row} className="flex items-center gap-3">
                <Skeleton className="h-11 w-11 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            ))}
          </div>
        ) : visibleContacts.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-muted-foreground">
            {contacts.length === 0
              ? "No contacts yet. Use the + button to find people."
              : "No chats match that search."}
          </p>
        ) : (
          visibleContacts.map((contact) => {
            const active = activeContactId === contact.id;

            return (
              <button
                key={contact.id}
                type="button"
                onClick={() => {
                  onSelectChat(contact.id);
                  onMobileClose();
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors",
                  active ? "bg-brand-muted" : "hover:bg-accent"
                )}
              >
                <div className="relative shrink-0">
                  <Avatar className="h-11 w-11">
                    {contact.avatar_url && (
                      <AvatarImage src={contact.avatar_url} alt={contact.name} />
                    )}
                    <AvatarFallback>{contact.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {contact.is_online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-success" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={cn(
                        "truncate text-sm",
                        contact.unread_count > 0 ? "font-semibold" : "font-medium"
                      )}
                    >
                      {contact.name}
                    </span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {listTime(contact.last_message_at)}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span
                      className={cn(
                        "flex-1 truncate text-xs",
                        contact.unread_count > 0
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {contact.last_message ?? "No messages yet"}
                    </span>
                    {contact.unread_count > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-semibold text-brand-foreground">
                        {contact.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-72 flex-col border-r bg-sidebar p-4 md:flex">{content}</aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={onMobileClose}
          />
          <aside className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r bg-sidebar p-4 md:hidden">
            <button
              type="button"
              className="absolute right-3 top-3 cursor-pointer text-muted-foreground"
              onClick={onMobileClose}
              aria-label="Close chats"
            >
              <X className="h-5 w-5" />
            </button>
            {content}
          </aside>
        </>
      )}
    </>
  );
}
