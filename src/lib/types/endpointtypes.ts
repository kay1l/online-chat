export type EndpointType = {
  auth: {
    login: string;
    register: string;
    logout: string;
    me: string;
    updateProfile: string;
  };
  users: {
    search: (query: string) => string;
  };
  contacts: {
    list: string;
    create: string;
    delete: (id: number | string) => string;
  };
  contactRequests: {
    list: string;
    accept: (id: number | string) => string;
    decline: (id: number | string) => string;
  };
  messages: {
    fetch: (contactId: number | string) => string;
    send: string;
    markAsRead: (id: number | string) => string;
  };
};
