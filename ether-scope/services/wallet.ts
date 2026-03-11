import { api } from "@/lib/api";

/* ---------------- FETCH TRANSACTIONS ---------------- */

export const fetchWalletTransactions = async (address: string) => {
  const res = await api.get(`/wallet/${address}`);
  return res.data;
};

/* ---------------- FETCH HISTORY ---------------- */

export const fetchWalletHistory = async () => {
  const res = await api.get("/history");
  return res.data;
};