"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, CheckCheck, Loader2, MessageCircleMore, Send } from "lucide-react";
import { Sidebar } from "@/components/app-sidebar";
import { Navbar } from "@/custom_components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/custom_components/app_wrapper";
import { fetchContactRequests, fetchContacts, fetchMessages, sendMessage } from "@/helpers/chat";
import { getErrorMessage } from "@/lib/axios";
import { clockTime, dayLabel, isSameDay, relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Contact, ContactRequest, Message } from "@/lib/types/models";

// Until the app moves to websockets (Laravel Reverb), updates arrive by polling.
const CONTACTS_POLL_MS = 5000;
const MESSAGES_POLL_MS = 2500;

type PendingMessage = { tempId: number; content: string; created_at: string };

/** A message plus how it should be laid out relative to its neighbours. */
type ThreadItem = {
  message: Message;
  mine: boolean;
  showDivider: boolean;
  /** Last of a run from the same sender — only this one carries the avatar and meta. */
  endsRun: boolean;
};

export default function ChatsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [activeContactId, setActiveContactId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState<PendingMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  const loadSidebar = useCallback(async () => {
    try {
      const [nextContacts, nextRequests] = await Promise.all([
        fetchContacts(),
        fetchContactRequests(),
      ]);
      setContacts(nextContacts);
      setRequests(nextRequests);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not load your contacts"));
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  const loadMessages = useCallback(async (contactId: number) => {
    try {
      setMessages(await fetchMessages(contactId));
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not load messages"));
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    void loadSidebar();
    const timer = setInterval(() => void loadSidebar(), CONTACTS_POLL_MS);
    return () => clearInterval(timer);
  }, [user, loadSidebar]);

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

  // Server messages plus any optimistic ones still in flight.
  const thread = useMemo<ThreadItem[]>(() => {
    if (!user) return [];

    const all: Message[] = [
      ...messages,
      ...pending.map<Message>((item) => ({
        id: -item.tempId,
        sender_id: user.id,
        receiver_id: activeContactId ?? 0,
        content: item.content,
        read_at: null,
        created_at: item.created_at,
        updated_at: item.created_at,
        pending: true,
      })),
    ];

    return all.map((message, index) => {
      const previous = all[index - 1];
      const next = all[index + 1];

      return {
        message,
        mine: message.sender_id === user.id,
        showDivider:
          !previous ||
          !isSameDay(new Date(previous.created_at), new Date(message.created_at)),
        endsRun: !next || next.sender_id !== message.sender_id,
      };
    });
  }, [messages, pending, user, activeContactId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.length]);

  const handleSelectChat = (id: number) => {
    setActiveContactId(id);
    setMessages([]);
    setPending([]);
    // The badge clears as soon as the API marks the thread read.
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
      void loadSidebar();
    } catch (err) {
      toast.error(getErrorMessage(err, "Message could not be sent"));
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

  const unreadTotal = contacts.reduce((sum, contact) => sum + contact.unread_count, 0);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <Navbar
        requests={requests}
        onDataChanged={loadSidebar}
        onOpenMenu={() => setMenuOpen(true)}
        hasSidebarActivity={unreadTotal > 0}
      />

      <div className="flex min-h-0 flex-1">
        <Sidebar
          contacts={contacts}
          loading={loadingContacts}
          activeContactId={activeContactId}
          onSelectChat={handleSelectChat}
          onContactAdded={loadSidebar}
          mobileOpen={menuOpen}
          onMobileClose={() => setMenuOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          {activeContact ? (
            <>
              <header className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
                <Avatar className="h-9 w-9">
                  {activeContact.avatar_url && (
                    <AvatarImage src={activeContact.avatar_url} alt={activeContact.name} />
                  )}
                  <AvatarFallback>{activeContact.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{activeContact.name}</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {activeContact.is_online ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        Online
                      </>
                    ) : activeContact.last_seen_at ? (
                      `Last seen ${relativeTime(activeContact.last_seen_at)}`
                    ) : (
                      "Offline"
                    )}
                  </div>
                </div>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                {loadingMessages && thread.length === 0 ? (
                  <div className="space-y-4">
                    {[0, 1, 2, 3].map((row) => (
                      <div
                        key={row}
                        className={cn("flex", row % 2 === 0 ? "justify-start" : "justify-end")}
                      >
                        <Skeleton
                          className="h-10 rounded-2xl"
                          style={{ width: `${140 + ((row * 53) % 120)}px` }}
                        />
                      </div>
                    ))}
                  </div>
                ) : thread.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                    <MessageCircleMore className="h-10 w-10 opacity-40" />
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs">Say hello to {activeContact.name}.</p>
                  </div>
                ) : (
                  <div className="mx-auto max-w-3xl space-y-1">
                    {thread.map(({ message, mine, showDivider, endsRun }) => (
                      <div key={message.id}>
                        {showDivider && (
                          <div className="my-4 flex items-center gap-3">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                              {dayLabel(message.created_at)}
                            </span>
                            <div className="h-px flex-1 bg-border" />
                          </div>
                        )}

                        <div
                          className={cn(
                            "flex items-end gap-2",
                            mine ? "justify-end" : "justify-start",
                            endsRun ? "mb-2" : "mb-0.5"
                          )}
                        >
                          {!mine &&
                            (endsRun ? (
                              <Avatar className="h-7 w-7 shrink-0">
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
                            ) : (
                              <div className="w-7 shrink-0" />
                            ))}

                          <div
                            className={cn(
                              "flex max-w-[75%] flex-col gap-1 sm:max-w-md",
                              mine ? "items-end" : "items-start"
                            )}
                          >
                            <div
                              className={cn(
                                "rounded-2xl px-3.5 py-2 text-sm leading-relaxed break-words",
                                mine
                                  ? "bg-brand text-brand-foreground"
                                  : "bg-muted text-foreground",
                                mine && endsRun && "rounded-br-sm",
                                !mine && endsRun && "rounded-bl-sm",
                                message.pending && "opacity-60"
                              )}
                            >
                              {message.content}
                            </div>

                            {endsRun && (
                              <div className="flex items-center gap-1 px-1 text-[11px] text-muted-foreground">
                                <span>{clockTime(message.created_at)}</span>
                                {mine &&
                                  (message.pending ? (
                                    <span>· Sending</span>
                                  ) : message.read_at ? (
                                    <CheckCheck className="h-3.5 w-3.5 text-brand" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5" />
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t px-4 py-3">
                <div className="mx-auto flex max-w-3xl items-center gap-2">
                  <Input
                    placeholder={`Message ${activeContact.name}...`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="h-11 rounded-full px-4"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void handleSend();
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    className="h-11 w-11 shrink-0 cursor-pointer rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
                    onClick={() => void handleSend()}
                    disabled={inputValue.trim() === ""}
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
              <div className="rounded-full bg-muted p-5">
                <MessageCircleMore className="h-8 w-8 opacity-60" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Your messages</p>
                <p className="mt-1 text-sm">
                  {contacts.length === 0
                    ? "Add a contact to start your first conversation."
                    : "Select a chat from the sidebar to start messaging."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
