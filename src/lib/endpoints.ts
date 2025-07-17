import { EndpointType } from "./types/endpointtypes";


export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const endpoints: EndpointType = {
  auth: {
    login: `${API_BASE_URL}/login`,
    register: `${API_BASE_URL}/register`,
    logout: `${API_BASE_URL}/logout`,
    me: `${API_BASE_URL}/me`,
  },

  contacts: {
    list: `${API_BASE_URL}/contacts`,
    create: `${API_BASE_URL}/contacts`,
    delete: (id: number | string) => `${API_BASE_URL}/contacts/${id}`,
  },

  messages: {
    fetch: (contactId: number | string) => `${API_BASE_URL}/messages/${contactId}`,
    send: `${API_BASE_URL}/messages`,
    markAsRead: (id: number | string) => `${API_BASE_URL}/messages/${id}/read`,
  },
};
