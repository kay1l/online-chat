import { EndpointType } from "./types/endpointtypes";

export { API_BASE_URL } from "./axios";

// Paths are relative to the axios instance's baseURL (which already includes /api).
export const endpoints: EndpointType = {
  auth: {
    login: "/login",
    register: "/register",
    logout: "/logout",
    me: "/me",
    updateProfile: "/me",
  },

  users: {
    search: (query: string) => `/users/search?q=${encodeURIComponent(query)}`,
  },

  contacts: {
    list: "/contacts",
    create: "/contacts",
    delete: (id: number | string) => `/contacts/${id}`,
  },

  contactRequests: {
    list: "/contact-requests",
    accept: (id: number | string) => `/contact-requests/${id}/accept`,
    decline: (id: number | string) => `/contact-requests/${id}/decline`,
  },

  messages: {
    fetch: (contactId: number | string) => `/messages/${contactId}`,
    send: "/messages",
    markAsRead: (id: number | string) => `/messages/${id}/read`,
  },
};
