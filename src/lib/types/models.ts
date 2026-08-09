export type User = {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  is_online?: boolean;
  last_seen_at?: string | null;
};

/** A contact as returned by GET /contacts — decorated with sidebar preview data. */
export type Contact = {
  id: number;
  name: string;
  avatar_url: string | null;
  is_online: boolean;
  last_seen_at: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
};

export type Message = {
  id: number;
  sender_id: number;
  receiver_id: number;
  /** Null when the message is an attachment with no caption. */
  content: string | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  /** Signed, expiring URL — usable directly as an <img> src. */
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_mime: string | null;
  attachment_size: number | null;
  attachment_is_image: boolean;
  /** Set on optimistic messages that have not been acknowledged by the API yet. */
  pending?: boolean;
};

/** Null when there is no relationship in flight; otherwise which way it points. */
export type RequestStatus = "sent" | "incoming" | null;

export type SearchResult = {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  is_online: boolean;
  request_status: RequestStatus;
};

/** An incoming contact request awaiting the current user's answer. */
export type ContactRequest = {
  id: number;
  created_at: string;
  user: {
    id: number;
    name: string;
    avatar_url: string | null;
    is_online: boolean;
  };
};

export type AuthResponse = {
  user: User;
  token: string;
};
