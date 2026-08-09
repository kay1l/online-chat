"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, Menu, Pencil, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AddContactDialog } from "@/custom_components/add_contact_dialog";
import { EditProfileDialog } from "@/custom_components/edit_profile_dialog";
import { cn } from "@/lib/utils";
import { logout } from "@/helpers/auth";
import { useAuth } from "@/custom_components/app_wrapper";
import type { Contact, User } from "@/lib/types/models";

interface SidebarProps {
  className?: string;
  contacts: Contact[];
  activeContactId: number | null;
  onSelectChat: (id: number) => void;
  onContactAdded: () => void;
}

const formatTime = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  const isToday = new Date().toDateString() === date.toDateString();
  return isToday
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString([], { month: "short", day: "numeric" });
};

export function Sidebar({
  className,
  contacts,
  activeContactId,
  onSelectChat,
  onContactAdded,
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
    router.push("/");
  };

  const handleProfileSaved = (updated: User) => setUser(updated);

  const SidebarContent = (
    <>
      <div className="mb-4 mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold text-primary">
          <Image
            src="/images/icon.jpeg"
            alt="NexChat"
            width={40}
            height={40}
            className="h-10 w-10 object-contain dark:brightness-[0.2] dark:grayscale"
          />
          <span className="text-lg">NexChat</span>
        </div>
        <AddContactDialog onAdded={onContactAdded} />
      </div>

      {user && (
        <EditProfileDialog user={user} onSaved={handleProfileSaved}>
          <div className="mb-4 flex items-center gap-3 rounded-md p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer">
            <Avatar className="h-10 w-10">
              {user.avatar_url && <AvatarImage src={user.avatar_url} alt={user.name} />}
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">Edit profile</div>
            </div>
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </div>
        </EditProfileDialog>
      )}

      <div className="mb-4 relative">
        <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
          <Search className="h-4 w-4 text-muted-foreground" />
        </span>
        <Input
          placeholder="Search chats..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-10 pl-8 rounded-md border border-border bg-background text-sm"
        />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {visibleContacts.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            {contacts.length === 0 ? "No chats yet — add a contact to start." : "No matches."}
          </div>
        ) : (
          visibleContacts.map((contact) => (
            <button
              key={contact.id}
              type="button"
              onClick={() => {
                onSelectChat(contact.id);
                setMobileOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-base font-semibold transition-colors hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 cursor-pointer",
                activeContactId === contact.id && "bg-blue-50 text-blue-700 dark:bg-blue-900/20"
              )}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  {contact.avatar_url && (
                    <AvatarImage src={contact.avatar_url} alt={contact.name} />
                  )}
                  <AvatarFallback className="text-lg">
                    {contact.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                    contact.is_online ? "bg-green-500" : "bg-gray-400"
                  )}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex justify-between">
                  <span className="truncate">{contact.name}</span>
                  <span className="ml-2 whitespace-nowrap text-xs font-normal text-muted-foreground">
                    {formatTime(contact.last_message_at)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 truncate text-sm font-normal text-muted-foreground">
                    {contact.last_message ?? "No messages yet"}
                  </div>
                  {contact.unread_count > 0 && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                      {contact.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </nav>

      <Button
        variant="outline"
        className="mt-4 w-full flex items-center justify-center cursor-pointer gap-2 text-red-600 border-red-300 hover:bg-red-50"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn("hidden md:flex h-screen w-64 flex-col border-r p-4 bg-background", className)}>
        {SidebarContent}
      </aside>

      {/* Mobile hamburger */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 rounded bg-background p-2 shadow md:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r bg-background p-4">
            {SidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
