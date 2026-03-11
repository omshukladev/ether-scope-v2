import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchWalletTransactions,
  fetchWalletHistory,
} from "@/services/wallet";

/* ---------------- WALLET TRANSACTIONS ---------------- */

export const useWalletTransactions = (address: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["wallet", address],
    queryFn: async () => {
      const data = await fetchWalletTransactions(address);

      queryClient.invalidateQueries({
        queryKey: ["wallet-history"],
      });

      return data;
    },
    enabled: !!address,
    retry: 2,
  });
};

/* ---------------- WALLET HISTORY ---------------- */

export const useWalletHistory = () => {
  return useQuery({
    queryKey: ["wallet-history"],
    queryFn: fetchWalletHistory,
    retry: 2,
  });
};