"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { LogOut, Menu, Pencil, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { AddContactDialog } from "@/custom_components/add_contact_dialog";
import { EditProfileDialog } from "@/custom_components/edit_profile_dialog";
import { NotificationBell } from "@/custom_components/notification_bell";
import { ThemeToggle } from "@/custom_components/theme_toggle";
import { cn } from "@/lib/utils";
import { listTime } from "@/lib/format";
import { logout } from "@/helpers/auth";
import { useAuth } from "@/custom_components/app_wrapper";
import type { Contact, ContactRequest, User } from "@/lib/types/models";

interface SidebarProps {
  className?: string;
  contacts: Contact[];
  requests: ContactRequest[];
  loading: boolean;
  activeContactId: number | null;
  onSelectChat: (id: number) => void;
  onDataChanged: () => void;
}

export function Sidebar({
  className,
  contacts,
  requests,
  loading,
  activeContactId,
  onSelectChat,
  onDataChanged,
}: SidebarProps) {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const visibleContacts = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return contacts;
    return contacts.filter((contact) => contact.name.toLowerCase().includes(term));
  }, [contacts, filter]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    toast.success("Signed out");
    router.push("/");
  };

  const handleProfileSaved = (updated: User) => {
    setUser(updated);
    toast.success("Profile updated");
  };

  const SidebarContent = (
    <>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/images/icon.jpeg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-md object-contain"
          />
          <span className="text-lg font-semibold tracking-tight">NexChat</span>
        </div>
        <div className="flex items-center gap-0.5">
          <NotificationBell requests={requests} onAnswered={onDataChanged} />
          <AddContactDialog onChanged={onDataChanged} />
          <ThemeToggle />
        </div>
      </div>

      {user && (
        <EditProfileDialog user={user} onSaved={handleProfileSaved}>
          <button
            type="button"
            className="mb-4 flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent cursor-pointer"
          >
            <Avatar className="h-10 w-10">
              {user.avatar_url && <AvatarImage src={user.avatar_url} alt={user.name} />}
              <AvatarFallback className="bg-brand text-brand-foreground">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">Edit profile</div>
            </div>
            <Pencil className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </EditProfileDialog>
      )}

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
                  setMobileOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors cursor-pointer",
                  active ? "bg-brand-muted" : "hover:bg-accent"
                )}
              >
                <div className="relative shrink-0">
                  <Avatar className="h-11 w-11">
                    {contact.avatar_url && (
                      <AvatarImage src={contact.avatar_url} alt={contact.name} />
                    )}
                    <AvatarFallback>
                      {contact.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
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

      <Button
        variant="ghost"
        className="mt-3 w-full cursor-pointer justify-start gap-2 text-muted-foreground hover:text-destructive"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden h-screen w-72 flex-col border-r bg-sidebar p-4 md:flex",
          className
        )}
      >
        {SidebarContent}
      </aside>

      {/* Mobile trigger */}
      <button
        type="button"
        className="fixed left-4 top-4 z-30 rounded-lg border bg-background p-2 shadow-sm md:hidden cursor-pointer"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
        {requests.length + contacts.reduce((sum, c) => sum + c.unread_count, 0) > 0 && (
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-brand" />
        )}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r bg-sidebar p-4 md:hidden">
            <button
              type="button"
              className="absolute right-3 top-3 cursor-pointer text-muted-foreground"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
