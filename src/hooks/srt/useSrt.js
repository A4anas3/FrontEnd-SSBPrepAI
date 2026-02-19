import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchSrtTestNames, fetchSrtTestById, submitSrtTest } from "@/features/srt/srtapi";

// ✅ Query Keys
export const SRT_KEYS = {
  all: ["srt"],
  names: ["srt", "names"],
  detail: (id) => ["srt", "detail", id],
};

// ✅ 1️⃣ Hook: Get SRT Test Names (Cards)
export const useSrtTestNames = () => {
  return useQuery({
    queryKey: SRT_KEYS.names,
    queryFn: fetchSrtTestNames,
  });
};

// ✅ 2️⃣ Hook: Get SRT Test By ID
export const useSrtTestDetail = (id) => {
  return useQuery({
    queryKey: SRT_KEYS.detail(id),
    queryFn: () => fetchSrtTestById(id),
    enabled: !!id,
  });
};

// ✅ 3️⃣ Hook: Submit SRT Test
export const useSrtTestSubmit = () => {
  return useMutation({
    mutationFn: submitSrtTest,
    onSuccess: (data) => {
      console.log("SRT Submit Success:", data);
    },
    onError: (error) => {
      console.error("SRT Submit Error:", error);
    }
  });
};
