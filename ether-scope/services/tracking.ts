import { api } from "@/lib/api";

/* ---------------- GET TRACKED WALLETS ---------------- */

export const fetchTrackedWallets = async () => {
  const res = await api.get("/tracking");
  return res.data.data;
};

/* ---------------- ADD WALLET ---------------- */

export const addTrackedWallet = async (address: string) => {
  const res = await api.post(`/tracking/${address}`);
  return res.data.data;
};

/* ---------------- DELETE WALLET ---------------- */

export const deleteTrackedWallet = async (address: string) => {
  const res = await api.delete(`/tracking/${address}`);
  return res.data.data;
};