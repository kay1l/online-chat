"use client";

import { useState } from "react";
import { Sidebar } from "@/components/app-sidebar";
import { Header } from "@/custom_components/header";

export default function ChatsLayout() {
  const chatPartners = [
    { id: "uuid1", name: "Alice", avatarFile: "avatar.jpeg" },
    { id: "uuid2", name: "Bob", avatarFile: "avatar.jpeg" },
    { id: "uuid3", name: "John", avatarFile: "avatar.jpeg" },
    { id: "uuid4", name: "Mark", avatarFile: "avatar.jpeg" },
    { id: "uuid5", name: "Melody", avatarFile: "avatar.jpeg" },
    { id: "uuid6", name: "Tyson", avatarFile: "avatar.jpeg" },
  ];

  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const activePartner = chatPartners.find((p) => p.id === activeChatId);

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[16rem_1fr]">
      <Sidebar
        chatPartners={chatPartners}
        className="hidden md:flex"
        onSelectChat={(id) => setActiveChatId(id)}
      />
      <div className="flex flex-col">
        {/* Optional Header */}
        <Header />

        <main className="flex-1 p-4 bg-muted">
          {activePartner ? (
            <div>
              <h2 className="mb-2 text-lg font-bold">
                Chat with {activePartner.name}
              </h2>
              {/* Replace this with your MessageList component */}
              <div className="space-y-2">
                <div className="rounded bg-white p-2 shadow">Hi, this is {activePartner.name}!</div>
                <div className="rounded bg-blue-100 p-2 shadow ml-auto w-fit">Hello!</div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">Select a chat to start messaging</div>
          )}
        </main>
      </div>
    </div>
  );
}
