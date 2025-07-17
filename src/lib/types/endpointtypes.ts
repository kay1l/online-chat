export type EndpointType = {
    auth: {
      login: string;
      register: string;
      logout: string;
      me: string;
    };
    contacts: {
      list: string;
      create: string;
      delete: (id: number | string) => string;
    };
    messages: {
      fetch: (contactId: number | string) => string;
      send: string;
      markAsRead: (id: number | string) => string;
    };
  };
  