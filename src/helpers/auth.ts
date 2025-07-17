"use client"
import { API } from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";


export const login = async (email: string, password: string) => {
  const res = await API.post(endpoints.auth.login, { email, password });
  return res.data;
};

export const getMe = async () => {
  const res = await API.get("/me");
  return res.data;
};

export const logout = async () => {
  try {
    await API.post(endpoints.auth.logout);
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
  } catch (error) {
    console.error("Logout failed", error);
    throw error; // Let the caller handle redirect
  }
};