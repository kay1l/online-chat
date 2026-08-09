"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { ChevronDown, LogOut, Menu, UserPen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NotificationBell } from "@/custom_components/notification_bell";
import { ThemeToggle } from "@/custom_components/theme_toggle";
import { EditProfileDialog } from "@/custom_components/edit_profile_dialog";
import { useAuth } from "@/custom_components/app_wrapper";
import { logout } from "@/helpers/auth";
import type { ContactRequest, User } from "@/lib/types/models";

interface NavbarProps {
  requests: ContactRequest[];
  /** Refetch contacts and requests after a request is answered. */
  onDataChanged: () => void;
  /** Opens the sidebar drawer on small screens. */
  onOpenMenu: () => void;
  /** Shown as a dot on the mobile menu button. */
  hasSidebarActivity: boolean;
}

export function Navbar({
  requests,
  onDataChanged,
  onOpenMenu,
  hasSidebarActivity,
}: NavbarProps) {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    setUser(null);
    toast.success("Signed out");
    router.push("/");
  };

  const handleProfileSaved = (updated: User) => {
    setUser(updated);
    toast.success("Profile updated");
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-background px-3 sm:px-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="relative -ml-1 cursor-pointer rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent md:hidden"
          onClick={onOpenMenu}
          aria-label="Open chats"
        >
          <Menu className="h-5 w-5" />
          {hasSidebarActivity && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brand" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <Image
            src="/images/icon.jpeg"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 rounded-md object-contain"
          />
          <span className="text-base font-semibold tracking-tight">NexChat</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <NotificationBell requests={requests} onAnswered={onDataChanged} />
        <ThemeToggle />

        {user && (
          <>
            <Popover open={menuOpen} onOpenChange={setMenuOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="ml-1 flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-accent"
                  aria-label="Account menu"
                >
                  <Avatar className="h-8 w-8">
                    {user.avatar_url && <AvatarImage src={user.avatar_url} alt={user.name} />}
                    <AvatarFallback className="bg-brand text-xs text-brand-foreground">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
                    {user.name}
                  </span>
                  <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
                </button>
              </PopoverTrigger>

              <PopoverContent align="end" className="w-60 p-0">
                <div className="border-b px-4 py-3">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>

                <div className="p-1">
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                    onClick={() => {
                      setMenuOpen(false);
                      setProfileOpen(true);
                    }}
                  >
                    <UserPen className="h-4 w-4 text-muted-foreground" />
                    Edit profile
                  </button>

                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-accent"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Driven by the menu rather than its own trigger. */}
            <EditProfileDialog
              user={user}
              onSaved={handleProfileSaved}
              open={profileOpen}
              onOpenChange={setProfileOpen}
            />
          </>
        )}
      </div>
    </header>
  );
}
