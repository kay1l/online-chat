import { API } from "@/lib/axios";

export const login = async (email: string, password: string) => {
  const res = await API.post("/login", { email, password });
  return res.data;
};

export const getMe = async () => {
  const res = await API.get("/me");
  return res.data;
};