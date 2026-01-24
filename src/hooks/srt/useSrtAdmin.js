import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSrt, deleteSrt, patchSrt } from "@/features/srt/srtapi";
import { SRT_KEYS } from "@/hooks/srt/useSrt";

export const useSrtAdmin = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createSrt,
    onSuccess: () => {
      queryClient.invalidateQueries(SRT_KEYS.names);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSrt,
    onSuccess: () => {
      queryClient.invalidateQueries(SRT_KEYS.names);
    },
  });

  const patchMutation = useMutation({
    mutationFn: patchSrt,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(SRT_KEYS.names);
      queryClient.invalidateQueries(SRT_KEYS.detail(variables.id));
    },
  });

  return {
    createSrt: createMutation.mutateAsync,
    deleteSrt: deleteMutation.mutateAsync,
    patchSrt: patchMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUpdating: patchMutation.isPending,
  };
};
