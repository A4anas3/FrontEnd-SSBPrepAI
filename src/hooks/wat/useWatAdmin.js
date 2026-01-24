import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWat, deleteWat, patchWat } from "@/features/wat/watapi";
import { WAT_KEYS } from "@/hooks/wat/useWat";

export const useWatAdmin = () => {
  const queryClient = useQueryClient();

  // ✅ CREATE
  const createMutation = useMutation({
    mutationFn: createWat,
    onSuccess: (newTest) => {
      // update names cache directly (no refetch)
      queryClient.setQueryData(WAT_KEYS.names, (old = []) => [...old, newTest]);
    },
  });

  // ✅ DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteWat,
    onSuccess: (_, id) => {
      queryClient.setQueryData(WAT_KEYS.names, (old = []) =>
        old.filter((t) => t.id !== id),
      );
    },
  });

  // ✅ PATCH (UPDATE)
  const patchMutation = useMutation({
    mutationFn: patchWat,
    onSuccess: (updatedTest, variables) => {
      // update detail cache
      queryClient.setQueryData(WAT_KEYS.detail(variables.id), updatedTest);

      // update names cache
      queryClient.setQueryData(WAT_KEYS.names, (old = []) =>
        old.map((t) => (t.id === variables.id ? updatedTest : t)),
      );
    },
  });

  return {
    createWat: createMutation.mutateAsync,
    deleteWat: deleteMutation.mutateAsync,
    patchWat: patchMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUpdating: patchMutation.isPending,
  };
};
