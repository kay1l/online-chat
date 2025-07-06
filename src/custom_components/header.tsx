"use client";

export function Header({ contactName }: { contactName?: string }) {
  return (
    <header className="flex items-center border-b bg-muted px-4 py-3 shadow-sm">
      {contactName ? (
        <div className="text-lg font-semibold text-primary">
          Chatting with <span className="font-bold">{contactName}</span>
        </div>
      ) : (
        <div className="text-muted-foreground text-sm">
          No contact selected
        </div>
      )}
    </header>
  );
}
