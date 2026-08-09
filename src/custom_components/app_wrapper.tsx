"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getAuthToken } from "@/lib/axios";
import { getMe } from "@/helpers/auth";
import type { User } from "@/lib/types/models";

type AuthContextValue = {
  user: User | null;
  /** True until the initial "who am I" check has settled. */
  loading: boolean;
  setUser: (user: User | null) => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AppWrapper>");
  }
  return context;
};

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getAuthToken()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setUser(await getMe());
    } catch {
      // A 401 is already handled by the axios interceptor.
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};
