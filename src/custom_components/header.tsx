"use client"

// src/components/header.tsx

import { Button } from "@/components/ui/button";
import { MessageSquare, Bell, User } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b bg-muted p-4">
      {/* Left: App name / logo */}
      <div className="flex items-center gap-2 text-lg font-semibold">
        <MessageSquare className="h-5 w-5" />
        ChatApp
      </div>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
          <span className="sr-only">Profile</span>
        </Button>
      </div>
    </header>
  );
}
