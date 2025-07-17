"use client";

import { useState } from "react";
import { Sidebar } from "@/components/app-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircleMore, Send, Smile } from "lucide-react";
import Image from "next/image";

export default function ChatsLayout() {
  const chatPartners = [
    { id: "uuid1", name: "Alice", avatarFile: "avatar.jpeg", isOnline: true,lastMessage: 'Ok, see you!', lastMessageTime: '3:45 PM' },
    { id: "uuid2", name: "Bob", avatarFile: "avatar.jpeg",lastMessage: 'Ok, see you!', lastMessageTime: '3:45 PM' },
    { id: "uuid3", name: "John", avatarFile: "avatar.jpeg",lastMessage: 'Ok, see you!', lastMessageTime: '3:45 PM' },
    { id: "uuid4", name: "Mark", avatarFile: "avatar.jpeg" , isOnline: true,lastMessage: 'Ok, see you!', lastMessageTime: '3:45 PM' },
    { id: "uuid5", name: "Melody", avatarFile: "avatar.jpeg",lastMessage: 'Ok, see you!', lastMessageTime: '3:45 PM' },
    { id: "uuid6", name: "Tyson", avatarFile: "avatar.jpeg",isOnline: true, lastMessage: 'Ok, see you!', lastMessageTime: '3:45 PM' },
  ];

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    { from: "me" | "them"; text: string; time: string; seen?: boolean }[]
  >([]);
  const [inputValue, setInputValue] = useState("");

  const activePartner = chatPartners.find((p) => p.id === activeChatId);

  const handleSend = () => {
    if (inputValue.trim() === "") return;
    setMessages((prev) => [
      ...prev,
      {
        from: "me",
        text: inputValue,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        seen: false, 
      },
    ]);
    setInputValue("");
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
        <main className="flex flex-1 flex-col justify-between mt-10 rounded relative">
          {/* Background image */}
          <div className="absolute inset-0 -z-10">
            <div className="h-full w-full bg-[url('/images/chat-bg.png')] bg-cover bg-center opacity-30 dark:opacity-20" />
          </div>

          {activePartner ? (
            <>
              <div className="flex-1 space-y-2 overflow-y-auto rounded p-2">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-muted-foreground animate-pulse space-y-2">
                    <MessageCircleMore className="h-8 w-8" />
                    <span>No message yet</span>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex items-end gap-2 ${
                        msg.from === "me" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.from === "them" && (
                        <img
                          src={`/images/${activePartner.avatarFile}`}
                          alt={activePartner.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      )}

                      <div className="flex max-w-xs flex-col">
                        <div
                          className={`inline-block rounded-lg px-3 py-2 text-sm shadow ${
                            msg.from === "me"
                              ? "bg-blue-600 text-white"
                              : "bg-white/80 text-foreground"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <span>{msg.time}</span>
                          {msg.from === "me" && (
                            <span className={`flex items-center gap-0.5 ${msg.seen ? "text-blue-400" : ""}`}>
                              {msg.seen ? (
                                <>
                                  <svg
                                    className="h-3 w-3"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M20.285 6.709a1 1 0 00-1.414-1.418l-9.192 9.198-4.243-4.243a1 1 0 00-1.414 1.414l4.95 4.95a1 1 0 001.414 0l9.9-9.901z" />
                                  </svg>
                                  Seen
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="h-3 w-3"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M20.285 6.709a1 1 0 00-1.414-1.418l-9.192 9.198-4.243-4.243a1 1 0 00-1.414 1.414l4.95 4.95a1 1 0 001.414 0l9.9-9.901z" />
                                  </svg>
                                  Sent
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {msg.from === "me" && (
                        <img
                          src="/images/avatar.jpeg"
                          alt="You"
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="mt-2 mb-10 flex justify-center">
                <div className="flex w-full max-w-xl items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Smile className="h-5 w-5 cursor-pointer" />
                    </span>
                    <Input
                      placeholder={`Message ${activePartner.name}...`}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="h-13 pl-10"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                      }}
                    />
                  </div>
                  <Button
                    className="h-13 w-12 rounded-md bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
                    onClick={handleSend}
                  >
                    <Send className="h-7 w-7" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground animate-pulse space-y-2">
              <MessageCircleMore className="h-8 w-8" />
              <span>Select a chat to start messaging</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
