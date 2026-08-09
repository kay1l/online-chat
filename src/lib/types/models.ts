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
  content: string;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  /** Set on optimistic messages that have not been acknowledged by the API yet. */
  pending?: boolean;
};

export type SearchResult = {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  is_online: boolean;
};

export type AuthResponse = {
  user: User;
  token: string;
};
