"use client";

import { useState } from "react";
import { Menu, LogOut, Pencil, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { AddContactDialog } from "@/custom_components/add_contact_dialog";
import { EditProfileDialog } from "@/custom_components/edit_profile_dialog";
import { cn } from "@/lib/utils";
import { logout } from "@/helpers/auth";
import { useRouter } from "next/navigation";

interface SidebarProps {
  className?: string;
  chatPartners?: {
    id: string;
    name: string;
    avatarFile?: string;
    isOnline?: boolean;
    lastMessage?: string;
    lastMessageTime?: string;
  }[];
  onSelectChat?: (id: string) => void;
}


export function Sidebar({ chatPartners = [], onSelectChat }: SidebarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/"); 
    } catch (error) {
      console.error("Logout error", error);
    }
  };
  const SidebarContent = (
    <>
      <div className="mb-4 mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold text-primary">
          <img
            src="/images/icon.jpeg"
            alt="Icon"
            className="h-10 w-10 object-contain dark:brightness-[0.2] dark:grayscale"
          />
          <span className="text-lg">NexChat</span>
        </div>
        <AddContactDialog onAdd={(name) => console.log("New contact:", name)} />
      </div>

      <EditProfileDialog
        initialUsername="kay1l"
        initialEmail="kay1l@example.com"
        initialAvatar="/images/profile.jpeg"
        onSave={(data) => console.log("Profile saved", data)}
      >
        <div className="mb-4 flex items-center gap-3 rounded-md p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/images/profile.jpeg" alt="You" />
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-sm font-medium">kay1l</div>
            <div className="text-xs text-muted-foreground">Edit profile</div>
          </div>
          <Pencil className="h-4 w-4 text-muted-foreground" />
        </div>
      </EditProfileDialog>

      <div className="mb-4 relative">
        <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
          <Search className="h-4 w-4 text-muted-foreground" />
        </span>
        <Input
          placeholder="Search chats..."
          className="h-10 pl-8 rounded-md border border-border bg-background text-sm"
        />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {chatPartners.length === 0 ? (
          <div className="text-sm text-muted-foreground">No chats yet</div>
        ) : (
          chatPartners.map((partner) => (
            <Link
              key={partner.id}
              href={`/chats/${partner.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectChat?.(partner.id);
                setMobileOpen(false);
              }}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-base font-semibold transition-colors hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20"
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  {partner.avatarFile ? (
                    <AvatarImage
                      src={`/images/${partner.avatarFile}`}
                      alt={partner.name}
                    />
                  ) : (
                    <AvatarFallback className="text-lg">
                      {partner.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span
                  className={cn(
                    "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                    partner.isOnline ? "bg-green-500" : "bg-gray-400"
                  )}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <span className="truncate">{partner.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground whitespace-nowrap">
                    {partner.lastMessageTime}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {partner.lastMessage}
                </div>
              </div>
            </Link>
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
      <aside className="hidden md:flex h-screen w-64 flex-col border-r p-4 bg-background">
        {SidebarContent}
      </aside>

      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-background rounded shadow md:hidden"
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
          <aside className="fixed top-0 left-0 z-50 h-full w-64 bg-background border-r p-4">
            {SidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
