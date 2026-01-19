import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchPPDTTestImages, submitPPDT } from "@/features/ppdt/apiPpdt.js";

/* ======================
   FETCH TEST IMAGES
   ====================== */
export const usePPDTTestImages = () => {
  return useQuery({
    queryKey: ["ppdt-test-images"],
    queryFn: fetchPPDTTestImages,
  });
};

/* ======================
   SUBMIT PPDT
   ====================== */
export const useSubmitPPDT = () => {
  return useMutation({
    mutationFn: submitPPDT,
  });
};
