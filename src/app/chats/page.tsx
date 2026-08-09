"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/app-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck, Loader2, MessageCircleMore, Send } from "lucide-react";
import { useAuth } from "@/custom_components/app_wrapper";
import { fetchContacts, fetchMessages, sendMessage } from "@/helpers/chat";
import { getErrorMessage } from "@/lib/axios";
import type { Contact, Message } from "@/lib/types/models";

// Until the app moves to websockets (Laravel Reverb), new messages arrive by polling.
const CONTACTS_POLL_MS = 5000;
const MESSAGES_POLL_MS = 2500;

type PendingMessage = { tempId: number; content: string; created_at: string };

export default function ChatsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContactId, setActiveContactId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState<PendingMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Anyone without a valid session belongs on the login screen.
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  const loadContacts = useCallback(async () => {
    try {
      setContacts(await fetchContacts());
    } catch (err) {
      setError(getErrorMessage(err, "Could not load contacts"));
    }
  }, []);

  const loadMessages = useCallback(async (contactId: number) => {
    try {
      setMessages(await fetchMessages(contactId));
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load messages"));
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    void loadContacts();
    const timer = setInterval(() => void loadContacts(), CONTACTS_POLL_MS);
    return () => clearInterval(timer);
  }, [user, loadContacts]);

  useEffect(() => {
    if (!user || activeContactId === null) return;

    setLoadingMessages(true);
    void loadMessages(activeContactId).finally(() => setLoadingMessages(false));

    const timer = setInterval(() => void loadMessages(activeContactId), MESSAGES_POLL_MS);
    return () => clearInterval(timer);
  }, [user, activeContactId, loadMessages]);

  const activeContact = useMemo(
    () => contacts.find((contact) => contact.id === activeContactId) ?? null,
    [contacts, activeContactId]
  );

  const thread = useMemo(
    () => [
      ...messages,
      ...pending.map<Message>((item) => ({
        id: -item.tempId,
        sender_id: user?.id ?? 0,
        receiver_id: activeContactId ?? 0,
        content: item.content,
        read_at: null,
        created_at: item.created_at,
        updated_at: item.created_at,
        pending: true,
      })),
    ],
    [messages, pending, user?.id, activeContactId]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.length]);

  const handleSelectChat = (id: number) => {
    setActiveContactId(id);
    setMessages([]);
    setPending([]);
    setError(null);
    // The contact's unread badge clears as soon as the API marks the thread read.
    setContacts((prev) =>
      prev.map((contact) => (contact.id === id ? { ...contact, unread_count: 0 } : contact))
    );
  };

  const handleSend = async () => {
    const content = inputValue.trim();
    if (content === "" || activeContactId === null) return;

    const tempId = Date.now();
    setPending((prev) => [...prev, { tempId, content, created_at: new Date().toISOString() }]);
    setInputValue("");

    try {
      const message = await sendMessage(activeContactId, content);
      setMessages((prev) =>
        prev.some((existing) => existing.id === message.id) ? prev : [...prev, message]
      );
      void loadContacts();
    } catch (err) {
      setError(getErrorMessage(err, "Message could not be sent"));
      setInputValue(content);
    } finally {
      setPending((prev) => prev.filter((item) => item.tempId !== tempId));
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[16rem_1fr] bg-background text-foreground">
      <Sidebar
        contacts={contacts}
        activeContactId={activeContactId}
        onSelectChat={handleSelectChat}
        onContactAdded={loadContacts}
      />

      <div className="flex min-h-screen flex-col border-l">
        {activeContact ? (
          <>
            <header className="flex items-center gap-3 border-b bg-muted px-4 py-3 shadow-sm">
              <Avatar className="h-9 w-9">
                {activeContact.avatar_url && (
                  <AvatarImage src={activeContact.avatar_url} alt={activeContact.name} />
                )}
                <AvatarFallback>{activeContact.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{activeContact.name}</div>
                <div className="text-xs text-muted-foreground">
                  {activeContact.is_online ? "Online" : "Offline"}
                </div>
              </div>
            </header>

            <main className="relative flex flex-1 flex-col justify-between">
              <div className="absolute inset-0 -z-10">
                <div className="h-full w-full bg-[url('/images/chat.jpeg')] bg-cover bg-center opacity-20 dark:opacity-10" />
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {loadingMessages && thread.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : thread.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center space-y-2 text-muted-foreground">
                    <MessageCircleMore className="h-8 w-8" />
                    <span>No messages yet — say hello.</span>
                  </div>
                ) : (
                  thread.map((message) => {
                    const mine = message.sender_id === user.id;

                    return (
                      <div
                        key={message.id}
                        className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}
                      >
                        {!mine && (
                          <Avatar className="h-6 w-6">
                            {activeContact.avatar_url && (
                              <AvatarImage
                                src={activeContact.avatar_url}
                                alt={activeContact.name}
                              />
                            )}
                            <AvatarFallback className="text-[10px]">
                              {activeContact.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div className="flex max-w-xs flex-col">
                          <div
                            className={`inline-block rounded-lg px-3 py-2 text-sm shadow ${
                              mine
                                ? "bg-blue-600 text-white"
                                : "bg-white/90 text-foreground dark:bg-gray-800"
                            } ${message.pending ? "opacity-70" : ""}`}
                          >
                            {message.content}
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <span>
                              {new Date(message.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {mine && !message.pending && (
                              <span
                                className={`flex items-center gap-0.5 ${
                                  message.read_at ? "text-blue-500" : ""
                                }`}
                              >
                                {message.read_at ? (
                                  <>
                                    <CheckCheck className="h-3 w-3" /> Seen
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-3 w-3" /> Sent
                                  </>
                                )}
                              </span>
                            )}
                            {mine && message.pending && <span>Sending...</span>}
                          </div>
                        </div>

                        {mine && (
                          <Avatar className="h-6 w-6">
                            {user.avatar_url && <AvatarImage src={user.avatar_url} alt={user.name} />}
                            <AvatarFallback className="text-[10px]">
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {error && (
                <p className="px-4 pb-2 text-center text-sm text-red-600">{error}</p>
              )}

              <div className="mb-6 mt-2 flex justify-center px-4">
                <div className="flex w-full max-w-xl items-center gap-2">
                  <Input
                    placeholder={`Message ${activeContact.name}...`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="h-12"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void handleSend();
                      }
                    }}
                  />
                  <Button
                    className="h-12 w-12 cursor-pointer rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => void handleSend()}
                    disabled={inputValue.trim() === ""}
                  >
                    <Send className="h-5 w-5" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
            </main>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center space-y-2 text-muted-foreground">
            <MessageCircleMore className="h-8 w-8" />
            <span>Select a chat to start messaging</span>
          </div>
        )}
      </div>
    </div>
  );
}
