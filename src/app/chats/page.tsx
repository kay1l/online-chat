"use client";

import { useState } from "react";
import { Sidebar } from "@/components/app-sidebar";
import { Header } from "@/custom_components/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Smile } from "lucide-react";

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
  const [messages, setMessages] = useState<
    { from: "me" | "them"; text: string }[]
  >([
    // Example initial messages
  ]);
  const [inputValue, setInputValue] = useState("");

  const activePartner = chatPartners.find((p) => p.id === activeChatId);

  const handleSend = () => {
    if (inputValue.trim() === "") return;
    setMessages((prev) => [...prev, { from: "me", text: inputValue }]);
    setInputValue("");
    // Optional: trigger Supabase insert/send logic here
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[16rem_1fr] bg-background text-foreground">
      <Sidebar
        chatPartners={chatPartners}
        className="hidden md:flex"
        onSelectChat={(id) => {
          setActiveChatId(id);
          setMessages([]);
        }}
      />
      <div className="flex flex-col border-l">
        <main className="flex flex-1 flex-col justify-between rounded relative">
          {/* Background image */}
          <div className="absolute inset-0 -z-10">
            <div className="h-full w-full bg-[url('/images/chat-bg.png')] bg-cover bg-center opacity-30 dark:opacity-20" />
          </div>

          {activePartner ? (
            <>
              <div className="flex-1 space-y-2 overflow-y-auto rounded p-2">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No message yet
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`max-w-xs break-words rounded p-2 shadow ${
                        msg.from === "me"
                          ? "ml-auto bg-blue-100/80 text-blue-900"
                          : "bg-white/80"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))
                )}
              </div>
              <div className="mt-2 mb-10 flex justify-center">
                <div className="flex w-full max-w-xl items-center gap-2">
                  <div className="relative flex-1 ">
                    <span className="absolute  left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Smile className="h-5  w-5 cursor-pointer " />
                    </span>
                    <Input
                      placeholder={`Message ${activePartner?.name}...`}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="h-12 pl-12  "
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                      }}
                    />
                  </div>
                  <Button
                    className="h-12 w-12 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleSend}
                  >
                    <Send className="h-5 w-5" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Select a chat to start messaging
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
