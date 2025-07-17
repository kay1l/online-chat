import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:8000", 
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};
