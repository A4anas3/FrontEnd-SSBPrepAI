import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllPPDTImagesAdmin,
  fetchPPDTImageAdmin,
  addPPDTImage,
  updatePPDTImage,
  deletePPDTImage,
} from "@/features/ppdt/ppdtAdminApi.js";
import { toggleSamplePPDTImage } from "@/features/ppdt/apiPpdt.js";

/* ======================
   GET ALL IMAGES (ADMIN)
   ====================== */
export const useAdminPPDTImages = () =>
  useQuery({
    queryKey: ["admin-ppdt-images"],
    queryFn: fetchAllPPDTImagesAdmin,
  });

/* ======================
   GET SINGLE IMAGE (ADMIN)
   ====================== */
export const useAdminPPDTImage = (id) =>
  useQuery({
    queryKey: ["admin-ppdt-image", id],
    queryFn: () => fetchPPDTImageAdmin(id),
    enabled: !!id,
  });

/* ======================
   ADD IMAGE (ADMIN)
   ====================== */
export const useAddPPDTImage = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: addPPDTImage,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-ppdt-images"] });
      qc.invalidateQueries({ queryKey: ["sample-ppdt"] });
      qc.invalidateQueries({ queryKey: ["ppdt-test-images"] });
    },
  });
};

/* ======================
   UPDATE IMAGE (ADMIN)
   ====================== */
export const useUpdatePPDTImage = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updatePPDTImage,
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-ppdt-images"] });
      qc.invalidateQueries({ queryKey: ["sample-ppdt"] });
      qc.invalidateQueries({ queryKey: ["ppdt-test-images"] });
      if (variables.id) {
        qc.invalidateQueries({ queryKey: ["admin-ppdt-image", variables.id] });
      }
    },
  });
};

/* ======================
   DELETE IMAGE (ADMIN)
   ====================== */
export const useDeletePPDTImage = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deletePPDTImage,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-ppdt-images"] });
      qc.invalidateQueries({ queryKey: ["ppdt-test-images"] });
      qc.invalidateQueries({ queryKey: ["sample-ppdt"] });
    },
  });
};

/* ======================
   TOGGLE SAMPLE (ADMIN)
   ====================== */
export const useToggleSamplePPDTImage = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: toggleSamplePPDTImage,
    onSuccess: (data, variables) => {
      console.log("Toggle Sample mutation successful. Invalidating queries...");
      qc.invalidateQueries({ queryKey: ["ppdt-test-images"] });
      qc.invalidateQueries({ queryKey: ["sample-ppdt"] }); // 🔥 important
      qc.invalidateQueries({ queryKey: ["admin-ppdt-images"] });
      if (variables.id) {
        qc.invalidateQueries({ queryKey: ["admin-ppdt-image", variables.id] });
      }
    },
    onError: (error) => {
      console.error("Toggle Sample mutation failed:", error);
    },
  });
};
