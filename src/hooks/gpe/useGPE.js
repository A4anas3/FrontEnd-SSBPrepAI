import { useQuery } from "@tanstack/react-query";
import {
  fetchSampleGpe,
  fetchGpeById,
  fetchGpeTest,
} from "@/features/gpe/gpeapi";

// ✅ Query Keys (important)
export const GPE_KEYS = {
  all: ["gpe"],
  sample: ["gpe", "sample"],
  test: ["gpe", "test"],
  detail: (id) => ["gpe", "detail", id],
};

// ✅ 1. Sample GPE Cards Hook
export const useSampleGpe = () => {
  return useQuery({
    queryKey: GPE_KEYS.sample,
    queryFn: fetchSampleGpe,
  });
};

// ✅ 2. GPE Detail Hook (by ID)
export const useGpeDetail = (id) => {
  return useQuery({
    queryKey: GPE_KEYS.detail(id),
    queryFn: () => fetchGpeById(id),
    enabled: !!id, // prevent call if id is undefined
  });
};

// ✅ 3. GPE Test Hook
export const useGpeTest = () => {
  return useQuery({
    queryKey: GPE_KEYS.test,
    queryFn: fetchGpeTest,
  });
};
