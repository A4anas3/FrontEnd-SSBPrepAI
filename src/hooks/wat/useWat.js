import { useQuery } from "@tanstack/react-query";
import { fetchWatTestNames, fetchWatTestById } from "@/features/wat/watapi";

// ✅ Query Keys (same pattern as GPE)
export const WAT_KEYS = {
  all: ["wat"],
  names: ["wat", "names"],
  detail: (id) => ["wat", "detail", id],
};

// ✅ 1️⃣ Hook: Get WAT Test Names (Cards)
export const useWatTestNames = () => {
  return useQuery({
    queryKey: WAT_KEYS.names,
    queryFn: fetchWatTestNames,
  });
};

// ✅ 2️⃣ Hook: Get WAT Test By ID
export const useWatTestDetail = (id) => {
  return useQuery({
    queryKey: WAT_KEYS.detail(id),
    queryFn: () => fetchWatTestById(id),
    enabled: !!id,
  });
};
