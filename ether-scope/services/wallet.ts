import { api } from "@/lib/api";

/* ---------------- FETCH TRANSACTIONS ---------------- */

export const fetchWalletTransactions = async (address: string) => {
  try {
    const res = await api.get(`/wallet/${address}`);

    console.log("FULL API RESPONSE:", res.data);
    console.log("TRANSACTIONS DATA:", res.data.data);

    return res.data.data;
  } catch (error: any) {
    console.log("AXIOS ERROR:", error);
    console.log("AXIOS ERROR RESPONSE:", error?.response?.data);

    throw error;
  }
};

/* ---------------- FETCH HISTORY ---------------- */

export const fetchWalletHistory = async () => {
  const res = await api.get("/wallet/history");
  return res.data.data;
};
