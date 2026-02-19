import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchWatTestNames, fetchWatTestById, submitWatTest } from "@/features/wat/watapi";

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

// ✅ 3️⃣ Hook: Submit WAT Test
export const useWatTestSubmit = () => {
  return useMutation({
    mutationFn: submitWatTest,
    onSuccess: (data) => { console.log("WAT Submit Success:", data); },
    onError: (error) => { console.error("WAT Submit Error:", error); }
  });
};
