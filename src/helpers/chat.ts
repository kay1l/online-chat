"use client";

import { API } from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import type { Contact, ContactRequest, Message, SearchResult } from "@/lib/types/models";

export const fetchContacts = async (): Promise<Contact[]> => {
  const { data } = await API.get<Contact[]>(endpoints.contacts.list);
  return data;
};

/** Sends a contact request. Returns 'accepted' when they had already asked us. */
export const addContact = async (
  contactId: number
): Promise<{ message: string; status: "pending" | "accepted" }> => {
  const { data } = await API.post(endpoints.contacts.create, { contact_id: contactId });
  return data;
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

export const fetchContactRequests = async (): Promise<ContactRequest[]> => {
  const { data } = await API.get<ContactRequest[]>(endpoints.contactRequests.list);
  return data;
};

export const acceptContactRequest = async (requestId: number): Promise<void> => {
  await API.post(endpoints.contactRequests.accept(requestId));
};

export const declineContactRequest = async (requestId: number): Promise<void> => {
  await API.post(endpoints.contactRequests.decline(requestId));
};
