import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LogOut, MessageSquare, Pencil, Search } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  className?: string;
  chatPartners?: { id: string; name: string; avatarFile?: string }[];
  onSelectChat?: (id: string) => void;
}

export function Sidebar({ className, chatPartners = [], onSelectChat }: SidebarProps) {
  return (
    <aside
      className={cn("flex h-screen w-64 flex-col border-r p-4", className)}
    >
      <div className="mb-4 mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold text-primary">
          <img
            src="/images/icon.jpeg"
            alt="Image"
            className="h-10 w-10 object-contain dark:brightness-[0.2] cursor-pointer dark:grayscale"
          />
          <span className="text-lg">ChatApp</span>
        </div>
        <Button className="cursor-pointer" variant="ghost" size="icon">
          <Pencil className="h-8 w-8 cursor-pointer" />
          <span className="sr-only">New chat</span>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
          <Search className="h-4 w-4 text-muted-foreground" />
        </span>
        <Input
          placeholder="Search chats..."
          className="h-8 pl-8 rounded-md border border-border bg-background text-sm"
        />
      </div>

      {/* Chat partners list */}
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
              }}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-base font-semibold transition-colors hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20"
            >
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
              <span>{partner.name}</span>
            </Link>
          ))
        )}
      </nav>

      {/* Logout button */}
      <Button
        variant="outline"
        className="mt-4 w-full flex items-center justify-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
        onClick={async () => {
          console.log("Logout clicked");
        }}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </aside>
  );
}
