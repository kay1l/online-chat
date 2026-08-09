"use client";

import { API, setAuthToken } from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import type { AuthResponse, User } from "@/lib/types/models";

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await API.post<AuthResponse>(endpoints.auth.login, { email, password });
  setAuthToken(data.token);
  return data;
};

export const register = async (payload: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthResponse> => {
  const { data } = await API.post<AuthResponse>(endpoints.auth.register, payload);
  setAuthToken(data.token);
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await API.get<User>(endpoints.auth.me);
  return data;
};

export const updateProfile = async (payload: {
  name: string;
  email: string;
  avatar?: File;
}): Promise<User> => {
  const form = new FormData();
  form.append("name", payload.name);
  form.append("email", payload.email);
  if (payload.avatar) {
    form.append("avatar", payload.avatar);
  }

  const { data } = await API.post<User>(endpoints.auth.updateProfile, form);
  return data;
};

export const logout = async () => {
  try {
    await API.post(endpoints.auth.logout);
  } finally {
    // Clear locally even if the call fails — a dead token should never strand the user.
    setAuthToken(null);
  }
};
