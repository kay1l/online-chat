"use client";

import { API } from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import type { Contact, Message, SearchResult } from "@/lib/types/models";

export const fetchContacts = async (): Promise<Contact[]> => {
  const { data } = await API.get<Contact[]>(endpoints.contacts.list);
  return data;
};

export const addContact = async (contactId: number): Promise<void> => {
  await API.post(endpoints.contacts.create, { contact_id: contactId });
};

export const removeContact = async (contactId: number): Promise<void> => {
  await API.delete(endpoints.contacts.delete(contactId));
};

export const searchUsers = async (query: string): Promise<SearchResult[]> => {
  const { data } = await API.get<SearchResult[]>(endpoints.users.search(query));
  return data;
};

/** Fetching a conversation also marks the contact's messages as read server-side. */
export const fetchMessages = async (contactId: number): Promise<Message[]> => {
  const { data } = await API.get<Message[]>(endpoints.messages.fetch(contactId));
  return data;
};

export const sendMessage = async (receiverId: number, content: string): Promise<Message> => {
  const { data } = await API.post<Message>(endpoints.messages.send, {
    receiver_id: receiverId,
    content,
  });
  return data;
};

export const markMessageAsRead = async (messageId: number): Promise<Message> => {
  const { data } = await API.post<Message>(endpoints.messages.markAsRead(messageId));
  return data;
};
