import { useQuery } from "@tanstack/react-query";
import { fetchSamplePPDT } from "@/features/ppdt/apiPpdt.js"; // adjust path if needed

export const useSamplePPDT = () => {
  return useQuery({
    queryKey: ["sample-ppdt"],
    queryFn: fetchSamplePPDT,
  });
};
