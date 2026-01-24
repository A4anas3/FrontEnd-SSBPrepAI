import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchRapidFire,
  fetchRapidFireById,
  createRapidFire,
  patchRapidFire,
  deleteRapidFire,
} from "@/features/pi/rapidFireApi";

export const RAPID_FIRE_KEYS = {
  all: ["rapid-fire"],
  detail: (id) => ["rapid-fire", id],
};

// ✅ Get All Sequences
export const useRapidFire = () => {
  return useQuery({
    queryKey: RAPID_FIRE_KEYS.all,
    queryFn: fetchRapidFire,
  });
};

// ✅ Get By ID
export const useRapidFireDetail = (id) => {
  return useQuery({
    queryKey: RAPID_FIRE_KEYS.detail(id),
    queryFn: () => fetchRapidFireById(id),
    enabled: !!id,
  });
};

// ✅ Admin Hook
export const useRapidFireAdmin = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createRapidFire,
    onSuccess: () => {
      queryClient.invalidateQueries(RAPID_FIRE_KEYS.all);
    },
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, payload }) => patchRapidFire(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(RAPID_FIRE_KEYS.all);
      queryClient.invalidateQueries(RAPID_FIRE_KEYS.detail(variables.id));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRapidFire,
    onSuccess: () => {
      queryClient.invalidateQueries(RAPID_FIRE_KEYS.all);
    },
  });

  return {
    createRapidFire: createMutation.mutateAsync,
    patchRapidFire: patchMutation.mutateAsync,
    deleteRapidFire: deleteMutation.mutateAsync,
  };
};
