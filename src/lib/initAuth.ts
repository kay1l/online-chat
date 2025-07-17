import { setAuthToken } from "@/lib/axios";

export const initAuth = () => {
  const token = localStorage.getItem("token");
  if (token) {
    setAuthToken(token);
  }
};