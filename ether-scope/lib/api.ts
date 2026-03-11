import axios from "axios";

let clerkGetToken: (() => Promise<string | null>) | null = null;

/* ---------------- SET TOKEN FROM CLERK ---------------- */

export const setClerkGetToken = (getToken: () => Promise<string | null>) => {
  clerkGetToken = getToken;
};

/* ---------------- AXIOS INSTANCE ---------------- */

export const api = axios.create({
  baseURL: "https://backend.hustler.workers.dev/api",
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */

api.interceptors.request.use(async (config) => {
  if (clerkGetToken) {
    const token = await clerkGetToken();


    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("CLERK TOKEN:", token);
  }

  return config;
});