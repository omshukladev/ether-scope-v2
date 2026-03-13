import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTrackedWallets,
  addTrackedWallet,
  deleteTrackedWallet,
} from "@/services/tracking";

/* ---------------- FETCH TRACKED WALLETS ---------------- */

export const useTrackedWallets = () => {
  return useQuery({
    queryKey: ["tracked-wallets"],
    queryFn: fetchTrackedWallets,
  });
};

/* ---------------- ADD WALLET ---------------- */

export const useAddTrackedWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTrackedWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracked-wallets"] });
    },
  });
};

/* ---------------- DELETE WALLET ---------------- */

export const useDeleteTrackedWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTrackedWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracked-wallets"] });
    },
  });
};