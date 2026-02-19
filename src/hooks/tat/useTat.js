import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchTatTestCards,
  fetchTatTestById,
  fetchTatSampleByTestId,
  submitTatTest,
} from "@/features/tat/tatApi";

/* ======================
   QUERY KEYS
====================== */
const TAT_KEYS = {
  cards: ["tat", "cards"],
  detail: (id) => ["tat", "detail", id],
  sample: (id) => ["tat", "sample", id],
};

// 1️⃣ Cards
export const useTatTestCards = () =>
  useQuery({
    queryKey: TAT_KEYS.cards,
    queryFn: fetchTatTestCards,
  });

// 2️⃣ Test Detail
export const useTatTestDetail = (id) =>
  useQuery({
    queryKey: TAT_KEYS.detail(id),
    queryFn: () => fetchTatTestById(id),
    enabled: !!id,
  });

// 3️⃣ Sample
export const useTatSample = (id) =>
  useQuery({
    queryKey: TAT_KEYS.sample(id),
    queryFn: () => fetchTatSampleByTestId(id),
    enabled: !!id,
  });

// 4️⃣ Submit TAT Test
export const useTatTestSubmit = () =>
  useMutation({
    mutationFn: submitTatTest,
  });
