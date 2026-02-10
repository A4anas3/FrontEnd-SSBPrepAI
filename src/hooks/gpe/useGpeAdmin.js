import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGpe, deleteGpe, patchGpe } from "@/features/gpe/gpeapi";
import { GPE_KEYS } from "@/hooks/gpe/useGPE";

export const useGpeAdmin = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: ({ gpe, image }) => {
      const formData = new FormData();
      formData.append("gpe", new Blob([JSON.stringify(gpe)], { type: "application/json" }));
      if (image) formData.append("image", image);
      return createGpe(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(GPE_KEYS.sample);
      queryClient.invalidateQueries(GPE_KEYS.test);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGpe,
    onSuccess: () => {
      queryClient.invalidateQueries(GPE_KEYS.sample);
      queryClient.invalidateQueries(GPE_KEYS.test);
    },
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, gpe, image }) => {
      const formData = new FormData();
      formData.append("gpe", new Blob([JSON.stringify(gpe)], { type: "application/json" }));
      if (image) formData.append("image", image);
      return patchGpe(id, formData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(GPE_KEYS.sample);
      queryClient.invalidateQueries(GPE_KEYS.detail(variables.id));
    },
  });

  return {
    createGpe: createMutation.mutateAsync,
    deleteGpe: deleteMutation.mutateAsync,
    patchGpe: patchMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUpdating: patchMutation.isPending,
  };
};
