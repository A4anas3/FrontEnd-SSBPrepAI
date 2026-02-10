import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTat, patchTat, deleteTat } from "@/features/tat/tatApi";

/* ======================
   ADMIN HOOK
====================== */
export const useTatAdmin = () => {
  const queryClient = useQueryClient();

  /* ✅ Create */
  const createMutation = useMutation({
    mutationFn: createTat,
    onSuccess: () => {
      queryClient.invalidateQueries(["tat", "cards"]);
    },
  });

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
    createTat: createMutation.mutateAsync,
    patchTat: patchMutation.mutateAsync,
    deleteTat: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: patchMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
