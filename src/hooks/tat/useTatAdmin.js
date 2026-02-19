import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchTat, deleteTat } from "@/features/tat/tatApi";

/* ======================
   ADMIN HOOK
====================== */
export const useTatAdmin = () => {
  const queryClient = useQueryClient();



  /* ✅ Patch */
  const patchMutation = useMutation({
    mutationFn: patchTat,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["tat", "cards"]);
      queryClient.invalidateQueries(["tat", "detail", variables.id]);
    },
  });

  /* ✅ Delete */
  const deleteMutation = useMutation({
    mutationFn: deleteTat,
    onSuccess: () => {
      queryClient.invalidateQueries(["tat", "cards"]);
    },
  });

  return {
    patchTat: patchMutation.mutateAsync,
    deleteTat: deleteMutation.mutateAsync,
    isUpdating: patchMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
